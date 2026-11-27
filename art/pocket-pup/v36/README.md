# Tired sit to loaf: next review

**Approved and integrated November 26, 2026.** Runtime copies are exported to `public/dog/loaf-*.png` by `tools/export_runtime_art.py`. The notes below describe the original review checkpoint.

- [Normal timing GIF](loaf-preview.gif): exact tired sitting for 7,000ms, two 220ms breakdown poses, then loaf hold.
- [Slower motion GIF](loaf-slow.gif): same seven-second wait; 600ms breakdown poses for inspection.
- [All four poses](loaf-frames.png).

The starting sprite is pixel-identical to approved v35 tired sitting. The original tired head is translated down without resizing or redrawing it. First bend retains approved front paw pixels on the same ground; the next pose tucks the paws under the lowering chest. Body/neck are connected original project grid edits. Breathing pauses in this inspection preview. No runtime loaf assets or automatic deadline are exported.

Original project edits using the established Pocket Pup palette and head. No new external assets or license claim. Regenerate with `python tools/pocket_pup/loaf_review.py` (Pillow); checks verify head pixels, starting sprite, planted first-bend paws, binary alpha, 64x64 canvases, GIF durations, and code limits. Technical checks do not establish visual approval.

After approval: integrate deadline beginning at stable tired sitting, cancellation on mood/posture/Stand/disposal, duplicate-event protection, reduced motion endpoint, and accessory fitting. Animated sit to stand remains the next separate review.
