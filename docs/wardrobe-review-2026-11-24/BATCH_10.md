# Wardrobe batch 10

November 25, 2026. The art is provisional pending user review.

| Costume | Standing | Sitting | Muted browser playback |
| --- | --- | --- | --- |
| Soju bottle | [Screenshot](batch-10-soju-stand.jpg) | [Screenshot](batch-10-soju-sit.jpg) | [Welcome walk trial](batch-10-soju.gif) |
| The White House | [Screenshot](batch-10-house-stand.jpg) | [Screenshot](batch-10-house-sit.jpg) | [Stand to sit](batch-10-house.gif) |
| Elmo | [Screenshot](batch-10-elmo-stand.jpg) | [Screenshot](batch-10-elmo-sit.jpg) | [Bark](batch-10-elmo.gif) |

The bottle label, house façade, and red suit have compact versions for sit and rest. Elmo's decorative eyes sit above Inu's own eyes. A separate hat replaces the costume headpiece while the body remains equipped. The White House with Trail cap, Round glasses, and Mint socks appeared in [Windows Wardrobe](batch-10-house-native.png), Companion, and [floating mode](batch-10-house-floating.png).

Elmo reached canonical sitting and standing with reduced motion enabled. It stayed equipped when the browser was reloaded. Removing it with Dev mode off retained ownership. All three items appeared as wearable in normal Wardrobe after a Dev unlock in the test profile.

## Updated playback and fit audit

All three outfits ran through standing and seated idle, happy, tired, loaf, sleep, wake, and bark with sound muted in the running Tailscale Companion view. The first Sit after wake ended in sitting. Each walk showed all seven moving frames and the return to standing. Reduced motion reached both poses. All three survived a reload equipped. Clear outfit persisted across another reload and kept all three available to wear.

| Outfit | Lower into loaf | Wake | Return to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Soju bottle | [Lower](batch-10-soju-audit-lower.gif) | [Wake](batch-10-soju-audit-wakeclip.gif) | [Sit](batch-10-soju-audit-rise.gif) | [Bark](batch-10-soju-audit-bark.gif) | [Walk](batch-10-soju-audit-walk.gif) |
| The White House | [Lower](batch-10-house-audit-lower.gif) | [Wake](batch-10-house-audit-wakeclip.gif) | [Sit](batch-10-house-audit-rise.gif) | [Bark](batch-10-house-audit-bark.gif) | [Walk](batch-10-house-audit-walk.gif) |
| Elmo | [Lower](batch-10-elmo-audit-lower.gif) | [Wake](batch-10-elmo-audit-wakeclip.gif) | [Sit](batch-10-elmo-audit-rise.gif) | [Bark](batch-10-elmo-audit-bark.gif) | [Walk](batch-10-elmo-audit-walk.gif) |

The native Windows recording showed The White House's right wing snapping from its widest outline to its compact outline during Sit. The added intermediate frame narrows the side wing and window before the seated fit takes over. It plays in reverse when standing up. Native floating capture shows the updated three widths, and the hosted motion cycle was repeated after the change.

- [Pose comparison](batch-10-rest-audit.jpg)
- [Trail cap and Round glasses combinations](batch-10-accessories.jpg)
- [Windows Wardrobe, Companion, and floating fit](batch-10-windows-fit.jpg) for all three, including the White House roof and flag
- [Updated native White House sit transition](batch-10-house-windows-fold.gif)

`npm run check` passed 457 app tests, four preview tests, and the production build after the reward layout fix. Windows Cargo check passed at the earlier playback checkpoint. The production bundle-size warning remains. Full native timing for every clip, Mac runtime, and art approval remain pending.

## Elmo earned in Windows

With Dev mode and sound off in the isolated Windows test profile, Gemma 3 4B turned a fictional puppet-show commitment into “Initial Elmo Impression.” Completing it awarded Elmo and Notebook badge. The reveal now keeps item art in 44 px slots so the labels sit alongside each thumbnail. Elmo equipped through the normal wardrobe with Round glasses and Mint socks. The trio remained equipped after a full app restart. The quest showed “Voices and puppets” after enabling Dev mode, and the classification panel disappeared when Dev mode was turned off.

[Native completion, classification, equipment and restart](batch-10-elmo-earned-windows.png)

## Windows restart and slot removal

Soju bottle and The White House each restored with Round glasses and Mint socks after independent exits and new Windows processes. The isolated profile used Dev unlock to prepare ownership of those two costumes, then equipped each with Dev mode off. Both fresh processes rendered the expected outfit without a webview refresh. Removing The White House through the body slot kept both accessories equipped, and all three costumes remained available to wear. A third relaunch restored the empty body slot and both accessories. [Windows comparison](batch-10-windows-restart.png).
