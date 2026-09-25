"""Pack the eight door poses at one scale and ground line."""
import base64
import io
import sys
from PIL import Image

source = Image.open(sys.argv[1]).convert('RGBA')
cell_width = source.width // 4
cell_height = source.height // 2
cells = []
for index in range(8):
    x = index % 4 * cell_width
    y = index // 4 * cell_height
    cell = source.crop((x, y, x + cell_width, y + cell_height))
    alpha = cell.getchannel('A').point(lambda value: 255 if value >= 120 else 0)
    cell.putalpha(alpha)
    bbox = alpha.point(lambda value: 255 if value >= 200 else 0).getbbox()
    cells.append((cell, bbox))

frame_width, frame_height = 96, 128
widest = max(b[2] - b[0] for _, b in cells)
tallest = max(b[3] - b[1] for _, b in cells)
scale = min((frame_width - 8) / widest, (frame_height - 8) / tallest)
output = Image.new('RGBA', (frame_width * 8, frame_height))
for index, (cell, bbox) in enumerate(cells):
    cell = cell.crop(bbox)
    width, height = round(cell.width * scale), round(cell.height * scale)
    cell = cell.resize((width, height), Image.Resampling.NEAREST)
    output.alpha_composite(cell, (index * frame_width + (frame_width - width) // 2,
                                  frame_height - 3 - height))

buffer = io.BytesIO()
output.save(buffer, format='PNG', optimize=True)
sys.stdout.write(base64.b64encode(buffer.getvalue()).decode('ascii'))
