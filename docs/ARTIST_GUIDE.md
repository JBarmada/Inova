# Pocket Pup artist handoff

Saved at the user's request, November 23, 2026. Future artist chats should read this before modifying the dog or its animations, then inspect the latest files in [the art review index](../art/pocket-pup/README.md). File version numbers record experiments, not approvals.

## Animation planning reference

Current order and missing outcomes are in [TRANSITION_TABLE.md](TRANSITION_TABLE.md). Approved sit/breathing is on main `b187094`. Next is v35 sitting → tired face with a fixed head/body; loaf after seven seconds and sit → stand remain separate reviews. Do not implement or advance beyond a new clip before the user reviews its GIF or transition state.

For the detailed artist brief, read [Animation scenarios and deliverables](ANIMATION_SCENARIOS.md). It covers the neutral-to-sit milestone, rest and wake-up chains, personality reactions, game interactions, and review requirements. Later scenarios remain planned work until the current neutral-to-sit breakdown is approved.

Pedro Medeiros / Saint11: [Animation Planning](https://www.patreon.com/saint11/posts/animation-7585006).

His workflow starts with a finished still and rough motion sketches, establishes key poses, then adds and cleans up in-betweens. A readable pose is the starting point; adding frames does not rescue a broken pose. The latter sentence is this project's practical takeaway, not a quotation or prescribed frame-count rule.

Secondary reference: Roman Gurbanov's [anticipation, easing, and secondary animation lesson](https://pixelart.school/learn/pixel-art-anticipation). Review playback timing separately from slow pose inspection. An intermediate held for inspection is not necessarily its intended playback duration.

These links are instructional references, not reusable sprite assets. No tutorial artwork has been copied into this project.

## Preserve the selected artwork

- Standing neutral: `art/pocket-pup/v9/fur-details.png`.
- Approved sitting: `art/pocket-pup/v26/sitting-idle.png`.
- Full sheet including approved sitting: `art/pocket-pup/v27/reference-sheet.png`.
- Approved neutral-to-sit sequence: `art/pocket-pup/v32/`; the user approved integration on November 23. Runtime PNGs preserve those exact frames; see [integration handoff](POCKET_PUP_INTEGRATION.md). Later chains remain unfinished.
- Keep exact neutral and sitting endpoints unless the user authorizes a change. Check exported pixels against the source, including the full right cheek edge, not just the face interior.
- Work on the 64 by 64 grid with binary transparency. Enlarge previews with nearest-neighbor only. Head artwork stays at native size; moving it is different from changing its shape.
- Neutral uses the brown C14 :3 mouth and upper-right eye dots. Happy :D pink is `#df8b87`. No toe lines on sitting paws.

## Lessons from rejected transition drafts

For breathing idles, the user rejected translating the entire PNG upward as a floating bob. The current [v34 breathing study](../art/pocket-pup/v34/README.md) keeps paws planted and uses a one-pixel upper-body/chest rise with solid neck overlap. It remains preview-only. Read [Saint11's Character Idle](https://www.patreon.com/saint11/posts/character-idle-12464240) and [Slynyrd's idle-cycle lesson](https://www.slynyrd.com/blog/2018/8/19/pixelblog-8-intro-to-animation) for subtle movement and consistent timing before refining it.

- Do not squash or resize the body to simulate bending legs.
- Do not paste rectangular standing-leg patches: they carry unrelated body pixels and create seams.
- Keep the sitting torso centered under the head. Maintain broad neck support and continuous shoulder-to-base contours without pinches.
- A folded thigh, lower leg, and body should share a connected silhouette. Use restrained interior shading, not a separately outlined zigzag or hanging stick.
- Tuck the intermediate rear leg beneath the body. Avoid a large rightward hip bulge.
- Keep the chest and front-paw pixel regions consistent through intermediate and final sitting poses. Preserve endpoints; do not silently move their paws to make a check pass.
- Draw overlap behind the head so moving it cannot expose an open neck. Inspect all neck junctions visually; connectivity checks alone do not prove a good drawing.
- Try one readable breakdown before adding more frames. The current three-pose experiment is neutral, one tuck, and approved sit; it is not a universal three-frame requirement.
- Show frames side by side and provide slow playback for review. Preserve older experiments, but never call them accepted because a technical check passed.

Later tired/lying/sleeping motion is paused until neutral-to-sit is settled. Native app integration, wearable fitting, and wake-up motion remain unfinished.
