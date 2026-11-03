/* eslint-disable */
/* Minijuego de la Gigantona y el Enano Cabezón · ajedrez completo (reglas oficiales)
   Tablero 8×8 = 64 casillas. Cada bando (blancas y negras) tiene 16 piezas:
   1 Rey (Enano Cabezón), 1 Reina (Gigantona), 2 Volcanes (torres), 2 Arqueros (alfiles), 2 Caballos y 8 Peones (pueblo). */
'use strict';
EL.MJ.ajedrez = (function () {
  const VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
  const NOMBRE = { K: 'Rey · Enano Cabezón', Q: 'Reina · Gigantona', R: 'Volcán (torre)', B: 'Arquero (alfil)', N: 'Caballo', P: 'Peón · Pueblo' };
  const MUEVE = { K: '1 casilla, cualquier dirección', Q: 'Líneas rectas y diagonales', R: 'Líneas rectas', B: 'Diagonales', N: 'En forma de L (salta)', P: 'Avanza 1 (2 al inicio)' };
  const lado = p => p ? (p === p.toUpperCase() ? 'w' : 'b') : null;
  const R_ = i => i >> 3, C_ = i => i & 7;
  const PST_P = [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0];
  const PST_N = [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50];
  const PST_C = [-10, -5, 0, 0, 0, 0, -5, -10, -5, 5, 5, 8, 8, 5, 5, -5, 0, 5, 10, 10, 10, 10, 5, 0, 0, 8, 10, 12, 12, 10, 8, 0, 0, 8, 10, 12, 12, 10, 8, 0, 0, 5, 10, 10, 10, 10, 5, 0, -5, 5, 5, 8, 8, 5, 5, -5, -10, -5, 0, 0, 0, 0, -5, -10];

  function inicial() {
    const fila = 'rnbqkbnr', b = Array(64).fill(null);
    for (let c = 0; c < 8; c++) { b[c] = fila[c]; b[8 + c] = 'p'; b[48 + c] = 'P'; b[56 + c] = fila[c].toUpperCase(); }
    return { b, t: 'w', cas: { K: true, Q: true, k: true, q: true }, ep: -1, medio: 0, plies: 0 };
  }
  function atacada(b, sq, por) {
    const r = R_(sq), c = C_(sq), en = (rr, cc) => rr >= 0 && rr < 8 && cc >= 0 && cc < 8;
    const pz = (rr, cc) => b[rr * 8 + cc];
    const dirP = por === 'w' ? 1 : -1; // peón blanco ataca hacia arriba: viene desde r+1
    for (const dc of [-1, 1]) { const rr = r + dirP, cc = c + dc; if (en(rr, cc) && pz(rr, cc) === (por === 'w' ? 'P' : 'p')) return true; }
    for (const [dr, dc] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]) { const rr = r + dr, cc = c + dc; if (en(rr, cc) && pz(rr, cc) === (por === 'w' ? 'N' : 'n')) return true; }
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      let rr = r + dr, cc = c + dc, paso = 1;
      while (en(rr, cc)) {
        const p = pz(rr, cc);
        if (p) { if (lado(p) === por) { const u = p.toUpperCase(); const recta = dr === 0 || dc === 0; if (u === 'Q' || (recta && u === 'R') || (!recta && u === 'B') || (paso === 1 && u === 'K')) return true; } break; }
        rr += dr; cc += dc; paso++;
      }
    }
    return false;
  }
  const rey = (b, s) => b.indexOf(s === 'w' ? 'K' : 'k');
  const enJaque = (st, s) => atacada(st.b, rey(st.b, s), s === 'w' ? 'b' : 'w');
  function pseudo(st) {
    const b = st.b, s = st.t, ms = [], en = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
    for (let i = 0; i < 64; i++) {
      const p = b[i]; if (!p || lado(p) !== s) continue;
      const u = p.toUpperCase(), r = R_(i), c = C_(i);
      const add = (to, extra = {}) => ms.push(Object.assign({ de: i, a: to, p, cap: b[to] }, extra));
      if (u === 'P') {
        const d = s === 'w' ? -1 : 1, ini = s === 'w' ? 6 : 1, ult = s === 'w' ? 0 : 7;
        if (en(r + d, c) && !b[(r + d) * 8 + c]) { add((r + d) * 8 + c, r + d === ult ? { promo: s === 'w' ? 'Q' : 'q' } : {}); if (r === ini && !b[(r + 2 * d) * 8 + c]) add((r + 2 * d) * 8 + c, { doble: true }); }
        for (const dc of [-1, 1]) { if (!en(r + d, c + dc)) continue; const to = (r + d) * 8 + c + dc; if (b[to] && lado(b[to]) !== s) add(to, r + d === ult ? { promo: s === 'w' ? 'Q' : 'q' } : {}); if (to === st.ep) add(to, { epCap: r * 8 + c + dc }); }
      } else if (u === 'N' || u === 'K') {
        const dd = u === 'N' ? [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dr, dc] of dd) { if (!en(r + dr, c + dc)) continue; const to = (r + dr) * 8 + c + dc; if (!b[to] || lado(b[to]) !== s) add(to); }
        if (u === 'K') {
          const op = s === 'w' ? 'b' : 'w', fila = s === 'w' ? 7 : 0;
          if (i === fila * 8 + 4 && !atacada(b, i, op)) {
            const kk = s === 'w' ? 'K' : 'k', qq = s === 'w' ? 'Q' : 'q';
            if (st.cas[kk] && !b[i + 1] && !b[i + 2] && b[i + 3] === (s === 'w' ? 'R' : 'r') && !atacada(b, i + 1, op) && !atacada(b, i + 2, op)) add(i + 2, { enroque: 'corto' });
            if (st.cas[qq] && !b[i - 1] && !b[i - 2] && !b[i - 3] && b[i - 4] === (s === 'w' ? 'R' : 'r') && !atacada(b, i - 1, op) && !atacada(b, i - 2, op)) add(i - 2, { enroque: 'largo' });
          }
        }
      } else {
        const dd = u === 'B' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : u === 'R' ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dr, dc] of dd) { let rr = r + dr, cc = c + dc; while (en(rr, cc)) { const to = rr * 8 + cc; if (b[to]) { if (lado(b[to]) !== s) add(to); break; } add(to); rr += dr; cc += dc; } }
      }
    }
    return ms;
  }
  function hacer(st, m) {
    const b = st.b.slice(), cas = Object.assign({}, st.cas);
    b[m.a] = m.promo || m.p; b[m.de] = null;
    if (m.epCap != null) b[m.epCap] = null;
    if (m.enroque === 'corto') { b[m.a - 1] = b[m.a + 1]; b[m.a + 1] = null; }
    if (m.enroque === 'largo') { b[m.a + 1] = b[m.a - 2]; b[m.a - 2] = null; }
    if (m.p === 'K') cas.K = cas.Q = false; if (m.p === 'k') cas.k = cas.q = false;
    [[63, 'K'], [56, 'Q'], [7, 'k'], [0, 'q']].forEach(([sq, k]) => { if (m.de === sq || m.a === sq) cas[k] = false; });
    return { b, t: st.t === 'w' ? 'b' : 'w', cas, ep: m.doble ? (m.de + m.a) / 2 : -1, medio: (m.p.toUpperCase() === 'P' || m.cap) ? 0 : st.medio + 1, plies: st.plies + 1 };
  }
  function legales(st) { return pseudo(st).filter(m => { const n = hacer(st, m); return !enJaque(n, st.t); }); }
  function evaluar(st) {
    let v = 0;
    for (let i = 0; i < 64; i++) {
      const p = st.b[i]; if (!p) continue; const u = p.toUpperCase(), w = p === u, idx = w ? i : (7 - R_(i)) * 8 + C_(i);
      let s = VAL[u] + (u === 'P' ? PST_P[idx] : u === 'N' ? PST_N[idx] : (u === 'B' || u === 'Q') ? PST_C[idx] : 0);
      v += w ? s : -s;
    }
    return v;
  }
  function buscar(st, prof, alfa, beta) {
    const ms = legales(st);
    if (!ms.length) return enJaque(st, st.t) ? -100000 - prof : 0;
    if (prof === 0) return (st.t === 'w' ? 1 : -1) * evaluar(st);
    ms.sort((a, b) => (b.cap ? VAL[b.cap.toUpperCase()] * 10 - VAL[b.p.toUpperCase()] : 0) - (a.cap ? VAL[a.cap.toUpperCase()] * 10 - VAL[a.p.toUpperCase()] : 0));
    for (const m of ms) { const v = -buscar(hacer(st, m), prof - 1, -beta, -alfa); if (v >= beta) return beta; if (v > alfa) alfa = v; }
    return alfa;
  }
  function mejor(st, dif) {
    const ms = legales(st); if (!ms.length) return null;
    if (dif === 'f' && Math.random() < 0.45) { const caps = ms.filter(m => m.cap); return Math.random() < 0.5 && caps.length ? EL.R.pick(caps) : EL.R.pick(ms); }
    const prof = { f: 1, m: 2, d: 3 }[dif]; let best = null, bv = -Infinity;
    EL.R.shuffle(ms);
    for (const m of ms) { const v = -buscar(hacer(st, m), prof - 1, -Infinity, -bv) + (dif === 'f' ? Math.random() * 60 : dif === 'm' ? Math.random() * 15 : 0); if (v > bv) { bv = v; best = m; } }
    return best;
  }
  /* Tablas: material insuficiente (rey solo, rey y alfil, rey y caballo, o solo alfiles del mismo color) */
  function sinMaterial(b) {
    const resto = [];
    for (let i = 0; i < 64; i++) if (b[i] && b[i].toUpperCase() !== 'K') resto.push([b[i].toUpperCase(), (R_(i) + C_(i)) % 2]);
    if (!resto.length) return true;
    if (resto.length === 1 && (resto[0][0] === 'B' || resto[0][0] === 'N')) return true;
    return resto.every(([u]) => u === 'B') && resto.every(([, c]) => c === resto[0][1]);
  }
  /* Clave de la posición para la repetición triple (la captura al paso cuenta solo si es posible) */
  function clave(st) {
    const ep = st.ep >= 0 && pseudo(st).some(m => m.epCap != null) ? st.ep : '-';
    return st.b.map(p => p || '.').join('') + st.t + ['K', 'Q', 'k', 'q'].filter(k => st.cas[k]).join('') + ep;
  }
  const img = (p) => EL.spriteURL('pieza:' + p.toUpperCase() + ':' + (lado(p) === 'w' ? 'blancas' : 'negras'), 4);

  return {
    _test: { inicial, legales, hacer, enJaque, sinMaterial, clave },
    iniciar(dif, fin) {
      const c = EL.pantallas.marcoMJ('Ajedrez de la Gigantona', dif);
      const yo = EL.R() < 0.5 ? 'w' : 'b', ia = yo === 'w' ? 'b' : 'w';
      let st = inicial(), sel = null, marcas = [], ult = null, hist = [], terminado = false, pensando = false;
      const claves = [clave(st)];   // posiciones de la partida, para detectar la repetición triple
      const cap = { w: [], b: [] };
      const tab = EL.el('div', { class: 'tablero' }); c.appendChild(tab);
      const lado_ = EL.el('div', { class: 'ajedrez-lado panel' }); c.appendChild(lado_);
      const tipos = ['K', 'Q', 'R', 'B', 'N', 'P'], cant = { K: 1, Q: 1, R: 2, B: 2, N: 2, P: 8 };
      lado_.innerHTML = `<div class="cinta ct" style="font-size:26px">Piezas de León</div><div class="turno" id="aj-turno"></div>
        <div style="font-weight:800">Juegas con las piezas <u>${yo === 'w' ? 'blancas' : 'negras'}</u> (sorteo al azar). ${yo === 'w' ? 'Empiezas tú.' : 'Empiezan las blancas.'}</div>
        <div class="leyenda">${tipos.map(t => `<div><img class="px" src="${img(yo === 'w' ? t : t.toLowerCase())}"><span><b>${NOMBRE[t]}</b> ×${cant[t]}<br><small>${MUEVE[t]}</small></span></div>`).join('')}</div>
        <div style="font-size:14px">Tablero de 8×8 = 64 casillas · 16 piezas por bando (32 en total).</div>
        <div><b>Capturadas:</b><div class="capturas" id="aj-cap"></div></div>
        <div style="display:flex;gap:10px;margin-top:auto">${dif !== 'd' ? '<button class="btn sec peq" id="aj-undo">↶ Deshacer</button>' : ''}<button class="btn rojo peq" id="aj-rend">🏳 Rendirse</button></div>`;
      const casillas = [];
      const vista = k => yo === 'w' ? k : 63 - k; // el jugador siempre abajo
      for (let k = 0; k < 64; k++) { const i = vista(k), d = EL.el('div', { class: (R_(i) + C_(i)) % 2 ? 'c2' : 'c1', 'data-i': i }); casillas[i] = d; tab.appendChild(d); }
      const pintar = () => {
        if (!tab.isConnected) return;   // ya se salió del minijuego
        const jaque = enJaque(st, st.t) ? rey(st.b, st.t) : -1;
        for (let i = 0; i < 64; i++) {
          const d = casillas[i], p = st.b[i], m = marcas.find(q => q.a === i);
          d.className = ((R_(i) + C_(i)) % 2 ? 'c2' : 'c1') + (sel === i ? ' sel' : '') + (m ? (st.b[i] || m.epCap != null ? ' cap' : ' mov') : '') + (ult && (ult.de === i || ult.a === i) ? ' ult' : '') + (jaque === i ? ' jaque' : '');
          d.innerHTML = p ? `<img class="px" src="${img(p)}">` : '';
        }
        EL.$('#aj-turno').textContent = terminado ? '' : (st.t === yo ? (jaque >= 0 ? '¡Jaque! Protege a tu Enano Cabezón' : 'Tu turno') : 'Piensa el rival…');
        EL.$('#aj-turno').style.background = st.t === yo ? '#d9f5df' : '#e6e0f0';
        EL.$('#aj-cap').innerHTML = cap[yo].map(p => `<img class="px" src="${img(p)}">`).join('') + (cap[ia].length ? ' · Perdidas: ' + cap[ia].map(p => `<img class="px" src="${img(p)}">`).join('') : '');
        EL.$('#mj-estado').innerHTML = `<span>Jugadas: ${Math.ceil(st.plies / 2)}</span>`;
      };
      const finJuego = () => {
        const ms = legales(st);
        const sinMat = sinMaterial(st.b), actual = claves[claves.length - 1], rep = claves.filter(k => k === actual).length >= 3;
        if (ms.length && st.medio < 100 && !sinMat && !rep && st.plies < 300) return false;
        terminado = true; pintar();
        const mate = !ms.length && enJaque(st, st.t), ganoYo = mate && st.t === ia;
        const motivo = !ms.length ? 'Ahogado: el rey no está en jaque, pero no tiene jugadas.' : sinMat ? 'No quedan piezas suficientes para dar jaque mate.' : rep ? 'La misma posición se repitió tres veces.' : st.medio >= 100 ? 'Pasaron 50 jugadas sin capturas ni movimientos de peón.' : 'La partida llegó al límite de jugadas.';
        setTimeout(() => fin({ gano: ganoYo, extra: !mate ? 5 : 0, titulo: ganoYo ? '¡Jaque mate! Ganaste' : mate ? 'Jaque mate del rival' : 'Tablas (empate)', html: `<p style="font-size:20px">${ganoYo ? 'La Gigantona y el Enano Cabezón celebran al son del tambor.' : mate ? 'Tu Enano Cabezón quedó sin salida. ¡Revancha!' : 'Tablas: ' + motivo + ' Recibes un pequeño premio.'}</p>` }), 900);
        return true;
      };
      const mover = m => {
        hist.push({ st, cap: { w: cap.w.slice(), b: cap.b.slice() }, ult, n: claves.length });
        const capturada = m.cap || (m.epCap != null ? st.b[m.epCap] : null);
        if (capturada) { cap[lado(m.p)].push(capturada); EL.audio.tambor(); } else EL.audio.clic();
        st = hacer(st, m); claves.push(clave(st)); ult = m; sel = null; marcas = []; pintar();
        if (!finJuego() && st.t === ia) turnoIA();
      };
      const turnoIA = () => { pensando = true; pintar(); setTimeout(() => { if (!tab.isConnected) return; const m = mejor(st, dif); pensando = false; if (m) mover(m); }, 350); };
      tab.addEventListener('pointerdown', e => {
        const d = e.target.closest('[data-i]'); if (!d || terminado || pensando || st.t !== yo) return;
        const i = +d.dataset.i, m = marcas.find(q => q.a === i);
        if (m) { mover(m); return; }
        if (st.b[i] && lado(st.b[i]) === yo) { sel = i; marcas = legales(st).filter(q => q.de === i); EL.audio.clic(); }
        else { sel = null; marcas = []; }
        pintar();
      });
      if (EL.$('#aj-undo')) EL.$('#aj-undo').onclick = () => { if (pensando || terminado) return; let h; while (hist.length && (h = hist.pop()) && h.st.t !== yo); if (h) { st = h.st; claves.length = h.n; cap.w = h.cap.w; cap.b = h.cap.b; ult = h.ult; sel = null; marcas = []; pintar(); } };
      EL.$('#aj-rend').onclick = () => { if (terminado) return; terminado = true; fin({ gano: false, titulo: 'Te rendiste', html: '<p style="font-size:20px">¡La próxima será! Practica en fácil para aprender los movimientos.</p>' }); };
      this.auto = { paso() { if (terminado || pensando || st.t !== yo) return; const m = mejor(st, 'm'); if (!m) return; sel = m.de; marcas = [m]; pintar(); setTimeout(() => { if (!terminado) mover(m); }, 500); } };   // demo
      pintar(); if (st.t === ia) turnoIA();
    }
  };
})();
