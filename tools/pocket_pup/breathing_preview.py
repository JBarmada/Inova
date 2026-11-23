"""Grounded breathing study: upper-body rise, chest easing, unchanged planted paws."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]


def rgba(name):
    return (*bytes.fromhex(PALETTE[name][1:]), 255)


def ease_chest(base, seated):
    image = base.copy()
    # A few palette-ramp changes lead into the pixel rise; no face/outline flicker.
    points = [(18, 41), (19, 42), (26, 41), (25, 42)] if seated else [
        (19, 44), (20, 45), (24, 44), (25, 43), (33, 44)]
    for x, y in points:
        color = image.getpixel((x, y))
        if color == rgba("cream"):
            image.putpixel((x, y), rgba("cream_light"))
        elif color == rgba("coat"):
            image.putpixel((x, y), rgba("coat_light"))
        elif color == rgba("cream_shadow"):
            image.putpixel((x, y), rgba("cream"))
    return image


def inhale(base, seated):
    image = Image.new("RGBA", (64, 64))
    # Preserve the upper sprite's native pixels; an extra chest row bridges to
    # unchanged lower legs. This is a one-pixel extension, never an airborne bob.
    join = 44 if seated else 46
    image.alpha_composite(base.crop((0, 1, 64, join + 1)), (0, 0))
    image.alpha_composite(base.crop((0, join, 64, 64)), (0, join))
    return ease_chest(image, seated)


def poses(base, seated):
    sequence = [base.copy(), ease_chest(base, seated), inhale(base, seated), ease_chest(base, seated)]
    for image in sequence:
        assert image.size == (64, 64) and image.mode == "RGBA"
        assert image.crop((0, 50, 64, 64)).tobytes() == base.crop((0, 50, 64, 64)).tobytes()
        assert set(image.getchannel("A").get_flattened_data()) <= {0, 255}
        # Head/neck/chest overlap remains opaque down to the body.
        for y in range(36 if seated else 39, 45):
            for x in range(18, 25):
                assert image.getpixel((x, y))[3] == 255, (seated, x, y)
    # Full face above the chest translates rigidly by exactly one native pixel.
    assert sequence[2].crop((5, 12, 38, 37)).tobytes() == base.crop((5, 13, 38, 38)).tobytes()
    return sequence


def main():
    destination = ART / "v34"
    destination.mkdir(parents=True, exist_ok=True)
    names = [("NEUTRAL", "neutral"), ("HAPPY", "happy"), ("SITTING", "sitting")]
    originals = [(ROOT / f"public/dog/{name}.png").read_bytes() for _, name in names]
    animations = [poses(Image.open(ROOT / f"public/dog/{name}.png").convert("RGBA"), name == "sitting")
                  for _, name in names]
    durations = [800, 450, 650, 900]
    previews = []
    contact = Image.new("RGB", (1500, 1060), BACKGROUND)
    contact_draw = ImageDraw.Draw(contact)
    label(contact_draw, (30, 20), "BREATHING / REST > INHALE > PEAK > EXHALE", 29)
    for index in range(4):
        sheet = Image.new("RGB", (1100, 560), BACKGROUND)
        draw = ImageDraw.Draw(sheet)
        label(draw, (35, 25), "POCKET PUP / GROUNDED BREATHING STUDY", 27)
        label(draw, (35, 78), "Chest, shoulders and head rise gently / paws stay planted / 2.8-second loop", 18)
        for column, ((title, name), frames) in enumerate(zip(names, animations)):
            sprite = frames[index]
            sprite.save(destination / f"{name}-{index}.png")
            large = sprite.resize((320, 320), Image.Resampling.NEAREST)
            x = 30 + column * 360
            sheet.paste(large, (x, 135), large)
            label(draw, (x + 45, 475), title, 24)
            # Static ground marker makes fixed contact observable in the preview.
            draw.line((x + 45, 415, x + 270, 415), fill="#d9cdb6")
            small = sprite.resize((256, 256), Image.Resampling.NEAREST)
            cx, cy = 30 + index * 370, 80 + column * 320
            contact.paste(small, (cx, cy), small)
            label(contact_draw, (cx, cy + 265), f"{title} / {index + 1}", 20)
        previews.append(sheet)
    previews[0].save(destination / "breathing-preview.gif", save_all=True,
                     append_images=previews[1:], duration=durations, loop=0, disposal=2)
    contact.save(destination / "breathing-frames.png")
    with Image.open(destination / "breathing-preview.gif") as gif:
        assert gif.n_frames == 4
        assert [gif.seek(i) or gif.info["duration"] for i in range(4)] == durations
    for (_, name), original in zip(names, originals):
        assert original == (ROOT / f"public/dog/{name}.png").read_bytes()
    metadata = {"status": "preview only; runtime unchanged", "periodMs": sum(durations),
                "timingsMs": durations, "motion": "one-pixel upper-body extension; all paw rows fixed",
                "sources": {name: hashlib.sha256(data).hexdigest() for (_, name), data in zip(names, originals)},
                "references": ["https://www.patreon.com/saint11/posts/character-idle-12464240",
                               "https://www.slynyrd.com/blog/2018/8/19/pixelblog-8-intro-to-animation"]}
    (destination / "preview.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Exported grounded breathing preview; paws, native face, neck overlap, timing, and unchanged source files verified.")


if __name__ == "__main__":
    main()
