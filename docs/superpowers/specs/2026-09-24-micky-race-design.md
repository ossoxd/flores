# Micky y «Carrera contra la gata»

## Intención y alcance

Añadir a Micky, una gata tricolor de actitud seca y algo creída, a la isla nueva al este de Tami. Al hablarle se inicia una carrera lateral de Anto contra Micky. El escenario de carrera ocupa el lienzo 960 × 540 completo: no hay columnas de instrucciones. La prueba debe ser competitiva pero ganable, y entregar la cuarta pieza de llave tanto si Anto gana como si no. No modificar el ramo ni la condición del final existente.

El juego usa Phaser y mantiene el progreso solo durante la partida; la pieza de Micky seguirá ese comportamiento, sin almacenamiento nuevo entre recargas. La pieza se identifica en configuración como `micky`, se agrega a `keyFragments` una sola vez y actualiza el contador existente `/4`.

## Micky en el mapa y retratos

El NPC se coloca en el espacio despejado de la isla nueva, en tierra segura y fuera de la entrada del puente. Mantiene un colisionador pequeño a nivel de las patas. Su idle combina respiración, parpadeo y un movimiento breve de cola sin cambios de escala ni saltos; no se desplaza del lugar. Enter o clic/toque abre el diálogo; después de recibir la pieza, nuevas interacciones muestran una frase corta de Micky y no repiten la carrera.

La foto real adjunta es referencia de identidad (gata tricolor blanca, negra y naranja) para producir sprites pixel art de cuerpo completo, marcadamente cuadriculados y con pocos colores: idle de mapa y al menos ocho fotogramas laterales distintos de carrera. Los pies/patas conservan el mismo punto de apoyo y tamaño en todos los cuadros. La hoja de seis caras adjunta se usa para diálogo, con transparencia y expresiones indiferente, sonriente/maliciosa y sorprendida según la frase. Solo se creará una expresión adicional si ninguna de las seis cubre un momento necesario. Los assets finales se guardan dentro del proyecto y se muestran con nearest-neighbor.

Diálogo inicial, en este orden (sin añadir líneas opcionales):

1. Anto: «Mickyyy, también ayudaste a Sergio :D»
2. Micky: «Hmmm, estaba aburrida»
3. Anto: «Jeje está bien Micky, nunca te imaginé ayudando»
4. Micky: «Ajá...»
5. Anto: «¿Y qué debo hacer??»
6. Micky: «Competir contra mí»
7. Micky, sonrisa traviesa: «Muejejeje»
8. Anto, sorprendida: «¿Y cómo?»
9. Micky: «Una carrera >:3»
10. Anto, decidida: «Muy bien, estoy lista»

## Pista y controles

Tras el diálogo se abre una escena Phaser independiente, con el mapa pausado. Pista horizontal de dos carriles: Micky arriba, Anto abajo; salida a la izquierda, meta a la derecha. La pista es más ancha que el lienzo y la cámara sigue suavemente el punto medio de las corredoras, limitada a sus bordes. El fondo y los bordes usan la paleta de arena, agua y árboles del juego, sin paneles laterales ni UI web. Hay una pequeña barra de avance arriba y un botón pixel art grande «¡CORRER!» abajo; instrucciones solo durante la introducción central.

Secuencia: título «CARRERA CONTRA LA GATA», texto «Haz click lo más rápido que puedas para correr.», cuenta 3–2–1–«¡YA!», carrera, llegada, diálogo de resultado, pieza y salida. Durante introducción y cuenta no avanzan las corredoras ni se aceptan clics. Cada `pointerdown` nuevo en el botón —ratón o toque— da un impulso de velocidad; mantener presionado no repite el impulso. Se previene selección de texto y zoom por doble toque en el control. Opcionalmente Espacio puede servir como alternativa de accesibilidad, sin convertir mantener la tecla en carrera automática.

La velocidad de Anto integra impulso, fricción y límites por segundo; la posición avanza por `speed × deltaTime`, sin saltos por clic. Una pausa en los clics la deja avanzar un poco mientras frena. La animación de carrera acelera levemente con la velocidad y hay polvo pixel art discreto. Micky corre automáticamente con velocidad base y variaciones pequeñas, suaves e independientes del progreso de Anto; no hay rubber-banding ni colisiones entre corredoras.

## Balance configurable

Una configuración central contiene distancia, velocidad mínima/máxima de Anto, impulso por clic, fricción, velocidad base de Micky, amplitud e intervalo de variación, duración de cuenta atrás, confeti, identificador de recompensa y multiplicador de dificultad. Valores iniciales se calibrarán con simulaciones reproducibles: 3–4 clics/s normalmente pierden, 5 clics/s llegan cerca, 6–7 clics/s pueden ganar y 8+ clics/s normalmente ganan. Duración objetivo de una carrera promedio: 15–20 s; no más de 25 s salvo que se deje de pulsar. Ninguna frecuencia garantiza el resultado por manipulación de la IA; la variación puede producir carreras cercanas.

Mensajes breves sin detener el juego: «mrr…» si Micky lleva poca ventaja y «¡CASI!» si llegan parecidas a meta. Mantenerlos escasos. Se reutilizan los tonos WebAudio existentes si conviene para cuenta, salida y meta; no se añade un sistema de sonido externo.

## Final y recompensa

La escena usa estados explícitos `INTRO`, `COUNTDOWN`, `RACING`, `FINISHING`, `RESULT_DIALOGUE`, `REWARD`, `EXIT`. Al primer cruce se fija el ganador y se ignoran nuevos impulsos. La otra corredora se acerca a la meta durante un cierre breve, sin espera indefinida.

Si Anto gana, salen cuadrados de confeti pixel art desde ambos lados durante ~2–3 s, seguidos por la línea exacta de Micky: «Meh, no me interesa, solo quería terminar esto.» Si Micky gana, no hay confeti ni pantalla de derrota y dice exactamente: «Meh, ni me esforcé, pero supongo que así son los humanos. Mira, igual te doy la llave porque no quiero repetir esto.» Tras cerrar ese diálogo se añade `micky` una sola vez a `keyFragments`, se muestra «PIEZA DE LLAVE OBTENIDA» con el recuento actual `/4`, y se permite continuar al mismo lugar del mapa. Una salida anticipada antes de la recompensa no concede la pieza; al reabrir la carrera aún puede conseguirse. Una salida después de concederla no la duplica.

## Integración y comprobación

Archivos nuevos previstos: configuración y lógica pura de carrera, entidad NPC, escena de carrera, assets de Micky y pruebas. Archivos existentes a conectar: catálogo de assets, registro de escenas, `GameScene` y `DialogueBox`; no se altera la lógica del ramo. Probar con simulaciones de clics reproducibles, victoria/derrota con recompensa, cierre temprano, repetición sin duplicado, transiciones de estado, controles mouse/touch, colisiones y posición del NPC, limpieza de listeners/timers/partículas al salir, y revisión visual del scroll, tamaño de sprites, retratos y botón en escritorio/móvil.
