export function normalizeCocoPortraits(scene) {
  const key = 'coco-portraits-alpha';
  if (scene.textures.exists(key)) return key;
  const source = scene.textures.get('coco-portraits').getSourceImage();
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(source, 0, 0);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = image;
  const visited = new Uint8Array(canvas.width * canvas.height);
  const queue = new Int32Array(canvas.width * canvas.height);
  let head = 0, tail = 0;
  const enqueue = index => {
    if (index < 0 || index >= visited.length || visited[index]) return;
    const offset = index * 4;
    if (data[offset + 3] === 0 || Math.max(data[offset], data[offset + 1], data[offset + 2]) > 28) return;
    visited[index] = 1;
    queue[tail++] = index;
  };
  for (let x = 0; x < canvas.width; x += 1) {
    enqueue(x);
    enqueue((canvas.height - 1) * canvas.width + x);
  }
  for (let y = 1; y < canvas.height - 1; y += 1) {
    enqueue(y * canvas.width);
    enqueue(y * canvas.width + canvas.width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    data[index * 4 + 3] = 0;
    const x = index % canvas.width;
    if (x > 0) enqueue(index - 1);
    if (x + 1 < canvas.width) enqueue(index + 1);
    enqueue(index - canvas.width);
    enqueue(index + canvas.width);
  }
  context.putImageData(image, 0, 0);
  const texture = scene.textures.createCanvas(key, canvas.width, canvas.height);
  texture.context.imageSmoothingEnabled = false;
  texture.context.drawImage(canvas, 0, 0);
  const cellWidth = canvas.width / 2;
  const cellHeight = canvas.height / 2;
  for (let index = 0; index < 4; index += 1) {
    texture.add(index, 0, (index % 2) * cellWidth, Math.floor(index / 2) * cellHeight, cellWidth, cellHeight);
  }
  texture.refresh();
  return key;
}
