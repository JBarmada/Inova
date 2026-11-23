"""Local palette motion with fixed face, silhouette and feet."""
from PIL import ImageColor

from .source import PALETTE

LIGHTER = {ImageColor.getcolor(PALETTE[a], "RGBA"): ImageColor.getcolor(PALETTE[b], "RGBA")
           for a, b in (("cream", "cream_light"), ("cream_shadow", "cream"),
                        ("coat", "coat_light"), ("coat_shadow", "coat"))}


def chest_phases(base, area):
    left, top, right, bottom = area
    points = [(x, y) for y in range(top, bottom) for x in range(left, right)
              if base.getpixel((x, y)) in LIGHTER]
    assert points, area
    center = (left + right) // 2
    points.sort(key=lambda p: abs(p[0] - center) + abs(p[1] - top))
    phases = [base]
    for count in (2, 5, 2):
        image = base.copy()
        for point in points[:count]:
            image.putpixel(point, LIGHTER[base.getpixel(point)])
        assert image.getchannel("A").tobytes() == base.getchannel("A").tobytes()
        assert image.crop((0, 50, 64, 64)).tobytes() == base.crop((0, 50, 64, 64)).tobytes()
        phases.append(image)
    return phases
