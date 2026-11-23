"""Rounder sitting options, lower tail, and tiny paw toe marks."""
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def tail(image):
    draw = ImageDraw.Draw(image)
    draw.polygon([(35, 39), (37, 36), (41, 34), (46, 34), (49, 36),
                  (51, 40), (51, 45), (49, 49), (45, 51), (39, 51),
                  (36, 48)], fill=PALETTE["outline"])
    draw.polygon([(37, 40), (39, 37), (42, 36), (46, 36), (49, 39),
                  (49, 44), (47, 48), (43, 49), (38, 47)], fill=PALETTE["coat_light"])
    draw.polygon([(40, 37), (46, 37), (48, 40), (48, 44), (46, 47),
                  (42, 48), (40, 46), (44, 45), (45, 43), (44, 40),
                  (41, 40), (39, 42), (38, 40)], fill=PALETTE["cream"])
    draw.line([(39, 43), (40, 41), (43, 41), (44, 43), (43, 45),
               (40, 45)], fill=PALETTE["coat_shadow"], width=2)


def body(image, top):
    draw = ImageDraw.Draw(image)
    draw.polygon([(19, top), (30, top), (33, top + 4), (34, 42),
                  (39, 44), (42, 48), (42, 52), (40, 54), (34, 55),
                  (16, 55), (14, 53), (14, 45), (16, top + 5)], fill=PALETTE["outline"])
    draw.polygon([(19, top + 2), (29, top + 2), (31, top + 5),
                  (32, 44), (37, 45), (40, 48), (40, 52), (37, 53),
                  (16, 53), (16, 45)], fill=PALETTE["coat"])
    draw.polygon([(32, 46), (36, 46), (39, 49), (39, 52), (33, 53),
                  (30, 51)], fill=PALETTE["coat_shadow"])
    draw.line([(34, 46), (37, 47), (38, 48)], fill=PALETTE["coat_light"])
    draw.polygon([(17, top + 2), (30, top + 2), (30, 40), (28, 43),
                  (25, 46), (21, 45), (18, 41)], fill=PALETTE["cream"])
    draw.polygon([(19, top + 3), (28, top + 3), (28, 40), (25, 43),
                  (22, 43), (20, 40)], fill=PALETTE["cream_light"])
    # Short toe seams use a soft coat shade rather than thick black bars.
    draw.line((23, 46, 23, 54), fill=PALETTE["outline"])
    draw.line((31, 46, 31, 53), fill=PALETTE["outline"])
    for left, right in ((16, 21), (25, 29)):
        draw.rectangle((left, 51, right, 54), fill=PALETTE["cream"])
        draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_light"])
        draw.line((left + 2, 53, left + 2, 54), fill=PALETTE["cream_shadow"])
    draw.line((35, 52, 39, 52), fill=PALETTE["cream"])


def make_pose(head_shift):
    image = Image.new("RGBA", (64, 64))
    tail(image)
    body(image, 35 + head_shift)
    head = load("v9/fur-details.png").crop((5, 0, 37, 42))
    image.alpha_composite(head, (7, head_shift))
    return image


def comparison(items):
    sheet = Image.new("RGB", (1500, 890), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (40, 28), "POCKET PUP / SITTING SHAPE + PAWS", 32)
    label(draw, (40, 80), "Body and tail revision / face unchanged / small toe marks on the front paws", 20)
    for index, (title, sprite, note) in enumerate(items):
        x = 35 + index * 490
        label(draw, (x + 10, 140), title, 25)
        large = sprite.resize((448, 448), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 175), large)
        label(draw, (x + 10, 665), note, 17)
        close = sprite.crop((13, 48, 33, 56)).resize((240, 96), Image.Resampling.NEAREST)
        sheet.paste(close, (x + 90, 720), close)
    label(draw, (40, 850), "Transition animation is paused while the sitting silhouette is being reviewed.", 19)
    return sheet


def main():
    destination = ART / "v16"
    destination.mkdir(parents=True, exist_ok=True)
    compact, upright = make_pose(-2), make_pose(-5)
    for name, sprite in (("sit-compact", compact), ("sit-upright", upright)):
        assert sprite.size == (64, 64) and sprite.getbbox()[3] == 56
        assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
        sprite.save(destination / f"{name}.png")
    items = [("PREVIOUS", load("v15/sitting-idle.png"), "Previous body and tail placement."),
             ("A / ROUNDER SIT", compact, "Lower curl tucked behind the hip."),
             ("B / UPRIGHT SIT", upright, "More chest space; same lower curl.")]
    comparison(items).save(destination / "sitting-options.png")
    validate_source_sizes(Path(__file__).parent)
    print("Created two sitting revisions with lower tails and subtle paw lines; animation remains paused.")


if __name__ == "__main__":
    main()
