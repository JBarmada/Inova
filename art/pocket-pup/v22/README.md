# Restored head and compact sitting review

[Comparison](sitting-comparison.png), [sprite](sitting-idle.png), [isolated source head](preserved-head.png).

The v21 study was explicitly rejected for cutting the head edge and drifting from the selected dog's style. The earlier head crop ended before the right cheek outline, and its cleanup mask also trimmed the lower cheek. This version widens the source selection to retain those original edge pixels without repainting the head. Every opaque pixel in the isolated head is checked against its translated location in the sitting sprite.

The new body returns to a compact honey-colored pear silhouette, small tapered cream bib, adjacent front paws, and tucked back paws. No toe lines are added. The oversized cream chest and long front legs from v21 are not carried forward.

Unselected review draft; not integrated, not fitted for wearables, and not approved for animation. Transition work remains paused.

Rebuild with `python tools/pocket_pup/restored_sit.py` using Pillow. Checks cover preserved source head pixels, 64 by 64 canvas, binary transparency, ground row 55, and code size. These checks do not establish visual approval.
