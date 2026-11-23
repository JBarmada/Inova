"""Pear-shaped sitting pose using the user's second reference for posture only."""
from pathlib import Path

from PIL import Image, ImageDraw

from consistent_sit import clean_head
from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def body(draw):
    draw.polygon([(19, 33), (28, 33), (30, 37), (31, 41),
                  (34, 44), (36, 48), (36, 52), (34, 54),
                  (30, 54), (29, 55), (25, 55), (24, 54),
                  (23, 55), (19, 55), (18, 54), (14, 54),
                  (12, 52), (12, 48), (14, 44), (16, 41),
                  (17, 37)], fill=PALETTE["outline"])
    draw.polygon([(19, 35), (27, 35), (28, 38), (29, 42),
                  (32, 45), (34, 48), (34, 51), (32, 52),
                  (29, 52), (28, 54), (26, 54), (24, 52),
                  (22, 54), (20, 54), (18, 52), (15, 52),
                  (14, 51), (14, 48), (16, 44), (18, 40)], fill=PALETTE["coat"])
    # Mirrored, tucked hindquarters form the pear, rather than a side bulge.
    draw.line([(15, 46), (14, 49), (14, 51), (16, 52)], fill=PALETTE["coat_shadow"])
    draw.line([(33, 46), (34, 49), (34, 51), (32, 52)], fill=PALETTE["coat_shadow"])
    draw.polygon([(18, 35), (29, 35), (29, 38), (27, 41),
                  (25, 43), (23, 43), (20, 41), (19, 38)], fill=PALETTE["cream"])
    draw.polygon([(20, 35), (27, 35), (27, 38), (25, 40),
                  (23, 41), (21, 39)], fill=PALETTE["cream_light"])


def legs(draw):
    # Front legs run vertically inside the body; their paws meet in the middle.
    draw.line((18, 46, 18, 52), fill=PALETTE["outline"])
    draw.line((30, 46, 30, 52), fill=PALETTE["outline"])
    draw.line((24, 47, 24, 54), fill=PALETTE["outline"])
    for left, right in ((19, 23), (25, 29)):
        draw.polygon([(left, 51), (left + 1, 50), (right - 1, 50),
                      (right, 51), (right, 53), (right - 1, 54),
                      (left + 1, 54), (left, 53)], fill=PALETTE["cream"])
        draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_light"])
        draw.line((left + 1, 54, right - 1, 54), fill=PALETTE["cream_shadow"])
    for left, right in ((14, 17), (31, 34)):
        draw.line((left, 52, right, 52), fill=PALETTE["cream"])
        draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_shadow"])


def make_pose():
    base = load("v9/fur-details.png")
    image = Image.new("RGBA", (64, 64))
    curl = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(curl, (32, 38))
    draw = ImageDraw.Draw(image)
    body(draw)
    legs(draw)
    image.alpha_composite(clean_head(base), (7, -4))
    return image


def main():
    sprite = make_pose()
    base = load("v9/fur-details.png")
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    assert sprite.crop((14, 23, 30, 33)).tobytes() == base.crop((12, 27, 28, 37)).tobytes()
    destination = ART / "v20"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-pear.png")
    sheet = Image.new("RGB", (1200, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / PEAR-SHAPED SIT", 32)
    label(draw, (40, 82), "Same head / narrow chest, rounded base / front paws together / tucked back paws", 19)
    for x, title, dog in ((40, "STANDING REFERENCE", base), (620, "PEAR-SHAPED SITTING", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 20, 700), title, 25)
    sheet.save(destination / "sitting-comparison.png")
    sprite.resize((640, 640), Image.Resampling.NEAREST).save(destination / "sitting-large.png")
    validate_source_sizes(Path(__file__).parent)
    print("Created pear-shaped sitting review with unchanged face and no toe marks.")


if __name__ == "__main__":
    main()
