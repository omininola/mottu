import requests

host = "server"
port = 8080
subsidiary = 1
url = f"https://{host}:{port}/subsidiaries/{subsidiary}/tags"

data = {
    "subsidiaryId": subsidiary,
    "tags": [
        { "tagId": 1, "position": { "x": 0, "y": 0, "z": 0 } },
        { "tagId": 2, "position": { "x": 1, "y": 0, "z": 0 } },
        { "tagId": 3, "position": { "x": 2, "y": 0, "z": 0 } },
    ]
}

try:
    res = requests.post(url, json=data)
except requests.exceptions.RequestException as e:
    printf(f"An error occurred during the request: {e}")