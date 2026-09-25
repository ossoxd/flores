export function createFlowers(scene, flowerPositions, collectedIds = []) {
  const group = scene.physics.add.staticGroup();

  for (const flower of flowerPositions) {
    if (collectedIds.includes(flower.id)) continue;
    const sprite = group.create(flower.x, flower.y, "yellow-flower")
      .setOrigin(0.5, 1032/1254)
      .setScale(0.043)
      .setDepth(flower.y);
    sprite.setData("flowerId", flower.id).refreshBody();
    // Stable pickup at the roots; only the visible flower sways, never its physics body.
    sprite.body.setSize(24,24).setOffset(sprite.displayWidth/2-12,1032*0.043-24);
    const shadow=scene.add.ellipse(flower.x,flower.y-1,20,6,0x694b2c,.23).setDepth(flower.y-1);
    const sway=scene.tweens.add({targets:sprite,angle:{from:-3,to:3},duration:1400+(flower.x%400),ease:'Sine.InOut',yoyo:true,repeat:-1});
    sprite.once('destroy',()=>{sway.stop();shadow.destroy();});
  }

  return group;
}
