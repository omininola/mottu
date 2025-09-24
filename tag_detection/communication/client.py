import requests
import json

class JavaAPIClient:
    def __init__(self, base_url, yard_id):
        self.base_url = base_url
        self.yard_id = yard_id

    def get_yard_information(self):
        """
        Responsável por buscar as informações do pátio pela API de Java

        Retorna o pátio buscado
        """
        url = f"{self.base_url}/yards/{self.yard_id}/cameras"
        response = requests.get(url)
        return response.json() if response.ok else {"error": response.text}

    def send_detections(self, detections):
        """
        Responsável por enviar as tags detectadas para a API de Java

        Retorna a resposta da API
        """
        url = f"{self.base_url}/yards/{self.yard_id}/tags"
        response = requests.post(url, json=detections)
        return response.json() if response.ok else {"error": response.text}
