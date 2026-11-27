# Main consolidation — November 23, 2026

Use `C:\Users\creat\Desktop\school\Scope Final Project` on `main` for ongoing functional work. Run `npm run desktop` here. The source worktrees remain untouched for recovery; their dirty files were copied, not removed. They are historical snapshots and should not be merged blindly again.

| Source | Disposition |
| --- | --- |
| floating-toy-frame-fix | Committed history through quest-board organization was already in main. |
| pocket-pup-integration | Approved sit/breathing/seated tiredness was already in main. Merged v36 art preview, keeping unapproved runtime behavior disabled. |
| nested wardrobe-slots | Merged both commits plus all seven pending files. Kept newer main posture/face/breathing behavior and combined its anchors with the four clothing slots. |
| bone-toy | Original prototype was superseded by main's illustrated multi-quest toy. Kept the newer implementation; original branch remains recoverable. |
| main-integration | Copied all pending reliable-quit code, tests, architecture/contracts/checks, and native evidence. |
| nav-toy-icon | Already incorporated into main. Clean source checkout. |
| startup-loading | Copied all pending startup screen, orchestration, diagnostics, and tests. |
| window-layout | Already incorporated into main. Clean source checkout. |
| original root checkout | Its old settings/UI/art changes are already represented or superseded in main. Preserved the full tracked/untracked state in the named Git stash below. All its previously untracked paths exist in main. |

Recovery checkpoint: `git stash list` contains **Preserve original root checkout before main consolidation 2026-11-23**, based on `fix/desktop-mode-notice` at `d5a08ff`. Restore it only onto its original branch or a recovery checkout, because applying it to current main would reintroduce old UI and schema code. No worktrees or branches were deleted.

Validation freshly ran in the primary folder: `npm run check` (65 passing tests, types, size limits, production build) and `npm run tauri build -- --no-bundle` (Windows release executable). The wardrobe integration tests now explicitly check that seated moods retain seated anchors. Native runtime interactions, audible output, and Mac behavior were not rechecked. Existing evidence directories retain their original provenance.

Four-slot wardrobe upgrades validated old saves to schema v2 on a successful mutation; older app builds cannot read those v2 saves. Avoid running old worktree app versions against the same desktop save. New wearable items are still developer fixtures with provisional graphics; AI remains the labeled sample planner. Loaf motion remains a review artifact.

## November 26 — integrated local test candidate

Fetched origin/main at 851ca60 and origin/test/native-float at 4d93008. Checkpointed the current wardrobe/chat/AI work in 868f547. Reconciled the teammate's v36 loaf integration (its art is byte-identical to the existing loaf-tired frame), ported the useful regression cases to current playback, retained the v37 review-only assets, native playtest config, Mac evidence, and Windows checklist. The wardrobe-improvements branch's preview helper and tests are identical to the current implementation and its combined try-on UI is already present. The older animation-buildout and root animation-review runtime are superseded by the richer current playback; the original root's unapproved Pixel Engine studies, prototype mobile site and other dirty work are preserved there, not silently enabled. The Nov 23 table above records earlier worktree reconciliation.

Local candidate passed npm run check (467 app / 4 preview tests, 20 clips, walk hashes, size, types, production build) and two offline Windows Rust library tests (loopback permission required). Hosted index references the identical production bundle and the AI bridge reports Gemma 3 4B available. Mac evidence belongs to the teammate's earlier branch. No remote push until the user approves the candidate.

Use the inova-complete worktree for testing; the primary checkout is on the older animation review branch and is intentionally untouched.
