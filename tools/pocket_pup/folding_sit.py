"""Three rear-leg fold drawings with a fixed approved chest and forepaws."""
from PIL import Image, ImageDraw

from centered_sit import paws, torso
from full_sheet import load
from hind_paws import fix_paws
from rest_poses import isolated_head
from source import PALETTE


def chest_layer():
    body = Image.new("RGBA", (64, 64))
    draw = ImageDraw.Draw(body)
    torso(draw)
    paws(draw)
    return fix_paws(body)


def rear_leg(draw, hip, knee, hock, foot):
    # A tucked zigzag: knee comes forward, hock folds back, foot turns forward.
    draw.line([knee, hock, foot], fill=PALETTE["outline"], width=7, joint="curve")
    draw.line([knee, hock, foot], fill=PALETTE["coat_shadow"], width=5, joint="curve")
    hx, hy = hip
    kx, ky = knee
    draw.polygon([(hx - 3, hy - 4), (hx + 2, hy - 3), (hx + 5, hy),
                  (hx + 4, hy + 4), (kx + 2, ky + 2), (kx - 2, ky),
                  (kx - 1, ky - 3)], fill=PALETTE["outline"])
    draw.polygon([(hx - 2, hy - 2), (hx + 1, hy - 2), (hx + 3, hy),
                  (hx + 2, hy + 3), (kx + 2, ky), (kx, ky - 1),
                  (kx + 1, ky - 3)], fill=PALETTE["coat"])
    draw.line((hx - 1, hy - 2, hx + 1, hy - 1), fill=PALETTE["coat_light"])
    fx, fy = foot
    draw.polygon([(fx - 2, fy - 1), (fx + 2, fy - 1), (fx + 3, fy),
                  (fx + 2, fy + 1), (fx - 2, fy + 1)], fill=PALETTE["cream"])
    draw.line((fx - 1, fy - 1, fx + 1, fy - 1), fill=PALETTE["cream_light"])


def fold(stage):
    settings = [(-1, (37, 41), (31, 47), (38, 50), (32, 52), (35, 31)),
                (-2, (33, 44), (28, 48), (34, 51), (29, 52), (32, 35)),
                (-3, (29, 47), (26, 50), (30, 52), (29, 52), (29, 39))]
    hy, hip, knee, hock, foot, tail_at = settings[stage]
    image = Image.new("RGBA", (64, 64))
    base = load("v9/fur-details.png")
    tail = base.crop((38, 24, 58, 44)).resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(tail, tail_at)
    draw = ImageDraw.Draw(image)
    hx, hip_y = hip
    draw.polygon([(13, 35), (28, 35), (hx + 1, hip_y - 4),
                  (hx + 3, hip_y + 2), (hx - 1, hip_y + 6),
                  (28, 52), (13, 51), (11, 43)], fill=PALETTE["outline"])
    draw.polygon([(15, 36), (27, 36), (hx, hip_y - 2),
                  (hx + 1, hip_y + 2), (hx - 2, hip_y + 4),
                  (27, 50), (15, 50), (13, 43)], fill=PALETTE["coat"])
    rear_leg(draw, hip, knee, hock, foot)
    chest = chest_layer()
    dark = (*bytes.fromhex(PALETTE["outline"][1:]), 255)
    for y in range(35, 56):
        left, right = (11, 30) if y < 46 else (15, 27)
        for x in range(left, right + 1):
            color = chest.getpixel((x, y))
            if color[3] and not (y < 46 and x >= 28 and color == dark):
                image.putpixel((x, y), color)
    # Draw the source head last without rescaling or changing its cheek outline.
    image.alpha_composite(isolated_head(), (0, hy))
    return image, hy
