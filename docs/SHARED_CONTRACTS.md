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

`correct-chat-memory` replaces the text of a user-selected existing entry after validating the source user message, full selected-memory snapshot and optional suggestion. Its category, permission, creation date and quest linkage remain intact. It uses the normal edit invalidation for dependent replies and quests; it does not erase the separate conversation transcript or infer which memory needs correction.

Local companion replies use `chat-reply` with a user-message snapshot and up to three permitted memory snapshots. Chat ranks these with word overlap and limited English topic cues, falling back to recency; this is heuristic and can select irrelevant or miss relevant memories. The reducer rejects stale snapshots and stores source IDs with the reply; changes or permission revocation remove the dependent generated text. Earlier builds can drop these IDs, so must not save a newer profile containing generated replies. The model cannot mutate memories, quests or rewards.

For a shared message, the UI first persists `chat-share`, then requests a reply and persists `chat-reply`. A reply failure does not roll back the original message; users can retry. A message-save failure must not send the message to the model. Stopping the wait invalidates a pending reply before it starts saving; the original message remains and the underlying native request may continue running. Once saving starts it is allowed to finish.

`chat-plan-message` uses a matching user-authored chat message as the new goal only when no other goal is in progress. It appends a scripted clarification prompt without duplicating the original message or creating a quest. A limited English phrase check varies the question when deadline or progress wording is present; it does not store a parsed deadline. The existing preview and explicit acceptance remain required.

Resolved reflection prompts add their completed quest IDs to a deduplicated follow-up list; legacy single follow-up IDs are included. Starting or abandoning a follow-up does not consume it. Successful acceptance of a next quest removes only its associated choice. Clearing the conversation preserves these quest follow-up choices and pending reflections. Older builds can drop the new list and must not save a profile relying on multiple choices.

A local follow-up may include a completed quest title that depends on memories only when all supporting memories are permitted and fit within the three-memory limit. Those sources are reserved in the request, carried into the new proposal and revalidated on acceptance. If any dependency is unavailable or exceeds the limit, the title is omitted. A related reflection competes for remaining context capacity. This does not ensure the model avoids repeating completed work.

Quest previews allow the user to edit the first quest title and duration before saving. A changed title no longer carries its original generated reason; multi-step chat plans discard later suggested steps when the first title changes. For saved follow-ups, acceptance validates the original saved-plan snapshot and the remaining steps before consuming it. The reducer continues to enforce effort, quest length and acceptance rules.

In a multi-step chat preview, skipping the first suggestion changes only the transient draft; it does not accept a quest. The next suggestion becomes the reviewed first quest, the original explanation is discarded, and source IDs and evidence snapshots remain subject to the normal acceptance checks. For saved plans, acceptance also checks the full original plan and selected position; skipped suggestions are discarded only when the new quest is accepted. A wording-overlap warning is advisory and is not a semantic duplicate check.

The desktop and floating direct composers use the same multi-step planner without inheriting an unrelated chat follow-up. Their explicit acceptance atomically saves the first accepted quest and retained suggestions, validates current permissions and plan limits, and leaves the chat state unchanged. The sample remains labeled. Outside-click, focus-loss and Escape dismissal remain the toy frame's controls.

Home-chat acceptance also records a historical summary of the accepted title and suggestions as they stood at acceptance, unless the transcript is full. It carries the quest's memory source IDs and is invalidated when those memories change. Because its exact source-message links are unknown, it is excluded from recent model context whenever any user message is excluded. Direct acceptance leaves chat unchanged; unaccepted previews are not saved.

Home-chat goal clarification may ask one extra question when the first answer supplies only one recognized detail. An optional persisted `clarificationTurns` field bounds this to one extra turn and is cleared on restart; older saves remain valid. Clues control questions only and do not establish a deadline, progress fact or completed action. The user can skip either question.

Each goal or clarification message remains limited to 240 characters; their combined stored goal is limited to 724, including separators. Existing saves remain valid. Older builds validate the active chat goal at 240 characters and may reject a newer save while a longer goal is in progress; do not open such a profile with an older build. Planning and follow-ups preserve the complete combined goal.

When a model suggests a deadline, explicit ISO dates, US numeric month/day dates and full month-name dates in its quoted evidence must agree with the suggested calendar date; years are checked when written. Existing weekday and explicit-time checks still apply. These checks are not a complete natural-language or relative-date interpreter; the user reviews all suggestions.

For “today,” “tonight,” “tomorrow” and “day after tomorrow,” the suggestion must also match the captured local calendar date sent in the same model request. Some ambiguous or negated phrasing is rejected conservatively and requires user review. Other relative expressions are not fully validated.

Explicit noon, midnight and unambiguous 24-hour time suggestions must match their evidence. Multiple alternative times and unqualified 12-hour clock times do not establish a time; when the date is supported it remains available for the user to complete in review.

Local chat may suggest `offerQuest`; the client applies a conservative phrase check before displaying a plan offer. The user must explicitly start or dismiss the offer, and starting validates the originating message and consumes that offer. Model output cannot create a quest; manually choosing a message remains available when the check misses a goal.

When the user explicitly enables recent conversation context, the request may also send at most four earlier user or eligible dog messages of at most 240 characters each. Dog messages must have tracked source IDs, and every such ID must be in the current permitted memory snapshot; the resulting reply inherits that snapshot's source IDs. For certain short English follow-ups, the selection prioritizes permitted sources from the immediately preceding dog reply within the existing three-memory limit. Untracked or out-of-scope dog messages are excluded. The reducer rechecks the role, text, source IDs and memory snapshot before accepting a reply. Conversation context and approved memory records are separate: deleting a memory does not erase the transcript or facts supplied through user messages; clear the conversation to remove the transcript and replies. This switch is not persisted. Model replies are fallible and are not evidence of personal facts.

Individual user messages can be excluded from recent context without deleting them. New dog replies persist direct and transitive user-message context indices; their eligibility is rechecked against exclusions. Replies with unknown legacy context and their descendants are omitted while an exclusion exists. Exclusion does not affect explicitly requested messages, permitted memories, already sent requests, other user statements or previously stored replies. Older builds can discard exclusion and lineage fields and must not save profiles relying on them.

Local chat may return a proposed `memoryQuote` and `memoryCategory`. Only a nonempty exact quote from the current message without a question mark is offered, and the reducer rechecks the quote and source. The suggestion remains conversation data; it is never a saved memory or permission grant until the user reviews and explicitly saves it. Text matching cannot establish importance, truth or whether a preference is inferred.

Saving a specific suggestion validates its source and reply index and resolves that suggestion in the same mutation as adding the reviewed memory; dismissal resolves it without adding a record. Existing memories suppress suggestions matching after case, Unicode, apostrophe style, whitespace and final period/exclamation normalization. Neither behavior merges semantically similar memories or edits an existing record.

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
