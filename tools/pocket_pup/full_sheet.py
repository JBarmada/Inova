"""Assemble the existing reference states and all three simple bleps."""
from pathlib import Path

from PIL import Image, ImageDraw

from layers import bandana, compose, cue
from sheet import BACKGROUND, label
from validate import validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "art/pocket-pup"


def load(relative):
    image = Image.open(ART / relative).convert("RGBA")
    assert image.size == (64, 64), relative
    return image


def entries():
    neutral = load("v9/fur-details.png")
    return [
        ("NEUTRAL / :3", neutral, "Selected brown C14 mouth + fur details."),
        ("HAPPY / :D", compose(load("v6/sprites/happy.png"), cue("wag")),
         "Open smile, blush, and removable wag marks."),
        ("TIRED", load("v6/sprites/tired.png"), "Sleepy lids and tired expression."),
        ("BARKING", compose(load("v6/sprites/barking.png"), cue("barking")),
         "Furrowed brows + separate bark rays."),
        ("SLEEPING", compose(load("v6/sprites/sleeping.png"), cue("sleeping")),
         "Separate curled pose; clothing not fitted."),
        ("BANDANA FIT", compose(neutral, bandana()), "Removable accessory over the neutral dog."),
        ("TINY PEEK", load("v13/tiny-peek.png"), "A tiny blep: four flat pink pixels."),
        ("SOFT DOG SMILE", load("v13/soft-dog-smile.png"), "Relaxed smile with a little tongue inside."),
        ("HAPPY LITTLE PUP", load("v13/happy-little-pup.png"), "Soft dog smile + happy closed eyes."),
    ]


def render(items, destination, subtitle, footer):
    rows = (len(items) + 2) // 3
    bottom = 165 + rows * 375
    sheet = Image.new("RGB", (1440, bottom + 100), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (64, 32), "INOVA / POCKET PUP / FULL REFERENCE", 34)
    label(draw, (64, 86), subtitle, 19)
    for index, (title, sprite, note) in enumerate(items):
        x, y = 54 + (index % 3) * 460, 140 + (index // 3) * 375
        if index == len(items) - 1 and len(items) % 3 == 1:
            x = 514
        enlarged = sprite.resize((256, 256), Image.Resampling.NEAREST)
        sheet.paste(enlarged, (x + 65, y), enlarged)
        label(draw, (x + 10, y + 265), title, 24)
        label(draw, (x + 10, y + 304), note, 15)
    label(draw, (64, bottom), "Standing anchors: feet y55 / neck (22,42) / head (20,28). Expressions and clothing stay separate.", 17)
    label(draw, (64, bottom + 35), footer, 17)
    sheet.save(destination)


def main():
    render(entries(), ART / "v13/reference-sheet.png",
           "Existing expressions + all three new bleps / 64 x 64 sprites / crisp 4x scale",
           "Review collection: v9 neutral + v6 prior states + v13 bleps. Not yet integrated into the app.")
    validate_source_sizes(Path(__file__).parent)
    print("Created full nine-entry reference sheet; original sprite files preserved.")


if __name__ == "__main__":
    main()
