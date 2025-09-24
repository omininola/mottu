import cv2
import numpy as np

def draw_tags(frame, detections):
    """
    Responsável por desenhar as tags de acordo com a imagem / vídeo passados

    Retorna a imagem / frame desenhado
    """
    overlay = frame.copy()
    for d in detections:
        corners = d.corners
        pts = np.array(corners, dtype=np.int32).reshape((-1, 1, 2))

        # Desenha uma linha ligando os 4 cantos da tag
        cv2.line(overlay, pts[0][0], pts[1][0], (0, 255, 0), 3)
        cv2.line(overlay, pts[1][0], pts[2][0], (0, 0, 255), 3)
        cv2.line(overlay, pts[2][0], pts[3][0], (255, 0, 0), 3)
        cv2.line(overlay, pts[3][0], pts[0][0], (255, 0, 0), 3)

        center = (int(d.center[0]), int(d.center[1]))
        
        # Converte a informação da família da tag de bytes para string
        tag_family = d.tag_family
        if isinstance(tag_family, bytes):
            tag_family = tag_family.decode("utf-8")

        tag_id = d.tag_id
        tag_text = f"{tag_family}_{tag_id}"

        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        thickness = 2

        # Centraliza o texto indicativo no centro da tag
        (text_w, text_h), _ = cv2.getTextSize(tag_text, font, font_scale, thickness)
        rect_tl = (center[0] - text_w // 2 - 5, center[1] - text_h // 2 - 5)
        rect_br = (center[0] + text_w // 2 + 5, center[1] + text_h // 2 + 5)

        draw_rounded_rect(overlay, rect_tl, rect_br, (0, 0, 0), radius=10, thickness=-1)

        # Desenha o texto das informações da tag no frame
        text_origin = (rect_tl[0] + 5, rect_br[1] - 5)
        cv2.putText(
            overlay,
            tag_text,
            text_origin,
            font,
            font_scale,
            (255, 255, 255),
            thickness,
            cv2.LINE_AA,
        )

    # Mescla os canais alpha do frame enviado e o desenho criado
    alpha = 0.8
    out = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)
    return out

def draw_rounded_rect(frame, top_left, bottom_right, color, radius=10, thickness=-1):
    """
    Responsável por deixar a tag com as bordas redondas
    """
    x1, y1 = top_left
    x2, y2 = bottom_right

    cv2.rectangle(frame, (x1 + radius, y1), (x2 - radius, y2), color, thickness)
    cv2.rectangle(frame, (x1, y1 + radius), (x2, y2 - radius), color, thickness)

    cv2.ellipse(
        frame, (x1 + radius, y1 + radius), (radius, radius), 180, 0, 90, color, thickness
    )
    cv2.ellipse(
        frame, (x2 - radius, y1 + radius), (radius, radius), 270, 0, 90, color, thickness
    )
    cv2.ellipse(
        frame, (x1 + radius, y2 - radius), (radius, radius), 90, 0, 90, color, thickness
    )
    cv2.ellipse(
        frame, (x2 - radius, y2 - radius), (radius, radius), 0, 0, 90, color, thickness
    )