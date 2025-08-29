import requests
import json

class JavaAPIClient:
    def __init__(self, base_url, subsidiary_id):
        self.base_url = base_url
        self.subsidiary_id = subsidiary_id

    def send_detections(self, detections):
        """
        Sends detections to Java API.
        Java API enriches data with bike info and broadcasts via WebSocket.
        """
        url = f"{self.base_url}/subsidiaries/{subsidiary_id}/tags"
        response = requests.post(url, json=detections)
        return response.json() if response.ok else {"error": response.text}
