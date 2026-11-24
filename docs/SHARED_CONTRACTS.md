# Shared Feature Agreements

The executable source of truth is `src/shared/schema.ts` and `src/shared/actions.ts`. This document explains the agreements. Wardrobe now uses schemaVersion 2 with validated migration from version 1; see [wardrobe contract](WARDROBE_SPEC.md). Coordinate future schema changes and migrations.

## Common rules

- IDs are stable strings; create new IDs with `newId()` and timestamps with `now()`.
- Store timestamps as ISO UTC strings and display dates in the user's locale. Optional manual commitment deadlines and quest plans record their time zone; see the build-out sections below.
- All persistent changes go through `dispatch`. Feature components never write storage directly.
- One local profile and app window; no multi-user or multi-device sync.
- Read persisted state through the validated storage adapter. Invalid saves must not be silently overwritten.
- Await mutations before announcing success. A failed save must remain visible to the user.

## State and actions

New adoption can persist a `pet.personality` of `cute`, `mean`, `sad`, or `happy`; the adoption screen chooses one randomly. Absence means legacy neutral text, not an inferred personality. Personality controls text tone only and is separate from `pet.mood`, animation and reward rules. Older builds can discard this optional field.

Memory entries may have a user-selected `people`, `events`, `you`, or `misc` category; absent categories display as Misc for older saves. `memory-category` updates only this classification, leaving text and AI permission intact. Older app versions may drop this optional field when saving.

`save-chat-memory` requires a matching user-authored conversation message and creates an explicitly reviewed entry marked `source: chat`; personalization is selected separately by the user. The saved text may be edited during review and is not asserted to be a verbatim transcript. Deleting the memory removes it from maintained planning retrieval and dependent quest copies, but does not delete the independently persisted conversation transcript.

Local companion replies use `chat-reply` with a user-message snapshot and up to three permitted memory snapshots. The reducer rejects stale snapshots and stores source IDs with the reply; changes or permission revocation remove the dependent generated text. Earlier builds can drop these IDs, so must not save a newer profile containing generated replies. The model cannot mutate memories, quests or rewards.

For a shared message, the UI first persists `chat-share`, then requests a reply and persists `chat-reply`. A reply failure does not roll back the original message; users can retry. A message-save failure must not send the message to the model.

When the user explicitly enables recent conversation context, the request may also send at most four earlier user-authored messages of at most 240 characters each. The reducer validates their indexes and text before accepting the response. Conversation context and approved memory records are separate: deleting a memory does not erase the transcript or facts supplied through it; clear the conversation to remove the transcript and replies. This switch is not persisted.

The local companion request also supplies the adopted dog's name as `dogName`; it is distinct from user facts and treated as data. The shared prompt lives in `src-tauri/src/local_chat_prompt.txt` and the fictional manual evaluation harness reads that same file. Prompt examples and keyword checks do not enforce truth or prevent prompt injection.

| Domain | Shared record | Main actions |
| --- | --- | --- |
| Pet | name, adopted, mood | adopt, mood |
| Settings | muted, devMode, showStatus | mute, dev-mode, status-bar |
| Commitment | id, title, createdAt | add-commitment |
| Quest | id, commitmentId, title, reason, sourceIds, minutes, status, planner | propose-quest, quest-status, complete-quest |
| Memory | id, text, createdAt, aiAllowed, optional questId | add-memory, memory-permission, delete-memory |
| Inventory | ownedItems, equipment.{hat,glasses,socks,body} | equip, unequip; developer-gated wardrobe-scenario fixtures; normal rewards grant ownership through quest completion |
| Reward record | rewardedQuestIds | controlled by completion rules, never directly edited by UI |

Mood is idle, happy, or tired. Four wearable slots can be occupied simultaneously; item IDs and slot assignments live in shared/equipment.ts. Normal rewards remain notebook/bandana. Other prototype items use explicit developer fixtures. New moods, slots, or a live planner label require coordinated schema/rendering updates.

Developer mode defaults off. Version-one saves without settings.devMode load it as false through the schema default, preserving existing data and sound preference. Dev mode exposes manual mood/test controls; ordinary quest and wardrobe interactions remain available normally. New debug-only controls must respect this setting. Settings and Home are pixel icon buttons; Home appears only in floating mode. Sound and developer toggles belong inside the settings popover.

The dog status summary is optional through the Settings Status bar toggle and defaults off, including for older saves. In floating mode, icons, developer controls, and enabled dog status reveal on dog hover or keyboard focus. Keep them reachable while moving into the controls and while Settings is open. Home mode keeps normal controls visible. Error feedback is separate from the optional dog status summary.

## Application quit

Use `quitDesktop()` for deliberate application exit. Floating Settings exposes Quit Inova; the native X routes through the same controller. `beginStateShutdown()` stops accepting new dispatches and returns the existing mutation queue. If native exit rejects, `cancelStateShutdown()` re-enables mutations. These are runtime lifecycle controls, not persisted fields. Shutdown waits at most three seconds for queued progress/placement work before requesting native process exit with the last saved state. Do not bypass the controller when adding another quit entry point.

