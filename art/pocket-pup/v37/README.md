# Sit to stand rise: awaiting review

**Not integrated.** In the app, Stand still switches directly to standing from sitting and loaf.

- [Rise GIF](rise-preview.gif): approved sit 1,500ms, push-up 140ms, hips-up 160ms, stand hold.
- [Slow GIF](rise-slow.gif): same order with 600ms breakdowns.
- [Loaf to stand GIF](loaf-rise-preview.gif): loaf, v36 tuck/bend reversed (140ms each), tired sit 220ms, then the same rise.
- [Frames](rise-frames.png): full dog poses side by side.

Only `push-up.png` is new: the approved v32 sit, with head and chest moved up one native pixel (no repainting) and the forelegs one pixel longer. The paws, lower legs and tail pixels are unchanged. The hips-up breakdown reuses the approved v32 tuck frame, played the other way. Approving sit-down does not approve this reuse, so judge it here. Every frame stays on the y55 ground line.

Open questions for review: does the head rising 1px before dropping to the lower standing head read as natural anticipation or as a bob? Is reusing the tuck acceptable, or does the rise need its own hind-leg extension frame? Should loaf rise through sitting as shown, or push up more directly?

Rebuild with `python tools/pocket_pup/rise_review.py` (Pillow). Writes review files only, never runtime assets.
