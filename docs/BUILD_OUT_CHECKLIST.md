# Inova build-out checkpoint

Worktree: `.worktrees/inova-complete`, branch `codex/inova-complete`, based on `origin/main` at `851ca60` on November 23, 2026. The primary checkout contains active uncommitted artwork, animation, and documentation; do not copy or replace it without reconciling the owning work. Existing older worktrees are retained.

## Current backlog and acceptance — November 23, afternoon

Update this table after each meaningful increment with its actual status, remaining acceptance, dependencies, and verification. The dated entries below are a historical record. **Implemented** means code exists in this branch, not that every platform or visual detail is approved. The branch has been pushed and has not been merged into main.

| Area | Current status | Remaining acceptance or dependency |
| --- | --- | --- |
| Quest entry | Implemented: one shared input, then review of the proposed title, reason and duration before saving; samples are labeled and deadline/effort controls are tucked away unless needed. Editable quests and abbreviated hour estimates are supported. | Visually test the review and date picker in desktop and floating mode; check model omissions and corrections with fictional inputs. |
| Rewards and reflections | Implemented: distinct quest states, duplicate-safe demo rewards, visible reveals, linked editable memories and permission controls. Completed quests queue an optional home-chat reflection, private by default; a user can request a follow-up plan after saving or skipping. | Verify the full native save/restart/revoke/delete and duplicate-reward flow, live local-model follow-ups and handling multiple queued follow-ups. Final reward balancing is open. |
| Pocket Pup animations | Integrated for testing: 20 clips, automatic sleep/wake and selected reactions, Dev-mode selector. Two source/atlas pairs were inspected statically. | Review every clip, timing and wearable fit in the running app; confirm visual approval and asset provenance before release. Preserve the original checkout. |
| Floating companion and toy | Implemented: transparent window, toy expansion, outside-click/focus-loss/Escape dismissal, Dev-mode-gated dog controls. | Verify drag with a real mouse, screen-edge placement, restart, resizing and continuous transition timing. The combined build has not had a complete native visual pass. |
| Adoption, wardrobe and bookshelf | Implemented: naming, layered placeholder wearables, owned-item shuffle, dated readable books, search and editing. | Complete the end-to-end adoption/equip/restart flow and visual/accessibility checks; final item art and more base dogs need assets and review. |
| Local AI and personalization | Provisional: local 12B/4B provider, permitted-memory selection, source IDs, validation, bounded failure and sample fallback. Home chat previews up to three steps; acceptance saves the first quest and retains the others as suggestions for later review. Users can switch to sample while waiting. A fictional 12B injection trial manipulated a proposed title; a later multi-step trial timed out. A direct 4B repeat produced a brief three-step plan in 7.7 seconds. | Resolve live multi-step latency and verify model quality, prompt injection and native operation; build contextual multi-turn conversation and follow-ups. Switching to sample ignores the eventual local result but does not stop the native request. A small 4B trial produced incorrect extracted values. |
| Recaps, exploration and perspective | Partial: seven-day local recap lists recent completions newest first, with boundary tests; on-demand sample exploration and user-authored perspective prompts. | Validate recaps with varied native saved history; personalized/automatic exploration and AI-supported discussion remain backlog. |
| Adulting and world growth | Backlog: practical checklists/conversations, more rooms and richer shelf decorations. | Agree on a small useful flow and approved assets; do not present placeholder or sample behavior as a live integration. |
| Treats, toys and cosmetics | Partial: animation clips and Dev-mode playback exist; placeholder wardrobe supports four slots. | Decide ordinary interaction and reward rules consistent with the direct-control Dev-mode requirement; approve art and test sound/visual feedback. |
| External integrations | Blocked on selected provider, permitted access and product scope. | Keep manual paths usable; implement any future integration read-only until a specific write is authorized. |
| Spooky appearances and revival | Exploratory only. | The team must choose triggers and revival rules before implementation. |
| Sound, accessibility and release | Partial: synthesized cues, mute/reduced-motion controls, and Windows spot checks. | Verify audible and muted feedback, keyboard/screen-reader behavior, recovery and native layout. Mac build/runtime requires a Mac. |

