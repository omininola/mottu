import cv2
import time
import os

from flask import Flask, Response
from detections.detector import TagDetector
from communication.client import JavaAPIClient
from draw.draw import draw_tags

app = Flask(__name__)

VIDEO_CAPTURE_ID = int(os.getenv("VIDEO_CAPTURE_ID", "0"))
JAVA_HOST = os.getenv("JAVA_HOST", "server")
JAVA_PORT = os.getenv("JAVA_PORT", "8080")
YARD_ID = int(os.getenv("YARD_ID", "1"))
UPDATE_TAG_INTERVAL = int(os.getenv("UPDATE_TAG_INTERVAL", "10"))

def gen_frames():
    cap = cv2.VideoCapture(VIDEO_CAPTURE_ID)
    detector = TagDetector()
    java_client = JavaAPIClient(f"http://{JAVA_HOST}:{JAVA_PORT}/", YARD_ID)
    
    send_interval = UPDATE_TAG_INTERVAL
    last_sent = time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        detections_parsed_for_java, detections = detector.detect_tags(frame)

        # Only send to Java API every 10 seconds
        now = time.time()
        if detections_parsed_for_java and (now - last_sent) > send_interval:
            payload = {"tags": detections_parsed_for_java}
            response = java_client.send_detections(payload)
            last_sent = now  # reset timer

        # Step 4: Draw overlay
        frame = draw_tags(frame, detections)

        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )

    cap.release()

@app.route('/video')
def video():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)