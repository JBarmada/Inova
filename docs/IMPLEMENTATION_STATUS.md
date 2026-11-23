# Implementation Status and Handoff

Shared starter checkpoint: November 22, 2026. Three builders; Windows and Mac; deadline December 1. Inspect current code before relying on this checkpoint after later changes.

## Implemented starter

- Tauri 2/Rust desktop shell with React/TypeScript/Vite interface and locked npm/Cargo dependencies.
- One window with normal home and compact transparent always-on-top mode controls; native drag-region markup.
- Isolated layout fix: separate persistent home/floating geometry, home size/maximized restoration, monitor work-area clamping, and content-fitted floating height. Floating page scrollbars are suppressed and the quest popup is kept within the window's width.
- Adoption/name, simple selectable moods, original placeholder dog art, and separate equipment shapes.
- Manual commitment entry and a labeled deterministic sample Planner interface.
- Quest proposal, acceptance, deferral, dismissal, and completion.
- Duplicate-safe completion rewards: notebook at one quest and bandana at three; one equipment slot.
- Reflection entry, dated memory buttons, readable entry view, per-entry personalization permission, and deletion.
- Shared validated state with queued mutations and local persistence adapters for desktop and browser preview.
- Click/reward synthesized tones, shared mute setting, error messages, and reduced-motion CSS.
- Entering floating mode does not leave a persistent mode-change success banner; switching errors remain visible.
- Home/Settings pixel icons replace floating text controls. Settings contains sound and persistent dev-mode toggles; manual mood controls are hidden by default. Existing saves default devMode to false. Companion status uses a small stepped pixel chip.
- The Home icon appears only in floating mode; the home interface shows Settings alone.
- Floating controls and enabled mood status reveal on dog hover or keyboard focus, remaining available during control/menu interaction. Settings adds a persistent Status bar toggle, off by default and compatible with older saves.
- Floating mode includes a generated golden bone/teal rope toy. Clicking it expands an illustrated quest board showing every non-dismissed quest, with proposed, accepted, deferred, and completed states kept distinct. The frame grows with its contents; the list scrolls internally at the screen-height limit.
- The toy board's commitment field and check button save a manual commitment and propose a sample quest. Each proposed/deferred quest has a toy-shaped Fetch action to accept it; accepted quests can be completed there using the existing reward rules. Display copy uses adventure language without changing stored records.
- Expanded floating windows fit both width and height, and clamp their placement back into the monitor work area after resizing. Escape/close collapses the board. Keyboard focus, visible feedback, and the shared sound setting remain available.
- Floating dog and toy are centered in both compact and expanded mode, with the toy below the chin. Native content fitting converts CSS pixels through the webview pixel ratio and OS scale so zoom does not clip the board or leave an oversized compact window; resize events remeasure the content. The frame's painting stays inside its own bounds.
- Toy open/close plays a short synthesized rubber-toy squeak, honoring the existing mute setting. This is synthesized sound, not a recorded squeaker.
- Feature folders and three task handoffs, with shared agreements and Windows/Mac CI configuration.

## Verified in this setup

- `npm run check`: size checker, TypeScript, twenty-one domain/settings/window-layout/toy tests, and frontend production build passed in the isolated window-layout worktree.
- `npm run tauri build -- --no-bundle`: Windows release compilation passed and produced src-tauri/target/release/inova.exe.
- Browser preview UI: adoption, adding a commitment, proposing/accepting/completing a sample quest, unlocking/equipping the notebook, saving/opening a dated reflection, and retaining the adopted/equipped dog after reload were observed.
- Browser controls check: Home/Settings icons and compact status render; enabling dev mode reveals mood controls, disabling it hides them, and the sound setting changes independently. Native layout still needs platform runtime confirmation.
- Domain tests check duplicate rewards, ineligible completion states, locked items, fabricated evidence, and private/revoked/deleted memory handling.
- Quest toy browser preview: three fictional quests displayed together; creating a fourth commitment produced a proposed quest; its toy action accepted it and changed the visible status to On the trail. The generated frame and internal list scrolling were visually reviewed. Preview: `npm run dev -- --port 1423`, then `/dev/toy.html`; use this separate origin to keep its fictional records apart from normal preview data. This development-only entry is not in the production build.

## Still unverified or incomplete

- Windows native overlay appearance, dragging, and native save/restart need hands-on runtime testing. Compilation alone does not establish them.
- No Mac runtime test was performed here. GitHub's matrix is configured for both platforms; inspect Actions for actual run results.
- The GitHub CLI token on the initial workstation is invalid, so authenticated Actions inspection is unavailable; SSH Git access works.
- No live AI, credentials, scheduling engine, assignment/calendar/grade integration, cloud sync, or sign-in.
- No recorded bark, final sprite set, multiple adoptable variants, mature animation, dedicated book/door audio, or full item reveal sequence.
- No quest editing, memory editing, multiple equipment slots, click-through, or spooky-mode mechanics yet. New placement restoration and popup sizing still need hands-on Windows/Mac confirmation.
- The toy art is generated concept artwork, with responsive border-image stretching rather than a finalized low-resolution sprite atlas. It is independent of the other chat's dog artwork. See QUEST_TOY_ART.md for provenance and integration details.
- Desktop stores are plaintext. Browser preview and desktop data are separate; concurrent preview tabs/processes are outside the starter's state model.

## Next actions

1. Choose who owns Track A/B/C in TEAM_PLAN.md.
2. Everyone follows SETUP.md and runs the starter; get hands-on Windows and Mac overlay reports first.
3. Follow each track's first milestone. Decide AI provider/spending limit and agree on pixel asset dimensions.
4. Merge working increments daily; target a complete integrated flow by November 27 and freeze new features November 30.

## Commands

`npm ci`; `npm run dev` for browser preview; `npm run desktop` for native development; `npm run check` for source checks; `npm run tauri build -- --no-bundle` for native compilation. See SETUP.md for platform tools and paths.

Update this record with actual results as work lands. Repository documents are the shared implementation reference; companion Pages do not automatically sync. GitHub: https://github.com/JBarmada/Inova.
