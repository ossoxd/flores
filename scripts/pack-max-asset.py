"""Pack a generated Max atlas into uniformly aligned pixel-art frames."""
import base64
import io
import sys
from PIL import Image

source, columns, rows, size, mode = sys.argv[1:]
columns, rows, size = int(columns), int(rows), int(size)
sheet = Image.open(source).convert('RGBA')
cells = []
for i in range(columns * rows):
    x0 = round(i % columns * sheet.width / columns)
    x1 = round((i % columns + 1) * sheet.width / columns)
    y0 = round(i // columns * sheet.height / rows)
    y1 = round((i // columns + 1) * sheet.height / rows)
    cell = sheet.crop((x0, y0, x1, y1))
    alpha = cell.getchannel('A').point(lambda a: 255 if a >= 100 else 0)
    cell.putalpha(alpha)
    bbox = alpha.getbbox()
    cells.append((cell, bbox))

max_width = max(b[2] - b[0] for _, b in cells if b)
max_height = max(b[3] - b[1] for _, b in cells if b)
target = size - (10 if mode == 'sprite' else 4)
scale = min(target / max_width, target / max_height)
out = Image.new('RGBA', (len(cells) * size, size))
for i, (cell, bbox) in enumerate(cells):
    if not bbox:
        continue
    cell = cell.crop(bbox)
    width = max(1, round(cell.width * scale))
    height = max(1, round(cell.height * scale))
    cell = cell.resize((width, height), Image.Resampling.NEAREST)
    if mode == 'sprite':
        # Coarsen the generated image into unmistakable 2x2 screen pixels.
        cell = cell.resize((max(1, width // 2), max(1, height // 2)), Image.Resampling.NEAREST)
        cell = cell.resize((width, height), Image.Resampling.NEAREST)
    # Shared size, centered horizontally, feet resting on the same line.
    x = i * size + (size - width) // 2
    y = size - height - (3 if mode == 'sprite' else 0)
    out.alpha_composite(cell, (x, y))

buffer = io.BytesIO()
out.save(buffer, format='PNG', optimize=True)
sys.stdout.write(base64.b64encode(buffer.getvalue()).decode('ascii'))
