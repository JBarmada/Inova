"""Reusable pixel poses and motion in-betweens for the first rest-chain study."""
from PIL import Image, ImageDraw

from full_sheet import load
from head_edge_fix import corrected_head
from source import PALETTE


def sleepy_eyes(image, offset, closed=False):
    result = image.copy()
    draw = ImageDraw.Draw(result)
    for x in (13, 24):
        draw.rectangle((x, 27 + offset, x + 2, 29 + offset), fill=PALETTE["coat"])
        if closed:
            draw.line([(x, 28 + offset), (x + 1, 29 + offset), (x + 2, 28 + offset)],
                      fill=PALETTE["outline"])
        else:
            draw.line((x, 29 + offset, x + 2, 29 + offset), fill=PALETTE["outline"])
            draw.line((x, 30 + offset, x + 2, 30 + offset), fill=PALETTE["coat_shadow"])
    return result


def isolated_head(tired=False, closed=False):
    head = corrected_head(load("v9/fur-details.png"))
    return sleepy_eyes(head, 0, closed) if tired or closed else head


def lying_body():
    image = Image.new("RGBA", (64, 64))
    base = load("v9/fur-details.png")
    tail = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (39, 38))
    draw = ImageDraw.Draw(image)
    draw.polygon([(19, 45), (24, 42), (39, 42), (45, 45),
                  (49, 49), (49, 53), (46, 55), (13, 55),
                  (11, 53), (12, 49)], fill=PALETTE["outline"])
    draw.polygon([(20, 46), (25, 44), (38, 44), (43, 46),
                  (47, 50), (47, 52), (44, 53), (15, 53),
                  (14, 51)], fill=PALETTE["coat"])
    draw.line([(40, 47), (43, 48), (45, 50)], fill=PALETTE["coat_light"])
    draw.line((26, 53, 44, 53), fill=PALETTE["cream"])
    for x in (11, 21):
        draw.rectangle((x, 52, x + 7, 54), fill=PALETTE["outline"])
        draw.line((x + 1, 52, x + 6, 52), fill=PALETTE["cream"])
        draw.line((x + 2, 53, x + 5, 53), fill=PALETTE["cream_light"])
    return image


def lying(closed=False, breath=False):
    image = lying_body()
    image.alpha_composite(isolated_head(True, closed), (0, 10 - int(breath)))
    return image


def lower_step(amount):
    sit = load("v26/sitting-idle.png")
    head = isolated_head()
    body = sit.copy()
    for y in range(3, 42):
        for x in range(64):
            if head.getpixel((x, y))[3]:
                body.putpixel((x, y - 3), (0, 0, 0, 0))
    # Feet stay on row55 while the chest lowers and the body extends backward.
    width, height = round(25 + 13 * amount), round(21 - 9 * amount)
    torso = body.crop((9, 35, 34, 56)).resize((width, height), Image.Resampling.NEAREST)
    image = Image.new("RGBA", (64, 64))
    tail = load("v9/fur-details.png").crop((38, 24, 58, 44))
    tail = tail.resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (round(29 + 10 * amount), 39))
    image.alpha_composite(torso, (9, 56 - height))
    image.alpha_composite(isolated_head(True), (0, round(-3 + 13 * amount)))
    return image


def sit_step(amount):
    base = load("v9/fur-details.png")
    head = isolated_head()
    body = base.copy()
    for y in range(42):
        for x in range(64):
            if head.getpixel((x, y))[3]:
                body.putpixel((x, y), (0, 0, 0, 0))
    width = round(36 - 11 * amount)
    height = round(21 + 0 * amount)
    torso = body.crop((13, 35, 49, 56)).resize((width, height), Image.Resampling.NEAREST)
    image = Image.new("RGBA", (64, 64))
    tail = base.crop((38, 24, 58, 44))
    size = round(20 - 6 * amount)
    tail = tail.resize((size, size), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (round(38 - 9 * amount), round(24 + 15 * amount)))
    image.alpha_composite(torso, (round(13 - 4 * amount), 56 - height))
    image.alpha_composite(head, (0, round(-3 * amount)))
    return image
