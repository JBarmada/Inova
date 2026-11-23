# Artwork and Audio Plan

The fitted sit and stand frames are integrated. The six transparent middle frames are copied into `public/dog/fitted/` by the runtime exporter and recorded in its manifest. Standing and sitting reuse the approved endpoint PNGs. See the [source links](../art/pocket-pup/pixel-engine-review/generated-motion-fit/README.md) and the [reusable workflow](MOTION_FITTING_WORKFLOW.md).

The fitted study uses the saved generated pose sheet as a motion reference, restoring the original head and approved endpoint PNGs. The earlier Pixel Engine motion studies informed the prompt. Demo-only art previews were removed from Dev mode.

The v36 lower/tuck/loaf poses derive from the v35 tired head and existing project tail and palette. The current app exports them and uses them after the seven-second tired hold. Seated Happy transplants only expression regions from v6 onto the v32 seated sprite. Loaf moods transplant only the compatible face differences. The added breathing phases use the existing chest palette, with fixed alpha and paw rows. [v36 provenance](../art/pocket-pup/v36/README.md).

The [review package](../art/pocket-pup/to-be-reviewed-animations/README.md) uses these exports, the fitted sit and stand frames, the v6 reaction art, v14 bleps, and original grid edits for sleep, stretch, attention, and curl motion. Timing markers refer to separately authored props, effects, and cues. The new review clips introduce no additional external artwork.

Approved v35: seated blink/drowsy/tiredness derives from approved v26 with original edits confined to two eye regions. No new external artwork. Exact non-eye/alpha pixels checked. Runtime copies live under `public/dog/sitting-*.png`; breathing variants combine these eye edits with approved v34 seated breathing. Exporter records source paths and hashes and checks fixed alpha/paw rows. Historical v35 review-only notes describe its pre-approval state.

## Integrated Pocket Pup assets — November 23

`public/dog/manifest.json` records source filenames and SHA-256 hashes. Approved neutral/tuck/sit are exact copies of v32's three PNGs; happy/tired/bandana come from the existing reference sheet. Twelve breathing PNGs copy the approved v34 study exactly. Paws remain fixed; the native head artwork is not rescaled. Canvas is 64 by 64, binary RGBA, enlarged with nearest-neighbor only. `tools/export_runtime_art.py` rebuilds these files and validates source copies/grounded paw rows.

All dog art derives from the selected project concept and original project pixel edits. The source concept and historical study notes are under `art/pocket-pup/`. User-supplied photo/stock references informed the studies and are not bundled as source photographs. Artist tutorials are linked for instruction only, with no copied tutorial artwork. No repository-wide distribution license has been selected. Notebook is an original provisional pixel prop authored by the integration exporter; final item art remains pending. Audio remains synthesized.

Breathing is now approved for runtime use; historical v34 notes saying preview-only describe its pre-approval state. Other rejected studies and unapproved rest-chain clips are not runtime assets.

The consolidated app uses selected Pocket Pup runtime sprites, provisional original SVG wearable markers, generated app icons, and synthesized cues. The original placeholder dog remains as an image-load fallback; final garment art and recorded sounds remain unfinished.

## Initial visual needs

- One finished transparent base dog, with additional adoptable variants desired.
- Idle and contrasting emotion/interaction poses.
- A few compatible clothing, accessory, and prop layers.
- Adoption-center and wardrobe elements.
- A small bookshelf, dated spines, and readable open-book view.
- Click, selection, quest completion, reward reveal, and evolution effects.

Treats, toys, doors, extra rooms, and spooky transformations follow their selected feature priority.

## Agree before parallel asset work

- Pixel grid, canvas size, palette, scale factors, and nearest-neighbor rendering.
- Shared origin and attachment anchors for each supported variant and pose.
- Layer order, item slots, conflicts, supported poses, and fallbacks.
- Animation frame size and timing.
- Transparent padding and hit areas for desktop dragging and interaction.
- File naming and stable asset IDs.

Layering reduces the number of full combinations, but fitting must still be checked across supported shapes and poses.

## Audio needs

Use [the reaction map](03-game-feel.md) as the event inventory: clicks, selection, adoption, pick-up/drop, actual barks, doors, books, equipment, treats, toys, quest success, reward fanfare, evolution, and gentle failure cues.

Mute and volume controls preserve visible feedback. Review rapid repeated actions for overlapping sounds.

## Provenance record

For every asset added, record its repository path, creator or source URL, license or permission, whether AI-generated, and any attribution or usage constraints. Keep exact generation details separately if needed to reproduce a consistent style. Do not imply an unreviewed external asset is licensed for redistribution.

| Asset path | Creator or source | License or permission | AI generated | Notes |
| --- | --- | --- | --- | --- |
| public/inova.svg | Original code-authored placeholder for Inova | Created for this project | No | 32 by 32 logical pixel grid; displayed at larger scale |
| src-tauri/icons desktop files | Generated from public/inova.svg by Tauri icon CLI | Derived from the original project placeholder | No | Regenerate with npm run tauri icon public/inova.svg |
| src/features/world/ItemGlyph.tsx and companion/WearableLayers.tsx | Original code-authored SVG slot markers | Created for this project | No | Temporary hat, glasses, socks, and body fitting markers; final clothing art pending |
| src/features/world/WardrobeIcon.tsx and companion/PixelIcon.tsx wardrobe path | Original code-authored SVG interface icons | Created for this project | No | Four-square filter, category icons, human stand/sit, hanger/remove, wear/check/lock; hanger navigation distinct from body T-shirt |
| public/dog/*.png and manifest.json | User-directed Pocket Pup project artwork copied from the separate art worktree; source variants and checksums in manifest | Created/generated for this project; no external asset license asserted | Original concept AI-generated, then programmatically edited | 64x64 transparent dog poses. Neutral and approved sit are preserved exports; tuck remains an experimental motion study. Legacy bandana/notebook images retained as references but not used by the slot-marker renderer. |
| src/services/audio.ts | Original synthesized tones | Created for this project | No | Click, reward, and pitch-swept toy squeak; no recorded bark |
| public/art/quest-toy-icon-v1.png | Built-in image generation, Inova design conversation | Generated for this project; no third-party asset license asserted | Yes | Transparent golden rubber bone with teal/orange rope; see QUEST_TOY_ART.md |
| public/art/quest-toy-frame-v1.png | Built-in image generation, Inova design conversation | Generated for this project; no third-party asset license asserted | Yes | Blank cream quest board, golden bone corners, braided rope; responsive nine-slice border |

This branch integrates the selected Pocket Pup runtime exports for anchor testing. Historical art-review sheets and source generators remain in the separate art worktree; the runtime manifest records their source paths/checksums. Final wearable artwork is not delivered by the colored markers. Full animation approval and additional poses remain separate work.

Do not use placeholders as evidence that the final asset set is complete. A repository-wide distribution license has not been selected; do not attach a third-party license to these assets without the team's decision.
