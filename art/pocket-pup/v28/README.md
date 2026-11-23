# Jointed rest-chain revision and neck coverage

- [Full animated chain](rest-chain.gif).
- [Focused sitting-to-lying preview](lowering-detail/rest-chain.gif).
- [All sixteen frames](motion-frames.png), [neck close-ups](neck-connections.png), and [key poses](transition-keys.png).
- Transparent `frames/` PNGs, `rest-chain-strip.png`, `animation.json` timings, and `validation.json` checks.

The user rejected v27's resized-body in-betweens and exposed neck gaps. This revision replaces those movement frames with explicit hip, hock, elbow, and wrist positions. Body and leg polygons are drawn directly on the native grid; the body is never resized. Front paw tips remain at the same ground positions through the movement. The already-approved tail size is reused for moving frames rather than animated scaling.

The standing neutral and approved v26 sitting keyframe remain exact original sprites. Moving head artwork remains at native size and is translated only; tired/closed eye variations are separately authored expressions. Neck polygons overlap the lower head and torso in every generated pose, including both breathing positions.

Validation checks every opaque head pixel against its expected source, exact v26 sitting pixels, an eight-pixel solid neck corridor through the head/torso overlap, and enclosed one-pixel neck holes. It also checks RGBA frame size, binary transparency, GIF frame counts/timings, and code size limits. A neck contact sheet supports visual review; these checks do not establish that motion is final or anatomically polished.

This remains a motion review draft, not app integration. Body/limb articulation and timing still need user approval. The GIF loops with a hard reset from sleep to standing; no wake-up transition is included. The approved full reference sheet remains [v27](../v27/reference-sheet.png).

Rebuild with `python tools/pocket_pup/articulated_chain.py` using Python with Pillow installed. Native PNGs preserve transparency; the GIF has a cream review background.
