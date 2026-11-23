"""Fit face-only expression changes onto the native v36 loaf."""
from PIL import Image


def face_delta(target, base, expression, y_offset):
    result = target.copy()
    for y in range(22, 38):
        for x in range(8, 32):
            point = (x, y + y_offset)
            if base.getpixel((x, y)) != expression.getpixel((x, y)):
                color = expression.getpixel((x, y))
                assert color[3] == result.getpixel(point)[3] == 255
                result.putpixel(point, color)
    return result


def loaf_faces(destination):
    def read(name):
        return Image.open(destination / f"{name}.png").convert("RGBA")

    tired = read("loaf-tired")
    seated = read("sitting")
    neutral = face_delta(tired, read("sitting-tired"), seated, 10)
    return {"loaf-idle": neutral, "loaf-happy": face_delta(neutral, seated, read("sitting-happy"), 10)}
