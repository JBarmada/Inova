"""Replace flat hind-foot bars with small rounded, tucked cream paws."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def fix_paws(previous):
    image = previous.copy()
    edits = {(9, 53): None, (9, 54): None, (10, 54): None}
    for y, left, right, color in [
        (50, 11, 14, "coat"), (50, 12, 14, "cream_shadow"),
        (51, 10, 10, "coat_shadow"), (51, 11, 14, "cream"),
        (51, 12, 13, "cream_light"), (52, 10, 14, "cream"),
        (53, 10, 10, "outline"), (53, 11, 14, "cream_shadow"),
        (54, 11, 14, "outline"),
    ]:
        for x in range(left, right + 1):
            edits[x, y] = color
    for (x, y), color in edits.items():
        rgba = (*bytes.fromhex(PALETTE[color][1:]), 255) if color else (0, 0, 0, 0)
        image.putpixel((x, y), rgba)
        image.putpixel((42 - x, y), rgba)
    for y in range(64):
        for x in range(64):
            if not (50 <= y <= 54 and (9 <= x <= 14 or 28 <= x <= 33)):
                assert image.getpixel((x, y)) == previous.getpixel((x, y)), (x, y)
    return image


def main():
    previous = load("v25/sitting-idle.png")
    sprite = fix_paws(previous)
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    destination = ART / "v26"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-idle.png")
    sheet = Image.new("RGB", (1200, 1000), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / TUCKED HIND PAWS", 31)
    label(draw, (40, 82), "Smaller stepped paws replace the flat bars / head, front paws, and body kept", 19)
    for x, title, dog in ((40, "BEFORE", previous), (620, "HIND PAW REVISION", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 120), large)
        label(draw, (x + 40, 650), title, 25)
        close = dog.crop((8, 47, 35, 57)).resize((432, 160), Image.Resampling.NEAREST)
        sheet.paste(close, (x + 25, 740), close)
    sheet.save(destination / "paw-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Validated hind-paw-only edit; head, torso, front paws, and tail unchanged.")


if __name__ == "__main__":
    main()
