# Game Feel and Sound Reactions

Established direction: the app should feel like a pixel game. Reactions are part of the experience, including small actions, dog interactions, doors, and rewards.

# Interaction and reaction map

| Action or event | Visual reaction | Sound reaction |
| --- | --- | --- |
| Click an enabled button | Pressed state or small bounce | Short click |
| Choose a dog | Selection highlight and dog reaction | Selection cue |
| Confirm adoption | Dog greeting and confirmation | Bark and short welcome cue |
| Drag the dog | Pick-up pose, then landing reaction | Soft pick-up and drop cues |
| Ask the dog to woof | Bark animation or speech effect | Actual dog bark |
| Open a door | Door opening animation | Door opening sound |
| Open a book | Cover or page opening | Book opening or page rustle |
| Equip a cosmetic | Preview changes immediately | Equip cue |
| Use a treat | Dog reacts to eating | Eating or happy dog cue |
| Use a toy | Dog plays with the item | Toy-specific sound |
| Complete a quest | Completion effect and dog response | Success cue |
| Unlock an item | Reveal the item, its name, and why it unlocked | Fanfare |
| Reach an evolution milestone | Distinct transformation sequence | Larger celebration cue |
| Submit an action | Acknowledgment or visible waiting state | Short confirmation cue |
| Action fails | Readable explanation and recovery option | Gentle error cue |

Treats, toys, doors, and book interactions receive these reactions whenever those features are implemented. Their presence here does not put every feature in the first release.

# Presentation rules

- Keep menus, rooms, icons, effects, and dog art consistent with the pixel theme.
- Favor readable text over tiny decorative pixel lettering, especially in memories.
- Recognize an action immediately, even if an AI response is still loading.
- Distinguish reward sizes so a new item feels different from a normal click.
- Explain what unlocked and which experience earned it.
- Do not depend on sound alone to communicate success, failure, or an unlock.

# Proposed comfort controls

Provide mute, volume, and reduced-motion controls. Muting preserves visual reactions. Avoid overlapping repeated fanfares or continuous barking from rapid clicks. Quiet or paused companion behavior should be available during focused work.

# Completion check

For every implemented action, verify its visible response and assigned sound, then repeat with sound muted. Confirm that the user can still understand what happened.
