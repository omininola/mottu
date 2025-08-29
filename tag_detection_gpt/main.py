"""
python detect_apriltags.py --video 0 \
    --java_base http://localhost:8080 \
    --yard_id 1 \
    --family tagStandard41h12 \
    --tag_size_m 0.08 \
    --camera_yaml camera.yaml \
    --homography_yaml H.yaml
"""
import argparse, time, json, sys, pathlib, math
import cv2
import numpy as np
import requests
from pupil_apriltags import Detector

# ---------- utils ----------
def load_camera_yaml(path):
    fs = cv2.FileStorage(path, cv2.FILE_STORAGE_READ)
    if not fs.isOpened():
        return None, None
    K = fs.getNode("camera_matrix").mat()
    D = fs.getNode("dist_coeffs").mat()
    fs.release()
    return K, D

def load_homography(path):
    fs = cv2.FileStorage(path, cv2.FILE_STORAGE_READ)
    if not fs.isOpened():
        return None
    H = fs.getNode("H").mat()
    fs.release()
    return H

def save_homography(path, H):
    fs = cv2.FileStorage(path, cv2.FILE_STORAGE_WRITE)
    fs.write("H", H)
    fs.release()

def undistort(frame, K, D):
    if K is None: 
        return frame
    h, w = frame.shape[:2]
    newK, roi = cv2.getOptimalNewCameraMatrix(K, D, (w,h), 1, (w,h))
    return cv2.undistort(frame, K, D, None, newK)

def to_world_xy(H, px, py):
    """map pixel -> world (meters) using homography H"""
    if H is None:
        return None
    vec = np.array([px, py, 1.0], dtype=np.float64)
    w = H @ vec
    if abs(w[2]) < 1e-9:
        return None
    return float(w[0]/w[2]), float(w[1]/w[2])

# light EMA smoother per tag
class Smoother:
    def __init__(self, alpha=0.3):
        self.alpha = alpha
        self.buf = {}
    def update(self, key, val_tuple):
        if key not in self.buf:
            self.buf[key] = val_tuple
            return val_tuple
        prev = self.buf[key]
        smoothed = tuple(prev[i]*(1-self.alpha) + val_tuple[i]*self.alpha for i in range(len(val_tuple)))
        self.buf[key] = smoothed
        return smoothed

