import base64
import io
import sys
from PIL import Image

source, cols, rows, count, size, clear_black = sys.argv[1:]
cols, rows, count, size = map(int, (cols, rows, count, size))
image = Image.open(source).convert('RGBA')
out = Image.new('RGBA', (count * size, size))
cells = []
for index in range(count):
    x0 = round(index % cols * image.width / cols)
    x1 = round((index % cols + 1) * image.width / cols)
    y0 = round(index // cols * image.height / rows)
    y1 = round((index // cols + 1) * image.height / rows)
    cell = image.crop((x0, y0, x1, y1))
    if count == 8 and rows == 1:
        alpha = cell.getchannel('A').point(lambda value: 255 if value >= 128 else 0)
        cell.putalpha(alpha)
    if clear_black == 'yes':
        pixels = cell.load()
        seen = set()
        stack = [(x, 0) for x in range(cell.width)] + [(x, cell.height - 1) for x in range(cell.width)]
        stack += [(0, y) for y in range(cell.height)] + [(cell.width - 1, y) for y in range(cell.height)]
        while stack:
            x, y = stack.pop()
            if (x, y) in seen or not (0 <= x < cell.width and 0 <= y < cell.height):
                continue
            seen.add((x, y))
            r, g, b, a = pixels[x, y]
            if max(r, g, b) > 28:
                continue
            pixels[x, y] = (r, g, b, 0)
            stack.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    cells.append((cell, cell.getchannel('A').getbbox()))

if count == 8 and rows == 1:
    # The sheet's eight cells share one source scale. Individual thumbnail()
    # calls make extended-leg poses shrink and curled poses grow.
    reference_bottom = sorted(bounds[3] for _, bounds in cells)[count // 2]
    scale = (size - 8) / max(bounds[2] - bounds[0] for _, bounds in cells)
    for index, (cell, bounds) in enumerate(cells):
        left, top, right, bottom = bounds
        cropped = cell.crop(bounds)
        width = round((right - left) * scale)
        height = round((bottom - top) * scale)
        cropped = cropped.resize((width, height), Image.Resampling.NEAREST)
        out.alpha_composite(cropped, (index * size + size - 5 - width,
                                       size - 4 - round((reference_bottom - top) * scale)))
else:
    for index, (cell, bounds) in enumerate(cells):
        if bounds:
            cell = cell.crop(bounds)
        cell.thumbnail((size - 4, size - 4), Image.Resampling.NEAREST)
        out.alpha_composite(cell, (index * size + (size - cell.width) // 2, size - cell.height - 1))
buffer = io.BytesIO()
out.save(buffer, format='PNG', optimize=True)
sys.stdout.write(base64.b64encode(buffer.getvalue()).decode())
