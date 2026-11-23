"""Simpler dog smiles and flat-color bleps, using the photo only for mood."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]
PINK = "#e1a0a0"


def clean_mouth(base):
    image = base.copy()
    ImageDraw.Draw(image).rectangle((13, 33, 26, 40), fill=PALETTE["cream_light"])
    return image


def tiny_peek(base):
    image = clean_mouth(base)
    draw = ImageDraw.Draw(image)
    draw.line([(17, 33), (17, 34), (18, 35), (21, 35), (22, 34), (22, 33)],
              fill=PALETTE["outline"])
    draw.rectangle((19, 35, 20, 36), fill=PINK)
    return image


def dog_smile(base, happy_eyes=False):
    image = clean_mouth(base)
    draw = ImageDraw.Draw(image)
    draw.polygon([(16, 33), (17, 34), (22, 34), (23, 33), (23, 35),
                  (22, 36), (21, 37), (18, 37), (17, 36), (16, 35)],
                 fill=PALETTE["outline"])
    draw.rectangle((18, 35, 21, 36), fill=PINK)
    draw.line((19, 37, 20, 37), fill=PINK)
    if happy_eyes:
        for x in (13, 24):
            draw.rectangle((x, 27, x + 2, 29), fill=PALETTE["coat"])
            draw.line([(x, 28), (x + 1, 27), (x + 2, 28)], fill=PALETTE["outline"])
    return image


def check(base, image):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == base.getchannel("A").tobytes()
    new_colors = set()
    original_colors = {base.getpixel((x, y)) for x in range(64) for y in range(64)}
    for y in range(64):
        for x in range(64):
            old, new = base.getpixel((x, y)), image.getpixel((x, y))
            mouth = 13 <= x <= 26 and 33 <= y <= 40
            eyes = 27 <= y <= 29 and (13 <= x <= 15 or 24 <= x <= 26)
            if not (mouth or eyes):
                assert old == new, (x, y)
            if new not in original_colors:
                new_colors.add(new)
    assert new_colors == {(*bytes.fromhex(PINK[1:]), 255)}, new_colors


def comparison(variants):
    sheet = Image.new("RGB", (1500, 1000), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 30), "POCKET PUP / A SIMPLER LITTLE BLEP", 32)
    label(draw, (40, 85), "Softer dog smiles. One flat pink. No tongue shine, seam, shading, or colored border.", 19)
    for column, (title, sprite, note) in enumerate(variants):
        x = 35 + column * 490
        label(draw, (x + 15, 150), title, 24)
        full = sprite.resize((384, 384), Image.Resampling.NEAREST)
        sheet.paste(full, (x + 15, 180), full)
        close = sprite.crop((8, 23, 34, 43)).resize((260, 200), Image.Resampling.NEAREST)
        sheet.paste(close, (x + 75, 620), close)
        label(draw, (x + 15, 875), note, 17)
    label(draw, (40, 955), "Same dog and fur. The tongue is a small part of the smile rather than a separate shaded object.", 18)
    return sheet


def main():
    base = Image.open(ROOT / "art/pocket-pup/v9/fur-details.png").convert("RGBA")
    variants = [("1 / TINY PEEK", tiny_peek(base), "A small smile and just four pink pixels."),
                ("2 / SOFT DOG SMILE", dog_smile(base), "A little tongue sitting within the smile."),
                ("3 / HAPPY LITTLE PUP", dog_smile(base, True), "The same smile with happy closed eyes.")]
    destination = ROOT / "art/pocket-pup/v13"
    destination.mkdir(parents=True, exist_ok=True)
    counts = {}
    for name, (_, sprite, _) in zip(("tiny-peek", "soft-dog-smile", "happy-little-pup"), variants):
        check(base, sprite)
        sprite.save(destination / f"{name}.png")
        counts[name] = sum(sprite.getpixel((x, y)) == (*bytes.fromhex(PINK[1:]), 255)
                           for x in range(64) for y in range(64))
    comparison(variants).save(destination / "simple-blep-options.png")
    metadata = {"status": "review alternatives, not integrated", "canvas": [64, 64],
                "source": "v9/fur-details.png", "tongueColor": PINK, "tonguePixels": counts,
                "reference": "user-supplied Shiba photo: relaxed smile and tongue held within mouth",
                "constraints": "no tongue highlights, texture, seam, outline, or shading"}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated three simpler bleps, each using one flat tongue color and unchanged body/nose.")
    print(counts)


if __name__ == "__main__":
    main()
