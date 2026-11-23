"""Cute tongue-out expressions on the selected brown C14 fur-details sprite."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from polish_study import rgba
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]


def tongue(image, left, top, width, height):
    draw = ImageDraw.Draw(image)
    right, bottom = left + width - 1, top + height - 1
    draw.polygon([(left, top), (right, top), (right, bottom - 1),
                  (right - 1, bottom), (left + 1, bottom), (left, bottom - 1)],
                 fill=PALETTE["tongue_shadow"])
    draw.rectangle((left, top + 1, right, bottom - 1), fill=PALETTE["tongue"])
    draw.line((left + 1, bottom, right - 1, bottom), fill=PALETTE["tongue"])
    light = tuple(round(a * 0.75 + b * 0.25)
                  for a, b in zip(rgba("tongue")[:3], rgba("cream_light")[:3]))
    draw.point((left + 1, top + 1), fill=(*light, 255))
    return image


def tiny_blep(base):
    return tongue(base.copy(), 18, 35, 4, 3)


def happy_pant(base):
    image = base.copy()
    draw = ImageDraw.Draw(image)
    draw.rectangle((13, 33, 26, 39), fill=PALETTE["cream_light"])
    draw.polygon([(16, 33), (23, 33), (24, 34), (24, 36),
                  (22, 38), (17, 38), (15, 36), (15, 34)], fill=PALETTE["outline"])
    for x in (13, 24):
        draw.rectangle((x, 27, x + 2, 29), fill=PALETTE["coat"])
        draw.line([(x, 28), (x + 1, 27), (x + 2, 28)], fill=PALETTE["outline"])
    return tongue(image, 18, 35, 4, 5)


def check(base, image):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == base.getchannel("A").tobytes()
    for y in range(64):
        for x in range(64):
            expression_area = 13 <= x <= 26 and (27 <= y <= 29 or 33 <= y <= 39)
            if not expression_area:
                assert image.getpixel((x, y)) == base.getpixel((x, y)), (x, y)


def comparison(variants):
    image = Image.new("RGB", (1760, 980), BACKGROUND)
    draw = ImageDraw.Draw(image)
    label(draw, (40, 30), "POCKET PUP / TONGUE-OUT EXPRESSIONS", 32)
    label(draw, (40, 85), "Same chosen dog and fur detail. Little pink tongues, from a tiny blep to a happy pant.", 20)
    for column, (title, sprite, note) in enumerate(variants):
        x = 40 + column * 430
        label(draw, (x + 15, 150), title, 23)
        full = sprite.resize((384, 384), Image.Resampling.NEAREST)
        image.paste(full, (x, 185), full)
        face = sprite.crop((8, 23, 34, 43)).resize((260, 200), Image.Resampling.NEAREST)
        image.paste(face, (x + 60, 615), face)
        label(draw, (x + 15, 855), note, 17)
    label(draw, (40, 940), "Body, nose, silhouette, and outfit anchors are preserved. Expression art only; no sound added yet.", 18)
    return image


def preview(base, blep, destination):
    frames = []
    for sprite in (base, blep, base, blep):
        frame = Image.new("RGB", (384, 384), BACKGROUND)
        full = sprite.resize((384, 384), Image.Resampling.NEAREST)
        frame.paste(full, (0, 0), full)
        frames.append(frame)
    frames[0].save(destination / "tiny-blep-preview.gif", save_all=True,
                   append_images=frames[1:], duration=[900, 900, 600, 1300], loop=0)


def main():
    base = Image.open(ROOT / "art/pocket-pup/v9/fur-details.png").convert("RGBA")
    variants = [
        ("1 / TINY BLEP", tiny_blep(base), "A tiny peek from the :3 smile."),
        ("2 / LITTLE TONGUE", tongue(base.copy(), 18, 34, 4, 5), "A longer, rounded central tongue."),
        ("3 / SIDE BLEP", tongue(base.copy(), 23, 35, 3, 4), "A playful peek from one corner."),
        ("4 / HAPPY PANT", happy_pant(base), "Closed smiling eyes, open mouth."),
    ]
    names = ("tiny-blep", "little-tongue", "side-blep", "happy-pant")
    destination = ROOT / "art/pocket-pup/v12"
    destination.mkdir(parents=True, exist_ok=True)
    for name, (_, image, _) in zip(names, variants):
        check(base, image)
        image.save(destination / f"{name}.png")
    comparison(variants).save(destination / "tongue-out-options.png")
    preview(base, variants[0][1], destination)
    metadata = {"status": "expression study, not integrated", "canvas": [64, 64],
                "source": "v9/fur-details.png", "options": names,
                "preview": "Two static expressions alternating, not a full tongue animation cycle"}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated four tongue-out expressions: body, silhouette, nose, and anchors preserved.")


if __name__ == "__main__":
    main()
