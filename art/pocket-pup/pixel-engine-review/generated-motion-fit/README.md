# Final fit comparison

The fit uses the generated study for the six middle poses, with the original head and exact approved standing and sitting endpoints. Rebuild it with `python tools/pocket_pup/generated_motion_fit.py`.

The rounded rump and tucked hind paw come through. After comparing the frames side by side, the user chose the fitted version for further pixel edits. See the [reusable fitting workflow](../../../docs/MOTION_FITTING_WORKFLOW.md) and [sit and stand recipe](recipe.json).

- [Generated stand to sit reference](../sit-stand-adjustable/generated-pose-study.gif)
- [Generated sit to stand reference](../sit-stand-adjustable/generated-sit-to-stand.gif)
- [Final fit frames](frames.png)

The GIFs are previews. The app plays the transparent fitted PNGs between the original endpoints. The six middle frames are exported by `tools/export_runtime_art.py`.