## Quest lifecycle and reward agreement

New quests are proposed. Proposed, deferred, or accepted quests can be accepted, deferred, or dismissed. Only accepted quests can complete. Completed and dismissed quests are terminal in the starter.

The floating quest board shows unfinished quests newest first, regardless of status. Completed quests appear in their own newest-first group beneath a Completed (count) disclosure, initially collapsed each time the board opens. Quest creation currently appends to the saved array; display ordering reverses a filtered copy without mutating that array or adding timestamps. The disclosure is temporary presentation state, not a persisted setting. Quest states and reward rules remain distinct from this grouping.

Completing a quest rewards its ID once. The first completed quest unlocks a notebook; the third unlocks a bandana. These are starter demonstration rules, not finalized product balancing. Each item replaces only its assigned wearable slot. Legacy notebook/bandana migrate to the body slot. World toys (up to three), scenery changers (one or two, undecided), and one background are future categories, not worn slots.

The UI cannot equip an unowned item. Changing rewards must keep the quest ID guard intact. Duplicate reward prevention applies to the same quest ID; preventing repeatedly created equivalent quests is a separate unresolved product rule.

## Planning boundary

`Planner.propose(commitment, state)` returns a Promise of a proposed Quest. The current `samplePlanner` has planner label sample and never calls an AI service. Keep this fallback runnable during live-provider development.

A proposed quest must refer to an existing commitment. Additional evidence IDs must belong to memories currently allowed for personalization. The sample interface does not schedule, evaluate grades, or infer sleep. Acceptance does not imply the user completed anything.

To add live AI, extend the planner label deliberately, define validated response fields, and route credentials/network access through the desktop core. Do not move model secrets into frontend environment variables or claim a successful provider connection before checking it.

## Shared quest entry

Home and floating use the same composer and attempt the selected local model, falling back to a visibly labeled sample when planning fails. `add-planned-quest` atomically validates and saves the new commitment and proposal, including current allowed-memory snapshots and duration settings. Model output remains a proposal; acceptance and rewards remain user-controlled. Free text does not yet populate a deadline or total effort.

## Exploration ideas

The optional on-demand sample idea uses only the interest, available time, and challenge entered in its form. Saving dispatches `add-exploration`, which atomically creates a commitment and a proposed sample quest, validates their relationship and the current suggestion-length limit, and leaves acceptance and rewards to the usual quest rules. It does not consult a calendar or schedule an automatic recurring suggestion.

## Memory boundary

Entries default to excluded from personalization. Include only entries with aiAllowed true when constructing model context. The current starter stores no generated summaries or retrieval index.

Deleting or revoking a memory removes its reference and copied rationale from existing quest records. Future planners must not keep separate untracked copies. If a developer later adds summaries or embeddings, that developer must extend deletion/revocation to those copies.

## Asset and feedback boundary

Pocket Pup posture playback is transient presentation state, separate from persisted `idle`/`happy`/`tired` moods and item ownership. The approved idle path is neutral → 160ms tuck → sit after eight seconds. Approved breathing runs on standing/happy/sitting with 800/450/650/900ms phases and no motion under reduced-motion preference; loops stop while the tuck plays. Bandana follows the chest on inhale; notebook stays grounded.

Next required hierarchy: a mood change must not itself force a sitting dog to stand. Tired sitting should hold for seven seconds before loaf. These new clips and stand-up motion are review-gated and not yet implemented; do not infer their completion from this design agreement. No persisted schema migration is needed for local posture/timer state.

Dog rendering takes shared state; it does not own inventory. Wardrobe writes equipment, and the same DogSprite reflects it in both home and floating mode. Use stable catalog IDs and agreed anchors.

Shared dispatch produces a click or reward tone after successful persistence. Local navigation interactions call the audio service. Recorded barks, door sounds, book sounds, richer fanfare, and polished effects remain track work. Do not invent a separate sound setting.

## Manual dog controls and toy dismissal

All manual dog pose, mood, animation and future direct controls must live inside `DogDeveloperControls`, whose shared gate requires adoption and settings.devMode in home and floating mode. PetPanel's normal-mode render tests reject any new dog buttons outside this gate. Automatic posture/face/breathing behavior, adoption, navigation, quests, equipment and wardrobe-only previews retain their existing behavior.

The floating controls follow the toy/menu in layout. Opening the toy hides its standalone trigger after a stretch transition. Outside clicks, focus loss and Escape retract the menu; no close/minimize/collapse button belongs on the frame. Escape restores toy focus; outside clicks preserve their target. The board render test forbids a redundant dismissal button, and outside-dismiss tests protect inside/outside targeting, focus-loss dismissal and listener cleanup. These run in `npm run check`. Preserve stable canvas width, reduced motion and mute. Animation phase is local UI state, not persisted pet or quest state.

