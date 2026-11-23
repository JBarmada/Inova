# Track C Wardrobe and Memory World

Choose one builder. Branch suggestion: feature/world. Read ../SETUP.md, ../ARCHITECTURE.md, and ../SHARED_CONTRACTS.md first.

## Your complete feature

A student sees what an experience unlocked, equips an owned item on the same dog used by the desktop companion, writes a reflection, and reopens it as a readable dated book. They control whether that memory may inform suggestions.

## Start in these files

- src/features/world/WardrobePanel.tsx and MemoryShelf.tsx (separate Wardrobe and Memories tabs; the combined WorldPanel was removed).
- src/shared/catalog.ts.
- Add world-specific styles and item/book assets in clearly named paths.
- Coordinate equipment rendering with Track A's DogSprite.

## First small milestone

Complete the starter quest, equip/remove the notebook, save a reflection, and open its dated book. Improve this presentation into a clear pixel wardrobe and shelf without changing the shared persistence boundary.

## Next increments

1. Agree on canvas size, anchors, poses, and layers with Track A.
2. Replace placeholder equipment with compatible pixel assets; keep item IDs stable.
3. Improve item reveal with its name, earning reason, effects, and fanfare in coordination with Track B's completion flow.
4. Make dated spines and the open-book view attractive and readable; handle long text and keyboard navigation.
5. Add memory editing through a coordinated shared Action; preserve permission and deletion behavior.
6. Add dedicated book/equip sounds through the common audio service with Track A.

## Agreements

Reward ownership comes from shared quest progression. Do not add a second inventory store or silently unlock items from the wardrobe UI. The [four-slot wardrobe contract](../WARDROBE_SPEC.md) uses hat, glasses, socks, and body together through shared actions and a versioned save migration. Fictional prototype grants are explicitly labeled, developer-only scenarios. World items remain a documented future phase.

Memories default private for personalization. The bookshelf may display them without giving AI access. Deletion/revocation must use shared actions, and editing requires rechecking any copied/planner-derived information. Do not add cloud storage, real photos, or an embedding system as part of this first track.

## Acceptance demonstration

Show a locked item, earn and equip it, then confirm it appears on the companion. Save a private reflection, open its dated book, permit it for personalization, then revoke it. Read a long entry without clipping. Restart and show persistent equipment and books.

## Paste into your AI

> Read AGENTS.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md, docs/SHARED_CONTRACTS.md, and docs/tasks/C_WORLD.md. I own Track C. Inspect the wardrobe and bookshelf starter, then improve one complete interaction using the existing store. Coordinate item anchors with Track A and unlock rules with Track B. Preserve private memory defaults, readable text, sound controls, and shared action contracts.
