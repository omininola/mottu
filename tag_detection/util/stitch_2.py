"""
stitch_yard.py

Flexible yard camera stitching:
- handles arbitrary yard boundary polygons
- supports camera correspondences with 1..N points with fallbacks:
    >=4 -> homography (RANSAC)
    3   -> affine
    2   -> similarity (scale+rot+trans)
    1   -> translation
- scales camera yardPoints to actual image resolution if needed
- blending modes: "average", "overwrite", "max"
- outputs RGBA PIL.Image; outside yard polygon is transparent by default

Dependencies:
pip install opencv-python numpy requests pillow
"""

import io
import math
import warnings
from typing import Optional, Tuple, List

import numpy as np
import cv2
import requests
from PIL import Image


def pil_to_png_bytes(pil_img: Image.Image) -> bytes:
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return buf.getvalue()


def _scale_src_points_to_image(src_pts: np.ndarray, img_w: int, img_h: int) -> np.ndarray:
    """
    src_pts: (N,2) in camera yard coordinates (may not match actual image resolution).
    Scales them to actual image pixel coordinates by mapping src_bbox -> image extents.
    If src bbox area is zero or invalid, return image corners instead.
    """
    xs = src_pts[:, 0]
    ys = src_pts[:, 1]
    min_x, max_x = float(xs.min()), float(xs.max())
    min_y, max_y = float(ys.min()), float(ys.max())
    src_w = max_x - min_x
    src_h = max_y - min_y
    if src_w <= 1e-6 or src_h <= 1e-6:
        # fallback to image corners
        return np.array([[0.0, 0.0], [img_w - 1.0, 0.0], [img_w - 1.0, img_h - 1.0], [0.0, img_h - 1.0]], dtype=np.float32)
    scale_x = img_w / src_w
    scale_y = img_h / src_h
    scaled = src_pts.copy().astype(np.float32)
    scaled[:, 0] = (scaled[:, 0] - min_x) * scale_x
    scaled[:, 1] = (scaled[:, 1] - min_y) * scale_y
    return scaled


def _similarity_from_2pts(src2: np.ndarray, dst2: np.ndarray) -> np.ndarray:
    """
    Compute 2x3 affine matrix that maps src2 -> dst2 using scale+rotation+translation.
    src2 and dst2 are (2,2) arrays.
    Returns 2x3 float32 matrix suitable for cv2.warpAffine.
    """
    p0 = src2[0].astype(np.float64)
    p1 = src2[1].astype(np.float64)
    q0 = dst2[0].astype(np.float64)
    q1 = dst2[1].astype(np.float64)
    v = p1 - p0
    u = q1 - q0
    norm_v = np.hypot(v[0], v[1])
    norm_u = np.hypot(u[0], u[1])
    if norm_v < 1e-9:
        # degenerate; fallback to translation
        A = np.array([[1.0, 0.0, q0[0] - p0[0]],
                      [0.0, 1.0, q0[1] - p0[1]]], dtype=np.float32)
        return A
    s = norm_u / norm_v
    angle_v = math.atan2(v[1], v[0])
    angle_u = math.atan2(u[1], u[0])
    theta = angle_u - angle_v
    cos_t = math.cos(theta)
    sin_t = math.sin(theta)
    R = s * np.array([[cos_t, -sin_t],
                      [sin_t, cos_t]], dtype=np.float64)
    t = q0 - (R @ p0)
    A = np.zeros((2, 3), dtype=np.float32)
    A[0, 0] = float(R[0, 0])
    A[0, 1] = float(R[0, 1])
    A[1, 0] = float(R[1, 0])
    A[1, 1] = float(R[1, 1])
    A[0, 2] = float(t[0])
    A[1, 2] = float(t[1])
    return A