# ---------- main ----------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", default="0", help="video path or camera index")
    ap.add_argument("--java_base", required=True, help="Java API base URL (e.g. http://localhost:8080)")
    ap.add_argument("--yard_id", type=int, required=True)
    ap.add_argument("--family", default="tagStandard41h12")
    ap.add_argument("--tag_size_m", type=float, default=0.10, help="physical tag size (m)")
    ap.add_argument("--camera_yaml", default="", help="OpenCV YAML with camera_matrix & dist_coeffs")
    ap.add_argument("--homography_yaml", default="", help="YAML file with H (optional)")
    ap.add_argument("--draw", action="store_true")
    args = ap.parse_args()

    # video source
    src = 0 if args.video == "0" else args.video
    cap = cv2.VideoCapture(src)
    if not cap.isOpened():
        print("Cannot open video/camera", file=sys.stderr); sys.exit(1)

    # detector
    det = Detector(
        families=args.family,
        nthreads=2,
        quad_decimate=1.0,
        quad_sigma=0.0,
        refine_edges=True,
        decode_sharpening=0.25
    )

    # camera intrinsics (for 6D pose)
    K, D = (None, None)
    if args.camera_yaml:
        K, D = load_camera_yaml(args.camera_yaml)

    # homography (top-down XY)
    H = None
    if args.homography_yaml:
        H = load_homography(args.homography_yaml)
        if H is None:
            print("Homography not found. We can create it interactively now.")
            # Grab a frame and ask user to click 4 reference points:
            ok, frame0 = cap.read()
            if not ok:
                print("Failed to grab frame for homography", file=sys.stderr); sys.exit(2)

            pts_img = []
            def on_click(event, x, y, flags, param):
                if event == cv2.EVENT_LBUTTONDOWN and len(pts_img) < 4:
                    pts_img.append((x,y))
                    cv2.circle(param, (x,y), 6, (0,255,0), -1)

            temp = frame0.copy()
            cv2.namedWindow("click 4 corners (clockwise)")
            cv2.setMouseCallback("click 4 corners (clockwise)", on_click, temp)
            while True:
                cv2.imshow("click 4 corners (clockwise)", temp)
                if cv2.waitKey(20) & 0xFF == 27: break
                if len(pts_img) == 4:
                    break
            cv2.destroyWindow("click 4 corners (clockwise)")
            if len(pts_img) != 4:
                print("Need 4 points", file=sys.stderr); sys.exit(3)

            # ask for world coords (meters) in same order
            print("Enter world coords (meters) for the 4 points, in the same order (e.g. 0 0):")
            pts_world = []
            for i in range(4):
                val = input(f"World XY for point {i} (e.g. 0 0): ").strip().split()
                xw, yw = float(val[0]), float(val[1])
                pts_world.append([xw, yw])
            src_pts = np.array(pts_img, dtype=np.float32)
            dst_pts = np.array(pts_world, dtype=np.float32)
            H, _ = cv2.findHomography(src_pts, dst_pts, method=cv2.RANSAC)
            save_homography(args.homography_yaml, H)
            print("Homography saved to", args.homography_yaml)

    smoother_xy = Smoother(alpha=0.35)
    smoother_pose = Smoother(alpha=0.25)

    java_lookup_url = f"{args.java_base}/tags"                 # e.g. GET /tags/{code} or /tags?code=123
    java_post_detection = f"{args.java_base}/detections"       # e.g. POST /detections

    while True:
        ok, frame = cap.read()
        if not ok: break
        frame = undistort(frame, K, D)  # if calibration available

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape

        # pose params for detector (only if K provided)
        cam_params = None
        if K is not None:
            fx, fy = K[0,0], K[1,1]
            cx, cy = K[0,2], K[1,2]
            cam_params = (fx, fy, cx, cy)

        detections = det.detect(gray, estimate_tag_pose=(cam_params is not None),
                                camera_params=cam_params, tag_size=args.tag_size_m)

        events = []
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        for d in detections:
            tag_id = int(d.tag_id)
            cx, cy = float(d.center[0]), float(d.center[1])

            # World XY via homography (top-down)
            world = None
            if H is not None:
                world = to_world_xy(H, cx, cy)
                if world:
                    world = smoother_xy.update(f"xy:{tag_id}", (world[0], world[1]))

            # 6D pose if intrinsics available
            pose = None
            if cam_params is not None and hasattr(d, "pose_t") and d.pose_t is not None:
                t = d.pose_t.reshape(-1)  # meters
                R = d.pose_R              # 3x3
                # yaw (around Z), pitch, roll (optional)
                yaw = math.atan2(R[1,0], R[0,0])
                pose = smoother_pose.update(f"pose:{tag_id}", (float(t[0]), float(t[1]), float(t[2]), float(yaw)))

            # draw
            if args.draw:
                corners = d.corners.astype(int)
                for i in range(4):
                    cv2.line(frame, tuple(corners[i]), tuple(corners[(i+1)%4]), (0,255,255), 2)
                cv2.circle(frame, (int(cx), int(cy)), 4, (0,255,0), -1)
                label = f"id:{tag_id}"
                if world:
                    label += f" xy=({world[0]:.2f},{world[1]:.2f})"
                cv2.putText(frame, label, (int(cx)-20, int(cy)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (50,200,255), 2)

            event = {
                "ts": now_iso,
                "yardId": args.yard_id,
                "cameraId": "CAM_01",
                "tagFamily": args.family,
                "tagId": tag_id,
                "pixel": {"x": cx, "y": cy, "w": w, "h": h},
                "pose": None,
                "world": None
            }
            if pose:
                event["pose"] = {"tx": pose[0], "ty": pose[1], "tz": pose[2], "yaw": pose[3], "units": "m"}
            if world:
                event["world"] = {"x": world[0], "y": world[1], "units": "m"}
            events.append(event)

            # ---- OPTIONAL: enrich with bike info (Java API lookup) ----
            # pick the contract that matches your API. Two common patterns:
            # 1) GET /tags/{id} -> returns { code, bikeId, ... }
            # 2) GET /bikes/by-tag/{id}
            try:
                # Example 1: GET /tags/{id}
                r = requests.get(f"{args.java_base}/tags/{tag_id}", timeout=0.75)
                if r.status_code == 200:
                    tag_info = r.json()
                    event["bike"] = tag_info.get("bike")  # adapt to your payload
                # If your API is different, adjust the URL/fields above.
            except requests.RequestException:
                pass

            # ---- send the detection to Java (recommended) ----
            try:
                # Example: POST /detections with the event (Java decides alerts/areas, not Python)
                requests.post(java_post_detection, json=event, timeout=0.75)
            except requests.RequestException:
                pass

        if args.draw:
            cv2.imshow("AprilTags", frame)
            if cv2.waitKey(1) & 0xFF == 27:
                break

    cap.release()
    if args.draw:
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
