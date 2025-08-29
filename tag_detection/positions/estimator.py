import numpy as np

class PositionEstimator:
    def __init__(self, frame_width, frame_height):
        self.frame_width = frame_width
        self.frame_height = frame_height

    def normalize_position(self, detection):
        """
        Normalize pixel positions into [0,1] scale relative to the frame.
        This makes frontend rendering proportional.
        """
        cx, cy = detection["center"]
        return {
            "id": detection["id"],
            "normalized_center": (cx / self.frame_width, cy / self.frame_height),
            "corners": [(x / self.frame_width, y / self.frame_height) for (x, y) in detection["corners"]]
        }
