"""Pack a regular portrait sheet into padded 256px frames and emit a portable module."""
import sys, io, base64
from PIL import Image, ImageOps
source=Image.open(sys.argv[1]).convert('RGBA')
cols,rows=int(sys.argv[2]),int(sys.argv[3])
out=Image.new('RGBA',(cols*256,rows*256))
for y in range(rows):
    for x in range(cols):
        cell=source.crop((round(x*source.width/cols),round(y*source.height/rows),round((x+1)*source.width/cols),round((y+1)*source.height/rows)))
        cell=ImageOps.contain(cell,(248,248),Image.Resampling.NEAREST)
        out.alpha_composite(cell,(x*256+(256-cell.width)//2,y*256+(256-cell.height)//2))
buffer=io.BytesIO()
out.save(buffer,format='PNG',optimize=True)
print('export default "data:image/png;base64,'+base64.b64encode(buffer.getvalue()).decode()+'";')
