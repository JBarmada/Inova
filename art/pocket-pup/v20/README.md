# Pear-shaped sitting reference

[Standing/sitting comparison](sitting-comparison.png), [large sitting preview](sitting-large.png), and [transparent 64 by 64 sprite](sitting-pear.png).

User direction: preserve the selected dog's head, use a cute pear-shaped body, and bring the front paws together, following the posture of the supplied sitting-dog reference. The second reference is used for pose guidance only; it is not bundled or copied into the sprite.

The body now widens symmetrically from a narrow chest into tucked hindquarters, with central front paws and small back paws beside them. No toe lines are added. The existing selected face pixels remain unchanged; the cleaned head is translated two pixels right and four pixels up. The small curled tail remains behind the body.

This is an unselected art review draft, not integrated into the app. Transition work remains paused. Wearables are not fitted to this pose.

Rebuild with `python tools/pocket_pup/pear_sit.py` using Pillow. Checks cover dimensions, binary transparency, ground row 55, unchanged face pixels, and source size limits.
