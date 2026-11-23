"""Fit a generated pose sheet to the Pocket Pup sprite grid using a clip recipe."""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw

import sit_stand_review as preview
from full_sheet import ART, load
from head_edge_fix import corrected_head
from sheet import BACKGROUND, label
from source import PALETTE
from validate import validate_source_sizes

DEFAULT_RECIPE = ART / "pixel-engine-review/generated-motion-fit/recipe.json"
PALETTE_RGB = [tuple(bytes.fromhex(PALETTE[name][1:])) for name in (
    "outline", "deep_shadow", "coat_shadow", "coat", "coat_light",
    "cream_shadow", "cream", "cream_light")]


def fitted_body(cell, spec):
    # The sheet has a nearly white background. Dark pixels locate the baseline
    # and left cheek, and color saturation retains the pale cream fur.
    mask = cell.convert("L").point(lambda value: 255 if value < 130 else 0)
    bounds = spec.get("crop") or mask.getbbox()
    if not bounds:
        raise ValueError("No pose found in cell. Specify its crop box in the recipe.")
    crop = cell.crop(bounds)
    scale = spec.get("scale", 6.2)
    body = crop.resize((round(crop.width / scale), round(crop.height / scale)),
                       Image.Resampling.NEAREST)
    sprite = Image.new("RGBA", (64, 64))
    left, low = spec.get("origin", [5, 56 - body.height])
    if not (0 <= left <= 64 - body.width and 0 <= low <= 64 - body.height):
        raise ValueError("Fitted pose exceeds 64 × 64. Adjust scale or origin.")
    for y in range(body.height):
        for x in range(body.width):
            red, green, blue = pixel = body.getpixel((x, y))
            if red - blue < 26 and min(pixel) > 175:
                continue
            color = min(PALETTE_RGB, key=lambda rgb: sum((a - b) ** 2 for a, b in zip(rgb, pixel)))
            sprite.putpixel((x + left, y + low), (*color, 255))
    return sprite


def replace_head(sprite, head, shift):
    draw = ImageDraw.Draw(sprite)
    # Clear the generated head while retaining the high tail and shoulder.
    for y in range(35):
        edge = 40 if y < 29 else 37
        draw.line((0, y + shift, edge, y + shift), fill=(0, 0, 0, 0))
    for y in range(35, 42):
        cheek = [x for x in range(64) if head.getpixel((x, y))[3]]
        if cheek:
            draw.line((0, y + shift, max(cheek), y + shift), fill=(0, 0, 0, 0))
    sprite.alpha_composite(head, (0, shift))
    assert sprite.crop((11, 23 + shift, 29, 37 + shift)).tobytes() == head.crop((11, 23, 29, 37)).tobytes()


def show(sprite):
    stage = Image.new("RGB", (384, 384), BACKGROUND)
    large = sprite.resize(stage.size, Image.Resampling.NEAREST)
    stage.paste(large, (0, 0), large)
    return stage


def export_editable(sprites, dest, orders):
    directory = dest / "editable"
    directory.mkdir(exist_ok=True)
    for index, sprite in enumerate(sprites, 1):
        assert sprite.size == (64, 64) and sprite.mode == "RGBA"
        sprite.save(directory / f"frame-{index:02}.png")
    for name, order in orders.items():
        strip = Image.new("RGBA", (64 * len(order), 64))
        for index, number in enumerate(order):
            strip.paste(sprites[number], (64 * index, 0))
        strip.save(directory / f"{name}-strip.png")


def fit_frame(sheet, grid, head, spec):
    if "exact" in spec:
        return load(spec["exact"])
    columns, rows = grid
    index = spec["cell"]
    if not 0 <= index < columns * rows:
        raise ValueError(f"Cell {index} is outside the sheet grid.")
    x, y = index % columns, index // columns
    cell = sheet.crop((x * sheet.width // columns, y * sheet.height // rows,
                       (x + 1) * sheet.width // columns, (y + 1) * sheet.height // rows))
    sprite = fitted_body(cell, spec)
    shift = spec.get("neutral_head_y")
    if shift is not None:
        replace_head(sprite, head, shift)
    for x, y in spec.get("erase", []):
        if shift is not None and 0 <= y - shift < 64 and head.getpixel((x, y - shift))[3]:
            raise ValueError(f"Erase at {(x, y)} intersects the original head.")
        sprite.putpixel((x, y), (0, 0, 0, 0))
    return sprite


def export_review(sprites, timings, orders, dest):
    dest.mkdir(parents=True, exist_ok=True)
    export_editable(sprites, dest, orders)
    frames = [show(sprite) for sprite in sprites]
    board = Image.new("RGB", (1536, 423 * ((len(frames) + 3) // 4)), BACKGROUND)
    draw = ImageDraw.Draw(board)
    for i, frame in enumerate(frames):
        x, y = i % 4 * 384, i // 4 * 423
        board.paste(frame, (x, y + 32))
        label(draw, (x + 18, y + 9), f"FRAME {i + 1}", 17)
    board.save(dest / "frames.png")
    for name, order in orders.items():
        preview.save_loop(dest / f"{name}.gif", [frames[i] for i in order], [timings[i] for i in order])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("recipe", nargs="?", type=Path, default=DEFAULT_RECIPE)
    parser.add_argument("--output", type=Path, help="Override the recipe output folder")
    args = parser.parse_args()
    config = json.loads(args.recipe.read_text(encoding="utf-8"))
    specs = config["frames"]
    timings = [spec["ms"] for spec in specs]
    if len(specs) < 2 or any(t < 10 or t % 10 for t in timings):
        raise ValueError("Supply at least two frames with positive GIF timings in 10 ms steps.")
    sheet = Image.open(ART / config["sheet"]).convert("RGB")
    head = corrected_head(load(config["neutral_head_source"]))
    sprites = [fit_frame(sheet, config["grid"], head, spec) for spec in specs]
    assert all(set(sprite.getchannel("A").tobytes()) <= {0, 255} for sprite in sprites)
    orders = {config["clip"]: list(range(len(specs)))}
    if config.get("reverse_clip"):
        orders[config["reverse_clip"]] = list(reversed(range(len(specs))))
    export_review(sprites, timings, orders, args.output or ART / config["output"])
    validate_source_sizes(Path(__file__).parent)


if __name__ == "__main__":
    main()
