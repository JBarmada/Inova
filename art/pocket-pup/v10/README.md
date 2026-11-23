# Muzzle Detail Alternatives

The user selected the v9 fur-details treatment, keeping the brown C14 mouth and upper-right eye dots, and requested small whisker/shading experiments around the mouth.

[Full dogs and face details](muzzle-details.png) compare:

1. Selected base, with no new muzzle pixels.
2. Four soft honey-colored freckle pixels.
3. Six deeper warm-brown whisker-pore pixels.
4. Ten pixels forming short horizontal whisker strokes.
5. Twelve pixels of soft muzzle/lip shading.
6. The warm freckles and soft shading combined, sixteen pixels.

Each native PNG is 64 by 64 with binary transparency. The selected fur, eyes, nose, smile outline, one-pixel nose gap, silhouette, and clothing anchors remain unchanged. Only the muzzle finishing treatment varies. The details use existing palette colors.

Rebuild with `python tools/pocket_pup/muzzle_study.py`. The generator checks dimensions, alpha, palette, unchanged dark smile/nose pixels, and unchanged pixels outside the muzzle region. This is an art review pack, not an app update or a change to other expressions.
