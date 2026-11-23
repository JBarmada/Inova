"""Export jointed transition frames and verify neck coverage and head preservation."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from bent_legs import lower_bend, resting, sit_bend
from full_sheet import ART, load
from rest_chain import export_animation, frame_sheet, key_sheet
from rest_poses import isolated_head, sleepy_eyes
from sheet import BACKGROUND, label
from validate import validate_source_sizes


def build_frames():
    sitting = load("v26/sitting-idle.png")
    tired = sleepy_eyes(sitting, -3)
    frames = [("neutral", load("v9/fur-details.png"), 1100)]
    checks = []
    for i in range(3):
        image, hy = sit_bend(i)
        frames.append((f"fold-hind-legs-{i + 1}", image, 180))
        checks.append((image, hy, False, False))
    frames += [("sitting", sitting, 1300), ("sit-tired", tired, 1400)]
    checks += [(sitting, -3, False, False), (tired, -3, True, False)]
    for i in range(4):
        image, hy = lower_bend(i)
        frames.append((f"bend-elbows-{i + 1}", image, 190))
        checks.append((image, hy, True, False))
    for name, closed, breath, duration in [
        ("lying-down", False, False, 1300), ("sleeping", True, False, 900),
        ("sleep-breath", True, True, 700), ("sleeping", True, False, 900),
        ("sleep-breath", True, True, 700), ("sleeping", True, False, 900),
    ]:
        image, hy = resting(closed, breath)
        frames.append((name, image, duration))
        checks.append((image, hy, True, closed))
    return frames, checks


def validate_necks(checks):
    for index, (sprite, hy, tired, closed) in enumerate(checks):
        head = isolated_head(tired, closed)
        for y in range(3, 42):
            for x in range(64):
                color = head.getpixel((x, y))
                if color[3]:
                    assert sprite.getpixel((x, y + hy)) == color, (index, "head", x, y)
        # Solid overlapping corridor from the lower head through the neck.
        for y in range(37 + hy, min(44 + hy, 54)):
            for x in range(18, 26):
                assert sprite.getpixel((x, y))[3] == 255, (index, "neck gap", x, y)
        # Reject enclosed transparent pinholes in the neck/head junction region.
        for y in range(34 + hy, min(46 + hy, 55)):
            for x in range(11, 32):
                if sprite.getpixel((x, y))[3] == 0:
                    neighbors = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
                    assert not all(sprite.getpixel(p)[3] for p in neighbors), (index, "pinhole", x, y)


def neck_sheet(checks, destination):
    sheet = Image.new("RGB", (1280, 100 + ((len(checks) + 2) // 3) * 275), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (25, 20), "NECK CONNECTION / MOTION FRAMES", 26)
    for index, (sprite, hy, _, _) in enumerate(checks):
        x, y = 20 + index % 3 * 425, 85 + index // 3 * 275
        crop = sprite.crop((8, 31 + hy, 35, 49 + hy))
        large = crop.resize((324, 216), Image.Resampling.NEAREST)
        sheet.paste(large, (x, y), large)
        label(draw, (x, y + 225), f"Connection {index + 1}", 18)
    sheet.save(destination / "neck-connections.png")


def main():
    destination = ART / "v28"
    destination.mkdir(parents=True, exist_ok=True)
    frames, checks = build_frames()
    assert frames[4][1].tobytes() == load("v26/sitting-idle.png").tobytes()
    validate_necks(checks)
    export_animation(frames, destination)
    frame_sheet(frames, destination)
    detail = destination / "lowering-detail"
    detail.mkdir(exist_ok=True)
    export_animation(frames[4:12], detail)
    poses = {name: sprite for name, sprite, _ in frames
             if name in ("neutral", "sitting", "sit-tired", "lying-down", "sleeping")}
    key_sheet(poses, destination)
    neck_sheet(checks, destination)
    for name, sprite in poses.items():
        sprite.save(destination / f"{name}.png")
    report = {"status": "jointed motion review, not integrated", "frames": len(frames),
              "approvedSitting": "exact v26 pixels", "head": "native source pixels, translation only",
              "neck": "solid 8-pixel corridor and no enclosed single-pixel neck holes",
              "motion": "explicit hip/elbow/wrist positions; body polygons redrawn, never resized",
              "playback": "one-way sequence; preview resets from sleeping to standing"}
    (destination / "validation.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated 16 timed frames, unchanged approved sit/native heads, solid neck corridors, and GIF timing.")


if __name__ == "__main__":
    main()
