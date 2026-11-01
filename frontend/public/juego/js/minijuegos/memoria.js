/* eslint-disable */
/* Minijuego del Explorador · «Álbum del Explorador» (memoria de imágenes, sin palabras obligatorias) */
'use strict';
EL.MJ.memoria = (function () {
  let t0, timer;
  return {
    iniciar(dif, fin) {
      const c = EL.pantallas.marcoMJ('Álbum del Explorador', dif);
      const pares = { f: 6, m: 8, d: 12 }[dif], colsN = { f: 6, m: 8, d: 8 }[dif];
      /* Elección al azar con sentido: fácil = un tema, medio = dos temas, difícil = los tres.
         Se evita repetir las imágenes de la partida anterior. */
      const R = EL.R, temas = R.shuffle(Object.keys(EL.ALBUM)).slice(0, dif === 'f' ? 1 : dif === 'm' ? 2 : 3);
      const usados = new Set(EL.save.data.rot.memoria || []);
      let pool = R.shuffle(temas.flatMap(t => EL.ALBUM[t]));
      pool.sort((a, b) => usados.has(a) - usados.has(b));
      const elegidos = pool.slice(0, pares);
      EL.save.data.rot.memoria = elegidos; EL.save.guardar();
      const cartas = R.shuffle(elegidos.concat(elegidos));
      const nombresTema = { lugares: 'Lugares de León', tradiciones: 'Tradiciones', poemas: 'Poemas de Darío' };
      const grid = EL.el('div', { class: 'memoria' }); grid.style.gridTemplateColumns = `repeat(${colsN}, 132px)`;
      if (dif === 'd') { grid.style.gridTemplateColumns = 'repeat(8, 118px)'; }
      c.appendChild(grid);
      const tema = EL.el('div', { class: 'tema-memoria ct' }, '📖 Tema: ' + temas.map(t => nombresTema[t]).join(' · '));
      c.appendChild(tema);
      let abiertas = [], hechos = 0, movs = 0, bloqueo = false;
      t0 = performance.now();
      const estado = () => { EL.$('#mj-estado').innerHTML = `<span>Parejas: ${hechos}/${pares}</span><span>Intentos: ${movs}</span><span>⏱ ${Math.floor((performance.now() - t0) / 1000)} s</span>`; };
      clearInterval(timer); timer = setInterval(() => { if (EL.$('#mj-estado')) estado(); else clearInterval(timer); }, 500); estado();
      cartas.forEach(id => {
        const k = EL.el('div', { class: 'carta' }, `<div class="in"><div class="cara dorso"></div><div class="cara frente"><img class="px" src="${EL.iconoURL(id, 3)}"><div class="nombre">${EL.NOMBRE_ICONO[id]}</div></div></div>`);
        if (dif === 'd') { k.style.width = k.style.height = '118px'; }
        k.onclick = () => {
          if (bloqueo || k.classList.contains('vuelta') || k.classList.contains('par')) return;
          EL.audio.clic(); k.classList.add('vuelta'); abiertas.push([k, id]);
          if (abiertas.length === 2) {
            movs++; bloqueo = true;
            const [[a, ia], [b, ib]] = abiertas;
            if (ia === ib) {
              setTimeout(() => { a.classList.add('par'); b.classList.add('par'); EL.audio.eco(); EL.voz.decir(EL.NOMBRE_ICONO[ia]); hechos++; abiertas = []; bloqueo = false; estado();
                if (hechos === pares) { clearInterval(timer); const s = Math.floor((performance.now() - t0) / 1000), extra = movs <= pares + 2 ? 5 : 0;
                  setTimeout(() => fin({ gano: true, mejor: Math.max(0, 100 - movs), extra, titulo: '¡Álbum completo!', html: `<p style="font-size:20px">Encontraste ${pares} parejas en ${movs} intentos y ${s} segundos.${extra ? ' <b>¡Memoria de explorador! +5</b>' : ''}</p><div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">${elegidos.map(i => `<img class="px" style="width:56px" src="${EL.iconoURL(i, 2)}" title="${EL.NOMBRE_ICONO[i]}">`).join('')}</div>` }), 600); } }, 350);
            } else setTimeout(() => { a.classList.remove('vuelta'); b.classList.remove('vuelta'); abiertas = []; bloqueo = false; }, 850);
          }
        };
        grid.appendChild(k);
      });
    },
    salir() { clearInterval(timer); }
  };
})();
