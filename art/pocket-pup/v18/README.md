# Sitting consistency correction

[Standing/sitting comparison](sitting-comparison.png), [transparent sitting sprite](sitting-idle.png).

The user flagged broad frontal legs, added toe lines, and a triangle above the tail. The triangle came from standing shoulder pixels included in the rectangular head crop. This revision masks that area and restores a continuous cheek outline. The original selected face remains intact.

The sitting paws reuse the original standing sprite's native pixel artwork, including stepped silhouettes, brown shading, and cream highlights. The added toe lines are removed. The body remains tucked rather than showing the rejected side haunch.

This is an unselected review draft, not integrated into the app. Transition animation remains paused pending approval of sitting. Earlier full sheets retain their historical sitting drafts.

Rebuild with `python tools/pocket_pup/consistent_sit.py` using Pillow. Validation checks exact near-paw and face pixels, dimensions, binary alpha, ground height, and source size limits.
