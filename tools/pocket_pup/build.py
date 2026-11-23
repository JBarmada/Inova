"""Rebuild the review pack using the checked-in original generated concept."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image

from expressions import all_frames
from details import face_comparison
from neutral import connected_smile
from studies import neutral_choices
from layers import bandana, compose, cue
from sheet import BACKGROUND, grid_guide, reference_sheet
from source import PALETTE, create_base
from validate import validate_face_changes, validate_frames, validate_source_sizes

ROOT = Path(__file__).resolve().parents[2]


def export_images(frames, overlays, destination):
    sprites = destination / "sprites"
    layers = destination / "layers"
    sprites.mkdir(parents=True, exist_ok=True)
    layers.mkdir(parents=True, exist_ok=True)
    for name, image in frames.items():
        image.save(sprites / f"{name}.png")
    for name, image in overlays.items():
        image.save(layers / f"{name}.png")
    strip = Image.new("RGBA", (64 * len(frames), 64))
    for index, frame in enumerate(frames.values()):
        strip.alpha_composite(frame, (64 * index, 0))
    strip.save(destination / "sprite-strip.png")


def preview(frames, overlays, destination):
    images = []
    for name in ("idle", "blink", "idle", "happy", "tired", "barking", "sleeping"):
        image = Image.new("RGB", (256, 256), BACKGROUND)
        sprite = frames[name]
        marker = "wag" if name == "happy" else name
        if marker in overlays:
            sprite = compose(sprite, overlays[marker])
        sprite = sprite.resize((256, 256), Image.Resampling.NEAREST)
        image.paste(sprite, (0, 0), sprite)
        images.append(image)
    images[0].save(destination / "expression-preview.gif", save_all=True,
                   append_images=images[1:], duration=[1200, 140, 700, 1000, 1000, 850, 1600], loop=0)


def manifest(frames, source, version):
    return {
        "status": "art review draft, not integrated", "version": version,
        "canvas": [64, 64], "palette": PALETTE, "alpha": "0 or 255 only",
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "standingAnchors": {"groundY": 55, "neck": [22, 42], "head": [20, 28]},
        "awakeFace": {"noseBox": [18, 31, 21, 32], "mouthCenterX": 19.5,
                      "clearNoseMouthRows": [33, 34], "happyBlush": True,
                      "muzzleShiftY": -1, "eyeWhites": "idle and barking open eyes",
                      "neutralMouth": ":3", "happyMouth": ":D", "barkingBrows": "slightly furrowed"},
        "neutralStudy": {"noseBox": [18, 30, 21, 31], "eyesShiftYFromV5": -1,
                         "mouthColor": "#000000", "eyeWhite": "one upper-right pixel per open eye",
                         "connection": "two alternatives; not settled"},
        "bandanaSupported": [name for name in frames if name != "sleeping"],
        "sleeping": {"groundY": 55, "accessoriesSupported": []},
        "stripOrder": list(frames), "stripFrameSize": [64, 64],
        "scale": "integer multiples, nearest-neighbor only",
        "animation": "GIF is an expression slideshow with a blink, not a walk or bark cycle",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / "art/pocket-pup/source/concept-board.png")
    parser.add_argument("--version", type=int, default=6)
    args = parser.parse_args()
    if args.version < 6:
        parser.error("Versions one through five are preserved review baselines; choose version six or later.")
    destination = ROOT / f"art/pocket-pup/v{args.version}"
    destination.mkdir(parents=True, exist_ok=True)
    frames = all_frames(create_base(args.source))
    overlays = {"bandana": bandana(), **{name: cue(name) for name in ("wag", "barking", "sleeping")}}
    validate_frames(frames, overlays)
    validate_face_changes(frames, ROOT / "art/pocket-pup/v1")
    validate_source_sizes(Path(__file__).parent)
    export_images(frames, overlays, destination)
    preview(frames, overlays, destination)
    reference_sheet(frames, overlays["bandana"], overlays, args.version).save(destination / "reference-sheet.png")
    face_comparison(ROOT / "art/pocket-pup/v5", frames, 5, args.version).save(destination / "face-comparison.png")
    connected = connected_smile(frames["idle"])
    connected.save(destination / "neutral-connected.png")
    neutral_choices(ROOT / "art/pocket-pup/v5", frames["idle"], connected).save(destination / "neutral-choices.png")
    grid_guide(frames["idle"], overlays["bandana"]).save(destination / "grid-guide.png")
    (destination / "manifest.json").write_text(json.dumps(manifest(frames, args.source, args.version), indent=2) + "\n", encoding="utf-8")
    print("Validated 6 fixed-grid sprites and 4 removable overlays; reference pack rebuilt.")


if __name__ == "__main__":
    main()
