# Continue: native UI regression tests and push gates

## Copy-ready continuation prompt

Work from the latest local and GitHub main for Inova, using the primary checkout:

`C:\Users\creat\Desktop\school\Scope Final Project`

Read AGENTS.md, README.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, docs/MAIN_CONSOLIDATION.md, docs/ARCHITECTURE.md, docs/SHARED_CONTRACTS.md, docs/TEAM_PLAN.md, and the Track A handoff. Inspect the working tree and latest commits first. Preserve unrelated work and use a focused branch. Do not blindly merge old worktrees: their changes have already been consolidated, and some old builds cannot read current schema-v2 saves.

The user wants the native UI presses and quit/relaunch checks previously performed by the assistant to become repeatable, version-controlled automated tests that must pass before sharing changes. Implement this work; do not merely describe a possible testing setup.

### Verified starting point

At this handoff, local main and origin/main matched `a661da0` (November 23, 2026). The primary checkout was clean before adding this documentation. Recheck because main may advance.

Main already contains:

- Native X and floating Settings > Quit Inova, backed by one bounded shutdown controller.
- A three-second combined wait for pending state mutations and placement saves, with retry after native quit failure.
- Rust native window teardown followed by Tauri's last-window exit. Keep this ordering: AppHandle.exit(0) previously produced Chrome_WidgetWin_0 error 1412 even though its exit code was 0.
- Completed-quest grouping, newest-first ordering, outside-click/focus-loss board dismissal, and stable floating canvas width.
- Approved sit/breathing/seated tiredness, schema-v2 four-slot wardrobe, and startup feedback. Preserve them. Update November 26: the v36 loaf is approved and its timer runs (branch `test/native-float`). The floating dog also passed a manual Mac run using the isolated profile `src-tauri/tauri.playtest.json` ([checklist](NATIVE_FLOAT_CHECKLIST.md)); reuse that profile for automated native tests.

The consolidation record reports 65 passing tests in 14 files, frontend checks/build, and Windows native release compilation. These are inherited recorded results, not a fresh native walkthrough of consolidated main. Existing native captures in docs/evidence/reliable-quit predate consolidation.

Current automation:

- `npm run check`: size checks, TypeScript, Vitest, frontend production build.
- `npm test` is intentionally restricted to src; do not let nested worktrees or local backups inflate discovery.
- `.github/workflows/check.yml`: push/pull_request jobs on windows-latest and macos-latest, running npm ci, npm run check, and native compilation.
- No versioned native UI runner, native UI workflow job, or repository pre-push hook has been implemented for this request yet. Do not describe these as already enforced.

### Promote the local native checks into a real suite

Useful exploratory helpers are still available on the original Windows workstation under:

`C:\Users\creat\Desktop\school\Scope Final Project\.worktrees\main-integration\.tools`

Relevant files: verify_quit.ps1, native_uia.ps1, native_window.py, seed_quit_check.py, state_hash.py, capture_quit_stderr.py, and the JSON/log captures. That old checkout is a preserved snapshot, not the place for new functional work. The helpers are ignored local files, not available in a fresh GitHub clone, and are not a production-quality test suite. Inspect and adapt them rather than copying them unchanged.

Their known limitations:

- Hardcoded executable paths, window titles, positions, and sleeps; initial fixtures used the old save schema.
- Some actions required proper native focus, and outside-dismiss behavior could invalidate a previously found control. Use bounded readiness waits, fresh accessible locators, and explicit state assertions.
- Do not select a process only by the shared name inova.exe. Own the launched process handle/PID and clean up only that instance.
- The store may reformat JSON on exit. Compare canonical parsed data rather than raw file bytes for progress preservation.
- No dependency on Pillow or Python should be assumed unless it is deliberately declared and installed. Prefer a small, documented toolchain already supported by CI.

Use the actual compiled Tauri executable and native accessible controls, not a browser preview pretending to prove desktop behavior. Windows UI Automation worked locally: InvokePattern for normal buttons, ExpandCollapsePattern for aria-expanded buttons, ValuePattern for inputs when applicable, and the operating-system SC_CLOSE path for the native X. Prefer accessible names and state checks to screen coordinates. Keep every test bounded and emit a useful failure report.

