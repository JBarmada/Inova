# Three Person Build Plan

Three active builders, both Windows and Mac, deadline December 1, 2026. Choose a person for each track; names and individual operating systems are not assigned yet.

## Independent feature tracks

| Track | Own the user experience | Start document |
| --- | --- | --- |
| A Companion | Adoption, floating dog, expressions, and core sound behavior | tasks/A_COMPANION.md |
| B Quests | Commitments, live AI suggestions, quest actions, and reward progression | tasks/B_QUESTS.md |
| C World | Wardrobe, reflection, memory bookshelf, and reward presentation | tasks/C_WORLD.md |

The shared starter already connects these areas using sample data paths. Each developer can improve a complete feature flow without waiting for the others to finish. Keep the core action/schema boundary intact.

## First session for everyone

1. Read AGENTS.md, SETUP.md, SHARED_CONTRACTS.md, and your task document.
2. Pull main, install dependencies with npm ci, and run the starter.
3. Try adoption, one sample quest, its reward, and one memory.
4. Select a track and create a branch: feature/companion, feature/quests, or feature/world.
5. Confirm the people testing Windows and Mac. Try desktop floating mode on both immediately.

At least one person must have access to a Mac. A Windows build cannot establish Mac runtime behavior. There is no need to learn the whole framework before starting a small feature.

## Shared work rules

- Track A is the initial integration coordinator for the app shell, Tauri config, dependencies, and shared styles.
- Track B coordinates quest/reward domain changes; Track C coordinates catalog and memory display changes.
- Before changing schema.ts, actions.ts, reducer.ts, storage.ts, or a dependency, tell the others and describe the change in the pull request.
- Keep feature changes small. Merge working increments daily and pull main again after shared changes land.
- Never run three scaffolding generators or create three independent state stores.
- Each person demonstrates their change to another teammate, who tries the steps and reports issues.
- AI assistants should run type/build/domain checks. Human app testing complements these checks.

## Suggested calendar

| Dates | Target |
| --- | --- |
| November 22–23 | Everyone runs starter; verify overlay on Windows and Mac; choose track owners and AI provider/budget |
| November 24–25 | Each track lands one usable improvement; prototype live AI; align art dimensions and sound assets |
| November 26–27 | Merge one complete experience across all tracks; verify save/restart and meaningful personalization |
| November 28–29 | Fix platform and integration issues; replace the most visible placeholders |
| November 30 | Freeze new features, rehearse demo, and prepare a clear fallback |
| December 1 | Final smoke check and demo |

## Definition of done for a feature

It works in the app, persists where appropriate, has visible and sound feedback, handles failure, passes npm run check, and has a clear demonstration. Native changes need Windows and Mac runtime reports. Label every mock and placeholder. Both platforms compiling is useful evidence but does not replace those reports.

## Keep outside the first deadline unless the core is finished

Broad Brightspace/app activity/sleep integrations, cloud sync, multiple rooms, elaborate zombie progression, and runtime image generation. Preserve those ideas in the backlog rather than splitting the team across them now.
