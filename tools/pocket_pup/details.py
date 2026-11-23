"""Large face crops make single-pixel expression changes easy to review."""
from PIL import Image, ImageDraw

from sheet import BACKGROUND, label


def face_comparison(previous, frames, old_version=1, new_version=2):
    image = Image.new("RGB", (1440, 750), BACKGROUND)
    draw = ImageDraw.Draw(image)
    label(draw, (45, 30), "POCKET PUP / FACE REFINEMENT", 32)
    label(draw, (45, 80), "Corner-dot eye highlights. Higher neutral face and black :3 mouth.", 19)
    for column, name in enumerate(("idle", "happy", "tired", "barking")):
        x = 65 + column * 346
        label(draw, (x, 132), "NEUTRAL" if name == "idle" else name.upper(), 22)
        old = Image.open(previous / "sprites" / f"{name}.png").convert("RGBA")
        for y, sprite in ((185, old), (445, frames[name])):
            face = sprite.crop((8, 23, 32, 42)).resize((288, 228), Image.Resampling.NEAREST)
            image.paste(face, (x, y), face)
        label(draw, (x, 161), f"v{old_version}", 15)
        unchanged = old.tobytes() == frames[name].tobytes()
        label(draw, (x, 422), f"v{new_version}" + (" / unchanged" if unchanged else ""), 15)
    label(draw, (45, 708), "All changes stay inside the face. Tired, sleeping, body, and clothing anchors are preserved.", 17)
    return image