def stitch_yard_from_api(
    yard_data: dict,
    save_path: Optional[str] = None,
    output_size: Optional[Tuple[int, int]] = None,
    blend: str = "average",
    timeout: float = 10.0,
    opaque_where_no_coverage: bool = False
) -> Tuple[Image.Image, bytes]:
    """
    Stitches camera images described by yard_data.

    yard_data: dict with keys:
      - 'boundary': list of {'x':..., 'y':...} polygon in yard coords
      - 'cameras': list of cameras, each with:
          - 'urlAccess': URL to download the camera image
          - 'yardPoints': list of points in camera-image coordinate system
          - 'transformPoints': list of points in yard coordinates where those yardPoints map to

    save_path: optional file path to save PNG
    output_size: optional (out_w, out_h) desired output pixel dimensions. If omitted, use
                 1 unit in yard coords = 1 pixel.
    blend: "average" (default), "overwrite", or "max"
    opaque_where_no_coverage: if True, pixels inside yard boundary but without camera coverage will be opaque black.
                             If False (default), they remain transparent.

    Returns (PIL.Image RGBA, png_bytes)
    """
    # Validate boundary
    boundary = yard_data.get("boundary", [])
    if not boundary:
        raise ValueError("yard_data must include a 'boundary' polygon")

    # compute bounding box of yard boundary
    bx = np.array([p["x"] for p in boundary], dtype=np.float64)
    by = np.array([p["y"] for p in boundary], dtype=np.float64)
    min_x = float(bx.min()); min_y = float(by.min())
    max_x = float(bx.max()); max_y = float(by.max())
    bbox_w = max_x - min_x
    bbox_h = max_y - min_y
    if bbox_w <= 0 or bbox_h <= 0:
        raise ValueError("Invalid yard boundary extents")

    # compute output scale
    if output_size is not None:
        out_w, out_h = int(output_size[0]), int(output_size[1])
        if out_w <= 0 or out_h <= 0:
            raise ValueError("output_size must be positive integers")
        scale_x = out_w / bbox_w
        scale_y = out_h / bbox_h
        canvas_w, canvas_h = out_w, out_h
    else:
        # 1 yard unit = 1 pixel, round up
        scale_x = 1.0
        scale_y = 1.0
        canvas_w = int(math.ceil(bbox_w))
        canvas_h = int(math.ceil(bbox_h))

    if canvas_w <= 0 or canvas_h <= 0:
        raise ValueError("Calculated canvas size invalid")

    # accumulators
    canvas_acc = np.zeros((canvas_h, canvas_w, 3), dtype=np.float64)  # float accumulative RGB (BGR from cv)
    weight = np.zeros((canvas_h, canvas_w), dtype=np.float64)         # count of contributors per pixel

    # create yard mask (which pixels are inside boundary polygon)
    boundary_pts = np.array([[(p["x"] - min_x) * scale_x, (p["y"] - min_y) * scale_y] for p in boundary], dtype=np.int32)
    yard_mask = np.zeros((canvas_h, canvas_w), dtype=np.uint8)
    cv2.fillPoly(yard_mask, [boundary_pts], 255)  # 255 inside yard

    cameras = yard_data.get("cameras", [])
    if not cameras:
        # nothing to stitch; return blank transparent image sized to canvas
        empty = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        png = pil_to_png_bytes(empty)
        if save_path:
            empty.save(save_path, format="PNG")
        return empty, png

    session = requests.Session()

    for cam in cameras:
        url = cam.get("urlAccess")
        if not url:
            warnings.warn(f"Camera {cam.get('id')} missing urlAccess, skipping.")
            continue

        try:
            resp = session.get(url, timeout=timeout)
            resp.raise_for_status()
            data = np.frombuffer(resp.content, dtype=np.uint8)
            # try to decode with alpha if present
            img = cv2.imdecode(data, cv2.IMREAD_UNCHANGED)
            if img is None:
                warnings.warn(f"Failed to decode image for camera {cam.get('id')}, skipping.")
                continue
        except Exception as e:
            warnings.warn(f"Failed to fetch camera {cam.get('id')} at {url}: {e}")
            continue

        # normalize to BGR and mask
        if img.ndim == 3 and img.shape[2] == 4:
            # BGRA -> BGR and alpha mask
            bgr = img[:, :, :3]
            src_alpha = img[:, :, 3]
            src_mask = (src_alpha > 0).astype(np.uint8) * 255
        elif img.ndim == 3 and img.shape[2] == 3:
            bgr = img
            src_mask = np.ones((img.shape[0], img.shape[1]), dtype=np.uint8) * 255
        else:
            # grayscale
            bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            src_mask = np.ones((bgr.shape[0], bgr.shape[1]), dtype=np.uint8) * 255

        img_h, img_w = bgr.shape[:2]

        yard_pts = cam.get("yardPoints")
        transform_pts = cam.get("transformPoints")
        if not yard_pts or not transform_pts:
            warnings.warn(f"Camera {cam.get('id')} missing yardPoints or transformPoints, skipping.")
            continue

        src_pts = np.array([[p["x"], p["y"]] for p in yard_pts], dtype=np.float32)
        dst_pts = np.array([[p["x"] - min_x, p["y"] - min_y] for p in transform_pts], dtype=np.float32)
        # map destination to canvas pixel coords
        dst_pts[:, 0] = dst_pts[:, 0] * scale_x
        dst_pts[:, 1] = dst_pts[:, 1] * scale_y

        # scale source points to actual image pixels
        src_scaled = _scale_src_points_to_image(src_pts, img_w, img_h)

        n = min(src_scaled.shape[0], dst_pts.shape[0])
        if n < 1:
            warnings.warn(f"Camera {cam.get('id')} has no matching point pairs, skipping.")
            continue

        # ensure we use matching first n points
        src_use = src_scaled[:n].astype(np.float32)
        dst_use = dst_pts[:n].astype(np.float32)

        warped = None
        warped_mask = None

        try:
            if n >= 4:
                # homography (robust)
                H, inliers = cv2.findHomography(src_use, dst_use, cv2.RANSAC, ransacReprojThreshold=5.0)
                if H is None:
                    warnings.warn(f"findHomography failed for camera {cam.get('id')}, skipping.")
                    continue
                warped = cv2.warpPerspective(bgr, H, (canvas_w, canvas_h),
                                             flags=cv2.INTER_LINEAR,
                                             borderMode=cv2.BORDER_CONSTANT,
                                             borderValue=(0, 0, 0))
                warped_mask = cv2.warpPerspective(src_mask, H, (canvas_w, canvas_h),
                                                  flags=cv2.INTER_NEAREST,
                                                  borderMode=cv2.BORDER_CONSTANT,
                                                  borderValue=0)
            elif n == 3:
                A = cv2.getAffineTransform(src_use[:3], dst_use[:3])  # 2x3
                warped = cv2.warpAffine(bgr, A, (canvas_w, canvas_h),
                                        flags=cv2.INTER_LINEAR,
                                        borderMode=cv2.BORDER_CONSTANT,
                                        borderValue=(0, 0, 0))
                warped_mask = cv2.warpAffine(src_mask, A, (canvas_w, canvas_h),
                                             flags=cv2.INTER_NEAREST,
                                             borderMode=cv2.BORDER_CONSTANT,
                                             borderValue=0)
            elif n == 2:
                A = _similarity_from_2pts(src_use[:2], dst_use[:2])  # 2x3
                warped = cv2.warpAffine(bgr, A, (canvas_w, canvas_h),
                                        flags=cv2.INTER_LINEAR,
                                        borderMode=cv2.BORDER_CONSTANT,
                                        borderValue=(0, 0, 0))
                warped_mask = cv2.warpAffine(src_mask, A, (canvas_w, canvas_h),
                                             flags=cv2.INTER_NEAREST,
                                             borderMode=cv2.BORDER_CONSTANT,
                                             borderValue=0)
            elif n == 1:
                # translation only
                p0 = src_use[0]
                q0 = dst_use[0]
                tx = q0[0] - p0[0]
                ty = q0[1] - p0[1]
                A = np.array([[1.0, 0.0, tx], [0.0, 1.0, ty]], dtype=np.float32)
                warped = cv2.warpAffine(bgr, A, (canvas_w, canvas_h),
                                        flags=cv2.INTER_LINEAR,
                                        borderMode=cv2.BORDER_CONSTANT,
                                        borderValue=(0, 0, 0))
                warped_mask = cv2.warpAffine(src_mask, A, (canvas_w, canvas_h),
                                             flags=cv2.INTER_NEAREST,
                                             borderMode=cv2.BORDER_CONSTANT,
                                             borderValue=0)
            else:
                # should not reach here
                continue
        except Exception as e:
            warnings.warn(f"Transform/warp failed for camera {cam.get('id')}: {e}")
            continue

        if warped is None or warped_mask is None:
            continue

        mask_bool = warped_mask.astype(bool)

        if blend == "average":
            # accumulate
            # convert warped BGR to float64 and add where mask True
            warped_f = warped.astype(np.float64)
            # add per-channel where contributed
            mask3 = np.repeat(mask_bool[:, :, np.newaxis], 3, axis=2)
            canvas_acc[mask3] += warped_f[mask3]
            weight[mask_bool] += 1.0
        elif blend == "max":
            cur = canvas_acc.astype(np.uint8)
            # apply maximum where masked: compare cur (uint8) with warped (uint8)
            # convert to uint8 for pixel-wise max
            cur_uint8 = np.clip(cur, 0, 255).astype(np.uint8)
            cur_uint8[mask_bool] = np.maximum(cur_uint8[mask_bool], warped[mask_bool])
            canvas_acc = cur_uint8.astype(np.float64)
            weight[mask_bool] += 1.0
        elif blend == "overwrite":
            canvas_acc[mask3] = warped.astype(np.float64)[mask3]
            weight[mask_bool] = 1.0
        else:
            raise ValueError(f"Unknown blend mode: {blend}")

    # finalize final image
    final_bgr = np.zeros((canvas_h, canvas_w, 3), dtype=np.uint8)
    if blend == "average":
        nz = weight > 0
        if nz.any():
            # avoid division by zero, do per-channel divide
            denom = weight.copy()
            denom[denom == 0] = 1.0
            denom3 = denom[:, :, np.newaxis]
            averaged = canvas_acc / denom3
            averaged[~(weight > 0)] = 0
            final_bgr = np.clip(averaged, 0, 255).astype(np.uint8)
        else:
            final_bgr[:] = 0
    else:
        final_bgr = np.clip(canvas_acc, 0, 255).astype(np.uint8)

    # convert BGR -> RGB for PIL
    final_rgb = cv2.cvtColor(final_bgr, cv2.COLOR_BGR2RGB)

    # create alpha channel:
    # - primary alpha is yard_mask (inside yard polygon)
    # - if opaque_where_no_coverage is False, set alpha=255 only where yard_mask AND weight>0 (covered areas)
    # - if opaque_where_no_coverage is True, set alpha=255 where yard_mask (even if uncovered)
    if opaque_where_no_coverage:
        alpha = (yard_mask > 0).astype(np.uint8) * 255
    else:
        alpha = ((yard_mask > 0) & (weight > 0)).astype(np.uint8) * 255

    # make RGBA image
    rgba = np.dstack([final_rgb, alpha])
    pil_image = Image.fromarray(rgba, mode="RGBA")

    png_bytes = pil_to_png_bytes(pil_image)
    if save_path:
        pil_image.save(save_path, format="PNG")

    return pil_image, png_bytes


# Example usage
if __name__ == "__main__":
    # Replace urlAccess values with real accessible image URLs when you test.
    example_data = {
        'id': 1,
        'cameras': [
            {
                'id': 5,
                'urlAccess': 'https://example.com/cam5.png',
                'transformPoints': [{'x': 60.0, 'y': 0.0}, {'x': 150.0, 'y': 0.0}, {'x': 150.0, 'y': 20.0}, {'x': 60.0, 'y': 20.0}],
                'yardPoints': [{'x': 60.0, 'y': 0.0}, {'x': 150.0, 'y': 0.0}, {'x': 150.0, 'y': 20.0}, {'x': 60.0, 'y': 20.0}]
            },
            # add more cameras...
        ],
        'boundary': [{'x': 0.0, 'y': 0.0}, {'x': 256.0, 'y': 0.0}, {'x': 256.0, 'y': 144.0}, {'x': 0.0, 'y': 144.0}]
    }

    # stitched, png = stitch_yard_from_api(example_data, save_path="stitched.png", output_size=(1024, 576), blend="average")
    # stitched.show()
    pass