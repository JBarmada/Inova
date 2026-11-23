"""Small muzzle finishing treatments on the selected fur-details C14 dog."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from polish_study import rgba, touch
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]
CREAMS = ("cream_light", "cream", "cream_shadow")


def warm_dots(base):
    image = base.copy()
    touch(image, [(10, 34), (11, 36), (29, 34), (28, 36)], "coat_shadow", CREAMS)
    return image


def whisker_pores(base):
    image = base.copy()
    touch(image, [(9, 33), (10, 35), (11, 37), (30, 33), (29, 35), (28, 37)],
          "deep_shadow", CREAMS)
    return image


def short_whiskers(base):
    image = base.copy()
    touch(image, [(8, 34), (9, 34), (10, 34), (9, 37), (10, 37),
                  (29, 34), (30, 34), (31, 34), (29, 37), (30, 37)],
          "deep_shadow", CREAMS)
    return image


def muzzle_depth(base):
    image = base.copy()
    touch(image, [(14, 37), (15, 37), (16, 37), (17, 38), (18, 38),
                  (21, 38), (22, 38), (23, 37), (24, 37), (25, 37)],
          "cream_shadow", ("cream_light", "cream"))
    touch(image, [(12, 34), (27, 34)], "cream", ("cream_light",))
    return image


def check(base, image):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == base.getchannel("A").tobytes()
    assert all(image.getpixel((x, 32)) == base.getpixel((x, 32)) for x in range(13, 27))
    allowed = {rgba(name) for name in PALETTE}
    for y in range(64):
        for x in range(64):
            pixel, old = image.getpixel((x, y)), base.getpixel((x, y))
            if pixel[3]:
                assert pixel in allowed
            if not (8 <= x <= 31 and 33 <= y <= 39) or old == rgba("outline"):
                assert pixel == old, (x, y)


def comparison(variants, title="POCKET PUP / LITTLE MUZZLE DETAILS", subtitle=None):
    sheet = Image.new("RGB", (1680, 1180), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), title, 32)
    label(draw, (40, 80), subtitle or "Selected fur detail, brown C14 smile, upper-right dots. Every option keeps the one-pixel gap.", 18)
    for index, (title, sprite, notes) in enumerate(variants):
        x, y = 40 + (index % 3) * 550, 150 + (index // 3) * 490
        label(draw, (x + 10, y), title, 22)
        full = sprite.resize((320, 320), Image.Resampling.NEAREST)
        sheet.paste(full, (x + 10, y + 30), full)
        close = sprite.crop((7, 23, 34, 43)).resize((189, 140), Image.Resampling.NEAREST)
        label(draw, (x + 345, y + 110), "FACE DETAIL", 15)
        sheet.paste(close, (x + 340, y + 145), close)
        for row, note in enumerate(notes):
            label(draw, (x + 10, y + 370 + row * 29), note, 17)
    label(draw, (40, 1134), "No changes to the eye area, nose, smile outline, body, fur highlights, or clothing anchors.", 18)
    return sheet


def main():
    base = Image.open(ROOT / "art/pocket-pup/v9/fur-details.png").convert("RGBA")
    variants = [
        ("1 / SELECTED BASE", base, ["Your chosen fur-details dog.", "No new muzzle pixels."]),
        ("2 / WARM FRECKLES", warm_dots(base), ["Four soft honey-colored dots.", "A hint of whisker texture."]),
        ("3 / WHISKER PORES", whisker_pores(base), ["Six deeper warm-brown dots.", "More visible muzzle character."]),
        ("4 / SHORT WHISKERS", short_whiskers(base), ["Tiny horizontal whisker strokes.", "A more graphic expression."]),
        ("5 / MUZZLE SHADOW", muzzle_depth(base), ["A soft shadow below each smile curve.", "Adds a little rounded volume."]),
        ("6 / SOFT COMBINATION", muzzle_depth(warm_dots(base)), ["Warm freckles with the soft lip shadow.", "A few more pixels, still restrained."]),
    ]
    names = ("selected-base", "warm-freckles", "whisker-pores", "short-whiskers", "muzzle-shadow", "soft-combination")
    destination = ROOT / "art/pocket-pup/v10"
    destination.mkdir(parents=True, exist_ok=True)
    counts = {}
    for name, (_, image, _) in zip(names, variants):
        check(base, image)
        image.save(destination / f"{name}.png")
        counts[name] = sum(base.getpixel((x, y)) != image.getpixel((x, y))
                           for y in range(64) for x in range(64))
    comparison(variants).save(destination / "muzzle-details.png")
    data = {"status": "muzzle alternatives awaiting selection", "base": "v9/fur-details.png",
            "canvas": [64, 64], "detailPixels": counts, "mouth": "C14 brown, unchanged",
            "eyeHighlight": "upper-right, unchanged", "emptyGapRow": 32}
    (destination / "manifest.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated six muzzle treatments: selected fur, eyes, nose, smile shape, and silhouette preserved.")
    print(counts)


if __name__ == "__main__":
    main()
