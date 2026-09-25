export const MICKY = Object.freeze({
  position: { x: 1584, y: 240 },
  intro: [
    { speaker: 'Anto', emotion: 'happy', text: 'Mickyyy, también ayudaste a Sergio :D' },
    { speaker: 'Micky', emotion: 'neutral', text: 'Hmmm, estaba aburrida' },
    { speaker: 'Anto', emotion: 'happy', text: 'Jeje está bien Micky, nunca te imaginé ayudando' },
    { speaker: 'Micky', emotion: 'neutral', text: 'Ajá...' },
    { speaker: 'Anto', emotion: 'confused', text: '¿Y qué debo hacer??' },
    { speaker: 'Micky', emotion: 'neutral', text: 'Competir contra mí' },
    { speaker: 'Micky', emotion: 'mischievous', text: 'Muejejeje' },
    { speaker: 'Anto', emotion: 'bewildered', text: '¿Y cómo?' },
    { speaker: 'Micky', emotion: 'mischievous', text: 'Una carrera >:3' },
    { speaker: 'Anto', emotion: 'happy', text: 'Muy bien, estoy lista' }
  ],
  repeat: [{ speaker: 'Micky', emotion: 'neutral', text: 'Ya te di lo que querías.' }],
  win: { speaker: 'Micky', emotion: 'neutral', text: 'Meh, no me interesa, solo quería terminar esto.' },
  lose: { speaker: 'Micky', emotion: 'neutral', text: 'Meh, ni me esforcé, pero supongo que así son los humanos. Mira, igual te doy la llave porque no quiero repetir esto.' }
});

export const MICKY_RACE = Object.freeze({
  distance: 1050, minSpeed: 28, maxSpeed: 125, impulse: 14, friction: 66,
  catSpeed: 67, catVariation: 4, variationMs: 1100, countdownMs: 900,
  confettiMs: 2500, rewardId: 'micky', difficulty: 1
});
