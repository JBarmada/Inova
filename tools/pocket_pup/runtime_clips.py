"""Pack the approved native art and separate effect layers for playback."""
import hashlib
import json

from PIL import Image

from .chest_motion import chest_phases
from .review_effects import overlays


def export_clips(root, destination, records):
    review = root / "art/pocket-pup/to-be-reviewed-animations"
    manifest = json.loads((review / "manifest.json").read_text(encoding="utf-8"))
    target_dir = destination / "clips"
    target_dir.mkdir(exist_ok=True)
    exported = {}
    for row in manifest:
        clip = row["clip"]
        durations = row["durationMs"]
        layers = list(overlays(clip, row["markersMs"]))
        atlas = Image.new("RGBA", (64 * len(durations), 64 * (4 + len(layers))))
        folder = review / clip
        for index in range(len(durations)):
            base = Image.open(folder / f"{index + 1:02}.png").convert("RGBA")
            phases = [base] * 4 if clip.startswith(("03-", "05-", "09-")) else chest_phases(base, (14, 45, 36, 50))
            for phase, sprite in enumerate(phases):
                atlas.paste(sprite, (index * 64, phase * 64))
        effects = []
        for index, (name, layer, start, end) in enumerate(layers, 4):
            atlas.paste(layer, (0, index * 64))
            effects.append({"name": name, "row": index, "startMs": start, "endMs": end})
        target = target_dir / f"{clip}.png"
        atlas.save(target)
        records[f"clips/{clip}"] = {
            "source": f"art/pocket-pup/to-be-reviewed-animations/{clip}",
            "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
            "size": list(atlas.size),
        }
        exported[clip] = {"durations": durations, "effects": effects, "markers": row["markersMs"]}
    metadata = root / "src/features/companion/clipTimings.json"
    metadata.write_text(json.dumps(exported, indent=2) + "\n", encoding="utf-8")


def sleep_sources():
    review = "to-be-reviewed-animations"
    return {name: f"{review}/{frame}.png" for name, frame in {
        "sleeping": "05-sleep-breathing/01", "sleep-drowsy": "04-loaf-to-sleep/02",
        "sleep-doze": "04-loaf-to-sleep/03", "wake-ear": "06-wake-to-loaf/02",
        "wake-eyes": "06-wake-to-loaf/03", "standing-blink": "09-standing-idle/06",
    }.items()}
