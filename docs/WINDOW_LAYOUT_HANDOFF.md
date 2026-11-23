# Isolated Window Layout Fix

Branch: fix/window-layout. Worktree: .worktrees/window-layout under the shared project folder.

Integration update, November 23, 2026: the user approved integrating the reviewed UI into main. Main now contains this branch's complete companion/layout/toy work and separate Wardrobe/Memories pages. Earlier warnings below describe how the isolated branch was prepared; they do not mean this approved integration is pending. The original shared checkout and the other chat's unfinished frame/art work remain untouched. Continue integration work from main rather than reapplying these commits.

## Scope

Fix floating page scrollbars and excess space. Remember home and floating positions separately, restoring home size and maximized state as well. Persist placement between launches without mixing it into personal app state.

## Collaboration boundary

The first local commit is a snapshot of existing shared UI context so this work can compile with the already-pending controls and bone toy. It is not a request to replace or publish the other chat's changes. The subsequent layout-fix commit contains the actual isolated delta. Integrate that commit onto the completed shared UI work, resolving only its small hooks in App.tsx, main.tsx, styles.css, and Tauri capabilities. Do not merge the snapshot as a replacement for newer UI work.

The shared checkout's earlier window-layout edits were taken back out after copying them into this worktree. Its prior controls, settings, bone toy, art, and tools remain there. Do not copy entire source folders over the other chat's current files.

## Source files

- src/services/desktop.ts owns native mode switches, geometry capture/restore, and move/resize/close listeners.
- src-tauri/src/floating.rs exposes resize_floating, grouping physical position and size in one main-thread task; lib.rs registers it. Integrate these native files with the viewport-based companion CSS to avoid the intermediate shifted frame. Restart/rebuild the native app after integration.
- src/services/windowGeometry.ts owns layout validation and monitor clamping.
- src/services/windowLayoutStorage.ts serializes writes to window-layout.json.
- src/features/companion/useFloatingLayout.ts observes actual floating content height.
- src/styles-window.css scopes scrolling and quest-popup layout changes.
- App.tsx attaches the sizing ref; main.tsx initializes desktop geometry; capabilities grant only the required extra window operations.

## Checks

All twenty-three tests, type checks, source-size checks, and the frontend build pass. Windows native release compilation also passes in this worktree. Automated checks cover independent positions across repeated switches, restore from persisted placement, storage failure before switching, content-size fitting (including expanded toy width, zoom in/out, and OS scaling), maximized home, disconnected-monitor recovery, and negative-coordinate monitors. These use mocked native APIs, so actual dragging, DPI changes, maximized restoration, and native scrollbar behavior must also be tried on Windows and Mac.

The subsequent quest-toy revision replaces the single-quest CSS prototype with generated artwork and a complete list/composer. See [toy integration notes](QUEST_TOY_ART.md). Integrate its focused delta after the window-layout fix; preserve the other chat's dog renderer and newer controls.

## Manual review

1. Run this worktree's app. Move and resize home; enter float.
2. Move the dog elsewhere; return Home. Confirm home position/size.
3. Enter float again. Confirm the dog returns to its last position.
4. Open/close the quest toy and toggle status/developer controls. The window fits the content without outer page scrollbars.
5. Close and relaunch. Home should return to its remembered placement; the next float should return to its own location.
6. Repeat with maximized home, another monitor, and a changed monitor arrangement.

Desktop builds must use this worktree's own target directory rather than sharing the other chat's build artifacts.

This worktree keeps the same application identifier and local data location. Run one native Inova instance at a time during manual review; the worktree isolates source/build files, not application data.
