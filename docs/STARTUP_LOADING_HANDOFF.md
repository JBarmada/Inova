# Continue startup timing and pixel loader verification

Checkpoint: November 23, 2026. Main inspected locally at `a661da0` (Consolidate reliable quit, startup feedback, and latest wardrobe controls on main). Local `origin/main` points to the same commit. A live remote check was blocked by network permissions in this session.

## Paste this into the next AI chat

> Continue the Inova startup investigation. The user reports a blank app window for about 30 seconds and wants a cute pixel loading screen. Read AGENTS.md, README.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, docs/MAIN_CONSOLIDATION.md, this handoff, and the relevant artwork/architecture documents. Inspect current main and preserve other chats' changes. Do not reapply the old startup-loading worktree over main: the startup draft has already been consolidated alongside newer wardrobe, pose, breathing, and reliable-quit work.
>
> First measure startup instead of assuming the reported 30 seconds is normal loading. Compare cold/warm native release launches and development launches, recording navigation/module loading, save loading, native window setup, and UI readiness separately. Keep real user saves intact; use a separate test identifier/profile for synthetic fixtures and run one instance per profile. Distinguish time before webview navigation from renderer timings, and distinguish observed results from source-level inferences.
>
> Review the existing HTML-first loader, which must appear before the main JavaScript finishes loading. It reuses the approved Pocket Pup sitting/breathing frames, crisp integer scaling, stepped animation, paw dots, and reduced-motion support. Prefer these approved assets to unrelated internet artwork. Verify its first visible frame, animation, slow-start message, Retry action, and transition into the app. Test initialization failures without replacing saved data. Do not add artificial waiting time or fake percentage progress.
>
> Use the timing evidence to fix any actual startup bottleneck. If the 30-second delay does not reproduce, report that explicitly and leave actionable diagnostics for the user's next launch. Run npm run check and appropriate native compilation, perform Windows runtime checks, and report Mac coverage honestly. Update implementation status, asset provenance if assets change, and this handoff with measured evidence. Follow the existing code limits: at most 250 nonblank/noncomment lines per code file and fewer than 75 per function. Coordinate shared/native files with concurrent work. Integrate only reviewed, verified changes into main.

## What is already on main

- `index.html`: initial loader markup, approved-art image preloads, startup stylesheet, and a small classic script before the React entry.
- `public/startup.css`: 192px rendering of 64px approved sitting/breathing art (3x scale), stepped 2.8-second breathing, animated paw dots, and reduced-motion handling.
- `public/startup.js`: HTML-ready performance mark, an 8-second slow-start message, and a 30-second Retry button that reloads the page. These timers do not delay initialization or claim percentage completion.
- `src/main.tsx`: retains the loader while initialization runs; mounts the app afterward and distinguishes save failures from other startup failures.
- `src/services/startup.ts`: runs save loading and native setup concurrently, reports the remaining phase, and gathers durations.
- `src/services/startupDiagnostics.ts`: logs timing values and saves the latest successful native startup timings in `startup-diagnostics.json` through the existing Tauri store plugin. It does not copy save contents into that diagnostic file.
- `src/services/startup.test.ts`: checks waiting for both initialization phases and identifying window-setup failures.

## Evidence and limits

Source inspection confirmed the original empty-root path: the old main entry waited for both `initialize()` and `initializeDesktop()` before rendering anything. It did not prove a 30-second duration or identify a specific slow native call.

The consolidated main status reports 65 passing tests in 14 files, TypeScript/source-size checks, the frontend production build, and a Windows release build. Those results were recorded by the consolidation work; this chat did not rerun them. No startup screenshot, cold/warm native measurement, or Mac startup check was completed by this chat.

The initial isolated dependency-install/check command was rejected before execution because automatic approval review hit the workspace owner's spend cap. This was a review availability failure, not a determination that installation was unsafe. Do not bypass approval controls; resolve the workspace limit before repeating blocked actions.

## Interpreting the timings

- All fields use milliseconds. `modulesMs` is navigation-to-entry execution after imports resolve; it is not just module download time.
- `saveMs` and `windowMs` are independently measured task durations, running in parallel.
- `readyMs` is navigation-to-both-tasks-complete; `uiReadyMs` is navigation-to-the React readiness effect. Neither measures process launch before navigation, and the latter is not proof of the first displayed frame.
- The diagnostic record is written only after successful app readiness. A hang before readiness may leave an older record or no record; do not treat that as fresh evidence. Consider bounded phase-start diagnostics if needed to locate a hang.
- Time spent compiling Rust before the window exists is a separate development startup cost. A blank existing window may instead involve Vite/module loading, save/plugin IPC, geometry setup, or webview/rendering; measure before assigning blame.

## Current stopping point

The user requested a continuation prompt in the repository and asked this chat to stop. No further functional startup changes should be inferred from this handoff. The stale local draft remains under `.worktrees/startup-loading` on `fix/startup-loading`; main is the continuation source of truth.
