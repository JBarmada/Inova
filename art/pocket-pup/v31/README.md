# One connected neutral-to-sit breakdown

- [Three poses with close-ups](three-pose-review.png).
- [Short movement preview](neutral-to-sit.gif) with a 160ms in-between.
- [Slow pose review](neutral-to-sit-slow.gif) with a 900ms in-between.
- Transparent frames: `00.png` neutral, `01.png` new breakdown, `02.png` approved sit.

The user rejected the separate zigzag rear leg and suggested reducing frame count. This study replaces all three intermediates with one pose. One outer polygon defines the torso, thigh, hock, and tucked paw. A short low-contrast crease suggests the fold without a separating dark outline. No body parts are resized.

Neutral and approved sitting endpoints are exact original sprites. The intermediate uses the approved chest core/front-paw pixels, with an unchanged native head translated up two pixels. The farther rear leg stays occluded. A coat-fill connectivity check verifies that the thigh connects into the torso through actual fill pixels, not merely adjacent outlines. Endpoint/chest/paw/head/ground and GIF-frame-count checks also pass. Visual approval remains pending.

Before drawing, reviewed Pedro Medeiros's [Animation Planning](https://www.patreon.com/saint11/posts/animation-7585006), especially planning readable poses before drawing in-betweens, and Roman Gurbanov's [animation timing lesson](https://pixelart.school/learn/pixel-art-anticipation). Using one breakdown is this project's experiment, not a frame-count rule from either tutorial. Tutorials were instructional references only; no artwork was copied.

Rebuild with `python tools/pocket_pup/connected_breakdown.py` using Pillow. Later transition work remains paused. These assets are not integrated into the app; previews reset directly to standing after sitting.