Latest automated evidence: `npm run check` passed 177 tests, all 20 clip-atlas checks, type/size checks and the frontend build; an earlier Windows `cargo test --lib --locked --offline` passed two Rust tests. A fictional browser preview verified chat, sample acceptance, completion, private reflection and sample follow-up linkage; a 12B multi-step live model trial timed out, two 4B service-only trials returned plans, and native layout remains pending. Saved multi-step follow-ups have automated coverage but have not been visually tested. Combined native visual review also remains pending because automatic review blocked a screen inspection containing unrelated sensitive content. See [implementation status](IMPLEMENTATION_STATUS.md) and [handoff](HANDOFF_BUILD_OUT.md) for details.

## Pocket Pop chat-led direction — proposed backlog

These design notes describe future work, not current behavior. They build on the quest, reflection, wardrobe and model work in the table above; they do not establish a product rename. The present one-field composer and proposed-quest workflow remain implemented until the chat-led flow replaces them. Keep the native companion, direct-dog-control Dev-mode rule, outside-click toy dismissal, and application-controlled rewards and state validation.

### First pass: one end-to-end companion flow

- [ ] **Home and conversation:** A home chat disclosure now persists user messages and scripted replies, supports resuming goal/context entry and clearing its transcript. Generated proposals are transient and not copied into chat history. Still needed: a compact message-bar design, conversational follow-ups, shared files and visual/native review. Define file types, storage, permissions and deletion before implementing file access.
- [ ] **Clarify and plan:** Home chat asks one fixed optional question. A local-model endpoint can preview one to three validated steps and an explanation, while the labeled sample fallback produces one step; only the first can be accepted. Mocked tests pass, but the first live 12B trial timed out. Still needed: context-sensitive clarification, live quality and latency validation, and a way to retain later steps. Preserve sources and uncertainty.
- [ ] **Accept and revisit:** Home chat saves its first quest only after explicit acceptance, in one validated action. Existing Quests and floating composers still save proposals and need a coordinated transition to the new design. Rework the tab as an active/past quest record, keep declined/deferred plans distinct, and reconcile migrations and rewards without discarding existing quests.
- [ ] **Complete and follow up:** Quest completion queues an optional home-chat reflection, linked to the completed quest and excluded from personalization unless explicitly allowed; users can skip it. After either choice, users can request a follow-up using the original goal, the prior completed quest where safe, and an allowed linked reflection. The accepted follow-up links to the earlier quest. Multiple reflection prompts queue, but only the most recently resolved follow-up is offered. Still needed: retain multiple follow-up choices, broader conversation context and native/live-model validation. Preserve duplicate-reward prevention.
- [ ] **Verify the full sequence:** With fictional data, exercise chat → clarify → preview → accept → Quest tab → complete → reflection → next step. Also test changed plans, declined quests, interrupted sessions and returning after restart, unavailable AI/sample fallback, stale permissions, and both desktop and floating entry points. Record native and Mac results separately.

November 23: the home chat's initial scripted goal/context flow, older-save default, atomic acceptance and stale-memory rejection passed automated state tests. `npm run check` passed 162 tests. This is not an AI conversational assistant or a multi-quest plan, and a browser preview verified its basic layout and sample acceptance; native and Mac UI remain unverified. Saved conversation is local; clearing it does not delete independently saved quests or memories.

November 23, later: a separate local multi-step endpoint and reviewed plan preview now support one to three steps; only the accepted first step is saved. Remaining steps are transient. Mocked model/schema, source permissions, effort limits and sample fallback passed tests. A direct fictional 12B request timed out at 120 seconds, so live quality and performance are unverified. `npm run check` passed 166 tests and Windows Rust library tests passed; native UI and Mac remain pending.

November 23, later: users can switch to the sample while local planning is pending; regression tests verify a late local result is ignored rather than replacing the sample and that leaving the screen suppresses late updates. This does not cancel the model request itself. Two direct fictional 4B requests returned three steps in 23.5 and 7.7 seconds; the shorter prompt improved brevity on the repeat. These are small service-only trials, not native end-to-end or broad quality evidence. `npm run check` passed 168 tests and Windows Rust library tests passed.

