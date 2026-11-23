# Matching pink and restored :3 blep

[Full reference sheet](reference-sheet.png) includes all prior states, the three revised tongue expressions, and an extra blushing Happy Little Pup.

- All tongue pixels now use Happy :D's existing pink, `#df8b87`, without added shading.
- `tiny-peek.png` restores the selected neutral :3 mouth and adds a small central tongue peek.
- `happy-little-pup-blush.png` adds Happy :D's exact cheek color and placement; the unblushed version remains available.
- Other source expressions are preserved. These are review assets, not integrated app states.

Rebuild with `python tools/pocket_pup/blep_refinement.py` using Pillow. Validation checks sprite dimensions, unchanged transparency, permitted edit regions, matching pink, and source size limits.
