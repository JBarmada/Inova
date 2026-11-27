# Wardrobe batch 06

November 25, 2026. Designs remain provisional pending art review.

| Item | Standing | Sitting | Browser playback |
| --- | --- | --- | --- |
| Iso | [Screenshot](batch-06-iso-stand.jpg) | [Screenshot](batch-06-iso-sit.jpg) | [Welcome walk](batch-06-iso-walk.gif) |
| Omen | [Screenshot](batch-06-omen-stand.jpg) | [Screenshot](batch-06-omen-sit.jpg) | [Wake](batch-06-omen-wake.gif) |
| Killjoy | [Screenshot](batch-06-killjoy-stand.jpg) | [Screenshot](batch-06-killjoy-sit.jpg) | [Bark](batch-06-killjoy-bark.gif) |

The stills show the Tailscale wardrobe. The clips were sampled from the live Companion page with sound muted. Dev unlock and normal equipping worked for all three. Killjoy was visually checked in the Windows wardrobe, Companion view and transparent floating window. In the browser, equipping Round glasses suppressed the integrated frames. Reload retained the combination, and removing the separate glasses restored the original frames. Automated coverage verifies the same renderer rule for Harry Potter.

Omen went from tired sitting to loaf and sleep, woke back into loaf, then returned to sitting with the Sit action. Reduced motion reached both pose destinations. Turning Dev mode off hid the direct controls while the costume stayed on.

## Updated playback and fit audit

All three costumes ran through standing, sitting, idle, happy, tired, loaf, sleep, wake, return to sitting, bark, and the welcome walk in the Tailscale Companion view with sound muted. The first Sit after waking from loaf ended in sitting. Reduced motion reached both stable poses for each costume. The walk clips sampled all seven moving poses before returning to the shared standing art.

| Item | Lower into loaf | Wake | Return to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Iso | [Lower](batch-06-iso-audit-lower.gif) | [Wake](batch-06-iso-audit-wakeclip.gif) | [Sit](batch-06-iso-audit-rise.gif) | [Bark](batch-06-iso-audit-bark.gif) | [Walk](batch-06-iso-audit-walk.gif) |
| Omen | [Lower](batch-06-omen-audit-lower.gif) | [Wake](batch-06-omen-audit-wakeclip.gif) | [Sit](batch-06-omen-audit-rise.gif) | [Bark](batch-06-omen-audit-bark.gif) | [Walk](batch-06-omen-audit-walk.gif) |
| Killjoy | [Lower](batch-06-killjoy-audit-lower.gif) | [Wake](batch-06-killjoy-audit-wakeclip.gif) | [Sit](batch-06-killjoy-audit-rise.gif) | [Bark](batch-06-killjoy-audit-bark.gif) | [Walk](batch-06-killjoy-audit-walk.gif) |

- [Pose comparison](batch-06-rest-audit.jpg)
- [Trail cap and Round glasses combinations](batch-06-accessories.jpg). Equipping the cap replaces Omen's hood or Killjoy's beanie while retaining the jacket.
- [Windows wardrobe, Companion, and floating fit](batch-06-windows-fit.jpg) for Iso and Omen with Round glasses and Mint socks. The floating screenshot shows the native overlay at its rendered size.

`npm run check` passed 417 app tests, four preview tests, and the build at this playback checkpoint. Windows Cargo check passed. The production build reported its bundle-size warning. Full native transition timing, Mac runtime, and art approval remain pending. Omen's hood leaves Inu's eyes and muzzle visible.

## Independent Windows restarts

Iso, Omen, and Killjoy each restored with Round glasses and Mint socks after separate complete Windows exits and relaunches. Dev unlock established initial ownership in the isolated profile. All three were equipped with Dev mode off, and Iso and Omen were still available under Wear after Killjoy replaced them. Killjoy also restored to the floating seated pose after relaunch with the beanie, current eyewear, jacket and socks visible. No webview refresh was needed. [Windows screenshots](batch-06-windows-restart.png).

## Iso floating playback

Iso was equipped through the normal wardrobe with Round glasses and Mint socks. The muted Windows overlay showed seated idle, happy, tired, visible bark, loaf, sleep, wake to loaf, and the next Sit ending seated. The jacket followed the body through the welcome walk and fitted return to sit. With Reduce motion on, Inu reached Stand and Sit and skipped the walk. Dev mode and Reduce motion returned to off after testing.

- [Native pose comparison](batch-06-iso-windows-poses.png)
- [Wake and sit](batch-06-iso-windows-wake.gif) and [walk to sit](batch-06-iso-windows-walk.gif). Both use sampled frames with approximate timing.

## Omen and Killjoy floating playback

Both outfits were equipped through the normal wardrobe with Round glasses and Mint socks. In the muted Windows overlay, the hood and beanie still framed Inu's face during idle, happy, tired, bark, loaf, and sleep. Wake ended in loaf and the next Sit ended seated. The welcome walk returned to sitting through fitted poses. Reduced motion skipped the walk and kept both manual pose actions usable. Dev mode and Reduce motion were restored afterward.

An early Killjoy capture showed one frame of clothing without the dog at the walk-to-sit handoff. The shared renderer now keeps the last walking frame visible until the landing's base image loads. The flicker did not recur in sampled Killjoy and Omen playback after the fix.

- [Native pose comparison](batch-06-omen-killjoy-windows-poses.png)
- [Omen wake](batch-06-omen-windows-wake.gif) and [Omen walk to sit](batch-06-omen-windows-walk.gif)
- [Killjoy wake](batch-06-killjoy-windows-wake.gif) and [Killjoy walk to sit](batch-06-killjoy-windows-walk.gif)

The clips are sampled from the running Windows overlay with approximate timing. Mac runtime and art review remain open.
