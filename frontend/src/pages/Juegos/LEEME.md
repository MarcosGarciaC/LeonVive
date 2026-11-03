# Área de Juegos · Ecos de León

## Dónde está cada cosa

| Ruta | Qué es |
| --- | --- |
| `frontend/public/juego/` | El juego completo (versión final de la demo). JavaScript puro con canvas, sin dependencias. Vite lo copia tal cual al compilar. |
| `frontend/public/juego/js/version.js` | Modo del juego (`final`), sello (vacío) y `web`: a dónde vuelve el botón «◀ Salir del juego». |
| `frontend/src/pages/Juegos/Juegos.jsx` | Página `/juegos` con el estilo de la web: el mismo menú de la página principal (Navbar), portada a pantalla completa, 01 Tu avance, 02 El recorrido, 03 Minijuegos, 04 Cómo se juega y cierre con la Gritería. |
| `frontend/src/pages/Juegos/data/gamesData.js` | Textos de la portada (copian `public/juego/js/datos.js`; si cambian allá, actualízalos aquí). |
| `frontend/src/pages/Juegos/logic/progress.js` | Lee el progreso que guarda el juego (`localStorage`, clave `ecosdeleon_v1`). Solo lectura. |
| `frontend/src/pages/Juegos/assets/juego/` | Imágenes de zonas y minijuegos, capturadas del propio juego. |
| `frontend/src/pages/Juegos/tests/games.test.mjs` | Pruebas del progreso y del motor de ajedrez. |
| `frontend/src/pages/Juegos/JuegosDestacado.jsx` y `.css` | Sección «07 / Aprende jugando» de la página principal. El Dashboard solo la importa y la coloca antes de la sección final. |

Fuera de `public/juego/` y `src/pages/Juegos/` solo se cambiaron 4 líneas (archivos de otros compañeros):

- `src/pages/Dashboard/Dashboard.jsx`: `import JuegosDestacado from '../Juegos/JuegosDestacado'` y `<JuegosDestacado />` entre la sección de Tradiciones y la de cierre.
- `src/components/Navbar/Navbar.jsx`: «Juegos» pasó de `extraSections` a `sections`, así aparece también en el menú de escritorio.

La ruta `/juegos/*` de `App.jsx` ya existía.

## Cómo se abre

- `/juegos` usa el mismo menú que la página principal. Las opciones que son secciones del inicio (Lugares, Tradiciones, Literatura, Mi espacio, Biblioteca, buscar) llevan a `/` y abren esa sección con los propios controles del inicio, sin modificar el Dashboard.
- «Jugar ahora» / «Continuar la aventura» abre `/juego/index.html` en la misma pestaña, a pantalla completa.
- En la pantalla de inicio del juego, «◀ Salir del juego» regresa a `/juegos`. Ese botón no aparece si se abre `index.html` con doble clic.
- Rutas antiguas como `/juegos/minijuegos` llevan a la sección de minijuegos de la portada.

## Cambios frente a la demo «Versión final»

1. Sin el sello «PENDIENTE DE APROBACIÓN» (`version.js`).
2. «Ver el tutorial otra vez» (Ajustes) ya no vuelve a bloquear el Álbum del Explorador. Se guarda `albumAbierto` al terminar el tutorial. El texto de desbloqueo ahora dice «Termina el tutorial de León Viejo».
3. Si se sale al mapa (o se reinicia) justo después de sonar la campana, ya no se salta a la zona siguiente ni a la Gritería. Tampoco se puede pausar durante la celebración de la campana.
4. Ajedrez: tablas por repetición triple y por material insuficiente (rey solo, rey y alfil, rey y caballo, o solo alfiles del mismo color). El mensaje de tablas explica el motivo.
5. Sopa de letras: si una palabra no cabía, se arma otra cuadrícula; cada nivel trae siempre sus 6, 9 o 13 palabras.
6. Botón rojo «◀ Salir del juego» arriba a la izquierda en la pantalla de inicio del juego.
7. Ventana de zona como ficha mínima (`pantallas.js` → `zona()`, estilos `.zf-*`): franja con la imagen de la zona (nombre, personaje y mejor marca), el dato cultural y los 3 botones de dificultad. Los minijuegos siguen en su menú.
8. Pantalla de título minimalista (`inicio()`, estilos `.ini-*`): logo en vertical sin caja (cúpula `img/logo-cupula.png` arriba y letras `img/logo-texto.png` en los colores originales, sacadas de `logo.png`) sobre un cielo que se oscurece arriba hacia el azul de la marca; un botón grande (JUGAR o CONTINUAR) y una línea con la zona que sigue y el avance; Vestuario, Minijuegos y Ajustes como íconos arriba a la derecha. `img/logo-titulo.png` ya no se usa y se puede borrar.
9. Ajustes: botón «◀ Salir del juego» junto a «Borrar mi progreso».
10. El Punche de Oro solo tiene su traje de oro (se quitaron nácar, coral y jade). Si una partida guardada los había comprado, se le devuelven los ecos.
11. Nuevo modo `libre` en `version.js`: la versión final con todo desbloqueado (zonas, personajes, minijuegos y dificultades), con «+500 ecos» en Ajustes y guardado aparte (`ecosdeleon_libre_v1`). La web usa `final`.
12. La Gritería se abre al completar las 6 zonas y, mientras no se haya celebrado, aparece sola al entrar al mapa; el botón del mapa y la flecha apuntan a ella (antes volvían a León Viejo).
13. `/* eslint-disable */` al inicio de cada archivo del juego, para que `npm run lint` no lo revise (es código de navegador sin módulos).

## Comprobar

Desde `frontend`:

```bash
npm run dev          # luego abrir http://localhost:5173/juegos
npm run lint
npm run build
node --test src/pages/Juegos/tests/games.test.mjs
```
