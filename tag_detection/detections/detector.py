import cv2
import pupil_apriltags as apriltag

class TagDetector:
    def __init__(self):
        self.detector = apriltag.Detector(
            families="tag16h5",
            nthreads=1,
            quad_decimate=1,
            quad_sigma=0,
            refine_edges=1,
            decode_sharpening=0.25,
        )

    def detect_tags(self, frame):
        """
        Detect AprilTags in a frame.
        Returns a list of detections with their ID and pixel coordinates.
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        detections = self.detector.detect(gray)

        results = []
        for d in detections:
            results.append({
                "id": d.tag_id,
                "center": (float(d.center[0]), float(d.center[1])),
                "corners": [(float(x), float(y)) for (x, y) in d.corners]
            })
        return results
