# C14 Brown Mouth and Minor Details

The user selected C14 and upper-right eye dots from the full-sprite gallery, requested the dark-brown mouth again, and asked to try subtle shading/details. This pack keeps that exact smile geometry, its one-pixel nose gap, eye highlights, and silhouette.

[View all four treatments](brown-and-details.png).

1. **clean-brown.png**: C14 mouth recolored to the original outline brown, #4b2d22.
2. **soft-face.png**: 14 additional cream/shadow pixels at the cheeks and chin.
3. **fur-details.png**: 16 additional shoulder, chest, coat, and paw pixels.
4. **balanced.png**: both treatments, 30 additional pixels total.

All images are native 64 by 64 transparent PNGs. Detail colors come from the existing palette. None of the finishing treatments adds shading below the eyes or changes clothing anchors. The comparison includes complete dogs and enlarged face crops.

Rebuild with `python tools/pocket_pup/polish_study.py`. Validation checks the original C14 mouth geometry in brown, exact eye pixels, clear nose gap, unchanged alpha silhouette, palette membership, and source code-size limits.

The finishing treatment remains a review choice. No runtime artwork or other expressions are replaced by this study.
