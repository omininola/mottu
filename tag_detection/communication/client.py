import requests
import json

class JavaAPIClient:
    def __init__(self, base_url, yard_id):
        self.base_url = base_url
        self.yard_id = yard_id

    def send_detections(self, detections):
        """
        Sends detections to Java API.
        Java API enriches data with bike info and broadcasts via WebSocket.
        """
        url = f"{self.base_url}/yards/{yard_id}/tags"
        response = requests.post(url, json=detections)
        return response.json() if response.ok else {"error": response.text}
