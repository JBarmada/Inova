# Wardrobe batch 09

November 25, 2026. The art is provisional pending user review.

| Costume | Standing | Sitting | Muted browser playback |
| --- | --- | --- | --- |
| Sneaky bush | [Screenshot](batch-09-bush-stand.jpg) | [Screenshot](batch-09-bush-sit.jpg) | [Welcome walk trial](batch-09-bush.gif) |
| Bibble | [Screenshot](batch-09-bibble-stand.jpg) | [Screenshot](batch-09-bibble-sit.jpg) | [Bark](batch-09-bibble.gif) |
| Fungus | [Screenshot](batch-09-fungus-stand.jpg) | [Screenshot](batch-09-fungus-sit.jpg) | [Loaf to sitting](batch-09-fungus.gif) |

Bibble's wing stays visible in sit and in compact poses. In Windows, the [wardrobe](batch-09-bibble-native.png), Companion and [seated floating view](batch-09-bibble-floating.png) showed Bibble with Trail cap, Round glasses and Mint socks. Trail cap took the place of the Bibble hood while the garment and wing stayed equipped. Sneaky bush and Fungus follow the same hat-slot rule.

Fungus went from tired sitting to loaf and [sleep](batch-09-fungus-sleep.jpg) in the live browser. Happy woke Inu into loaf and the next Sit action stopped in sitting. After reloading, Fungus stayed equipped. Removing the body layer left Fungus owned and available to wear in normal mode.

## Updated playback and fit audit

Bibble, Fungus, and Sneaky bush each ran through idle standing and seated, happy, tired, loaf, sleep, wake, bark, and the revised walk in the running Tailscale Companion view with sound off. The first Sit after wake ended in sitting. Each walk sampled seven moving frames and the return to standing. Reduced motion reached both poses. The three outfits each survived reload. Clear outfit persisted across a further reload and retained ownership.

| Costume | Lower into loaf | Wake | Return to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Bibble | [Lower](batch-09-bibble-audit-lower.gif) | [Wake](batch-09-bibble-audit-wakeclip.gif) | [Sit](batch-09-bibble-audit-rise.gif) | [Bark](batch-09-bibble-audit-bark.gif) | [Walk](batch-09-bibble-audit-walk.gif) |
| Fungus | [Lower](batch-09-fungus-audit-lower.gif) | [Wake](batch-09-fungus-audit-wakeclip.gif) | [Sit](batch-09-fungus-audit-rise.gif) | [Bark](batch-09-fungus-audit-bark.gif) | [Walk](batch-09-fungus-audit-walk.gif) |
| Sneaky bush | [Lower](batch-09-bush-audit-lower.gif) | [Wake](batch-09-bush-audit-wakeclip.gif) | [Sit](batch-09-bush-audit-rise.gif) | [Bark](batch-09-bush-audit-bark.gif) | [Walk](batch-09-bush-audit-walk.gif) |

Sneaky bush now uses pointed, veined leaves on its hood and coat. The updated art was recaptured through the browser motion and accessory checks and rechecked in Windows. A separate hat replaces all three hoods. Bibble's wing and each garment stay visible.

- [Pose comparison](batch-09-rest-audit.jpg)
- [Trail cap and Round glasses](batch-09-accessories.jpg)
- [Native Windows Wardrobe, Companion, and floating fit](batch-09-windows-fit.jpg) for Fungus and Sneaky bush
- [Fungus barking in the native floating window](batch-09-fungus-windows-bark.gif), sampled frames from the Dev control

`npm run check` passed 420 app tests, four preview tests, and the production build. Windows Cargo check passed. The production bundle-size warning remains. Full native motion timing, native restart checks for this batch, Mac runtime, and art approval remain pending.
