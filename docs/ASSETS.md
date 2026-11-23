# Artwork and Audio Plan

Asset checklist and provenance record. This branch includes selected Pocket Pup runtime sprites, original SVG wearable fitting markers, generated app icons, and synthesized click/reward tones. The old placeholder dog remains as an image-load fallback. Final wearable art, recorded sounds, and full animation conventions remain unfinished.

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
| public/dog/*.png and manifest.json | User-directed Pocket Pup project artwork copied from the separate art worktree; source variants and checksums in manifest | Created/generated for this project; no external asset license asserted | Original concept AI-generated, then programmatically edited | 64x64 transparent dog poses. Neutral and approved sit are preserved exports; tuck remains an experimental motion study. Legacy bandana/notebook images retained as references but not used by the slot-marker renderer. |
| src/services/audio.ts | Original synthesized tones | Created for this project | No | Click, reward, and pitch-swept toy squeak; no recorded bark |
| public/art/quest-toy-icon-v1.png | Built-in image generation, Inova design conversation | Generated for this project; no third-party asset license asserted | Yes | Transparent golden rubber bone with teal/orange rope; see QUEST_TOY_ART.md |
| public/art/quest-toy-frame-v1.png | Built-in image generation, Inova design conversation | Generated for this project; no third-party asset license asserted | Yes | Blank cream quest board, golden bone corners, braided rope; responsive nine-slice border |

This branch integrates the selected Pocket Pup runtime exports for anchor testing. Historical art-review sheets and source generators remain in the separate art worktree; the runtime manifest records their source paths/checksums. Final wearable artwork is not delivered by the colored markers. Full animation approval and additional poses remain separate work.

Do not use placeholders as evidence that the final asset set is complete. A repository-wide distribution license has not been selected; do not attach a third-party license to these assets without the team's decision.
