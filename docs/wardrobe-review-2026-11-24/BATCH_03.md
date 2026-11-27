# Wardrobe batch 03

November 25, 2026. Designs remain provisional pending art review.

| Item | Standing | Sitting | Browser playback |
| --- | --- | --- | --- |
| Lord Farquaad | [Screenshot](batch-03-farquaad-stand.jpg) | [Screenshot](batch-03-farquaad-sit.jpg) | [Welcome walk](batch-03-farquaad-walk.gif) |
| Harry Potter | [Screenshot](batch-03-harry-stand.jpg) | [Screenshot](batch-03-harry-sit.jpg) | [Bark](batch-03-harry-bark.gif) |
| Clown around | [Screenshot](batch-03-clown-stand.jpg) | [Screenshot](batch-03-clown-sit.jpg) | [Stand to sit](batch-03-clown-sit.gif) |

Stills are from the Tailscale wardrobe. The GIFs are sampled from the running browser Companion view with sound muted and begin shortly after the trigger. A browser test profile wore every costume through the normal wardrobe. It retained Clown around and Mint socks after a reload and removed both through Clear outfit. Windows native Dev unlock and equipment worked for Clown around, and its standing fit was inspected in the wardrobe, Companion view, and transparent floating overlay.

Check the remaining animations and reduced-motion behavior by costume. Review how normal glasses pair with Harry Potter's integrated glasses, how the cape changes during Farquaad's posture transitions, and whether the clown should get a fuller party suit to match the concept. Native Farquaad and Harry Potter checks, native restart persistence, Mac runtime, and user approval remain open.

## Expanded playback audit

The [pose comparison](batch-03-playback-audit.jpg) shows live Tailscale captures with sound muted. All three costumes reached standing and seated idle, seated happy and tired, stable loaf, sleep, and wake to loaf. The first Sit action after waking returned Inu to sitting. A separate action stood him up. With reduced motion on, sit and stand both reached their stationary poses.

| Outfit | Stand to sit | Wake to loaf | Loaf to sit | Bark | Welcome walk |
| --- | --- | --- | --- | --- | --- |
| Lord Farquaad | [Sample](batch-03-farquaad-audit-lower.gif) | [Sample](batch-03-farquaad-audit-waking.gif) | [Sample](batch-03-farquaad-audit-rise.gif) | [Sample](batch-03-farquaad-audit-bark.gif) | [Sample](batch-03-farquaad-audit-walk.gif) |
| Harry Potter | [Sample](batch-03-harry-audit-lower.gif) | [Sample](batch-03-harry-audit-waking.gif) | [Sample](batch-03-harry-audit-rise.gif) | [Sample](batch-03-harry-audit-bark.gif) | [Sample](batch-03-harry-audit-walk.gif) |
| Clown around | [Sample](batch-03-clown-audit-lower.gif) | [Sample](batch-03-clown-audit-waking.gif) | [Sample](batch-03-clown-audit-rise.gif) | [Sample](batch-03-clown-audit-bark.gif) | [Sample](batch-03-clown-audit-walk.gif) |

The walk samples show frames 2–8 and the standing handoff. The clips are composed from sampled screenshots. They show art fit but cannot verify exact frame timing.

Farquaad's cape folds into a short collar on the stable rest frames. Harry Potter remains equipped when Round glasses replace the integrated frames. [Eyewear comparison](batch-03-harry-glasses.jpg). The Clown around hat and ruff leave the face readable, though the current outfit still lacks the fuller party suit from the concept. Further review should cover native Farquaad and Harry Potter, complete transition timing, and the clown costume's visual scope.

## Clown around party suit

The [before and after comparison](clown-party-suit-comparison.jpg) shows the fuller striped, spotted suit, red nose and cream ruff. The coat follows the fitted sit sequence and uses a shorter hem in loaf and sleep. Inu's original eyes, mouth and paws remain visible. A separate Trail cap replaces the party hat while the suit and Mint socks stay equipped. [Accessory combination](clown-party-suit-accessories.jpg).

The muted browser run sampled [stand to sit](clown-party-suit-lower.gif), [loaf back to sit](clown-party-suit-rise.gif), [bark](clown-party-suit-bark.gif), and [welcome walk](clown-party-suit-walk.gif). The final shortened fit was checked again through tired, loaf, sleep, wake and return to sit. Reduced-motion sit and stand were checked with the two accessories before the resting hem adjustment. The art is provisional. The fuller suit still needs native floating playback.

## Current Windows fit and browser persistence

[Windows screenshots](batch-three-windows-fit.png) show Lord Farquaad, Harry Potter, and the fuller Clown around suit in Wardrobe, Companion, and the transparent floating window. Round glasses and Mint socks were worn in all nine captures. The separate glasses replace Harry Potter's integrated frames, and each costume retained its silhouette at floating size. In the hosted browser, all three equipped combinations survived a page reload.

Earlier playback samples remain linked above. Full native playback timing, Mac runtime, and art approval remain open.

## Windows process restarts

Lord Farquaad, Harry Potter, and Clown around each restored with Round glasses and Mint socks in a separate Windows process after closing the previous window. The isolated local preview server stayed running across all three exits. All three costumes stayed available after switching off Dev mode, and the Dev unlock controls were absent. [Before and after screenshots](windows-restart-stage-and-pikachu.png).
