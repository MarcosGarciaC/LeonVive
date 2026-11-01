/* eslint-disable */
/* Minijuego de Margarita · «El cuento de Margarita» (rompecabezas con escenas de «A Margarita Debayle») */
'use strict';
EL.MJ.rompecabezas = (function () {
  let timer;
  return {
    iniciar(dif, fin) {
      const c = EL.pantallas.marcoMJ('El cuento de Margarita', dif);
      const n = { f: 3, m: 4, d: 5 }[dif], TAM = 480, pz = TAM / n;
      // escena al azar, evitando la última que se armó
      const ult = EL.save.data.rot.rompe || [];
      let opciones = EL.ESCENAS.filter(e => !ult.includes(e.id)); if (!opciones.length) opciones = EL.ESCENAS.slice();
      const esc = EL.R.pick(opciones); EL.save.data.rot.rompe = ult.concat(esc.id).slice(-3); EL.save.guardar();
      const url = EL.escenaURL(esc.id, TAM / 160);
      // orden mezclado (nunca resuelto al empezar)
      let orden = [...Array(n * n).keys()];
      do { EL.R.shuffle(orden); } while (orden.every((v, i) => v === i));
      const tab = EL.el('div', { class: 'puzzle' }); tab.style.gridTemplateColumns = `repeat(${n}, ${pz}px)`; tab.style.gridAutoRows = pz + 'px';
      c.appendChild(tab);
      const lado = EL.el('div', { class: 'puzzle-lado panel' }, `<div class="cinta ct" style="font-size:26px">«${esc.titulo}»</div>
        <div style="font:600 17px/1.35 var(--lectura)">Toca dos piezas para cambiarlas de lugar, o arrástralas. Arma la escena del poema.</div>
        <button class="btn sec peq" id="pz-ver" style="align-self:flex-start">👁 Ver modelo</button>
        <img class="modelo oculto" id="pz-modelo" src="${url}">
        <div style="display:flex;gap:12px;align-items:center;margin-top:auto"><img class="px" style="height:110px" src="${EL.spriteURL('margarita', 5, EL.progreso.traje('margarita'))}"><div style="font:italic 700 19px/1.35 Georgia,serif">«A Margarita Debayle»<br>Rubén Darío (1908)</div></div>`);
      c.appendChild(lado);
      EL.$('#pz-ver').onclick = () => { EL.$('#pz-modelo').classList.toggle('oculto'); EL.audio.clic(); };
      const t0 = performance.now(); let movs = 0, sel = null, arr = null;
      const estado = () => { if (!EL.$('#mj-estado')) return clearInterval(timer); const bien = orden.filter((v, i) => v === i).length; EL.$('#mj-estado').innerHTML = `<span>Piezas en su lugar: ${bien}/${n * n}</span><span>Cambios: ${movs}</span><span>⏱ ${Math.floor((performance.now() - t0) / 1000)} s</span>`; };
      clearInterval(timer); timer = setInterval(estado, 500);
      const pintar = () => {
        tab.innerHTML = '';
        orden.forEach((v, i) => {
          const d = EL.el('div', { class: 'pieza' + (v === i ? ' bien' : '') + (sel === i ? ' sel' : ''), 'data-i': i });
          d.style.width = d.style.height = pz + 'px'; d.style.backgroundImage = `url(${url})`; d.style.backgroundSize = `${TAM}px ${TAM}px`;
          d.style.backgroundPosition = `${-(v % n) * pz}px ${-Math.floor(v / n) * pz}px`;
          tab.appendChild(d);
        });
        estado();
      };
      const cambiar = (a, b) => {
        if (a === b) return; [orden[a], orden[b]] = [orden[b], orden[a]]; movs++; EL.audio.clic(); sel = null; pintar();
        if (orden.every((v, i) => v === i)) {
          clearInterval(timer); EL.audio.victoria(); tab.style.gap = '0px';
          EL.voz.decir(esc.verso.replace(/\n/g, ' '));
          const s = Math.floor((performance.now() - t0) / 1000), extra = movs <= n * n ? 5 : 0;
          setTimeout(() => fin({ gano: true, mejor: Math.max(0, 500 - s), extra, titulo: '¡Escena completa!', html: `<img class="px" style="width:260px;border:4px solid #1b1222;border-radius:6px" src="${url}"><p style="font-size:18px;margin:6px 0">${movs} cambios · ${s} s${extra ? ' · ¡Pocos movimientos! +5' : ''}</p>`, verso: esc.verso }), 1200);
        }
      };
      this.auto = { paso() { const i = orden.findIndex((v, k) => v !== k); if (i < 0) return; const j = orden.indexOf(i); sel = i; pintar(); setTimeout(() => cambiar(i, j), 450); } };   // demo
      const idx = e => { const t = document.elementFromPoint(e.clientX, e.clientY); const d = t && t.closest && t.closest('.pieza'); return d ? +d.dataset.i : null; };
      tab.addEventListener('pointerdown', e => { const i = idx(e); if (i == null) return; e.preventDefault(); arr = i; });
      tab.addEventListener('pointerup', e => {
        const i = idx(e); if (i == null || arr == null) { arr = null; return; }
        if (i !== arr) { cambiar(arr, i); arr = null; return; }
        arr = null;
        if (sel == null) { sel = i; EL.audio.clic(); pintar(); } else cambiar(sel, i);
      });
      pintar();
    },
    salir() { clearInterval(timer); }
  };
})();
