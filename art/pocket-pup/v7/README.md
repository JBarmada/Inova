# Lower Smile and Highlight Alternatives

The user selected version six option B (connected smile), then requested a larger neutral :3 one pixel lower, plus different white-dot corners. These are review alternatives, not an approved final state or an application update.

- [Mouth and eye grid](mouth-and-eyes.png): three mouth shapes crossed with all four highlight corners.
- [Full dog comparison](full-dog-comparison.png): selected B and the three new mouth shapes at the same scale.
- [Manifest](manifest.json): exact mouth patterns, eye origins, and offsets.

M1 is wider (10 by 3 pixels); M2 is rounder (10 by 4); M3 is the largest (12 by 4). Every new smile curve starts at row 33, one row lower than selected B's row 32. A short central bridge preserves the connection to the unchanged nose. All mouths use black.

UL, UR, LL, and LR mean upper-left, upper-right, lower-left, and lower-right within each eye. Each eye has exactly one white pixel. Both eyes use the indicated corner consistently.

The twelve native PNGs are named by mouth and corner, such as M2-UR.png. Every file is transparent 64 by 64 RGBA. The generator verifies identical silhouettes, unchanged pixels outside the eyes and mouth, exact highlight placement, and code-size limits.

Rebuild with `python tools/pocket_pup/refine_study.py`. This reads the preserved v6/neutral-connected.png and writes only this study folder. Happy, tired, barking, sleeping, and application state are not modified.
