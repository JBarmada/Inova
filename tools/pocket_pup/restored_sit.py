"""Keep every selected head pixel inside its original outline, including the cheek edge."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from pear_sit import body, legs
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def original_head(base):
    head = Image.new("RGBA", (64, 64))
    limits = {32: 36, 33: 38, 34: 38, 35: 36, 36: 36,
              37: 35, 38: 34, 39: 33, 40: 31, 41: 28}
    for y in range(42):
        for x in range(5, limits.get(y, 36) + 1):
            head.putpixel((x, y), base.getpixel((x, y)))
    return head


def make_pose(base):
    image = Image.new("RGBA", (64, 64))
    tail = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (32, 39))
    draw = ImageDraw.Draw(image)
    body(draw)
    legs(draw)
    # A restrained bib keeps the original honey coat dominant.
    draw.polygon([(18, 36), (29, 36), (29, 39), (28, 41),
                  (26, 44), (24, 46), (21, 44), (19, 41)], fill=PALETTE["cream"])
    draw.polygon([(20, 36), (27, 36), (27, 39), (25, 42),
                  (23, 43), (21, 41)], fill=PALETTE["cream_light"])
    draw.line((21, 43, 22, 44), fill=PALETTE["cream_shadow"])
    draw.line((27, 43, 26, 44), fill=PALETTE["cream_shadow"])
    draw.line((16, 46, 17, 45), fill=PALETTE["coat_light"])
    draw.point((31, 46), fill=PALETTE["coat_light"])
    head = original_head(base)
    image.alpha_composite(head, (0, -3))
    for y in range(3, 42):
        for x in range(64):
            pixel = head.getpixel((x, y))
            if pixel[3]:
                assert image.getpixel((x, y - 3)) == pixel, (x, y)
    return image


def main():
    base = load("v9/fur-details.png")
    sprite = make_pose(base)
    destination = ART / "v22"
    destination.mkdir(parents=True, exist_ok=True)
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    sprite.save(destination / "sitting-idle.png")
    original_head(base).save(destination / "preserved-head.png")
    sheet = Image.new("RGB", (1200, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / RESTORED HEAD + COMPACT SIT", 29)
    label(draw, (40, 82), "Original cheek edge restored / original head pixels preserved / honey coat + cream bib", 18)
    for x, title, dog in ((40, "STANDING REFERENCE", base), (620, "SITTING REVIEW", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 20, 700), title, 25)
    sheet.save(destination / "sitting-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Verified every retained original head pixel, including restored right cheek columns. Body awaits visual review.")


if __name__ == "__main__":
    main()
