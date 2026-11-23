# Pocket Pup integration handoff

## Main integration update — November 23

The user approved v34 grounded breathing and integration into main. The branch was safely advanced to main `2dd9b1e`, preserving current main navigation, quest toy, completed-adventure grouping, wardrobe/memories split, and native layout. Only the dog renderer, presentation hooks/assets, pose control, test-scan scope, and related documentation are added; the inherited old App/shared-state files are not used to overwrite newer main work.

Breathing now uses exact v34 PNGs in `public/dog/breathing/`, with a 2.8-second cycle, fixed paws, neck-following bandana, and reduced-motion handling. Asset provenance/timings are in `public/dog/manifest.json`. `npm run check` passed with 31 tests in seven source test files and a production build; the test command scans `src` to exclude nested worktrees/backups. Windows release library compilation passed. The browser showed the updated navigation, wardrobe/bandana, manual pose control, and breathing URLs progressing from rest to exhale. Windows native runtime and Mac build/runtime remain unverified for this integration.

Next: posture-preserving facial mood changes, tired sit → loaf after seven seconds, and sit → stand. Each needs user review of a GIF or transition state before moving on. They are not included in the approved main integration. Historical worktree notes below describe the earlier checkpoint.

November 23, 2026. Isolated branch: `codex/pocket-pup-integration`.

## Behavior

- Adoption, companion, and wardrobe use transparent 64 by 64 Pocket Pup PNGs. Home renders at 3x; floating mode at 2x, with nearest-neighbor scaling.
- After adoption, eight seconds at idle triggers the approved 160ms v32 tuck, then holds the approved sit. No body resizing, looping GIF, or unfinished lying/sleeping sequence is used.
- Sit replays the transition. Stand up immediately returns to neutral and restarts the idle delay; there is no stand-up animation.
- Sit after happy/tired uses the existing mood action to return to idle. Mood changes and leaving the view cancel old pose timers.
- Reduced motion skips the tuck. Manual controls use the shared sound preference; automatic sitting makes no click sound.
- Bandana is a separate layer with standing/seated anchors. Notebook remains a provisional pixel prop. Ownership and rewards are unchanged.
- Images preload before playback. Failure shows a reload message and disables playback; the original SVG remains an error fallback.

Poses are transient presentation state. Shared schema, persistence, quests, and reward rules have no integration-specific changes. Developer controls remain behind dev mode; Sit/Stand is a normal pet interaction.

## Assets and run instructions

`public/dog/manifest.json` records sources and SHA-256 values. Neutral/tuck/sit are byte-for-byte copies of `art/pocket-pup/v32/00.png`, `01.png`, and `02.png`. Happy/tired/bandana use earlier reference-sheet assets. Rebuild assets with `python tools/export_runtime_art.py` using Pillow. Read [ARTIST_GUIDE.md](ARTIST_GUIDE.md) before changing sprites.

Run `npm run desktop` for Tauri or `npm run dev` for the browser. Dependencies currently use a junction to the original checkout's `node_modules`; a separate clone should use `npm ci`.

Verified production preview: `http://127.0.0.1:4173/`, running via `npm run preview -- --port 4173 --strictPort`. Its fictional profile is separate from desktop data and contains Mochi, a demo drawing commitment, three sample quests, and sample unlocks.

Try adoption, wait eight seconds, replay Sit/Stand, then equip notebook/bandana and repeat with sound muted. Developer mode exposes mood tests. Reduced-motion preference should skip the tuck. Native transparency, dragging, hover controls, and equipment layout still require hands-on Windows/Mac verification.

## Verification performed

- `npm run check` passed: size limits, TypeScript, 13 tests, and production build. Five new tests cover timed playback/hold, interruption, disposed callbacks, reduced motion, and mood precedence.
- Windows `cargo build --release --lib --locked --offline --manifest-path src-tauri/Cargo.toml` passed, reusing the original target cache without replacing running executables. This is library compilation, not a rebuilt executable, installer, or runtime demonstration.
- Browser observed: adoption, automatic/manual sitting, happy/tired, sit after mood changes, visible feedback while muted, fictional quest rewards, notebook/bandana on sitting, and adoption/equipment persistence after reload.
- Asset export checked binary transparency, 64 by 64 canvases, and exact source copies. No new third-party dependency.

Windows native overlay behavior and all Mac compilation/runtime behavior remain unverified. Recorded bark, final item art, more breeds, and later animation chains are unfinished.

## Isolation and review

The worktree was created from source HEAD, then received a copy of the current uncommitted `src`, `docs`, `art`, and `tools` baseline to retain existing UI/settings. `.tools/inherited-working-tree.txt` records inherited paths. Original source files and running app processes were left intact. Changes remain uncommitted for review; nothing was merged or pushed.
