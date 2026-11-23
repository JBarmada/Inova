"""Restore standing paw artwork and remove the stray standing-body head crop."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def clean_head(base):
    head = base.crop((5, 0, 37, 42))
    # Follow the actual cheek contour; the old rectangle included back/shoulder pixels.
    limits = {37: 34, 38: 33, 39: 31, 40: 29, 41: 26}
    for y, limit in limits.items():
        for x in range(limit + 1, 37):
            head.putpixel((x - 5, y), (0, 0, 0, 0))
    draw = ImageDraw.Draw(head)
    for y, left, right in ((37, 34, 34), (38, 33, 33), (39, 31, 32),
                           (40, 29, 30), (41, 26, 28)):
        draw.line((left - 5, y, right - 5, y), fill=PALETTE["outline"])
    return head


def make_pose():
    base = load("v9/fur-details.png")
    image = Image.new("RGBA", (64, 64))
    curl = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(curl, (29, 39))
    draw = ImageDraw.Draw(image)
    draw.polygon([(18, 35), (29, 35), (31, 40), (32, 45),
                  (34, 49), (34, 52), (32, 54), (17, 54),
                  (15, 51), (15, 47), (17, 40)], fill=PALETTE["outline"])
    draw.polygon([(19, 37), (28, 37), (29, 41), (30, 46),
                  (32, 49), (32, 51), (29, 52), (18, 52),
                  (17, 49), (18, 42)], fill=PALETTE["coat"])
    draw.line([(30, 44), (31, 48), (32, 50)], fill=PALETTE["coat_shadow"])
    draw.polygon([(18, 38), (29, 38), (28, 42), (26, 44),
                  (23, 46), (20, 44), (19, 42)], fill=PALETTE["cream"])
    draw.polygon([(20, 39), (27, 39), (26, 42), (23, 44),
                  (21, 42)], fill=PALETTE["cream_light"])
    draw.point((25, 44), fill=PALETTE["cream_shadow"])
    # Reuse the original stepped paws and their texture at native pixel size.
    draw.rectangle((15, 49, 32, 55), fill=(0, 0, 0, 0))
    far = base.crop((14, 46, 22, 55))
    near = base.crop((24, 46, 32, 56))
    image.alpha_composite(far, (16, 47))
    image.alpha_composite(near, (25, 46))
    image.alpha_composite(clean_head(base), (7, -2))
    return image


def main():
    sprite = make_pose()
    destination = ART / "v18"
    destination.mkdir(parents=True, exist_ok=True)
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    base = load("v9/fur-details.png")
    assert sprite.crop((25, 46, 33, 56)).tobytes() == base.crop((24, 46, 32, 56)).tobytes()
    assert sprite.crop((14, 25, 30, 35)).tobytes() == base.crop((12, 27, 28, 37)).tobytes()
    sprite.save(destination / "sitting-idle.png")
    sheet = Image.new("RGB", (1200, 780), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / SITTING CONSISTENCY CORRECTION", 29)
    label(draw, (40, 82), "Original paw pixels and face / no toe lines / cleaned cheek silhouette", 20)
    for x, title, dog in ((40, "STANDING REFERENCE", base), (620, "REVISED SITTING", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 35, 690), title, 26)
    sheet.save(destination / "sitting-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Validated exact original near-paw and face pixels; removed added toe marks and shoulder artifact.")


if __name__ == "__main__":
    main()
