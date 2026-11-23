"""Convert the selected generated concept into a fixed-grid, limited-palette base."""
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw

PALETTE = {
    "outline": "#4b2d22", "deep_shadow": "#9c592c",
    "coat_shadow": "#d99346", "coat": "#f0aa53",
    "coat_light": "#ffbd6d", "cream_shadow": "#f3d39a",
    "cream": "#ffe5b3", "cream_light": "#fff1d0",
    "nose": "#513024", "tongue": "#df8b87",
    "tongue_shadow": "#b65b65", "bandana": "#4f938a",
    "bandana_dark": "#34645f",
    "eye_white": "#fffaf1",
    "mouth_black": "#000000",
}


def largest_component(mask):
    pixels = mask.load()
    seen, largest = set(), []
    for y in range(mask.height):
        for x in range(mask.width):
            if not pixels[x, y] or (x, y) in seen:
                continue
            queue, component = deque([(x, y)]), []
            seen.add((x, y))
            while queue:
                point = queue.popleft()
                component.append(point)
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = point[0] + dx, point[1] + dy
                    inside = 0 <= nx < mask.width and 0 <= ny < mask.height
                    if inside and (nx, ny) not in seen and pixels[nx, ny]:
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            if len(component) > len(largest):
                largest = component
    return largest


def extract_dog(source):
    crop = Image.open(source).convert("RGB").crop((800, 560, 1340, 935))
    mask = Image.new("L", crop.size)
    mask.putdata([255 if (r - b > 43 and r - g > 7) or max(r, g, b) < 145 else 0
                  for r, g, b in crop.getdata()])
    component = largest_component(mask)
    if not component:
        raise ValueError("The expected Pocket Pup source region has no dog.")
    mask = Image.new("L", crop.size)
    for point in component:
        mask.putpixel(point, 255)
    ImageDraw.floodfill(mask, (0, 0), 128)
    mask = mask.point(lambda value: 0 if value == 128 else 255)
    crop.putalpha(mask)
    return crop.crop(mask.getbbox())


def create_base(source):
    dog = extract_dog(source)
    height = round(dog.height * 52 / dog.width)
    dog = dog.resize((52, height), Image.Resampling.BOX)
    alpha = dog.getchannel("A").point(lambda value: 255 if value >= 150 else 0)
    swatches = [tuple(bytes.fromhex(color[1:])) for color in list(PALETTE.values())[:8]]
    output = Image.new("RGBA", dog.size)
    for y in range(dog.height):
        for x in range(dog.width):
            rgb = dog.getpixel((x, y))[:3]
            nearest = min(swatches, key=lambda color: sum((a - b) ** 2 for a, b in zip(color, rgb)))
            output.putpixel((x, y), (*nearest, alpha.getpixel((x, y))))
    canvas = Image.new("RGBA", (64, 64))
    canvas.alpha_composite(output, (5, 56 - height))
    return canvas


def write_base(source, destination):
    destination = Path(destination)
    destination.mkdir(parents=True, exist_ok=True)
    base = create_base(source)
    base.save(destination / "idle.png")
    base.resize((512, 512), Image.Resampling.NEAREST).save(destination / "base-review.png")
    return base
