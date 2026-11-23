"""An awake seated idle pose with the selected Pocket Pup face."""
import json
from pathlib import Path

from PIL import Image, ImageDraw

from full_sheet import ART, entries, load, render
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes


def sitting(base):
    image = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(image)
    dark = PALETTE["outline"]
    # The curl sits behind a rounded seated haunch.
    image.alpha_composite(base.crop((38, 24, 58, 44)), (32, 33))
    draw.polygon([(18, 32), (31, 32), (34, 36), (35, 41), (40, 43),
                  (44, 48), (44, 53), (41, 55), (16, 55), (14, 53),
                  (14, 43), (15, 37)], fill=dark)
    draw.polygon([(19, 34), (29, 34), (32, 38), (33, 44), (38, 45),
                  (42, 49), (42, 52), (39, 53), (17, 53), (16, 50),
                  (16, 42)], fill=PALETTE["coat"])
    draw.polygon([(33, 45), (37, 46), (40, 49), (40, 52), (34, 52),
                  (32, 50)], fill=PALETTE["coat_shadow"])
    draw.line([(35, 46), (38, 47), (39, 48)], fill=PALETTE["coat_light"])
    # Cream bib and two straight front paws read as sitting rather than curled.
    draw.polygon([(17, 36), (30, 36), (30, 41), (28, 45), (25, 48),
                  (21, 47), (18, 43)], fill=PALETTE["cream"])
    draw.polygon([(19, 37), (28, 37), (28, 41), (25, 44), (22, 44),
                  (20, 42)], fill=PALETTE["cream_light"])
    draw.line([(16, 45), (17, 48), (17, 53)], fill=PALETTE["coat_shadow"])
    draw.line((24, 47, 24, 54), fill=dark)
    draw.line((31, 47, 31, 53), fill=dark)
    draw.rectangle((18, 51, 22, 53), fill=PALETTE["cream"])
    draw.rectangle((26, 51, 29, 53), fill=PALETTE["cream"])
    draw.line((19, 51, 21, 51), fill=PALETTE["cream_light"])
    draw.line((27, 51, 28, 51), fill=PALETTE["cream_light"])
    draw.line((35, 53, 40, 53), fill=PALETTE["cream_shadow"])
    image.alpha_composite(base.crop((5, 0, 37, 42)), (7, -3))
    return image


def review(sprite):
    sheet = Image.new("RGB", (1000, 850), BACKGROUND)
    draw = ImageDraw.Draw(sheet)
    label(draw, (45, 30), "POCKET PUP / AWAKE SITTING IDLE", 30)
    label(draw, (45, 83), "Alert ears + open eyes + the selected :3 smile", 21)
    large = sprite.resize((640, 640), Image.Resampling.NEAREST)
    sheet.paste(large, (180, 100), large)
    label(draw, (45, 770), "Upright chest, front paws together, seated haunch, curled tail.", 20)
    return sheet


def collection(sprite):
    items = entries()[:6]
    for name, title, note in [
        ("tiny-peek", "BLEP / :3", "The :3 smile with a tiny tongue peek."),
        ("soft-dog-smile", "SOFT DOG SMILE", "Tongue pink matches Happy :D."),
        ("happy-little-pup", "HAPPY LITTLE PUP", "Happy eyes + matching tongue pink."),
        ("happy-little-pup-blush", "HAPPY LITTLE PUP / BLUSH", "Extra variant with Happy :D's blush."),
    ]:
        items.append((title, load(f"v14/{name}.png"), note))
    items.append(("SITTING / AWAKE IDLE", sprite, "Alert :3 face and an upright seated body."))
    return items


def main():
    base = load("v9/fur-details.png")
    sprite = sitting(base)
    assert sprite.size == (64, 64) and sprite.mode == "RGBA"
    assert set(sprite.getchannel("A").get_flattened_data()) <= {0, 255}
    assert sprite.getbbox()[3] == 56
    assert sprite.crop((14, 24, 30, 34)).tobytes() == base.crop((12, 27, 28, 37)).tobytes()
    destination = ART / "v15"
    destination.mkdir(parents=True, exist_ok=True)
    sprite.save(destination / "sitting-idle.png")
    review(sprite).save(destination / "sitting-review.png")
    render(collection(sprite), destination / "reference-sheet.png",
           "Full expression collection + awake sitting idle / 64 x 64 sprites / crisp 4x scale",
           "Sitting is a separate pose; wearable fitting remains to be done. Art review, not integrated into the app.")
    metadata = {"status": "review draft, not integrated", "canvas": [64, 64],
                "pose": "sitting awake", "sourceFace": "v9/fur-details.png",
                "headTranslation": [2, -3], "groundY": 55,
                "accessoriesSupported": [], "notes": "New seated body; original alert face preserved."}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    validate_source_sizes(Path(__file__).parent)
    print("Validated awake sitting pose, exact source face, binary transparency, and full reference sheet.")


if __name__ == "__main__":
    main()
