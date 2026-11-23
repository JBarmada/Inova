# Shared Feature Agreements

The executable source of truth is `src/shared/schema.ts` and `src/shared/actions.ts`. This document explains the agreements. Wardrobe now uses schemaVersion 2 with validated migration from version 1; see [wardrobe contract](WARDROBE_SPEC.md). Coordinate future schema changes and migrations.

## Common rules

- IDs are stable strings; create new IDs with `newId()` and timestamps with `now()`.
- Store timestamps as ISO UTC strings and display dates in the user's locale. Deadline/timezone fields are not implemented yet.
- All persistent changes go through `dispatch`. Feature components never write storage directly.
- One local profile and app window; no multi-user or multi-device sync.
- Read persisted state through the validated storage adapter. Invalid saves must not be silently overwritten.
- Await mutations before announcing success. A failed save must remain visible to the user.

## State and actions

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

## Quest lifecycle and reward agreement

New quests are proposed. Proposed, deferred, or accepted quests can be accepted, deferred, or dismissed. Only accepted quests can complete. Completed and dismissed quests are terminal in the starter.

The floating quest board shows unfinished quests newest first, regardless of status. Completed quests appear in their own newest-first group beneath a Completed (count) disclosure, initially collapsed each time the board opens. Quest creation currently appends to the saved array; display ordering reverses a filtered copy without mutating that array or adding timestamps. The disclosure is temporary presentation state, not a persisted setting. Quest states and reward rules remain distinct from this grouping.

Completing a quest rewards its ID once. The first completed quest unlocks a notebook; the third unlocks a bandana. These are starter demonstration rules, not finalized product balancing. Each item replaces only its assigned wearable slot. Legacy notebook/bandana migrate to the body slot. World toys (up to three), scenery changers (one or two, undecided), and one background are future categories, not worn slots.

The UI cannot equip an unowned item. Changing rewards must keep the quest ID guard intact. Duplicate reward prevention applies to the same quest ID; preventing repeatedly created equivalent quests is a separate unresolved product rule.

## Planning boundary

`Planner.propose(commitment, state)` returns a Promise of a proposed Quest. The current `samplePlanner` has planner label sample and never calls an AI service. Keep this fallback runnable during live-provider development.

A proposed quest must refer to an existing commitment. Additional evidence IDs must belong to memories currently allowed for personalization. The sample interface does not schedule, evaluate grades, or infer sleep. Acceptance does not imply the user completed anything.

To add live AI, extend the planner label deliberately, define validated response fields, and route credentials/network access through the desktop core. Do not move model secrets into frontend environment variables or claim a successful provider connection before checking it.

## Memory boundary

Entries default to excluded from personalization. Include only entries with aiAllowed true when constructing model context. The current starter stores no generated summaries or retrieval index.

Deleting or revoking a memory removes its reference and copied rationale from existing quest records. Future planners must not keep separate untracked copies. If a developer later adds summaries or embeddings, that developer must extend deletion/revocation to those copies.

## Asset and feedback boundary

Pocket Pup posture playback is transient presentation state, separate from persisted `idle`/`happy`/`tired` moods and item ownership. The approved idle path is neutral → 160ms tuck → sit after eight seconds. Approved breathing runs on standing/happy/sitting with 800/450/650/900ms phases and no motion under reduced-motion preference; loops stop while the tuck plays. Bandana follows the chest on inhale; notebook stays grounded.

Next required hierarchy: a mood change must not itself force a sitting dog to stand. Tired sitting should hold for seven seconds before loaf. These new clips and stand-up motion are review-gated and not yet implemented; do not infer their completion from this design agreement. No persisted schema migration is needed for local posture/timer state.

Dog rendering takes shared state; it does not own inventory. Wardrobe writes equipment, and the same DogSprite reflects it in both home and floating mode. Use stable catalog IDs and agreed anchors.

Shared dispatch produces a click or reward tone after successful persistence. Local navigation interactions call the audio service. Recorded barks, door sounds, book sounds, richer fanfare, and polished effects remain track work. Do not invent a separate sound setting.
