import cv2
import time
import os
import numpy as np

from flask import Flask, Response, request
from detections.detector import TagDetector
from communication.client import JavaAPIClient
from draw.draw import draw_tags

app = Flask(__name__)

# Definindo algumas váriaveis globais
VIDEO_CAPTURE_ID = int(os.getenv("VIDEO_CAPTURE_ID", "0"))
JAVA_HOST = os.getenv("JAVA_HOST", "server")
JAVA_PORT = os.getenv("JAVA_PORT", "8080")
YARD_ID = int(os.getenv("YARD_ID", "1"))
UPDATE_TAG_INTERVAL = int(os.getenv("UPDATE_TAG_INTERVAL", "10"))

java_client = JavaAPIClient(f"http://{JAVA_HOST}:{JAVA_PORT}", YARD_ID)
yard_info = java_client.get_yard_information()

detector = TagDetector(yard_info)

def gen_frames():
    """
    Responsável por resgatar a imagem da câmera, detectar as tags e enviar as tags para a API de Java
    """
    cap = cv2.VideoCapture(VIDEO_CAPTURE_ID)
    
    # Widht e Height da captura
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    send_interval = UPDATE_TAG_INTERVAL
    last_sent = time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Tags detectadas
        enriched, detections = detector.detect_tags(frame, W, H, True)

        # Somente envia os dados depois do tempo determinado
        now = time.time()
        if (now - last_sent) > send_interval:
            payload = { "tags": enriched }
            java_client.send_detections(payload)
            last_sent = now  # Reseta o timer

        # Desenha as tags no frame
        frame = draw_tags(frame, detections)

        # Codifica a imagem para jpg
        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        # Envia os bytes da imagem de forma continua para /video
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )

    cap.release()

@app.route('/video')
def video():
    """
    Responsável por disponibilizar a rota /video no app
    """
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detect', methods=['POST'])
def detect():
    """
    Responsável por identificar as tags recebidas em formato de imagem pelo client

    Retorna o tagCode para o client
    """
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