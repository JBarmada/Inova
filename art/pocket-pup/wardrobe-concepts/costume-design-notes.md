# Requested costume design notes

These are art and implementation references, not shipped items or an additional backlog. The user asked for these looks; the designs, fit and availability still require review. Preserve the existing Pocket Pup sprite and build independently composable pixel layers.

| Requested look | Potential pieces for visual development |
| --- | --- |
| Lord Farquaad | Dark bob with crown, red tunic and belt |
| Lorax | Orange brows and large yellow mustache, orange body detail |
| Harry Potter | Round glasses, lightning detail, wizard robe and scarf |
| Bee | Antennae, striped body and small wings |
| Mustache | Removable muzzle accessory |
| Bob | Removable bob wig |
| Clown | Colorful wig or hat, red nose and patterned costume |
| Shrimp | Curved shrimp headpiece and segmented pink body |
| Wonder Bread | Bread-slice silhouette with colored-dot packaging motif |
| Toad from Mario | Spotted mushroom cap and vest |
| Shrek | Ogre ears, vest and cream tunic |
| Britney Spears | Stage-inspired outfit; choose a recognizable look during art review |
| Pikachu | Pointed yellow ears, cheek accents and lightning-bolt detail |

The current save schema supports four independent hat, glasses, socks and body slots. Complete looks need coordinated pieces, and a mustache is a muzzle accessory, not glasses: a separate face-accessory slot may be needed to wear both at once. If added, it requires a versioned migration and tests for older saves, all ownership checks and cross-version behavior. Full outfits need a non-destructive way to preview, equip and remove their component pieces, and the team has not settled how they are owned or unlocked. Do not silently grant items, invent prices or treat references to these characters as clearance for commercial distribution.

For each candidate, inspect original pixel layers on the current 64×64 standing and sitting dogs and review how they move in breathing and supported clips. Verify that face/eye expressions remain visible, the ears and tail are not accidentally covered, and pieces combine correctly with other slots. Add automated checks for item IDs, slot matching, save/reload and migration, ownership, preview/clear behavior and invalid or partial outfit application. Human visual review is necessary; anchor bounds alone cannot establish fit.
