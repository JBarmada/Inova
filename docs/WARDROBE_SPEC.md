# Wearables and future world items

User decision, November 23, 2026. This branch makes wearable combinations functional and testable with placeholder graphics; it does not claim final item artwork.

## Wear at the same time

| Slot | Capacity | Prototype examples |
| --- | --- | --- |
| Hat | One | Trail cap, cozy beanie |
| Glasses | One pair | Round glasses, star glasses |
| Socks | One coordinated set | Mint socks, gold socks |
| Body | One | Raincoat, hoodie, bandana, legacy notebook badge |

All four slots can be occupied together. Equipping replaces only the item's own slot. Removing a slot preserves the other three; Clear outfit removes all equipment but preserves ownership. A socks item covers the pose's visible paws; hidden paws do not float outside the body. Expressions and poses remain separate from equipment.

Notebook and bandana retain their existing IDs and quest rewards. To preserve the old worn notebook without adding a prop slot, it is rendered as a notebook body badge. Both legacy items use the body slot. Future notebook-as-world-prop behavior requires a separate decision and migration. The main costume collection can be earned through completed quests. The original prototype accessories still use the developer scenarios.

Some outfits use basic completion milestones, such as Busy bee at four quests. Others use a quest theme, such as planting native trees for the Lorax costume. The wardrobe gives a clue for each themed unlock, and Dev mode offers one-click ownership and a quest classification view. Ownership previously earned stays saved.

## Functional implementation

- `src/shared/equipment.ts`: item IDs, slot assignment, equipment validation.
- `src/shared/catalog.ts`: names, prototype colors, ownership descriptions.
- `src/shared/wardrobeScenarios.ts`: fictional Rainy study walk, Cozy library day, and Explorer outfits.
- `src/state/equipment.ts`: slot replacement, removal, and developer-gated fixture grants, using the existing store/save queue.
- `src/features/companion/wearableAnchors.ts`: 64 by 64 pose-specific placements.
- `WearableLayers.tsx`: SVG markers in shared DogSprite, used on Companion, floating mode, and Wardrobe.

Placeholder layer order: body, socks, glasses, hat. Glasses track the eye line; hats sit on the head; body markers sit on the chest; socks track visible feet. Sitting shifts head/body anchors up three pixels, tucking up two. Seated blink/drowsy/tired faces share seated anchors; mood changes preserve posture. Breathing moves head/body layers one pixel at inhalation while socks stay planted. Final garment fitting, occlusion masks, and alternate breeds remain future work. A missing dog image shows an explicit fallback and suppresses misleading wearable layers.

Wardrobe previews neutral-expression standing and sitting through two side-by-side human pose icons, independently of the pet's current mood. Draft transition poses are not exposed in the wardrobe picker or scenario previews. Companion retains the shared mood and existing Pocket Pup pose playback. Idle sitting uses an eight-second timer; the tuck uses the approved v32 160ms transition. Reduced motion skips it. Existing toy, window-layout, and navigation code from main remain intact.

The five icon filters are All items (four squares), Hats, Glasses, Socks, and Body clothing (T-shirt). All preserves the grouped inventory layout; a category shows only that clothing category, leaving the current outfit untouched. Wardrobe navigation uses a hanger, deliberately distinct from the T-shirt category. Clear outfit is a hanger/remove icon in the compact outfit strip below the dog preview. Pose, filter, wear, worn, lock, and per-slot remove controls use accessible names and tooltips, with visible selected/focus states. Item names remain readable text. The earlier implementation/slot-explanation paragraph is removed from the screen. See AGENTS.md for project-wide icon rules.

## Persistence and compatibility

Schema version 2 stores `equipment: {hat, glasses, socks, body}`. The same local storage key (`inova-state-v1`) and desktop file remain in use so existing saves are found. A valid v1 `equippedItem` becomes `equipment.body`; ownership, quests, rewards, memories, and settings are preserved. Missing historical settings retain their existing defaults. The upgraded save is written only on the next successful action.

Invalid, unowned, wrong-slot, or future-version saves fail validation instead of being reset. Older app builds cannot read v2 saves; back up production saves before testing across branches. Use the separate preview origin below for fictional testing. No data is uploaded.

## Try it locally

From this worktree run `npm ci`, then `npm run dev -- --port 5194`. Open `http://127.0.0.1:5194/`; this origin isolates its browser saves from the usual port. For native development use `npm run desktop` after the platform prerequisites; native saves are separate from browser saves but use the app's existing identifier.

