"""Low-contrast muzzle pads and pores placed inside the smile's two cups."""
import json
from pathlib import Path

from PIL import Image

from muzzle_study import comparison
from polish_study import rgba
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]
LEFT_PAD = {(x, 33) for x in range(14, 19)} | {(x, 34) for x in range(14, 19)} | {(x, 35) for x in range(15, 18)}
PADS = LEFT_PAD | {(39 - x, y) for x, y in LEFT_PAD}
DOTS = [(15, 34), (17, 34), (22, 34), (24, 34)]


def blend(image, point, tint, amount):
    assert point in PADS, point
    old = image.getpixel(point)
    target = rgba(tint)
    image.putpixel(point, tuple(round(a * (1 - amount) + b * amount)
                               for a, b in zip(old[:3], target[:3])) + (old[3],))


def pores(base, strength, extra=False):
    image = base.copy()
    points = DOTS + ([(16, 35), (23, 35)] if extra else [])
    for point in points:
        blend(image, point, "deep_shadow", strength)
    return image


def pad_volume(base):
    image = base.copy()
    for point in PADS:
        blend(image, point, "coat_shadow", {33: 0.025, 34: 0.055, 35: 0.10}[point[1]])
    for point in ((14, 33), (15, 33), (21, 33), (22, 33)):
        blend(image, point, "eye_white", 0.16)
    return image


def curved_edge(base):
    image = base.copy()
    for point in ((18, 34), (17, 35), (25, 34), (24, 35)):
        blend(image, point, "coat_shadow", 0.11)
    for point in ((14, 33), (15, 33), (21, 33), (22, 33)):
        blend(image, point, "eye_white", 0.20)
    return image


def validate(base, image):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == base.getchannel("A").tobytes()
    changes = []
    for y in range(64):
        for x in range(64):
            old, new = base.getpixel((x, y)), image.getpixel((x, y))
            if old != new:
                assert (x, y) in PADS, (x, y)
                assert max(abs(a - b) for a, b in zip(old[:3], new[:3])) <= 40
                changes.append([x, y, list(new[:3])])
    return changes


def main():
    base = Image.open(ROOT / "art/pocket-pup/v9/fur-details.png").convert("RGBA")
    variants = [
        ("1 / CLEAN BASE", base, ["Your chosen fur-details dog.", "Reference with no added muzzle detail."]),
        ("2 / FAINT INNER DOTS", pores(base, 0.10), ["Four dots inside the two smile cups.", "Only a 10% warm-brown tint."]),
        ("3 / SOFT WHISKER PORES", pores(base, 0.18, True), ["Three faint dots inside each cup.", "An 18% tint, rather than solid brown."]),
        ("4 / ROUNDED PADS", pad_volume(base), ["Gentle tint within each rounded pad.", "Slightly lighter tops, warmer bottoms."]),
        ("5 / CURVED EDGE LIGHT", curved_edge(base), ["Tiny lower-right shadows inside pads.", "A little light on the upper-left edges."]),
        ("6 / VOLUME + FAINT DOTS", pores(pad_volume(base), 0.10), ["The soft rounded pads with inner dots.", "No detached shadow below the mouth."]),
    ]
    names = ("clean-base", "faint-inner-dots", "soft-whisker-pores", "rounded-pads", "curved-edge-light", "volume-and-dots")
    destination = ROOT / "art/pocket-pup/v11"
    destination.mkdir(parents=True, exist_ok=True)
    details = {}
    for name, (_, sprite, _) in zip(names, variants):
        details[name] = validate(base, sprite)
        sprite.save(destination / f"{name}.png")
    comparison(variants, "POCKET PUP / SOFTER DETAILS INSIDE THE SMILE",
               "Freckles stay inside the :3 cups. Low-contrast colors blend into the cream muzzle.").save(destination / "blended-muzzle.png")
    metadata = {"status": "review alternatives, not integrated", "base": "v9/fur-details.png",
                "canvas": [64, 64], "padPixels": sorted(PADS),
                "technique": "tints preblended against local fur; crisp opaque sprite pixels retained",
                "changedPixelsAndColors": details}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated six subtle studies: every change is inside the smile cups, with low color contrast.")


if __name__ == "__main__":
    main()
