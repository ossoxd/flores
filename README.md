# Un jardín para ti

Minijuego 2D en Phaser 4: recoge diez flores amarillas, descubre un ramo y lee una carta romántica.

## Ejecutar

```powershell
npm.cmd run dev
```

Abre `http://localhost:5173`. Pruebas: `npm test`. Verificación estática: `npm run build`.

`npm run assets:install` copia los siete PNG personalizados generados a `public/assets/custom`. Si todavía no se ha ejecutado, el servidor de este computador los carga automáticamente desde la carpeta de generación como respaldo. También se puede indicar otra carpeta mediante `FLORES_GENERATED_ASSETS`.

## Controles

- WASD o flechas: movimiento.
- Espacio: salto.
- Enter cerca del conejo: hablar. Enter o Espacio con el diálogo abierto: avanzar.
- En celular: cruceta, salto y botón `A`; se recomienda jugar en horizontal.

Los textos románticos se editan en `src/config/content.js`. En desarrollo se puede abrir directamente `/?preview=bouquet` o `/?preview=letter` para revisar el final sin jugar la partida completa; estas rutas solo funcionan en localhost.

Los assets originales de Carrot Island permanecen sin modificar dentro de `public/assets/carrot-island`; conserva también la licencia original del pack. No se colocan zanahorias en el mapa.

La protagonista usa tres hojas independientes de 256×256 por celda: `girlfriend-walk-v3.js` (PNG integrado, 4×4), `girlfriend-idle-v2.png` (4×4) y `girlfriend-jump-v2.png` (3×4). La carrera alterna zancadas y poses de paso; el salto sincroniza preparación, vuelo y aterrizaje con su altura. Las filas son frente, izquierda, derecha y espalda.

La conversación inicial está en `CONTENT.rabbit`; las respuestas de siguientes visitas, en `CONTENT.rabbitRepeat`. Cada intervención selecciona hablante y expresión. Clic/Enter completa el texto en escritura o avanza si ya está completo. La enumeración del conejo avanza automáticamente hasta la interrupción. Los retratos seleccionados están integrados como PNG en `public/assets/custom/portraits`, sin depender de carpetas temporales. `/tests/dialogue-playtest.html` verifica cabida, retratos, puntos lentos e interrupción con Phaser real.

El mapa usa el atlas original de otoño. La franja exterior de 16 píxeles de cada isla no es transitable; las entradas de los puentes abren únicamente el paso sobre el tablero. Las colisiones se generan desde esa geometría, no desde todo el rectángulo visual de costa.

Prueba integrada: abre `/tests/playtest.html` en el servidor local. Ejecuta los módulos reales con Phaser y muestra PASS/FAIL para acantilados, barandillas, cruces, carrera, salto y espera en las cuatro direcciones. Esta prueba no sustituye la revisión visual de los sprites ni prueba las pulsaciones físicas del teclado.
