# Inova AI Context

## Project in one paragraph

Inova is a SCOPE club final project for the theme Evolve. It is an evolving pixel dog desktop companion: users grow through small real-life quests, their dog gains cosmetics and experiences, and its support adapts through approved personal memories. It should feel like a game with a companion the user cares about. The repository contains a connected Tauri/React starter with placeholder artwork, synthesized tones, and an explicitly labeled sample planner.

## Established team direction

For resumed Track A art/animation work, use [the continuation prompt](ANIMATION_CONTINUATION.md). The v36 tired sit to loaf was approved November 26, 2026 and runs in the app. The v37 sit/loaf-to-stand preview (`art/pocket-pup/v37/`) awaits user review; do not integrate it before approval.

Work from November 26 lives on branch `test/native-float` (stacked on `feature/loaf-integration`) and is **not yet merged into main**. It holds the loaf integration, the v37 preview, refreshed next actions, and the Mac floating-dog native run (all ten [checklist](NATIVE_FLOAT_CHECKLIST.md) steps passed). Windows native results are pending a teammate.

Current functional checkout: the primary project folder on `main`; see [consolidation inventory](MAIN_CONSOLIDATION.md). Existing worktrees are preserved snapshots. Approved v32 sit, v34 breathing, and v35 seated tiredness are integrated alongside four-slot wardrobe, reliable quit, and startup feedback. Mood changes preserve posture. Approved v36 loaf follows seven seconds of stable tired sitting; animated sit-to-stand remains unfinished. See [TRANSITION_TABLE.md](TRANSITION_TABLE.md).

- UI controls should use recognizable icons where text labels can be replaced clearly, with accessible names/tooltips and keyboard focus. Wardrobe uses a hanger destination icon, T-shirt body category, five inventory filters, top clear-outfit icon, and only side-by-side human Stand/Sit pose controls. These project-wide interface rules are recorded in AGENTS.md.

- Functional wardrobe has four simultaneous worn slots: hat, glasses, socks, body. See [WARDROBE_SPEC.md](WARDROBE_SPEC.md) for schema v2 migration, developer fixtures, placeholder anchors, and future world limits. Future world items: three toys, one or two scenery changers (undecided), one background; not implemented.

- Pixel dog art, with a small selection of adoptable base dogs as the desired experience.
- A game-like adoption center and lightweight wardrobe-style picker.
- A transparent, draggable dog above desktop windows during everyday use.
- Separate emotion/pose assets and clothing/prop layers. Mix reusable pieces instead of generating every complete combination.
- Experience-based cosmetic unlocks, with treats and toys also desired.
- Every implemented deliberate action gets an appropriate visible response and sound when enabled: clicks, actual barks, doors, book sounds, and reward fanfare.
- A readable memory bookshelf with dates on book spines and an open-book reading view.
- The dog's world can expand through the user's experiences.
- The name is Inova; the remote is `git@github.com:JBarmada/Inova.git`.
- Compact companion controls use Home and Settings pixel icons; sound and developer controls live in Settings. All manual dog controls (pose, mood, animation and future additions) use the shared DogDeveloperControls gate and require Dev mode in home and floating mode; it defaults off. The quest menu dismisses outside/on focus loss/with Escape and must not gain a close or minimize button; regression checks enforce these rules. Keep status small and pixel-styled; future expression markers such as excitement exclamations remain for later design work.

## Proposed complete loop

Adopt, add commitments, receive editable AI quests, record an experience, earn a reward once, equip an item, open a dated memory, and see a later suggestion adapt to relevant saved feedback.

The minimum can start with one polished dog and a few items. Multiple base dogs remain desired. Manual commitments are enough to start; integrations are not prerequisites for that first loop.

## Preserve these distinctions

- Feature ideas are not implemented capabilities.
- Established preferences are different from the proposed minimum scope.
- Cosmetic unlocks, pet interactions, and AI personalization are related but distinct systems.
- An expression is not an outfit. An unlocked item is not necessarily a consumable.
- A calendar plan is not proof an activity happened. A grade or photo is limited evidence.
- A visible journal entry need not be available for AI personalization.
- Optional spooky mode was discussed, including zombie/skeleton transformations, eye bags after an all-nighter, and potion or lightning revival. Triggers and revival requirements are undecided. Do not silently turn either the team's idea or an assistant's alternative into a settled rule.

## Framework and team

Team-selected framework: Tauri 2, with Rust for the desktop core and React/TypeScript/Vite for the interface. Both Windows and Mac are required. There are three active builders; deadline December 1, 2026. The starter uses local state through one store and a browser preview adapter. No sign-in or cloud sync is implemented. Model provider, spending limit, integrations, and final reward balancing remain open.

Start with [setup](SETUP.md), [architecture](ARCHITECTURE.md), [shared contracts](SHARED_CONTRACTS.md), and the [three-person plan](TEAM_PLAN.md). The README and TEAM_PLAN.md now split work into dog art, animation, items/fitting, adoption/interactions, wardrobe, desktop shell, quests/progression, AI/personalization, memories, sound/effects, and testing/release. The older A/B/C handoffs are background references. Leads are assigned per active task; individual names remain unassigned.

## Where to look next

Main includes the reviewed floating quest toy and layout/settings fixes, a single icon toolbar, and separate Companion, Quests, Wardrobe, and Memories pages. Quest navigation and floating interactions share the golden/teal toy artwork. The dog renderer is still the original placeholder; the separate Pocket Pup art work is not part of this integration. The approved floating frame fix is included: the native canvas reserves the board width while collapsed, preventing a sideways opening/closing blink. See the native capture evidence in docs/evidence/floating-toy-frame-fix. See IMPLEMENTATION_STATUS.md and WINDOW_LAYOUT_HANDOFF.md before reapplying older branch work.

- [Behavior](01-app-behavior.md), [full vision](02-full-vision.md), [game feel](03-game-feel.md).
- [Dog assets](04-dog-art-and-items.md), [memory world](05-memory-bookshelf-and-world.md).
- [Minimum scope](06-must-have-scope.md), [stretch goals](07-stretch-goals.md), [open decisions](08-decisions-and-open-questions.md).
- [Agent requirements](AGENT_REQUIREMENTS.md), [curriculum context](CURRICULUM_CONTEXT.md).
- [Demo checks](DEMO_AND_CHECKS.md), [asset record](ASSETS.md), [implementation status](IMPLEMENTATION_STATUS.md).

These files contain the necessary product context without requiring access to the original chat or private Pages. If later instructions conflict, follow the team's latest explicit direction and update the affected records.
