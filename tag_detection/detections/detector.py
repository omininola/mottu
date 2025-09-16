import cv2
import pupil_apriltags as apriltag

class TagDetector:
    def __init__(self, yard_information):
        self.detector = apriltag.Detector(
            families="tag16h5",
            nthreads=4,
            quad_decimate=1,
            quad_sigma=0.8,
            refine_edges=1,
            decode_sharpening=0.25,
        )
        self.yard_information = yard_information

    def detect_tags(self, frame, W, H, transform):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        detections = self.detector.detect(gray)

        MIN_MARGIN = 25 # minimum confidence

        # After detection and filtering
        filtered = []
        for d in detections:
            margin = d.decision_margin
            corners = d.corners
            if margin < MIN_MARGIN or len(corners) == 0:
                continue
            filtered.append(d)

        enriched = []
        for d in filtered:
            pos = d.center
            tag_family = d.tag_family
            if isinstance(tag_family, bytes):
                tag_family = tag_family.decode("utf-8")
            
            tag_id = d.tag_id
            tag_code = f"{tag_family}_{tag_id}"

            x = int(pos[0])
            y = int(pos[1])

            if transform:
                x, y = self.image_to_yard(x, y, W, H)

            enriched.append({
                "tagCode": tag_code,
                "position": {"x": x, "y": y}
            })

        return enriched, filtered

    def image_to_yard(self, u, v, W, H):
        X0, Y0 = 0, 0        
        X1 = 256 
        Y1 = 144

        x = X0 + (u / W) * (X1 - X0)
        y = Y0 + (v / H) * (Y1 - Y0)
        return x, y