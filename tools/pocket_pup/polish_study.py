"""Brown C14 mouth with restrained, palette-matched finishing alternatives."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]


def rgba(name):
    return tuple(bytes.fromhex(PALETTE[name][1:])) + (255,)


def brown_mouth(source):
    image = source.copy()
    for y in range(33, 37):
        for x in range(13, 27):
            if image.getpixel((x, y)) == (0, 0, 0, 255):
                image.putpixel((x, y), rgba("outline"))
    return image


def touch(image, points, color, allowed):
    for point in points:
        if image.getpixel(point) in {rgba(name) for name in allowed}:
            image.putpixel(point, rgba(color))


def face_shading(base):
    image = base.copy()
    touch(image, [(10, 35), (10, 36), (11, 37), (29, 35), (29, 36), (28, 37),
                  (15, 39), (16, 39), (17, 40), (22, 40), (23, 39), (24, 39)],
          "cream_shadow", ("cream_light", "cream"))
    touch(image, [(12, 33), (28, 33)], "cream", ("cream_light",))
    return image


def coat_details(base):
    image = base.copy()
    touch(image, [(32, 43), (33, 43), (34, 43), (35, 44), (36, 44)],
          "coat_light", ("coat", "coat_shadow"))
    touch(image, [(43, 45), (44, 45), (45, 46), (45, 47)],
          "coat_shadow", ("coat", "coat_light"))
    touch(image, [(17, 43), (18, 44), (19, 44), (25, 43), (26, 43)],
          "cream", ("cream_light",))
    touch(image, [(17, 51), (18, 51), (24, 52), (25, 52), (43, 51)],
          "cream_light", ("cream", "cream_shadow"))
    return image


def check(source, image):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == source.getchannel("A").tobytes()
    assert all(image.getpixel((x, 32)) == rgba("cream_light") for x in range(13, 27))
    for y in range(33, 37):
        for x in range(13, 27):
            if source.getpixel((x, y)) == (0, 0, 0, 255):
                assert image.getpixel((x, y)) == rgba("outline")
    for eye_x in (13, 24):
        for y in range(27, 30):
            for x in range(eye_x, eye_x + 3):
                assert image.getpixel((x, y)) == source.getpixel((x, y))
    allowed = {rgba(name) for name in PALETTE}
    assert all(image.getpixel((x, y)) in allowed for y in range(64) for x in range(64)
               if image.getpixel((x, y))[3])


def gallery(variants):
    image = Image.new("RGB", (1760, 980), BACKGROUND)
    draw = ImageDraw.Draw(image)
    label(draw, (40, 30), "POCKET PUP / C14 IN WARM BROWN", 34)
    label(draw, (40, 85), "Upper-right eye dots. Original smile shape. One-pixel nose gap. Subtle details only.", 20)
    for column, (name, sprite, notes) in enumerate(variants):
        x = 40 + column * 430
        label(draw, (x + 15, 150), name, 24)
        enlarged = sprite.resize((384, 384), Image.Resampling.NEAREST)
        image.paste(enlarged, (x, 185), enlarged)
        detail = sprite.crop((8, 23, 34, 43)).resize((260, 200), Image.Resampling.NEAREST)
        image.paste(detail, (x + 60, 615), detail)
        for row, note in enumerate(notes):
            label(draw, (x + 15, 850 + row * 28), note, 17)
    label(draw, (40, 940), "Same silhouette and anchors in every version. No extra shading below the eyes.", 18)
    return image


def main():
    source = Image.open(ROOT / "art/pocket-pup/v8/C14.png").convert("RGBA")
    base = brown_mouth(source)
    variants = [
        ("1 / CLEAN BROWN", base, ["C14 shape, dark-brown mouth.", "A clean comparison baseline."]),
        ("2 / SOFT FACE", face_shading(base), ["Tiny cream shadows at cheeks/chin.", "A little more muzzle depth."]),
        ("3 / FUR DETAILS", coat_details(base), ["Small shoulder and paw highlights.", "A few chest and coat details."]),
        ("4 / BALANCED", coat_details(face_shading(base)), ["Both treatments combined.", "Still the same simple pixel pup."]),
    ]
    destination = ROOT / "art/pocket-pup/v9"
    destination.mkdir(parents=True, exist_ok=True)
    names = ("clean-brown", "soft-face", "fur-details", "balanced")
    counts = {}
    for name, (_, sprite, _) in zip(names, variants):
        check(source, sprite)
        sprite.save(destination / f"{name}.png")
        counts[name] = sum(base.getpixel((x, y)) != sprite.getpixel((x, y))
                           for y in range(64) for x in range(64))
    gallery(variants).save(destination / "brown-and-details.png")
    metadata = {"status": "finishing study, not integrated", "base": "v8/C14.png",
                "mouthColor": PALETTE["outline"], "eyeHighlight": "upper-right",
                "emptyGapRow": 32, "canvas": [64, 64], "detailPixelsVersusBrownBase": counts}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated four brown C14 alternatives; eye highlights, gap, mouth shape, and silhouette preserved.")
    print(counts)


if __name__ == "__main__":
    main()
