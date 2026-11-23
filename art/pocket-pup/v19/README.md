# Unified sitting chest and forelegs

[Comparison](sitting-comparison.png) and [transparent sprite](sitting-idle.png).

The v18 leg copies were rejected because the rectangular patches carried unrelated standing-body pixels into the chest. This revision redraws the torso and both forelegs continuously, with one tapered cream bib and matching stepped cream paws. It uses the existing palette, small highlight clusters, brown sole shading, and no added toe lines. The selected face, cleaned cheek silhouette, and small tail remain.

This is a review alternative, not a final selection or app integration. Animation remains paused. Earlier full reference sheets have not been overwritten.

Rebuild with `python tools/pocket_pup/unified_sit.py` using Pillow. Checks verify the 64 by 64 grid, binary transparency, ground row 55, unchanged face pixels, and source size limits. These checks do not establish visual approval.
