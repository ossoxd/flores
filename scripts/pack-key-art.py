"""Convert the supplied key artwork to a compact transparent game asset."""
import base64
import io
import sys
from PIL import Image

source, width, height = sys.argv[1:]
width, height = int(width), int(height)
original = Image.open(source)
image = original.convert('RGBA')
if 'A' not in original.getbands():
    # User-provided pixel art may arrive flattened on a nearly black backdrop.
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, _ = pixels[x, y]
            if max(r, g, b) < 12:
                pixels[x, y] = (r, g, b, 0)
alpha = image.getchannel('A').point(lambda value: 255 if value >= 100 else 0)
image.putalpha(alpha)
image = image.crop(alpha.getbbox())
image.thumbnail((width - 4, height - 4), Image.Resampling.NEAREST)
output = Image.new('RGBA', (width, height))
output.alpha_composite(image, ((width - image.width) // 2, (height - image.height) // 2))
buffer = io.BytesIO()
output.save(buffer, format='PNG', optimize=True)
sys.stdout.write(base64.b64encode(buffer.getvalue()).decode('ascii'))
