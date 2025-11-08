"""
stitch_single_camera.py

Simple example that:
- opens a single camera feed with cv2.VideoCapture (urlAccess)
- grabs one frame from the camera
- computes a perspective transform from camera image coords (yardPoints)
  to yard/map coords (transformPoints) — both assumed rectangular here
- warps the frame into the yard canvas (boundary is assumed rectangular)
- displays and optionally saves the stitched result

Replace the example urlAccess with a real camera url (rtsp://, http://, file path, or numeric webcam id).
Requires: opencv-python, numpy, Pillow (optional if you want to save with PIL)
pip install opencv-python numpy pillow
"""
import time
import math
from typing import Tuple, Optional

import cv2
import numpy as np
from PIL import Image


def _scale_src_points_to_image(src_pts: np.ndarray, img_w: int, img_h: int) -> np.ndarray:
    xs = src_pts[:, 0]
    ys = src_pts[:, 1]
    min_x, max_x = float(xs.min()), float(xs.max())
    min_y, max_y = float(ys.min()), float(ys.max())
    src_w = max_x - min_x
    src_h = max_y - min_y
    if src_w <= 1e-6 or src_h <= 1e-6:
        # fallback to full image corners
        return np.array([[0.0, 0.0], [img_w - 1.0, 0.0], [img_w - 1.0, img_h - 1.0], [0.0, img_h - 1.0]], dtype=np.float32)
    scale_x = img_w / src_w
    scale_y = img_h / src_h
    scaled = src_pts.copy().astype(np.float32)
    scaled[:, 0] = (scaled[:, 0] - min_x) * scale_x
    scaled[:, 1] = (scaled[:, 1] - min_y) * scale_y
    return scaled


