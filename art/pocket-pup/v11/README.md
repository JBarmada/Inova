# Blended Details Inside the Smile Cups

The user corrected the previous study: freckles belong inside the two cups of the :3, the colors need to blend with the cream muzzle, and any shading should describe a sensible rounded form rather than float beneath the mouth.

[Compare all six complete dogs and face crops](blended-muzzle.png).

1. Clean selected base.
2. Four inner pores using a 10% warm-brown tint.
3. Six inner pores using an 18% tint.
4. Rounded muzzle pads with very light top-to-bottom tinting.
5. Restrained lower-right edge shade and upper-left light within each pad.
6. Rounded pads with faint inner pores.

Every changed pixel lies inside the smile cups. The existing nose, mouth strokes, one-pixel gap, eyes, fur details, silhouette, and clothing anchors stay unchanged. Tints are blended against the local fur color before export, giving a low-opacity appearance with crisp fully opaque sprite pixels. The resulting additional RGB colors are recorded in manifest.json; they are study colors rather than a finalized expanded palette.

Rebuild with `python tools/pocket_pup/blended_muzzle.py`. Validation checks unchanged alpha, changes restricted to the two cup interiors, bounded color contrast, and code-size limits. These are review alternatives; no runtime sprites or other expressions are updated.
