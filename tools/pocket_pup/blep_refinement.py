"""Match Happy :D pink, restore the :3 blep, and add a blushing pup."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, entries, load, render
from source import PALETTE
from validate import validate_source_sizes

PINK = (*bytes.fromhex(PALETTE["tongue"][1:]), 255)
OLD_PINK = (225, 160, 160, 255)


def recolor(image):
    result = image.copy()
    result.putdata([PINK if pixel == OLD_PINK else pixel for pixel in image.getdata()])
    return result


def blep():
    image = load("v9/fur-details.png")
    # Keep both :3 cups intact; the tongue peeks below their center.
    ImageDraw.Draw(image).rectangle((19, 35, 20, 36), fill=PINK)
    return image


def blush(image):
    result = image.copy()
    happy = load("v6/sprites/happy.png")
    draw = ImageDraw.Draw(result)
    for y in range(64):
        for x in range(64):
            if (x < 16 or x > 23) and happy.getpixel((x, y)) == PINK:
                draw.point((x, y), fill=PINK)
    return result


def validate(original, sprite, cheeks=False):
    assert sprite.size == (64, 64) and sprite.mode == "RGBA"
    assert sprite.getchannel("A").tobytes() == original.getchannel("A").tobytes()
    for y in range(64):
        for x in range(64):
            changed = original.getpixel((x, y)) != sprite.getpixel((x, y))
            allowed = 13 <= x <= 26 and 33 <= y <= 40
            allowed |= cheeks and 10 <= x <= 29 and 33 <= y <= 34
            assert not changed or allowed, (x, y)
    assert OLD_PINK not in sprite.getdata()


def main():
    destination = ART / "v14"
    destination.mkdir(parents=True, exist_ok=True)
    tiny = blep()
    soft = recolor(load("v13/soft-dog-smile.png"))
    happy = recolor(load("v13/happy-little-pup.png"))
    rosy = blush(happy)
    sprites = {"tiny-peek": tiny, "soft-dog-smile": soft,
               "happy-little-pup": happy, "happy-little-pup-blush": rosy}
    for name, sprite in sprites.items():
        original = load("v9/fur-details.png") if name == "tiny-peek" else load(
            "v13/soft-dog-smile.png" if name == "soft-dog-smile" else "v13/happy-little-pup.png")
        validate(original, sprite, cheeks=name.endswith("blush"))
        sprite.save(destination / f"{name}.png")
    items = entries()[:6] + [
        ("BLEP / :3", tiny, "The :3 smile with a tiny tongue peek."),
        ("SOFT DOG SMILE", soft, "Tongue pink matches Happy :D."),
        ("HAPPY LITTLE PUP", happy, "Happy eyes + matching tongue pink."),
        ("HAPPY LITTLE PUP / BLUSH", rosy, "Extra variant with Happy :D's cheek blush."),
    ]
    render(items, destination / "reference-sheet.png",
           "Full expression collection / matching Happy :D pink / 64 x 64 sprites / crisp 4x scale",
           "Review collection: previous states + revised bleps + extra blush variant. Not integrated into the app.")
    metadata = {"status": "art review, not integrated", "canvas": [64, 64],
                "tongueAndBlushColor": PALETTE["tongue"], "sprites": list(sprites),
                "changes": ["matching Happy :D pink", ":3 blep restored", "extra blushing happy pup"]}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated four revised sprites and full ten-entry reference sheet.")


if __name__ == "__main__":
    main()
