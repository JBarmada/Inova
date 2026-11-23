"""Draw the seated chest and forelegs as one continuous pixel structure."""
from pathlib import Path

from PIL import Image, ImageDraw

from consistent_sit import clean_head
from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def torso(draw):
    draw.polygon([(18, 36), (29, 36), (31, 40), (32, 45),
                  (33, 49), (33, 53), (31, 55), (26, 55),
                  (24, 53), (24, 49), (23, 49), (23, 53),
                  (21, 55), (17, 55), (15, 53), (15, 46),
                  (16, 41)], fill=PALETTE["outline"])
    draw.polygon([(18, 38), (29, 38), (30, 42), (31, 47),
                  (31, 52), (29, 54), (27, 54), (25, 52),
                  (25, 47), (22, 47), (22, 52), (20, 54),
                  (18, 54), (17, 52), (17, 43)], fill=PALETTE["coat"])
    draw.line([(17, 43), (17, 49), (18, 52)], fill=PALETTE["coat_shadow"])
    draw.line([(30, 43), (30, 48)], fill=PALETTE["coat_shadow"])
    # One uninterrupted bib tapers into the coat above the leg separation.
    draw.polygon([(18, 38), (29, 38), (29, 40), (28, 42),
                  (26, 44), (24, 46), (22, 45), (20, 43),
                  (19, 41)], fill=PALETTE["cream"])
    draw.polygon([(20, 38), (27, 38), (27, 41), (25, 43),
                  (23, 44), (21, 42)], fill=PALETTE["cream_light"])
    draw.line((22, 45, 23, 45), fill=PALETTE["cream_shadow"])


def paws(draw):
    # Each sock follows its own leg contour, with the reference's stepped edges.
    for x in (17, 26):
        draw.polygon([(x, 50), (x + 1, 50), (x + 1, 49), (x + 3, 49),
                      (x + 3, 50), (x + 5, 50), (x + 5, 52),
                      (x + 4, 53), (x + 1, 53), (x, 52)], fill=PALETTE["cream"])
        draw.line((x + 1, 50, x + 3, 50), fill=PALETTE["cream_light"])
        draw.point((x + 1, 51), fill=PALETTE["cream_light"])
        draw.line((x + 1, 54, x + 3, 54), fill=PALETTE["deep_shadow"])
        draw.point((x + 4, 53), fill=PALETTE["cream_shadow"])


def make_pose():
    base = load("v9/fur-details.png")
    image = Image.new("RGBA", (64, 64))
    curl = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(curl, (29, 39))
    draw = ImageDraw.Draw(image)
    torso(draw)
    paws(draw)
    image.alpha_composite(clean_head(base), (7, -2))
    return image


def main():
    sprite = make_pose()
    base = load("v9/fur-details.png")
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    assert sprite.crop((14, 25, 30, 35)).tobytes() == base.crop((12, 27, 28, 37)).tobytes()
    destination = ART / "v19"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-idle.png")
    sheet = Image.new("RGB", (1200, 780), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / CONTINUOUS CHEST + FORELEGS", 29)
    label(draw, (40, 82), "One connected sitting body / stepped cream paws / no toe lines", 20)
    for x, title, dog in ((40, "STANDING REFERENCE", base), (620, "SITTING REVISION", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 35, 690), title, 26)
    sheet.save(destination / "sitting-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Exported unified seated-body review; fixed-grid and face-preservation checks passed.")


if __name__ == "__main__":
    main()
