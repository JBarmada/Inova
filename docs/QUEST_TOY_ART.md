# Quest toy integration and art

Implemented in the isolated `fix/window-layout` branch, `.worktrees/window-layout`. This extends the toy prototype from the other worktree, inspected at `70d3fd5`, rather than replacing the shared checkout or its in-progress dog artwork.

## Selected interaction

The floating dog carries a small gold-and-teal toy with an active quest count. Clicking it opens an illustrated adventure board. All non-dismissed quests appear, with proposed/deferred quests offering a toy-shaped Fetch action and accepted quests offering completion. Completed adventures remain visible. The board grows with more rows until the monitor-height allowance requires internal list scrolling. Home and floating placement remain separate.

At the top, type a commitment and press check (or Enter). This saves the commitment and proposes a deterministic sample quest. Accepting that proposal is a separate, explicit toy action. The existing reducer validates transitions, persistence, and rewards; no new persisted schema is introduced. Quest titles are formatted for display only. This is not live AI.

## Assets and generation briefs

Both PNGs were generated with the built-in image generation tool, then copied into this worktree. Their transparent alpha is preserved. The user's third screenshot supplied visual direction: gold rubber bone ends, dimples, teal/orange braided rope, and a cream reading surface. Its original pixels are not shipped as an asset. No external stock asset or redistribution license is claimed. Team distribution licensing remains undecided.

- `public/art/quest-toy-icon-v1.png`: standalone horizontal dog chew toy; rounded golden rubber bone ends with raised dimples and warm highlights, teal-and-orange braided rope through the center; crisp detailed pixel-art game inventory style, transparent background, generous margin, no lettering or scene.
- `public/art/quest-toy-frame-v1.png`: complete pixel-art game UI frame; golden rubber bone corners with dimples, braided teal/orange top and bottom rails, slim golden side rails, large blank cream center; centered and fully visible, transparent outside, no lettering, icons, characters, or baked-in UI. Designed for a nine-slice responsive quest panel with real HTML text.

The current frame uses CSS border-image with fixed-size corners and stretched rails/center. This preserves readable real text as the list grows. The art is a generated visual treatment, not a finalized palette-limited sprite atlas. Original placeholder dog art remains in this worktree; integrate the other chat's selected dog separately.

## Validation and review

- `npm run check`: 18 tests, TypeScript, source-size limits, and Vite production build passed.
- `npm run tauri build -- --no-bundle`: Windows release compilation passed.
- Browser: three fictional quests shown together; added a fourth from the composer, then accepted it with its toy action. Reviewed the expanded frame, small toy, and internal list scrolling.
- Native runtime placement/resizing and Mac appearance still require manual checks. Moving between monitors with different work heights while already floating also needs review.

Run this worktree's desktop app using `npm run desktop`. Close any other native Inova instance first because the application identifier/data directory is shared. For a separate fictional art review, use `npm run dev -- --port 1423` and open `http://127.0.0.1:1423/dev/toy.html`. Do not use that fixture entry on your usual browser-preview origin; it adds demo records to that origin's local store. It is development-only and excluded from the production entry.

Review steps: open toy; confirm all quests are reachable; add a commitment; fetch its proposal; complete it; close with Escape; verify window returns to compact width; repeat muted and on Windows/Mac. Preserve actual source/reason records and the sample-planner disclosure when polishing copy.
