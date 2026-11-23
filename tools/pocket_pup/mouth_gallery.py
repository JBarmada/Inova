"""Full-sprite neutral mouth gallery with a measured one-pixel nose gap."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

from refine_study import CORNERS
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]
WIDTHS = (8, 10, 12, 14)
FAMILIES = {"A": "CLASSIC", "B": "SOFT", "C": "DEEP", "D": "FELINE"}


def lobe_points(family, half):
    if family == "A":
        return [(0, 0), (0, 1), (1, 2), (half - 2, 2), (half - 1, 1), (half - 1, 0)]
    if family == "B":
        return [(0, 0), (0, 1), (1, 2), (half - 3, 2), (half - 2, 1), (half - 1, 0)]
    if family == "C":
        return [(0, 0), (0, 1), (1, 2), (1, 3), (half - 3, 3),
                (half - 2, 2), (half - 1, 1), (half - 1, 0)]
    return [(0, 1), (0, 2), (1, 3), (half - 3, 3),
            (half - 2, 2), (half - 2, 1), (half - 1, 0)]


def create_variant(source, family, width, corner="UR"):
    image = source.copy()
    draw = ImageDraw.Draw(image)
    draw.rectangle((13, 32, 26, 39), fill=PALETTE["cream_light"])
    left, half = (40 - width) // 2, width // 2
    points = lobe_points(family, half)
    for mirror in (False, True):
        transformed = [(left + (width - 1 - x if mirror else x), 33 + y) for x, y in points]
        draw.line(transformed, fill=PALETTE["mouth_black"])
    for eye_x in (13, 24):
        draw.rectangle((eye_x, 27, eye_x + 2, 29), fill=PALETTE["outline"])
        dx, dy = CORNERS[corner]
        draw.point((eye_x + dx, 27 + dy), fill=PALETTE["eye_white"])
    return image


def validate(source, image):
    assert image.size == (64, 64) and image.mode == "RGBA"
    assert image.getchannel("A").tobytes() == source.getchannel("A").tobytes()
    cream = tuple(bytes.fromhex(PALETTE["cream_light"][1:])) + (255,)
    black = (0, 0, 0, 255)
    white = tuple(bytes.fromhex(PALETTE["eye_white"][1:])) + (255,)
    assert all(image.getpixel((x, 32)) == cream for x in range(13, 27)), "Gap is not clear."
    assert any(image.getpixel((x, 33)) == black for x in range(18, 22)), "Gap exceeds one pixel."
    for eye_x in (13, 24):
        assert sum(image.getpixel((x, y)) == white for y in range(27, 30)
                   for x in range(eye_x, eye_x + 3)) == 1
    for y in range(64):
        for x in range(64):
            in_eyes = 27 <= y <= 29 and (13 <= x <= 15 or 24 <= x <= 26)
            in_mouth = 13 <= x <= 26 and 32 <= y <= 39
            if not (in_eyes or in_mouth):
                assert image.getpixel((x, y)) == source.getpixel((x, y))


def draw_sprite(sheet, sprite, x, y):
    enlarged = sprite.resize((320, 320), Image.Resampling.NEAREST)
    sheet.paste(enlarged, (x, y), enlarged)


def gallery(variants, families, number):
    sheet = Image.new("RGB", (1600, 1050), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (42, 30), f"POCKET PUP / FULL SPRITE GALLERY {number}", 32)
    label(draw, (42, 83), "Every dog: black :3 mouth, exactly one pixel below the nose. No connector.", 20)
    for row, family in enumerate(families):
        for column, width in enumerate(WIDTHS):
            x, y = 40 + column * 390, 145 + row * 420
            code = f"{family}{width}"
            label(draw, (x + 28, y), f"{code} / {FAMILIES[family]}", 23)
            draw_sprite(sheet, variants[code], x, y + 30)
            label(draw, (x + 28, y + 356), f"{width}px wide / upper-right dot", 17)
    label(draw, (42, 1000), "Same body, eyes, nose, palette, and scale. Only the smile shape and width differ.", 19)
    return sheet


def eye_gallery(variants):
    sheet = Image.new("RGB", (1600, 570), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (42, 30), "POCKET PUP / SAME B12 SMILE, FOUR EYE CORNERS", 29)
    for column, (corner, title) in enumerate(zip(CORNERS, ("UPPER LEFT", "UPPER RIGHT", "LOWER LEFT", "LOWER RIGHT"))):
        x = 40 + column * 390
        label(draw, (x + 28, 110), f"B12-{corner} / {title}", 20)
        draw_sprite(sheet, variants[f"B12-{corner}"], x, 155)
    label(draw, (42, 520), "One white native pixel per eye. Mouth keeps its one-pixel gap in every option.", 19)
    return sheet


def main():
    source_path = ROOT / "art/pocket-pup/v6/neutral-connected.png"
    source = Image.open(source_path).convert("RGBA")
    destination = ROOT / "art/pocket-pup/v8"
    destination.mkdir(parents=True, exist_ok=True)
    variants = {}
    for family in FAMILIES:
        for width in WIDTHS:
            code = f"{family}{width}"
            image = create_variant(source, family, width)
            validate(source, image)
            image.save(destination / f"{code}.png")
            variants[code] = image
    for corner in CORNERS:
        code = f"B12-{corner}"
        image = create_variant(source, "B", 12, corner)
        validate(source, image)
        image.save(destination / f"{code}.png")
        variants[code] = image
    gallery(variants, ("A", "B"), 1).save(destination / "full-dogs-classic-soft.png")
    gallery(variants, ("C", "D"), 2).save(destination / "full-dogs-deep-feline.png")
    eye_gallery(variants).save(destination / "full-dogs-eye-corners.png")
    metadata = {"status": "review alternatives, not integrated", "frame": [64, 64],
                "noseRows": [30, 31], "emptyGapRow": 32, "mouthTopRow": 33,
                "widths": WIDTHS, "families": FAMILIES, "corners": CORNERS,
                "sourceSha256": hashlib.sha256(source_path.read_bytes()).hexdigest()}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated 20 full sprites: 16 mouth options and four eye-corner comparisons; exact one-pixel gap.")


if __name__ == "__main__":
    main()
