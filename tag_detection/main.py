import cv2
import time
import os
import numpy as np

from flask import Flask, Response, request
from detections.detector import TagDetector
from communication.client import JavaAPIClient
from draw.draw import draw_tags

app = Flask(__name__)

VIDEO_CAPTURE_ID = int(os.getenv("VIDEO_CAPTURE_ID", "0"))
JAVA_HOST = os.getenv("JAVA_HOST", "server")
JAVA_PORT = os.getenv("JAVA_PORT", "8080")
YARD_ID = int(os.getenv("YARD_ID", "1"))
UPDATE_TAG_INTERVAL = int(os.getenv("UPDATE_TAG_INTERVAL", "10"))

java_client = JavaAPIClient(f"http://{JAVA_HOST}:{JAVA_PORT}/", YARD_ID)
yard_information = java_client.get_yard_information()

detector = TagDetector(yard_information)

def gen_frames():
    cap = cv2.VideoCapture(VIDEO_CAPTURE_ID)
    
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    send_interval = UPDATE_TAG_INTERVAL
    last_sent = time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        enriched, detections = detector.detect_tags(frame, W, H, True)

        # Only send to Java API every 10 seconds
        now = time.time()
        if (now - last_sent) > send_interval:
            payload = { "tags": enriched }
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

@app.route('/detect', methods=['POST'])
def detect():
    file = request.files['file']
    image_bytes = file.read()

    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    detections, _ = detector.detect_tags(image, 1, 1, False)

    if detections:
        return Response(detections[0]['tagCode'], status=200)
    else:
        return Response("Unable to find tag", status=404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)