"""Review a whole-sprite bob without changing runtime assets or app behavior."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART
from sheet import BACKGROUND, label
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]


def main():
    destination = ART / "v33"
    destination.mkdir(parents=True, exist_ok=True)
    names = [("NEUTRAL", "neutral"), ("HAPPY", "happy"), ("SITTING", "sitting")]
    sprites = [Image.open(ROOT / f"public/dog/{name}.png").convert("RGBA") for _, name in names]
    offsets = [0, -1, -2, -1]
    durations = [450, 200, 350, 200]
    previews = []
    for index, offset in enumerate(offsets):
        sheet = Image.new("RGB", (1100, 530), BACKGROUND)
        draw = ImageDraw.Draw(sheet)
        label(draw, (35, 25), "POCKET PUP / GENTLE BOB PREVIEW", 29)
        label(draw, (35, 78), "1.2-second loop / two-pixel lift / whole sprite moves together", 20)
        for column, ((title, _), sprite) in enumerate(zip(names, sprites)):
            shifted = Image.new("RGBA", (64, 64))
            shifted.alpha_composite(sprite, (0, offset))
            box = sprite.getbbox()
            expected = sprite.crop(box)
            actual = shifted.crop((box[0], box[1] + offset, box[2], box[3] + offset))
            assert expected.tobytes() == actual.tobytes()
            shifted.save(destination / f"{title.lower()}-{index}.png")
            large = shifted.resize((320, 320), Image.Resampling.NEAREST)
            x = 30 + column * 360
            sheet.paste(large, (x, 125), large)
            label(draw, (x + 50, 460), title, 24)
        previews.append(sheet)
    previews[0].save(destination / "bobbing-preview.gif", save_all=True,
                     append_images=previews[1:], duration=durations, loop=0, disposal=2)
    with Image.open(destination / "bobbing-preview.gif") as gif:
        assert gif.n_frames == len(offsets)
        assert [gif.seek(i) or gif.info["duration"] for i in range(gif.n_frames)] == durations
    metadata = {"status": "preview only; not added to the app", "periodMs": sum(durations),
                "nativePixelOffsets": offsets, "durationsMs": durations,
                "motion": "rigid whole-sprite translation; no resizing or redrawing",
                "sources": {name: hashlib.sha256((ROOT / f"public/dog/{name}.png").read_bytes()).hexdigest()
                            for _, name in names}}
    (destination / "preview.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Generated preview-only bob; all sprite pixels preserved and GIF timing checked.")


if __name__ == "__main__":
    main()
