"""Center the sitting torso and use continuous paired neck-to-haunch contours."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from head_edge_fix import corrected_head
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def torso(draw):
    # Paired row bounds share x21 as their center and widen without a pinch.
    for y in range(35, 54):
        left = 12 if y < 40 else 11 if y < 43 else 10 if y < 46 else 9
        right = 42 - left
        draw.line((left, y, right, y), fill=PALETTE["outline"])
        draw.line((left + 1, y, right - 1, y), fill=PALETTE["coat"])
        draw.point((left + 1, y), fill=PALETTE["coat_shadow"])
        draw.point((right - 1, y), fill=PALETTE["coat_shadow"])
    # Tucked back paws close the two sides at a shared ground height.
    draw.line((10, 54, 15, 54), fill=PALETTE["outline"])
    draw.line((27, 54, 32, 54), fill=PALETTE["outline"])
    draw.polygon([(14, 35), (28, 35), (28, 39), (26, 42),
                  (24, 44), (21, 46), (18, 44), (16, 42),
                  (14, 39)], fill=PALETTE["cream"])
    draw.polygon([(16, 35), (26, 35), (26, 39), (24, 42),
                  (21, 44), (18, 42), (16, 39)], fill=PALETTE["cream_light"])
    draw.line((19, 44, 21, 45), fill=PALETTE["cream_shadow"])


def paws(draw):
    for x in (15, 27):
        draw.line((x, 46, x, 53), fill=PALETTE["outline"])
    draw.line((21, 47, 21, 54), fill=PALETTE["outline"])
    for left, right in ((16, 20), (22, 26)):
        draw.line((left, 54, right, 54), fill=PALETTE["outline"])
        draw.line((left + 1, 55, right - 1, 55), fill=PALETTE["outline"])
        draw.polygon([(left, 51), (left + 1, 50), (right - 1, 50),
                      (right, 51), (right, 53), (right - 1, 54),
                      (left + 1, 54), (left, 53)], fill=PALETTE["cream"])
        draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_light"])
        draw.line((left + 1, 54, right - 1, 54), fill=PALETTE["cream_shadow"])
    for left, right in ((10, 14), (28, 32)):
        draw.line((left, 52, right, 52), fill=PALETTE["cream"])
        draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_shadow"])


def make_pose():
    base = load("v9/fur-details.png")
    image = Image.new("RGBA", (64, 64))
    tail = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, (29, 39))
    draw = ImageDraw.Draw(image)
    torso(draw)
    paws(draw)
    head = corrected_head(base)
    image.alpha_composite(head, (0, -3))
    previous = load("v24/sitting-idle.png")
    for y in range(3, 42):
        for x in range(64):
            if head.getpixel((x, y))[3]:
                assert image.getpixel((x, y - 3)) == previous.getpixel((x, y - 3))
    return image


def main():
    sprite = make_pose()
    destination = ART / "v25"
    destination.mkdir(parents=True, exist_ok=True)
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    sprite.save(destination / "sitting-idle.png")
    sheet = Image.new("RGB", (1200, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / CENTERED BODY + CONTINUOUS OUTLINE", 27)
    label(draw, (40, 82), "Body centered beneath the head / paired shoulder slopes / head pixels unchanged", 19)
    for x, title, dog in ((40, "BEFORE", load("v24/sitting-idle.png")), (620, "CENTERED REVISION", sprite)):
        large = dog.resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 140), large)
        label(draw, (x + 40, 700), title, 25)
    sheet.save(destination / "body-comparison.png")
    validate_source_sizes(Path(__file__).parent)
    print("Validated unchanged head; paired torso bounds centered at x21 widen continuously toward the base.")


if __name__ == "__main__":
    main()
