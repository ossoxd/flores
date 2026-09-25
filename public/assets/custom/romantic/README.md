# Romantic island decorations

The pergola, flower heart, lantern and flower border were supplied by the user.
Their artwork is preserved, with transparent padding trimmed and nearest-neighbor
sampling for the game's pixel grid. Each JS module embeds a transparent PNG, so
the scene does not depend on clipboard files or generated-image folders.

The three new planter variants were generated with the built-in image generation
tool, using the supplied flower border and full island as style references.

| Module | Native size | Use |
| --- | --- | --- |
| pergola.js | 152 × 114 | Centered floral arch |
| flower-heart.js | 60 × 48 | Heart above the couple |
| lantern.js | 18 × 60 | Paired lamps |
| flower-border.js | 80 × 38 | Low flower border beside the path |
| planter-pot.js | 25 × 36 | Tall and small companion pots |
| planter-curve.js | 72 × 30 | Curved flowerbeds |
| planter-row.js | 80 × 25 | Rectangular entrance planters |

The import helper is `scripts/pack-romantic-asset.ps1`; it outputs PNG base64 in
memory and never overwrites the source artwork. Positions share the center axis
defined in `src/config/finalIsland.js`.

## Generation prompt

Use case: stylized-concept. Create ONE game sprite atlas for a romantic yellow
flower garden, containing exactly THREE separate planter variants, stacked in
THREE equal height rows, centered in each row with large transparent margins.
Image 1 is the flower and stone palette/style reference. Image 2 is scene
composition style reference only, do NOT recreate the scene. Top row: compact
round cream sandstone pot with a tall bouquet of golden yellow daisies and green
leaves, similar to pots beside the lamps. Middle row: low curved crescent
flowerbed edged in chunky rounded cream stones, dense yellow flowers, a few tiny
white blossoms. Bottom row: straight long rectangular cream stone planter with a
dense horizontal row of yellow flowers and dark green foliage. Entire output
true transparent background, no floor, no labels, no text, no characters, no
trees, no lamps. Very blocky crisp low-resolution 16-bit pixel art, large visible
square pixels, limited warm palette, dark green foliage outlines and aubergine
shadows on sandstone, top-left highlights, same slightly overhead frontal RPG
perspective as references, absolutely no antialiasing, no blur or painting. Three
non-overlapping complete isolated sprites, one per row, left and right silhouettes
fully intact. This atlas will be cropped into three gameplay sprites.
