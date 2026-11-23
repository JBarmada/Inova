# Pocket Pup neutral face specification

The source of truth is [the selected neutral sprite](../art/pocket-pup/v9/fur-details.png), on a transparent 64 × 64 canvas. Coordinates below are zero-based, with the origin at the top left; boxes in the validator use exclusive right/bottom edges. This specification applies to the original **standing neutral face at the original position**, not blinking, tired, barking, shifted heads, or other expressions.

- Eyes: 3 × 3 pixels, at x13–15 and x24–26, y27–29. Each has exactly one white highlight at the eye's upper-right pixel: (15, 27) and (26, 27).
- Light fur/eyebrow markings: compare x12–16 and x23–27, y23–26 to the selected original. These are light fur markings, not black eyebrow lines.
- Nose: x18–21, y30–31, dark brown.
- Nose-to-mouth gap: y32, across x13–26, matches the source muzzle. The mouth starts at y33.
- Neutral mouth: C14, brown `#4b2d22`, within x13–26, y33–36. The exact two-cup :3 shape is defined by the selected sprite, not a generated approximation.

Run `python tools/pocket_pup/verify_neutral_face.py path/to/sprite.png`. It rejects non-64 × 64 images and reports mismatched pixel counts for the brows, eyes, nose, gap, and mouth. It requires exact source colors, positions and alpha in these regions; a generated candidate must be deliberately aligned and converted before this check is meaningful. A passing result does not verify the head outline, fur, legs, animation, or artistic quality. Other expressions and moving/shifted heads need their own explicit specs and alignment, not this neutral check.

The user identified a gap in the cheek outline. The current hybrid review candidate uses the selected original head outline; whether that fills the requested gap to the user's satisfaction remains a visual review decision. No unapproved head-shape change is built into this neutral face spec.
