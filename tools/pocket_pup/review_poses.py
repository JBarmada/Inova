"""Native Pocket Pup key poses for the review queue."""
from PIL import Image, ImageDraw

from .source import PALETTE


def expression(base, kind, offset=0):
    result = base.copy()
    draw = ImageDraw.Draw(result)
    dark = PALETTE["outline"]
    for x in (13, 24):
        draw.rectangle((x, 27 + offset, x + 2, 30 + offset), fill=PALETTE["coat"])
        if kind == "drowsy":
            draw.rectangle((x, 29 + offset, x + 2, 30 + offset), fill=dark)
            draw.point((x + 2, 29 + offset), fill=PALETTE["eye_white"])
        else:
            draw.line((x, 29 + offset, x + 2, 29 + offset), fill=dark)
    return result


def lower_loaf(base, head, head_shift):
    result = Image.new("RGBA", (64, 64))
    # Retain the tuck, tail and ground pixels. Bridge behind the descending
    # head using coat pixels only inside the existing chest silhouette.
    result.paste(base.crop((0, 43, 64, 64)), (0, 43))
    old_head_bottom = head.getbbox()[3] + 7
    for y in range(43, min(54, old_head_bottom + 1)):
        for x in range(11, 33):
            if head.getpixel((x, y - 7))[3]:
                result.putpixel((x, y), result.getpixel((x, 53)))
    result.alpha_composite(head, (0, head_shift))
    return result


def raise_back_ear(base):
    result = base.copy()
    ear = base.crop((24, 12, 38, 20))
    result.paste((0, 0, 0, 0), (24, 12, 38, 19))
    result.paste(ear, (24, 11))
    return result


def tilt_head(base, head):
    result = base.copy()
    alpha = head.getchannel("A")
    result.paste((0, 0, 0, 0), (0, 0, 64, 64), alpha)
    # Keep the face rigid. The staggered ear tops carry the tilt.
    pitched = raise_back_ear(head)
    result.alpha_composite(pitched, (0, 1))
    return result


def wag(base, rise):
    result = base.copy()
    # A pitch of the curl around the fixed root. The upper tip moves first,
    # its base and the whole left side stay fixed. No columns are remapped.
    for x in range(40, 59):
        for y in range(23, 43):
            # Move the cap as one piece and taper along the inner attachment.
            shift = rise if y < (33 if x < 45 else 40) else 0
            result.putpixel((x, y), base.getpixel((x, y - shift)))
    return result


def stretch_pose(base, head, depth):
    # Keep the rear support and tail intact while drawing a foreleg reach.
    image = base.copy()
    image.paste((0, 0, 0, 0), (0, 0, 64, 64), head.getchannel("A"))
    image.paste((0, 0, 0, 0), (0, 0, 33, 56))
    draw = ImageDraw.Draw(image)
    dark = PALETTE["outline"]
    draw.polygon([(32, 38), (36, 39), (36, 49), (30, 51), (24, 53), (19, 54),
                  (12, 55), (6, 55), (5, 54), (5, 52), (8, 50), (14, 50),
                  (18, 46 + depth), (24, 43 + depth)], fill=dark)
    draw.polygon([(32, 40), (35, 41), (35, 48), (30, 50), (25, 51), (18, 53),
                  (11, 54), (6, 54), (6, 52), (9, 51), (15, 51), (20, 47 + depth),
                  (26, 44 + depth)], fill=PALETTE["coat"])
    draw.line((6, 53, 10, 53), fill=PALETTE["cream_shadow"])
    draw.line([(12, 51), (17, 51), (22, 49), (26, 48)], fill=PALETTE["deep_shadow"])
    draw.line((11, 54, 16, 54), fill=PALETTE["cream"])
    draw.line((12, 53, 15, 53), fill=PALETTE["cream_light"])
    image.alpha_composite(head, (-1 - depth, 4 + depth))
    return image


def face_detail(base, reference, box):
    result = base.copy()
    result.paste(reference.crop(box), box[:2])
    return result


def relaxed_mouth(head):
    result = head.copy()
    draw = ImageDraw.Draw(result)
    draw.rectangle((12, 33, 27, 37), fill=PALETTE["cream_light"])
    draw.line((19, 36, 21, 36), fill=PALETTE["outline"])
    return result


def bark_face(base, open_mouth):
    result = base.copy()
    draw = ImageDraw.Draw(result)
    dark = PALETTE["outline"]
    draw.line([(12, 24), (14, 24), (15, 25)], fill=dark)
    draw.line([(24, 25), (25, 24), (27, 24)], fill=dark)
    if open_mouth:
        draw.rectangle((13, 33, 26, 38), fill=PALETTE["cream_light"])
        draw.polygon([(18, 34), (21, 34), (22, 35), (22, 37),
                      (21, 38), (18, 38), (17, 37), (17, 35)], fill=dark)
        draw.line((19, 37, 20, 37), fill=PALETTE["tongue"])
    return result
