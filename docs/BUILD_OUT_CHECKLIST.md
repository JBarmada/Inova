# Inova build-out checkpoint

Worktree: `.worktrees/inova-complete`, branch `codex/inova-complete`, based on `origin/main` at `851ca60` on November 23, 2026. The primary checkout contains active uncommitted artwork, animation, and documentation; do not copy or replace it without reconciling the owning work. Existing older worktrees are retained.

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

Each feature requires observable acceptance and recorded validation. Distinguish current branch results from work on other branches. Open item: the primary checkout's fitted animation changes are uncommitted and may still be under active review.

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
