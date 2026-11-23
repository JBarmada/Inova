"""Compare the existing neutral with separate and connected black smiles."""
from PIL import Image, ImageDraw

from sheet import BACKGROUND, label


def neutral_choices(previous, separate, connected):
    sheet = Image.new("RGB", (1440, 900), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (64, 35), "POCKET PUP / NEUTRAL FACE STUDY", 32)
    label(draw, (64, 86), "Single corner highlight. Neutral features one pixel higher. Black mouth.", 19)
    old = Image.open(previous / "sprites/idle.png").convert("RGBA")
    options = [("PREVIOUS / v5", old, "White strip; previous face position."),
               ("A / SEPARATE", separate, "Higher face; black :3 with a gap."),
               ("B / CONNECTED", connected, "Smile tucked up to touch the nose.")]
    for index, (title, sprite, note) in enumerate(options):
        x = 64 + index * 454
        label(draw, (x, 150), title, 23)
        enlarged = sprite.resize((256, 256), Image.Resampling.NEAREST)
        sheet.paste(enlarged, (x + 60, 195), enlarged)
        detail = sprite.crop((8, 23, 32, 42)).resize((288, 228), Image.Resampling.NEAREST)
        sheet.paste(detail, (x + 44, 500), detail)
        label(draw, (x, 770), note, 16)
    label(draw, (64, 846), "Both new options preserve the body, silhouette, and accessory anchors.", 19)
    return sheet
