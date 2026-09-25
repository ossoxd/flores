# Coco

- `coco-idle.js` embeds the generated transparent 4 × 3 idle sheet. Its 12 poses use a chunky low-resolution sprite style; the scene aligns them to one size and paw baseline.
- `coco-portraits.js` embeds the user's supplied 2 × 2 expression sheet. `normalizeCocoPortraits.js` makes only the edge-connected black backdrop transparent, preserving the dark outlines inside the faces.
- `couple-pixel.js` embeds the pixel-art adaptation of the supplied couple photo used by the puzzle.

The map sprite was generated with the built-in image tool. Prompt: “Edit the existing transparent 4-column by 3-row sheet, keeping the same dog and cell layout. Redraw as a true tiny 16 × 16 handheld RPG sprite, enlarged into large crisp square blocks. Use seven flat colors, a stepped one-pixel outline, broad solid shapes, and only a few fur tufts. Keep paws planted and the head forward; animate only a few gentle blinks. No smooth shading, gradients, antialiasing, realistic fur, texture noise, or high-definition detail.”

The couple photo was transformed with the built-in image tool, preserving both people, their faces, pose, clothing, and full original framing while applying a moderate pixel grid. The puzzle splits it in code into nine selectable pieces; the solved state shows the entire uncut image.
