# Track A Companion and Desktop

Choose one of the three builders for this track. Branch suggestion: feature/companion. Read ../SETUP.md, ../ARCHITECTURE.md, and ../SHARED_CONTRACTS.md first.

## Your complete feature

A student adopts a dog, keeps it on their desktop, interacts with it, and returns to the home interface. The dog reflects shared mood and equipped-item state. Core controls remain usable with sound muted.

## Start in these files

- src/features/companion/PetPanel.tsx and DogSprite.tsx.
- src/services/desktop.ts and audio.ts.
- src/styles-dog.css and future companion-specific styles.
- src-tauri window configuration and capabilities when needed.

You are also the initial integration coordinator for src/App.tsx, dependency/config changes, and shared styles. This does not mean you own the other developers' feature code.

## First small milestone

Run npm run desktop on Windows and a Mac. Adopt, enter floating mode, drag by the dog area, and return home. Record exact issues with transparency, focus, window size, scaling, and multiple monitors. The source includes native controls, but hands-on behavior still needs confirmation.

## Next increments

1. Keep compact controls to Home and Settings pixel icons. Settings contains sound and dev-mode toggles; manual mood/test buttons appear only in dev mode. Preserve/restablish useful window position and dimensions.
2. Replace the placeholder dog with a small consistent sprite set and real expressive frames.
3. Add dog interaction with a real bark plus an appropriate visual reaction.
4. Improve adoption with the desired small variant picker once the art set is ready.
5. Add controlled sound playback and distinguish click, bark, and reward sounds; coordinate book/item cues with Track C.

## Agreements

Use shared pet and inventory state. Do not independently persist outfits or rewards. Give Track C supported poses, canvas size, attachment anchors, and layer order before they create items. Call the shared audio service and respect muted/reduced motion.

Click-through is not yet implemented. If adding it, ensure the dog remains clickable/draggable and the user can always return to controls. Do not create a second window without coordinating state synchronization.

The user wants a compact pixel-style status chip rather than a full-width rectangular message banner. The mode-change success message is removed. A Settings toggle controls the optional status summary and defaults off. In floating mode, controls and enabled status reveal on dog hover or keyboard focus, and stay reachable while interacting with controls or Settings. Future emotional cues should increasingly come from the dog itself, such as an exclamation mark for excitement; designing those cues is deferred to the companion discussion.

## Acceptance demonstration

Adopt; float over another ordinary app; drag; interact and hear a bark; mute and repeat with visible feedback; equip an item through Track C's screen and see it on the floating dog; return home; restart without losing adoption/equipment.

## Paste into your AI

> Read AGENTS.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, docs/SHARED_CONTRACTS.md, and docs/tasks/A_COMPANION.md. I own Track A. Inspect the current code, preserve other tracks, and begin with the Windows/Mac overlay checkpoint. Keep each increment runnable and report what still needs human testing. Do not rebuild the project scaffold or invent new state stores.
