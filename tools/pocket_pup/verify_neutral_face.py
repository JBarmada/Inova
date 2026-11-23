"""Check fixed neutral face regions against the user-selected 64px sprite."""
import argparse
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
REFERENCE = ROOT / "art/pocket-pup/v9/fur-details.png"
REGIONS = {
    "left_brow": (12, 23, 17, 27), "right_brow": (23, 23, 28, 27),
    "left_eye": (13, 27, 16, 30), "right_eye": (24, 27, 27, 30),
    "nose": (18, 30, 22, 32), "nose_mouth_gap": (13, 32, 27, 33),
    "mouth_c14": (13, 33, 27, 37),
}


def verify(image, reference):
    result = {"size": list(image.size), "expectedSize": [64, 64], "regions": {}}
    if image.size != (64, 64):
        result["status"] = "fail"
        result["reason"] = "Wrong canvas size; pixel alignment and face cannot be verified."
        return result
    for name, bounds in REGIONS.items():
        expected, actual = reference.crop(bounds), image.crop(bounds)
        differences = sum(a != b for a, b in zip(actual.tobytes(), expected.tobytes()))
        result["regions"][name] = {"bounds": bounds, "differentPixels": differences,
                                   "pass": differences == 0}
    result["status"] = "pass" if all(item["pass"] for item in result["regions"].values()) else "fail"
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sprite", type=Path)
    args = parser.parse_args()
    image = Image.open(args.sprite).convert("RGBA")
    reference = Image.open(REFERENCE).convert("RGBA")
    result = verify(image, reference)
    print(json.dumps(result, indent=2))
    if result["status"] != "pass":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
