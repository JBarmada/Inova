# Continue Pocket Pup art and animation

**Current handoff. Start with [To Be Reviewed Animations](../art/pocket-pup/to-be-reviewed-animations/README.md).** The full table now has native sprite and GIF drafts. The user's overnight instruction supersedes the earlier one-clip production pause. Review the drafts individually before adding the remaining routes to the app.

- Live: fitted stand/sit, seated Happy, seated Tired followed by seven seconds and v36 loaf, recovery through sitting, and a continuous breath phase across supported poses and clips.
- Start the next review with [loaf to sleep](../art/pocket-pup/to-be-reviewed-animations/04-loaf-to-sleep/frames.png), [sleep breathing](../art/pocket-pup/to-be-reviewed-animations/05-sleep-breathing/preview.gif), and [wake to loaf](../art/pocket-pup/to-be-reviewed-animations/06-wake-to-loaf/preview.gif). Check the chin position, eye timing, and paw contact at native resolution before discussing a sleep timer.
- Use the [transition table](TRANSITION_TABLE.md) for current behavior, the [artist scenarios](ANIMATION_SCENARIOS.md) for the visual briefs, and the [generate-then-fit workflow](MOTION_FITTING_WORKFLOW.md) for regenerated motion. Keep the original head and four-slot wardrobe behavior. Review timing markers with sound and effect owners.
- Rebuild previews with `python tools/build_animation_review.py` from the primary checkout. The [review index](../art/pocket-pup/to-be-reviewed-animations/README.md) links all editable frames and both GIF speeds.

## Historical v36 checkpoint

The copy-ready prompt below is kept as a record of the earlier stopping point. Consult the current handoff above for scope and runtime support.

## Copy-ready continuation prompt

Use the [generate-then-fit workflow](MOTION_FITTING_WORKFLOW.md) for new Pocket Pup animation work. The fitted sit and stand frames are the current editing reference after the user's side-by-side comparison. The older checkpoints below describe separate work.

Continue Inova Track A dog art/animation from the latest GitHub main. Use the primary checkout `C:\Users\creat\Desktop\school\Scope Final Project`, inspect its branch/status and fetch current main first. Preserve unrelated work. Old worktrees, including `pocket-pup-integration`, are historical snapshots; do not merge their stale app files over main. Use a focused branch for new changes and follow current AGENTS.md.

Read README.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, docs/MAIN_CONSOLIDATION.md, docs/ARCHITECTURE.md, docs/SHARED_CONTRACTS.md, docs/TEAM_PLAN.md, docs/tasks/A_COMPANION.md, docs/ARTIST_GUIDE.md, docs/ANIMATION_SCENARIOS.md, docs/TRANSITION_TABLE.md, docs/ASSETS.md, and docs/WARDROBE_SPEC.md. Inspect current companion code before changing it.

The user wants a natural, consistent pixel dog with an explicit posture/mood hierarchy. Work on one scenario at a time: show the GIF and full dog frames, obtain the user's visual review, revise until approved, integrate that approved scenario, then move to the next. Do not batch the remaining rest chain or treat files existing on main as visual approval.

### Verified main checkpoint

GitHub main was freshly fetched at `c4693ac` before this documentation update. It includes merge `56f80c2` of the loaf review branch, so **both approved runtime art and unapproved v36 preview files are already on main**.

- Approved v32 neutral/tuck/sit, approved v34 grounded breathing, and approved v35 seated tiredness are integrated. The tired reaction was integrated as `93696f3`.
- `DogPose` still contains only standing, tucking, sitting. `createPosePlayback` automatically sits after eight seconds of standing idle, using the approved 160ms tuck. Mood changes retain sitting; mood changes during tuck finish at sitting.
- `createSeatedFacePlayback` runs neutral 900ms, blink 100ms, neutral 350ms, drowsy 450ms, blink 250ms, then holds sitting-tired. Only the eyes change. Reduced motion selects the stable endpoint.
- `useBreathingArt` preserves the seated breathing phase across face changes. Its four phases are 800/450/650/900ms; peak lifts the upper body/head one native pixel while the paws remain planted. Never replace it with whole-image floating or vertical scaling.
- **There is no runtime loaf pose, loaf timer, or loaf playback.** Tired sitting currently holds indefinitely. Sit to stand still switches directly and needs its own reviewed transition.
- Happy sitting currently uses the approved neutral seated face plus sparkle; a dedicated seated happy face awaits review. Navigation can remount local posture; shared presentation ownership remains an open implementation task in the ledger.
- Current main also includes schema-v2 four-slot wardrobe, reliable quit, startup feedback, and the consolidated quest/window/navigation work. Preserve these; do not restore the old single equippedItem renderer.

### Exact stopping point: loaf visual review

The latest user-approved change was v35 seated tiredness. The last animation deliverable shown was **v36 tired sit to loaf**, and no approval or rejection of that loaf has been received yet.

Show these existing files first when animation work resumes, or use the user's new feedback if supplied:

