"""Removable accessories and action marks, all on the same 64-pixel canvas."""
from PIL import Image, ImageDraw

from source import PALETTE


def bandana():
    layer = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(layer)
    draw.polygon([(15, 41), (29, 41), (28, 45), (22, 49),
                  (17, 46)], fill=PALETTE["outline"])
    draw.polygon([(17, 42), (27, 42), (26, 45), (22, 47),
                  (19, 45)], fill=PALETTE["bandana"])
    draw.line((22, 46, 26, 43), fill=PALETTE["bandana_dark"])
    draw.polygon([(28, 41), (32, 39), (33, 42), (29, 44)], fill=PALETTE["outline"])
    draw.line((29, 42, 31, 41), fill=PALETTE["bandana"])
    return layer


def cue(name):
    layer = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(layer)
    dark = PALETTE["outline"]
    if name == "wag":
        draw.line((51, 20, 52, 17), fill=dark, width=2)
        draw.line((57, 22, 59, 19), fill=dark, width=2)
    elif name == "barking":
        draw.line((0, 29, 2, 30), fill=dark)
        draw.line((0, 34, 2, 34), fill=dark)
        draw.line((0, 39, 2, 38), fill=dark)
    elif name == "sleeping":
        draw.line([(42, 20), (46, 20), (42, 24), (46, 24)], fill=dark)
        draw.line([(51, 13), (54, 13), (51, 16), (54, 16)], fill=dark)
    return layer


def compose(base, *layers):
    image = base.copy()
    for layer in layers:
        image.alpha_composite(layer)
    return image
