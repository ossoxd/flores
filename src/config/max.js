import { KEY_DOOR_POSITION } from '../map/gardenLayout.js';

export const MAX = Object.freeze({
  position: { x: 1238, y: 704 },
  destination: KEY_DOOR_POSITION,
  intro: [
    { speaker: 'Anto', emotion: 'happy', text: 'Max, también estás aquí, no me sorprende jeje' },
    { speaker: 'Max', emotion: 'happy', text: 'Así es, ayudando a mi amo con su linda noviecita' },
    { speaker: 'Anto', emotion: 'confused', text: 'Muchas gracias, Max, pero ¿por qué no me dejas pasar?' },
    { speaker: 'Max', emotion: 'firm', text: 'Cierto, mi misión es no dejarte pasar hasta que obtengas todas las flores amarillas' },
    { speaker: 'Anto', emotion: 'confused', text: '¿Y por qué no?' },
    { speaker: 'Max', emotion: 'cheeky', text: 'Pues las necesito para algo owo' },
    { speaker: 'Anto', emotion: 'happy', text: 'Jeje, dale, está bien' }
  ],
  waiting: [{ speaker: 'Max', emotion: 'firm', text: 'Aún faltan flores, Anto. ¡Necesito las diez!' }],
  thanks: [
    { speaker: 'Max', emotion: 'grateful', text: 'Muchas gracias, Anto, te lo agradezco' },
    { speaker: 'Anto', emotion: 'happy', text: 'Jeje, no hay de qué' },
    { speaker: 'Max', emotion: 'cheeky', text: 'Ahora con tu permiso, voy a hacer algo owo' },
    { speaker: 'Anto', emotion: 'happy', text: 'Dale' }
  ]
});
