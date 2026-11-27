# Artwork and Audio Plan

The standing bee at `public/dog/experiments/bee-approved-standing.png` is an AI-generated transparent-background derivative of the user-liked `docs/wardrobe-review-2026-11-24/bee-dog-reference-experiment.png`, generated from the user's dog screenshot and wardrobe concept sheet. It is a full character image used for idle standing only; matching poses and distribution review remain open.

`public/dog/experiments/bee-sitting.png` is an AI-generated sitting variant based on the standing bee. Expression eye details are code-drawn separately. Pose consistency and distribution review remain open.

Costume trial artwork: `src/features/companion/CostumeArt.tsx`, `CostumeBody.tsx`, `CostumeHead.tsx`, and `costumeDesigns.ts` contain original code-drawn, provisional pixel-style overlays created for this project. They are separate from the dog and inspired by user-requested looks; they are not the generated concept art and have not been visually reviewed on actual animation frames. Character and brand usage permissions are not established.

Wardrobe concept sheet: `art/pocket-pup/wardrobe-concepts/wardrobe-concept-sheet.png` was generated for this project with the built-in image generator, using the existing neutral dog as reference. It is a proposed visual direction awaiting review, not a runtime asset or a faithful copy of the approved dog. Individual fitted item layers still need to be created and checked.

Requested costume concept sheet: `art/pocket-pup/wardrobe-concepts/requested-costumes.png` was generated using the existing neutral dog as a reference. The sheet depicts user-requested character and product-inspired designs, is a concept for review only, and does not establish permission for commercial distribution or provide fitted sprite layers. The design notes beside it are references; the build-out checklist remains the backlog.

Additional requested costume concepts: `art/pocket-pup/wardrobe-concepts/more-costumes-1.png` and `more-costumes-2.png` were generated for this project from the neutral dog reference. They are visual concepts only and redraw the dog. The depicted Fungus is an unverified interpretation; user-provided reference or clarification is needed to make it accurate. Fitted layers, pose checks, character and brand permissions, and user review remain open.

The user approved the 20 numbered Pocket Pup clips. `tools/export_runtime_art.py` packs the native frames into per-clip atlases in `public/dog/clips/` and records file hashes and atlas sizes. Each grid cell is 64 × 64. Breathing phases occupy the first four rows and independent prop/effect layers use later rows. The app uses the approved stretch revision with the soft curved shoulder. Bark playback uses an original synthesized cue. No audio recording was added.

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

## Adoption walking concept — November 24

`public/dog/welcome-walk.gif` is a temporary runtime trial derived from the user-approved generated pose concept in `art/pocket-pup/walk-concept/generated-reference-sheet.png`. The generated poses redraw the dog rather than preserving the approved v32 pixels; background removal and 64-pixel scaling were applied for the trial. It plays only during adoption, then returns to the normal layered dog. The walk has not been fitted to wearable layers or reviewed in the native app. A production-quality walk should be redrawn on the approved base and visually checked. The existing synthesized bark follows the walk.

- November 24 wardrobe fit pass: costume and older item overlays are project-authored SVG/React pixel drawings, simplified draft interpretations of the requested themes. The actual app screenshots in `docs/wardrobe-review-2026-11-24/` were captured from an isolated local Windows test profile. Visual review and final art approval are pending.

- `art/pocket-pup/wardrobe-concepts/bee-fit-experiment.png`: AI-generated visual experiment, November 24, 2026. It redraws the dog and contains noisy transparency artifacts; it is a concept reference only, not a usable in-app layer or approved artwork.

- `art/pocket-pup/wardrobe-concepts/bee-overlay-experiment.png`: AI-generated transparent bee clothing experiment. Generated as an overlay with a face opening; contains drawn ears and has not been aligned or tested against Inu's actual standing and sitting frames. Concept only, not approved production artwork.

