# Max y el podio de la llave — diseño

## Alcance

Ampliar el mapa 2D pixel art con una isla a la derecha de Coco, un puente de acceso, Max como guardián y un podio para las cuatro piezas de una llave. Cada una de las cuatro misiones existentes otorga una pieza distinta con la misma celebración visual. El flujo termina cuando Anto recoge la llave completa; la puerta y su apertura quedan fuera de alcance.

## Geografía y personajes

- La nueva isla queda al este de la isla inferior derecha de Coco. Un puente transitable une ambas islas; el agua y las barandillas mantienen las colisiones actuales.
- Max espera en el cuello de entrada del puente y bloquea físicamente el paso hasta recibir las diez flores. El podio ocupa un lugar visible en la isla nueva; se reserva otro punto para una puerta futura sin dibujarla ni permitir abrirla.
- Max se basa en la foto del schnauzer gris: cejas, barba y silueta reconocibles. Tendrá idle y caminata pixel art coherentes con los NPC existentes, y retratos de diálogo con expresiones acordes. Tras recibir las flores, caminará desde el puente hasta el punto reservado de la puerta y quedará allí, sin volver a bloquear.

## Diálogo y flores

- Primera conversación, alternando Anto y Max, conserva las frases entregadas por el usuario. La línea «Pues las necesito para algo owo» pertenece a Max. La ortografía puede normalizarse sin cambiar el sentido ni el tono.
- Con menos de diez flores, Max repite una línea breve del estilo «Aún faltan flores, Anto» y permanece en su puesto.
- Con diez flores, una interacción con Enter o el control táctil reproduce el diálogo de agradecimiento, entrega las flores una sola vez y activa la caminata de Max. Si Anto obtuvo las diez antes de la primera charla, se muestra primero la introducción y después el agradecimiento, sin exigir repetir misiones.
- Después de la entrega, el contador visible de flores pasa a 0. Se conservan internamente los identificadores de flores recogidas para impedir que reaparezcan; un estado separado marca que fueron entregadas.
- El salto automático al final del ramo deja de activarse al conseguir diez flores y completar Tami. La escena del ramo no se modifica en esta fase.

## Recompensas y piezas

Correspondencia permanente, independiente del orden de las misiones:

| Misión | Pieza |
| --- | --- |
| Tami | Corona superior |
| Coco | Gema del cuello |
| Canelo | Mango central |
| Micky | Punta dentada inferior |

Las piezas usan las imágenes pixel art aportadas por el usuario. Al completar por primera vez cada misión, la pieza correspondiente desciende desde la parte superior de la pantalla; el fondo se oscurece, la pieza emite haces de luz y partículas pixeladas, se detiene centrada y aparece abajo «Llave conseguida». Después se vuelve al juego. La celebración se reutiliza para las cuatro misiones, variando únicamente la imagen de la pieza. No se repite al hablar de nuevo con un animal ni al reabrir escenas.

## Podio y ensamblaje

- El podio es pixel art de la misma escala que el mapa, inicialmente vacío. Un indicador contextual invita a pulsar Enter al estar cerca.
- Al interactuar, se colocan de forma secuencial todas las piezas conseguidas que aún no se habían puesto. Cada una viaja a su posición fija en el contorno de la llave, con un destello breve. Por ejemplo, si hay dos piezas ganadas, aparecen ambas, una tras otra; no se inventan las otras dos.
- Si no hay piezas nuevas, el podio muestra las ya colocadas y no duplica ninguna. Las piezas obtenidas, las colocadas y la llave recogida se guardan como estados distintos para soportar idas y vueltas entre escenas.
- Con la cuarta pieza, las cuatro convergen con una animación especial, aparece la llave completa sobre el podio y Anto la recoge. La llave pasa al estado del jugador, no queda duplicada en el podio, y no se abre ninguna puerta todavía.

## Implementación y comprobación

- Un módulo de estado puro controla entrega de flores, piezas ganadas/colocadas y llave recogida; las escenas solo muestran y disparan transiciones.
- Una presentación de recompensa compartida evita cuatro versiones divergentes. El mapa y las colisiones se amplían sin mover las islas/NPC existentes.
- Se probarán: acceso bloqueado y desbloqueado, entrega única de diez flores, contador a cero sin reaparición, correspondencia de piezas, colocación parcial y sin duplicados, ensamblaje solo tras las cuatro, recogida única y ausencia de apertura de puerta. La revisión visual cubrirá pixel art, alineación de las piezas, puente, podio y animaciones.
