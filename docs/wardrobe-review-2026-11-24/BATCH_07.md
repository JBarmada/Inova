# Wardrobe batch 07

November 25, 2026. Designs remain provisional pending art review.

| Item | Standing | Sitting | Browser playback |
| --- | --- | --- | --- |
| Shrimp suit | [Screenshot](batch-07-shrimp-stand.jpg) | [Screenshot](batch-07-shrimp-sit.jpg) | [Stand to sit](batch-07-shrimp-sit.gif) |
| Wonder Bread | [Screenshot](batch-07-bread-stand.jpg) | [Screenshot](batch-07-bread-sit.jpg) | [Welcome walk](batch-07-bread-walk.gif) |
| Chicken nugget | [Screenshot](batch-07-nugget-stand.jpg) | [Screenshot](batch-07-nugget-sit.jpg) | [Wake](batch-07-nugget-wake.gif) |

The stills show the Tailscale wardrobe and the clips were sampled from Companion with sound off. All three were unlocked through Dev mode and equipped through the normal wardrobe. Chicken nugget went from tired sitting to loaf and [sleep](batch-07-nugget-sleep.jpg), then woke into loaf and returned to sitting. Shrimp suit passed native visual inspection in the Windows wardrobe, Companion view, and transparent overlay.

## Updated playback and fit audit

The running Tailscale Companion view showed each outfit in standing and sitting idle, happy, tired, loaf, sleep, wake, and bark with sound muted. After waking into loaf, the first Sit landed in sitting. All seven moving walk frames were sampled before the sprite returned to standing. Reduced motion reached both standing and sitting for each outfit.

| Item | Lower into loaf | Wake | Return to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Shrimp suit | [Lower](batch-07-shrimp-audit-lower.gif) | [Wake](batch-07-shrimp-audit-wakeclip.gif) | [Sit](batch-07-shrimp-audit-rise.gif) | [Bark](batch-07-shrimp-audit-bark.gif) | [Walk](batch-07-shrimp-audit-walk.gif) |
| Wonder Bread | [Lower](batch-07-bread-audit-lower.gif) | [Wake](batch-07-bread-audit-wakeclip.gif) | [Sit](batch-07-bread-audit-rise.gif) | [Bark](batch-07-bread-audit-bark.gif) | [Walk](batch-07-bread-audit-walk.gif) |
| Chicken nugget | [Lower](batch-07-nugget-audit-lower.gif) | [Wake](batch-07-nugget-audit-wakeclip.gif) | [Sit](batch-07-nugget-audit-rise.gif) | [Bark](batch-07-nugget-audit-bark.gif) | [Walk](batch-07-nugget-audit-walk.gif) |

- [Pose comparison](batch-07-rest-audit.jpg)
- [Trail cap and Round glasses](batch-07-accessories.jpg). A separately equipped hat replaces the hood without removing the shrimp fin, bread wrapper, or nugget body.
- [Windows Wardrobe, Companion, and native floating fit](batch-07-windows-fit.jpg) for Wonder Bread and Chicken nugget with Round glasses and Mint socks.

`npm run check` passed 420 app tests, four preview tests, and the production build at the playback checkpoint. Windows Cargo check passed. The production bundle-size warning remains. Full native transition timing, Mac runtime, and art approval remain pending.

## Independent Windows restarts

Shrimp suit, Wonder Bread, and Chicken nugget each restored with Round glasses and Mint socks after a separate complete Windows exit and relaunch. The isolated test profile used Dev unlock for ownership and switched Dev mode off before equipping. The app restored the outfits without a webview refresh. Switching to Chicken nugget left the other two items available under Wear. After restart, Chicken nugget kept its face and paws readable in the seated floating pose, with the toy below it and manual controls hidden. [Windows screenshots](batch-07-windows-restart.png).

## Chicken nugget in the Windows floating window

The running Windows overlay showed Chicken nugget with Round glasses and Mint socks at floating size, with sound off and standard motion. Idle, happy, bark, and tired stayed readable through the hood opening. Mint socks stayed visible in the seated poses and tucked out of sight in loaf and sleep. Wake ended in loaf without a post-nap stretch, and the next Sit ended seated. Dev mode was switched back off and manual controls were hidden.

- [Native pose comparison](batch-07-nugget-windows-rest.png)
- [Native wake and return to sit](batch-07-nugget-windows-wake.gif). Frames were sampled from the running overlay. The GIF's timing is illustrative.

A second Windows overlay run kept the same outfit and muted sound. The welcome walk preview kept the hood, glasses, and socks on through the sampled steps. Starting the preview seated returned Inu to the original seated pose at the end, with a direct cut. With Reduce motion enabled, Stand up and Sit reached their requested poses, and the walk preview left Inu seated. Both temporary settings were restored after the check.

- [Native welcome walk preview](batch-07-nugget-windows-walk.gif). The clip uses sampled frames and approximate timing.
- [Native reduced-motion poses](batch-07-nugget-windows-reduced-motion.png)

Additional Windows batch playback, Mac runtime, and art approval remain open.

### Walk-to-sit follow-up

The seated welcome-walk preview now uses Inu's fitted stand-to-sit frames after the final walk frame. The muted Windows floating run showed Chicken nugget, Round glasses, and Mint socks through the walking, lowering, and seated poses. Dev mode returned to off after testing. The earlier Windows walk clip above preserves the original cut for comparison.

[Updated Windows walk-to-sit clip](batch-07-nugget-windows-walk-to-sit.gif). The sampled frames use approximate timing.

## Wonder Bread and Shrimp suit in the Windows floating window

Both outfits were equipped through the normal wardrobe with Round glasses and Mint socks. In the muted Windows overlay with standard motion, each held its silhouette through happy, tired, loaf, sleep, and wake. The bread tie and shrimp fin remained visible in both the seated and resting poses. The glasses stayed aligned and the socks tucked out of view in loaf and sleep. Each Wake ended in loaf and the next Sit ended seated. Dev mode was switched off after testing.

- [Native pose comparison](batch-07-bread-shrimp-windows-rest.png)
- [Wonder Bread wake and sit](batch-07-bread-windows-wake.gif) and [Shrimp suit wake and sit](batch-07-shrimp-windows-wake.gif). These clips sample native playback with approximate timing.

In the follow-up Windows overlay run, both outfits displayed an open-mouth bark with sound off. The glasses, socks, and costume stayed equipped through the welcome walk and its fitted return to sitting. With Reduce motion enabled, both reached Stand and Sit and skipped the welcome walk. The isolated profile returned to its previous settings after testing.

- [Native bark, walk, and reduced-motion comparison](batch-07-bread-shrimp-windows-motion.png)
- [Wonder Bread walk to sit](batch-07-bread-windows-walk-to-sit.gif) and [Shrimp suit walk to sit](batch-07-shrimp-windows-walk-to-sit.gif). Both use sampled frames with approximate timing.

Mac runtime and art approval remain open.
