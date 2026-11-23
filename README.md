# Inova

An evolving pixel dog desktop companion that grows with you through real-life quests, shared memories, and unlockable rewards.

Inova is a SCOPE club final project for the theme **Evolve**. You build habits and try new experiences, your dog gains expressions and unlocks, and its support adapts to what helps you.

## Current status

Main includes the reviewed floating quest toy, home/floating placement restoration, Settings/developer controls, and an icon toolbar with separate Companion, Quests, Wardrobe, and Memories pages. Quest navigation uses the same golden/teal toy artwork as the desktop companion. See the November 23 integration checkpoint in [implementation status](docs/IMPLEMENTATION_STATUS.md) for checks and remaining platform limitations.

Shared starter: **Tauri 2 + Rust + React + TypeScript + Vite**, targeting Windows and Mac. Three builders are working toward **December 1, 2026**. The starter connects adoption, a floating-mode control, sample quests, deterministic rewards, wardrobe, and local memory storage. This branch uses selected Pocket Pup dog sprites with placeholder wearable markers and synthesized sound; planning is a visibly labeled deterministic sample, with no live AI or external integrations. See [verified status and limitations](docs/IMPLEMENTATION_STATUS.md).

## Run the starter

Install the [platform prerequisites](docs/SETUP.md), then:

```sh
npm ci
npm run desktop
```

For a browser interface preview without Rust, use `npm run dev`. This preview cannot demonstrate desktop overlay behavior.

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
