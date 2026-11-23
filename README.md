# Inova

An evolving pixel dog desktop companion that grows with you through real-life quests, shared memories, and unlockable rewards.

Inova is a SCOPE club final project for the theme **Evolve**. You build habits and try new experiences, your dog gains expressions and unlocks, and its support adapts to what helps you.

## Current status

Functional work is consolidated on **`main`** as of November 23, 2026. Continue in the primary project folder, `C:\Users\creat\Desktop\school\Scope Final Project`. Older worktrees remain preserved for recovery; see the [consolidation inventory](docs/MAIN_CONSOLIDATION.md) before reusing their changes.

Built with **Tauri 2 + Rust + React + TypeScript + Vite**, targeting Windows and Mac. Three builders are working toward **December 1, 2026**.

The current app includes:

- Adoption and naming, approved Pocket Pup sit motion, grounded breathing, and seated tired expressions. Mood changes preserve posture; reduced motion is supported.
- A transparent, always-on-top floating companion, independent home/floating placement restoration, and an expandable quest toy with manual commitment entry and quest actions.
- Separate Companion, Quests, Wardrobe, and Memories pages with pixel navigation icons. Home uses a monochrome quest icon; the floating toy retains its gold/teal artwork.
- A four-slot wardrobe for hats, glasses, socks, and body clothing, with category filters, standing/sitting previews, compact outfit controls, and developer test outfits. Wearable graphics remain placeholders.
- Labeled sample quest planning, distinct quest states, duplicate-safe demonstration rewards, and local reflections with per-entry personalization permission and deletion.
- Settings for sound, developer mode, and optional status; startup loading/retry feedback; and a shared save-and-quit flow for native X and floating Settings > Quit Inova.

Consolidation checks passed all **65 tests**, source size/type checks, the frontend production build, and Windows release compilation. These are the recorded consolidation results; a fresh combined native UI walkthrough and Mac validation remain pending. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for evidence and limitations.

Planning is a deterministic sample, with **no live AI or external integrations**. Sound is synthesized; final clothing art and recorded audio remain unfinished. The loaf animation is preserved for review, with its runtime timer disabled; animated stand-up also remains unfinished.

## Run the app

Install the [platform prerequisites](docs/SETUP.md), then:

```sh
npm ci
npm run desktop
```

For a browser interface preview without Rust, use `npm run dev`. This preview cannot demonstrate desktop overlay behavior.

Run checks with `npm run check`. Build the native app without an installer using `npm run tauri build -- --no-bundle`. Build and test the Mac app on a Mac; Windows compilation does not verify Mac behavior.

The wardrobe migrates validated older saves to schema v2 on the next successful action. Older app builds cannot read v2 saves, so avoid launching preserved worktree versions against the same desktop data. Browser preview and desktop saves are separate.

## Pick your track

| Track | Feature | Handoff |
| --- | --- | --- |
| A | Adoption and desktop companion | [Start Track A](docs/tasks/A_COMPANION.md) |
| B | Commitments and AI quests | [Start Track B](docs/tasks/B_QUESTS.md) |
| C | Wardrobe and memory world | [Start Track C](docs/tasks/C_WORLD.md) |

Read the [team plan](docs/TEAM_PLAN.md) and [shared agreements](docs/SHARED_CONTRACTS.md) before editing shared files. Choose which person takes each track; names are not assigned yet.

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
