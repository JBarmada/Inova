# Implementation Status and Handoff

Shared starter checkpoint: November 22, 2026. Three builders; Windows and Mac; deadline December 1. Inspect current code before relying on this checkpoint after later changes.

Main integration checkpoint: November 23, 2026. The user approved the reviewed companion/toy/navigation work through bac64bc for main. This integration preserves the original dirty checkout, the separate Pocket Pup drafts, and the separate frame-fix worktree. The user subsequently approved integrating the captured/verified frame fix; main now reserves a stable floating canvas width and includes its evidence. Local main checkout: `.worktrees/main-integration` under the project folder; teammates use the normal GitHub main branch.

## Implemented starter

- The quest board has no close/X icon. Clicking outside the toy/board collapses it; interacting inside stays open. Losing native window focus (for example, clicking another app) also collapses it. Clicking the toy again and Escape still close it. Listeners are installed only while open and cleaned up on dismissal/unmount, including late native subscriptions. Outside dismissal does not steal focus back from the clicked target.

- Home navigation uses a monochrome pixel bone toy for Quests, matching the other dark navigation icons. Floating mode retains the detailed gold/teal toy artwork. This supersedes the earlier shared colored navigation-art choice below; only the home icon rendering changed.

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
- Floating mode reserves the quest board's 384 CSS pixel width even while collapsed. Opening/closing changes height only, so the native window never moves sideways with a stale painted frame. Dog, toy, and controls keep the same screen positions. The collapsed canvas has wider transparent margins; those margins still intercept clicks because selective click-through is not implemented. Zoom changes can still resize/reanchor the window; screen-edge clamping takes precedence.
- Floating pet content has its own stacking context beneath companion controls, so the toy, quest count, and quest board cannot paint over Settings. The development toy preview includes the real settings controls for overlap review.
- Floating Home/Settings controls use a centered compact-width strip rather than the full quest-board width. Their positions and the settings pane remain anchored relative to the dog as the board expands/collapses.
- Floating hover reveal covers the continuous pet-panel area, including the toy and space above developer emotion controls, so moving from the dog to a mood button does not hide/disable the buttons. Leaving the companion still hides hover-only controls. The development toy preview uses the real PetPanel, including developer controls.
- Quest board heading is Fetch a Lil' Side Quest with flanking decorative stars. Removed the small blue tagline, composer hint, and sample-planner footer at the user's request; the quests screen retains its sample-planner disclosure. The commitment input/check form shares one continuous border, with no grid gap or button offset/shadow.
- The toy's dashed focus bounding box is restricted to Dev mode. Normal mode uses a shape-following image glow for keyboard focus instead of a rectangular outline.
- Home copy is pared down to Inova branding, navigation/actions, and the dog's name (or Adopt a dog). Removed the growth tagline, shared-starter suffix, prototype banner, repeated companion/greeting labels, wardrobe/adoption implementation hints, and deadline footer. The quests screen continues to explicitly identify the deterministic sample planner.
- Home uses one header: Inova at left, four navigation icons in the center (paw, golden/teal quest toy, shirt, open book), and Float then Settings together at right. Every icon has an accessible name and tooltip; active navigation remains highlighted. Narrow windows wrap navigation beneath the brand/actions. Floating mode retains its anchored Home/Settings strip.
- Wardrobe and Memories are independent pages: WardrobePanel owns equipment presentation, and MemoryShelf opens directly from its own Memories tab. The old combined WorldPanel/bookshelf toggle is removed. QuestToyIcon reuses the same transparent artwork in home navigation, the floating toy, and quest Fetch actions. The paw icon is unchanged. Persistence, rewards, and memory permissions use their existing shared actions/schema.
- Native companion alignment follows the current webview viewport. The resize_floating Rust command groups move and size in one main-thread task. Windows frame capture demonstrated that grouping alone still exposes a shifted previous frame during horizontal resizing; the stable canvas width above removes that opening/closing race. Keep the native command when integrating. Mac runtime timing remains unverified.
- Quest-list scrolling sits 22 CSS pixels nearer the right frame border, with matching internal padding so quest copy and action buttons keep their original alignment.
- Browser overlap review confirmed Settings receives hit testing at the toy's center while open. The adjusted scrollbar was visually checked beside the right frame rail; the frame clips at its outer edge rather than its inner padding so the inset scrollbar remains visible.
- Feature folders and three task handoffs, with shared agreements and Windows/Mac CI configuration.

## Verified in this setup

- November 23 isolated toy-frame fix: reproduced and captured the original native Windows blink before editing. A clean baseline showed an opening shift of -127 physical pixels and closing shift of +127. After the fix, 2,252 captured frames across 64 opening/closing transitions had one constant dog position, one native width, and one native left edge. Includes muted/dev controls and sound-enabled/normal controls, plus native test-app restarts. See [frame evidence and reproduction](evidence/floating-toy-frame-fix/README.md). This does not establish audible output, dragging, or Mac behavior.
- Fix validation: `npm run check` passed all 23 tests, size limits, TypeScript, and production frontend build. `npm run tauri build -- --debug --no-bundle --config .tools/native-test.json` compiled the Windows app with an isolated title/identifier and the same production frontend; fictional records kept test saves separate. The temporary config is described with the evidence.
- Fresh `npm ci` and `npm run check` passed in the main integration checkout: size limits, TypeScript, all twenty-three tests, and frontend production build.
- `npm run tauri build -- --no-bundle`: Windows release compilation passed in the main integration checkout after the outside-click dismissal change, producing src-tauri/target/release/inova.exe there.
- Outside-dismiss browser check: the board has no close icon; clicking the commitment input kept it open, and clicking outside collapsed it. Native focus-loss dismissal is wired to Tauri's window-focus events but still needs hands-on Windows/Mac confirmation.
- Browser preview UI: adoption, adding a commitment, proposing/accepting/completing a sample quest, unlocking/equipping the notebook, saving/opening a dated reflection, and retaining the adopted/equipped dog after reload were observed.
- Browser controls check: Home/Settings icons and compact status render; enabling dev mode reveals mood controls, disabling it hides them, and the sound setting changes independently. Native layout still needs platform runtime confirmation.
- Domain tests check duplicate rewards, ineligible completion states, locked items, fabricated evidence, and private/revoked/deleted memory handling.
- Split-page browser review: Wardrobe showed locked/equipment controls without memory forms; Memories showed reflections/books without wardrobe controls. Saved and reopened a fictional dated memory with personalization permission off. Verified all four navigation buttons have distinct accessible labels and the new quest icon uses the floating toy asset.
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
