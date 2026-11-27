# Wardrobe batch 04

November 25, 2026. Designs remain provisional pending art review.

| Item | Standing | Sitting | Browser playback |
| --- | --- | --- | --- |
| Cozy bathrobe | [Screenshot](batch-04-robe-stand.jpg) | [Screenshot](batch-04-robe-sit.jpg) | [Stand to sit](batch-04-robe-sit.gif) |
| Cucumber spa | [Screenshot](batch-04-spa-stand.jpg) | [Screenshot](batch-04-spa-sit.jpg) | [Wake](batch-04-spa-wake.gif) |
| USC hoodie | [Screenshot](batch-04-usc-stand.jpg) | [Screenshot](batch-04-usc-sit.jpg) | [Welcome walk](batch-04-usc-walk.gif) |

The stills show the Tailscale wardrobe. The clips were sampled from the running Companion page with Sound off and start shortly after the trigger. Each outfit was unlocked through Dev mode and equipped through the normal wardrobe. The USC hoodie remained equipped after a browser reload, stood and sat with Reduce motion enabled, and remained equipped after Dev mode was turned off. The Cucumber spa outfit was unlocked and equipped in the native Windows wardrobe and visually checked in Companion and the floating window. It remained equipped after closing and relaunching the native test app with the same isolated profile.

Continue checking every expression and transition for each outfit. Pay particular attention to the shape change near the end of stand to sit, the spa towel and cucumbers during loaf and wake, and overlapping glasses or hats. Native bathrobe and hoodie coverage, Mac runtime, and user art approval remain open.

## Expanded playback audit and fit corrections

Cozy bathrobe, Cucumber spa, and UFC hoodie (previously USC hoodie) each completed the live muted cycle through seated happy and tired, loaf, sleep, wake to loaf, and a first Sit action that stopped in sitting. Reduced-motion stand and sit were checked before refining the resting hems. The [pose comparison](batch-04-rest-audit.jpg) includes updated loaf, sleep, and wake frames for all three. The revision brings each resting hem inward, towards the back of Inu's body.

| Outfit | Stand to sit | Wake to loaf | Loaf to sit | Bark | Welcome walk |
| --- | --- | --- | --- | --- | --- |
| Cozy bathrobe | [Sample](batch-04-robe-audit-lower.gif) | [Sample](batch-04-robe-audit-wakeclip.gif) | [Sample](batch-04-robe-audit-rise.gif) | [Sample](batch-04-robe-audit-bark.gif) | [Sample](batch-04-robe-audit-walk.gif) |
| Cucumber spa | [Sample](batch-04-spa-audit-lower.gif) | [Sample](batch-04-spa-audit-wakeclip.gif) | [Sample](batch-04-spa-audit-rise.gif) | [Sample](batch-04-spa-audit-bark.gif) | [Sample](batch-04-spa-audit-walk.gif) |
| UFC hoodie | [Sample](batch-04-hoodie-audit-lower.gif) | [Sample](batch-04-hoodie-audit-wakeclip.gif) | [Sample](batch-04-hoodie-audit-rise.gif) | [Sample](batch-04-hoodie-audit-bark.gif) | [Sample](batch-04-hoodie-audit-walk.gif) |

Trail cap replaces the spa towel independently of Round glasses replacing the cucumber slices. The robe and visible mask details stay equipped. [Before and after](batch-04-spa-accessories.jpg). The sampled walk clips show frames 2–8 and the standing handoff. The refit remains provisional. Native runtime with the revised geometry and precise transition timing remain open.

## Current Windows fit and seated bark

[Windows fit comparison](batch-four-windows-fit.png) covers all three outfits in Wardrobe, Companion, and the transparent overlay with Round glasses and Mint socks. The spa towel and mask stayed on while the glasses replaced the cucumber slices. The UFC hoodie restored with both accessories after reloading the Windows webview.

A muted UFC hoodie playback check exposed the standing bark atlas replacing the seated dog. The renderer now keeps the current seated, loaf, or sleeping sprite and its equipment and adds a pixel mouth and rays on the bark cue. [Before and after in Windows](batch-four-seated-bark.png). The native run confirmed seated recovery and the reduced-motion bark frame. A separate muted native rest check confirmed that wake returned to loaf and that the following single Sit action ended seated.

Full native playback timing for the three outfits, a process restart with the current robe and hoodie combinations, Mac runtime, and art approval remain open.
