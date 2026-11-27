# Wardrobe batch 12

November 25, 2026. The art is provisional pending user review.

| Costume | Standing | Sitting | Muted browser playback |
| --- | --- | --- | --- |
| Britney Spears | [Screenshot](batch-12-britney-stand.jpg) | [Screenshot](batch-12-britney-sit.jpg) | [Happy greeting](batch-12-britney.gif) |
| Goth | [Screenshot](batch-12-goth-stand.jpg) | [Screenshot](batch-12-goth-sit.jpg) | [Welcome walk trial](batch-12-goth.gif) |
| E-girl | [Screenshot](batch-12-egirl-stand.jpg) | [Screenshot](batch-12-egirl-sit.jpg) | [Bark](batch-12-egirl.gif) |

All three have a compact fit for seated and resting poses. Hair keeps the eyes and mouth visible and gives way to a separate hat. In the native Windows [Wardrobe](batch-12-egirl-native.png), Companion and [floating window](batch-12-egirl-floating.png), E-girl kept Round glasses and Mint socks equipped.

Goth went through the live tired-to-loaf and [sleep](batch-12-goth-sleep.jpg) sequence. Happy woke Inu into loaf, and the next Sit action stopped in sitting. Goth reached both reduced-motion pose destinations, stayed equipped after reload, and remained unlocked after removal with Dev mode off.

## Windows restart and revised walk

In the isolated Windows development profile at port 1442, E-girl, Round glasses, and Mint socks were equipped before closing Inova through the desktop window. The window closed, a new native process launched, and all three items were visibly equipped on startup. Wardrobe and the floating window displayed the same outfit. [Before and after restart](windows-restart-egirl.png).

Welcome walk was played on the desktop and in the floating window after relaunch. Each showed Inu walking with all three items and then returning to the happy standing pose. [Desktop playback sample](windows-walk-egirl.gif). It shows sampled early motion and the settled pose. Fresh adoption and Mac runtime are still pending. A cleared outfit was tested in a separate Windows restart using the seasonal batch.

## Updated playback and fit audit

The stage outfits have distinct upright hems: pleats for Britney Spears, a stepped ruffle for Goth, and pink trim for E-girl. Each retains its own detail in the intermediate fold before the compact fit. The new E-girl fold was sampled during native floating Sit.

All three went through standing and seated idle, happy, tired, loaf, sleep, wake, and bark with sound muted in the running Tailscale Companion view. The first Sit after wake ended in sitting. Each walk showed seven moving frames plus the return to standing. Each outfit reached both poses with reduced motion, remained equipped after browser reload, and stayed owned when cleared. The updated art was rechecked through the browser poses, transitions, and accessory combinations.

| Outfit | Lower into loaf | Wake | Return to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Britney Spears | [Lower](batch-12-britney-audit-lower.gif) | [Wake](batch-12-britney-audit-wakeclip.gif) | [Sit](batch-12-britney-audit-rise.gif) | [Bark](batch-12-britney-audit-bark.gif) | [Walk](batch-12-britney-audit-walk.gif) |
| Goth | [Lower](batch-12-goth-audit-lower.gif) | [Wake](batch-12-goth-audit-wakeclip.gif) | [Sit](batch-12-goth-audit-rise.gif) | [Bark](batch-12-goth-audit-bark.gif) | [Walk](batch-12-goth-audit-walk.gif) |
| E-girl | [Lower](batch-12-egirl-audit-lower.gif) | [Wake](batch-12-egirl-audit-wakeclip.gif) | [Sit](batch-12-egirl-audit-rise.gif) | [Bark](batch-12-egirl-audit-bark.gif) | [Walk](batch-12-egirl-audit-walk.gif) |

- [Pose comparison](batch-12-rest-audit.jpg)
- [Trail cap and Round glasses combinations](batch-12-accessories.jpg)
- [Windows Wardrobe, Companion, and floating fit](batch-12-windows-fit.jpg) for all three
- [E-girl folding into Sit in Windows floating mode](batch-12-egirl-windows-fold.gif)

`npm run check` passed 424 app tests, four preview tests, and the production build. Windows Cargo check passed. The build reported its bundle-size warning. Full native playback timing, independent Windows restarts for Britney Spears and Goth, Mac runtime, and art approval remain pending.
