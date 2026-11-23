# Implementation Status and Handoff

## Local memory search — November 23, 2026

The bookshelf filters locally by case-insensitive reflection text and shows an empty-results message. The search does not send records anywhere or change permissions. Book buttons include date/time and their position in the current result list for accessibility. The existing open-book style preserves line breaks. `npm run check` passed 97 tests, size/type checks and production build; Windows release compilation passed. Native visual review and Mac remain pending.


## Adoption welcome — November 23, 2026

After a successful adoption save, the home companion shows a named welcome and briefly uses the existing happy artwork and sparkle. The visual reaction is temporary presentation state; the saved mood is unchanged. A synthesized welcome cue observes mute and plays only after a successful save. `npm run check` passed 96 tests, size/type checks and production build; the isolated Windows release compiled. A fresh fictional Windows test profile showed the named welcome after adoption; the brief reaction and audible playback were not separately observed. Mac and multiple adoptable dogs remain pending.


## Local model selection — November 23, 2026

The Quests page offers the provisional Gemma 3 12B default and a faster 4B option labeled as potentially less reliable. The choice persists, older saves default to 12B, and the native boundary accepts only these two model names. Ollama and the selected model must already be installed and running; the separate sample planner remains available. `npm run check` passed 95 tests, size/type checks and production build; the isolated Windows release compiled. In the fictional native profile, 4B generated a valid quest, the local service reported the 4B Q4_K_M model, and both the selection and quest survived restart. The test service was stopped afterward. This single request is not a reliability evaluation; see the existing model trial for failures and limitations. Mac remains pending.


## Native Windows spot checks — November 23, 2026

Using the isolated fictional test profile, the Memories recap displayed zero dated activities and identified one older undated completion. The wardrobe shuffle equipped the single owned notebook badge and displayed confirmation. A proposed quest's duration was edited from 5 to 7 minutes, and its context disclosure showed the linked commitment and no linked reflections. After closing and reopening the test app, the notebook remained equipped and the quest retained 7 minutes. A white window appeared briefly immediately after launch, before the app content; its duration and first loader frame were not measured. These spot checks do not establish audible sound, reduced-motion, floating placement, or Mac behavior.


## Repeated sound control — November 23, 2026

Rapid repeated cues of the same kind no longer overlap while their short synthesized tone is playing. Different cue types can still overlap. Muted actions do not create an audio context, and unavailable audio does not block interaction. `npm run check` passed 93 tests, size/type checks and production build; Windows release compilation passed. Tests use a simulated audio context; audible playback, native UI and Mac remain pending.


## Editable quest duration — November 23, 2026

The main quest editor now changes the estimated duration as well as the title, limited to whole minutes from 1 to 120. Proposed, accepted and deferred quests remain editable; completed and dismissed quests remain terminal. Editing preserves the planner rationale, source IDs, status, and reward records. `npm run check` passed 91 tests, size/type checks and the production build; Windows release compilation passed. Native UI and Mac remain pending.


## Windows startup measurements — November 23, 2026

Three sequential isolated release launches used the fictional `com.inova.buildout.verify` profile and fresh startup-diagnostic writes. Process launch to diagnostic detection (100 ms polling) took 996, 791, and 771 ms. Renderer navigation to UI-ready effect took 199, 162, and 171 ms; save initialization took 33, 28, and 27 ms, and window initialization took 99, 70, and 72 ms. The processes closed normally after measurement. The reported 30-second delay did not reproduce in this small warm-launch sample. These runs used hidden test windows; they do not prove first visible frame, loader visuals, a cold machine boot, development startup, or Mac behavior. No bottleneck fix is claimed. Use the existing diagnostic on an affected launch and compare the process/navigation phases before attributing a cause.


## Sample planner privacy race — November 23, 2026

Sample proposals now carry a transient snapshot of any reflected text they used, just like local proposals. The reducer rejects a proposal if a linked reflection changed, was deleted, or lost permission before the save. The snapshot is never persisted. Both home and floating sample-planning paths use this check.

`npm run check` passed 90 tests, size/type checks and the production build. Windows release compilation passed; native UI and Mac remain pending.


## Inspect suggestion context — November 23, 2026