- `art/pocket-pup/wardrobe-concepts/toad-overlay-experiment.png` and `shrimp-overlay-experiment.png`: AI-generated transparent clothing design studies, not aligned to Inu or approved production art. `public/dog/experiments/bee-overlay.png` is a copy of the bee study used exclusively in the Dev-mode fit experiment. These outputs may have transparency artifacts and require art and fit review.

- `public/dog/experiments/bee-loaf.png`: transparent image generated for Inova on November 25 using the approved sitting bee as the reference. Standing and sitting use the existing reviewed PNGs. Expression details are authored separately in `CostumePortrait.tsx`. The loaf drawing and the complete motion sequence remain subject to visual review.

- Batch 01 wardrobe fits are original project-authored vector pixel paths in `FittedFaceCostume.tsx`. They were drawn against rendered Pocket Pup pixels using pose and walk landmarks measured from existing project art. The concept references for Fancy mustache, The bob and The Lorax are in `art/pocket-pup/wardrobe-concepts/requested-costumes.png`. No new third-party assets or external runtime were added. The designs are provisional.

- Batch 02 camo cap, mushroom cap and vest, and flower collar are project-authored pixel-shaped vector paths in `RegisteredHeadwear.tsx`. Concept references are `requested-costumes.png`, `more-costumes-1.png`, and `more-costumes-2.png` in `art/pocket-pup/wardrobe-concepts/`. The fitted layers reuse existing Inu frames and are provisional.

- Batch 03's crown and cape, wizard glasses and collar, and party hat and ruff were drawn as pixel-shaped vector paths in `CharacterAttire.tsx`, using `art/pocket-pup/wardrobe-concepts/requested-costumes.png` as a concept reference. They reuse Inu's existing frames. The designs are provisional.

- Batch 04's robes, towel, cucumber slices, and hoodie were drawn as pixel-shaped vector paths in `LoungeAttire.tsx` with `art/pocket-pup/wardrobe-concepts/more-costumes-1.png` as the reference. They reuse Inu's original frames. The cucumber slices sit beside the eyes so expressions stay visible. The designs are provisional.

- Batch 05's Pikachu, Shrek, and Mort hoods and garments were drawn as pixel-shaped vector paths in `CreatureHood.tsx`, based on `requested-costumes.png` and `more-costumes-2.png` in `art/pocket-pup/wardrobe-concepts/`. The hood openings show Inu's existing face. The designs retain his curled tail and remain provisional.

- Batch 06's Iso jacket, Omen hood and scarf, and Killjoy beanie, frames, and jacket were drawn as project-authored pixel-shaped paths in `AgentAttire.tsx`. Concept references are `more-costumes-1.png` and `more-costumes-2.png` in `art/pocket-pup/wardrobe-concepts/`. Omen's hood leaves Inu's face visible. A separately equipped hat hides the hood or Killjoy's beanie while retaining their jackets. The designs are provisional.

- Batch 07's Shrimp suit, Wonder Bread, and Chicken nugget pieces were drawn as pixel-shaped vector paths in `FoodCostume.tsx`. References were `requested-costumes.png` and `more-costumes-1.png` in `art/pocket-pup/wardrobe-concepts/`. The artwork reuses Inu's original expressions and visible paws. A separately equipped hat replaces the hood and preserves the garment. The designs are provisional.

- The original wardrobe refit uses original, project-authored pixel-shaped paths in `LegacyWearable.tsx` and `LegacyBodyWearable.tsx`. The overlays were fitted against Inu's existing app art and welcome-walk paw landmarks. No additional external assets or runtime libraries were introduced. [Legacy fit review](wardrobe-review-2026-11-24/LEGACY_REFIT.md) includes muted live-app captures for all ten original items and Windows captures of both four-slot combinations. The revised Star glasses use original project-authored pixel paths with open lenses fitted to the existing eye pixels.

- Batch 08's gift bow and wrapping, maple crown and collar, and turkey dinner garment are project-authored pixel-shaped vector paths in `FestiveCostume.tsx`. They use `more-costumes-1.png` in the wardrobe concepts folder as a reference and retain Inu's existing sprite pixels under the fitted layers. Artwork is provisional.
- The UFC hoodie is a project-authored charcoal and red lettering update to the existing pixel-shaped hoodie art in `LoungeAttire.tsx`. It retains the original catalog ID.

