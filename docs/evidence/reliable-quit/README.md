# Reliable native application quit

Implemented from local main `2dd9b1e` on `codex/reliable-quit`, November 23, 2026. Tests used the main-integration checkout and fictional profile `com.inova.quit-test`, with the native title Inova Quit Test. Other running Inova instances and profiles were not modified.

## Reproduction and cause

The baseline native Windows app remained alive with its window present after two native title-bar-close commands (WM_SYSCOMMAND / SC_CLOSE), each followed by a three-second process wait. This is the operating-system close path used by the window's X, rather than a mocked browser close.

The installed @tauri-apps/api/window.js onCloseRequested wrapper awaits the application handler and calls destroy() if the event was not prevented. The original application handler prevented the first event, saved placement, and re-issued window.close(). Its second invocation returned without preventing the event, letting the wrapper call destroy(). The capability allowed close but not destroy.

A test-only build with identical application source and only core:window:allow-destroy added exited on the first close request in 0.06 seconds. This confirmed the missing destroy permission, rather than missing allow-close, was the immediate failure. See baseline.json and permission-probe.json. That additional permission is not shipped by this fix.

## Implementation

Both native X and floating Settings > Quit Inova call quitDesktop(). The controller shares concurrent quit requests, stops new state dispatches, waits for the existing state queue and queued placement save, then invokes a main-window-only Rust quit_app command to destroy the native window. Tauri's default last-window behavior then exits the process after the webview is torn down. The close event is always prevented, so the recursive close/destroy-helper path is not used.

The combined save wait has a three-second deadline. Rejected or stuck saves do not prevent exit. The previous persisted data remains the fallback; pending unsaved work cannot be guaranteed against a stalled disk. Native exit errors re-enable mutations and permit retry. Unit tests cover all of these cases and late completion without a second exit.

Floating Settings fits a taller canvas to keep the new button visible. The width remains stable. Zero-sized minimized geometry falls back to the previous valid placement. A separate relaunch test found a pre-existing 73-physical-pixel floating-position drift at the current zoom; mode entry now uses the same CSS-to-logical conversion as content fitting, eliminating that drift.

## Verified results

`npm run check` passed 34 tests, source size checks, TypeScript, and the production frontend build. Windows compilation passed with:

```powershell
npm run tauri build -- --debug --no-bundle --config .tools/quit-test.json
```

The ignored test config overrides only the application identifier and native window title, with the same window properties and production permissions. It does not include the permission-probe change.

Native verification used OS close commands and Windows UI Automation to activate real application controls. Process termination was confirmed with process handles. The fixture included adoption, settings, commitments, proposed/accepted/deferred/completed quests, reward records, and inventory; a real UI action equipped the notebook. Canonical JSON hashes confirmed semantic progress was unchanged across quit/relaunch, independent of the store plugin's JSON formatting.

The final native results are in native-results.json:

- Home X fully exited; saved home position (640,180) was restored on relaunch.
- Floating Quit was visible and inside the native window: button bottom 683, window bottom 760 physical pixels. It fully exited the process.
- Floating placement (1049,250) and progress were restored on relaunch without the prior 73-pixel drift.
- Native close while floating fully exited.
- Holding the placement file open with write access denied caused its final save to fail; the app still fully exited, and the last valid placement file and saved progress were retained.
- Minimizing before closing fully exited while retaining valid home placement.

The five final process-exit checks completed in under 0.5 seconds each, including helper overhead. This is a focused test result, not a latency guarantee. Stalled-queue timeout behavior is verified with fake-timer tests; no native operating-system I/O hang was induced.

No Mac runtime test or new release build was performed. This native debug run does not establish Mac behavior.

## Chromium cleanup-warning follow-up

The user reported Chrome_WidgetWin_0 class-unregistration error 1412 when quitting in either mode. Capturing stderr reproduced the exact warning with AppHandle.exit(0), despite a successful process exit code of 0. A similar shutdown warning is discussed in [Tauri's upstream Q&A](https://github.com/orgs/tauri-apps/discussions/3555).

The native command now calls the Rust window.destroy() method after the shared save controller finishes. This bypasses the recursive frontend close helper, requires no frontend allow-destroy permission, and lets Tauri's installed runtime exit normally once its final window is destroyed. The current application has one window; adding windows must revisit this lifecycle assumption.

Both native home X and floating Settings Quit were tested again with stderr capture. Each exited with code 0 and an empty stderr log. The native quit/relaunch suite was also repeated, including data/placement retention, locked placement-save failure, and minimized close. See cleanup-captures.json and the refreshed native-results.json. Windows debug compilation passed. Mac behavior remains unverified.
