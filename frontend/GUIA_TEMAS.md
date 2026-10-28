# Ecos de León — hub de temas (4.2)

Esta extensión parte del repositorio `LeonVive(1).zip` y mantiene React + Vite + React Router. Conserva el dashboard existente y agrega un catálogo editorial de 7 temas con 35 fichas de demostración.

## Cómo ejecutarlo

Desde `LeonVive/frontend`:

```bash
npm install
npm run dev
```

Después visita `http://localhost:5173/temas` y explora las rutas. En despliegues con `BrowserRouter`, configura el fallback de rutas a `index.html`.

## Rutas nuevas

- `/temas` — catálogo visual, recuentos, filtro de búsqueda.
- `/temas/historia` — Historia de León.
- `/temas/personajes` — Personajes históricos.
- `/temas/gastronomia` — Gastronomía.
- `/temas/cultura` — Cultura.
- `/temas/tradiciones` — Tradiciones.
- `/temas/aves` — Aves comunes de León.
- `/temas/leyendas` — Leyendas.

Cada página contiene portada, introducción, selección de cinco fichas, galería y enlaces a otros temas. Una ficha se abre en un panel accesible con opciones para guardarla y marcarla como leída. Estas acciones se guardan en `localStorage` (no en la nube): `ecos:temas:guardadas` y `ecos:temas:leidas`.

Los temas se configuran desde `src/topicsData.js`; modificar la colección actualiza automáticamente sus recuentos, menú y fichas. Vista principal en `src/pages/Topics/Topics.jsx`, estilos en `src/pages/Topics/Topics.css`. El dashboard original ahora integra el enlace y una sección de acceso a los siete temas.

## Datos, procedencia y uso de imágenes

Las fichas de Historia, Personajes, Cultura, Tradiciones y Leyendas parten de los dos documentos académicos proporcionados (Propuesta de identidad proyecto / Propuesta web Ecos de León). Los relatos se marcan como *Tradición oral* y la figura de Adiact se presenta con sus discrepancias.

Los temas adicionales se complementaron con información pública:

- Gastronomía: Instituto Nicaragüense de Cultura, *Mapa de gastronomía tradicional del departamento de León* (2023): https://www.inc.gob.ni/wp-content/uploads/2023/04/LE%C3%93N-MP-GASTRONOM%C3%8DA.pdf
- Gastronomía de León: https://www.mapanicaragua.com/municipio-de-leon/
- Quesillo y La Paz Centro: https://www.mapanicaragua.com/municipio-de-la-paz-centro/
- Aves registradas en Isla Juan Venado: https://www.visitleon.info/reserva-natural-isla-juan-venado.html
- Avifauna local: https://repositorio.unan.edu.ni/id/eprint/2338/1/73827.pdf

**Importante:** las fichas son resúmenes editoriales para un prototipo, no artículos definitivos. Algunas imágenes son fotos de referencia remotas tomadas de sitios públicos que pueden requerir autorización de reproducción antes del lanzamiento. Las imágenes remotas incluyen rutas de respaldo local en caso de no cargar; algunas fotos locales son contextuales y no muestran literalmente la especie, receta o persona. Reemplazar esas fotografías por material propio/licenciado antes de publicar la web definitivamente. En `src/topicsData.js` se conserva el crédito contextual de cada imagen para mostrarlo en el panel de ficha.

Las transiciones respetan la preferencia de accesibilidad de movimiento reducido (`prefers-reduced-motion`). La página está diseñada para desktop, tablet y móvil.