1. Adopt a fictional dog. In Settings enable Dev mode, then open Wardrobe.
2. Expand Developer wardrobe scenarios. Applying one explicitly grants its prototype items locally and saves its outfit; it does not create quests, memories, or reward history.
3. Apply Rainy study walk: all four slots are worn. Compare the Stand and Sit icons. Inspect the six static scenario previews for anchor differences. Click each of the five category filters; only the inventory category changes, and All items restores all four groups.
4. Apply Cozy library day, then wear Trail cap: only the hat changes.
5. Remove glasses or socks; the other slots stay equipped. Clear outfit; owned items remain available to equip again.
6. Reload: ownership and equipment persist. Disable Dev mode: the scenario controls disappear and the current outfit remains. Muting sound still leaves visible and accessible feedback.
7. In normal mode, locked items remain disabled. The first/third accepted quest rewards still unlock notebook/bandana without changing the current outfit.

Automated tests cover migration, invalid/locked slots, four-slot persistence, fixture gating, duplicate fixture grants, clear/remove/replace behavior, rendered layers, and anchor bounds. See [verification evidence](evidence/wardrobe-slots/README.md).

## World items: recorded for later, not implemented

| World category | Simultaneous capacity | Decision status |
| --- | --- | --- |
| Toys | Up to three | User-selected future limit |
| Object / terrain changers | One or two | Exact capacity remains open between those two options |
| Background | One | User-selected future limit |

World items will be independent from the four worn slots. Do not turn the existing quest-navigation bone into an inventory toy automatically. World placement, replacement rules, interactions, unlocks, scene persistence, and object-versus-terrain subslots remain unimplemented and need a later design decision.

## Try-on preview — November 24

The catalog offers temporary previews across all four clothing slots, including locked items. Previewing does not grant ownership or change saved equipment; End preview returns to the saved outfit. Final art and platform visual checks remain pending.

## Fitting new outfits — review workflow

This process is a proposed production workflow, not approval of any existing outfit. The user now prefers the more pixelated look of the original costume concepts. Use their stepped edges, shading and recognizable silhouettes as the visual target, while fitting separate clothing layers to Inu's existing artwork. Generated concepts are references, not already-fitted assets. Check the current implementation and asset review status before starting: the historical placeholder descriptions above may no longer describe every item.

Current pilot scope: fit and show one outfit in Stand and Sit first. The later motion, combination, and platform checks below are follow-on work, not claims about this initial preview. Record the user's feedback before reusing the approach across the other outfits.

1. **Establish references.** Record the item ID, slot, original concept image and its provenance, the actual dog assets, branch and commit. Capture the undressed dog in the app in both Stand and Sit at the same scale and framing; use those exact poses as the fitting target. Keep the source concept and dog art unchanged.
2. **Fit one outfit, one pose at a time.** Build separate behind-dog and in-front layers as needed, using the existing wearable renderer and pose anchors. Match the concept's recognizable shape, colors and details while following the dog's silhouette. Position the head opening, neckline, chest and visible paws against the actual art; keep eyes, mouth and expression readable. Check whether an ear, tail or paw should be in front of or behind the garment rather than covering it accidentally. A single scale or offset is not evidence of a correct fit in both poses.
3. **Check the real preview.** Equip the item in the app and capture comparable Stand and Sit screenshots, including the complete dog and the unchanged original concept alongside them. Inspect at normal size and enlarged. Check outlines and gaps, clipping, displaced or floating clothing, face visibility, and whether the dog still looks like itself. Record any issue and revise; do not substitute a contact sheet, generated mockup or code review for an app screenshot.
4. **Check combinations and motion.** Test the other three slots separately and together, with muted feedback and reduced motion. Inventory filters and pose preview must not change the worn outfit. Compare relevant animation frames using the real source assets, existing per-frame anchors and layer order, then watch actual playback in the app. A static fit does not establish a smooth transition; if a pose or clip is not fitted, record it as unverified rather than hiding clothing or inventing a visual pass. Inspect floating mode and desktop mode separately.
5. **Review and record.** Have an independent reviewer inspect the screenshots and, where animation is supported, playback. Show the user actual app screenshots and wait for their visual approval before calling the art finished. Record concept and asset provenance in [ASSETS.md](ASSETS.md); note the worktree/commit, device, modes, poses, combinations, animations and reduced-motion cases checked, screenshot paths, failures, and approval status in the existing status or evidence record. A successful build or browser preview alone does not prove native Windows or Mac appearance.

For each outfit, maintain a small evidence row: **item and concept | Stand screenshot | Sit screenshot | combinations | tested clips/playback | desktop/floating platform | open defects | reviewer/user approval**. Use fictional test data and keep provisional art explicitly marked until the user accepts it.

## Registered costume pilot — November 25

The current bee uses pose-specific PNGs with shared ground alignment and separate facial details. `CostumePortrait.tsx` registers the sources, dimensions, ground line and face coordinates. `costumeMotion.ts` maps posture and clip beats. Add new costumes through that shared contract, checking any accessory placements against their actual silhouette. Stand, sit and loaf each use one sprite. The current transitions use timed pose changes and squash. Draw intermediary poses wherever the silhouette or head angle still jumps. Keep the standing-art bob labeled as a walking trial until an authored gait is approved.
