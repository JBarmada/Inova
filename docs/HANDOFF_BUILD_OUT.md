# Build-out handoff — November 23, 2026

## Current checkpoint — November 23, afternoon

This section supersedes conflicting statements in the earlier handoff below. Work remains on `codex/inova-complete` in an isolated worktree. The branch has been pushed to the existing public repository and has not been merged into main. The primary checkout and its uncommitted work remain intact. An animation snapshot was reconciled in a staging worktree and integrated into the buildout for testing.

Desktop Quests and the floating toy use the same one-field composer. A local model proposes the quest and optional date/time and effort; extracted values require matching evidence and review. Date-only suggestions ask for a time or can be cleared. Recognizable missing or conflicting details open review; simple weekday, time and unit checks catch some mistakes but do not guarantee accuracy. The sample fallback is labeled and prompts for details when recognizable hints are missing. A small direct fictional 12B trial extracted a date-only example and a separate date/time/effort example; a 4B trial produced incorrect details. See implementation status for timings and limits. Permitted reflections are ranked by simple keyword overlap and recency, with source IDs and stale-permission checks retained.

Twenty animation clips, sleep/wake playback and selected automatic reactions are integrated. The Dev-mode selector exposes the clips for testing. Static stretch and celebration frame sheets were compared with their runtime atlases; complete visual playback and wearable alignment remain unverified. The no-dismissal-button test now includes the real shared composer, and outside-click/focus-loss tests remain in the check.

The latest `npm run check` passed 157 tests, all 20 atlas checks, type/size checks and the frontend build. The current Windows Rust library compiled in release mode with `cargo build --release --lib --locked --offline`; an earlier full release build passed for animation integration. Native visual inspection was blocked by automatic review because unrelated sensitive content appeared on screen. Do not work around that decision; arrange an authorized test with only the intended app visible. Mac compilation and runtime have not been tested.

Use the setup instructions and fictional data for testing. Enable Dev mode in Settings and select a clip on Companion to test it; restart the desktop backend after Rust changes. Browser previews use the sample fallback because the Rust planner and native overlay require desktop. Do not stop unknown processes or reuse a live profile concurrently, and do not reset or overwrite other worktrees.

Next: visually review the date-only form and animation playback in both layouts, including clothing alignment and the native date picker; verify floating drag, placement, restart and transition timing; run full fictional save/reward/recovery, mute/audible, reduced-motion and accessibility checks; expand live-model quality and injection testing; and work through remaining agreed core and stretch features. More dog variants/final art, external integrations, Mac and unresolved spooky/world product decisions remain pending. Read [BUILD_OUT_CHECKLIST.md](BUILD_OUT_CHECKLIST.md) and [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detail and historical evidence.

## Where work lives

- Isolated checkout: `.worktrees/inova-complete`.
- Branch: `codex/inova-complete`, pushed to `origin`; based on `main` at `851ca60`. This branch has not been merged into main.
- Primary checkout: at the 7:33 a.m. inspection it was `codex/pocket-pup-animation-review` at `3103109` with extensive overlapping, uncommitted art/runtime changes. Its status lists 20 approved clips, but obtain a stable reviewed snapshot and reconcile source, assets, and approval evidence before integration. Do not replace those files or cherry-pick an older draft blindly. Other worktrees were preserved.

## Run and verify

```powershell
cd "<path-to-inova-complete>"
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run desktop
```

In another terminal from the same folder, `npm run check` runs the size, TypeScript, test, and frontend build checks. The most recent run passed 118 tests. Windows release compilation passed using the isolated `.tools/native-buildout.json` identifier. That test binary uses a separate profile; use `npm run desktop` for the normal app. New optional state fields can be lost if an older build later saves the same profile; back up personal data before changing versions.

Local AI requires a running compatible Ollama service and an installed model; the sample planner works without either. Setup and model commands are in [SETUP.md](SETUP.md); recorded benchmarks and failures are in [model evidence](evidence/local-models-2026-11-23/README.md). Service state can change between sessions.

## What works in this branch

- Editable quest names and durations; proposed, accepted, deferred, dismissed and completed states; duplicate-safe rewards with a visible receipt; optional completion reflection.
- Editable, searchable bookshelf memories; user-controlled suggestion permission and removal of stale copied evidence when permission changes or memory text changes.
- Sample planner and optional local 4B/12B planner through Rust with filtered records, bounded responses, output validation and stale-context checks. The model default remains provisional; an observed 4B response arguably assumed an outline that was not supplied.
- User-entered deadlines and manually supplied free windows for accepted quests, with local conflict and duration checks; no calendar access or event creation. Explicit maximum suggested duration, seven-day recap, owned-outfit shuffle, reduced-motion setting, on-demand exploration sample, and optional private perspective exercise.
- Direct dog controls remain behind Dev mode; the quest toy dismisses by outside click, focus loss or Escape without a dismissal icon. Windows spot checks exercised the floating toy and Dev mode gate, but do not replace full native validation.

## Next priorities

1. Resolve the floating drag uncertainty with a real mouse or held-pointer automation: synthetic drags did not move the dog, while the same tool moved the decorated home window. Tauri's asynchronous drag initiation may affect the synthetic test. Verify placement after restart, screen edges and multiple displays; then retest menu resize and full transition timing.
2. Obtain and integrate the stable reviewed artwork/animation snapshot from the primary checkout without losing either side's changes. Retest wardrobe fitting, controls, motion, audio, reward reactions and the native overlay.
3. Complete an end-to-end fictional flow, especially duplicate completion attempts, saved-state recovery, muted/audible cues, accessibility and reduced motion. Mac compilation and runtime require a Mac and are still pending.
4. Verify planner feedback next to the initiating commitment in native UI and with a screen reader; the placement was changed after the stopped-service test. Expand local model evaluation for groundedness, injection resistance, latency and memory before selecting a final default. The sample remains available; structured output alone is not evidence that a suggestion is true.
5. Complete outstanding approved core and stretch work: more dog variants and interactions, final cosmetics, adulting checklists/conversations, world growth and optional integrations as access permits. Treat spooky triggers, revival rules and unselected world limits as open product decisions; never claim simulated or sample behavior is live.

See [BUILD_OUT_CHECKLIST.md](BUILD_OUT_CHECKLIST.md), [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md), [DEMO_AND_CHECKS.md](DEMO_AND_CHECKS.md), and the product documents for detailed evidence, scope, and outstanding decisions. Preserve unrelated work and the no-dismissal-button and dev-control regression checks.
