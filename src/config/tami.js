export const TAMI = Object.freeze({
  position: { x: 1088, y: 176 },
  intro: [
    { speaker: 'Anto', emotion: 'bewildered', text: 'Tamiii, ¿qué haces aquí?' },
    { speaker: 'Tami', emotion: 'happy', text: 'Pues ayudando a mi papi con su sorpresa, aunque un poco tarde ya.' },
    { speaker: 'Anto', emotion: 'confused', text: '¿Y cómo lo ayudas?' },
    { speaker: 'Tami', emotion: 'playful', text: 'Jeje, pues poniendo a prueba tus conocimientos.' },
    { speaker: 'Anto', emotion: 'confused', text: '¿Y de qué?' },
    { speaker: 'Tami', emotion: 'mischievous', text: 'De matemáticas. Muajajaja.' },
    { speaker: 'Anto', emotion: 'bewildered', text: '¡¡¡Qué!!!' },
    { speaker: 'Tami', emotion: 'happy', text: 'Mentirilla, pues no sé, soy un perro y no sé leer xd.' },
    { speaker: 'Tami', emotion: 'playful', text: 'Acá está la hoja con las preguntas. Responde todas bien para darte una parte de la llave OwO.' }
  ],
  success: [{ speaker: 'Tami', emotion: 'happy', text: 'Excelente mami, eres bien inteligente, acá está tu premio :3' }],
  failure: [{ speaker: 'Tami', emotion: 'disappointed', text: "No Anto, ¿pero esto qué es? ¿Sí eran de matemáticas o por qué te fue tan mal? Pero bueno, debemos seguir con el juego, así que intenta otra vez :'v" }],
  repeat: [
    { speaker: 'Tami', emotion: 'happy', text: 'Tengo hambre.' },
    { speaker: 'Tami', emotion: 'playful', text: '¿Te perdiste?' },
    { speaker: 'Tami', emotion: 'happy', text: 'Ya casi es hora de sacarme, jeje.' }
  ],
  questions: [
    {
      question: '¿Por qué crees que le gustas tanto a Sergio?',
      options: ['Porque haces live en tik tok.', 'Porque juegas videojuegos.', 'Porque le encanta tu forma de ser, cómo piensas, cómo hablas y esa manera tan tuya de hacer que hasta los momentos simples se sientan especiales.', 'Porque eres momera.'],
      correct: 2
    },
    {
      question: 'Si Sergio pudiera elegir dónde pasar un día contigo, ¿qué escogería?',
      options: ['Cualquier lugar, mientras estés tú', 'Una fiesta enorme', 'Un centro comercial', 'En la universidad'],
      correct: 0
    },
    {
      question: 'Cuando Sergio piensa en su futuro, ¿qué lugar crees que ocupas tú?',
      options: ['Ninguno', 'Siendo parte completa de su vida', 'Solo para jugar brawl stars', 'Depende del clima'],
      correct: 1
    },
    {
      question: '¿Quién es la persona que más ama Sergio con toda su alma?',
      options: ['Ninguna, es frío y emo', 'La mujer más hermosa del mundo, Anto :3', 'Trebor', 'Jesucristo'],
      correct: 1
    }
  ]
});
