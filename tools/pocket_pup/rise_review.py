"""Review-only sit -> stand (and loaf -> stand) rise. Never exports runtime assets."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from sheet import BACKGROUND, label
from validate import validate_source_sizes

TAIL_X = 34  # Columns at or right of this hold the approved seated tail; it stays put.
CHEST_ROW = 43  # Lowest row that lifts; the row below it repeats so the forelegs lengthen.
HEAD_ROWS = 36  # Rows above this lift across the whole width (head and ears).


def push_up(sitting):
    """Chest and head rise one pixel as the forelegs straighten; paws stay planted."""
    image = sitting.copy()
    for y in range(CHEST_ROW):
        right = 64 if y < HEAD_ROWS - 1 else TAIL_X
        for x in range(right):
            image.putpixel((x, y), sitting.getpixel((x, y + 1)))
    # Everything above the chest row is a pure one-pixel translation, never repainted.
    for y in range(1, HEAD_ROWS - 1):
        for x in range(64):
            assert image.getpixel((x, y - 1)) == sitting.getpixel((x, y))
    # Paws and lower legs are untouched.
    assert image.crop((0, CHEST_ROW + 1, 64, 64)).tobytes() == sitting.crop((0, CHEST_ROW + 1, 64, 64)).tobytes()
    return image


def review_sheet(poses, destination):
    sheet = Image.new("RGB", (20 + 400 * len(poses), 660), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (30, 25), "SIT > STAND / RISE REVIEW (v37)", 30)
    label(draw, (30, 75), "Approved sit / NEW push-up / approved hips-up (v32 tuck, reused) / approved stand.", 20)
    for index, (name, sprite) in enumerate(poses.items()):
        x = 20 + index * 400
        large = sprite.resize((384, 384), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 145), large)
        label(draw, (x + 20, 550), name.upper(), 24)
    label(draw, (30, 615), "Review only. App still switches directly to standing. No rise assets shipped.", 20)
    sheet.save(destination / "rise-frames.png")


def gif(poses, sequence, title, target):
    frames, durations = [], []
    for name, duration, note in sequence:
        canvas = Image.new("RGB", (640, 720), BACKGROUND)
        draw = ImageDraw.Draw(canvas)
        label(draw, (30, 25), f"{title} / REVIEW ONLY", 25)
        label(draw, (30, 75), note, 22)
        large = poses[name].resize((512, 512), Image.Resampling.NEAREST)
        canvas.paste(large, (64, 110), large)
        label(draw, (30, 655), "Stand pressed; front paws stay planted.", 21)
        label(draw, (30, 687), "Breathing paused for pose inspection.", 18)
        frames.append(canvas)
        durations.append(duration)
    frames[0].save(target, save_all=True, append_images=frames[1:], duration=durations, loop=0, disposal=2)
    with Image.open(target) as result:
        assert [result.seek(i) or result.info["duration"] for i in range(result.n_frames)] == durations
    return durations


def sequences(slow):
    step = 600 if slow else 140
    rise = [("push up", step, "Chest lifts; forelegs straighten"),
            ("hips up", 600 if slow else 160, "Hips rise; hind legs extend"),
            ("stand", 2000, "Standing / review endpoint")]
    sit = [("sit", 1500, "Approved sitting")] + rise
    loaf = [("loaf", 1500, "Approved loaf"),
            ("loaf tuck", step, "Paws slide forward (v36 frame, reversed)"),
            ("loaf bend", step, "Elbows straighten (v36 frame, reversed)"),
            ("tired sit", 600 if slow else 220, "Seated again; tired face holds")] + rise
    return sit, loaf


def main():
    destination = ART / "v37"
    destination.mkdir(parents=True, exist_ok=True)
    sitting = load("v32/02.png")
    poses = {"sit": sitting, "push up": push_up(sitting),
             "hips up": load("v32/01.png"), "stand": load("v32/00.png")}
    extra = {"loaf": load("v36/loaf.png"), "loaf tuck": load("v36/tuck-paws.png"),
             "loaf bend": load("v36/bend-elbows.png"), "tired sit": load("v35/sitting-tired.png")}
    for sprite in poses.values():
        assert sprite.size == (64, 64) and set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
        assert sprite.getbbox()[3] == 56, "every rise frame stays on the shared ground line"
    poses["push up"].save(destination / "push-up.png")
    review_sheet(poses, destination)
    sit, loaf = sequences(False)
    timing = gif({**poses, **extra}, sit, "SIT > STAND", destination / "rise-preview.gif")
    gif({**poses, **extra}, sequences(True)[0], "SIT > STAND (SLOW)", destination / "rise-slow.gif")
    loaf_timing = gif({**poses, **extra}, loaf, "LOAF > STAND", destination / "loaf-rise-preview.gif")
    metadata = {"status": "awaiting user review; not integrated", "order": list(poses),
                "sitDurationsMs": timing, "loafDurationsMs": loaf_timing,
                "new": "push-up.png: approved sit with head/chest translated up 1px, forelegs 1px longer",
                "reused": "v32/01.png as hips-up breakdown; v36 loaf frames reversed for loaf -> sit",
                "runtime": "no rise assets exported; Stand still switches directly"}
    (destination / "review.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Review only: rise frames grounded, head translated without repainting, paws unchanged.")


if __name__ == "__main__":
    main()
