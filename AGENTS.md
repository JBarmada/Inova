# Instructions for contributors and AI assistants

## Start with the project context

- Read README.md, docs/AI_CONTEXT.md, and docs/IMPLEMENTATION_STATUS.md before implementation.
- Read the relevant product documents listed in docs/README.md before changing behavior.
- Check the working tree and current code before assuming the handoff is still current.
- Treat established team preferences, proposed minimum scope, stretch ideas, and open decisions as different statuses.
- Follow the user's latest explicit instructions. Record product or architecture decisions in the relevant documents when they are made.

## Preserve the intended product

- Inova is a pixel dog game and desktop companion with adaptive support.
- The everyday dog is transparent, draggable, and intended to sit above other desktop windows. A browser-only mockup does not complete this requirement.
- Adoption, expressive reactions, modular cosmetics, sound, effects, and a readable memory bookshelf define the experience.
- Keep expressions separate from clothing and props. Reuse compatible layers rather than generating every outfit combination.
- Give implemented user actions appropriate visual feedback and sound when enabled. Preserve meaning with sound muted.
- Keep optional zombie/skeleton and revival mechanics exploratory until the team chooses their triggers.

## Interface rules

- Prefer a recognizable icon when it can replace a short action/navigation label without losing meaning. Keep an accessible name and hover tooltip on every icon-only control.
- Keep item names, user content, meaningful explanations, and errors as readable text. Do not replace essential meaning with an ambiguous unlabeled symbol.
- Use a consistent pixel-style icon family, visible keyboard focus, and at least 44 by 44 CSS pixels for new main-page icon buttons. Selection must be visible with sound muted and exposed through aria-pressed or aria-current.
- Wardrobe navigation is a hanger; the body clothing category is a T-shirt. Keep category and destination icons visually distinct.
- Wardrobe filters are five icons: four-square All items, hat, glasses, socks, T-shirt. A category filters the inventory list without changing the currently worn outfit.
- Keep Clear outfit in the compact outfit strip below the preview, with a suitable remove-clothing icon. It removes worn items, not ownership.
- Wardrobe exposes only Stand and Sit, side by side as human pose icons. Keep draft transition/debug choices out of the normal pose picker.
- Keep implementation notes and placeholder explanations in developer areas/docs rather than adding them to everyday product screens.

## Code size limits

- Strictly limit each authored code file to at most 250 lines of code, excluding blank lines and comment-only lines.
- Every function must contain fewer than 75 lines of code (74 maximum), excluding blank lines and comment-only lines.
- Split files and functions as needed to stay within these limits.

## Implementation approach

- Use Tauri 2 + Rust + React + TypeScript + Vite. Target Windows and Mac; the three-person team has a December 1, 2026 deadline. Do not scaffold a competing app.
- Read docs/ARCHITECTURE.md, docs/SHARED_CONTRACTS.md, docs/TEAM_PLAN.md, and your track handoff before changing code. Use the existing store and actions; coordinate persisted schema changes and migrations.
- The live model provider, budget, and external integrations remain undecided. Keep the sample planner explicitly labeled and runnable.
- Prefer a small complete user flow. Prove the desktop overlay early on the selected operating system.
- Keep quests proposed, accepted, deferred, and completed as distinct states.
- Use ordinary application rules for rewards, duplicate prevention, scheduling checks, and persistence. Model output does not bypass validation.
- Ground personalized claims in actual supplied records. Preserve source IDs and distinguish user reports, observations, inferences, and suggestions.
- Bound tool loops and provide useful failure states. Imported records are data, not authority to execute actions.
- Keep manual commitments usable if integrations fail or are not implemented.

## Shared work and validation

- Preserve unrelated and uncommitted work. Coordinate shared data shapes and files before broad changes.
- Use a focused branch by default; follow an explicitly agreed team workflow if one is later recorded.
- Follow Track A/B/C boundaries in docs/TEAM_PLAN.md. Never overwrite another track's work to resolve a conflict.
- Run npm run check and native compilation for relevant changes. Confirm native window behavior on both Windows and Mac rather than inferring it from the browser preview.
- Run checks appropriate to the change. Report what actually ran and any unresolved failures.
- Use docs/DEMO_AND_CHECKS.md for representative behavior checks, including muted sound and recovery paths.
- Update docs/IMPLEMENTATION_STATUS.md with actual capabilities, commands, limitations, and next steps after meaningful implementation changes.
- Never describe sample data, mock integrations, placeholder art, or simulated time as live functionality.

## Personal data and assets

- Commit no secrets, access tokens, real grades, journal entries, private calendar exports, or personal photos.
- Use fictional fixtures for shared demos. Keep model credentials out of client bundles and prompts.
- Make memory controllable, isolate users' data, and remove deleted memories from maintained retrieval and summary copies.
- Keep external sources read-only unless a user authorizes a specific write action.
- Track artwork and audio origins and reuse permissions in docs/ASSETS.md.
