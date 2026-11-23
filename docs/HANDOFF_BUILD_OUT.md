# Build-out handoff — November 23, 2026

## Current checkpoint — November 23, 1:45 p.m. Pacific

This section supersedes conflicting statements in the earlier handoff below. Work remains in `.worktrees/inova-complete` on `codex/inova-complete`. The primary checkout and its uncommitted animation work were preserved. A snapshot was reconciled in `.worktrees/animation-buildout` and integrated into the buildout for testing; do not overwrite the primary checkout. The buildout commits through `0be1ea3` were pushed to the existing `origin/codex/inova-complete` branch after GitHub verified that the connected account owns the repository and has push access. The repository is public; review future additions accordingly.

The desktop Quests page and floating toy share a single input. Local AI proposes a quest and, when supported by exact source text, optional effort and a deadline with an explicitly stated time. The user reviews those details before saving. A date without a time is not assigned one; use More options for manual entry. The sample fallback is labeled. A direct fictional Ollama trial with Gemma 3 12B extracted both details; 4B missed the deadline. These are limited trials, not reliability claims. The local service was running at this checkpoint; check its current state rather than assuming it persists.

Twenty animation clips are present, with a Dev-mode preview selector, sleep/wake playback and selected automatic reactions. All 20 atlas dimensions are now checked by `npm run check`; 140 tests and the frontend build passed. Windows `cargo check` passed after the latest Rust edits; the animation integration also passed a release build before subsequent planner edits. The integrated clips, wearable alignment, and the quest detail review need visual testing. Automatic review blocked the attempted Windows inspection because the screen included unrelated sensitive content; do not work around that rejection. Mac remains untested.

The Tailscale browser preview returned HTTP 200 locally at this checkpoint. Its browser build uses sample fallback because the Rust/Ollama boundary and native overlay are desktop-only. For desktop testing, restart the app after backend changes; the previously used ports 1420 and 1421 may be occupied, so identify their owners before stopping anything. The user has a separate test profile; do not replace or delete it.

Next: visually review animation playback and quest review in both layouts when authorized; verify floating drag with a real mouse, timing, placement and restart; expand local-model grounding and omission tests; test mute, audible cues, duplicate rewards and recovery; and complete remaining agreed core and stretch features in dependency order. External integrations, new art approvals, Mac and unresolved product decisions remain pending. See the checklist and implementation status for details.

## Where work lives

- Isolated checkout: `C:\Users\creat\Desktop\school\Scope Final Project\.worktrees\inova-complete`.
- Branch: `codex/inova-complete`, pushed to `origin`; based on `main` at `851ca60`. This branch has not been merged into main.
- Primary checkout: at the 7:33 a.m. inspection it was `codex/pocket-pup-animation-review` at `3103109` with extensive overlapping, uncommitted art/runtime changes. Its status lists 20 approved clips, but obtain a stable reviewed snapshot and reconcile source, assets, and approval evidence before integration. Do not replace those files or cherry-pick an older draft blindly. Other worktrees were preserved.

## Run and verify

```powershell
cd "C:\Users\creat\Desktop\school\Scope Final Project\.worktrees\inova-complete"
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run desktop
```

In another terminal from the same folder, `npm run check` runs the size, TypeScript, test, and frontend build checks. The most recent run passed 118 tests. Windows release compilation passed using the isolated `.tools/native-buildout.json` identifier. That test binary uses a separate profile; use `npm run desktop` for the normal app. New optional state fields can be lost if an older build later saves the same profile; back up personal data before changing versions.

Local AI requires a running compatible Ollama service and an installed model; the sample planner works without either. This machine's ignored `.tools/ollama` contains the development runtime and models but is not pushed to Git. Setup and model commands are in [SETUP.md](SETUP.md); recorded benchmarks and failures are in [model evidence](evidence/local-models-2026-11-23/README.md). No model service was left running by the build-out work.

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
