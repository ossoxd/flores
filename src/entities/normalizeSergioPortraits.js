// The supplied portrait sheet has an opaque black backdrop. Key it out at load time
// while retaining the near-black outline and all four original expressions.
export function normalizeSergioPortraits(scene) {
  const key = 'sergio-portraits-clean';
  if (scene.textures.exists(key)) return key;
  const source = scene.textures.get('sergio-portraits');
  const sheet = scene.textures.createCanvas(key, 512, 512);
  const context = sheet.context;
  const scratch = document.createElement('canvas');
  scratch.width = scratch.height = 256;
  const pixels = scratch.getContext('2d', { willReadFrequently: true });
  for (let index = 0; index < 4; index++) {
    const frame = source.get(index);
    pixels.clearRect(0, 0, 256, 256);
    pixels.drawImage(frame.source.image, frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, 0, 0, 256, 256);
    const image = pixels.getImageData(0, 0, 256, 256);
    for (let i = 0; i < image.data.length; i += 4) {
      if (image.data[i] <= 12 && image.data[i + 1] <= 12 && image.data[i + 2] <= 12) image.data[i + 3] = 0;
    }
    pixels.putImageData(image, 0, 0);
    const x = index % 2 * 256, y = Math.floor(index / 2) * 256;
    context.drawImage(scratch, x, y);
    sheet.add(index, 0, x, y, 256, 256);
  }
  sheet.refresh();
  return key;
}
