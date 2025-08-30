import cv2
from flask import Flask, Response

from detections.detector import TagDetector
from positions.estimator import PositionEstimator
from communication.client import JavaAPIClient

app = Flask(__name__)

YARD_ID = 1

def gen_frames():
    cap = cv2.VideoCapture(0)
    detector = TagDetector()
    java_client = JavaAPIClient("http://server:8080/", YARD_ID)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Step 1: Detect tags
        detections = detector.detect_tags(frame)

        print("Detections: ", detections)

        # Step 2: Normalize positions
        estimator = PositionEstimator(frame.shape[1], frame.shape[0])
        enriched = [estimator.normalize_position(d) for d in detections]

        print("Enriched: ", enriched)

        # Step 3: Send to Java API (disabled by 'and False')
        if enriched and False:
            response = java_client.send_detections(enriched)
            print("Java API Response:", response)

        # Visualization (optional)
        for d in detections:
            cx, cy = map(int, d["center"])
            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)
            cv2.putText(frame, f"ID: {d['id']}", (cx+10, cy), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)

        _, buffer = cv2.imencode(".jpg", frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()  # Always release!

@app.route('/video')
def video():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)