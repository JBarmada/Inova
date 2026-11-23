# Actual right-edge correction

[Comparison](sitting-comparison.png) and [sprite](sitting-idle.png).

The v22 claim that the cheek edge was restored was incorrect: source column 37 was still missing for rows 28 through 32, while two body-connector pixels at column 38 protruded from the cheek. This correction restores those five source pixels and removes the two protruding pixels. Exactly seven pixels differ from v22; the sitting body is unchanged and remains unapproved.

The generator additionally compares the complete head rectangle through source row 34, including transparent edge pixels, against the original, rather than checking only pixels retained by an incomplete mask. Lower cheek pixels remain taken from the original source outline.

Rebuild with `python tools/pocket_pup/head_edge_fix.py` using Pillow. Animation remains paused; this draft is not integrated into the app.
