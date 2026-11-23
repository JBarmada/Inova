# Full Dog Mouth Gallery

Review alternatives requested after version seven: show every entire dog, use exactly one clear pixel between nose and mouth, and explore many wider :3 shapes.

- [Classic and soft shapes](full-dogs-classic-soft.png): eight full dogs.
- [Deep and feline shapes](full-dogs-deep-feline.png): eight more full dogs.
- [Eye-corner comparison](full-dogs-eye-corners.png): four full dogs with the same B12 mouth and different highlight corners.

Codes combine family and native mouth width: A8 through A14, B8 through B14, C8 through C14, and D8 through D14. Widths are 8, 10, 12, and 14 pixels. Mouths are black. The nose ends at row 31, row 32 is completely clear, and each smile reaches row 33 directly below the nose. No connector is present.

The two mouth galleries hold eye highlights at upper-right to isolate the shape change. The separate eye gallery uses one white pixel per eye at UL, UR, LL, or LR. All images are complete 64 by 64 transparent sprites, enlarged at an integer scale for review.

Rebuild using `python tools/pocket_pup/mouth_gallery.py`. The generator verifies the one-pixel gap, unchanged silhouette, one-pixel highlights, and unchanged pixels outside the mouth and eye regions. These are alternatives awaiting selection; they do not modify application art or other expressions.