- `art/pocket-pup/v36/loaf-preview.gif`: exact approved tired sitting held 7,000ms, then two 220ms breakdown poses, then loaf hold.
- `art/pocket-pup/v36/loaf-slow.gif`: same seven-second hold with 600ms breakdown poses.
- `art/pocket-pup/v36/loaf-frames.png`: full dog poses side by side.
- `art/pocket-pup/v36/{tired-sit,bend-elbows,tuck-paws,loaf}.png`: 64x64 transparent source frames.
- `tools/pocket_pup/loaf_review.py`: reproducible grid authoring/export; writes review files only, never runtime assets.
- `art/pocket-pup/v36/README.md` and `review.json`: timing, provenance, and checks. References there to a separate branch record the original review checkpoint; these files have since been merged to main.

The draft preserves the starting sit exactly, translates the existing tired head without resizing, preserves front paw pixels through the first bend, then tucks them under a connected body. Those are technical checks, not proof that the movement looks natural. Revise only after examining the actual frames and the user's feedback. Do not silently integrate this draft.

### Art invariants and sources

- Native 64x64 RGBA canvas; binary alpha; integer nearest-neighbor enlargement. Use the established palette and native head pixels. Programmatic grid edits are the established workflow for these exact sprites.
- Standing neutral: `art/pocket-pup/v9/fur-details.png`. Approved sitting: `v26/sitting-idle.png`. Approved sit-down: `v32/00.png`, `01.png`, `02.png`. Breathing: `v34/`. Seated facial variants: `v35/`.
- `head_edge_fix.corrected_head` preserves the actual source cheek column x37 at rows 28-34 and removes the x38 connector spur. Do not crop a head column, redraw the head, change its proportions, or lose the upper-right eye highlight on open-eye expressions.
- Keep the broad neck and centered body, continuous shoulder-to-haunch silhouette, connected folding thigh/leg, small tucked hind feet, and matching front paws. No toe lines, detached zigzag leg, rightward bulging haunch, open neck, or body squashing.
- Neutral keeps the brown :3 mouth; happy uses :D, the approved pink tongue, and blush. Preserve existing facial choices unless the user requests changes.
- Consult docs/ARTIST_GUIDE.md for the saved planning method/tutorial links. Favor a few clear key poses and breakdowns; more frames do not fix bad anatomy. Keep approved endpoints unchanged when revising an intermediate frame.

### Only after the loaf is visually approved

1. Fit the approved art into the existing presentation system. Extend posture/clip handling deliberately; no second persisted pet record or unnecessary save migration.
2. Start one seven-second deadline when stable sitting-tired is reached, after the face-entry sequence completes. Enter loaf only if still seated and tired at expiry. Use a deadline/guard that survives ordinary renders without restarting.
3. Cancel on idle/happy mood, Stand, leaving sitting, adoption loss, or disposal. Duplicate tired events, equipment/settings changes, and breathing must neither restart nor stack it. Handle interrupted clips and queued commands at safe reviewed boundaries.
4. Keep reduced motion behavior consistent: skip movement to approved stable endpoints, preserve logical timing/guards, stop breathing loops. Handle failed assets visibly and avoid stale callbacks after disposal.
5. Fit all current wardrobe slots to the new pose before enabling it. Inspect `DogSprite.tsx`, `WearableLayers.tsx`, `wearableAnchors.ts`, `wearables.test.tsx`, and the current equipment schema. Hats/glasses/body follow the appropriate body/head movement; socks need deliberate tucked-foot fitting. Never let an unknown loaf frame silently fall through to standing anchors.
6. Update every affected row of docs/TRANSITION_TABLE.md, including posture/mood outcomes and cancellation/recovery cases. Record provenance, approvals, limitations, and actual checks in ASSETS.md and IMPLEMENTATION_STATUS.md.
7. After this one scenario is integrated and checked, show a separate sit-to-stand rise preview. Do not assume reversing sit-down is approved. Later scenarios follow the ledger: seated expressions/recovery, loaf to sleep, sleep breathing, waking, loaf to sit, stretch, and personality interactions.

### Validation and boundaries

Run `npm run check` for code changes and relevant native compilation. Test meaningful timing/cancellation, duplicate events, reduced motion, and wardrobe compatibility. Use fictional profiles and isolate native test saves. Browser observation proves browser behavior only; native Windows/Mac behavior needs actual native checks. Preserve quit/save ordering, current startup handling, and window geometry.

Our animation integration previously passed 37 tests plus frontend checks/build and Windows release library compilation; browser evidence is in docs/evidence/seated-tired. Consolidation subsequently recorded 65 tests in 14 files and Windows executable compilation. These are historical results, not tests rerun for this documentation handoff. Inspect current scripts and run relevant checks when implementing; no new test runner or push gate should be assumed from a continuation document alone. See docs/NATIVE_UI_TEST_CONTINUATION.md for that separate workstream.

Each authored code file must stay at most 250 code lines; each function must contain fewer than 75 code lines. Maintain appropriate visual/audio feedback and shared mute behavior. Do not change unrelated wardrobe, quest, startup, native testing, or quit features as part of art iteration.

When showing local GIFs/PNGs in Codex, use absolute filesystem paths so they render. Include full-dog side-by-side frames for inspection. Stop at each requested visual review rather than integrating an unapproved clip.
