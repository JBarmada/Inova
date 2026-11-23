"""A three-quarter seated body with a broad fluffy bib and longer forelegs."""
from pathlib import Path

from PIL import Image, ImageDraw

from consistent_sit import clean_head
from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def silhouette(draw):
    dark = PALETTE["outline"]
    draw.polygon([(18, 32), (30, 32), (33, 36), (34, 40),
                  (38, 42), (41, 45), (43, 49), (43, 53),
                  (40, 55), (34, 55), (32, 54), (30, 55),
                  (26, 55), (25, 53), (23, 50), (22, 53),
                  (21, 55), (16, 55), (14, 53), (14, 46),
                  (12, 42), (12, 38), (15, 35)], fill=dark)
    draw.polygon([(18, 34), (29, 34), (31, 37), (32, 41),
                  (36, 43), (39, 46), (41, 50), (41, 52),
                  (38, 53), (33, 53), (30, 51), (18, 51),
                  (16, 46), (14, 41), (14, 39)], fill=PALETTE["coat"])
    draw.line([(37, 45), (39, 48), (40, 51)], fill=PALETTE["coat_shadow"])
    draw.line((35, 44, 37, 45), fill=PALETTE["coat_light"])


def forelegs(draw):
    for left in (15, 26):
        draw.polygon([(left, 45), (left + 6, 45), (left + 6, 53),
                      (left + 5, 54), (left + 1, 54), (left, 53)], fill=PALETTE["cream"])
        draw.line((left, 47, left, 52), fill=PALETTE["cream_shadow"])
        draw.rectangle((left + 2, 49, left + 4, 52), fill=PALETTE["cream_light"])
        draw.line((left + 1, 54, left + 4, 54), fill=PALETTE["deep_shadow"])
    draw.line([(33, 48), (33, 51), (35, 53), (39, 53)], fill=PALETTE["outline"])
    draw.line((35, 52, 39, 52), fill=PALETTE["cream"])


def chest(draw):
    draw.polygon([(15, 34), (30, 34), (32, 37), (33, 39),
                  (31, 39), (33, 41), (32, 43), (30, 44),
                  (30, 46), (28, 46), (28, 48), (26, 48),
                  (24, 50), (22, 49), (20, 49), (20, 47),
                  (18, 47), (18, 45), (16, 45), (15, 42),
                  (14, 40), (15, 38)], fill=PALETTE["cream"])
    draw.polygon([(17, 35), (28, 35), (29, 38), (27, 40),
                  (29, 42), (27, 43), (27, 45), (25, 45),
                  (24, 47), (22, 46), (20, 46), (20, 44),
                  (18, 44), (17, 41), (18, 39)], fill=PALETTE["cream_light"])
    draw.line([(17, 38), (19, 40), (18, 41), (20, 43)], fill=PALETTE["cream_shadow"])
    draw.line([(29, 42), (28, 44), (27, 44)], fill=PALETTE["cream_shadow"])
    draw.line((23, 49, 24, 49), fill=PALETTE["cream_shadow"])


def make_pose():
    base = load("v9/fur-details.png")
    image = Image.new("RGBA", (64, 64))
    tail = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (35, 36))
    draw = ImageDraw.Draw(image)
    silhouette(draw)
    forelegs(draw)
    chest(draw)
    image.alpha_composite(clean_head(base), (7, -5))
    return image


def main():
    base, sprite = load("v9/fur-details.png"), make_pose()
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    assert sprite.crop((14, 22, 30, 32)).tobytes() == base.crop((12, 27, 28, 37)).tobytes()
    destination = ART / "v21"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-fluffy.png")
    sheet = Image.new("RGB", (1200, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / FLUFFY-CHEST SIT", 32)
    label(draw, (40, 82), "Selected head + palette / fuller cream bib / longer forelegs / seated three-quarter body", 18)
    for x, title, dog in ((40, "STANDING REFERENCE", base), (620, "FLUFFY SITTING STUDY", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 20, 700), title, 25)
    sheet.save(destination / "sitting-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Exported fluffy-chest sitting study; face, grid, transparency, and code-size checks passed.")


if __name__ == "__main__":
    main()
