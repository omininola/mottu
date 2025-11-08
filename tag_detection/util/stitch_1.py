import io
import math
import requests
import numpy as np
import cv2
from PIL import Image

def stitch_yard_from_api(yard_data, save_path=None, blend="average", timeout=10):
    """
    yard_data: dict like the one you provided
    save_path: optional path to save stitched PNG
    blend: "average" (default) or "max" or "overwrite" (later cameras overwrite earlier)
    timeout: requests timeout in seconds

    Returns: (PIL.Image.Image, png_bytes)
    """
    # 1) Compute canvas bounds from boundary
    boundary = yard_data.get("boundary", [])
    if not boundary:
        raise ValueError("No boundary found in yard_data")
    xs = [p["x"] for p in boundary]
    ys = [p["y"] for p in boundary]
    min_x, max_x = math.floor(min(xs)), math.ceil(max(xs))
    min_y, max_y = math.floor(min(ys)), math.ceil(max(ys))
    width = int(max_x - min_x)
    height = int(max_y - min_y)
    if width <= 0 or height <= 0:
        raise ValueError("Invalid boundary extents: width or height <= 0")

    # Accumulators: float for averaging, and weight mask
    canvas_acc = np.zeros((height, width, 3), dtype=np.float32)
    weight = np.zeros((height, width), dtype=np.float32)
    # For overwrite mode, keep a boolean drawn mask
    drawn_mask = np.zeros((height, width), dtype=np.uint8)

    cameras = yard_data.get("cameras", [])
    if not cameras:
        # nothing to do; return blank image
        blank = Image.new("RGB", (width, height), (0, 0, 0))
        png_bytes = pil_to_png_bytes(blank)
        if save_path:
            blank.save(save_path, format="PNG")
        return blank, png_bytes

    for cam in cameras:
        url = cam.get("urlAccess")
        if not url:
            # skip or log
            continue

        # Fetch image bytes
        try:
            resp = requests.get(url, timeout=timeout)
            resp.raise_for_status()
            img_arr = np.frombuffer(resp.content, dtype=np.uint8)
            img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)  # BGR
            if img is None:
                # can't decode, skip
                continue
        except Exception as e:
            # Could not fetch or decode — skip camera (log if you have logging)
            # print(f"Warning: failed to fetch/parse image for camera {cam.get('id')}: {e}")
            continue

        img_h, img_w = img.shape[:2]

        # Source points come from yardPoints (camera image coordinates)
        yard_pts = cam.get("yardPoints")
        if not yard_pts:
            continue
        src_pts = np.array([[p["x"], p["y"]] for p in yard_pts], dtype=np.float32)

        # If the yardPoints extents don't match actual image size, scale them:
        src_min_x = float(np.min(src_pts[:, 0]))
        src_min_y = float(np.min(src_pts[:, 1]))
        src_max_x = float(np.max(src_pts[:, 0]))
        src_max_y = float(np.max(src_pts[:, 1]))
        src_w = src_max_x - src_min_x
        src_h = src_max_y - src_min_y
        if src_w <= 0 or src_h <= 0:
            # fallback: use image corners
            src_pts_scaled = np.array([[0, 0], [img_w-1, 0], [img_w-1, img_h-1], [0, img_h-1]], dtype=np.float32)
        else:
            scale_x = img_w / src_w
            scale_y = img_h / src_h
            src_pts_scaled = src_pts.copy()
            # Normalize origin if needed then scale
            src_pts_scaled[:, 0] = (src_pts[:, 0] - src_min_x) * scale_x
            src_pts_scaled[:, 1] = (src_pts[:, 1] - src_min_y) * scale_y

        # Destination points: transformPoints in yard coords; convert to canvas-local coordinates by subtracting min_x,min_y
        transform_pts = cam.get("transformPoints")
        if not transform_pts:
            continue
        dst_pts = np.array([[p["x"] - min_x, p["y"] - min_y] for p in transform_pts], dtype=np.float32)

        if src_pts_scaled.shape != (4, 2) or dst_pts.shape != (4, 2):
            # getPerspectiveTransform requires 4 points
            continue

        # Compute homography
        try:
            H = cv2.getPerspectiveTransform(src_pts_scaled, dst_pts)
        except Exception as e:
            # fallback: skip
            continue

        # Warp camera image into canvas coordinate system
        warped = cv2.warpPerspective(img, H, (width, height), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))

        # Create a mask of where warped pixels exist
        src_mask = np.ones((img_h, img_w), dtype=np.uint8) * 255
        warped_mask = cv2.warpPerspective(src_mask, H, (width, height), flags=cv2.INTER_NEAREST, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        mask_bool = warped_mask > 0  # True where camera contributed

        if blend == "average":
            # Add to accumulator, increment weight
            # convert warped to float
            warped_f = warped.astype(np.float32)
            # broadcasting mask to 3 channels
            mask3 = np.repeat(mask_bool[:, :, None], 3, axis=2)
            canvas_acc[mask3] += warped_f[mask3]
            weight[mask_bool] += 1.0
        elif blend == "max":
            # choose per-channel maximum
            # For pixels where mask is True, set canvas to max(current, warped)
            # But canvas_acc currently float; convert to uint8 view temporarily
            canvas_cur = np.clip(canvas_acc, 0, 255).astype(np.uint8)
            canvas_cur[mask_bool] = np.maximum(canvas_cur[mask_bool], warped[mask_bool])
            canvas_acc = canvas_cur.astype(np.float32)
            weight[mask_bool] += 1.0
        elif blend == "overwrite":
            # later cameras overwrite previous
            canvas_acc[mask_bool] = warped[mask_bool].astype(np.float32)
            drawn_mask[mask_bool] = 1
            weight[mask_bool] = 1.0
        else:
            raise ValueError("Unknown blend mode: " + str(blend))

    # Finalize image
    final = np.zeros((height, width, 3), dtype=np.uint8)
    if blend == "average":
        # avoid divide by zero
        nz = weight > 0
        # prepare broadcasting
        weight3 = np.where(nz, weight, 1.0)[:, :, None]
        averaged = canvas_acc / weight3
        averaged[~nz] = 0
        final = np.clip(averaged, 0, 255).astype(np.uint8)
    else:
        final = np.clip(canvas_acc, 0, 255).astype(np.uint8)

    # Convert BGR -> RGB for PIL
    final_rgb = cv2.cvtColor(final, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(final_rgb)

    # Optionally save
    png_bytes = pil_to_png_bytes(pil_image)
    if save_path:
        pil_image.save(save_path, format="PNG")

    return pil_image, png_bytes

def pil_to_png_bytes(pil_img):
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return buf.getvalue()


# Example usage:
if __name__ == "__main__":
    example_data = {
      'id': 1,
      'cameras': [
        {'id': 5, 'urlAccess': 'http://example.com/cam5.png', 'transformPoints': [{'x': 60.0, 'y': 0.0}, {'x': 150.0, 'y': 0.0}, {'x': 150.0, 'y': 20.0}, {'x': 60.0, 'y': 20.0}], 'yardPoints': [{'x': 60.0, 'y': 0.0}, {'x': 150.0, 'y': 0.0}, {'x': 150.0, 'y': 20.0}, {'x': 60.0, 'y': 20.0}]},
        # add other cameras...
      ],
      'boundary': [{'x': 0.0, 'y': 0.0}, {'x': 256.0, 'y': 0.0}, {'x': 256.0, 'y': 144.0}, {'x': 0.0, 'y': 144.0}]
    }

    # stitched_img, png_bytes = stitch_yard_from_api(example_data, save_path="stitched_yard.png", blend="average")
    # stitched_img.show()
    pass