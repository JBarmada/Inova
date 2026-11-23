"""Pull the single breakdown's hip and hind paw beneath the torso."""
from pathlib import Path

from PIL import Image, ImageDraw

from connected_breakdown import export, validate
from folding_sit import chest_layer
from full_sheet import ART, load
from rest_poses import isolated_head
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def breakdown():
    image = Image.new("RGBA", (64, 64))
    tail = load("v9/fur-details.png").crop((38, 24, 58, 44))
    tail = tail.resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (31, 36))
    draw = ImageDraw.Draw(image)
    draw.polygon([(13, 35), (28, 35), (30, 37), (32, 39),
                  (34, 42), (36, 45), (36, 48), (35, 50),
                  (34, 51), (34, 53), (32, 55), (29, 55),
                  (27, 53), (13, 53), (11, 50), (11, 42)], fill=PALETTE["outline"])
    draw.polygon([(15, 36), (27, 36), (29, 39), (31, 40),
                  (33, 43), (34, 46), (34, 48), (33, 49),
                  (32, 51), (32, 53), (30, 53), (28, 51),
                  (15, 51), (13, 49), (13, 42)], fill=PALETTE["coat"])
    draw.line([(31, 44), (30, 46), (30, 48)], fill=PALETTE["coat_shadow"])
    draw.line([(33, 44), (34, 46), (33, 48)], fill=PALETTE["coat_shadow"])
    draw.line([(30, 40), (31, 41), (32, 42)], fill=PALETTE["coat_light"])
    draw.polygon([(29, 51), (32, 51), (33, 52), (32, 53),
                  (29, 53), (28, 52)], fill=PALETTE["cream"])
    draw.line((30, 51, 31, 51), fill=PALETTE["cream_light"])
    fixed = chest_layer()
    dark = (*bytes.fromhex(PALETTE["outline"][1:]), 255)
    for y in range(35, 56):
        left, right = (11, 30) if y < 46 else (15, 27)
        for x in range(left, right + 1):
            color = fixed.getpixel((x, y))
            if color[3] and not (y < 46 and x >= 28 and color == dark):
                image.putpixel((x, y), color)
    image.alpha_composite(isolated_head(), (0, -2))
    return image


def main():
    middle = breakdown()
    validate(middle, (33, 46))
    previous = load("v31/01.png")
    assert middle.crop((0, 0, 28, 56)).tobytes() == previous.crop((0, 0, 28, 56)).tobytes()
    frames = [("1 / NEUTRAL", load("v9/fur-details.png")), ("2 / CLOSER TUCK", middle),
              ("3 / APPROVED SIT", load("v26/sitting-idle.png"))]
    destination = ART / "v32"
    destination.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGB", (1500, 1020), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (35, 25), "NEUTRAL > CLOSER TUCK > SIT", 32)
    label(draw, (35, 80), "Middle hip tucked five pixels inward / chest and front paws fixed / original endpoints", 20)
    for index, (title, sprite) in enumerate(frames):
        sprite.save(destination / f"{index:02}.png")
        x = 25 + index * 495
        label(draw, (x + 10, 145), title, 25)
        large = sprite.resize((448, 448), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 190), large)
        close = sprite.crop((8, 35, 49, 57)).resize((410, 220), Image.Resampling.NEAREST)
        sheet.paste(close, (x + 10, 715), close)
    sheet.save(destination / "three-pose-review.png")
    export(frames, destination, True)
    export(frames, destination, False)
    assert Image.open(destination / "00.png").tobytes() == load("v9/fur-details.png").tobytes()
    assert Image.open(destination / "02.png").tobytes() == load("v26/sitting-idle.png").tobytes()
    validate_source_sizes(Path(__file__).parent)
    print("Verified exact endpoints, unchanged left/chest/front-paw pixels, original head, and connected tucked thigh.")


if __name__ == "__main__":
    main()
