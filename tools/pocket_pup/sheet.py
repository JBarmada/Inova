"""Reference layout. Sprite enlargement always uses integer nearest-neighbor."""
from PIL import Image, ImageDraw, ImageFont

from layers import compose
from source import PALETTE

BACKGROUND = "#fbf5e8"
INK = "#4b2d22"


def font(size):
    for path in ("C:/Windows/Fonts/consolab.ttf", "/System/Library/Fonts/Menlo.ttc",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default(size=size)


def label(draw, position, text, size=20, fill=INK):
    draw.text(position, text, font=font(size), fill=fill)


def reference_sheet(frames, accessory, marks, version=1):
    sheet = Image.new("RGB", (1440, 1160), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (64, 36), "INOVA / POCKET PUP", 38)
    label(draw, (64, 91), f"GRID STUDY v{version}   /   64 x 64 RGBA   /   fixed palette, no smoothing", 20)
    entries = [("idle", "NEUTRAL", "Standing body and feet are shared."),
               ("happy", "HAPPY", "Face change + removable wag marks."),
               ("tired", "TIRED", "Closed lids; same head proportions."),
               ("barking", "BARKING", "Open mouth + separate action rays."),
               ("sleeping", "SLEEPING", "Separate curled pose; scarf not fitted."),
               ("bandana", "BANDANA FIT", "A removable layer over the same dog.")]
    for index, (key, title, note) in enumerate(entries):
        x, y = 64 + (index % 3) * 454, 160 + (index // 3) * 365
        if key == "bandana":
            sprite = compose(frames["idle"], accessory)
        else:
            sprite = frames[key]
            mark = "wag" if key == "happy" else key
            if mark in marks:
                sprite = compose(sprite, marks[mark])
        sheet.paste(sprite.resize((256, 256), Image.Resampling.NEAREST), (x + 55, y),
                    sprite.resize((256, 256), Image.Resampling.NEAREST))
        label(draw, (x, y + 267), title, 23)
        label(draw, (x, y + 302), note, 15)
    label(draw, (64, 925), "PALETTE / coat, cream, outline, expression and accessory colors", 19)
    for index, (name, color) in enumerate(PALETTE.items()):
        x = 64 + index * ((1440 - 128) // len(PALETTE))
        draw.rectangle((x, 969, x + 78, 1007), fill=color, outline="#d2c5aa")
        label(draw, (x, 1020), color.upper(), 14)
    label(draw, (64, 1070), "Standing anchors: feet y55 / neck (22,42) / head (20,28).", 19)
    label(draw, (64, 1104), "Review draft. Transparent PNGs and separate layers are included; not yet wired into the app.", 17)
    return sheet


def grid_guide(base, accessory):
    image = Image.new("RGB", (980, 690), BACKGROUND)
    draw = ImageDraw.Draw(image)
    label(draw, (40, 25), "POCKET PUP / 64 x 64 CONSTRUCTION GRID", 25)
    for offset, sprite, title in ((40, base, "BASE"), (510, accessory, "BANDANA OVERLAY")):
        enlarged = sprite.resize((384, 384), Image.Resampling.NEAREST)
        image.paste(enlarged, (offset, 100), enlarged)
        for pixel in range(65):
            color = "#c2b69c" if pixel % 8 == 0 else "#e4d9c2"
            draw.line((offset + pixel * 6, 100, offset + pixel * 6, 484), fill=color)
            draw.line((offset, 100 + pixel * 6, offset + 384, 100 + pixel * 6), fill=color)
        label(draw, (offset, 510), title, 22)
    label(draw, (40, 566), "Origin: top-left. One cell = one pixel. Feet baseline is y55.", 19)
    label(draw, (40, 605), "Standing expressions share their silhouette. Sleeping is a separate pose.", 17)
    return image
