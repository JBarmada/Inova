# Wardrobe batch 02

November 25, 2026. These designs are provisional pending art review.

| Item | Standing | Sitting | Browser playback |
| --- | --- | --- | --- |
| Army hat | [Screenshot](batch-02-army-stand.jpg) | [Screenshot](batch-02-army-sit.jpg) | [Bark](batch-02-army-bark.gif) |
| Toad | [Screenshot](batch-02-toad-stand.jpg) | [Screenshot](batch-02-toad-sit.jpg) | [Welcome walk](batch-02-toad-walk.gif) |
| Flower | [Screenshot](batch-02-flower-stand.jpg) | [Screenshot](batch-02-flower-sit.jpg) | [Wake](batch-02-flower-wake.gif) |

The stills show the built Tailscale wardrobe. The playback clips come from sampled screenshots of the Companion view with sound muted and begin shortly after the trigger. Browser Dev unlock and regular equip worked for each item. Flower reached loaf and sleep from tired sitting, woke into a loaf posture, and returned to sitting with the Dev Sit action. Flower remained equipped after reload and reached both standing and sitting with Reduce motion enabled.

Toad was unlocked and equipped in the native Windows test profile and inspected in the wardrobe, Companion view, and transparent floating window. Existing slot assignments were preserved, including Army hat's body slot.

Full expression and transition coverage item by item, accessory combinations, native restart persistence, Army hat and Flower in the native overlay, Mac runtime, and art approval remain open.

## Muted and reduced-motion audit

Army hat, Toad, and Flower each completed the same live muted Tailscale sequence in Companion. The run captured standing and seated idle, seated happy and tired, stable loaf, sleep, wake to loaf, return to sitting, and a separate Stand action. Each outfit also reached the stationary sit and stand poses with reduced motion enabled. The [pose comparison](batch-02-rest-audit.jpg) shows the live results.

| Outfit | Bark sample | Sampled walk and handoff | Observed fit |
| --- | --- | --- | --- |
| Army hat | [Clip](army-hat-audit-bark.gif) | [Frames 2–4, 6–8 and settled](army-hat-audit-walk.gif) | The brim stays above the eyes through rest. |
| Toad | [Clip](toad-audit-bark.gif) | [Frames 2–8 and settled](toad-audit-walk.gif) | The vest compacts in rest and the cap leaves the face open. |
| Flower | [Clip](flower-audit-bark.gif) | [Frames 2–4, 6–8 and settled](flower-audit-walk.gif) | The petals keep the face opening clear through sleep and wake. |

The shared welcome walk still changes Inu's proportions visibly at the transition to the stationary artwork. The recordings sample rendered frames and do not establish frame timing. Full transition samples, native fit for Army hat and Flower, restart, combinations, and approval remain open.

### Standing-art walk handoff

The live welcome walk now alternates the paws of the original standing sprite. The first and last atlas frames match that sprite pixel for pixel. The face, body above the paws, and tail remain fixed through all eight frames. The browser check captured frames 2–8 and the stationary happy expression with Toad and Mint socks equipped. The socks follow the stepping paws. Reduced motion held the stationary dog. [Frame comparison](walk-settle-comparison.jpg) · [Toad walk sample](walk-settle-toad.gif) · [Undressed walk sample](walk-settle-bare.gif).

The updated walk is provisional. Busy bee still uses its dedicated standing portrait with a bob that ends level. Native verification and a fresh adoption check for the revised walk remain open.

## Current browser playback and native fit

Army hat, Toad, and Flower completed standing and seated idle, happy, tired, loaf, sleep, wake, first Sit ending in sitting, bark and the current seven moving walk frames with sound muted. Reduced-motion Stand and Sit reached both stationary poses. Round glasses and Mint socks stayed equipped with each outfit after browser reload. [Current pose comparison](batch-02-current-rest-audit.jpg) · [Accessory combinations](batch-02-current-accessories.jpg).

| Item | Sit transition | Wake | Loaf to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Army hat | [Sit](batch-02-current-army-audit-lower.gif) | [Wake](batch-02-current-army-audit-wakeclip.gif) | [Rise](batch-02-current-army-audit-rise.gif) | [Bark](batch-02-current-army-audit-bark.gif) | [Walk](batch-02-current-army-audit-walk.gif) |
| Toad | [Sit](batch-02-current-toad-audit-lower.gif) | [Wake](batch-02-current-toad-audit-wakeclip.gif) | [Rise](batch-02-current-toad-audit-rise.gif) | [Bark](batch-02-current-toad-audit-bark.gif) | [Walk](batch-02-current-toad-audit-walk.gif) |
| Flower | [Sit](batch-02-current-flower-audit-lower.gif) | [Wake](batch-02-current-flower-audit-wakeclip.gif) | [Rise](batch-02-current-flower-audit-rise.gif) | [Bark](batch-02-current-flower-audit-bark.gif) | [Walk](batch-02-current-flower-audit-walk.gif) |

The three outfits were equipped in the isolated Windows profile and captured in Wardrobe, Companion, and floating mode with the same glasses and socks. Army hat clears the lenses, Toad leaves the muzzle open, and Flower's left petals are visible in the native overlay although the tight browser comparison crop trims the outer edge. [Windows comparison](batch-02-current-windows-fit.jpg).

Toad, Round glasses, and Mint socks survived a full native exit and relaunch. The development app again stalled at “Fetching your world…” and required Ctrl+R before showing the saved outfit. [Toad before exit and after relaunch](batch-02-toad-windows-restart.jpg).

Army hat and Flower each restored with Round glasses and Mint socks after separate complete Windows exits and relaunches with Dev mode off. Both fresh processes rendered the worn outfit without a webview refresh with the standalone preview server already running. Switching the body item to Flower kept Army hat available through Wear, and Flower remained readable in the floating window after restart. The isolated profile used Dev unlock to prepare ownership. [Army hat and Flower before and after restart](batch-02-windows-restart-army-flower.png).

All three outfits in this batch have dedicated Windows restart evidence. Full native transition timing, Mac runtime, and art review remain open.
