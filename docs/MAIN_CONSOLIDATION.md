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
