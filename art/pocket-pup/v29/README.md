# Neutral-to-sit slow review

[Slow GIF](neutral-to-sit-slow.gif), [five frames side by side with body close-ups](neutral-to-sit-frames.png).

Uses v28's first five frames without changing their artwork. Each movement frame holds for 900ms instead of 180ms, five times slower. Neutral holds for 1.4 seconds and sitting for 1.8 seconds. Individual transparent images are `00.png` through `04.png`; timing is in `review.json`.

The user requested that this section be settled before continuing the rest. Later transition work is paused. Existing in-between artwork remains under review; this export does not approve it. The loop resets directly from sitting to standing.

Rebuild with `python tools/pocket_pup/sit_review.py` using Pillow. Checks verify unchanged sprite pixels, all five GIF frames, timing, and code size limits.
