export function bridgeCollisions(b) {
  const x=b.x*32,y=b.y*32,w=b.w*32,h=b.h*32;
  return b.direction==='vertical'
    ? [{x,y,w:16,h:h+16},{x:x+w-16,y,w:16,h:h+16}]
    : [{x,y,w,h:16},{x,y:y+h-16,w,h:16}];
}
