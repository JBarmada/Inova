# Tucked sitting correction

[Review image](sitting-review.png) and [transparent sprite](sitting-tucked.png).

The v16 side haunch was rejected as too prominent. This revision removes the separate side thigh shape, narrows the torso beneath the head, and tucks the hind legs behind the front paws. A smaller tail peeks behind the torso. Cream paws retain their small, soft toe lines. The selected face remains unchanged.

The 64 by 64 sprite uses binary transparency and ground row 55. It is an unselected review alternative, not integrated into the app or fitted for clothing. Transition work remains paused until the sitting pose is approved.

Rebuild with `python tools/pocket_pup/tucked_sit.py` using Pillow. Dimensions, transparency, ground height, and source size limits are checked.
