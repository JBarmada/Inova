"""Mouth-size and eye-corner alternatives built from the selected v6 B dog."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]
CORNERS = {"UL": (0, 0), "UR": (2, 0), "LL": (0, 2), "LR": (2, 2)}
MOUTHS = {
    "M1": ["#........#", "#...##...#", ".###..###."],
    "M2": ["#........#", "#...##...#", ".#.#..#.#.", "..#....#.."],
    "M3": ["#..........#", "#....##....#", ".#..#..#..#.", "..##....##.."],
}
NAMES = {"M1": "WIDER", "M2": "ROUNDER", "M3": "BIGGEST"}


def variant(source, mouth, corner):
    image = source.copy()
    draw = ImageDraw.Draw(image)
    for eye_x in (13, 24):
        draw.rectangle((eye_x, 27, eye_x + 2, 29), fill=PALETTE["outline"])
        dx, dy = CORNERS[corner]
        draw.point((eye_x + dx, 27 + dy), fill=PALETTE["eye_white"])
    draw.rectangle((14, 32, 25, 37), fill=PALETTE["cream_light"])
    pattern = MOUTHS[mouth]
    left = (40 - len(pattern[0])) // 2
    for row, pixels in enumerate(pattern):
        for column, pixel in enumerate(pixels):
            if pixel == "#":
                draw.point((left + column, 33 + row), fill=PALETTE["mouth_black"])
    draw.rectangle((19, 32, 20, 34), fill=PALETTE["mouth_black"])
    return image


def check(source, image, mouth, corner):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == source.getchannel("A").tobytes()
    white = tuple(bytes.fromhex(PALETTE["eye_white"][1:])) + (255,)
    for eye_x in (13, 24):
        whites = [(x - eye_x, y - 27) for y in range(27, 30)
                  for x in range(eye_x, eye_x + 3) if image.getpixel((x, y)) == white]
        assert whites == [CORNERS[corner]], (mouth, corner, whites)
    for y in range(64):
        for x in range(64):
            in_eyes = y in range(27, 30) and (13 <= x <= 15 or 24 <= x <= 26)
            in_mouth = 14 <= x <= 25 and 32 <= y <= 37
            if not (in_eyes or in_mouth):
                assert image.getpixel((x, y)) == source.getpixel((x, y))


def comparison(variants):
    image = Image.new("RGB", (1460, 1130), BACKGROUND)
    draw = ImageDraw.Draw(image)
    label(draw, (40, 30), "POCKET PUP / MOUTH SIZE x EYE HIGHLIGHT", 30)
    label(draw, (40, 80), "All smiles: black, connected, one pixel lower than selected B. Nose and eyes stay put.", 18)
    columns = [("UL", "UPPER LEFT"), ("UR", "UPPER RIGHT"),
               ("LL", "LOWER LEFT"), ("LR", "LOWER RIGHT")]
    for column, (corner, title) in enumerate(columns):
        x = 180 + column * 310
        label(draw, (x, 155), corner + " / " + title, 19)
        for row, mouth in enumerate(MOUTHS):
            y = 220 + row * 270
            face = variants[(mouth, corner)].crop((8, 23, 32, 42))
            face = face.resize((240, 190), Image.Resampling.NEAREST)
            image.paste(face, (x, y), face)
            label(draw, (x + 50, y + 205), mouth + "-" + corner, 18)
    for row, mouth in enumerate(MOUTHS):
        y = 270 + row * 270
        label(draw, (25, y), mouth, 26)
        label(draw, (25, y + 40), NAMES[mouth], 16)
        label(draw, (25, y + 75), f"{len(MOUTHS[mouth][0])} x {len(MOUTHS[mouth])}", 16)
    label(draw, (40, 1070), "Choose a code, for example M2-UR. Every highlight is exactly one native pixel.", 19)
    return image


def full_body(source, variants):
    sheet = Image.new("RGB", (1440, 490), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 25), "SMILE SIZE / FULL DOG COMPARISON", 28)
    entries = [("SELECTED B", source)] + [(name + "-UR", variants[(name, "UR")]) for name in MOUTHS]
    for index, (name, sprite) in enumerate(entries):
        x = 45 + index * 350
        label(draw, (x + 40, 95), name, 22)
        enlarged = sprite.resize((256, 256), Image.Resampling.NEAREST)
        sheet.paste(enlarged, (x, 145), enlarged)
    label(draw, (40, 438), "New mouths are one pixel lower and larger. All three use upper-right white dots here.", 18)
    return sheet


def main():
    source = Image.open(ROOT / "art/pocket-pup/v6/neutral-connected.png").convert("RGBA")
    destination = ROOT / "art/pocket-pup/v7"
    destination.mkdir(parents=True, exist_ok=True)
    variants = {}
    for mouth in MOUTHS:
        for corner in CORNERS:
            image = variant(source, mouth, corner)
            check(source, image, mouth, corner)
            image.save(destination / f"{mouth}-{corner}.png")
            variants[(mouth, corner)] = image
    comparison(variants).save(destination / "mouth-and-eyes.png")
    full_body(source, variants).save(destination / "full-dog-comparison.png")
    manifest = {"status": "alternatives awaiting selection", "canvas": [64, 64],
                "source": "v6/neutral-connected.png", "mouthTopY": 33,
                "previousMouthTopY": 32, "connectorRows": [32, 33, 34],
                "mouthPatterns": MOUTHS, "eyeCorners": CORNERS,
                "eyeOrigin": [[13, 27], [24, 27]], "highlightPixelsPerEye": 1}
    (destination / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated 12 alternatives: same silhouette, isolated changes, one highlight per eye.")


if __name__ == "__main__":
    main()
