// Generated sheets may contain almost transparent pixels far from the character.
// Use the visible silhouette, rather than the cell size, to register each pose.
export function normalizeCharacterSheet(scene, sourceKey, count) {
  const key = `${sourceKey}-aligned`;
  if (scene.textures.exists(key)) return key;
  const source = scene.textures.get(sourceKey);
  const sheet = scene.textures.createCanvas(key, 1024, Math.ceil(count / 4) * 256);
  const context = sheet.context;
  context.imageSmoothingEnabled = false;
  const scratch = document.createElement('canvas');
  scratch.width = scratch.height = 256;
  const pixels = scratch.getContext('2d', { willReadFrequently: true });
  for (let index = 0; index < count; index++) {
    const frame = source.get(index);
    pixels.clearRect(0, 0, 256, 256);
    pixels.drawImage(frame.source.image, frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, 0, 0, 256, 256);
    const data = pixels.getImageData(0, 0, 256, 256).data;
    let left = 256, top = 256, right = -1, bottom = -1;
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        if (data[(y * 256 + x) * 4 + 3] < 128) continue;
        left = Math.min(left, x); right = Math.max(right, x);
        top = Math.min(top, y); bottom = Math.max(bottom, y);
      }
    }
    const cellX = (index % 4) * 256, cellY = Math.floor(index / 4) * 256;
    if (right >= left) {
      const height = bottom - top + 1;
      const width = Math.round((right - left + 1) * 218 / height);
      // All poses share a 218px height, a centered silhouette and feet at y=240.
      context.drawImage(scratch, left, top, right - left + 1, height,
        cellX + Math.round((256 - width) / 2), cellY + 22, width, 218);
    }
    sheet.add(index, 0, cellX, cellY, 256, 256);
  }
  sheet.refresh();
  return key;
}
