# Thicker sitting neck

[Before/after comparison](neck-comparison.png), [transparent sprite](sitting-idle.png).

Widens the neck beneath the cheeks and blends it into the shoulders, following the user's proportion reference. The cream bib widens with the neck. All head pixels, paws, lower body, and tail are unchanged from v23; edits are restricted to the neck and upper chest.

Unselected art review, not integrated. Animation remains paused.

Rebuild with `python tools/pocket_pup/thicker_neck.py` using Pillow. The script verifies unchanged head pixels and all pixels outside the neck/chest edit region, and checks source size limits.
