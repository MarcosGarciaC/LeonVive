/* eslint-disable */
/* Minijuego de Rubén Darío · «Letras de Darío» (sopa de letras con datos de su vida y su obra) */
'use strict';
EL.MJ.sopa = (function () {
  let timer;
  const CFG = { f: { n: 9, k: 6, dirs: [[1, 0], [0, 1]] }, m: { n: 11, k: 9, dirs: [[1, 0], [0, 1], [1, 1], [1, -1]] }, d: { n: 14, k: 13, dirs: [[1, 0], [0, 1], [1, 1], [1, -1], [-1, 0], [0, -1], [-1, -1], [-1, 1]] } };
  const LETRAS = 'AAABCDEEEFGHIIJLLMNNOOOPQRRSSTTUUVYZÑ';

  /* Elige palabras del tema sin repetir las ya usadas (rotación guardada) */
  function elegir(temaId, n, max) {
    const R = EL.R, tema = EL.SOPA[temaId], rot = EL.save.data.rot.sopa;
    let usadas = new Set(rot[temaId] || []);
    let libres = tema.palabras.filter(([w]) => w.length <= max && !usadas.has(w));
    if (libres.length < n) { usadas = new Set(); libres = tema.palabras.filter(([w]) => w.length <= max); }
    const sel = R.shuffle(libres.slice()).slice(0, n);
    rot[temaId] = [...usadas, ...sel.map(p => p[0])]; EL.save.guardar();
    return sel;
  }
  function construir(palabras, n, dirs) {
    const R = EL.R, g = Array.from({ length: n }, () => Array(n).fill('')), puestas = [];
    for (const [w, dato] of palabras.sort((a, b) => b[0].length - a[0].length)) {
      let ok = false;
      for (let intento = 0; intento < 400 && !ok; intento++) {
        const [dx, dy] = R.pick(dirs), x0 = R.int(0, n - 1), y0 = R.int(0, n - 1);
        const x1 = x0 + dx * (w.length - 1), y1 = y0 + dy * (w.length - 1);
        if (x1 < 0 || x1 >= n || y1 < 0 || y1 >= n) continue;
        let cabe = true; for (let i = 0; i < w.length; i++) { const c = g[y0 + dy * i][x0 + dx * i]; if (c && c !== w[i]) { cabe = false; break; } }
        if (!cabe) continue;
        for (let i = 0; i < w.length; i++) g[y0 + dy * i][x0 + dx * i] = w[i];
        puestas.push({ w, dato, x0, y0, dx, dy, ok: false }); ok = true;
      }
    }
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!g[y][x]) g[y][x] = LETRAS[R.int(0, LETRAS.length - 1)];
    return { g, puestas };
  }

  return {
    iniciar(dif, fin) {
      const cfg = CFG[dif], c = EL.pantallas.marcoMJ('Letras de Darío', dif);
      const temaId = EL.R.pick(Object.keys(EL.SOPA)), tema = EL.SOPA[temaId];
      const elegidas = elegir(temaId, cfg.k, cfg.n);
      // si alguna palabra no cupo, se arma otra cuadrícula (así el nivel siempre tiene todas sus palabras)
      let armado = construir(elegidas.slice(), cfg.n, cfg.dirs);
      for (let i = 0; i < 60 && armado.puestas.length < elegidas.length; i++) armado = construir(elegidas.slice(), cfg.n, cfg.dirs);
      const { g, puestas } = armado;
      const cel = Math.floor(590 / cfg.n) - 2;
      const grid = EL.el('div', { class: 'sopa' }); grid.style.gridTemplateColumns = `repeat(${cfg.n}, ${cel}px)`; grid.style.gridAutoRows = cel + 'px'; grid.style.setProperty('--fs', Math.round(cel * 0.58) + 'px');
      const celdas = [];
      for (let y = 0; y < cfg.n; y++) for (let x = 0; x < cfg.n; x++) { const d = EL.el('div', { 'data-x': x, 'data-y': y }, g[y][x]); celdas.push(d); grid.appendChild(d); }
      c.appendChild(grid);
      const lado = EL.el('div', { class: 'sopa-lado panel' }, `<div class="cinta ct" style="font-size:24px">${tema.nombre}</div><div class="ayuda">Arrastra sobre las letras (o toca la primera y la última). ${dif === 'd' ? 'Las palabras pueden ir al revés.' : dif === 'm' ? 'Hay palabras en diagonal.' : 'Van → y ↓.'}</div>
        <div class="palabras">${puestas.map(p => `<span data-w="${p.w}">${p.w}</span>`).join('')}</div>
        <button class="btn sec peq" id="s-pista" style="margin-top:12px;align-self:flex-start">💡 Pista</button>
        <div class="sopa-dato" id="s-dato"><img class="px" src="${EL.spriteURL('dario', 3, EL.progreso.traje('dario'))}"><div>Encuentra las palabras: cada una esconde un dato sobre Rubén Darío.</div></div>`);
      c.appendChild(lado);
      const t0 = performance.now(); let pistas = 0, hallados = 0;
      const estado = () => { if (!EL.$('#mj-estado')) return clearInterval(timer); EL.$('#mj-estado').innerHTML = `<span>Palabras: ${hallados}/${puestas.length}</span><span>⏱ ${Math.floor((performance.now() - t0) / 1000)} s</span>`; };
      clearInterval(timer); timer = setInterval(estado, 500); estado();
      const at = (x, y) => celdas[y * cfg.n + x];
      let ini = null, actual = [], tocado = null;
      const linea = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.max(Math.abs(dx), Math.abs(dy)); if (!(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) return null; const sx = Math.sign(dx), sy = Math.sign(dy), r = []; for (let i = 0; i <= L; i++) r.push([a[0] + sx * i, a[1] + sy * i]); return r; };
      const marcar = arr => { celdas.forEach(d => d.classList.remove('sel')); (arr || []).forEach(([x, y]) => at(x, y).classList.add('sel')); };
      const celdaDe = e => { const t = document.elementFromPoint(e.clientX, e.clientY); return t && t.parentNode === grid ? [+t.dataset.x, +t.dataset.y] : null; };
      const comprobar = arr => {
        if (!arr || arr.length < 2) return false;
        const txt = arr.map(([x, y]) => g[y][x]).join(''), inv = [...txt].reverse().join('');
        const p = puestas.find(q => !q.ok && (q.w === txt || q.w === inv) && ((q.x0 === arr[0][0] && q.y0 === arr[0][1]) || (q.x0 === arr[arr.length - 1][0] && q.y0 === arr[arr.length - 1][1])));
        if (!p) return false;
        p.ok = true; hallados++; arr.forEach(([x, y]) => at(x, y).classList.add('ok'));
        lado.querySelector(`[data-w="${p.w}"]`).classList.add('ok');
        EL.$('#s-dato').innerHTML = `<img class="px" src="${EL.spriteURL('dario', 3, EL.progreso.traje('dario'))}"><div><b>${p.w}</b>: ${p.dato}</div>`;
        EL.audio.eco(); EL.voz.decir(p.dato); estado();
        if (hallados === puestas.length) {
          clearInterval(timer); const s = Math.floor((performance.now() - t0) / 1000), extra = pistas === 0 ? 5 : 0;
          setTimeout(() => fin({ gano: true, mejor: Math.max(0, 600 - s), extra, titulo: '¡Encontraste todas las letras!', html: `<p style="font-size:19px">Tema «${tema.nombre}» en ${s} segundos${pistas ? ' con ' + pistas + ' pista(s)' : ' y sin pistas (+5)'}.</p><div style="text-align:left;max-height:230px;overflow:auto;font-size:16px;background:#fff;border-radius:8px;padding:8px 12px">${puestas.map(q => `<div><b>${q.w}</b> — ${q.dato}</div>`).join('')}</div>` }), 700);
        }
        return true;
      };
      grid.addEventListener('pointerdown', e => {
        const p = celdaDe(e); if (!p) return; e.preventDefault();
        if (tocado) { const arr = linea(tocado, p); if (arr && comprobar(arr)) { tocado = null; marcar(); return; } }
        ini = p; actual = [p]; marcar(actual);
      });
      grid.addEventListener('pointermove', e => { if (!ini) return; const p = celdaDe(e); if (!p) return; const arr = linea(ini, p); if (arr) { actual = arr; marcar(arr); } });
      const soltar = () => {
        if (!ini) return;
        if (actual.length <= 1) { tocado = ini; marcar([ini]); ini = null; return; }
        if (!comprobar(actual)) EL.audio.error(); ini = null; tocado = null; marcar();
      };
      // piloto automático (solo lo usa la demo publicitaria)
      this.auto = { paso() { const p = puestas.find(q => !q.ok); if (!p) return; const arr = []; for (let i = 0; i < p.w.length; i++) arr.push([p.x0 + p.dx * i, p.y0 + p.dy * i]); marcar(arr); setTimeout(() => { if (comprobar(arr)) marcar(); }, 700); } };
      if (this._soltar) removeEventListener('pointerup', this._soltar); addEventListener('pointerup', soltar); this._soltar = soltar;
      EL.$('#s-pista').onclick = () => { const p = puestas.find(q => !q.ok); if (!p) return; pistas++; const d = at(p.x0, p.y0); d.style.outline = '4px solid #c8553d'; d.style.outlineOffset = '-4px'; EL.audio.clic(); setTimeout(() => { d.style.outline = ''; }, 2500); };
    },
    salir() { clearInterval(timer); if (this._soltar) removeEventListener('pointerup', this._soltar); }
  };
})();