November 23, later: completing a quest now queues a home-chat reflection; accepting, skipping, the existing reflection form, duplicate completion and older-save defaults have regression coverage. A fictional browser run completed a sample quest and saved a linked private reflection. `npm run check` passed 171 tests. Native, Mac and AI-driven follow-up remain unverified or unimplemented.

November 23, later: after saving or skipping a reflection, users can request a follow-up plan. Local planning receives the prior completed quest title only when it does not depend on personal memories; otherwise it receives only its ID. An explicitly permitted linked reflection is preferred in context and its snapshot is rechecked before acceptance. Saved follow-ups retain the previous quest ID. Mocked local-model tests and a fictional browser sample follow-up passed; native live-model validation remains pending. `npm run check` passed 174 tests and Windows Rust library tests passed.

November 23, later: one direct fictional 4B follow-up service request returned a structured plan and referenced the allowed reflection in its explanation; the measured elapsed time was 305.9 seconds, and an outlining step may overlap the previously completed drafting task. It did not exercise the native UI or establish reliable latency, grounding, or avoidance of repetition. Investigate both performance and quality.

November 23, later: accepting a multi-step plan now retains later steps as suggestions; after completion and reflection, the next can be reviewed and explicitly accepted, or a new plan requested. Editing, deleting, or revoking a supporting memory removes the retained suggestions. Automated state/reload and privacy tests pass; verify the complete flow visually in native Windows and on Mac, and improve model quality and latency.

### Supporting work and open decisions

- [ ] **Personality at adoption:** Generate a dog personality when the dog is adopted, starting with four text/response styles suggested by the user: cute, mean, sad and happy. Define the tone of each, how a personality is selected or generated, whether it can change, and how existing dogs migrate before implementation. Preview and test consistent wording across chat, questions and follow-ups without treating a style as the user's mood or changing reward rules.
- [ ] **Demonstrate learning over time:** Build a fictional, repeatable end-to-end evolution scenario: the dog starts without user facts; the user shares their name and a class; later interactions track that class, a friend and the friend's stated preferences, and important dates. Test recall, corrections, deletion, restart, and the absence of invented facts or early knowledge. Any inference that effort indicates how much the user likes a class must be tentative, explain its evidence, allow correction, and never be stored or presented as a confirmed preference without the user's agreement. Resolve consent and retention rules before automatic memory collection.
- [ ] **Memory bank categories:** Design and implement colored icon filters for All, People, Events, You and possibly Misc, with readable accessible names, visible selection, and keyboard support. The request mentions four colored icons while listing All plus three categories and an optional Misc; resolve whether All is included in the icon count and whether Misc is needed during design. Categorization must not change memory permissions or hide the ability to edit, revoke and delete entries.
- [ ] **Visible dog evolution:** After the existing wardrobe is reliable and fitted, plan how the dog's appearance can evolve through skins or other approved visual changes. Define progression triggers, preview and equip behavior, asset provenance and layered compatibility; coordinate with wardrobe and keep placeholder concepts separate from approved art. No unlock or evolution trigger is decided yet.
- [ ] **Quest companion actions:** Define narrowly scoped actions to read relevant quest details, propose a plan, save only after acceptance, and record a reflection. Keep authorization, validation, persistence and rewards in application code; model outputs and conversation/file contents are untrusted data. Test refusal, edits, retries and duplicate actions.
- [ ] **Conversation-derived memory:** Explore deriving useful goals, preferences and ongoing plans from ordinary chat and using them later. Decide what can be saved automatically versus confirmed, how users inspect, correct, revoke and delete it, and how deletion propagates to retrieval and summaries. Until decided, do not assume automatic retention or consent.
- [ ] **Home UI experiments:** Prototype a small tappable speech bubble that opens a menu and an alternative menu already open on arrival. Compare chat/action discoverability and crowding around the pet, including keyboard access and compact floating layout; choose based on testing.
- [ ] **Art and wardrobe, separately:** Improve and review the pet art and make the existing wardrobe work reliably before expanding outfits. Continue the existing wardrobe acceptance above independently of the first chat-to-quest pass, including fitting, equip/persistence, visual review and asset provenance.
- [ ] **Model experiment:** Verify the actual available names, capabilities and supported authentication for the models tentatively called “ChatGPT Luna” and “Terra” before any integration. Explore whether personal OAuth is supported for a private test; do not embed personal credentials in the app or repository. If access is supported, compare the same fictional conversations for clarification quality, manageable plans, acceptance/follow-up reliability and failures. Record model versions, settings, access assumptions and results; retain local/sample paths and avoid claiming these labels are available models.

