"""Compact front-facing sit without a protruding side haunch."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def make_pose():
    base = load("v9/fur-details.png")
    image = Image.new("RGBA", (64, 64))
    # A small tail peeks behind the torso, rather than widening the seated rump.
    curl = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(curl, (29, 38))
    draw = ImageDraw.Draw(image)
    draw.polygon([(18, 34), (29, 34), (32, 38), (33, 44),
                  (35, 49), (35, 53), (33, 55), (16, 55),
                  (14, 53), (14, 49), (16, 41)], fill=PALETTE["outline"])
    draw.polygon([(19, 36), (28, 36), (30, 39), (31, 45),
                  (33, 49), (33, 52), (31, 53), (17, 53),
                  (16, 51), (17, 43)], fill=PALETTE["coat"])
    draw.line([(31, 45), (32, 49), (32, 51)], fill=PALETTE["coat_shadow"])
    draw.polygon([(18, 36), (29, 36), (29, 40), (27, 43),
                  (24, 45), (21, 44), (19, 41)], fill=PALETTE["cream"])
    draw.polygon([(20, 37), (27, 37), (27, 40), (24, 43),
                  (22, 42)], fill=PALETTE["cream_light"])
    draw.line((23, 47, 23, 54), fill=PALETTE["outline"])
    for left, right in ((16, 21), (25, 31)):
        draw.rectangle((left, 51, right, 54), fill=PALETTE["cream"])
        draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_light"])
        draw.line((left + 2, 53, left + 2, 54), fill=PALETTE["cream_shadow"])
    image.alpha_composite(base.crop((5, 0, 37, 42)), (7, -2))
    return image


def main():
    sprite = make_pose()
    assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    destination = ART / "v17"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-tucked.png")
    sheet = Image.new("RGB", (850, 820), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 30), "POCKET PUP / TUCKED SITTING POSE", 28)
    label(draw, (40, 80), "Slim body / little tail peek / cream paws + toe lines", 19)
    large = sprite.resize((640, 640), Image.Resampling.NEAREST)
    sheet.paste(large, (105, 100), large)
    label(draw, (40, 770), "Body sits beneath the head; back legs are tucked behind.", 19)
    sheet.save(destination / "sitting-review.png")
    validate_source_sizes(Path(__file__).parent)
    print("Validated compact sitting revision; animation work remains paused.")


if __name__ == "__main__":
    main()
