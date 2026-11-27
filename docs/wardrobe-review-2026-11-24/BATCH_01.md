# Wardrobe batch 01

November 25, 2026. Busy bee is the reviewed starting point. The following variants are provisional.

| Item | Standing | Sitting | Representative browser playback |
| --- | --- | --- | --- |
| Fancy mustache | [Screenshot](batch-01-mustache-stand.jpg) | [Screenshot](batch-01-mustache-sit.jpg) | [Sit](batch-01-mustache-sit.gif) |
| The bob | [Screenshot](batch-01-bob-stand.jpg) | [Screenshot](batch-01-bob-sit.jpg) | [Welcome walk](batch-01-bob-walk.gif) |
| The Lorax | [Screenshot](batch-01-lorax-stand.jpg) | [Screenshot](batch-01-lorax-sit.jpg) | [Bark](batch-01-lorax-bark.gif) |

The browser stills show the built Tailscale wardrobe with temporary Try on selected. The playback GIFs are sampled screenshots from the running Companion page. Each recording shows one representative clip and starts after the trigger was pressed. The test browser successfully used Dev unlock and normal wear controls for each costume. The automated suite checks the catalog's unlock gating, equip, unequip, serialized save round-trips, and the new registrations.

The Lorax also passed native Windows Dev unlock, equip, and visual inspection in Wardrobe, Companion and the transparent floating overlay using a fresh test profile at port 1442. The new native development build compiled and launched. Fancy mustache and The bob still need native visual verification.

Remaining verification for the batch: the full mood, sleep, wake and transition matrix, accessory combinations, muted and reduced-motion playback, native overlay and restart checks, and user art approval. Mac runtime is pending.

## Expanded muted playback audit

The Tailscale Companion page was exercised with sound off and normal motion. Each costume below was equipped through the wardrobe. Inu stood idle, sat, reacted to happy and tired, settled into loaf and sleep, woke to loaf, returned to sitting on the first Sit action, and stood on the next Stand action. The [pose comparison](playback-01-poses.jpg) uses screenshots captured from the live controls. The first loaf still for Fancy mustache and The bob catches entry into loaf, before the compact rest art.

| Outfit | Bark samples | End of welcome walk | What to check next |
| --- | --- | --- | --- |
| Busy bee | [Playback](playback-01-bee-bark.gif) | [Settling sample](playback-01-bee-walk.gif) | Confirm the body and expression at every rest transition frame. The walk still bobs the standing art. |
| Fancy mustache | [Playback](playback-01-mustache-bark.gif) | [Settling sample](playback-01-mustache-walk.gif) | The mustache stays attached but hides much of the mouth during rest. Review its height against the bark and sleep frames. |
| The bob | [Playback](playback-01-bob-bark.gif) | [Settling sample](playback-01-bob-walk.gif) | The fringe leaves the muzzle clear in the captured poses. Verify the full walk and native overlay. |
| The Lorax | [Earlier recording](batch-01-lorax-bark.gif) | Pending | Repeat the full muted rest and walk audit. |

The walk samples capture the end of the entrance and the stationary result. Frame-by-frame gait and transition timing still need inspection. Reduced motion, native restart, and additional accessory combinations were outside this pass.

### Fancy mustache expression refit

The thinner curls leave a gap below Inu's nose and sit above most of his mouth. The [before-and-after comparison](mustache-expression-refit.jpg) shows standing idle, seated happy and tired, sleep, wake, and the start of bark. The [bark sample](mustache-expression-bark.gif) shows the fitted layer in the live clip. The muted rest sequence again reached sleep, woke into loaf, and returned to sitting on the first Sit action. Native floating fit, the complete walk, and final art approval remain open.

### The Lorax playback audit

The [pose comparison](lorax-rest-audit.jpg) shows the live muted browser run through idle, happy, tired, loaf, sleep, wake, and return to sit. The first Sit action after waking stopped in sitting, and a separate Stand action stood Inu up. Reduced motion reached both poses. The oversized curls still overlap parts of the neutral smile, but the happy opening and sleeping mouth remain visible. [Bark sample](lorax-audit-bark.gif) · [Walk samples and settled pose](lorax-audit-walk.gif).

The walk sampling captured frames 2–4 and 6–8 and the settled standing sprite. The step into the stationary sprite changes the face and tail proportions visibly. Complete gait timing, accessory combinations, and native restart remain open.

### Busy bee stepping walk

Busy bee now alternates its original standing paws in the same eight-step timeline as the shared walk. Only the paw rows are offset, so the face, hood, wings, stripes, and tail hold their positions. The last step restores the complete standing portrait. Live muted browser tests showed frames 2–8 and the settled art, both alone and with Mint socks. Reduced motion held the stationary portrait. [Frame comparison](bee-step-audit.jpg) · [Busy bee clip](bee-step-audit.gif) · [With Mint socks](bee-socks-step-audit.gif).

The gait remains provisional. The socks ride slightly high on the standing Busy bee portrait. Native floating playback for this Bee revision and further accessory fitting remain open.

## Current playback and Windows fit

Busy bee, Fancy mustache, The bob, and The Lorax each completed standing and seated idle, happy, tired, loaf, sleep, wake, first Sit ending in sitting, bark, and the seven moving frames of the current welcome walk. Reduced-motion Sit and Stand worked for all four. Round glasses and Mint socks remained equipped with each costume after browser reload. [Live pose comparison](batch-01-current-rest-audit.jpg).

