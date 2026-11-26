# Floating dog native results: Mac

November 26, 2026. macOS 15.6.1, Apple M4, built-in display. Branch `test/native-float`, which includes the v36 loaf. Debug build via `npm run tauri dev -- --config src-tauri/tauri.playtest.json`, with an isolated `com.inova.nativefloat` profile and a fictional dog. The steps are in [NATIVE_FLOAT_CHECKLIST.md](../../NATIVE_FLOAT_CHECKLIST.md).

A person observed each step by hand. Claude Code launched the app, checked the process exits, and read the saved files. The terminal had no Accessibility permission, so window positions come from the saved `window-layout.json` rather than live window queries.

| # | Step | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Adopt | Pass | Saved `pet.adopted: true` |
| 2 | Float | Pass | Observed |
| 3 | Transparency | Pass | [Screenshot](floating-transparent.png): the dark area is the VS Code window behind the dog. No `macOSPrivateApi` setting was needed |
| 4 | Always on top | Pass | Observed over VS Code and Safari |
| 5 | Drag | Pass | Saved floating position x0, y222 (384×301) |
| 6 | Controls and quest toy | Pass | Observed |
| 7 | Home/float round trip | Pass | Observed; separate home and floating positions saved |
| 8 | Floating Quit Inova, relaunch | Pass | Exit code 0, no `inova` process left; adoption and both positions restored |
| 9 | Home close button, relaunch | Pass | Exit code 0, no process left; home saved at x1658, y424 and reopened there |
| 10 | Loaf while floating, muted | Pass | Bend → tuck → loaf, then Stand |

Not tested: other Spaces, fullscreen apps, external monitors, Retina/non-Retina switching, a release `.app` bundle (only built, not run), and audible sound.
