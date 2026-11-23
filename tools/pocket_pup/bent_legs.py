"""Native-grid jointed legs and overlapping necks; no body or head resizing."""
from PIL import Image, ImageDraw

from full_sheet import load
from rest_poses import isolated_head, lying_body
from source import PALETTE


def limb(draw, joints, shadow=False):
    draw.line(joints, fill=PALETTE["outline"], width=7, joint="curve")
    draw.line(joints, fill=PALETTE["coat_shadow" if shadow else "coat"], width=5, joint="curve")


def tail(image, position):
    # Reuse one already-approved tail size unchanged throughout the moving frames.
    source = load("v9/fur-details.png").crop((38, 24, 58, 44))
    source = source.resize((14, 14), Image.Resampling.NEAREST)
    image.alpha_composite(source, position)


def neck(draw, head_y, bottom):
    top = 34 + head_y
    draw.polygon([(11, top), (30, top), (32, top + 5),
                  (31, bottom), (12, bottom), (10, top + 5)], fill=PALETTE["outline"])
    draw.polygon([(13, top), (28, top), (30, top + 5),
                  (29, bottom), (14, bottom), (12, top + 5)], fill=PALETTE["coat"])
    draw.polygon([(14, top), (28, top), (28, top + 5),
                  (26, bottom - 2), (22, bottom), (18, bottom - 2),
                  (14, top + 5)], fill=PALETTE["cream"])
    draw.polygon([(16, top), (26, top), (26, top + 5),
                  (22, bottom - 2), (18, bottom - 4)], fill=PALETTE["cream_light"])


def front_paws(image):
    approved = load("v26/sitting-idle.png")
    # Only the approved paw tips, never rectangular standing-body patches.
    for left, right in ((15, 21), (22, 27)):
        image.alpha_composite(approved.crop((left, 50, right, 56)), (left, 50))


def sit_bend(stage):
    settings = [(-1, 37, 43, 40, 52, 35, 30),
                (-2, 33, 46, 35, 52, 32, 34),
                (-3, 28, 48, 30, 52, 29, 38)]
    hy, hx, hip_y, foot_x, foot_y, tx, ty = settings[stage]
    image = Image.new("RGBA", (64, 64))
    tail(image, (tx, ty))
    draw = ImageDraw.Draw(image)
    limb(draw, [(hx, hip_y - 2), (hx + 3, hip_y + 2), (foot_x, foot_y)], True)
    draw.line((foot_x - 2, 53, foot_x + 2, 53), fill=PALETTE["cream"], width=2)
    draw.polygon([(15, 37 + hy), (29, 36 + hy), (hx + 2, hip_y - 5),
                  (hx + 5, hip_y), (hx + 3, hip_y + 4),
                  (25, 50), (14, 47)], fill=PALETTE["outline"])
    draw.polygon([(17, 38 + hy), (28, 38 + hy), (hx + 1, hip_y - 3),
                  (hx + 3, hip_y), (hx + 1, hip_y + 2),
                  (25, 48), (16, 46)], fill=PALETTE["coat"])
    draw.line((hx - 3, hip_y - 2, hx, hip_y - 1), fill=PALETTE["coat_light"])
    for shoulder, elbow, wrist in [((17, 39 + hy), (17, 46), (18, 51)),
                                    ((26, 40 + hy), (26, 46), (24, 51))]:
        limb(draw, [shoulder, elbow, wrist])
    neck(draw, hy, 45)
    front_paws(image)
    image.alpha_composite(isolated_head(), (0, hy))
    return image, hy


def lower_bend(stage):
    settings = [(0, 16, 26, 47, 30, 48), (3, 14, 28, 49, 34, 49),
                (6, 15, 27, 51, 39, 50), (8, 17, 25, 52, 44, 51)]
    hy, left_elbow, right_elbow, elbow_y, back_x, back_y = settings[stage]
    image = Image.new("RGBA", (64, 64))
    tail(image, (30 + stage * 2, 39))
    draw = ImageDraw.Draw(image)
    draw.polygon([(18, 39 + hy), (29, 38 + hy), (back_x, back_y - 3),
                  (back_x + 3, back_y), (back_x + 3, 53),
                  (back_x, 55), (13, 55), (11, 50)], fill=PALETTE["outline"])
    draw.polygon([(19, 41 + hy), (28, 40 + hy), (back_x - 1, back_y - 1),
                  (back_x + 1, back_y + 1), (back_x + 1, 52),
                  (back_x - 2, 53), (15, 53), (14, 50)], fill=PALETTE["coat"])
    draw.line((back_x - 5, back_y, back_x - 2, back_y + 1), fill=PALETTE["coat_light"])
    for shoulder, elbow, wrist in [((16, 39 + hy), (left_elbow, elbow_y), (18, 51)),
                                    ((27, 39 + hy), (right_elbow, elbow_y), (24, 51))]:
        limb(draw, [shoulder, elbow, wrist])
    neck(draw, hy, min(52, 46 + hy))
    front_paws(image)
    image.alpha_composite(isolated_head(True), (0, hy))
    return image, hy


def resting(closed=False, breath=False):
    image = lying_body()
    draw = ImageDraw.Draw(image)
    draw.rectangle((10, 52, 29, 55), fill=(0, 0, 0, 0))
    draw.polygon([(12, 51), (28, 51), (30, 53), (29, 55),
                  (13, 55), (11, 53)], fill=PALETTE["outline"])
    draw.line((13, 52, 28, 52), fill=PALETTE["coat"])
    draw.line((14, 53, 28, 53), fill=PALETTE["coat"])
    hy = 9 if breath else 10
    neck(draw, hy, 54)
    front_paws(image)
    image.alpha_composite(isolated_head(True, closed), (0, hy))
    return image, hy
