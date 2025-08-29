import cv2
from detections.detector import TagDetector
from positions.estimator import PositionEstimator
from communication.client import JavaAPIClient

def main():
    cap = cv2.VideoCapture(0)  # or video file
    detector = TagDetector()
    java_client = JavaAPIClient("http://localhost:8080/", 1)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Step 1: Detect tags
        detections = detector.detect_tags(frame)

        # Step 2: Normalize positions
        estimator = PositionEstimator(frame.shape[1], frame.shape[0])
        enriched = [estimator.normalize_position(d) for d in detections]

        # Step 3: Send to Java API
        if enriched:
            response = java_client.send_detections(enriched)
            print("Java API Response:", response)

        # Visualization (optional)
        for d in detections:
            cx, cy = map(int, d["center"])
            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)
            cv2.putText(frame, f"ID: {d['id']}", (cx+10, cy), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)

        cv2.imshow("AprilTag Detection", frame)
        if cv2.waitKey(1) == 27:  # ESC key
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
