# Sitting revision: body, tail, and paws

Transition animation is paused at the user's request until the sitting pose is settled.

[Comparison](sitting-options.png) shows the previous pose, A (`sit-compact.png`), and B (`sit-upright.png`). Both new alternatives use a rounder seated haunch, a smaller lower curl behind the hip, cream paws, and a short low-contrast toe line on each front paw. B raises the head three pixels relative to A to show more chest. The selected face artwork remains unchanged.

These are transparent 64 by 64 review sprites with binary alpha and ground row 55. Neither alternative is selected or integrated. The full reference sheet still contains the earlier sitting draft pending selection; clothing fitting remains unfinished.

Rebuild with `python tools/pocket_pup/sit_revision.py` using Pillow. The script validates dimensions, binary transparency, ground height, and source size limits.
