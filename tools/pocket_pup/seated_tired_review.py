"""Face-only seated tiredness review; no runtime integration before approval."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def expression(base, kind):
    image = base.copy()
    if kind == "neutral":
        return image
    draw = ImageDraw.Draw(image)
    for x in (13, 24):
        draw.rectangle((x, 24, x + 2, 27), fill=PALETTE["coat"])
        if kind == "blink":
            draw.line((x, 25, x + 2, 25), fill=PALETTE["outline"])
        elif kind == "drowsy":
            draw.rectangle((x, 25, x + 2, 26), fill=PALETTE["outline"])
            draw.point((x + 2, 25), fill=PALETTE["eye_white"])
            draw.line((x, 24, x + 2, 24), fill=PALETTE["coat_shadow"])
        else:
            draw.line((x, 25, x + 2, 25), fill=PALETTE["outline"])
            draw.point((x + 1, 26), fill=PALETTE["outline"])
            draw.line((x, 27, x + 2, 27), fill=PALETTE["coat_shadow"])
    for y in range(64):
        for x in range(64):
            if not (24 <= y <= 27 and (13 <= x <= 15 or 24 <= x <= 26)):
                assert image.getpixel((x, y)) == base.getpixel((x, y)), (kind, x, y)
    assert image.getchannel("A").tobytes() == base.getchannel("A").tobytes()
    return image


def frame_sheet(poses, destination):
    sheet = Image.new("RGB", (1520, 790), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (30, 25), "NEXT REVIEW / SITTING > TIRED FACE", 31)
    label(draw, (30, 80), "Only the eyes change. No standing, body redraw, head shift, or paw movement.", 20)
    for index, (name, sprite) in enumerate(poses.items()):
        x = 20 + index * 380
        large = sprite.resize((320, 320), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 145), large)
        label(draw, (x + 15, 495), name.upper(), 23)
        face = sprite.crop((10, 21, 30, 33)).resize((240, 144), Image.Resampling.NEAREST)
        sheet.paste(face, (x + 45, 555), face)
    label(draw, (30, 750), "Review only. Seven seconds of tired sitting will lead to loaf after its separate pose/clip review.", 18)
    sheet.save(destination / "seated-face-frames.png")


def animation(poses, destination):
    names = ["neutral", "blink", "neutral", "drowsy", "blink", "tired"]
    durations = [900, 100, 350, 450, 250, 7000]
    frames = []
    for name in names:
        sheet = Image.new("RGB", (640, 740), BACKGROUND)
        draw = ImageDraw.Draw(sheet)
        label(draw, (25, 22), "SITTING > TIRED / FACE-ONLY REVIEW", 23)
        label(draw, (25, 70), name.upper(), 26)
        large = poses[name].resize((512, 512), Image.Resampling.NEAREST)
        sheet.paste(large, (64, 115), large)
        note = "Tired hold: 7 seconds. Loaf is the next review." if name == "tired" else "Approved seated body and head position stay fixed."
        label(draw, (25, 665), note, 18)
        label(draw, (25, 704), "Preview only / breathing paused for inspection", 18)
        frames.append(sheet)
    frames[0].save(destination / "seated-tired-preview.gif", save_all=True,
                   append_images=frames[1:], duration=durations, loop=0, disposal=2)
    with Image.open(destination / "seated-tired-preview.gif") as gif:
        assert gif.n_frames == len(frames)
        assert [gif.seek(i) or gif.info["duration"] for i in range(gif.n_frames)] == durations
    return {"phaseOrder": names, "durationsMs": durations}


def main():
    destination = ART / "v35"
    destination.mkdir(parents=True, exist_ok=True)
    base = load("v26/sitting-idle.png")
    poses = {kind: expression(base, kind) for kind in ("neutral", "blink", "drowsy", "tired")}
    for name, sprite in poses.items():
        sprite.save(destination / f"sitting-{name}.png")
    frame_sheet(poses, destination)
    metadata = animation(poses, destination)
    metadata.update({"status": "awaiting face-transition review; not integrated", "scenario": "M05 / scenario 2",
                     "fixed": "every pixel outside two 3x4 eye boxes; head, body, mouth, paws and alpha unchanged",
                     "loaf": "not shown or implemented; separate next review",
                     "main": "approved sitting and breathing published as b187094"})
    (destination / "review.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Exported seated facial review; exact body/head/mouth/paw pixels and seven-second tired hold verified.")


if __name__ == "__main__":
    main()
