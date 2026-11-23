"""Review-only seated tired -> tucked loaf. Never exports runtime assets."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, load
from head_edge_fix import corrected_head
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def tired_head():
    head = corrected_head(load("v9/fur-details.png"))
    neutral = load("v26/sitting-idle.png")
    tired = load("v35/sitting-tired.png")
    for y in range(24, 28):
        for x in (13, 14, 15, 24, 25, 26):
            if tired.getpixel((x, y)) != neutral.getpixel((x, y)):
                head.putpixel((x, y + 3), tired.getpixel((x, y)))
    return head


def body(draw, top, width):
    # One connected mass: shoulders overlap the head, base stays on y55.
    for y in range(top, 55):
        inset = 3 if y < top + 2 else 2 if y < top + 4 else 1 if y < top + 6 else 0
        left, right = 21 - width + inset, 21 + width - inset
        if y >= 53:
            left += y - 52
            right -= y - 52
        draw.line((left, y, right, y), fill=PALETTE["outline"])
        draw.line((left + 1, y, right - 1, y), fill=PALETTE["coat"])
        draw.point((left + 1, y), fill=PALETTE["coat_shadow"])
        draw.point((right - 1, y), fill=PALETTE["coat_shadow"])
    draw.line((12, 55, 30, 55), fill=PALETTE["outline"])


def folded_forelegs(draw, phase):
    if phase == 1:
        # Elbows fold outward while both original front paw centers stay planted.
        for points in ([(17, 45), (14, 49), (16, 53)], [(25, 45), (28, 49), (26, 53)]):
            draw.line(points, fill=PALETTE["deep_shadow"], width=1)
        for left, right in ((16, 20), (22, 26)):
            draw.rectangle((left, 51, right, 54), fill=PALETTE["cream"])
            draw.line((left + 1, 51, right - 1, 51), fill=PALETTE["cream_light"])
            draw.line((left, 55, right, 55), fill=PALETTE["outline"])
    elif phase == 2:
        # Paw tips slide inward beneath the lowering chest; no detached zigzag.
        for left, right in ((15, 20), (22, 27)):
            draw.rectangle((left, 52, right, 53), fill=PALETTE["cream"])
            draw.line((left + 1, 52, right - 1, 52), fill=PALETTE["cream_light"])
    else:
        # Only a soft chest edge: feet are tucked inside the loaf silhouette.
        draw.line((16, 53, 26, 53), fill=PALETTE["cream_shadow"])


def lower_pose(head, offset, phase):
    image = Image.new("RGBA", (64, 64))
    # Reuse the approved sitting tail pixels, translated slightly down as hips settle.
    sitting = load("v35/sitting-tired.png")
    tail = sitting.crop((33, 39, 44, 53))
    image.alpha_composite(tail, (32, 40 + min(phase, 2)))
    draw = ImageDraw.Draw(image)
    top = 36 + offset
    body(draw, top, 12 if phase == 1 else 13)
    bottom = 47 if phase == 1 else 51 if phase == 2 else 53
    draw.polygon([(14, top), (28, top), (28, bottom - 5), (26, bottom - 2),
                  (23, bottom), (19, bottom), (16, bottom - 2), (14, bottom - 5)], fill=PALETTE["cream"])
    draw.polygon([(16, top), (26, top), (26, bottom - 5),
                  (24, bottom - 2), (21, bottom - 1), (18, bottom - 3)], fill=PALETTE["cream_light"])
    folded_forelegs(draw, phase)
    image.alpha_composite(head, (0, offset))
    if phase == 1:
        # Keep both approved front paws pixel-identical through the first bend.
        image.paste(sitting.crop((15, 50, 28, 56)), (15, 50))
        assert image.crop((15, 50, 28, 56)).tobytes() == sitting.crop((15, 50, 28, 56)).tobytes()
    # Every opaque head pixel is translated only, never resized or repainted.
    for y in range(64 - max(offset, 0)):
        for x in range(64):
            if head.getpixel((x, y))[3]:
                assert image.getpixel((x, y + offset)) == head.getpixel((x, y))
    return image


def review_sheet(poses, destination):
    sheet = Image.new("RGB", (1600, 660), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (30, 25), "TIRED SIT > LOAF / MOTION REVIEW", 30)
    label(draw, (30, 75), "Exact tired sit / bend elbows / tuck paws / settle. Head pixels translated, never scaled.", 20)
    for index, (name, sprite) in enumerate(poses.items()):
        x = 20 + index * 400
        large = sprite.resize((384, 384), Image.Resampling.NEAREST)
        sheet.paste(large, (x, 145), large)
        label(draw, (x + 20, 550), name.upper(), 24)
    label(draw, (30, 615), "Review only. App retains approved sitting. No loaf assets or seven-second timer shipped.", 20)
    sheet.save(destination / "loaf-frames.png")


def gif(poses, destination, slow=False):
    frames, durations = [], []
    sequence = [("tired sit", 1000, f"Tired sitting: {second} / 7 seconds") for second in range(1, 8)]
    sequence += [("bend elbows", 600 if slow else 220, "Forepaws planted; elbows bend"),
                 ("tuck paws", 600 if slow else 220, "Paws fold under the chest"),
                 ("loaf", 2400, "Settled loaf / review endpoint")]
    for name, duration, note in sequence:
        canvas = Image.new("RGB", (640, 720), BACKGROUND)
        draw = ImageDraw.Draw(canvas)
        label(draw, (30, 25), "TIRED SIT > LOAF / REVIEW ONLY", 25)
        label(draw, (30, 75), note, 22)
        large = poses[name].resize((512, 512), Image.Resampling.NEAREST)
        canvas.paste(large, (64, 110), large)
        label(draw, (30, 655), "7-second hold, then lower and tuck.", 21)
        label(draw, (30, 687), "Breathing paused for pose inspection.", 18)
        frames.append(canvas)
        durations.append(duration)
    target = destination / ("loaf-slow.gif" if slow else "loaf-preview.gif")
    frames[0].save(target, save_all=True, append_images=frames[1:],
                   duration=durations, loop=0, disposal=2)
    with Image.open(target) as result:
        actual = [result.seek(i) or result.info["duration"] for i in range(result.n_frames)]
        assert actual == durations
    return durations


def main():
    destination = ART / "v36"
    destination.mkdir(parents=True, exist_ok=True)
    head = tired_head()
    poses = {"tired sit": load("v35/sitting-tired.png"),
             "bend elbows": lower_pose(head, 0, 1),
             "tuck paws": lower_pose(head, 4, 2), "loaf": lower_pose(head, 7, 3)}
    for name, sprite in poses.items():
        assert sprite.size == (64, 64)
        assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
        sprite.save(destination / f"{name.replace(' ', '-')}.png")
    assert poses["tired sit"].tobytes() == load("v35/sitting-tired.png").tobytes()
    review_sheet(poses, destination)
    timing = gif(poses, destination)
    gif(poses, destination, slow=True)
    metadata = {"status": "awaiting user review; not integrated", "holdMs": 7000,
                "durationsMs": timing, "order": list(poses),
                "fixed": "exact starting sit; translated native-scale tired head; connected body",
                "runtime": "no loaf assets exported; no automatic loaf deadline enabled"}
    (destination / "review.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Review only: exact seven-second hold, native head pixels and unchanged starting sit verified.")


if __name__ == "__main__":
    main()
