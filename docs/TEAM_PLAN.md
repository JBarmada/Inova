# Three Person Build Plan

**Build-out update:** Some next-deliverable entries below describe the earlier main checkpoint. For current isolated-branch capabilities, outstanding work, and verification, use [implementation status](IMPLEMENTATION_STATUS.md) and the [build-out checklist](BUILD_OUT_CHECKLIST.md). The primary checkout and other worktrees remain preserved.

Three active builders, both Windows and Mac, deadline December 1, 2026. Assign a lead per active task; names and individual operating systems are not assigned yet.

## Focused work areas

Updated November 23 after main consolidation. This replaces the broad A Companion / B Quests / C World assignment model. Those handoffs remain background references, not three exclusive ownership silos. These areas divide responsibilities; they do not add features to the deadline or claim unfinished work is implemented.

| Area | Responsibility and boundary | Useful next deliverable |
| --- | --- | --- |
| Dog art | Base dog, expressions, and stable pose artwork. Supplies approved pixels to animation; does not decide behavior triggers. | Resolve one missing expression/still pose from the artist guide and transition ledger. |
| Animation | Transition drawings, timing, export, and pose/mood playback. Uses approved endpoints; pet interactions supply events. | Review v36 tired-sit-to-loaf before enabling its timer; review stand-up separately. |
| Items and fitting | Wearable artwork, catalog metadata, layering, and anchors on supported poses. Coordinates slots with shared state; does not own wardrobe layout or reward balancing. | Replace one placeholder item and demonstrate it standing, sitting, and breathing. |
| Adoption and interactions | Adoption/name/variant flow and deliberate pet interactions. Requests approved reactions through the animation system. | Polish the existing adoption flow; specify one interaction and its visible/muted feedback. New variants need art first. |
| Wardrobe interface | Filters, inventory presentation, pose previews, equipped strip, equip/remove/clear controls. Consumes item catalog and shared actions. | Show and review the latest compact strip/larger preview, then verify keyboard and narrow-window use. |
| Desktop shell and navigation | Home/floating controls, native geometry, dragging, settings, startup and shutdown. Coordinates shared app shell files. | Measure the reported slow startup and verify the loader; preserve reliable quit and toy positioning. |
| Quests and progression | Commitment entry, quest editing/status, completion validation, unlock rules and duplicate prevention. Works with sample or live planner. | Add editable quest wording through agreed actions while preserving distinct states and once-only rewards. |
| AI and personalization | Provider boundary, prompt/context selection, permitted memory use, source IDs, response validation, bounded failures and sample fallback. Cannot award rewards directly. | Agree on provider/budget, then demonstrate one grounded suggestion and a useful failure fallback. |
| Memories and bookshelf | Reflection entry, dated shelf/open-book views, readability, editing/deletion and permission controls. Coordinates deletion effects with AI. | Polish dated books and long-entry reading; verify revocation/deletion removes downstream context. Memory editing remains unfinished. |
| Sound and effects | Action cues, recorded audio sourcing, visual effects and reward presentation. Consumes successful events; does not duplicate reward rules. | Replace a selected synthesized cue with licensed/original audio and test mute, rapid repeats and visual equivalence. |
| Testing and release | Bug reproduction/triage, repeatable native regression checks, platform reports, integration checks and demo/build readiness. | Deliver the bounded native test flow in NATIVE_UI_TEST_CONTINUATION.md, with isolated fictional saves and honest platform coverage. |

Choose a small task from one area with an observable finish. Each task has one lead and a reviewer; assignments remain open. Three builders should keep only a few tasks active, rather than starting eleven branches or separate app versions. An example grouping is art/animation/items, companion/desktop/wardrobe, and quests/AI/memories, with sound and testing shared. This is a capacity suggestion, not an assignment.

Future world placement, toys, scenery, backgrounds and additional rooms stay in the backlog until selected. Their recorded limits are not permission to build them now. Bug fixing is shared work across every area: testing records and reproduces the failure, the affected area repairs it, and testing verifies it.

## Handoffs and dependencies

- Dog artist → animator: approved stable endpoints, exact source pixels and review constraints. Animator → item fitter: supported frames, anchors and timing. New animation must not silently break clothing.
- Item creator → wardrobe: stable IDs, slot, artwork and ownership metadata. Quests → items: agreed unlock events. The UI and AI never invent earning rules.
- Quests → AI: commitment/context inputs and validated proposed-quest contract. AI → quests: a proposal with source IDs; acceptance and completion remain user actions governed by application rules.
- Memories → AI: only permitted records. Revocation and deletion must clear maintained context and copied rationale, not just hide an entry.
- Feature owners → sound/effects: successful action events and visible outcomes. Muted use must preserve meaning.
- Everyone → testing/release: demonstration steps, failure cases and evidence. Browser checks cannot establish native overlay behavior.

Read the linked handoffs in the README and inspect current main before taking a task. Current continuation documents supersede older A/B/C assumptions. No task assignment changes persisted schemas or existing product approval requirements by itself.

## Shared work rules

- Continue from current `main` in the primary project folder; old worktrees are recovery snapshots. Coordinate before opening another checkout or touching shared files.
- Name the active owner for shared app-shell/native changes; do not assume the old Track A label is a current assignment.
- Coordinate schema.ts, actions.ts, reducer.ts, storage, catalog IDs, asset dimensions, dependencies and migrations with affected areas before editing.
- Use the existing store, action queue and services. Never scaffold another app or maintain a second copy of inventory, quests or memories.
- Prefer focused commits and reviewed increments. The current consolidation workflow uses main; agree before changing the team workflow.
- Each feature gets a second person's demonstration/review. Run appropriate checks and keep implementation status accurate; preserve unrelated work.
- Confirm who tests Windows and Mac. Compilation and browser previews do not replace native runtime reports.

## Suggested calendar

| Dates | Target |
| --- | --- |
| November 22–23 | Everyone runs starter; verify overlay on Windows and Mac; choose active task owners and AI provider/budget |
| November 24–25 | Each builder lands one usable improvement; prototype live AI; align art dimensions and sound assets |
| November 26–27 | Merge one complete experience across all tracks; verify save/restart and meaningful personalization |
| November 28–29 | Fix platform and integration issues; replace the most visible placeholders |
| November 30 | Freeze new features, rehearse demo, and prepare a clear fallback |
| December 1 | Final smoke check and demo |

## Definition of done for a feature

It works in the app, persists where appropriate, has visible and sound feedback, handles failure, passes npm run check, and has a clear demonstration. Native changes need Windows and Mac runtime reports. Label every mock and placeholder. Both platforms compiling is useful evidence but does not replace those reports.

## Keep outside the first deadline unless the core is finished

Broad Brightspace/app activity/sleep integrations, cloud sync, multiple rooms, elaborate zombie progression, and runtime image generation. Preserve those ideas in the backlog rather than splitting the team across them now.
