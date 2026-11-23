"""Broaden the sitting neck while preserving the approved source head edge."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from head_edge_fix import corrected_head
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def broaden(previous):
    image = previous.copy()
    draw = ImageDraw.Draw(image)
    edges = [(36, 13, 30), (37, 13, 30), (38, 13, 31),
             (39, 13, 31), (40, 13, 32), (41, 13, 32),
             (42, 13, 33), (43, 13, 33), (44, 14, 34)]
    for y, left, right in edges:
        draw.line((left, y, right, y), fill=PALETTE["outline"])
        draw.line((left + 1, y, right - 1, y), fill=PALETTE["coat"])
        draw.point((left + 1, y), fill=PALETTE["coat_shadow"])
    draw.polygon([(15, 36), (29, 36), (30, 39), (29, 41),
                  (27, 44), (24, 46), (21, 44), (18, 42),
                  (16, 39)], fill=PALETTE["cream"])
    draw.polygon([(17, 36), (27, 36), (28, 39), (26, 42),
                  (23, 44), (20, 42), (18, 39)], fill=PALETTE["cream_light"])
    draw.line((21, 44, 23, 45), fill=PALETTE["cream_shadow"])
    draw.line((27, 43, 26, 44), fill=PALETTE["cream_shadow"])
    head = corrected_head(load("v9/fur-details.png"))
    image.alpha_composite(head, (0, -3))
    for y in range(3, 42):
        for x in range(64):
            pixel = head.getpixel((x, y))
            if pixel[3]:
                assert image.getpixel((x, y - 3)) == previous.getpixel((x, y - 3))
    for y in range(64):
        for x in range(64):
            if not (12 <= x <= 34 and 36 <= y <= 46):
                assert image.getpixel((x, y)) == previous.getpixel((x, y))
    return image


def main():
    previous = load("v23/sitting-idle.png")
    sprite = broaden(previous)
    destination = ART / "v24"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-idle.png")
    sheet = Image.new("RGB", (1200, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / THICKER NECK", 32)
    label(draw, (40, 82), "Wider neck and shoulders beneath the cheeks / head and paws unchanged", 20)
    for x, title, dog in ((40, "BEFORE", previous), (620, "THICKER NECK", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 70, 700), title, 26)
    sheet.save(destination / "neck-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Verified unchanged head and paws; edits confined to neck/upper chest.")


if __name__ == "__main__":
    main()