| Item | Sit transition | Wake | Loaf to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Busy bee | [Sit](batch-01-current-bee-audit-lower.gif) | [Wake](batch-01-current-bee-audit-wakeclip.gif) | [Rise](batch-01-current-bee-audit-rise.gif) | [Bark](batch-01-current-bee-audit-bark.gif) | [Walk](batch-01-current-bee-audit-walk.gif) |
| Fancy mustache | [Sit](batch-01-current-mustache-audit-lower.gif) | [Wake](batch-01-current-mustache-audit-wakeclip.gif) | [Rise](batch-01-current-mustache-audit-rise.gif) | [Bark](batch-01-current-mustache-audit-bark.gif) | [Walk](batch-01-current-mustache-audit-walk.gif) |
| The bob | [Sit](batch-01-current-bob-audit-lower.gif) | [Wake](batch-01-current-bob-audit-wakeclip.gif) | [Rise](batch-01-current-bob-audit-rise.gif) | [Bark](batch-01-current-bob-audit-bark.gif) | [Walk](batch-01-current-bob-audit-walk.gif) |
| The Lorax | [Sit](batch-01-current-lorax-audit-lower.gif) | [Wake](batch-01-current-lorax-audit-wakeclip.gif) | [Rise](batch-01-current-lorax-audit-rise.gif) | [Bark](batch-01-current-lorax-audit-bark.gif) | [Walk](batch-01-current-lorax-audit-walk.gif) |

All four were checked while equipped in native Windows Wardrobe, Companion, and floating mode. The Fancy mustache captures include Cozy beanie, Star glasses, and Gold socks. The Lorax curls overlap some of the neutral smile. The happy mouth remains visible. [Native comparison](batch-01-current-windows-fit.jpg) · [Sample of Busy bee stepping and settling in the floating window](batch-01-bee-windows-step.gif).

The combined trial revealed that Busy bee's glasses sat high and the socks missed some paws. The fitted accessories now reuse the shared wearable drawings inside the same pose and squash transform as the Bee portrait. Lenses follow the eyes, and sock cuffs follow the individual stepping paws and disappear in tucked poses. The preview captures standing, sitting, loaf and sleep with Round glasses and Mint socks, plus Trail cap and Star glasses. The Windows Wardrobe, Companion, and floating window were rechecked with Round glasses and Mint socks. [Pose comparisons](batch-01-bee-registered-accessories.jpg) · [Seven-frame walk with socks](batch-01-bee-registered-walk.gif) · [Corrected combination in Windows](batch-01-bee-registered-windows.jpg).

Independent Windows restarts for these items, full native transition timing, and Mac runtime are pending. The newer refits remain provisional.

## Floating walk with glasses and socks

The Windows overlay kept Round glasses on the eyes and Mint socks on the stepping paws during Busy bee's walk with Sound off. The bone toy crowds the paws at the center of the overlay. With Reduce motion on, Play left the same outfit in its seated portrait without sliding in.

An idle timer could expire during the walk and replace the end of the stepping sequence with a sudden sit. The pose controller now suspends automatic rest while walking and restarts the rest timer at the handoff. A native replay began near the old idle deadline and held the standing outfit through the end. An automated check covers the exact deadline.

[Native comparison](batch-01-bee-floating-accessory-walk.png) · [Sampled playback](batch-01-bee-floating-accessory-walk.gif). The captures use a cropped sprite area and the gray desktop behind the transparent window was masked. The GIF combines moving samples and the corrected standing endpoint.

### Floating toy clearance

The toy and its board anchor now sit 12 CSS pixels lower. A Windows retest showed a visible gap between the Mint socks and the toy while Busy bee sat, stood, and walked. The board opened in the same window and the compact toy disappeared. Clicking the dog outside the board and pressing Escape each dismissed the board and brought the toy back. The Dev pose and playback controls remained visible below the toy. [Before and after](batch-01-bee-floating-toy-clearance.png), cropped with the desktop background masked.

### Lorax muzzle refit

The two golden curls now sit outside the lower smile and join the nose line with a narrow fringe. The orange brows follow the head position independently of the muzzle. The normal wardrobe showed the revised neutral smile in stand and sit. In the muted Windows companion and floating views, the happy mouth, bark, tired face, loaf, sleeping mouth, and waking smile remained readable. After waking to loaf, one Sit ended in sitting. The sampled walk held the curls in place and settled standing.

[Before and after plus native expressions](batch-01-lorax-muzzle-windows.png) · [Sampled Windows playback](batch-01-lorax-muzzle-windows.gif). Floating captures were cropped and the desktop behind them was masked. The GIF is a montage of samples from separate actions with illustrative timing. Art review and Mac playback remain open.

### Windows restart with Dev mode off

The Lorax and Busy bee each restored after a separate, graceful Windows process exit and relaunch in the isolated Mochi profile. Busy bee restored alongside Round glasses and Mint socks. In Wardrobe with Dev mode off, all three showed Wearing, and The Lorax was available through Wear. Removing the Bee from the body slot left the glasses and socks equipped and kept Busy bee available through Wear. The preview server stayed running across both exits. The screenshots reflect the idle pose at capture time. [Before and after both restarts](batch-01-windows-restart-lorax-bee.png).

Fancy mustache and The bob each restored after their own Windows process exit and relaunch, with Round glasses and Mint socks still equipped. Dev mode was off for both exits and launches. Switching from Fancy mustache to The bob replaced the body slot and left Fancy mustache available through Wear. Removing The bob after relaunch also kept it available to wear and left both accessories equipped. The isolated profile used one-click unlock to prepare the two ownership records. [Before and after the two restarts](batch-01-windows-restart-mustache-bob.png).

All four outfits in the first batch now have dedicated Windows restart evidence. Mac playback and art review remain open.
