"""Restore the actual missing cheek column without changing the sitting body."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from restored_sit import original_head
from sheet import BACKGROUND, label
from validate import validate_source_sizes


def corrected_head(base):
    head = original_head(base)
    # The source edge is x37 here, not x36. x38 belonged to the body connector.
    for y in range(28, 35):
        head.putpixel((37, y), base.getpixel((37, y)))
    for y in (33, 34):
        head.putpixel((38, y), (0, 0, 0, 0))
    return head


def main():
    base = load("v9/fur-details.png")
    previous = load("v22/sitting-idle.png")
    sprite = previous.copy()
    for y in (30, 31):
        sprite.putpixel((38, y), (0, 0, 0, 0))
    head = corrected_head(base)
    sprite.alpha_composite(head, (0, -3))
    expected = {(37, y - 3) for y in range(28, 33)} | {(38, 30), (38, 31)}
    changed = {(x, y) for y in range(64) for x in range(64)
               if sprite.getpixel((x, y)) != previous.getpixel((x, y))}
    assert changed == expected, changed
    for y in range(28, 35):
        assert sprite.getpixel((37, y - 3)) == base.getpixel((37, y))
    # Every pixel across the head above the neck junction matches the source.
    for y in range(3, 35):
        for x in range(5, 38):
            assert sprite.getpixel((x, y - 3)) == base.getpixel((x, y)), (x, y)
    destination = ART / "v23"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-idle.png")
    head.save(destination / "head-source-pixels.png")
    sheet = Image.new("RGB", (1200, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / RIGHT HEAD EDGE CORRECTION", 29)
    label(draw, (40, 82), "Restored five missing outline pixels / removed two protruding pixels / body unchanged", 18)
    for x, title, dog in ((40, "STANDING ORIGINAL", base), (620, "SITTING / EDGE FIX", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 20, 700), title, 25)
    sheet.save(destination / "sitting-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Verified exactly seven changed pixels: five restored at source x37, two removed at x38. Body unchanged.")


if __name__ == "__main__":
    main()
