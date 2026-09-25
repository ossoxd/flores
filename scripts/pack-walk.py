"""Normalize complete alpha bounds with shared scale and baseline; no silhouette masks."""
import sys,io,base64
from PIL import Image
source=Image.open(sys.argv[1]).convert('RGBA')
cells=[]
for y in range(4):
    for x in range(4):
        cell=source.crop((round(x*source.width/4),round(y*source.height/4),round((x+1)*source.width/4),round((y+1)*source.height/4)))
        cells.append(cell.crop(cell.getchannel('A').getbbox()))
scale=min(210/max(c.width for c in cells),220/max(c.height for c in cells))
out=Image.new('RGBA',(1024,1024))
for i,cell in enumerate(cells):
    cell=cell.resize((round(cell.width*scale),round(cell.height*scale)),Image.Resampling.NEAREST)
    out.alpha_composite(cell,((i%4)*256+(256-cell.width)//2,(i//4)*256+240-cell.height))
buf=io.BytesIO();out.save(buf,format='PNG',optimize=True)
print('export default "data:image/png;base64,'+base64.b64encode(buf.getvalue()).decode()+'";')
