/* eslint-disable */
/* Ecos de León · arranque, bucle principal y ajuste a la pantalla */
'use strict';
(function () {
  const lienzo = EL.$('#lienzo'), ctx = lienzo.getContext('2d'); ctx.imageSmoothingEnabled = false;
  const esc = EL.$('#escenario');

  function ajustar() {
    const k = Math.min(innerWidth / 1280, innerHeight / 720);
    esc.style.transform = `scale(${k}) translate(-50%, -50%)`;
  }
  addEventListener('resize', ajustar); ajustar();

  /* Clics y toques sobre el lienzo (mapa, laberinto, Gritería) */
  const coords = e => { const r = lienzo.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 640, (e.clientY - r.top) / r.height * 360]; };
  lienzo.addEventListener('pointerdown', e => { EL.audio.unlock(); if (EL.escena && EL.escena.clic) EL.escena.clic(...coords(e)); });
  lienzo.addEventListener('pointermove', e => { if (EL.escena && EL.escena.mover) EL.escena.mover(...coords(e), e.buttons); });
  addEventListener('pointerup', e => { if (EL.escena && EL.escena.soltar) EL.escena.soltar(...coords(e)); });
  lienzo.addEventListener('wheel', e => { if (EL.escena && EL.escena.rueda) { e.preventDefault(); EL.escena.rueda(e.deltaY); } }, { passive: false });
  // los clics en la capa de interfaz vacía también llegan al lienzo
  EL.$('#ui').addEventListener('pointerdown', e => { if (e.target === EL.$('#ui') && EL.escena && EL.escena.clic) EL.escena.clic(...coords(e)); });
  EL.$('#ui').addEventListener('pointermove', e => { if ((e.target === EL.$('#ui') || e.buttons) && EL.escena && EL.escena.mover) EL.escena.mover(...coords(e), e.buttons); });
  EL.$('#ui').addEventListener('wheel', e => { if (e.target === EL.$('#ui') && EL.escena && EL.escena.rueda) { e.preventDefault(); EL.escena.rueda(e.deltaY); } }, { passive: false });

  EL.enlazarTactil(EL.$('#tactil')); EL.enlazarTactil(EL.$('#tactil-laberinto'));

  let ultimo = performance.now();
  function bucle(ahora) {
    const dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
    EL.input.actualizar();
    try {
      if (EL.escena) {
        const hd = !!EL.escena.hd, ancho = hd ? 1280 : 640;
        if (lienzo.width !== ancho) { lienzo.width = ancho; lienzo.height = ancho * 9 / 16; }
        EL.escena.actualizar(dt); ctx.setTransform(hd ? 2 : 1, 0, 0, hd ? 2 : 1, 0, 0); ctx.imageSmoothingEnabled = false; EL.escena.dibujar(ctx);
      }
      else { ctx.fillStyle = '#1d1b3a'; ctx.fillRect(0, 0, 640, 360); }
    } catch (err) { console.error(err); }
    requestAnimationFrame(bucle);
  }
  requestAnimationFrame(bucle);

  const sello = EL.$('#sello'); if (sello) sello.textContent = EL.CONFIG.sello || '';
  document.body.classList.add('v-' + EL.VERSION);
  if (EL.VERSION !== 'demo') EL.pantallas.inicio();
})();
