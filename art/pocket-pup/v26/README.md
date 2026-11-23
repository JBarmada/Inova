# Tucked hind-paw correction

[Before/after and close-ups](paw-comparison.png), [transparent sprite](sitting-idle.png).

The user approved the centered-body direction and requested only a hind-foot fix. This revision replaces flat cream bars with small stepped cream paws, soft highlights, rounded outer corners, and a short sole. No toe lines are added.

Only the two hind-paw areas at rows 50 through 54 change. The head, neck, torso, front paws, and tail are byte-for-byte unchanged from v25. Final paw approval remains pending; animation remains paused and these assets are not integrated.

Rebuild with `python tools/pocket_pup/hind_paws.py` using Pillow. Validation checks the edit boundary, unchanged surrounding pixels, binary alpha, canvas size, ground height, and source size limits.