## Historical checkpoint and log

- [x] Establish isolated worktree and install locked dependencies.
- [x] Baseline `npm run check`: 72 tests, type/size checks and frontend build passed.
- [ ] Diagnose native toy-frame synchronization and startup delay; validate Windows overlay and Mac separately. Native Windows open/outside-dismiss and a restart were observed with fictional data; frame timing, dragging, positioning and Mac remain unverified.
- [x] Add editable quest titles with terminal-state validation and unchanged evidence/reward data.
- [x] Add memory editing; changed text clears stale copied quest rationale and source references.
- [x] Link a new reflection to an existing completed adventure; browser reload preserves the fictional link.
- [x] Show saved quest completions and newly unlocked items in both quest interfaces, with muted-compatible text and reduced-motion behavior.
- [ ] Complete adoption, companion interactions, wardrobe fitting, and bookshelf with verified save/recovery.
- [x] Implement explicit local Ollama planner with permission-filtered context, validated output, stale-context guards, and a separately accessible sample fallback.
- [x] Run preliminary 4B/12B fictional benchmarks and a native local-quest request; see evidence/local-models-2026-11-23.
- [ ] Expand model evaluation and choose a final default; small trials do not establish reliability. Provide a user-friendly runtime setup and service lifecycle.
- [ ] Implement the documented stretch backlog in dependency order, respecting unresolved product/art decisions and external access limits.
- [ ] Verify complete fictional-data flow, audio/mute, reduced motion, Windows and Mac; update asset provenance and release handoff.

Each feature requires observable acceptance and recorded validation. Distinguish current branch results from work on other branches. The primary checkout's original uncommitted animation work remains preserved; the separate snapshot is integrated for testing, with combined visual review still open.

November 23: `npm run check` passed 76 tests, size/type checks and production build after quest and memory editing. Windows/Mac runtime walkthrough and persistence checks for these changes remain outstanding.

Windows release compilation (`npm run tauri build -- --no-bundle`) passed in this worktree after the editing increments. Native interaction and Mac runtime remain unverified.

November 23: reward receipt and reveal increment passed 82 tests and Windows release compilation; browser preview confirmed fictional notebook/bandana unlocks and Completed focus. Native UI, muted audio, and Mac remain unverified.

November 23: quest-linked reflection increment passed 84 tests and Windows release compilation; browser preview verified a fictional linked entry survived reload.

November 23: isolated Windows test app verified edited sample quest completion, notebook reveal, local 12B proposal, restart, floating board opening and outside dismissal. See model trial evidence for exact limits.

November 23: seven-day local recap added with optional completion timestamps and explicit legacy-undated handling. `npm run check` passed 86 tests and Windows release compilation passed; native visual review and Mac remain pending.

November 23: added an owned-items-only outfit shuffle as one validated, persistent action. `npm run check` passed 88 tests and Windows release compilation passed; native visual review and Mac remain pending.

November 23: main-page quests now expose the commitment and currently permitted linked reflections as suggestion context. `npm run check` passed 89 tests and Windows release compilation passed; native visual review and Mac remain pending.

November 23: sample proposals now reject stale, deleted, or newly private reflection context before saving. `npm run check` passed 90 tests and Windows release compilation passed; native UI and Mac remain pending.

November 23: three sequential Windows release test launches reached a fresh diagnostic in 996/791/771 ms; renderer UI-ready was 199/162/171 ms. Warm hidden-window sample only; first visible frame, cold boot, dev startup, and Mac are still unverified. No 30-second delay reproduced.

November 23: quest editing now includes a validated duration of 1–120 whole minutes. `npm run check` passed 91 tests and Windows release compilation passed; native UI and Mac remain pending.

