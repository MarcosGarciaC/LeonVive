# Ecos de León — Dashboard cultural

Rediseño de la página de inicio de **Ecos de León** a partir de los documentos del proyecto y del recorrido visual compartido por el equipo de la web Guacalito de la Isla.

## Ejecutar el proyecto

Requisitos: Node.js compatible con Vite 8 (Node.js 20.19+ o 22.12+ recomendado) y npm.

```bash
cd LeonVive/frontend
npm install
npm run dev
```

Abre la URL local que imprime Vite (habitualmente `http://localhost:5173`). **No necesitas iniciar un backend** para este dashboard demostrativo.

Para compilar: `npm run build`. Para comprobar estilos y JSX: `npm run lint`.

## Nuevo: catálogo de temas

La página inicial incluye acceso a las **7 páginas de temas** a través de `/temas`. Las 35 fichas de demostración están descritas en `GUIA_TEMAS.md`, con rutas y referencias de contenido.

## Qué funciona

- Navegación adaptable a escritorio y móvil.
- Búsqueda de lugares, personajes, tradiciones e historias.
- Fichas culturales con información documentada en los informes.
- Progreso de lectura y guardado de lugares con `localStorage`.
- «Sigue donde te quedaste» y resumen de actividad de «Mi espacio».
- Selector interactivo de lugares y enlaces a su búsqueda en mapas.
- Calendario mes a mes con eventos fijos y eventos de fecha variable.
- Biblioteca de Rubén Darío con enlaces externos y trivia cultural.
- Secciones con aparición suave al hacer scroll (y alternativa sin movimiento).

## Estado de la solución

Esta es una **demostración frontend React**. El inicio de sesión sin contraseña, el almacenamiento remoto, la sincronización sin conexión y la instalación PWA, contemplados en el informe web, requieren una integración posterior.

## Diseño y fuentes

- Diseño original inspirado en los patrones de composición del sitio Guacalito de la Isla: grandes fotografías, verde profundo, fondos cálidos, tipografía editorial, aire entre secciones y transiciones discretas. No se copió su código ni se reutilizaron sus recursos gráficos.
- Contenidos basados en **Ecos de León: Propuesta de Identidad Cultural** y **Ecos de León: Informe de la Propuesta de la Plataforma Web**.
- Se conserva el logo original suministrado por el proyecto, junto con una versión clara del mismo preparada para fondos verdes.
- Las imágenes locales de León son **composiciones artísticas** inspiradas en sus edificios y paisajes, no registros fotográficos documentales. Las fichas incluyen fuentes externas de Wikimedia Commons donde están disponibles, con imágenes locales como alternativa.
- Fragmento de `Canción de otoño en primavera` de Rubén Darío, de dominio público.

## Estructura

- `src/App.jsx` — dashboard y sus interacciones.
- `src/App.css`, `src/index.css` — estilo y diseño responsive.
- `src/data.js` — contenidos de cultura, lugares y tradiciones.
- `public/images` — recursos gráficos locales y logo.
