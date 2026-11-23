# Approved sitting sheet and first rest-chain animation

The user approved the v26 sitting pose and resumed transition work.

- [Full reference sheet](reference-sheet.png): previous expressions plus the approved sitting pose, replacing the old sitting draft.
- [Animated review GIF](rest-chain.gif): neutral → sit → sit tired → lowering → lying down → sleeping with a small breathing movement.
- [Five key poses](transition-keys.png) and [all motion frames](motion-frames.png).
- [Transparent sprite strip](rest-chain-strip.png), individual transparent PNGs in `frames/`, and [frame timing manifest](animation.json).

The standing neutral and sitting keyframes are the exact selected sprites. Tired sitting edits only the eyes. New lying and sleeping poses preserve the selected head shape at a lower position, with a new resting body. Sleeping uses curved closed eyes; lying uses tired lids. Existing sleeping art is retained in the full reference sheet until the new sleeping pose is approved.

This is a first motion study, not final animation or app integration. The six movement in-betweens use nearest-neighbor body compression/extension and separately translated heads and tails; limb articulation and timing need visual review. The head stays at native scale. GIF preview has a cream background; PNG frames retain transparency. The GIF repeats with a hard reset to standing after sleeping; no wake-up transition is claimed.

Rebuild with `python tools/pocket_pup/rest_chain.py` using Pillow. Checks verify fixed-grid RGBA frames, binary transparency, GIF frame count and total timing, and source size limits. Wearables are not fitted to these moving poses. No native application behavior has changed.