def stitch_single_camera_frame(yard_data: dict,
                               camera_index: int = 0,
                               attempts: int = 5,
                               wait_between_attempts: float = 0.5,
                               show_window: bool = True,
                               save_path: Optional[str] = None) -> Tuple[np.ndarray, np.ndarray]:
    """
    Grab one frame from a single camera (by index in yard_data['cameras']), warp it to the yard canvas
    and return (final_bgr_image, alpha_mask). final_bgr_image is a HxWx3 uint8 BGR image (OpenCV format).
    alpha_mask is HxW uint8 (0/255 inside yard & covered).

    Args:
      yard_data: dictionary with 'boundary' and 'cameras' like your API payload.
      camera_index: which camera to use (default 0).
      attempts: how many tries to read a frame from VideoCapture before giving up.
      wait_between_attempts: seconds between read attempts.
      show_window: if True, show result in an OpenCV window (press any key to close).
      save_path: optional PNG path to save RGBA result.

    Returns:
      final_bgr, alpha_mask
    """
    # Validate data
    cameras = yard_data.get("cameras", [])
    if not cameras:
        raise ValueError("No cameras in yard_data")
    if camera_index < 0 or camera_index >= len(cameras):
        raise IndexError("camera_index out of range")

    cam = cameras[camera_index]
    url = cam.get("urlAccess")
    if url is None:
        raise ValueError(f"Camera {cam.get('id')} missing urlAccess")

    # open capture
    cap = cv2.VideoCapture(url)
    if not cap.isOpened():
        # sometimes numeric strings are used, try converting to int
        try:
            cap.release()
            cap = cv2.VideoCapture(int(url))
        except Exception:
            pass

    if not cap.isOpened():
        raise RuntimeError(f"Could not open VideoCapture for urlAccess={url}")

    frame = None
    for i in range(attempts):
        ret, f = cap.read()
        if ret and f is not None:
            frame = f
            break
        time.sleep(wait_between_attempts)
    cap.release()

    if frame is None:
        raise RuntimeError(f"Failed to read frame from camera {cam.get('id')} (url={url})")

    img_h, img_w = frame.shape[:2]

    # compute canvas from boundary (assume rectangular)
    boundary = yard_data.get("boundary")
    if not boundary or len(boundary) < 4:
        raise ValueError("boundary must be provided and be rectangular with 4 points for this simple example")

    bx = np.array([p["x"] for p in boundary], dtype=np.float32)
    by = np.array([p["y"] for p in boundary], dtype=np.float32)
    min_x = float(bx.min()); min_y = float(by.min())
    max_x = float(bx.max()); max_y = float(by.max())
    canvas_w = int(math.ceil(max_x - min_x))
    canvas_h = int(math.ceil(max_y - min_y))
    if canvas_w <= 0 or canvas_h <= 0:
        raise ValueError("Invalid yard boundary extents")

    # get source and destination points (we expect rectangles, keep order consistent)
    yard_pts = cam.get("yardPoints")
    transform_pts = cam.get("transformPoints")
    if not yard_pts or not transform_pts or len(yard_pts) < 4 or len(transform_pts) < 4:
        raise ValueError("This simple example expects 4 yardPoints and 4 transformPoints (rectangles)")

    src_pts = np.array([[p["x"], p["y"]] for p in yard_pts], dtype=np.float32)
    dst_pts = np.array([[p["x"] - min_x, p["y"] - min_y] for p in transform_pts], dtype=np.float32)

    # scale src pts to actual image pixel coords
    src_scaled = _scale_src_points_to_image(src_pts, img_w, img_h)

    # ensure 4 points (getPerspectiveTransform requires 4)
    if src_scaled.shape[0] < 4 or dst_pts.shape[0] < 4:
        raise ValueError("Need 4 points for perspective transform in this simple example")

    src4 = src_scaled[:4].astype(np.float32)
    dst4 = dst_pts[:4].astype(np.float32)

    # compute homography and warp
    H = cv2.getPerspectiveTransform(src4, dst4)
    warped = cv2.warpPerspective(frame, H, (canvas_w, canvas_h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))

    # make yard mask (rectangle)
    # assume boundary rect aligned with provided transform_points; create mask from dst points
    dst_points_int = np.array(dst4, dtype=np.int32)
    yard_mask = np.zeros((canvas_h, canvas_w), dtype=np.uint8)
    cv2.fillConvexPoly(yard_mask, dst_points_int, 255)

    # mask coverage where warped has any non-zero (note: black pixels from border may coincide with valid data;
    # because source is rectangular and transforms fill the rect, we can use yard_mask for coverage)
    covered_mask = (yard_mask > 0).astype(np.uint8) * 255

    # build final BGR and alpha
    final_bgr = warped.copy()
    alpha = covered_mask.copy()  # 255 inside yard, 0 outside

    # optionally save as RGBA PNG
    if save_path:
        final_rgb = cv2.cvtColor(final_bgr, cv2.COLOR_BGR2RGB)
        rgba = np.dstack([final_rgb, alpha])
        pil = Image.fromarray(rgba, mode="RGBA")
        pil.save(save_path, format="PNG")

    if show_window:
        # display result: BGR image with alpha visualization
        vis = final_bgr.copy()
        # overlay a red outline of the yard rect
        cv2.polylines(vis, [dst_points_int], isClosed=True, color=(0, 0, 255), thickness=2)
        cv2.imshow("Stitched (single camera)", vis)
        print("Press any key on the image window to continue...")
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    return final_bgr, alpha


if __name__ == "__main__":
    # Example yard_data - replace urlAccess with a usable camera URL or integer webcam id (0,1,..)
    example_data = {
        'id': 1,
        'cameras': [
            {
                'id': 5,
                # Example: local webcam: 0  OR file path like "test_video.mp4" OR rtsp URL
                'urlAccess': 0,
                'yardPoints': [{'x': 0.0, 'y': 0.0}, {'x': 320.0, 'y': 0.0}, {'x': 320.0, 'y': 240.0}, {'x': 0.0, 'y': 240.0}],
                'transformPoints': [{'x': 0.0, 'y': 0.0}, {'x': 640.0, 'y': 0.0}, {'x': 640.0, 'y': 480.0}, {'x': 0.0, 'y': 480.0}],
            }
        ],
        'boundary': [{'x': 0.0, 'y': 0.0}, {'x': 640.0, 'y': 0.0}, {'x': 640.0, 'y': 480.0}, {'x': 0.0, 'y': 480.0}]
    }

    out_bgr, out_alpha = stitch_single_camera_frame(example_data, camera_index=0, show_window=True, save_path="stitched_single.png")
    print("Saved stitched_single.png")