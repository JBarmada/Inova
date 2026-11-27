# To Be Reviewed Animations

**Important for future animation workers. Start here before drawing, replacing, or wiring any Pocket Pup animation.** Use the [transition ledger](../../../docs/TRANSITION_TABLE.md) for app behavior and the [artist scenarios](../../../docs/ANIMATION_SCENARIOS.md) for intended motion. See the [overview sheet](overview.png) and [timing manifest](manifest.json).

This is the source package for all 20 approved clips. Most are available in the companion’s Dev mode animation player. The post-nap stretch is retired from runtime and retained here as reference. [The transition table](../../../docs/TRANSITION_TABLE.md) lists which clips also play during regular use.

| Scenario | GIF | Slow | Frame sheet |
| --- | --- | --- | --- |
| 01 Standing to sitting | [Play](01-stand-to-sit/preview.gif) | [Slow](01-stand-to-sit/slow.gif) | [Frames](01-stand-to-sit/frames.png) |
| 02 Seated tired | [Play](02-seated-tired/preview.gif) | [Slow](02-seated-tired/slow.gif) | [Frames](02-seated-tired/frames.png) |
| 03 Seven-second tired hold to loaf | [Play](03-tired-to-loaf/preview.gif) | [Slow](03-tired-to-loaf/slow.gif) | [Frames](03-tired-to-loaf/frames.png) |
| 04 Loaf to sleep | [Play](04-loaf-to-sleep/preview.gif) | [Slow](04-loaf-to-sleep/slow.gif) | [Frames](04-loaf-to-sleep/frames.png) |
| 05 Sleeping breaths | [Play](05-sleep-breathing/preview.gif) | [Slow](05-sleep-breathing/slow.gif) | [Frames](05-sleep-breathing/frames.png) |
| 06 Wake to loaf | [Play](06-wake-to-loaf/preview.gif) | [Slow](06-wake-to-loaf/slow.gif) | [Frames](06-wake-to-loaf/frames.png) |
| 07a Loaf to sit | [Play](07a-loaf-to-sit/preview.gif) | [Slow](07a-loaf-to-sit/slow.gif) | [Frames](07a-loaf-to-sit/frames.png) |
| 07b Sit to stand | [Play](07b-sit-to-stand/preview.gif) | [Slow](07b-sit-to-stand/slow.gif) | [Frames](07b-sit-to-stand/frames.png) |
| 08 Post-nap stretch | [Play](08-post-nap-stretch/preview.gif) | [Slow](08-post-nap-stretch/slow.gif) | [Frames](08-post-nap-stretch/frames.png) |
| 09 Standing quiet idle | [Play](09-standing-idle/preview.gif) | [Slow](09-standing-idle/slow.gif) | [Frames](09-standing-idle/frames.png) |
| 09 Sitting quiet idle | [Play](09-sitting-idle/preview.gif) | [Slow](09-sitting-idle/slow.gif) | [Frames](09-sitting-idle/frames.png) |
| 10 Notice user | [Play](10-notice-user/preview.gif) | [Slow](10-notice-user/slow.gif) | [Frames](10-notice-user/frames.png) |
| 11a Happy greeting | [Play](11a-happy-greeting/preview.gif) | [Slow](11a-happy-greeting/slow.gif) | [Frames](11a-happy-greeting/frames.png) |
| 11b Tail wag loop | [Play](11b-tail-wag-loop/preview.gif) | [Slow](11b-tail-wag-loop/slow.gif) | [Frames](11b-tail-wag-loop/frames.png) |
| 12 Single bark | [Play](12-single-bark/preview.gif) | [Slow](12-single-bark/slow.gif) | [Frames](12-single-bark/frames.png) |
| 13 Treat | [Play](13-receive-treat/preview.gif) | [Slow](13-receive-treat/slow.gif) | [Frames](13-receive-treat/frames.png) |
| 14 Unlock celebration | [Play](14-unlock-celebration/preview.gif) | [Slow](14-unlock-celebration/slow.gif) | [Frames](14-unlock-celebration/frames.png) |
| 15 Accessory fitting | [Play](15-accessory-fitting/preview.gif) | [Slow](15-accessory-fitting/slow.gif) | [Frames](15-accessory-fitting/frames.png) |
| M06 Seated happy and tired recovery | [Play](m06-seated-happy-and-recovery/preview.gif) | [Slow](m06-seated-happy-and-recovery/slow.gif) | [Frames](m06-seated-happy-and-recovery/frames.png) |
| M07–M12 Loaf and sleeping moods | [Play](m07-m12-low-posture-moods/preview.gif) | [Slow](m07-m12-low-posture-moods/slow.gif) | [Frames](m07-m12-low-posture-moods/frames.png) |

## Editing and visual review

The post-nap stretch now uses a soft curved shoulder shadow in the reach, hold, and return frames. The silhouette, paw pixels, and timing match the first-pass stretch.

Each numbered PNG is one 64 × 64 transparent frame. The GIFs repeat for inspection. The manifest records actual once/loop intent, pose durations, and timestamps for separate props/effects/audio. Normal-speed GIFs include a low-amplitude chest pass. Bark rays, the treat, sparkles, and the sample bandana are separate transparent PNGs and appear only in their normal-speed previews. Slow GIFs and frame sheets show canonical poses. These drafts use existing project pixels and scripted native-grid edits. See [asset provenance](../../../docs/ASSETS.md) and the [generate-then-fit workflow](../../../docs/MOTION_FITTING_WORKFLOW.md) for new motion reference work.

Review the sleep silhouette, dedicated push-up and stretch contact, and the greeting wag before integrating them. Check that the eyes settle when entering loaf or falling asleep. The bark, treat, unlock, and fitting markers are timing notes for future game events. For pixel edits in LibreSprite, keep editable copies outside the export folder until the source or recipe is updated.

From the project root with Python and Pillow:

    python tools/build_animation_review.py
    python tools/export_runtime_art.py

Use the second command with `--output` and a scratch directory to compare revisions. The exporter checks canvas, binary alpha, connected silhouettes, ground row, and combined GIF duration. These are file checks. Review normal-speed movement and full frame sheets before deciding whether the art is ready to ship.