Each quest in the main Quests page offers an expandable view of its commitment and linked reflections that are still allowed for personalization. It identifies those reflections as context provided to the planner, rather than claiming the model relied on every one. Editing, revoking or deleting a reflection removes the old reference; private and unrelated reflections are not displayed as sources.

`npm run check` passed 89 tests, size/type checks and the production build. Windows release compilation passed. Native visual review and Mac remain pending.


## Owned outfit shuffle — November 23, 2026

The outfit strip offers an optional shuffle that selects an owned item independently for each wearable slot and leaves slots with no owned items empty. The entire outfit is saved as one validated action; locked items and incompatible slots are rejected, and ownership and quest rewards are unchanged. The selection remains visible with sound muted and survives serialization.

`npm run check` passed 88 tests, size/type checks and the production build. Windows release compilation passed. Native visual review and Mac remain pending.


## Seven-day recap — November 23, 2026

The Memories page can show a local seven-day recap of dated completed adventures and the number of memories saved. New completions record an optional UTC timestamp; older undated completions remain valid and are counted separately without inventing dates. Private memories contribute only to the count and are not sent to AI. Duplicate completions cannot rewrite the timestamp. The date window excludes future and older records.

`npm run check` passed 86 tests, size/type checks and production build. Windows release compilation passed. Native runtime, visual review and Mac remain pending.

## Memories linked to adventures — November 23, 2026

A new reflection can optionally reference a completed quest; the open book shows its title. The shared reducer rejects new references to unfinished or missing quests, while standalone memories remain available. The selected link is preserved through editing and the save schema stays at version 2. The form resets the link and personalization permission after saving.

`npm run check` passed 84 tests and type/size/build checks; Windows release compilation passed. A fictional reflection was linked to a completed quest, reopened, reloaded, and reopened again in browser preview; permission remained off. This does not establish native restart or Mac behavior.

## Quest reward reveal — November 23, 2026

The main quest page and floating toy show an animated, readable completion card naming each item actually unlocked by the saved completion. The card also identifies the completed quest and gives a saved-progress message if no new item was unlocked. It does not announce an item again for duplicate, ineligible, or failed saves. The existing synthesized reward cue and mute setting remain in use; reduced motion disables the reveal animation. Floating completion retains focus on Completed and returns the list to the reveal instead of scrolling the feedback out of view.

`npm run check` passed 82 tests, type/size checks, and production build; Windows release compilation passed. In the isolated browser preview with fictional quests, completions showed the notebook and bandana unlocks and a no-new-item completion; the third reveal and Completed focus were visually checked. This is browser evidence, not native overlay, audible playback, muted playback, or Mac runtime verification. Item graphics are existing provisional wardrobe glyphs and reward thresholds remain demonstration rules.

## Local planner integration — November 23, 2026

The build-out worktree offers an explicit Local AI quest action in the Quests page. It calls the local Ollama `gemma3:12b` model through a bounded Rust command, sends the commitment and up to three permitted reflections, validates JSON and quest fields, and records the supplied source IDs. The existing sample planner remains separately selectable. Errors tell the user to start/install the local service and preserve manual/sample use. Before saving a local proposal, the reducer checks that each supplied memory is still allowed and unchanged. Revocation/edit/delete removes copied local-model title and rationale as well as the source ID. Existing v2 saves remain readable; older builds cannot read new `planner: local` quests.

`npm run check` passed 80 tests plus type/size/build checks; Windows release compilation passed. Local-service error and mocked valid/invalid output paths were tested, but no live model or native UI run was performed.

