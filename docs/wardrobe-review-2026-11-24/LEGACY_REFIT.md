# Original wardrobe refit

November 25, 2026. Art remains provisional pending review.

| Items | What changed |
| --- | --- |
| Mint socks and Gold socks | Enlarged the visible cuff and heel for each paw. Tucked paws stay hidden. |
| Trail cap and Cozy beanie | Widened the crown and brim, and added a trail patch or ribbing. |
| Round glasses and Star glasses | Widened the frame across the eyes while keeping the lenses open. |
| Raincoat and Hoodie | Cut standing, seated, and resting silhouettes. The raincoat has a folded hood, reflective seam, and snaps. The hoodie has drawstrings and a front pocket. |
| Notebook badge and Bandana | Increased visibility on the chest and shortened the fabric and badge in resting poses. |

The four original slots still equip and save the same item IDs. Original garments and accessory-only combinations use the synchronized welcome walk. Automated checks cover the original wardrobe previews, low and intermediate fits, larger socks, and walk routing. The four-piece Rainy study walk outfit was visible in the native Windows Wardrobe and Companion. The floating overlay showed the outfit during the happy expression.

| Evidence | Views |
| --- | --- |
| Rainy study walk outfit | [Windows Wardrobe](legacy-rainy-windows.png), [Windows floating Companion](legacy-rainy-floating.png) |
| Notebook badge | [Tailscale standing](batch-08-notebook-stand.png), [Tailscale sitting](batch-08-notebook-sit.png) |
| All ten original items | [Static fit sheet](legacy-originals-static.png). Each row shows standing, sitting and loaf, composited from the production overlays and existing dog pixels outside the app. |

## Running-app playback and native fit

Raincoat, Cozy hoodie, Notebook badge, and Explorer bandana went through standing and seated idle, seated happy and tired, loaf, sleep, wake, bark, and all seven moving walk frames plus the return to standing in the muted Tailscale Companion. The first Sit after wake ended in sitting. Reduced motion reached standing and sitting for all four. The pose sheet uses the same scale and labels for each item.

[Original body items, live pose comparison](legacy-body-rest-audit.jpg)

| Item | Sit transition | Wake | Loaf to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Raincoat | [Sit](legacy-body-raincoat-audit-lower.gif) | [Wake](legacy-body-raincoat-audit-wakeclip.gif) | [Rise](legacy-body-raincoat-audit-rise.gif) | [Bark](legacy-body-raincoat-audit-bark.gif) | [Walk](legacy-body-raincoat-audit-walk.gif) |
| Cozy hoodie | [Sit](legacy-body-hoodie-audit-lower.gif) | [Wake](legacy-body-hoodie-audit-wakeclip.gif) | [Rise](legacy-body-hoodie-audit-rise.gif) | [Bark](legacy-body-hoodie-audit-bark.gif) | [Walk](legacy-body-hoodie-audit-walk.gif) |
| Notebook badge | [Sit](legacy-body-notebook-audit-lower.gif) | [Wake](legacy-body-notebook-audit-wakeclip.gif) | [Rise](legacy-body-notebook-audit-rise.gif) | [Bark](legacy-body-notebook-audit-bark.gif) | [Walk](legacy-body-notebook-audit-walk.gif) |
| Explorer bandana | [Sit](legacy-body-bandana-audit-lower.gif) | [Wake](legacy-body-bandana-audit-wakeclip.gif) | [Rise](legacy-body-bandana-audit-rise.gif) | [Bark](legacy-body-bandana-audit-bark.gif) | [Walk](legacy-body-bandana-audit-walk.gif) |

The Windows build displayed Cozy beanie, Star glasses, Gold socks, and Cozy hoodie together in Wardrobe, Companion, and the floating window. The floating Sit action reached sitting with all four layers equipped. The enlarged sock fronts and hoodie's silhouette read at floating size. The hoodie pocket is subtle at that size, and Star glasses partly cover the eyes. [Native cozy outfit comparison](legacy-cozy-windows.jpg)

## Original accessory playback and Windows restart

The Star glasses now have wider open lenses aligned to the eye pixels. They use the same transparent drawing in the inventory and on the dog. [Earlier and revised lenses in Windows Wardrobe, with the restored floating outfit](legacy-star-glasses-windows.jpg).

Trail cap, Cozy beanie, Round glasses, Star glasses, Mint socks, and Gold socks were worn individually in the muted Tailscale Companion. Each ran through seated idle, happy, tired, loaf, sleep, wake, loaf-to-sit, bark, and all seven moving walk frames before returning to standing. Reduced motion reached both wardrobe poses in the Companion. The socks disappear where Inu tucks his paws. [Live accessory pose sheet](legacy-accessories-rest-audit.jpg).

| Item | Sit transition | Wake | Loaf to sit | Bark | Walk |
| --- | --- | --- | --- | --- | --- |
| Trail cap | [Sit](legacy-accessories-cap-audit-lower.gif) | [Wake](legacy-accessories-cap-audit-wakeclip.gif) | [Rise](legacy-accessories-cap-audit-rise.gif) | [Bark](legacy-accessories-cap-audit-bark.gif) | [Walk](legacy-accessories-cap-audit-walk.gif) |
| Cozy beanie | [Sit](legacy-accessories-beanie-audit-lower.gif) | [Wake](legacy-accessories-beanie-audit-wakeclip.gif) | [Rise](legacy-accessories-beanie-audit-rise.gif) | [Bark](legacy-accessories-beanie-audit-bark.gif) | [Walk](legacy-accessories-beanie-audit-walk.gif) |
| Round glasses | [Sit](legacy-accessories-round-glasses-audit-lower.gif) | [Wake](legacy-accessories-round-glasses-audit-wakeclip.gif) | [Rise](legacy-accessories-round-glasses-audit-rise.gif) | [Bark](legacy-accessories-round-glasses-audit-bark.gif) | [Walk](legacy-accessories-round-glasses-audit-walk.gif) |
| Star glasses | [Sit](legacy-accessories-star-glasses-audit-lower.gif) | [Wake](legacy-accessories-star-glasses-audit-wakeclip.gif) | [Rise](legacy-accessories-star-glasses-audit-rise.gif) | [Bark](legacy-accessories-star-glasses-audit-bark.gif) | [Walk](legacy-accessories-star-glasses-audit-walk.gif) |
| Mint socks | [Sit](legacy-accessories-mint-audit-lower.gif) | [Wake](legacy-accessories-mint-audit-wakeclip.gif) | [Rise](legacy-accessories-mint-audit-rise.gif) | [Bark](legacy-accessories-mint-audit-bark.gif) | [Walk](legacy-accessories-mint-audit-walk.gif) |
| Gold socks | [Sit](legacy-accessories-gold-audit-lower.gif) | [Wake](legacy-accessories-gold-audit-wakeclip.gif) | [Rise](legacy-accessories-gold-audit-rise.gif) | [Bark](legacy-accessories-gold-audit-bark.gif) | [Walk](legacy-accessories-gold-audit-walk.gif) |

Closed the isolated Windows app with Cozy beanie, Star glasses, Gold socks, and Cozy hoodie equipped. The new process stalled at “Fetching your world…” in this development run. After Ctrl+R, the four items restored in Companion, Wardrobe, and floating mode. The restart result verifies the saved outfit. Automatic startup still needs investigation.

`npm run check` passed 424 app tests, four preview tests, and the production build. Windows Cargo check passed. The standard Vite bundle-size warning remains. The rainy outfit has native fit evidence and still needs its own restart check. Native playback per accessory and Mac review remain open. Art is provisional.
