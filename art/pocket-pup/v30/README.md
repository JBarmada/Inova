# Rear-leg folding revision: neutral to sit only

[Five-frame comparison](neutral-to-sit-frames.png), [slow GIF](neutral-to-sit-slow.gif). Individual transparent frames are `00.png` through `04.png`.

Only intermediate frames 2–4 replace the rejected drawings. The visible rear leg now uses a forward knee, a backward hock, and a forward-facing tucked foot rather than a straight vertical shin. Its hip moves down and inward. The farther rear leg is occluded by the chest/body in this view.

The intermediate chest uses the approved sitting body's original pixel artwork rather than the earlier replacement bib. The chest core and front-paw pixel regions are identical across frames 2–5. The native head artwork is translated only, with overlapping neck coverage. The first neutral and last approved sitting images are byte-for-byte unchanged.

Movement frames still hold for 900ms for review. The GIF resets directly to neutral after sitting. Later transition work remains paused. This intermediate motion is not approved or integrated into the application.

Rebuild with `python tools/pocket_pup/fold_review.py` using Pillow. Validation checks exact endpoint images, fixed chest/front-paw regions, original head pixels, solid neck overlap, common ground row 55, five GIF frames/timings, and source size limits. These checks do not establish natural-looking movement.
