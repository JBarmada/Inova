"""Shared face patches preserve the standing silhouette and equipment anchors."""
from PIL import Image, ImageDraw

from source import PALETTE
from neutral import raise_neutral


def tired_face(base):
    image = base.copy()
    draw = ImageDraw.Draw(image)
    for left in (12, 23):
        draw.rectangle((left, 27, left + 4, 31), fill=PALETTE["coat"])
    draw.rectangle((16, 33, 25, 38), fill=PALETTE["cream_light"])
    draw.rectangle((18, 33, 21, 34), fill=PALETTE["outline"])
    for x in (13, 24):
        draw.line((x, 30, x + 2, 30), fill=PALETTE["outline"])
    draw.line((19, 37, 21, 37), fill=PALETTE["outline"])
    return image


def clear_face(image):
    draw = ImageDraw.Draw(image)
    for left in (12, 23):
        draw.rectangle((left, 27, left + 4, 32), fill=PALETTE["coat"])
        draw.rectangle((left, 31, left + 4, 32), fill=PALETTE["cream_light"])
    draw.rectangle((16, 32, 25, 40), fill=PALETTE["cream_light"])
    draw.rectangle((18, 32, 21, 33), fill=PALETTE["outline"])
    return draw


def open_eye(draw, x):
    draw.rectangle((x, 28, x + 2, 30), fill=PALETTE["outline"])
    draw.point((x + 2, 28), fill=PALETTE["eye_white"])


def raise_muzzle(image):
    patch = image.crop((16, 32, 26, 41))
    ImageDraw.Draw(image).rectangle((16, 32, 25, 40), fill=PALETTE["cream_light"])
    image.alpha_composite(patch, (16, 31))
    return image


def face(base, mood):
    if mood in ("tired", "sleeping"):
        return tired_face(base)
    image = base.copy()
    draw = clear_face(image)
    dark = PALETTE["outline"]
    for x in (13, 24):
        if mood == "blink":
            draw.line((x, 29, x + 2, 29), fill=dark)
        elif mood == "happy":
            draw.line([(x, 29), (x + 1, 28), (x + 2, 29)], fill=dark)
        else:
            open_eye(draw, x)
    if mood == "happy":
        for left in (10, 27):
            draw.rectangle((left, 33, left + 2, 34), fill=PALETTE["tongue"])
        draw.polygon([(16, 36), (23, 36), (23, 37), (21, 39),
                      (18, 39), (16, 37)], fill=dark)
        draw.rectangle((18, 38, 21, 38), fill=PALETTE["tongue"])
    elif mood == "barking":
        draw.line([(12, 25), (13, 25), (14, 26), (15, 26)], fill=dark)
        draw.line([(24, 26), (25, 26), (26, 25), (27, 25)], fill=dark)
        draw.polygon([(18, 36), (21, 36), (22, 37), (22, 39),
                      (21, 40), (18, 40), (17, 39), (17, 37)], fill=dark)
        draw.rectangle((19, 38, 20, 39), fill=PALETTE["tongue"])
    else:
        draw.line([(16, 36), (16, 37), (17, 38), (18, 38), (19, 37)], fill=dark)
        draw.line([(20, 37), (21, 38), (22, 38), (23, 37), (23, 36)], fill=dark)
    image = raise_muzzle(image)
    return raise_neutral(image, blink=mood == "blink") if mood in ("idle", "blink") else image


def sleeping(base):
    image = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(image)
    dark = PALETTE["outline"]
    draw.polygon([(24, 44), (28, 41), (44, 41), (49, 44),
                  (52, 49), (52, 54), (49, 55), (20, 55), (20, 48)], fill=dark)
    draw.polygon([(26, 45), (29, 43), (43, 43), (47, 45),
                  (50, 49), (50, 53), (23, 53)], fill=PALETTE["coat"])
    draw.rectangle((26, 52, 49, 54), fill=PALETTE["cream"])
    image.alpha_composite(base.crop((38, 24, 58, 44)), (38, 31))
    image.alpha_composite(face(base, "sleeping").crop((5, 13, 37, 43)), (5, 25))
    draw = ImageDraw.Draw(image)
    draw.rectangle((10, 53, 20, 55), fill=dark)
    draw.rectangle((11, 53, 19, 54), fill=PALETTE["cream"])
    return image


def all_frames(base):
    frames = {name: face(base, name) for name in ("idle", "happy", "tired", "barking", "blink")}
    frames["sleeping"] = sleeping(base)
    return frames
