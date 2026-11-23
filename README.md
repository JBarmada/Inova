# Inova

An evolving pixel dog desktop companion that grows with you through real-life quests, shared memories, and unlockable rewards.

Inova is a SCOPE club final project for the theme **Evolve**. You build habits and try new experiences, your dog gains expressions and unlocks, and its support adapts to what helps you.

## Current status

This build-out is on **`codex/inova-complete`**, based on the verified `main` checkpoint. It is developed in an isolated worktree; the primary checkout and its uncommitted artwork are preserved. See the [build-out checklist](docs/BUILD_OUT_CHECKLIST.md) and [consolidation inventory](docs/MAIN_CONSOLIDATION.md) before integrating or reusing other work.

Built with **Tauri 2 + Rust + React + TypeScript + Vite**, targeting Windows and Mac. Three builders are working toward **December 1, 2026**.

The current app includes:

- Adoption and naming, approved Pocket Pup sit motion, grounded breathing, and seated tired expressions. Mood changes preserve posture; reduced motion is supported.
- A transparent, always-on-top floating companion, independent home/floating placement restoration, and an expandable quest toy with manual commitment entry and quest actions.
- Separate Companion, Quests, Wardrobe, and Memories pages with pixel navigation icons. Home uses a monochrome quest icon; the floating toy retains its gold/teal artwork.
- A four-slot wardrobe for hats, glasses, socks, and body clothing, with category filters, standing/sitting previews, compact outfit controls, and developer test outfits. Wearable graphics remain placeholders.
- Manual commitments with optional local deadlines and effort estimates; editable quest titles and durations, distinct quest states, duplicate-safe demonstration rewards with visible reveals, and quest-linked reflections with editing, search, permissions, and deletion.
- Optional local Ollama planning with selectable Gemma 3 12B/4B, a service/model check, permitted reflection context, validated proposals, and a separate deterministic sample fallback. See [local AI setup](docs/SETUP.md#local-ai-build-out-worktree).
- A local seven-day activity recap, which explicitly excludes older completions without recorded dates, and an outfit shuffle limited to owned items.
- Settings for sound, developer mode, and optional status; startup loading/retry feedback; and a shared save-and-quit flow for native X and floating Settings > Quit Inova.

The latest build-out check passed **103 tests**, source size/type checks and the frontend production build. Windows release compilation and focused native spot checks passed; Mac compilation and runtime, continuous toy-transition timing, and a complete end-to-end walkthrough remain pending. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for evidence and limitations.

Local AI requires a separately installed and running Ollama service and model; the labeled sample planner works without it. There are no external account integrations or actual schedule optimization. Sound is synthesized; final clothing art and recorded audio remain unfinished. The loaf animation is preserved for review, with its runtime timer disabled; animated stand-up also remains unfinished.

## Run the app

Install the [platform prerequisites](docs/SETUP.md), then:

```sh
npm ci
npm run desktop
```

For a browser interface preview without Rust, use `npm run dev`. This preview cannot demonstrate desktop overlay behavior.

Run checks with `npm run check`. Build the native app without an installer using `npm run tauri build -- --no-bundle`. Build and test the Mac app on a Mac; Windows compilation does not verify Mac behavior.

The wardrobe migrates validated older saves to schema v2 on the next successful action. Older app builds cannot read v2 saves, so avoid launching preserved worktree versions against the same desktop data. Browser preview and desktop saves are separate.

## Choose a work area

These are focused areas to divide among people or tackle in separate sessions. With three builders, keep only a few tasks active at once; one person can cover several areas. Owners are not assigned yet.

| Work area | Owns | Start here |
| --- | --- | --- |
| Dog artist | Base dog, expressions, approved still poses, consistent pixel style | [Artist guide](docs/ARTIST_GUIDE.md) |
| Animator | Transition frames, timing, breathing, and runtime pose/mood playback | [Animation handoff](docs/ANIMATION_CONTINUATION.md), [coverage table](docs/TRANSITION_TABLE.md) |
| Item creator and fitter | Clothing/prop artwork, catalog entries, layer order, fitting across approved poses | [Item contract](docs/WARDROBE_SPEC.md), [asset record](docs/ASSETS.md) |
| Adoption and pet interactions | Naming/selection flow, pet actions, and the events that request dog reactions | [Companion handoff](docs/tasks/A_COMPANION.md) |
| Wardrobe interface | Inventory filters, preview, worn-item controls, equip/remove feedback | [Wardrobe handoff](docs/WARDROBE_CONTINUATION.md) |
| Desktop shell and navigation | Floating/home UI, dragging, window placement, Settings, startup, and quit | [Architecture](docs/ARCHITECTURE.md), [startup handoff](docs/STARTUP_LOADING_HANDOFF.md) |
| Quests and progression | Manual commitments, quest editing/lifecycle, completion, deterministic rewards | [Quest handoff](docs/tasks/B_QUESTS.md), [shared rules](docs/SHARED_CONTRACTS.md) |
| AI and personalization | Provider connection, grounded suggestions, permitted memory context, validation and fallback | [AI requirements](docs/AGENT_REQUIREMENTS.md), [quest handoff](docs/tasks/B_QUESTS.md) |
| Memories and bookshelf | Reflections, dated books, readable entries, memory permissions and deletion | [Memory design](docs/05-memory-bookshelf-and-world.md), [world handoff](docs/tasks/C_WORLD.md) |
| Sound and effects | Bark/equip/book cues, reward reveals, visual feedback, mute and reduced motion | [Game feel](docs/03-game-feel.md), [asset record](docs/ASSETS.md) |
| Testing and release | Reproduction steps, regression checks, Windows/Mac coverage, builds and demo readiness | [Testing handoff](docs/NATIVE_UI_TEST_CONTINUATION.md), [demo checks](docs/DEMO_AND_CHECKS.md) |

Bug fixing belongs to every area: the testing owner coordinates reproductions and verification, while the affected area owns the repair. Shared state, save migrations, dependencies, and merges require coordination. See the [team plan](docs/TEAM_PLAN.md) for boundaries and next deliverables. The older A/B/C handoffs remain useful background, but no longer define the work split.

## Start here

- **Teammates and AI assistants:** read [AGENTS.md](AGENTS.md), then [AI context](docs/AI_CONTEXT.md).
- **Product and design:** follow the [document index](docs/README.md).
- **What to build first:** review the [proposed minimum scope](docs/06-must-have-scope.md).
- **Picking up implementation:** read [current status and handoff](docs/IMPLEMENTATION_STATUS.md).
- **Worktree recovery:** read the [main consolidation inventory](docs/MAIN_CONSOLIDATION.md).
- **Wardrobe continuation:** read the [saved stopping point and next steps](docs/WARDROBE_CONTINUATION.md).
- **Working together:** follow [CONTRIBUTING.md](CONTRIBUTING.md).

## The intended experience

1. Adopt and name a pixel dog in an adoption-center picker.
2. Keep it as a transparent, draggable companion above desktop windows.
3. Turn commitments into small, editable quests.
4. Record an experience, earn an unlock, and celebrate with animation and sound.
5. Mix reusable clothing and prop layers, then revisit dated memories in a bookshelf.
6. Let approved feedback shape the dog's next suggestion.

Game feel is central: clicks click, woofs bark, doors sound like doors, and rewards arrive with fanfare. Expression changes are separate from clothing and props.

## What is settled and what is open

Pixel art, desktop companionship, layered cosmetics, and strong audiovisual feedback are established preferences. Tauri, both desktop platforms, three builders, and the deadline are confirmed. Individual track owners, the live AI provider and budget, final reward balancing, account integrations, and spooky-mode triggers remain open. The [wardrobe prototype](docs/WARDROBE_SPEC.md) supports hat, glasses, socks, and body together, with anchored placeholders and developer test outfits. Reward rules remain demonstrations; the full minimum feature list is still a proposed target.

The full vision includes adulting help, exploration suggestions, optional perspective exercises, an expanding world, and possible calendar or academic integrations. See the backlog before treating an idea as required.

## Share the context with your AI

Clone this repository and ask your assistant:

> Read AGENTS.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, and the documents relevant to my task. Explain the current state, distinguish established requirements from proposals, and identify dependencies before making changes. My task is: [describe your task].

All essential context is in the repository. ChatGPT Page links are optional discussion references and may require separate access. Use [setup](docs/SETUP.md), [architecture](docs/ARCHITECTURE.md), and [team plan](docs/TEAM_PLAN.md) as the current implementation guide.
