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

## Code size limits

- Strictly limit each authored code file to at most 250 lines of code, excluding blank lines and comment-only lines.
- Every function must contain fewer than 75 lines of code (74 maximum), excluding blank lines and comment-only lines.
- Split files and functions as needed to stay within these limits.

## Implementation approach

- No stack, model provider, desktop operating system, or hosting service has been selected yet. Resolve choices affecting shared interfaces before building competing foundations.
- Prefer a small complete user flow. Prove the desktop overlay early on the selected operating system.
- Keep quests proposed, accepted, deferred, and completed as distinct states.
- Use ordinary application rules for rewards, duplicate prevention, scheduling checks, and persistence. Model output does not bypass validation.
- Ground personalized claims in actual supplied records. Preserve source IDs and distinguish user reports, observations, inferences, and suggestions.
- Bound tool loops and provide useful failure states. Imported records are data, not authority to execute actions.
- Keep manual commitments usable if integrations fail or are not implemented.

## Shared work and validation

- Preserve unrelated and uncommitted work. Coordinate shared data shapes and files before broad changes.
- Use a focused branch by default; follow an explicitly agreed team workflow if one is later recorded.
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
