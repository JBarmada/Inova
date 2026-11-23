# Generate motion, then fit it to Pocket Pup

Use this workflow for new Pocket Pup moves. The generated sheet establishes how the dog moves. The fitted frames establish the actual sprite pixels. The user preferred the fitted sit and stand frames after comparing both versions side by side. Preserve the approved character art and use a separate review folder for each new clip.

## Generate a motion reference

1. Start with the approved poses from [the artist guide](ARTIST_GUIDE.md). Describe the start, weight shift, contact, and end. Specify which feet are planted, which lift, and how the head and tail follow.
2. Give the generator the approved endpoint art and a motion reference when available. Ask for evenly spaced, full-body poses on a plain pale background, a consistent character scale and camera, and a common ground line. Specify the grid and reading order. The [sit prompt](../art/pocket-pup/pixel-engine-review/sit-stand-adjustable/IMAGEGEN_PROMPT.md) is a worked example.
3. Save the source sheet and the prompt or job ID. Inspect the rough frames for readable movement before fitting. For sitting, check that the rump keeps its volume as the hind paw folds beneath it. A good motion reference can still have inconsistent pixel sizes or colors.

## Fit it to the project grid

Copy the [sit and stand recipe](../art/pocket-pup/pixel-engine-review/generated-motion-fit/recipe.json), point it at your new sheet, and give it a fresh output folder. Run from the project root with Python and Pillow:

```sh
python tools/pocket_pup/generated_motion_fit.py path/to/recipe.json
```

- `sheet`, `output`, and sprite paths are relative to `art/pocket-pup/`. `grid` is `[columns, rows]`. `cell` starts at zero and reads across each row.
- Each frame uses either `exact` for a native 64 × 64 PNG copied pixel for pixel, or `cell` for a generated pose. Set `ms` in 10 ms increments. For a new face or camera angle, omit `neutral_head_y` and inspect the fitted face or supply a cleaned frame with `exact`.
- For difficult cells, set `crop` to `[left, top, right, bottom]` in source cell pixels. Set `scale` to the source pixels per native pixel and `origin` to the upper-left position of the fitted crop on the 64 × 64 canvas. The default scale and alignment come from the sit sheet. Tune them for other sheets.
- `neutral_head_source` supplies the approved standing art. In compatible poses, `neutral_head_y` restores that original head at the given vertical offset. The built-in crop and face mask are tuned for this angle and pale backgrounds. Inspect around the cheek, neck, and tail after each fit.
- `erase` lists native `[x, y]` pixels to clear. For larger fixes, edit a copy of a native PNG in LibreSprite and use it as an `exact` frame. Keep those edits outside the export directory so a rebuild preserves them.
- Set `clip` to name the primary GIF and strip. Add `reverse_clip` only where the reverse reads well. For a different push-off or recovery, make a separate recipe. `--output` lets you build into a scratch folder before replacing review exports.

## Review the fit

The tool exports numbered transparent PNGs, sprite strips, a frame sheet, and timed GIFs. Compare the fitted and generated frames side by side at an integer zoom. Check for split feet, changing scale, sliding contact, skipped weight shifts, extra outlines, stray pixels, and jumps at the approved endpoints. Inspect both the normal-speed GIF and the individual frames. Compare at least one revision against the previous export so fixes are visible.

When the user requests independent review, have one reviewer check the native pixels and silhouette and another check the movement and contact. Address specific flagged frames and recheck. Carry only user-approved clips into the app, with wearable fit and behavior checked separately. Record the clips, source, and approval status in the art index and asset ledger.
