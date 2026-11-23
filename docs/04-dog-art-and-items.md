# Pixel Dog Art and Customization

Established direction: a pixel dog built from reusable pieces. Expressions, outfits, and props are separate concerns.

# Dog appearance

- Offer a small set of base dog variants in the adoption picker. Exact count is open.
- Use a consistent art scale, pose reference, and visual style across variants.
- Prepare expression or pose states such as idle, happy, sad, excited, and tired.
- Keep the dog's identity recognizable when its mood or equipment changes.
- Use transparent backgrounds for the desktop dog.

Sad and tired are expressive states. Their triggers remain a design choice; they do not automatically establish a punishment mechanic.

# Layered customization

Compose a base dog and expression with separate wearable and prop layers. Possible slots include headwear, body clothing, accessories, and a nearby prop.

A user might combine a default dog, a happy expression, a hat, and a notebook. Reuse these assets rather than drawing or generating a complete image for every combination.

# Asset compatibility

- Give each supported pose and variant agreed attachment positions.
- Define which items sit in front of or behind the dog.
- Define slot conflicts so incompatible items do not overlap.
- Decide which poses each item supports and provide a simple fallback.
- Preview equipment changes before saving them.
- Keep pixel edges sharp and avoid accidental blur when scaling.

Layering reduces combination artwork, but items still need fitting checks for each supported body shape and pose. More variants and animation states increase that work.

# Unlockable items

Cosmetics change appearance. Interaction items change what the user can do with the dog. A notebook is a possible prop; a treat or toy can trigger an interaction.

Items unlock through app use and user experiences. Exact rewards, thresholds, and whether treats are consumable remain open. Random combinations, if added, should use owned compatible items and allow the user to change the result.

# Proposed initial art scope

Begin with one fully working dog, a few expressive states, and a small compatible item set. Additional base dogs are desired after this path works. AI generation may help create initial assets, but generation is not required during every reward or outfit change.
