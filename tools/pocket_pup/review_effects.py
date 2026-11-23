"""Independent effect and prop layers shown in the preview GIFs."""
from PIL import Image, ImageDraw

from .source import PALETTE


def overlays(clip, markers):
    layer = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(layer)
    dark = PALETTE["outline"]
    gold = PALETTE["coat_light"]
    if clip.startswith("12-"):
        draw.line((34, 33, 38, 31), fill=dark)
        draw.line((35, 36, 40, 36), fill=dark)
        draw.line((34, 39, 38, 41), fill=dark)
        yield "bark-rays", layer, markers["bark"], markers["bark"] + 130
    elif clip.startswith("13-"):
        draw.rectangle((1, 34, 6, 37), fill=dark)
        draw.line((2, 35, 5, 35), fill=PALETTE["coat_shadow"])
        yield "treat", layer, markers["offer_treat"], markers["hide_treat"]
    elif clip.startswith("14-"):
        for x, y in ((5, 16), (36, 19), (42, 11)):
            draw.line((x - 2, y, x + 2, y), fill=gold)
            draw.line((x, y - 2, x, y + 2), fill=gold)
        yield "sparkles", layer, markers["sparkle"], markers["sparkle"] + 320
    elif clip.startswith("15-"):
        draw.polygon([(18, 40), (26, 40), (22, 44)], fill=PALETTE["bandana_dark"])
        draw.polygon([(19, 41), (25, 41), (22, 43)], fill=PALETTE["bandana"])
        yield "bandana-sample", layer, markers["attach_wearable"], markers["attach_wearable"] + 900
