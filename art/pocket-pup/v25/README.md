# Centered body and continuous outline

[Before/after comparison](body-comparison.png), [transparent sprite](sitting-idle.png).

Centers the torso, front paws, and tucked back paws beneath the head at x21. The neck-to-base outline uses paired bounds that widen continuously, removing the earlier inward/outward shoulder kink. The small tail moves with the body. All opaque head pixels remain unchanged from v24, including the corrected cheek edge. No toe lines are added.

Unselected review draft, not integrated or fitted for clothing. Transition animation remains paused.

Rebuild with `python tools/pocket_pup/centered_sit.py` using Pillow. Validation checks unchanged head pixels, canvas dimensions, ground height, and source size limits.
