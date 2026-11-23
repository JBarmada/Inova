# Continue the wardrobe work

Handoff requested November 23, 2026. Implementation stopped at the user's request. This file is a continuation prompt, not approval to start more changes in the stopped chat.

## Verified repository state

GitHub main was fetched and inspected at `a661da00db58af8605fe99a647ab6aba54100976` (Consolidate reliable quit, startup feedback, and latest wardrobe controls on main).

Main already contains the latest seven wardrobe UI files, verified line-for-line against the pending files in the old `codex/wardrobe-slots` worktree:

- `src/shared/InterfaceIcon.tsx`
- `src/features/companion/PixelIcon.tsx`
- `src/features/world/ItemGlyph.tsx`
- `src/features/world/WardrobeIcon.tsx`
- `src/features/world/WardrobePanel.tsx`
- `src/features/world/OutfitStrip.tsx`
- `src/styles-wardrobe.css`

Those changes are already preserved on main. Do not reapply the old worktree or merge its stale version of DogSprite, pose handling, schema, or window behavior. Main additionally preserves seated tiredness, grounded breathing, seated clothing anchors, reliable quit, and startup feedback. See [main consolidation](MAIN_CONSOLIDATION.md).

## Latest user direction

The user rejected oversized equipped-item cards and a dog preview too small to inspect clothing. They requested compact equipped icons, a larger dog, one sock instead of a pair in the icon, better human Stand/Sit symbols, the earlier shirt silhouette, and matching hanger designs with more sensible clear-outfit placement.

The latest code attempts that direction with:

- A four-icon currently-worn strip; clicking an occupied slot removes just that item. No large equipped-item cards or repeated item-name paragraphs.
- A larger dog canvas: 384px desktop, 320px up to a 600px viewport, 256px below 370px. These are integer multiples of the 64px source grid.
- Clear outfit beside the worn strip, rather than isolated at the far page-heading edge. It shares the navigation hanger path, with a small remove mark.
- Shared InterfaceIcon geometry for filter icons, item glyphs, navigation hanger, and wardrobe controls. One sock; the older shirt silhouette; redrawn standing and seated people.
- Existing five filters (All four-square grid, hat, glasses, sock, body/T-shirt), only Stand/Sit preview controls, accessible names/tooltips, and no implementation paragraph or transition-study selector.

These latest visual changes have NOT been shown back for user acceptance. Do not describe them as approved or visually verified. Older screenshots in `docs/evidence/wardrobe-slots/` predate this compact-strip/larger-preview revision.

## Checks and limits

- In the old wardrobe worktree, the latest compact-strip code passed `npm run check`: 69 source-file size checks, TypeScript, 45 tests, and frontend production build. That run completed before this handoff, but it does not establish consolidated-main integration results.
- Main's consolidation record reports its own fresh 82-file checks, 65 tests, frontend build, and Windows release build. Those are recorded consolidation results, not checks rerun by this handoff author.
- No browser screenshot, keyboard walkthrough, native build, or Windows/Mac runtime test was performed for the latest compact-strip revision in this chat before stopping.
- Historical icon/filter and four-slot evidence applies to earlier layouts. Keep that distinction when reporting verification.
- The stopped old worktree remains untouched, including its dirty copies; main already contains them. Its preview used port 5194 and may still be serving the historical branch. Do not use that origin as proof of current main without checking the server's working directory.

## Paste this into the next coding chat

```text
Continue Inova's wardrobe UI from the CURRENT MAIN branch in
C:\Users\creat\Desktop\school\Scope Final Project.

Read AGENTS.md, docs/AI_CONTEXT.md, docs/IMPLEMENTATION_STATUS.md,
docs/MAIN_CONSOLIDATION.md, docs/WARDROBE_SPEC.md, and
docs/WARDROBE_CONTINUATION.md. Inspect current Git status and current
code; main may have advanced since this note. Preserve unrelated work.
Do not merge or copy the old pocket-pup-integration/wardrobe-slots tree.

First visually review the already-integrated compact wardrobe revision.
The user wants: a large dog preview; four compact worn-item icons rather
than cards; one sock icon; better human Stand/Sit icons; the older shirt
shape; identical hanger geometry in navigation and clear-outfit controls;
and clear outfit placed beside the items it removes. Keep the five item
filters. Do not restore a transition-study selector or implementation
paragraph. Prefer icons for recognizable actions, retaining accessible
names, hover labels, selected states, and keyboard focus.

Use the shared InterfaceIcon definitions so symbols cannot drift apart.
Check the current design in both narrow (~514px) and desktop layouts
before making further visual claims. Refine only what the visual review
shows is wrong. Keep equipped-item names available in tooltips and
accessible labels. Confirm a worn-slot click removes only that slot,
clear outfit preserves ownership, all five filters work, Stand/Sit
changes only the preview, and reload keeps the actual outfit.

Preserve main's newer approved seated face, grounded breathing,
breathing-aware clothing anchors, four-slot state/save migration,
navigation/quest toy/window layout, reliable quit, and startup behavior.
Do not enable the unapproved loaf transition or change dog art as part
of this UI work. Do not invent new quest unlock rules or world-item code.
Future world capacities remain: three toys, one OR two object/terrain
changers (exact choice unresolved), and one background.

Update any superseded placement rules or wardrobe documentation after
settling the layout: older notes may still put Clear outfit by the page
heading even though the latest code moves it beside the worn strip.
Keep files <=250 code lines and functions <75 code lines. Use the
existing shared state/actions and avoid adding a second inventory store.

Run npm run check and the relevant native build after changes. Save a
fresh screenshot of the final UI, report exactly which browser/native
checks ran, and distinguish recorded results from newly verified ones.
Do not claim Windows/Mac runtime behavior from a browser or compilation.
```
