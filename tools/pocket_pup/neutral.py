"""Neutral face placement study and optional nose-to-smile connection."""
from PIL import ImageDraw

from source import PALETTE


def raise_neutral(image, blink=False):
    draw = ImageDraw.Draw(image)
    for x in (13, 24):
        draw.rectangle((x, 27, x + 2, 30), fill=PALETTE["coat"])
        if blink:
            draw.line((x, 28, x + 2, 28), fill=PALETTE["outline"])
        else:
            draw.rectangle((x, 27, x + 2, 29), fill=PALETTE["outline"])
            draw.point((x + 2, 27), fill=PALETTE["eye_white"])
    muzzle = image.crop((16, 31, 26, 40))
    draw.rectangle((16, 30, 25, 40), fill=PALETTE["cream_light"])
    image.alpha_composite(muzzle, (16, 30))
    dark = tuple(bytes.fromhex(PALETTE["outline"][1:]))
    for y in range(34, 38):
        for x in range(16, 24):
            if image.getpixel((x, y))[:3] == dark:
                image.putpixel((x, y), (0, 0, 0, 255))
    return image


def connected_smile(neutral):
    image = neutral.copy()
    mouth = image.crop((16, 34, 24, 37))
    draw = ImageDraw.Draw(image)
    draw.rectangle((16, 32, 23, 37), fill=PALETTE["cream_light"])
    image.alpha_composite(mouth, (16, 32))
    ImageDraw.Draw(image).line((19, 32, 20, 32), fill=PALETTE["mouth_black"])
    return image
