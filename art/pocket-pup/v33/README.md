# Bobbing preview — not integrated

[Animated preview](bobbing-preview.gif) shows neutral, happy, and approved sitting with the same whole-sprite bob.

The 1.2-second cycle uses native vertical offsets 0, -1, -2, -1 with holds of 450, 200, 350, and 200ms. Every pixel moves together: no body compression, head redrawing, or open neck. The GIF uses a 5x preview scale; the app's existing 3x/2x scales would show a smaller motion on screen.

User requested review before adding the bob. No runtime asset, application code, or CSS is changed. Whether the bob should run on all shown poses or only happy remains a review choice.

Rebuild with `python tools/pocket_pup/bob_preview.py` using Pillow. It validates unchanged sprite pixels after translation, GIF frame count/timing, and code size limits. Source SHA-256 values are in `preview.json`.
