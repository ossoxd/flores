"""Recover complete sprites from original alpha, never another pose's silhouette."""
from pathlib import Path
from PIL import Image
from prepare_character_sprites import largest_component_bounds

ROOT = Path.home() / ".codex/generated_images/01a0c40f-b479-7102-8612-2eb0ea0d17a6"
OUT = ROOT / "prepared-character"

def recover(filename, destination, columns, sequence):
    source = Image.open(ROOT / filename).convert("RGBA")
    cells = []
    for row in range(4):
        for col in range(columns):
            cell = source.crop((round(col*source.width/columns), round(row*source.height/4),
                                round((col+1)*source.width/columns), round((row+1)*source.height/4)))
            bounds = largest_component_bounds(cell.getchannel("A"))
            # Entire component bounding rectangle, no reference-mask subtraction.
            cells.append(cell.crop(bounds))
    scale = min(210/max(c.width for c in cells), 220/max(c.height for c in cells))
    output = Image.new("RGBA", (256*len(sequence), 1024))
    for row in range(4):
        for col, source_col in enumerate(sequence):
            cell = cells[row*columns+source_col]
            cell = cell.resize((round(cell.width*scale), round(cell.height*scale)), Image.Resampling.NEAREST)
            output.alpha_composite(cell, (col*256+(256-cell.width)//2, row*256+240-cell.height))
    output.save(OUT / destination)
    print(destination, output.size)

recover("exec-a9330560-ec39-46c0-9cf1-354ca1d8b759.png", "girlfriend-run-v2.png", 3, [0,1,2,1,0,2])
recover("exec-1b8e4ec5-0398-4a34-9dae-3b6518fb6513.png", "girlfriend-jump-v2.png", 3, [0,1,2])
recover("exec-dfe11974-3727-4c39-b1d0-0c6cff6686a1.png", "girlfriend-idle-v2.png", 4, [0,1,2,3])