November 23: rapid repeated synthesized cues of the same kind are throttled. `npm run check` passed 93 tests and Windows release compilation passed; audible playback and Mac remain unverified.

November 23: native Windows fictional-profile spot check verified recap legacy labeling, single-owned-item shuffle, quest duration edit and context, and outfit/duration persistence after restart. A brief white initial window was observed but not timed. Audible, reduced-motion, overlay positioning, and Mac remain pending.

November 23: added persistent 12B/4B model choice with legacy-save default and a native allowlist. `npm run check` passed 95 tests; isolated Windows build passed and a real fictional 4B proposal and selection survived restart. Model reliability and Mac remain open.

November 23: added a named adoption welcome, temporary happy artwork, and mute-aware cue after save. `npm run check` passed 96 tests, isolated Windows build passed, and a fresh fictional native profile showed the welcome. Audible playback, reaction timing and Mac remain pending.

November 23: added local case-insensitive reflection search and distinguishable accessible book names. Existing open-book styling already preserves line breaks. `npm run check` passed 97 tests and Windows release compilation passed; native visual review and Mac remain pending.

November 23: current Windows release spot check confirmed expanded toy hiding, outside dismissal, no dismissal icon, dev controls below toy and dev-mode off/on/off gating. A single intermediate frame was seen; continuous transition timing, drag/placement, muted/reduced-motion runtime and Mac remain pending.

November 23: a user-triggered local AI availability check now reports an installed model or stopped service without sending reflections. `npm run check` passed 98 tests, isolated Windows build passed, and both installed/stopped states were observed natively; live missing-model and Mac remain pending.

November 23: completion feedback now offers an optional linked reflection. Floating drafts survive board dismissal during the same session and remain private by default; they are not persisted before saving. `npm run check` passed 100 tests; isolated Windows release and the fictional floating completion/dismiss/reopen/save path passed. Main-page reflection, muted/reduced motion and Mac remain pending.

November 23: added optional local deadline/time-zone and total effort to manual commitments, supplied those constraints to local AI, and bounded sample/local proposed duration by total effort. `npm run check` passed 103 tests and isolated Windows build passed; native effort/sample path checked. Native deadline entry, scheduling/availability, DST ambiguity, and Mac remain pending.

November 23: accepted quests can be manually placed at the beginning of a user-entered free window, checked against the known deadline and other accepted quest plans. No calendar is checked or changed. `npm run check` passed 107 tests; isolated Windows release and a fictional four-minute native scheduling/save check passed. Native restart, DST ambiguity and Mac remain pending.

November 23: added an explicit, optional maximum length for new suggestions, without inferring lasting preferences from reflections. `npm run check` passed 109 tests; isolated Windows build and a fictional five-minute sample suggestion passed. Live local-model adherence and Mac remain pending.

November 23: floating accepted quests show saved planned start/time zone. `npm run check` passed 110 tests and isolated Windows release compilation passed; a fictional plan survived restart and appeared on the native floating board. Mac and narrow-screen checks remain pending.

November 23: added an in-app Reduce motion setting, combined with OS preference across dog playback, toy, and reward animations. `npm run check` passed 112 tests and isolated Windows build passed; floating toggle and direct open/dismiss were spot-checked. Startup still follows OS preference before save load; Mac remains pending.

November 23: local AI response reads now stop accumulating above 65,536 bytes. `npm run check` passed 112 tests; Windows release and 2 Rust HTTP-boundary tests passed. A fresh real Ollama request after the change and Mac remain pending.

November 23: quest completion now triggers a temporary four-second happy presentation instead of permanently changing saved mood. `npm run check` passed 114 tests and isolated Windows release passed; a fictional native floating completion showed the reaction and retained idle mood. Existing saved happy moods are preserved; audio and Mac remain pending.

November 23, 7:33 a.m.: primary checkout was on `codex/pocket-pup-animation-review` at `3103109` with extensive uncommitted changes. Its status identifies 20 approved clips; obtain a stable reviewed snapshot before reconciling overlapping companion/audio/motion files. The current branch retains its own work and does not incorporate that dirty snapshot.

