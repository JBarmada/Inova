# Grounded breathing preview

[Animated breathing study](breathing-preview.gif), [all poses and phases](breathing-frames.png).

The user rejected v33's whole-sprite translation as a floating bob rather than breathing. This version keeps every pixel in paw rows 50–63 unchanged. On inhalation the native head, shoulders, and upper body rise one pixel; a duplicated chest row maintains a solid connection to the stationary lower legs. A few existing palette-ramp changes in the chest ease into/out of the rise. There is no whole-body airborne translation or rescaling, and head/face artwork stays intact.

The 2.8-second preview loop has four timed phases: rest 800ms, early inhale 450ms, peak 650ms, and exhale 900ms. This is an artistic timing choice, not a claim about canine respiratory physiology. A fixed baseline makes paw contact inspectable. All three shown poses use the same motion style.

Research references read before drawing:

- Pedro Medeiros: [Character Idle](https://www.patreon.com/saint11/posts/character-idle-12464240), on avoiding overly bouncy/dancing idles and using subtle pixel movement.
- Raymond Schlitter / Slynyrd: [Pixelblog 8: Intro to Animation](https://www.slynyrd.com/blog/2018/8/19/pixelblog-8-intro-to-animation), on consistent idle cycles, frame economy, careful pixel clusters, and timing.

The planted-foot chest-rise solution is this project's application of those lessons. No tutorial artwork is copied. Only derived preview frames are saved here; application code, CSS, and runtime assets remain unchanged pending approval.

Rebuild with `python tools/pocket_pup/breathing_preview.py` using Pillow. Checks verify identical paw rows, exact translated face pixels, opaque neck overlap, binary alpha, source-file hashes, GIF frames/timings, and source size limits. Visual motion approval remains pending.
