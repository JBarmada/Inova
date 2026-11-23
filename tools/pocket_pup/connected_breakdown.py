"""One connected seated breakdown instead of three separately drawn leg pieces."""
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw

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
    image.alpha_composite(tail, (33, 35))
    draw = ImageDraw.Draw(image)
    # One perimeter covers the torso, thigh, folded hock and tucked rear paw.
    draw.polygon([(13, 35), (28, 35), (33, 37), (37, 39),
                  (40, 42), (41, 45), (41, 48), (39, 50),
                  (36, 51), (36, 53), (34, 55), (30, 55),
                  (28, 53), (13, 53), (11, 50), (11, 42)], fill=PALETTE["outline"])
    draw.polygon([(15, 36), (27, 36), (32, 39), (36, 40),
                  (38, 43), (39, 46), (39, 48), (36, 49),
                  (34, 51), (34, 53), (31, 53), (29, 51),
                  (15, 51), (13, 49), (13, 42)], fill=PALETTE["coat"])
    # A short, low-contrast inner fold suggests the knee without cutting it off.
    draw.line([(34, 44), (32, 46), (32, 48)], fill=PALETTE["coat_shadow"])
    draw.line([(37, 44), (38, 46), (37, 48)], fill=PALETTE["coat_shadow"])
    draw.line([(33, 40), (35, 41), (36, 42)], fill=PALETTE["coat_light"])
    draw.polygon([(31, 51), (34, 51), (35, 52), (34, 53),
                  (31, 53), (30, 52)], fill=PALETTE["cream"])
    draw.line((32, 51, 33, 51), fill=PALETTE["cream_light"])
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


def validate(sprite, thigh_start=(36, 46)):
    approved = load("v26/sitting-idle.png")
    for box in ((15, 50, 28, 56), (17, 42, 26, 49)):
        assert sprite.crop(box).tobytes() == approved.crop(box).tobytes()
    head = isolated_head()
    for y in range(3, 42):
        for x in range(64):
            if head.getpixel((x, y))[3]:
                assert sprite.getpixel((x, y - 2)) == head.getpixel((x, y))
    # Thigh-to-torso path must connect through coat, not merely a touching outline.
    colors = {(*bytes.fromhex(PALETTE[name][1:]), 255)
              for name in ("coat", "coat_shadow", "coat_light", "cream", "cream_shadow", "cream_light")}
    start, target = thigh_start, (29, 43)
    queue, seen = deque([start]), {start}
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 27 <= nx <= 40 and 39 <= ny <= 53 and (nx, ny) not in seen:
                if sprite.getpixel((nx, ny)) in colors:
                    seen.add((nx, ny))
                    queue.append((nx, ny))
    assert target in seen, "Thigh disconnected from torso fill"
    assert sprite.getbbox()[3] == 56


def export(frames, destination, slow):
    timings = [1400, 900, 1800] if slow else [1000, 160, 1400]
    previews = []
    for index, (name, sprite) in enumerate(frames):
        preview = Image.new("RGB", (640, 720), BACKGROUND)
        draw = ImageDraw.Draw(preview)
        label(draw, (30, 25), "NEUTRAL > TUCK > SIT", 30)
        label(draw, (30, 80), name, 25)
        large = sprite.resize((512, 512), Image.Resampling.NEAREST)
        preview.paste(large, (64, 130), large)
        label(draw, (30, 670), "Slow pose review" if slow else "Short movement preview", 22)
        previews.append(preview)
    name = "neutral-to-sit-slow.gif" if slow else "neutral-to-sit.gif"
    previews[0].save(destination / name, save_all=True, append_images=previews[1:],
                     duration=timings, loop=0, disposal=2)
    with Image.open(destination / name) as gif:
        assert gif.n_frames == 3


def main():
    middle = breakdown()
    validate(middle)
    frames = [("1 / NEUTRAL", load("v9/fur-details.png")), ("2 / TUCKED BREAKDOWN", middle),
              ("3 / APPROVED SIT", load("v26/sitting-idle.png"))]
    destination = ART / "v31"
    destination.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGB", (1500, 1020), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (35, 25), "NEUTRAL > ONE CONNECTED TUCK > SIT", 31)
    label(draw, (35, 80), "Original endpoints / fixed chest and forepaws / one body-and-thigh silhouette", 21)
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
    print("Exported one connected breakdown; endpoints, chest, paws, head, and coat-fill connectivity verified.")


if __name__ == "__main__":
    main()
