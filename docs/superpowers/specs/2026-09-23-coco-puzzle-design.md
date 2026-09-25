# Coco y «Nuestra primera foto :3»

## Intención y alcance

Añadir a Coco como segundo NPC de mascota al juego existente. Coco se reconoce como el perro blanco y rizado de la foto suministrada. Su sprite de mapa se redibuja como pixel art muy simple (base visual de 16 × 16, paleta corta y bloques grandes); los retratos usan la hoja de cuatro expresiones aportada por el usuario, retirando únicamente el fondo negro conectado a los bordes para que quede transparente. Se ubicará en una zona transitable de la isla inferior derecha, sin tapar el puente ni bloquear las flores. El reto es un rompecabezas con la foto suministrada de Anto y Sergio. La foto del perro es referencia de Coco, no contenido del rompecabezas.

No cambiar el ramo, el final actual ni sus condiciones. La llave y su contador son provisionales: la celebración épica de cada fragmento queda fuera de este cambio.

## Experiencia de Coco

Al acercarse, Anto puede hablar con Coco mediante Enter o clic/toque, igual que con Tami. Su sprite permanece en sitio con un idle suave —parpadeo y respiración ligeros, sin giros bruscos de cabeza ni cambios de escala— y un colisionador de pies estable. Los retratos de diálogo muestran expresiones simples en la misma estética pixel art, no un retrato detallado o realista.

El diálogo inicial sigue este texto y orden; «Como» y «coco.» se normalizan como el hablante Coco, conservando tono y emoticonos:

1. Coco: «Hola mijita como vas».
2. Anto: «Hola coquito, tambien ayudando a Sergio con esto?».
3. Coco (frunciendo el ceño): «Asi es, aunque no queria porque estoy viejo».
4. Coco: «Ya estoy viejo y me carga y me sacude bien feo, no soy un trapo >:C».
5. Anto: «Jeje».
6. Coco: «En fin, toma esto y resuelvelo, que ya quiero dormir».
7. Anto: «Dale coquito».
8. Coco: «y aprovecho para decir que no me vuelvas a tocar mis huevitos >:C».
9. Anto: «No prometo nada jeje».
10. Coco: «bueno ya terminemos con esto :'v».

Al terminar, se abre el puzzle. Mientras el puzzle esté abierto, el movimiento y las interacciones del mapa quedan bloqueados.

## Rompecabezas

El encabezado dice exactamente «Nuestra primera foto :3». La foto de Anto y Sergio se convierte en una versión pixelada reconocible, preservando los rasgos y la composición; se guarda como asset local del proyecto. La interfaz muestra un recuadro de 3 × 3 casillas y nueve piezas mezcladas. Para servir en escritorio y móvil, se puede seleccionar una pieza y luego una casilla; arrastrar puede añadirse si no compromete el uso táctil. Una pieza mal ubicada puede cambiarse o retirarse. Las piezas se mezclan de forma que el estado inicial no esté resuelto. El puzzle solo termina cuando las nueve posiciones son correctas. Entonces se ocultan las divisiones y se ve la foto completa dentro del marco; no hay cortes sobre ella.

Si el jugador cierra el puzzle antes de terminar, puede volver a hablar con Coco y reintentarlo. La interfaz limpia sus eventos y restablece el control del mapa al cerrar. No debe premiarse una solución parcial.

## Finalización y estado

Al resolverlo una vez, se agrega `coco` a `keyFragments` de manera idempotente y se actualiza el contador provisional de llave. Coco dice, en este orden: «Ya estoy viejo para esto», «Dile a tu mamá que no me hable como bebé >:C», «67..... Perdón, ya me callo». En interacciones posteriores puede dar una línea breve, pero el rompecabezas no vuelve a abrirse durante esa partida. El estado se transporta con el estado existente del juego; no se introduce almacenamiento nuevo entre recargas del navegador.

## Integración y comprobación

Reutilizar el sistema actual de diálogos, retratos y estado de fragmentos. Mantener la lógica del puzzle separada de `GameScene` y limitar allí la conexión entre NPC, interfaz y recompensa. Comprobar visualmente que Coco está en tierra y accesible, que los retratos caben en el diálogo, que las piezas funcionan con ratón y toque, que la foto aparece sin cortes al terminar y que una segunda conversación no abre el puzzle. No alterar los archivos ni la lógica del ramo.