Version the runner, valid fictional fixtures, isolated Tauri test configuration, and documented commands. Use a dedicated application identifier/data directory so tests cannot read or overwrite a user's real profile. Refuse to reuse a live conflicting test instance. Capture stdout/stderr, exit code, failed-case diagnostics, and screenshots when available. Write generated artifacts into an ignored directory. Release locks and test-owned processes in finally blocks, including on test failure. Do not hide genuine errors or turn unavailable desktop automation into a passing test.

### Required native coverage

Start with the scenarios previously verified manually, then add the related UI behaviors that the existing pure tests cannot establish:

1. Home X: make a real persisted UI change, move the native home window, request the native close, require a successful process exit, relaunch, and verify progress and home placement.
2. Floating Quit: enter floating mode, open Settings, assert Quit Inova is visible, enabled, and within native bounds, activate it, and require full process exit. Relaunch and verify progress plus independent home/floating placement at the current zoom.
3. Cleanup diagnostics: both quit paths must have exit code 0 and no Chrome_WidgetWin_0 class-unregistration warning. Capture other unexpected stderr as a failure or explicitly classified diagnostic; do not globally silence it.
4. Recovery: a locked placement file must not trap quit or replace the last valid save; minimized close must retain valid placement. Keep the existing fake-timer unit tests for truly stuck queues, repeated quit requests, and retry after native exit failure. Do not claim a native OS I/O hang was tested when only a unit mock was used.
5. Quest-board UI: Completed starts collapsed, expands/collapses together, supports keyboard interaction, updates after completion, keeps completion feedback accessible, and lists new quests above older ones. Test normal, all-completed, and empty states. Inside interactions stay open; outside clicks, Escape, and focus loss dismiss as intended.
6. Native layout: toy open/close keeps the dog/control positions steady and avoids clipping. A final screenshot alone cannot prove the absence of a one-frame shift: preserve a separate frame-capture regression or clearly state that frame-level coverage is still manual. Browser geometry assertions are not native compositor proof.

Keep audio-muted feedback meaningful. Identify which tests are Windows-only. Preserve Mac build/unit checks and add actual Mac native coverage only when it can be implemented and executed honestly.

### Make failures block sharing

Provide one explicit verification command for contributors. Add a versioned, opt-in/installable pre-push hook or equivalent local gate that runs the appropriate required checks and propagates failures. Do not overwrite an existing hooksPath or unrelated hooks without preserving them. Test the gate with an intentionally failing test, confirm that no remote refs are changed, restore the failure, and rerun the passing path.

Also add suitable CI checks and upload failure artifacts. Validate whether the selected Windows runner provides the necessary native UI facilities; do not assume local success proves GitHub-hosted UI execution. If a desktop-capable/self-hosted runner is needed, document the exact requirement and make its missing setup explicit. Do not silently skip native tests while reporting the required check as successful.

Explain the enforcement boundary accurately: a local hook can stop a local push but is bypassable; GitHub checks usually run after a feature branch is pushed. Required status checks on protected main are the server-side safeguard against merging untested changes. See GitHub's official ruleset/status-check documentation before configuring it. Repository rules are an external setting, not something a workflow file alone enables.

The last read-only `gh auth status` check found an invalid stored token for JBarmada; Git-over-SSH fetch works. Do not claim branch protection is active without reading/verifying it. If changing GitHub rules needs owner access, first finish the concrete runner/workflow/hook changes and tests, then report the precise remaining setting and access needed. Do not publish unrelated app changes or change repository rules merely to work around failed checks.

### Completion evidence and handoff

Run npm run check, relevant native compilation, the real native UI suite, and its intentional-failure check. Update implementation status and contributor/setup documentation. Clearly separate fresh local results, inherited captures, unexecuted GitHub workflow changes, and Mac limitations. Follow the maximum 250 code lines per authored file and fewer than 75 code lines per function, including test helpers.

Always finish with the exact PowerShell cd and run/test commands for the checkout containing the changes. The currently valid app launch commands are:

```powershell
cd "C:\Users\creat\Desktop\school\Scope Final Project"
$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"
npm run desktop
```

The new native-suite and push-verification command names are for you to implement and document; do not present nonexistent scripts as runnable today.
