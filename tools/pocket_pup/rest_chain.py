"""Export the full reference sheet and an editable first rest-transition study."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load, render
from rest_poses import lying, lower_step, sit_step, sleepy_eyes
from sheet import BACKGROUND, label
from sitting import collection
from validate import validate_source_sizes


def sequence(poses):
    frames = [("neutral", poses["neutral"], 1100)]
    frames += [(f"sit-down-{i}", sit_step(t), 130) for i, t in enumerate((.25, .5, .75), 1)]
    frames += [("sitting", poses["sitting"], 1300),
               ("sit-tired", poses["sit-tired"], 1400)]
    frames += [(f"lowering-{i}", lower_step(t), 160) for i, t in enumerate((.25, .5, .75), 1)]
    frames += [("lying-down", poses["lying-down"], 1300),
               ("sleeping", poses["sleeping"], 900)]
    for _ in range(2):
        frames += [("sleep-breath", lying(True, True), 700),
                   ("sleeping", poses["sleeping"], 900)]
    return frames


def export_animation(frames, destination):
    directory = destination / "frames"
    directory.mkdir(exist_ok=True)
    strip = Image.new("RGBA", (64 * len(frames), 64))
    previews, durations, records = [], [], []
    for index, (name, sprite, duration) in enumerate(frames):
        assert sprite.size == (64, 64) and sprite.mode == "RGBA"
        assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
        path = f"frames/{index:02}-{name}.png"
        sprite.save(destination / path)
        strip.alpha_composite(sprite, (64 * index, 0))
        preview = Image.new("RGB", (640, 720), BACKGROUND)
        draw = ImageDraw.Draw(preview)
        label(draw, (35, 20), "POCKET PUP / REST TRANSITION STUDY", 23)
        label(draw, (35, 70), name.upper().replace("-", " "), 23)
        large = sprite.resize((512, 512), Image.Resampling.NEAREST)
        preview.paste(large, (64, 120), large)
        label(draw, (35, 665), "First motion draft / 64 x 64 pixel frames", 19)
        previews.append(preview)
        durations.append(duration)
        records.append({"name": name, "file": path, "durationMs": duration})
    previews[0].save(destination / "rest-chain.gif", save_all=True, append_images=previews[1:],
                     duration=durations, disposal=2, loop=0)
    strip.save(destination / "rest-chain-strip.png")
    metadata = {"status": "first animation review, not integrated", "frameSize": [64, 64],
                "playback": "one-way rest sequence; GIF repeats with a hard reset to standing",
                "frames": records, "sprites": "transparent PNG frames are the implementation source"}
    (destination / "animation.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    with Image.open(destination / "rest-chain.gif") as check:
        assert check.n_frames == len(frames), (check.n_frames, len(frames))
        assert sum(check.seek(i) or check.info["duration"] for i in range(check.n_frames)) == sum(durations)


def key_sheet(poses, destination):
    sheet = Image.new("RGB", (1600, 510), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (35, 24), "NEUTRAL > SIT > SIT TIRED > LYING DOWN > SLEEPING", 29)
    for index, (name, sprite) in enumerate(poses.items()):
        large = sprite.resize((256, 256), Image.Resampling.NEAREST)
        sheet.paste(large, (30 + 315 * index, 115), large)
        label(draw, (30 + 315 * index, 400), name.upper(), 22)
    label(draw, (35, 465), "Approved sitting pose preserved. New tired/lying/sleeping poses and movement are review drafts.", 19)
    sheet.save(destination / "transition-keys.png")


def frame_sheet(frames, destination):
    sheet = Image.new("RGB", (1400, 10 + ((len(frames) + 4) // 5) * 280), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    for index, (name, sprite, duration) in enumerate(frames):
        x, y = 15 + index % 5 * 280, 10 + index // 5 * 280
        large = sprite.resize((224, 224), Image.Resampling.NEAREST)
        sheet.paste(large, (x, y), large)
        label(draw, (x, y + 230), f"{index:02} {name}", 16)
        label(draw, (x, y + 252), f"{duration}ms", 14)
    sheet.save(destination / "motion-frames.png")


def main():
    destination = ART / "v27"
    destination.mkdir(parents=True, exist_ok=True)
    sit = load("v26/sitting-idle.png")
    poses = {"neutral": load("v9/fur-details.png"), "sitting": sit,
             "sit-tired": sleepy_eyes(sit, -3), "lying-down": lying(), "sleeping": lying(True)}
    for name, sprite in poses.items():
        sprite.save(destination / f"{name}.png")
    items = collection(sit)
    items[-1] = ("SITTING / APPROVED", sit, "Centered body and corrected tucked hind paws.")
    render(items, destination / "reference-sheet.png",
           "Full expression collection / approved sitting pose added / 64 x 64 sprites",
           "Sitting replaces the earlier draft. Expressions are separate from clothing; not integrated into the app.")
    key_sheet(poses, destination)
    frames = sequence(poses)
    export_animation(frames, destination)
    frame_sheet(frames, destination)
    validate_source_sizes(Path(__file__).parent)
    print("Exported updated full sheet, five key poses, 15 timed frames, transparent strip, and validated GIF.")


if __name__ == "__main__":
    main()
