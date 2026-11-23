"""Export native frames plus normal and slowed GIFs for human review."""
import argparse
import json
from functools import cache
from pathlib import Path

from PIL import Image, ImageDraw

from pocket_pup.chest_motion import chest_phases
from pocket_pup.review_clips import idle_clips, interaction_clips, rest_clips
from pocket_pup.review_effects import overlays
from pocket_pup.source import largest_component

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "art/pocket-pup"
REVIEW = ART / "to-be-reviewed-animations"
PAPER = "#f8f2e5"
INK = "#4b2d22"


@cache
def read(name):
    folder = ART if name.partition("/")[0].startswith("v") else ROOT / "public/dog"
    with Image.open(folder / f"{name}.png") as image:
        return image.convert("RGBA")


def inspect(sprite):
    alpha = sprite.getchannel("A")
    assert sprite.size == (64, 64) and sprite.mode == "RGBA"
    assert set(alpha.tobytes()) <= {0, 255}
    assert alpha.getbbox()[3] == 56, alpha.getbbox()
    assert len(largest_component(alpha)) == alpha.tobytes().count(255), alpha.getbbox()


def display(sprite, scale, caption, clip=None):
    size = 64 * scale
    page = Image.new("RGB", (size, size + 36), PAPER)
    image = sprite.resize((size, size), Image.Resampling.NEAREST)
    page.paste(image, (0, 10), image)
    draw = ImageDraw.Draw(page)
    if clip:
        draw.text((8, 6), clip, fill=INK)
    draw.text((8, size + 10), caption, fill=INK)
    return page


def breathing_preview(sprite, duration, elapsed, baked):
    if baked:
        yield sprite, duration
        return
    phases = chest_phases(sprite, (14, 45, 36, 50))
    end = elapsed + duration
    while elapsed < end:
        position = elapsed % 2800
        phase, boundary = next((i, until) for i, until in enumerate((800, 1250, 1900, 2800)) if position < until)
        period = min(end - elapsed, boundary - position)
        yield phases[phase], period
        elapsed += period


def export_gif(path, clip, frames, durations, *, slow=False, layers=()):
    pages, timing, elapsed = [], [], 0
    baked = clip.startswith(("03-", "05-", "09-"))
    for index, (frame, ms) in enumerate(zip(frames, durations), 1):
        caption = f"Pose {index:02d} / {len(frames):02d}    {ms} ms"
        if slow:
            segments = [(frame, min(2000, max(450, ms * 2)))]
        else:
            segments = breathing_preview(frame, ms, elapsed, baked)
        for sprite, duration in segments:
            active = [layer for _, layer, start, end in layers if start <= elapsed < end]
            if active:
                sprite = sprite.copy()
                for layer in active:
                    sprite.alpha_composite(layer)
            pages.append(display(sprite, 5, caption, clip))
            timing.append(duration)
        elapsed += ms
    pages[0].save(path, save_all=True, append_images=pages[1:], duration=timing, loop=0, disposal=2)
    with Image.open(path) as gif:
        assert sum(gif.seek(i) or gif.info["duration"] for i in range(gif.n_frames)) == sum(timing)


def export_clip(root, clip, frames, durations, markers):
    assert len(frames) == len(durations) and all(ms > 0 and ms % 10 == 0 for ms in durations)
    assert all(0 <= ms < sum(durations) for ms in markers.values())
    target = root / clip
    target.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGB", (256 * min(4, len(frames)), 292 * ((len(frames) + 3) // 4)), PAPER)
    for i, (frame, ms) in enumerate(zip(frames, durations)):
        try:
            inspect(frame)
        except AssertionError as error:
            raise AssertionError(f"{clip}, pose {i + 1}: {error}") from error
        frame.save(target / f"{i + 1:02}.png")
        sheet.paste(display(frame, 4, f"Pose {i + 1:02} / {ms} ms"), ((i % 4) * 256, (i // 4) * 292))
    sheet.save(target / "frames.png")
    layers = list(overlays(clip, markers))
    for name, sprite, _, _ in layers:
        sprite.save(target / f"{name}.png")
    export_gif(target / "preview.gif", clip, frames, durations, layers=layers)
    export_gif(target / "slow.gif", clip, frames, durations, slow=True)
    return {"clip": clip, "durationMs": durations, "markersMs": markers,
            "previewLayers": [name for name, *_ in layers],
            "playback": "loop" if clip.startswith(("05-", "09-", "11b-")) else "once"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=REVIEW)
    output = parser.parse_args().output
    clips = [*rest_clips(read), *idle_clips(read), *interaction_clips(read)]
    clips.sort(key=lambda clip: clip[0])
    manifest = [export_clip(output, *clip) for clip in clips]
    overview = Image.new("RGB", (192 * 4, 228 * ((len(clips) + 3) // 4)), PAPER)
    for i, (clip, frames, _, _) in enumerate(clips):
        overview.paste(display(frames[len(frames) // 2], 3, clip), ((i % 4) * 192, (i // 4) * 228))
    overview.save(output / "overview.png")
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Verified {len(clips)} clips and {sum(len(clip[1]) for clip in clips)} native frame slots.")


if __name__ == "__main__":
    main()
