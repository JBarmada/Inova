"""Slow the existing neutral-to-sit frames without editing their artwork."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART
from sheet import BACKGROUND, label
from validate import validate_source_sizes


def main():
    source = ART / "v28"
    destination = ART / "v29"
    destination.mkdir(parents=True, exist_ok=True)
    records = json.loads((source / "animation.json").read_text(encoding="utf-8"))["frames"][:5]
    durations = [1400, 900, 900, 900, 1800]
    titles = ["1 / NEUTRAL", "2 / BEND 1", "3 / BEND 2", "4 / BEND 3", "5 / SITTING"]
    sheet = Image.new("RGB", (2080, 930), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (35, 25), "NEUTRAL > SIT / FIVE EXISTING FRAMES", 32)
    label(draw, (35, 78), "Artwork unchanged. Moving frames slowed from 180ms to 900ms each (5x slower).", 22)
    previews = []
    for index, (record, duration, title) in enumerate(zip(records, durations, titles)):
        sprite = Image.open(source / record["file"]).convert("RGBA")
        sprite.save(destination / f"{index:02}.png")
        assert Image.open(destination / f"{index:02}.png").tobytes() == sprite.tobytes()
        x = 20 + index * 412
        label(draw, (x + 15, 140), title, 25)
        large = sprite.resize((384, 384), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 185), large)
        label(draw, (x + 15, 590), f"HOLD: {duration / 1000:g}s", 20)
        close = sprite.crop((8, 35, 49, 57)).resize((328, 176), Image.Resampling.NEAREST)
        sheet.paste(close, (x + 25, 665), close)
        preview = Image.new("RGB", (640, 730), BACKGROUND)
        screen = ImageDraw.Draw(preview)
        label(screen, (30, 25), "NEUTRAL > SIT / SLOW REVIEW", 26)
        label(screen, (30, 75), title, 27)
        full = sprite.resize((512, 512), Image.Resampling.NEAREST)
        preview.paste(full, (64, 130), full)
        label(screen, (30, 680), f"Frame {index + 1}/5 / hold {duration / 1000:g}s", 22)
        previews.append(preview)
    label(draw, (35, 885), "Lower row: body/leg close-ups. The rest of the transition chain is paused for this review.", 23)
    sheet.save(destination / "neutral-to-sit-frames.png")
    previews[0].save(destination / "neutral-to-sit-slow.gif", save_all=True,
                     append_images=previews[1:], duration=durations, loop=0, disposal=2)
    with Image.open(destination / "neutral-to-sit-slow.gif") as gif:
        assert gif.n_frames == 5
        assert [gif.seek(i) or gif.info["duration"] for i in range(5)] == durations
    metadata = {"source": "v28 first five frames, unchanged", "durationsMs": durations,
                "status": "neutral-to-sit review only; later chain paused",
                "loop": "hard reset from sitting to neutral, not an animated stand-up"}
    (destination / "review.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Exported five unchanged frames side by side and a 5x-slower motion GIF; timing and pixels verified.")


if __name__ == "__main__":
    main()
