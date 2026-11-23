# Artwork and Audio Plan

Asset checklist and provenance record. The starter includes original placeholder dog art, simple CSS equipment shapes, generated app icons, and synthesized click/reward tones. Final artwork, recorded sounds, counts, dimensions, and animation conventions remain to be agreed.

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
| src/styles-dog.css equipment shapes | Original project CSS | Created for this project | No | Temporary notebook/bandana shapes |
| src/services/audio.ts | Original synthesized tones | Created for this project | No | Click and reward only; no recorded bark |
| public/art/quest-toy-icon-v1.png | Built-in image generation, Inova design conversation | Generated for this project; no third-party asset license asserted | Yes | Transparent golden rubber bone with teal/orange rope; see QUEST_TOY_ART.md |
| public/art/quest-toy-frame-v1.png | Built-in image generation, Inova design conversation | Generated for this project; no third-party asset license asserted | Yes | Blank cream quest board, golden bone corners, braided rope; responsive nine-slice border |
| art/pocket-pup/source/concept-board.png | Inova design conversation; user selected Pocket Pup | Generated for this project | Yes | Preserved source for reproducible conversion |
| art/pocket-pup/v1 | Fixed-grid conversion plus original code-authored expressions, sleeping pose, and layers | Derived from selected project concept | Source concept only | Art review pack; not integrated into app; see art/pocket-pup/README.md |
| art/pocket-pup/v2 | Programmatic face refinement of version one | Derived from selected project concept and original pixel edits | Source concept only | Clean awake eyes, happy blush, separated nose/mouth; tired and sleeping preserved; not integrated |
| art/pocket-pup/v3 | Programmatic happy/barking refinement | Derived from selected project concept and original pixel edits | Source concept only | Happy :3 smile with blush, slightly furrowed barking eyebrows; other states preserved; not integrated |
| art/pocket-pup/v4 | Corrected neutral/happy expression assignment | Derived from selected project concept and original pixel edits | Source concept only | Neutral :3, happy :D with blush, barking furrow retained; not integrated |
| art/pocket-pup/v5 | Small eye whites and raised awake muzzle study | Derived from selected project concept and original pixel edits | Source concept only | Neutral/barking eye whites; awake nose and mouth raised one pixel; tired/sleeping unchanged; not integrated |
| art/pocket-pup/v6 | Neutral face alternatives | Derived from selected project concept and original pixel edits | Source concept only | Single corner highlights, higher neutral face, black mouth; separated/connected smile alternatives; awaiting choice |

Pocket Pup is the user-selected direction for Track A. The [art review pack](../art/pocket-pup/README.md) defines a 64 by 64 grid, binary alpha, a fixed palette, standing anchors, and separate overlays. Its sleeping pose has no fitted clothing yet. This is a review draft and does not change the current sprite renderer or shared mood schema.

Do not use placeholders as evidence that the final asset set is complete. A repository-wide distribution license has not been selected; do not attach a third-party license to these assets without the team's decision.
