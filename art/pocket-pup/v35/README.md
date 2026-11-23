# Review 1: sitting to tired face

**Approved and integrated November 23:** runtime uses this face-only sequence and preserves seated posture through mood changes. Grounded breathing continues across the eye frames. The seven-second loaf deadline/clip remains a separate pending review; runtime holds tired sitting indefinitely. The paragraphs below record the original preview.

[GIF](seated-tired-preview.gif), [four facial states](seated-face-frames.png).

A sitting dog that becomes tired stays sitting. Every pixel outside two 3 by 4 eye regions is unchanged from approved v26: head position/shape, mouth, neck, chest, body, paws, tail, and alpha are identical. Breathing is paused in this inspection GIF to make the face-only boundary clear.

Sequence: neutral → quick blink → neutral → drowsy lids → longer blink → tired sitting. Tired holds exactly seven seconds, then the GIF returns to seated neutral. **Loaf is not shown or implemented:** its endpoint/entry is the next review after this face transition is approved. No runtime source changes.

Tracked as M05/scenario 2 in [the coverage table](../../../docs/TRANSITION_TABLE.md). Main `b187094` contains the earlier approved sit/breathing. This study is on `codex/pose-hierarchy-review`.

Rebuild with `python tools/pocket_pup/seated_tired_review.py` using Pillow. Checks verify exact non-eye pixels/alpha, GIF frame count/timings including the seven-second hold, and code size limits. Technical checks are not visual approval.
