"""Check actual sprite dimensions, alpha, palette, layers, and code-size limits."""
import ast
from pathlib import Path

from PIL import Image

from source import PALETTE


def validate_frames(frames, overlays):
    allowed = {tuple(bytes.fromhex(color[1:])) for color in PALETTE.values()}
    for name, image in list(frames.items()) + list(overlays.items()):
        assert image.size == (64, 64), name
        assert image.mode == "RGBA", name
        assert set(image.getchannel("A").getdata()) <= {0, 255}, name
        colors = {pixel[:3] for pixel in image.getdata() if pixel[3]}
        assert colors <= allowed, (name, colors - allowed)
    standing = [image.getchannel("A").tobytes() for name, image in frames.items()
                if name != "sleeping"]
    assert all(mask == standing[0] for mask in standing), "Standing silhouettes differ."
    assert overlays["bandana"].getbbox(), "Accessory is empty."


def validate_face_changes(frames, previous):
    old_frames = {name: Image.open(previous / "sprites" / f"{name}.png").convert("RGBA")
                  for name in frames}
    for name in ("tired", "sleeping"):
        assert frames[name].tobytes() == old_frames[name].tobytes(), (name, "changed")
    dark = tuple(bytes.fromhex(PALETTE["outline"][1:]))
    for name in ("idle", "happy", "barking", "blink"):
        image = frames[name]
        for y in range(64):
            for x in range(64):
                if not (10 <= x <= 29 and 23 <= y <= 40):
                    assert image.getpixel((x, y)) == old_frames[name].getpixel((x, y)), (name, x, y)
        nose_rows = (30, 31) if name in ("idle", "blink") else (31, 32)
        gap_rows = (32, 33) if name in ("idle", "blink") else (33, 34)
        assert all(image.getpixel((x, y))[:3] == dark
                   for y in nose_rows for x in range(18, 22)), name
        assert all(image.getpixel((x, y))[:3] != dark
                   for y in gap_rows for x in range(16, 24)), (name, "nose touches mouth")


def validate_source_sizes(directory):
    for path in Path(directory).glob("*.py"):
        text = path.read_text(encoding="utf-8")
        lines = text.splitlines()
        code = lambda section: sum(bool(line.strip()) and not line.lstrip().startswith("#")
                                   for line in section)
        assert code(lines) <= 250, f"File too long: {path}"
        for node in ast.walk(ast.parse(text)):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                assert code(lines[node.lineno - 1:node.end_lineno]) < 75, (path, node.name)
