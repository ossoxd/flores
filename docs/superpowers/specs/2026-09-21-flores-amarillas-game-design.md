# Diseño: juego de flores amarillas

## Objetivo

Crear una experiencia web 2D corta y romántica para celular y computador. La jugadora controla un personaje pixel art inspirado en la novia del autor, recorre un mapa verde, habla con un conejo NPC y recolecta flores amarillas. Al completar la colección, las flores forman un ramo y se revela una carta.

El juego debe sentirse personal, tranquilo y fácil de terminar en uno o dos minutos. No tendrá combate, vidas, cronómetro ni condiciones de derrota.

## Alcance de la primera versión

La primera versión incluirá:

- Pantalla de inicio con botón para comenzar.
- Un mapa 2D visto desde arriba.
- Movimiento con teclado y controles táctiles.
- Personaje jugable inspirado en la novia: cabello corto café oscuro con flequillo, cuello alto negro, cardigan rosado claro, falda negra por encima de la rodilla y zapatos cafés.
- Assets originales de *Carrot Island* usados sin modificaciones para terreno, agua, caminos, árboles, decoración y conejo.
- Conejo como NPC con un diálogo inicial breve.
- Diez flores amarillas recolectables creadas aparte y compatibles con la cuadrícula y paleta del pack.
- Contador de flores recolectadas.
- Transición de victoria al recoger la décima flor.
- Pantalla de ramo con animación de pétalos.
- Pantalla de carta con aparición progresiva del texto.
- Botón para volver a ver el ramo o reiniciar la experiencia.

Quedan fuera de esta versión: enemigos, inventario, niveles adicionales, guardado, cuentas, multijugador y editor de mapas.

## Dirección visual

La referencia principal es el pack [Carrot Island](https://joree.itch.io/carrot-island). Sus archivos se usarán tal como fueron distribuidos; no se redibujarán ni modificarán. Las zanahorias no se colocarán en el mapa.

Los elementos nuevos serán:

- El personaje de la novia, construido como sprite de cuatro direcciones y animaciones de caminar.
- Las flores amarillas, con estados disponible y recolectada.
- El ramo final.
- La interfaz, el contador, la caja de diálogo y la carta.

Los elementos nuevos deben respetar el tamaño de píxel, la escala, la perspectiva superior y la saturación del pack para que parezcan pertenecer al mismo mundo.

## Flujo de la experiencia

1. La pantalla de inicio muestra un mensaje corto y el botón **Comenzar**.
2. La protagonista aparece cerca del conejo.
3. Al acercarse, el conejo muestra: “Tengo una misión especial para ti: encuentra las diez flores amarillas del jardín”.
4. La jugadora explora el mapa y recoge flores al tocarlas. El contador cambia de `0/10` a `10/10`.
5. Al recoger la última flor, el movimiento se bloquea, aparecen pétalos y la escena se desvanece.
6. Las flores se reúnen en un ramo sobre un fondo cálido.
7. El botón **Ver mi mensaje** abre la carta.
8. La carta aparece de forma progresiva y termina con dos acciones: **Ver el ramo otra vez** y **Jugar de nuevo**.

El diálogo y la carta vivirán en un archivo de configuración para poder cambiar el texto sin tocar la lógica del juego. La primera versión usará los textos de este documento como contenido funcional inicial.

### Contenido editable inicial

El conejo dirá: “Tengo una misión especial para ti: encuentra las diez flores amarillas del jardín”.

La carta inicial dirá:

> Para ti, mi amor: reuní estas flores para recordarte lo especial que eres para mí. Gracias por llenar mis días de alegría y por hacer más bonito cada momento. Este pequeño jardín es para ti. Te quiero.

Estos textos serán editables en `content.js` antes de compartir el juego.

## Arquitectura técnica

El proyecto usará Phaser 4, JavaScript y Vite. No se añadirá un framework de interfaz adicional.

### Escenas

- `BootScene`: carga imágenes, sprites y fuentes; muestra progreso y detecta errores de assets.
- `MenuScene`: presenta el título y el botón de inicio.
- `GameScene`: construye el mapa, controla movimiento, colisiones, NPC, diálogo, flores y contador.
- `BouquetScene`: reproduce la composición del ramo y los pétalos.
- `LetterScene`: muestra la carta y las acciones finales.

### Módulos

- `content.js`: diálogos y texto de la carta.
- `gameConfig.js`: dimensiones, escala, controles y lista de escenas.
- `FlowerManager.js`: estado y recolección de las diez flores.
- `DialogueBox.js`: presentación y avance del diálogo.
- `TouchControls.js`: controles móviles visibles solo en dispositivos táctiles.

Cada módulo tendrá una sola responsabilidad para que el contenido, los controles y la lógica puedan cambiar de manera independiente.

## Datos y estado

La sesión mantendrá un estado mínimo:

```text
flowersCollected: 0..10
dialogueSeen: true | false
gameCompleted: true | false
```

No se persistirá información entre recargas. Reiniciar devuelve el estado a cero.

## Controles y adaptación

- Computador: flechas o WASD para caminar; Enter o Espacio para avanzar diálogos.
- Celular: control direccional táctil y botón de interacción.
- El lienzo conservará una relación 16:9 mediante `Phaser.Scale.FIT` y se centrará automáticamente.
- Los botones tendrán áreas táctiles grandes y el texto será legible en pantallas pequeñas.

## Assets

Los archivos del pack se guardarán en `public/assets/carrot-island/`. El usuario proporcionará la copia descargada que tenga derecho a usar.

Los assets personalizados se guardarán en:

```text
public/assets/custom/girlfriend/
public/assets/custom/flowers/
public/assets/custom/bouquet/
public/assets/custom/ui/
```

El código no redistribuirá el pack por separado ni alterará sus archivos originales.

## Manejo de errores

- Si falta un asset, `BootScene` mostrará un mensaje legible con el nombre del archivo faltante en vez de dejar una pantalla en blanco.
- Si el navegador no permite audio automático, el juego continuará sin audio. La primera versión no depende del sonido.
- La recolección será idempotente: una flor solo podrá aumentar el contador una vez.
- El final solo se activará cuando el contador llegue exactamente a diez.

## Pruebas y criterios de aceptación

Se probará la lógica con Vitest y el flujo visual en navegador.

La versión se considera completa cuando:

- El proyecto instala y ejecuta con `npm install` y `npm run dev`.
- La protagonista camina en cuatro direcciones sin atravesar obstáculos definidos.
- El conejo abre el diálogo al interactuar.
- Hay exactamente diez flores y ninguna puede recogerse dos veces.
- El contador llega a `10/10` y activa una sola vez la transición.
- El ramo y la carta se muestran en el orden previsto.
- Reiniciar devuelve el juego a su estado inicial.
- El flujo se puede completar con teclado y con controles táctiles.
- No se renderizan zanahorias.
- Los assets originales del pack permanecen sin modificaciones.