## Editing quest and memory text

Quest titles and durations (1–120 whole minutes) can be edited until completion or dismissal; editing retains IDs, status, source evidence, and rewards. Memory edits retain the entry ID, date, permission, and quest link. A changed memory invalidates copied quest rationale and removes that memory source ID, matching the revocation/deletion cleanup boundary. Unchanged text preserves references.

## Local planner extension (build-out worktree)

Quest planner labels include `sample` and `local`. Local requests use the Rust loopback Ollama boundary and up to three allowed memories. Proposals carry the sent memory text as transient dispatch-only verification; saving rejects changed/revoked evidence. The snapshot is not persisted. Editing, revoking or deleting supporting memories removes local-model title and rationale and their source reference. Manual acceptance, completion and rewards remain deterministic. Older app builds cannot parse quests labeled local.

## Completion feedback (build-out worktree)

The mutation queue provides a transient receipt only after a successful save: whether a completion was awarded and which item IDs were newly owned. Both quest views use it for visible reward feedback; duplicate or ineligible completion produces no new unlock. Receipts are not stored, and reward eligibility remains in the reducer.

## Reflection links (build-out worktree)

A new memory can optionally cite a completed quest ID. The reducer validates that the referenced quest exists and is completed; existing valid standalone memories and saved records remain readable. The bookshelf displays the related quest title without implying that planning or acceptance alone is completion.

## Dated completions and recap (build-out worktree)

New completions from either quest view carry an optional ISO UTC completedAt timestamp; legacy completed quests remain valid without one. Repeated completion cannot change the original timestamp. The local seven-day recap counts only dates in the last 168 hours and never infers dates for older records. Memory counts include private entries without copying their text or changing personalization permissions.

## Outfit shuffle (build-out worktree)

The optional shuffle chooses one owned item per compatible slot and applies the outfit atomically. The reducer and state schema reject unowned items and mismatched slots. It never grants items or changes reward records.

## Sample planner snapshot (build-out worktree)

Proposals that cite memories require transient ID/text snapshots for both the sample and local planners. Saving rejects changed, revoked, or deleted reflection context; snapshots are not stored. This applies in the home page and floating toy.

## Local model choice (build-out worktree)

Settings persist `localModel`, defaulting to `gemma3:12b` for older saves. The only supported values are `gemma3:12b` and `gemma3:4b`; the Rust boundary independently rejects all others. The selection controls future local requests and does not change existing quests. The sample planner remains separate.

## Completion reflections and floating drafts (build-out worktree)

A successful completion reveal offers an optional reflection linked to the completed quest, with personalization disabled by default. Saving uses the existing memory action and validates the completed quest link. The floating board remains mounted but hidden and inert after retraction, retaining unsaved composer/reflection text during the same floating session. Leaving floating mode or quitting discards unsaved drafts. Completed disclosure resets on closing; outside click, focus loss, and Escape remain the dismissal paths.

## Commitment details (build-out worktree)

Manual commitments may have `deadline: { at, timeZone }` (ISO UTC plus IANA zone) and `effortMinutes` (1–10080 whole minutes). Omitted values stay unknown. The main form interprets deadline input in the device local zone and rejects nonexistent local times; ambiguous repeated times use the platform Date interpretation. Existing commitments without these fields load unchanged. The sample proposal does not exceed a supplied total effort; local proposals exceeding it are rejected. Neither planner checks availability or schedules a time. Older builds can drop the optional fields when saving, so do not use an older checkout on current data.

## Manual quest plans (build-out worktree)

An accepted quest may store a plan with UTC start/end, the user-entered availability end, its IANA time zone, and recorded time. The reducer computes the end from quest duration, rejects a past start, a window too short, a commitment-deadline violation, and overlap with another accepted plan. It does not know external calendar events or create one. Duration edits, deferral, or dismissal clear the plan; title-only edits preserve it. Completion retains the historical plan. Plan timestamps and duration are validated on load. Old saves without plans remain valid, but older builds may drop new fields when saving.

## Quest-length preference (build-out worktree)

`settings.questMinuteLimit` is an explicit user-selected maximum for new suggestions; zero means no maximum and is the default for older saves. Both planners respect the maximum and the reducer rejects a new proposal above the current limit, including after an in-flight change. Users may still edit a quest to another duration. The setting does not rewrite prior quests or infer a preference from a reflection.

## Reduced motion (build-out worktree)

`settings.reduceMotion` defaults false for older saves. Effective reduced motion is the logical OR of this setting and the OS preference. Dog playback, toy transition timings and relevant CSS animations use the effective choice; the startup loader has not loaded saved settings and follows only the OS. The setting does not enable developer controls.

## Completion reaction (build-out worktree)

A newly saved completion triggers a transient four-second happy presentation. It does not mutate saved pet mood, and failed or duplicate completions do not trigger it. Automatic reactions do not add manual dog controls. Existing saved moods are not automatically migrated because their origin is unknown.
