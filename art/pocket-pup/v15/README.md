# Awake sitting idle

[Sitting review](sitting-review.png) shows a new upright seated body with the selected neutral :3 face and alert open eyes. [Full reference sheet](reference-sheet.png) includes the previous ten entries plus sitting.

`sitting-idle.png` is a transparent 64 by 64 sprite with binary alpha and ground row 55. The original face is preserved exactly, translated two pixels right and three pixels up. The body has a cream chest, two planted front paws, a seated haunch, and the existing curled tail.

This is a separate pose. Standing clothing anchors must not be assumed to fit; accessory fitting and idle animation remain unfinished. The sprite is not integrated into the app.

Rebuild using `python tools/pocket_pup/sitting.py` with Pillow. Validation checks dimensions, transparency, ground height, exact face preservation, and source size limits.
