// Native pixel drawings complement the existing autumn tiles and Anto sprites.
const PALETTE = { '.': null, o: '#593b3b', p: '#ed688b', h: '#ffb3bb', w: '#fff2cf',
  g: '#91a5a3', d: '#657777', y: '#ffd36b', b: '#a96d43', l: '#dca365', s: '#547b92' };
const ICONS = {
  heart: ['............','..ooo.ooo...','.ohhpopppo..','.ohppppppo..','.opppppppo..','..opppppo...','...opppo....','....opo.....','.....o......','............'],
  can: ['...oooooo...','..oggggggo..','...owggdo...','...ogdgdo...','...ogdgdo...','...ogdgdo...','...ogdgdo...','...oooooo...'],
  paper: ['....oooo....','..oowwww o..','..owgwgwo...','.owwwgwwwo..','.ogwwwwgwo..','..owgwgwo...','...ooooo....'],
  banana: ['......oy....','.....oyyo...','....oyyo....','...oyyyo....','..oyywyo....','.oyyowyyyo..','.oyo..oyyyo.','..o....ooo..'],
  sock: ['.....oooo...','.....owwo...','.....osso...','.....owwo...','.....owwo...','..oooowwo...','.owwwwgwo...','.ossssso....','..ooooo.....'],
  key: ['....oooo....','...oywwyo...','...oy..yo...','...oywwyo...','....oyyo....','....oyyo....','....oyyooo..','....oyyyyy o','....oyyooo..','....oyyo....','.....oo.....'],
  basket: ['..oooooooooooo..','.ollllllllllllo.','.obbbbbbbbbbbbo.','..olblblblblbo..','..oblblblblblo..','...olblblblbo...','...oblblblblo...','....oooooooo....']
};

export function createCatchArt(scene) {
  for (const [name, rows] of Object.entries(ICONS)) {
    const key = `catch-${name}`;
    if (scene.textures.exists(key)) continue;
    const texture = scene.textures.createCanvas(key, 16, 16);
    const ctx = texture.context;
    for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
      const color = PALETTE[rows[y][x]];
      if (!color) continue;
      ctx.fillStyle = color; ctx.fillRect(x, y + Math.floor((16 - rows.length) / 2), 1, 1);
    }
    texture.refresh();
  }
}

export function drawCatchGarden(scene) {
  scene.add.image(480, 270, 'heart-catch-background').setDisplaySize(960, 540);
}
