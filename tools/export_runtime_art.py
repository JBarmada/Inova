"""Copy approved grid artwork to the app and record exact source hashes."""
import hashlib
import json
from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]


def main():
    destination = ROOT / "public/dog"
    destination.mkdir(parents=True, exist_ok=True)
    sources = {"neutral": "v32/00.png", "tuck": "v32/01.png", "sitting": "v32/02.png",
               "happy": "v6/sprites/happy.png", "tired": "v6/sprites/tired.png",
               "bandana": "v6/layers/bandana.png"}
    records = {}
    for name, relative in sources.items():
        source = ROOT / "art/pocket-pup" / relative
        target = destination / f"{name}.png"
        copyfile(source, target)
        assert source.read_bytes() == target.read_bytes()
        image = Image.open(target)
        assert image.size == (64, 64) and image.mode == "RGBA"
        assert set(image.getchannel("A").get_flattened_data()) <= {0, 255}
        records[name] = {"source": f"art/pocket-pup/{relative}",
                         "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
    notebook = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(notebook)
    draw.rectangle((47, 44, 58, 55), fill="#4b2d22")
    draw.rectangle((49, 45, 57, 53), fill="#4f938a")
    draw.line((49, 54, 57, 54), fill="#ffe5b3")
    draw.rectangle((51, 47, 55, 49), fill="#fff1d0")
    draw.line((49, 45, 49, 53), fill="#34645f")
    notebook.save(destination / "notebook.png")
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
    metadata = {"canvas": [64, 64], "alpha": "binary", "scale": "integer nearest-neighbor",
                "sitTransitionMs": 160, "standingNeck": [22, 42], "seatedNeck": [21, 39],
                "breathingDurationsMs": [800, 450, 650, 900],
                "assets": records, "license": "project art; no repository-wide distribution license selected"}
    (destination / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print("Exported seven base/layer assets and twelve approved breathing frames; source pixels and grounded paws verified.")


if __name__ == "__main__":
    main()
