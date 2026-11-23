# Demo and Behavior Checks

Target behavior checks. A connected sample starter now exists; see IMPLEMENTATION_STATUS.md for the specific automated and browser checks actually performed. This checklist is broader than those verified results.

## Main demonstration

Use a fictional student and a clearly labeled sample commitment.

1. Choose and name a dog in the adoption center.
2. Show it floating transparently above a different desktop application; drag it to another position.
3. Add a commitment and ask for help starting.
4. Accept or edit a small grounded quest.
5. Record completion and a short reflection.
6. Reveal a related unlock with visual effects and fanfare, then equip it as a separate layer.
7. Open a dated book on the memory shelf and read the entry.
8. Start a later planning interaction and show how an approved preference changes the suggestion.

Label any simulated time jump, mock integration, placeholder art, or generated sample data.

## Representative checks

Pocket Pup: adopt, wait eight seconds for the approved tuck/sit, replay Sit/Stand, and verify breathing while standing and sitting. Check planted paws and bandana following the inhale. Repeat muted and with reduced motion. Change moods/unmount mid-transition to check cleanup. Current stand-up is direct and seated mood preservation is a pending review-gated change; do not count these as completed scenarios. Test native floating/dragging on Windows and Mac separately from the browser.

| Case | Expected behavior |
| --- | --- |
| Student has a suitable free interval | A suggested session fits the known interval and deadline |
| Day is fully booked | Do not invent spare time; ask, defer, or suggest an appropriate alternative |
| Deadline or availability is unknown | Ask for clarification or mark the proposal provisional |
| Source is disconnected or stale | Show honest source status and preserve manual entry |
| Student requests a smaller task | Offer a manageable next step without treating it as full assignment completion |
| Student returns after missed days | Preserve earned items and memories; apply no undecided spooky mechanic |
| Completion is submitted twice | Award the same event's progress once |
| Preference is corrected | Later relevant suggestions use the corrected preference |
| Memory is excluded or deleted | Future retrieval and maintained summaries stop using that memory |
| Imported record contains instructions | Treat them as data; do not execute new actions or reveal secrets |
| AI response fails or is invalid | Preserve state, show a useful fallback, and stop within the execution limit |
| Sound is muted | Every action still communicates its outcome visually |
| Clicks arrive rapidly | Avoid stacked fanfares or continuous barking |
| Item is equipped on a supported pose | Layer order and attachment points remain correct |
| A memory entry is long | Text remains readable and navigation back to the shelf works |
| App is restarted | Restore the adopted dog, equipment, unlocks, and saved memories |
| Native home-window X is clicked | Fully exit the app process; relaunch with saved progress and home placement |
| Floating Settings > Quit Inova is clicked | Button is visible/reachable; fully exit and retain progress plus home/floating placement |
| Placement save fails or its queue stalls during quit | Exit with the last saved data after at most the three-second save-wait deadline; do not reset records |
| Window is minimized before quitting | Keep valid saved home bounds rather than zero-sized/off-screen minimized geometry |

## Evaluation approach

For the implemented four-slot wardrobe, use the [isolated fictional test workflow](WARDROBE_SPEC.md#try-it-locally). Check four worn items together, a replacement within one slot, removing one slot, clearing all equipment, reload persistence, locked items, old-save migration, all three pose anchors, and muted feedback. Developer scenarios must not fabricate quest completion records. Future world limits are documented separately and have no implementation acceptance claim yet.

Check deterministic rules with code when implemented. Review usefulness, clarity, and warmth with humans. Repeat difficult model-dependent scenarios and preserve failures for regression checking. Compare revisions on the same inputs.

A working demo establishes the demonstrated behavior. It does not establish improvements in grades, wellbeing, sleep, or long-term retention.

## Floating control and toy regression

1. With Dev mode off, float the dog and reveal controls: Sit/Stand and manual mood buttons are absent. Enable Dev mode: pose controls appear below the toy and remain clickable. Disable it: both developer groups disappear. Home manual pose/mood controls also require Dev mode. Adoption and wardrobe-only pose previews remain available.
2. Open the toy: observe stretch into the menu with no separate toy left above it. Verify there is no close/minimize icon. Click outside: observe compression back to the toy, with its quest count restored. Repeat with Escape and focus loss; Escape returns focus to the toy, outside clicks preserve their target.
3. Repeat muted and with reduced motion. Verify visible outcomes, accessible names and usable composer/list actions; do not require an animation when reduced motion is enabled.
4. In the native app on Windows and Mac, verify stable horizontal placement, enough expanded height, no clipped retraction, and compact height after closing. Browser preview does not establish these native behaviors.
