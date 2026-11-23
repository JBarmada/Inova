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