A verified standalone Ollama runtime was subsequently downloaded into ignored `.tools/ollama`; Gemma 3 4B and 12B were measured on fictional examples. The native Windows test app generated a real 12B quest through the app. The 4B initial run invented a chapter; a revised prompt avoided that specific failure in the small recheck. The 12B remains a provisional default. See [model trial and limitations](evidence/local-models-2026-11-23/README.md). The app requires a running Ollama service; the isolated runtime is not packaged with the app. The benchmark service was stopped after testing to release memory; downloaded files remain in the ignored worktree. Browser preview can use the sample planner; the local action requires desktop mode. See [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs) and [local chat API](https://docs.ollama.com/api/chat).

## Build-out worktree — November 23, 2026

The isolated build-out branch adds memory editing with stale quest rationale/source removal on changed content, and editable titles for proposed, accepted, and deferred quests; completed and dismissed quests remain unchanged. Existing IDs, evidence, rewards, and saved schema are preserved. See [build-out checklist](BUILD_OUT_CHECKLIST.md) for pending work and baseline.

## Dog control gate and menu dismissal correction — November 23, 2026

All manual dog controls now share `DogDeveloperControls`, gated by adoption and Dev mode in both home and floating mode. Future dog buttons belong there. Normal-mode render tests reject any new dog action button outside the gate; adoption and wardrobe previews remain available. The redundant minimize icon and its styling are removed. Outside clicks, focus loss and Escape still retract the menu into the toy; no explicit dismissal button is needed.

`npm run check` passed: 88 source-file size checks, TypeScript, 72 tests in 17 files, and frontend build. Added regression checks for both home/floating gates, switching Dev mode off again, adoption availability, no expanded-menu dismissal button, inside/outside clicks, focus-loss dismissal, and listener cleanup. Windows release compilation passed. No fresh native runtime or Mac test was performed for this correction.

The earlier minimize-button/home-pose exceptions below are historical and superseded by this correction.

## Floating controls and toy transition — November 23, 2026

- Floating Sit/Stand now follows the Settings Dev mode toggle. Home pose controls remain available. Floating pose controls sit after the toy/menu in layout, with a separate stacking level, avoiding the negative-margin overlap.
- Opening the quest toy stretches its artwork into the illustrated menu; the standalone toy and badge disappear while expanded. A Minimize quest menu icon retracts the menu into the toy. Escape, outside clicks and focus-loss dismissal retain the same collapse path. Explicit minimize/Escape restores focus to the toy after retraction; outside dismissal preserves the clicked target. The panel becomes inert while closing and unmounts afterward.
- The native canvas keeps its stable width. Expanded height is held through retraction, then compacted once the menu is gone. Reduced motion skips the stretch/compression. Existing art and mute-aware synthesized squeak are reused; no new assets or persisted fields were introduced.
- Fresh `npm run check`: 85 source-file size checks, TypeScript, 67 tests in 15 files, and production build passed. Windows `npm run tauri build -- --no-bundle` passed. Browser checks on isolated fictional `/dev/toy.html` data verified Dev mode off/on, unobstructed Stand action, expanded toy disappearance, minimize, Escape/focus restoration, outside dismissal, and the same visible states with sound muted. Reduced-motion behavior was inspected in source, not exercised through a browser media override. Audible output, native resize animation, and Mac runtime remain unverified.
- Try the animation with `npm run dev -- --port 5196`, then open `http://127.0.0.1:5196/dev/toy.html`. This development-only page uses fictional demo records in that separate browser origin; it is not the native overlay.

## Consolidated main — November 23, 2026

The primary project folder is now the `main` checkout. See [consolidation inventory](MAIN_CONSOLIDATION.md) for every worktree and the recovery checkpoint. Continue functional work here rather than in the old worktrees.

Combined capabilities include the existing quest toy/navigation/window fixes, approved sit/breathing/seated tiredness, four-slot wardrobe with v1-to-v2 save migration and compact outfit controls, native X/Settings quit with bounded save draining, and a startup loading screen with phase feedback, delayed retry, and local timing diagnostics. Clothing uses seated anchors for every seated face and follows inhalation without moving socks. Clothing art remains provisional. The v36 loaf preview is preserved for review; its runtime timer remains disabled.

Fresh consolidation verification: `npm run check` passed size checks for 82 source files, TypeScript, all 65 tests in 14 files, and the production frontend build. `npm run tauri build -- --no-bundle` passed and produced `src-tauri/target/release/inova.exe` in this folder. No fresh native UI walkthrough or Mac compilation/runtime was performed. Earlier native quit evidence is preserved in [reliable-quit](evidence/reliable-quit/README.md); those captures predate this consolidation.

The notes below include historical checkpoints; the consolidated status above takes precedence.

## Approved seated tiredness - November 23

The user approved v35. Mood changes now preserve the local seated pose; tiredness plays the reviewed eye-only sequence, then holds tired sitting with grounded breathing. Pose commands retain the shared mood. Happy sitting currently uses the approved neutral seated face plus sparkle, pending its expression review. Breathing phase continues across seated face frames. No persisted schema change.

`npm run check` passed size limits, TypeScript, **37 tests in 8 files**, and the production build. Windows release library compilation passed (`cargo build --release --lib --locked --offline`); running apps were not replaced. Browser checks with fictional Mochi observed tired sitting, idle/happy recovery staying seated, fitted bandana, and seated breathing URLs. Native runtime and Mac verification remain pending.

The next review is tired sit to loaf after seven seconds. Loaf and its runtime deadline remain disabled until approval. Sit to stand still changes directly and awaits its separate rise clip. Navigation currently remounts local posture; it is tracked in [the coverage ledger](TRANSITION_TABLE.md).

## Pocket Pup and breathing integration — November 23

The approved v32 neutral/tuck/sit sequence and v34 grounded breathing loops now render in the app. The integration is based on main `2dd9b1e` and preserves its quest-board organization, toy dismissal, navigation, wardrobe/memories split, and native layout code. Breathing uses the exact reviewed PNG phases (800/450/650/900ms), keeps paw pixels fixed, follows the neck with the bandana, pauses during the tuck, and stops for reduced motion.

`npm run check` passed: source sizes, TypeScript, **31 tests in 7 source test files**, and production build. Test discovery is limited to `src` so nested worktrees and local backups do not inflate results. Windows release library compilation passed with `cargo build --release --lib --locked --offline`; running executables were not replaced. Browser preview showed current main navigation/wardrobe, standing/sitting controls, bandana, and changing breathing frame URLs. Native runtime behavior and Mac compilation/runtime remain unverified for this integration.

The user's next requested hierarchy is not silently treated as delivered: seated mood changes must preserve posture, tired sitting should lead to loaf after seven seconds, and standing up needs a reviewed transition. These are the next review-gated scenarios; existing direct stand-up/mood-reset behavior remains a known limitation until those clips are approved. See [integration notes](POCKET_PUP_INTEGRATION.md) and the artist scenario brief.

Shared starter checkpoint: November 22, 2026. Three builders; Windows and Mac; deadline December 1. Inspect current code before relying on this checkpoint after later changes.

Main integration checkpoint: November 23, 2026. The user approved the reviewed companion/toy/navigation work through bac64bc for main. This integration preserves the original dirty checkout, the separate Pocket Pup drafts, and the separate frame-fix worktree. The user subsequently approved integrating the captured/verified frame fix; main now reserves a stable floating canvas width and includes its evidence. That checkpoint used `.worktrees/main-integration`; main now lives in the primary project folder.

## Implemented starter

- Wardrobe UI refinement: top clear-outfit icon; side-by-side human Stand/Sit icons; All/Hat/Glasses/Socks/Body inventory filters; hanger navigation distinct from the T-shirt category; icon wear/remove/locked/worn states. The normal transition selector and implementation paragraph are removed. Icon rules are recorded project-wide in AGENTS.md. No inventory schema/reward changes in this refinement.

- Icon refinement verification: `npm run check` passed 67 source-file size checks, TypeScript, all 45 tests, and frontend production build. Windows release compilation passed. Browser review verified all five filters, both poses, Enter/Space activation, and the narrow layout; [current screenshot](evidence/wardrobe-slots/icon-controls.jpg). Native Windows/Mac UI runtime remains unverified for this branch.

- November 23 wardrobe worktree (`codex/wardrobe-slots`, rebased onto main `2dd9b1e`): four simultaneous worn slots, pose-aware SVG placeholders, ten catalog entries, three developer-gated fictional outfit scenarios, individual removal/clear-all, and schema-v1-to-v2 migration. Selected Pocket Pup exports and existing pose playback are integrated without replacing main's quest toy/navigation/window-layout changes, including newest-first/completed quest grouping. See [contract and test steps](WARDROBE_SPEC.md).

- Outside dismissal tests the actual toy button and board separately, not their full-width layout wrapper. Empty space beside the toy and the gap above the board now count as outside. The wrapper is not text-selectable, while board text remains selectable.

- The quest board has no close/X icon. Clicking outside the toy/board collapses it; interacting inside stays open. Losing native window focus (for example, clicking another app) also collapses it. Clicking the toy again and Escape still close it. Listeners are installed only while open and cleaned up on dismissal/unmount, including late native subscriptions. Outside dismissal does not steal focus back from the clicked target.

- Home navigation uses a monochrome pixel bone toy for Quests, matching the other dark navigation icons. Floating mode retains the detailed gold/teal toy artwork. This supersedes the earlier shared colored navigation-art choice below; only the home icon rendering changed.

- Tauri 2/Rust desktop shell with React/TypeScript/Vite interface and locked npm/Cargo dependencies.
- One window with normal home and compact transparent always-on-top mode controls; native drag-region markup.
- Isolated layout fix: separate persistent home/floating geometry, home size/maximized restoration, monitor work-area clamping, and content-fitted floating height. Floating page scrollbars are suppressed and the quest popup is kept within the window's width.
- Adoption/name, selectable moods, selected Pocket Pup runtime sprites, and separate pose-anchored wearable placeholder layers.
- Manual commitment entry and a labeled deterministic sample Planner interface.
- Quest proposal, acceptance, deferral, dismissal, and completion.
- Duplicate-safe completion rewards: notebook at one quest and bandana at three; four simultaneous equipment slots (hat, glasses, socks, body) with per-slot replacement/removal and clear-all.
- Reflection entry, dated memory buttons, readable entry view, per-entry personalization permission, and deletion.
- Shared validated state with queued mutations and local persistence adapters for desktop and browser preview.
- Click/reward synthesized tones, shared mute setting, error messages, and reduced-motion CSS.
- Entering floating mode does not leave a persistent mode-change success banner; switching errors remain visible.
- Home/Settings pixel icons replace floating text controls. Settings contains sound and persistent dev-mode toggles; manual mood controls are hidden by default. Existing saves default devMode to false. Companion status uses a small stepped pixel chip.
- The Home icon appears only in floating mode; the home interface shows Settings alone.
- Floating controls and enabled mood status reveal on dog hover or keyboard focus, remaining available during control/menu interaction. Settings adds a persistent Status bar toggle, off by default and compatible with older saves.
- Floating mode includes a generated golden bone/teal rope toy. Clicking it expands an illustrated quest board showing every non-dismissed quest, with proposed, accepted, deferred, and completed states kept distinct. The frame grows with its contents; the list scrolls internally at the screen-height limit.
- Quest board organization: unfinished quests appear newest first across statuses. Completed quests sit below them in a single Completed (count) disclosure, collapsed whenever the board opens. Expanding it shows completed quests newest first; the badge still counts unfinished quests only. Accept/complete feedback stays visible outside the collapsed group, and completion focuses its disclosure button. Disclosure clicks honor mute. This is view state only; saved quest order, schema, validation, and rewards are unchanged.
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

- November 23 quest-board organization: `npm run check` passed size limits, TypeScript, all 24 tests, and production frontend build. Windows native debug compilation passed using the isolated test configuration described below. With fictional muted data, native accessibility and visual review confirmed newest-first active/completed lists, adding a quest at the top, disclosure expansion/collapse with Space/Enter, collapsed state on board reopen, completion feedback/focus, and the all-completed case. No Mac runtime or audible playback check was performed for this feature.
- Wardrobe branch: browser checks confirmed all four slots, three pose previews, per-slot removal, saved reload, slot replacement, clear-all, muted feedback, and retaining the outfit with developer controls off. [Screenshot and verification scope](evidence/wardrobe-slots/README.md). Windows release compilation passed; native runtime and Mac verification of this branch remain outstanding.
- Final wardrobe validation after rebasing onto main `2dd9b1e`: `npm run check` passed 65-file size limits, TypeScript, all 45 tests, and frontend production build. `npm run tauri build -- --no-bundle` passed Windows release compilation after the frontend refinements. These results belong to this isolated branch, not a claim that it is already merged into main.

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
- No quest editing, memory editing, world-item placement, click-through, or spooky-mode mechanics yet. New placement restoration and popup sizing still need hands-on Windows/Mac confirmation.
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
