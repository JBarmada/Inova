"""Review three new folds between unchanged neutral and approved sitting."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from folding_sit import fold
from full_sheet import ART, load
from rest_poses import isolated_head
from sheet import BACKGROUND, label
from validate import validate_source_sizes


def validate(frames):
    assert frames[0].tobytes() == load("v9/fur-details.png").tobytes()
    sitting = load("v26/sitting-idle.png")
    assert frames[-1].tobytes() == sitting.tobytes()
    for index, sprite in enumerate(frames[1:4]):
        assert sprite.getbbox()[3] == 56
        assert sprite.crop((15, 50, 28, 56)).tobytes() == sitting.crop((15, 50, 28, 56)).tobytes()
        assert sprite.crop((17, 42, 26, 49)).tobytes() == sitting.crop((17, 42, 26, 49)).tobytes()
        hy = -(index + 1)
        head = isolated_head()
        for y in range(3, 42):
            for x in range(64):
                pixel = head.getpixel((x, y))
                if pixel[3]:
                    assert sprite.getpixel((x, y + hy)) == pixel, (index, x, y)
        for y in range(37 + hy, 44 + hy):
            for x in range(18, 26):
                assert sprite.getpixel((x, y))[3] == 255


def export(frames, destination):
    durations = [1400, 900, 900, 900, 1800]
    titles = ["1 / NEUTRAL", "2 / FOLD 1", "3 / FOLD 2", "4 / FOLD 3", "5 / APPROVED SIT"]
    sheet = Image.new("RGB", (2080, 930), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (35, 25), "NEUTRAL > SIT / FOLDED REAR LEGS", 32)
    label(draw, (35, 78), "Only frames 2-4 redrawn / fixed chest and front paws / neutral and final sit unchanged", 21)
    previews = []
    for index, (sprite, title, duration) in enumerate(zip(frames, titles, durations)):
        sprite.save(destination / f"{index:02}.png")
        x = 20 + index * 412
        label(draw, (x + 10, 140), title, 25)
        large = sprite.resize((384, 384), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 185), large)
        label(draw, (x + 15, 590), f"HOLD: {duration / 1000:g}s", 20)
        close = sprite.crop((8, 35, 49, 57)).resize((328, 176), Image.Resampling.NEAREST)
        sheet.paste(close, (x + 25, 665), close)
        preview = Image.new("RGB", (640, 730), BACKGROUND)
        screen = ImageDraw.Draw(preview)
        label(screen, (30, 25), "NEUTRAL > SIT / FOLD REVIEW", 26)
        label(screen, (30, 75), title, 27)
        full = sprite.resize((512, 512), Image.Resampling.NEAREST)
        preview.paste(full, (64, 130), full)
        label(screen, (30, 680), f"Frame {index + 1}/5 / hold {duration / 1000:g}s", 22)
        previews.append(preview)
    label(draw, (35, 885), "Lower row: chest and leg close-ups. Later transition work remains paused.", 23)
    sheet.save(destination / "neutral-to-sit-frames.png")
    previews[0].save(destination / "neutral-to-sit-slow.gif", save_all=True,
                     append_images=previews[1:], duration=durations, disposal=2, loop=0)
    with Image.open(destination / "neutral-to-sit-slow.gif") as gif:
        assert gif.n_frames == 5
        assert [gif.seek(i) or gif.info["duration"] for i in range(5)] == durations


def main():
    frames = [load("v9/fur-details.png"), *[fold(i)[0] for i in range(3)],
              load("v26/sitting-idle.png")]
    validate(frames)
    destination = ART / "v30"
    destination.mkdir(parents=True, exist_ok=True)
    export(frames, destination)
    report = {"status": "neutral-to-sit review; later work paused", "changedFrames": [2, 3, 4],
              "checks": ["exact neutral", "exact approved sit", "identical front paw pixels in frames 2-5",
                         "identical chest core in frames 2-5", "native translated head", "solid neck overlap"],
              "timingMs": [1400, 900, 900, 900, 1800]}
    (destination / "review.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated unchanged endpoints, fixed chest/front paw pixels in moving frames, original heads and neck overlap.")


if __name__ == "__main__":
    main()
