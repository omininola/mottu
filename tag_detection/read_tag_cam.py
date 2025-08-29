import cv2 as cv
from pupil_apriltags import Detector
import numpy as np


def draw_rounded_rect(img, top_left, bottom_right, color, radius=10, thickness=-1):
    x1, y1 = top_left
    x2, y2 = bottom_right

    cv.rectangle(img, (x1 + radius, y1), (x2 - radius, y2), color, thickness)
    cv.rectangle(img, (x1, y1 + radius), (x2, y2 - radius), color, thickness)

    cv.ellipse(
        img, (x1 + radius, y1 + radius), (radius, radius), 180, 0, 90, color, thickness
    )
    cv.ellipse(
        img, (x2 - radius, y1 + radius), (radius, radius), 270, 0, 90, color, thickness
    )
    cv.ellipse(
        img, (x1 + radius, y2 - radius), (radius, radius), 90, 0, 90, color, thickness
    )
    cv.ellipse(
        img, (x2 - radius, y2 - radius), (radius, radius), 0, 0, 90, color, thickness
    )


capture = cv.VideoCapture(0)

detector = Detector(
    families="tag16h5",
    nthreads=1,
    quad_decimate=1,
    quad_sigma=0,
    refine_edges=1,
    decode_sharpening=0.25,
)

while True:
    ret, frame = capture.read()
    if not ret:
        break

    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    results = detector.detect(gray)

    for r in results:
        if r.decision_margin < 20:
            continue

        corners = r.corners
        pts = np.array(corners, dtype=np.int32).reshape((-1, 1, 2))

        cv.line(frame, pts[0][0], pts[1][0], (0, 255, 0), 3)
        cv.line(frame, pts[1][0], pts[2][0], (0, 0, 255), 3)
        cv.line(frame, pts[2][0], pts[3][0], (255, 0, 0), 3)
        cv.line(frame, pts[3][0], pts[0][0], (255, 0, 0), 3)

        center = (int(r.center[0]), int(r.center[1]))
        tag_text = f"ID: {r.tag_id}"

        font = cv.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        thickness = 2

        (text_w, text_h), _ = cv.getTextSize(tag_text, font, font_scale, thickness)
        rect_tl = (center[0] - text_w // 2 - 5, center[1] - text_h // 2 - 5)
        rect_br = (center[0] + text_w // 2 + 5, center[1] + text_h // 2 + 5)

        draw_rounded_rect(frame, rect_tl, rect_br, (0, 0, 0), radius=10, thickness=-1)

        text_origin = (rect_tl[0] + 5, rect_br[1] - 5)
        cv.putText(
            frame,
            tag_text,
            text_origin,
            font,
            font_scale,
            (255, 255, 255),
            thickness,
            cv.LINE_AA,
        )

    cv.imshow("AprilTag Detection", frame)
    if cv.waitKey(1) & 0xFF == ord("q"):
        break
