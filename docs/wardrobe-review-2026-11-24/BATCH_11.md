# Wardrobe batch 11

November 25, 2026. The art is provisional pending user review.

| Costume | Standing | Sitting | Muted browser playback |
| --- | --- | --- | --- |
| Trojan knight | [Screenshot](batch-11-trojan-stand.jpg) | [Screenshot](batch-11-trojan-sit.jpg) | [Stand to sit](batch-11-trojan.gif) |
| Ahri | [Screenshot](batch-11-ahri-stand.jpg) | [Screenshot](batch-11-ahri-sit.jpg) | [Welcome walk trial](batch-11-ahri.gif) |
| Teemo | [Screenshot](batch-11-teemo-stand.jpg) | [Screenshot](batch-11-teemo-sit.jpg) | [Wake](batch-11-teemo.gif) |

Ahri’s tail fan is behind the base sprite in the fitted pose, Dev clip, and synchronized walk paths. Inu's curl and rear paws stay in front. Ahri's hat slot was checked in native Windows with a Trail cap and again with the built-in ears visible. Round glasses and Mint socks remained equipped in [Windows Wardrobe](batch-11-ahri-native.png), Companion, and the [floating window](batch-11-ahri-floating.png). Trojan knight and Teemo also keep their body pieces when a separate hat is equipped.

In the browser, Teemo went from tired sitting to loaf and [sleep](batch-11-teemo-sleep.jpg). Happy woke Inu into loaf, and Sit stopped in sitting. Reduced motion reached canonical standing and sitting. Teemo stayed equipped during reload and remained available after removal with Dev mode off.

## Updated playback and fit audit

All three outfits went through standing and seated idle, happy, tired, loaf, sleep, wake, and bark with sound muted in the running Tailscale Companion view. The first Sit after wake returned to sitting. Each walk showed seven moving frames and the return to standing. Each outfit reached standing and sitting with reduced motion, stayed equipped after a browser reload, and stayed owned after Clear outfit and a further reload.

| Outfit | Lower into loaf | Wake | Return to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Trojan knight | [Lower](batch-11-trojan-audit-lower.gif) | [Wake](batch-11-trojan-audit-wakeclip.gif) | [Sit](batch-11-trojan-audit-rise.gif) | [Bark](batch-11-trojan-audit-bark.gif) | [Walk](batch-11-trojan-audit-walk.gif) |
| Ahri | [Lower](batch-11-ahri-audit-lower.gif) | [Wake](batch-11-ahri-audit-wakeclip.gif) | [Sit](batch-11-ahri-audit-rise.gif) | [Bark](batch-11-ahri-audit-bark.gif) | [Walk](batch-11-ahri-audit-walk.gif) |
| Teemo | [Lower](batch-11-teemo-audit-lower.gif) | [Wake](batch-11-teemo-audit-wakeclip.gif) | [Sit](batch-11-teemo-audit-rise.gif) | [Bark](batch-11-teemo-audit-bark.gif) | [Walk](batch-11-teemo-audit-walk.gif) |

Teemo has a lower, narrower pack in standing and a separately drawn compact pack in seated and resting poses. More of Inu's curl is visible while standing. The current shapes were checked through the hosted motion cycle and captured during Sit in the native floating window.

- [Pose comparison](batch-11-rest-audit.jpg)
- [Trail cap and Round glasses combinations](batch-11-accessories.jpg)
- [Windows Wardrobe, Companion, and floating fit](batch-11-windows-fit.jpg) for Trojan knight and Teemo
- [Teemo sitting in the Windows floating window](batch-11-teemo-windows-sit.gif)

`npm run check` passed 421 app tests, four preview tests, and the production build. Windows Cargo check passed. The production bundle-size warning remains. Full native playback timing, independent native restarts for these outfits, Mac runtime, and art approval remain pending.
