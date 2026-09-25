# Tami

Map sprite: `tami-tail-wag.js` was generated with the built-in image tool from the user's original sprite sheet and the earlier idle revision. Dialogue portraits: generated with the built-in image tool using the supplied photograph as identity reference.

The PNGs are embedded losslessly as data URLs in `tami-tail-wag.js` and `tami-portraits.js`, so this NPC does not depend on temporary files. The original user sheet remains in `tami-sheet.js`, and the earlier idle remains in `tami-idle-v2.js`. The portraits are a 1254 × 1254 sheet (four 627 × 627 frames). The map uses twelve front-facing poses in a roughly five-second cycle: the tail sweeps from low to medium to high and back, with one blink and brief rests. A subtle vertical breathing tween runs continuously. Frames share a scale and paw baseline; the NPC and collider stay in place.

Tail-wag sheet prompt: Produce a 4-column by 3-row transparent PNG sprite sheet of the same front-facing chunky pixel-art black dog. Both front paws stay planted. Draw a dark furry tail with no white tip, emerging from behind the viewer-right lower hip. Show distinct low, medium and high tail angles, with the tip travelling substantially in both vertical and horizontal directions. Keep the head facing forward and preserve consistent scale, markings and pixel style; no raised shoulder appendage, labels or background.

The user's blank paper reference is embedded losslessly in `tami-question-paper.js`. The desktop quiz places the question, four answers, check mark, and next action on that paper. Narrow screens use a readable parchment layout with square checkboxes.

The quiz lettering uses the regular and bold Minecraft text WOFF2 fonts supplied in `fuentes.zip`, embedded in `src/tami-fonts.css`. The printed paper arrow is the advance button; on narrow screens the button displays a crop of that same arrow.

Final portrait generation used the built-in image tool with the supplied photograph as identity reference. The earlier realistic generation was discarded.

Idle rendering no longer overlays a fixed lower-body strip, because it would hide the new tail motion at the hip. The animation orders frames low-medium-high-medium-low to avoid abrupt jumps. `tests/tami-idle-playtest.html` previews all frames, a full animation loop, and unchanged NPC/collider positions.

Final prompt:

Make an extremely LOW RESOLUTION chunky PIXEL ART RPG character dialogue portrait sheet of Tami, the dog in the photo. Exactly 4 portraits in 2x2 grid on transparent alpha background. The photo is ONLY for coat markings and floppy ear identity, NOT rendering or realism. Draw like a cute simple 1990s 16-bit handheld game character. Each portrait should visibly look drawn on a 32x32 or 48x48 pixel grid then enlarged with NEAREST NEIGHBOR: big square pixels ~12-20 pixels across at output resolution. ONLY 12 flat colors total, max 2 shades per surface. Thick dark stepped 1-pixel outlines. Oversized simple cartoon dog head, short muzzle, eyes made of just 2-4 square pixels. Black/dark grey fur, simple white muzzle and chest patches, pink ear and tongue, one triangular ear upright and one floppy. NO realism, NO detailed fur, NO rendering, NO smooth shading, NO antialiasing, NO tiny pixel texture, NO gradients, NO anatomical detail or teeth. Four same-size head/upper chest portraits generously padded inside equal square cells: top left friendly happy tongue; top right playful smug; bottom left mischievous laugh eyes closed; bottom right mock disappointed frowning. Clean minimal adorable recognizably blocky sprite art suitable for a simple pixel flower adventure. No text no symbols no frames. Square output transparent background.