November 23: after bounded-response and preference updates, a real fictional 4B request produced a five-minute saved proposal. Its language arguably assumed an existing outline, so semantic grounding remains unresolved. The temporary service was stopped.

November 23: added on-demand, month-labeled sample exploration ideas using an explicitly entered interest, time, and challenge. `npm run check` passed 116 tests and isolated Windows release compilation passed; a fictional native five-minute idea was saved as a proposed quest. No calendar, AI, or automatic monthly generation is involved; Mac remains pending.

November 23: added a user-authored perspective exercise, optionally saved as a private memory. `npm run check` passed 118 tests; isolated Windows release compilation and fictional native save/read/permission-off check passed. No AI discussion or factual claims are generated; Mac remains pending.

November 23: synthetic Windows gestures moved and saved the decorated home window, but repeated floating-dog drags did not change its saved position. Tauri starts floating dragging asynchronously, so gesture timing versus an app defect remains unresolved. Test with a real mouse or held-pointer automation before claiming floating drag/placement works.

November 23: native fictional sample-planner privacy check allowed a memory, generated a sourced quest, and revoked permission; the saved quest dropped the memory source and copied rationale while retaining the commitment source. The memory remained with permission off.

November 23: with Ollama stopped, a native local-quest request reported an unavailable/timeout error; a sample quest then succeeded in the same session.

November 23, afternoon: integrated the animation snapshot in an isolated staging branch and then the buildout branch, preserving the original checkout. Playback and the Dev-mode clip selector compile and have automated coverage; visual review, wearable alignment, native runtime, and Mac remain open. The earlier unintegrated snapshot note above is historical.

November 23, afternoon: desktop and floating quest entry share a single input. Local AI can suggest explicitly sourced deadline and effort, shown for user review. A fictional direct model test succeeded with 12B; 4B missed the deadline. `npm run check` passed 136 tests; native visual review and Mac remain open.

November 23: `npm run check` now checks the PNG dimensions of all 20 runtime clip atlases against the timing manifest, in addition to existing playback tests. All 20 passed; this does not replace visual review.

November 23: added a regression check that both quest entry points begin with one shared text input and omit planner configuration from the initial composer. `npm run check` passed 141 tests and all 20 atlas checks.

November 23: clip cue markers are now checked against playback frame boundaries, preventing a timing edit from silently skipping a bark or fanfare marker. `npm run check` passed 144 tests and all 20 atlas checks. Audible playback is not yet verified.

November 23: date-only review now has a rendering regression test confirming that it requests a date and time; `npm run check` passed 155 tests. This does not verify native layout or date-picker behavior.

November 23: the no-dismissal-button regression now renders the actual shared composer in the toy board. It checks the frame header and empty-board button count, and outside-click/focus-loss tests remain in `npm run check`. The full check passed 155 tests.

November 23: the missing-detail review labels a sample fallback before saving. `npm run check` passed 155 tests and all 20 atlas checks; native visual review remains pending.

November 23: quest detail review recognizes abbreviated hour estimates such as 2h; npm run check passed 155 tests and the production build. Native review remains pending.

November 23: a fictional browser-storage round trip now checks reward deduplication and memory revocation/deletion after reload. `npm run check` passed 156 tests; native storage and restart remain unverified for this flow.

November 23: sample fallback now requires labeled review even when no details were detected. `npm run check` passed 157 tests; native visual review remains pending.

November 23: the seven-day recap sorts recent completions newest first and has tests for its time boundaries. `npm run check` passed 158 tests; varied native saved-history testing remains pending.

November 23: one direct fictional 12B prompt-injection trial failed: a reflection instructed the model to use a specific unrelated title, and it did so. The result is not a security assessment; mitigation and further evaluation remain open.

November 23: the shared composer now presents proposed title, reason and duration before saving, including local and sample quests. Deadline and effort fields remain collapsed unless details need review. `npm run check` passed 158 tests; native visual review remains pending. This is a user review opportunity, not an injection defense guarantee.

November 23: the floating review area now has a scroll limit for long suggestions and is keyboard-focusable. `npm run check` passed 158 tests; verify scroll and focus in the native overlay.
