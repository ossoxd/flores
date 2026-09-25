export const CANELO = Object.freeze({
  position: { x: 496, y: 688 },
  intro: [
    { speaker: 'Canelo', emotion: 'hungry', text: '¿Tienes comida?' },
    { speaker: 'Anto', emotion: 'angry', text: 'Canelo, no solo debes pensar en comida.' },
    { speaker: 'Canelo', emotion: 'hungry', text: 'Pero quiero comidaaa.' },
    { speaker: 'Anto', emotion: 'angry', text: 'Ya, Canelo, basta.' },
    { speaker: 'Canelo', emotion: 'sad', text: "Bueno, está bien :'v" },
    { speaker: 'Anto', emotion: 'neutral', text: '...' },
    { speaker: 'Canelo', emotion: 'flirty', text: 'Ahhh, cierto, mira esta cosa que me dio el chico de gafas, guapo por cierto.' },
    { speaker: 'Anto', emotion: 'happy', text: 'Jaja, ojo que es mío.' },
    { speaker: 'Canelo', emotion: 'proud', text: 'Tranquila, bebé, no tendré bolitas pero sigo siendo un macho.' },
    { speaker: 'Canelo', emotion: 'sleepy', text: 'Bueno, ya empieza a jugar, ya me dio sueño.' }
  ],
  repeat: [
    { speaker: 'Canelo', emotion: 'hungry', text: '¿Ahora sí tienes comida?' },
    { speaker: 'Canelo', emotion: 'sleepy', text: 'Ya atrapaste los corazones… yo voy a dormir.' }
  ]
});

export const HEART_CATCH = Object.freeze({
  heartGoal: 30,
  baseFallSpeed: 105,
  maxFallSpeed: 190,
  spawnInterval: 680,
  playerSpeed: 300,
  badItemChance: 0.28,
  rockSlowFactor: 0.55,
  rockSlowMs: 1500,
  introMs: 2000,
  countdownMs: 1000,
  playerY: 480,
  left: 54,
  right: 906,
  spawnY: 52,
  basketHalfWidth: 32,
  basketHalfHeight: 12,
  itemRadius: 16,
  keyFallSpeed: 90,
  phases: [
    { from: 0, speedFactor: 1, intervalFactor: 1, trash: ['banana', 'rock', 'paper', 'can', 'bomb', 'skull', 'owl', 'lipstick'] },
    { from: 10, speedFactor: 1.3, intervalFactor: .82, badChance: 0.34, trash: ['banana', 'rock', 'paper', 'can', 'bomb', 'skull', 'owl', 'lipstick'] },
    { from: 20, speedFactor: 1.7, intervalFactor: .68, badChance: 0.38, trash: ['banana', 'rock', 'paper', 'can', 'bomb', 'skull', 'owl', 'lipstick'] },
    { from: 27, speedFactor: 1.6, intervalFactor: .275, badChance: 0.03, trash: ['paper'] }
  ],
  comboMilestones: {
    3: 'Vas bien 👀',
    5: 'Ok… eres demasiado buena en esto.',
    8: 'Y también demasiado buena haciendo feliz a Sergio.',
    10: 'Sí, todavía le encantas muchísimo ❤️'
  },
  messageMilestones: {
    10: 'Todavía haces sonreír a Sergio como un tonto.',
    20: 'Los momentos contigo terminan siendo sus favoritos.',
    25: 'Por si todavía no era obvio… te quiere muchísimo.'
  }
});
