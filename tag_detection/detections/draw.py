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