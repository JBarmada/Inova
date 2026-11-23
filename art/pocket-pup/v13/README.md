# Simple blep study

[Full reference sheet](reference-sheet.png) adds all three bleps alongside neutral, happy, tired, barking, sleeping, and bandana fit. It assembles the selected v9 neutral, existing v6 expressions, and v13 bleps without changing their source sprites. Rebuild with `python tools/pocket_pup/full_sheet.py`.

Three review alternatives on the selected v9 fur-details dog:

1. `tiny-peek.png`: a small smile with a four-pixel pink tongue.
2. `soft-dog-smile.png`: a relaxed open smile with a small tongue inside it.
3. `happy-little-pup.png`: the second mouth with happy closed eyes.

Each sprite is a transparent 64 by 64 PNG. The comparison sheet includes full dogs and enlarged faces. The tongue uses one flat pink color, without highlights, seams, texture, or shading. Body, fur, nose, and silhouette are preserved.

The user-supplied Shiba photograph informed the expression only; it is not included in the repository. These alternatives are not integrated into the app and do not replace the selected neutral expression.

Rebuild with `python tools/pocket_pup/simple_blep.py` using Python with Pillow installed. The generator validates unchanged transparency, confines edits to the face, and checks source size limits.
