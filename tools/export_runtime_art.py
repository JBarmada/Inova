"""Copy approved grid artwork to the app and record exact source hashes."""
import hashlib
import json
from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageDraw
from pocket_pup.chest_motion import chest_phases
from pocket_pup.loaf_faces import loaf_faces
from pocket_pup.runtime_clips import export_clips, sleep_sources

ROOT = Path(__file__).resolve().parents[1]


def save_pixels(image, target):
    if target.exists():
        with Image.open(target) as before:
            if before.mode == image.mode and before.size == image.size and before.tobytes() == image.tobytes():
                return
    image.save(target)


def export_grounded_motion(destination, records):
    for name, image in loaf_faces(destination).items():
        target = destination / f"{name}.png"
        save_pixels(image, target)
        records[name] = {"source": ["art/pocket-pup/v36/loaf.png", "public/dog/sitting.png",
                                    f"public/dog/sitting-{name.split('-')[1]}.png"
                                    if name.endswith("happy") else "public/dog/sitting-tired.png"],
                         "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
    extra = {"tired": (17, 43, 26, 49), "tuck": (17, 43, 26, 49),
             "loaf-bend": (18, 44, 28, 49), "loaf-tuck": (19, 47, 30, 50)}
    extra.update({f"loaf-{mood}": (24, 48, 34, 50) for mood in ("idle", "happy", "tired")})
    extra.update({f"fitted/sit-{index:02}": (17, 43, 26, 49) for index in range(2, 8)})
    extra.update({name: (24, 49, 34, 50) for name in sleep_sources()})
    extra["standing-blink"] = (17, 43, 26, 49)
    for name, area in extra.items():
        base = Image.open(destination / f"{name}.png").convert("RGBA")
        if name == "sleeping":
            source = ROOT / "art/pocket-pup/to-be-reviewed-animations/05-sleep-breathing"
            phases = [Image.open(source / f"{phase:02}.png").convert("RGBA") for phase in range(1, 5)]
        else:
            phases = chest_phases(base, area)
        for phase, image in enumerate(phases):
            relative = f"breathing/{name}-{phase}"
            target = destination / f"{relative}.png"
            target.parent.mkdir(parents=True, exist_ok=True)
            save_pixels(image, target)
            records[relative] = {"source": f"public/dog/{name}.png",
                                 "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}


def seated_happy(base):
    happy = Image.open(ROOT / "art/pocket-pup/v6/sprites/happy.png").convert("RGBA")
    result = base.copy()
    # Match the standing expression at the seated head offset. Retain the
    # selected seated nose, brow marks, outline and muzzle outside these patches.
    for box in ((13, 27, 16, 31), (24, 27, 27, 31), (9, 33, 13, 35),
                (27, 33, 31, 35), (13, 33, 27, 40)):
        left, top, _, _ = box
        result.paste(happy.crop(box), (left, top - 3))
    return result


def export_seated_faces(destination, records):
    base = Image.open(destination / "sitting.png").convert("RGBA")
    for kind in ("blink", "drowsy", "tired", "happy"):
        name = f"sitting-{kind}"
        relative = f"art/pocket-pup/v35/{name}.png"
        source = ROOT / relative
        target = destination / f"{name}.png"
        if kind == "happy":
            relative = ["art/pocket-pup/v32/02.png", "art/pocket-pup/v6/sprites/happy.png"]
            face = seated_happy(base)
            save_pixels(face, target)
        else:
            copyfile(source, target)
            face = Image.open(source).convert("RGBA")
        changes = [(x, y) for y in range(64) for x in range(64)
                   if face.getpixel((x, y)) != base.getpixel((x, y))]
        if kind == "happy":
            assert all(24 <= y <= 36 and 9 <= x <= 30 for x, y in changes)
        else:
            assert all(24 <= y <= 27 and (13 <= x <= 15 or 24 <= x <= 26) for x, y in changes)
        assert face.getchannel("A").tobytes() == base.getchannel("A").tobytes()
        records[name] = {"source": relative, "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
        for phase in range(4):
            breath = Image.open(destination / f"breathing/sitting-{phase}.png").convert("RGBA")
            image = breath.copy()
            for x, y in changes:
                image.putpixel((x, y - (1 if phase == 2 else 0)), face.getpixel((x, y)))
            assert image.getchannel("A").tobytes() == breath.getchannel("A").tobytes()
            assert image.crop((0, 50, 64, 64)).tobytes() == base.crop((0, 50, 64, 64)).tobytes()
            target = destination / f"breathing/{name}-{phase}.png"
            save_pixels(image, target)
            records[f"breathing/{name}-{phase}"] = {
                "source": [*(relative if isinstance(relative, list) else [relative]),
                           f"art/pocket-pup/v34/sitting-{phase}.png"],
                "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}


def main():
    destination = ROOT / "public/dog"
    destination.mkdir(parents=True, exist_ok=True)
    sources = {"neutral": "v32/00.png", "tuck": "v32/01.png", "sitting": "v32/02.png",
               "happy": "v6/sprites/happy.png", "tired": "v6/sprites/tired.png",
               "bandana": "v6/layers/bandana.png"}
    (destination / "fitted").mkdir(exist_ok=True)
    fit = "pixel-engine-review/generated-motion-fit/editable"
    sources.update({f"fitted/sit-{i:02}": f"{fit}/frame-{i:02}.png" for i in range(2, 8)})
    sources.update({"loaf-bend": "v36/bend-elbows.png", "loaf-tuck": "v36/tuck-paws.png",
                    "loaf-tired": "v36/loaf.png"})
    sources.update(sleep_sources())
    records = {}
    for name, relative in sources.items():
        source = ROOT / "art/pocket-pup" / relative
        target = destination / f"{name}.png"
        copyfile(source, target)
        assert source.read_bytes() == target.read_bytes()
        image = Image.open(target)
        assert image.size == (64, 64) and image.mode == "RGBA"
        assert set(image.getchannel("A").tobytes()) <= {0, 255}
        records[name] = {"source": f"art/pocket-pup/{relative}",
                         "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
    notebook = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(notebook)
    draw.rectangle((47, 44, 58, 55), fill="#4b2d22")
    draw.rectangle((49, 45, 57, 53), fill="#4f938a")
    draw.line((49, 54, 57, 54), fill="#ffe5b3")
    draw.rectangle((51, 47, 55, 49), fill="#fff1d0")
    draw.line((49, 45, 49, 53), fill="#34645f")
    save_pixels(notebook, destination / "notebook.png")
    records["notebook"] = {"source": "tools/export_runtime_art.py",
                            "status": "original placeholder pixel prop, final item art pending"}
    breathing = destination / "breathing"
    breathing.mkdir(exist_ok=True)
    for name in ("neutral", "happy", "sitting"):
        for phase in range(4):
            source = ROOT / f"art/pocket-pup/v34/{name}-{phase}.png"
            target = breathing / source.name
            copyfile(source, target)
            assert source.read_bytes() == target.read_bytes()
            image = Image.open(target)
            base = Image.open(destination / f"{name}.png")
            assert image.crop((0, 50, 64, 64)).tobytes() == base.crop((0, 50, 64, 64)).tobytes()
            records[f"breathing/{name}-{phase}"] = {
                "source": f"art/pocket-pup/v34/{source.name}",
                "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
    export_seated_faces(destination, records)
    export_grounded_motion(destination, records)
    export_clips(ROOT, destination, records)
    metadata = {"canvas": [64, 64], "alpha": "binary", "scale": "integer nearest-neighbor",
                "sitTransitionMs": 840, "fittedFrameDurationsMs": [130, 120, 120, 140, 150, 180],
                "standingNeck": [22, 42], "seatedNeck": [21, 39],
                "breathingDurationsMs": [800, 450, 650, 900],
                "assets": records, "license": "project art; no repository-wide distribution license selected"}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print("Exported dog sprites, fitted transitions and breathing frames with source hashes.")


if __name__ == "__main__":
    main()

