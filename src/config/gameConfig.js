export function createGameConfig(Phaser, scenes, parent = "game-root") {
  return {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent,
    backgroundColor: "#8fd36b",
    scene: scenes,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: "arcade",
      arcade: { debug: false }
    },
    render: {
      pixelArt: true,
      antialias: false
    }
  };
}