- Batch 09 foliage, Bibble hood and wing, and Fungus cap and coat are project-authored pixel-shaped vector paths in `GardenCostume.tsx`. Concept references are the Sneaky bush, Bibble and Fungus panels of `more-costumes-1.png`. The Sneaky bush revision uses hand-drawn pointed leaf paths with visible veins. These provisional layers reuse Inu's existing sprite, face and animation art.

- Batch 10's bottle costume, portico and flag, and red hood and suit are project-authored pixel-shaped vector paths in `NoveltyCostume.tsx`. They reference the Soju bottle, The White House, and Elmo panels of `more-costumes-2.png`; they reuse Inu's existing sprite and expressions. The façade has a hand-drawn folding side wing and window for the intermediate sit frame. Designs are provisional.

- Batch 11's crested armor, fox wig and robe, scout cap and pack, and fox tail fan are project-authored pixel-shaped paths in `AdventureCostume.tsx` and `RearCostumeLayer.tsx`. Costume references are from `more-costumes-2.png`. Existing Inu frames remain the source for expression and motion. The Scout pack has separately drawn upright and compact pixel paths. Art is provisional.

- Batch 12's pigtails and pop outfit, Goth bows and dark dress, and E-girl ribbons and pink trim are project-authored pixel-shaped paths in `StageCostume.tsx`. They reference the Britney Spears panel of `requested-costumes.png` and the Goth and E-girl panels of `more-costumes-2.png`. Inu's original frames provide the face and body. The skirts have hand-drawn upright hems and a pose-specific intermediate fold with per-outfit trim. The fit is provisional.

- The Fancy mustache refit changes the project-authored pixel paths in `FittedFaceCostume.tsx`. The fit uses the original Inu sprites as its landmarks, including the sleep and wake frames. The artwork remains provisional.

- The Lorax muzzle refit redraws the golden curls as project-authored mirrored pixel paths in `FittedFaceCostume.tsx`. It references the Lorax panel of `requested-costumes.png` and uses landmarks from Inu's original sprites. Brow and muzzle placement follow independent landmarks. The outfit art remains provisional.

`public/dog/walk-standing-atlas.png` is the revised live walk for the original Inu sprite and layered wardrobes. It is project-authored from `public/dog/neutral.png` by shifting pixels within the four lower leg regions. All eight frames preserve the top 49 rows, and the first and last frames are pixel-identical to the source. The previous generated GIF and atlas are retained as reference. The updated gait remains provisional pending native and art review.

- Busy bee walking reuses the reviewed standing portrait at `public/dog/experiments/bee-approved-standing.png`. `BeePortraitPaws.tsx` crops the lower paw regions and offsets their source positions during the shared gait. All upper artwork remains the original portrait. The walk is provisional.

- Clown around's party suit, red nose and ruff are project-authored pixel paths in `ClownAttire.tsx`, fitted to the original Inu sprite and based on the clown panel in `art/pocket-pup/wardrobe-concepts/requested-costumes.png`. The revised fit remains provisional.

- The three lounge outfits' original paths in `LoungeAttire.tsx` now use a tighter resting fit. The spa towel and cucumber slices remain separate layers so the art can give way independently to equipped hats or eyewear.

Busy bee accessory registration reuses the existing project-authored hats, glasses, and sock drawings against landmarks sampled from the existing Bee portraits. [Current Bee fit](wardrobe-review-2026-11-24/BATCH_01.md#current-playback-and-windows-fit).

### Bark expression

The bark mouth and rays are original pixel shapes drawn in the app and registered to Inu's existing muzzle art across base poses, moods, and transition frames. The original single-bark atlas remains in the asset archive and supplies the clip's timing reference. The reviewed Busy bee continues to use its portrait expression. The low-pose artwork is provisional. [Windows comparison](wardrobe-review-2026-11-24/batch-four-seated-bark.png).
