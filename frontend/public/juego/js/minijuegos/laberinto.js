/* eslint-disable */
/* Minijuego del Cadejo y el Punche de Oro · «Laberinto nocturno» (runner interminable en 2D, vista desde arriba)
   - El explorador corre por las calles-laberinto de León de noche. Se cambia de carril (◀ ▶) y se salta (▲).
   - En cada esquina hay que girar a tiempo (◀ o ▶); si no, choca con el muro.
   - Las filas de Punches de Oro bloquean la calle de lado a lado: solo se pueden saltar.
   - El Cadejo sale de frente al empezar y luego persigue; a veces vuelve a salir de frente por un carril.
   - Hay piedras y barriles en el camino. Tres vidas: al perderlas, el Cadejo te alcanza y se vuelve al inicio. */
'use strict';
EL.MJ.laberinto = (function () {
  const CX = 320, PY = 236, CARRIL = 58, MEDIO = 92, MURO = 26;  // geometría en pantalla (640×360)
  const META = { f: 3000, m: 5000, d: 7000 };                       // metros para ganar el premio (luego sigue sin fin)
  const PERRO = ['.....nn.....', '....cccc....', '...ceccec...', '..CccccccC..', '.CC.cccc.CC.', '...cccccc...', '.f.cccccc.f.', '.f.cccccc.f.', '...cccccc...', '...CccccC...', '.f.cccccc.f.', '.f..cccc..f.', '.....cc.....', '.....cC.....', '......C.....'];
  const PERRO2 = PERRO.map((r, i) => (i === 6 || i === 7) ? '...cccccc.f.' : (i === 10 || i === 11) ? '.f.cccccc...' : r);
  let perroCache = {};
  function perro(traje, paso) {
    const k = traje + paso; if (perroCache[k]) return perroCache[k];
    const v = (EL.VESTUARIO.cadejo.find(q => q.id === traje) || {}).pal || {};
    return (perroCache[k] = EL._construirSprite(paso ? PERRO2 : PERRO, Object.assign({}, EL.SPR.cadejo.pal, v)));
  }

  class Escena {
    constructor(dif, fin) {
      this.dif = dif; this.fin = fin; this.t = 0; this.rng = EL.rng(Date.now() & 0xffffff);
      this.vidas = 3; this.inv = 0; this.ecos = 0; this.dist = 0; this.meta = META[dif]; this.metaAvisada = false;
      this.vel = { f: 120, m: 145, d: 170 }[dif]; this.velMax = this.vel + 110;
      this.carril = 1; this.xCarril = 0; this.z = 0; this.vz = 0; this.s = 0;
      this.perseguidor = 70;                       // distancia del Cadejo detrás (px)
      this.estado = 'listo'; this.giro = null; this.particulas = []; this.msj = null; this.nSeg = 0;
      this.nuevoSegmento(true);
    }
    /* ---- Generación de calles ---- */
    nuevoSegmento(primero) {
      const r = this.rng, prog = Math.min(1, this.dist / 2500), dif = { f: 0, m: 1, d: 2 }[this.dif];
      const L = primero ? 760 : r.int(620, 980);
      const tipo = r.pick(['izq', 'der', 'T', 'izq', 'der']);
      const obs = [], ecos = [];
      const paso = Math.max(120, 230 - dif * 30 - prog * 70);
      let d = primero ? 320 : 170;
      if (primero) obs.push({ tipo: 'cadejo', d: 260, carril: 1, vel: 90 });    // el Cadejo sale de frente al empezar
      while (d < L - 150) {
        const k = r();
        if (k < 0.34) obs.push({ tipo: 'punches', d });
        else if (k < 0.62) { const c = r.int(0, 2); obs.push({ tipo: r() < 0.5 ? 'roca' : 'barril', d, carril: c }); if (prog > 0.3 && r() < 0.35) obs.push({ tipo: 'roca', d, carril: (c + r.int(1, 2)) % 3 }); }
        else if (k < 0.72 + dif * 0.04) obs.push({ tipo: 'cadejo', d: d + 60, carril: r.int(0, 2), vel: 70 + dif * 20 });
        else { const c = r.int(0, 2); for (let i = 0; i < 4; i++) ecos.push({ d: d + i * 22, carril: c, vivo: true }); }
        const c2 = r.int(0, 2); ecos.push({ d: d + paso / 2, carril: c2, vivo: true });
        d += paso + r.int(0, 60);
      }
      this.seg = { L, tipo, obs, ecos, id: this.nSeg++ };
    }
    /* ---- Entrada ---- */
    entrada() {
      const I = EL.input;
      const izq = I.pulso('izq') || this.swipe === 'izq', der = I.pulso('der') || this.swipe === 'der', salto = I.pulso('salto') || I.pulso('arr') || this.swipe === 'arr';
      this.swipe = null;
      const enEsquina = this.seg.L - this.s < 140 && !this.giro;
      if (izq) { if (enEsquina && (this.seg.tipo === 'izq' || this.seg.tipo === 'T')) this.girar(-1); else this.carril = Math.max(0, this.carril - 1); }
      if (der) { if (enEsquina && (this.seg.tipo === 'der' || this.seg.tipo === 'T')) this.girar(1); else this.carril = Math.min(2, this.carril + 1); }
      if (salto && this.z <= 0) { this.vz = 330; EL.audio.salto(); }
    }
    girar(dir) { this.giro = { dir, t: 0, sobra: 0 }; EL.audio.clic(); }
    herir(texto) {
      if (this.inv > 0) return;
      this.vidas--; this.inv = 1.4; this.perseguidor = Math.max(18, this.perseguidor - 26); EL.audio.golpe(); this.sacudir = 0.3;
      this.msj = { txt: texto, t: 1.4 };
      if (this.vidas <= 0) { this.estado = 'atrapado'; EL.audio.ladrido(); setTimeout(() => this.terminar(), 1300); }
    }
    terminar() {
      this.estado = 'fin'; EL.enJuego = false; EL.pantallas.tactil(null);
      const m = Math.floor(this.dist / 10), gano = this.dist >= this.meta;
      this.fin({ gano, extra: this.ecos, mejor: m, titulo: gano ? '¡Gran carrera!' : '¡El Cadejo te alcanzó!',
        html: `<div class="stats"><span class="stat">${m} m</span><span class="stat">Ecos: ${this.ecos}</span><span class="stat">Meta: ${this.meta / 10} m</span></div><div class="caja-texto" style="text-align:center">${gano ? 'Superaste la meta. ¡Vuelve a intentarlo para llegar más lejos!' : 'Perdiste las tres vidas y vuelves al inicio.'} Según la tradición oral, el Cadejo ronda las calles de noche y el Punche de Oro es un cangrejo dorado de las leyendas de Sutiaba.</div>` });
    }
    /* ---- Actualización ---- */
    actualizar(dt) {
      this.t += dt; if (this.msj) { this.msj.t -= dt; if (this.msj.t <= 0) this.msj = null; }
      if (this.sacudir > 0) this.sacudir -= dt;
      this.particulas.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; q.v -= dt; }); this.particulas = this.particulas.filter(q => q.v > 0);
      if (this.estado === 'listo') { if (EL.input.pulso('salto') || EL.input.pulso('arr') || EL.input.pulso('ok') || this.swipe) { this.swipe = null; this.estado = 'corre'; EL.audio.ladrido(); } return; }
      if (this.estado !== 'corre') return;
      if (EL.input.pulso('pausa')) { EL.pantallas.minijuegos(); return; }
      this.entrada();
      const v = Math.min(this.velMax, this.vel + this.dist / 40);
      this.s += v * dt; this.dist += v * dt / 1.6;
      if (this.inv > 0) this.inv -= dt;
      this.perseguidor = Math.min(70, this.perseguidor + dt * 2.2);  // 70 = lejos, 18 = casi te alcanza
      // salto
      if (this.z > 0 || this.vz > 0) { this.z += this.vz * dt; this.vz -= 900 * dt; if (this.z <= 0) { this.z = 0; this.vz = 0; } }
      this.xCarril += ((this.carril - 1) * CARRIL - this.xCarril) * Math.min(1, dt * 14);
      // Cadejos que salen de frente avanzan hacia el jugador
      for (const o of this.seg.obs) if (o.tipo === 'cadejo' && o.d - this.s < 320) o.d -= o.vel * dt;
      // colisiones
      const enAire = this.z > 14;
      for (const o of this.seg.obs) {
        if (o.pasado || Math.abs(o.d - this.s) > 9) continue;
        o.pasado = true;
        if (o.tipo === 'punches') { if (!enAire) this.herir('¡Salta sobre los Punches de Oro!'); else this.brillo(CX + this.xCarril, PY); }
        else if (o.carril === this.carril && !enAire) this.herir(o.tipo === 'cadejo' ? '¡El Cadejo salió de frente!' : '¡Cuidado con el camino!');
      }
      for (const e of this.seg.ecos) if (e.vivo && Math.abs(e.d - this.s) < 12 && e.carril === this.carril && this.z < 30) { e.vivo = false; this.ecos++; EL.audio.eco(); this.brillo(CX + this.xCarril, PY - 10); }
      if (!this.metaAvisada && this.dist >= this.meta) { this.metaAvisada = true; this.msj = { txt: '¡Meta superada! Sigue todo lo que puedas', t: 2.4 }; EL.audio.victoria(); }
      // esquina
      if (this.giro) { this.giro.t += dt; if (this.giro.t >= 0.24) { const sobra = Math.max(0, this.s - this.seg.L); this.nuevoSegmento(false); this.s = sobra; this.giro = null; } }
      else if (this.s >= this.seg.L - 40 && this.estado === 'corre') {
        this.herir('¡Gira a tiempo en las esquinas!');
        if (this.estado === 'corre') { const dir = this.seg.tipo === 'der' ? 1 : -1; this.girar(dir); }
      }
      const est = EL.$('#mj-estado'); if (est) est.innerHTML = `<span>${Math.floor(this.dist / 10)} m</span><span>Ecos: ${this.ecos}</span>`;
    }
    brillo(x, y) { for (let i = 0; i < 8; i++) this.particulas.push({ x, y, vx: Math.cos(i) * 60, vy: Math.sin(i) * 60, v: 0.4, c: '#fff1a8' }); }
    clic() { if (this.estado === 'listo') this.swipe = 'arr'; }

    /* ---- Dibujo ---- */
    dibujar(x) {
      const P = EL.px, t = this.t;
      x.fillStyle = '#16192e'; x.fillRect(0, 0, 640, 360);
      x.save();
      if (this.sacudir > 0) x.translate((Math.random() - 0.5) * 6, 0);
      if (this.giro) { const k = Math.min(1, this.giro.t / 0.24); x.translate(CX, PY); x.rotate(-this.giro.dir * k * Math.PI / 2); x.translate(-CX, -PY); }
      this.dibujarCalle(x);
      x.restore();
      this.dibujarPersonajes(x);
      // noche: viñeta
      const g = x.createRadialGradient(CX, PY - 60, 80, CX, PY - 40, 420); g.addColorStop(0, 'rgba(10,10,40,0)'); g.addColorStop(1, 'rgba(10,10,40,0.6)'); x.fillStyle = g; x.fillRect(0, 0, 640, 360);
      this.hud(x);
    }
    ySeg(d) { return PY - (d - this.s); }
    dibujarCalle(x) {
      const P = EL.px, t = this.t, seg = this.seg, yJ = this.ySeg(seg.L), L = CX - MEDIO, R = CX + MEDIO;
      // techos de teja por toda la ciudad (vista desde arriba)
      x.fillStyle = '#2c2a3e'; x.fillRect(-300, -400, 1240, 1200);
      const fase = Math.floor(this.s / 52);
      for (let k = -8; k < 20; k++) {
        const yy = PY - (k * 52 - (this.s % 52)) - 26, id = fase + k + seg.id * 31;
        for (let col = -4; col < 8; col++) {
          const a0 = col * 150 + ((k & 1) ? 0 : 60) - 120, col2 = ['#a9442e', '#b9553a', '#8e3424', '#c46a3e'][(((id * 7 + col * 3) % 4) + 4) % 4];
          P.rect(x, a0, yy - 24, 144, 46, col2); for (let i = a0; i < a0 + 144; i += 7) P.rect(x, i, yy - 24, 2, 46, EL.shade(col2, -0.2));
          P.rect(x, a0, yy - 24, 144, 4, EL.shade(col2, 0.25)); P.rect(x, a0, yy + 20, 144, 3, '#1b1222');
          if ((((id + col) % 3) + 3) % 3 === 0) { P.rect(x, a0 + 66, yy - 6, 8, 8, '#ffd76a'); P.circle(x, a0 + 70, yy - 2, 14, 'rgba(255,215,106,0.15)'); }
        }
      }
      x.fillStyle = 'rgba(16,12,36,0.42)'; x.fillRect(-300, -400, 1240, 1200);   // los techos quedan al fondo
      // calle (adoquines) hasta la esquina
      const top = Math.max(-200, yJ - MEDIO);
      P.rect(x, L, top, R - L, 420 - top, '#55536a');
      const off = this.s % 16;
      for (let yy = Math.floor((top - off) / 16) * 16 + off; yy < 380; yy += 16) for (let xx = L + ((Math.floor((yy - off) / 16) & 1) * 8); xx < R - 4; xx += 16) P.rect(x, xx + 1, yy + 1, 13, 13, '#68667e');
      for (let i = 1; i < 3; i++) P.rect(x, L + i * (R - L) / 3 - 1, top, 2, 600, 'rgba(255,255,255,0.08)');
      // esquina: calles laterales y muro de fondo
      const izq = seg.tipo === 'izq' || seg.tipo === 'T', der = seg.tipo === 'der' || seg.tipo === 'T';
      if (yJ > -200) {
        const lateral = (X0, w) => { P.rect(x, X0, yJ - MEDIO, w, MEDIO * 2, '#55536a'); for (let yy = yJ - MEDIO; yy < yJ + MEDIO - 4; yy += 16) for (let xx = X0 + ((((yy - yJ) / 16) & 1) * 8); xx < X0 + w - 4; xx += 16) P.rect(x, xx + 1, yy + 1, 13, 13, '#68667e'); };
        if (izq) lateral(-300, L + 300);
        if (der) lateral(R, 640 + 300 - R);
        this.muro(x, L - MURO, yJ - MEDIO - MURO, R - L + MURO * 2, MURO, true);
        if (izq) { this.muro(x, -300, yJ - MEDIO - MURO, L - MURO + 300, MURO, true); this.muro(x, -300, yJ + MEDIO, L - MURO + 300, MURO, true); }
        if (der) { this.muro(x, R + MURO, yJ - MEDIO - MURO, 940 - R - MURO, MURO, true); this.muro(x, R + MURO, yJ + MEDIO, 940 - R - MURO, MURO, true); }
        // flecha en el suelo: hacia dónde se puede girar
        if (this.seg.L - this.s < 300) { const a = Math.floor(t * 4) % 2 ? '#ffd34a' : '#ff9a3a'; if (izq) P.poly(x, [[CX - 70, yJ], [CX - 22, yJ - 30], [CX - 22, yJ + 30]], a); if (der) P.poly(x, [[CX + 70, yJ], [CX + 22, yJ - 30], [CX + 22, yJ + 30]], a); }
      }
      // muros laterales de la calle (con hueco en la esquina)
      const yMuro = izq || der ? yJ + MEDIO : top;
      this.muro(x, L - MURO, yMuro, MURO, 420 - yMuro, false); this.muro(x, R, yMuro, MURO, 420 - yMuro, false);
      if (!izq) this.muro(x, L - MURO, yJ - MEDIO, MURO, MEDIO * 2, false);
      if (!der) this.muro(x, R, yJ - MEDIO, MURO, MEDIO * 2, false);
      // ecos y obstáculos
      for (const e of seg.ecos) if (e.vivo) { const yy = this.ySeg(e.d); if (yy > -20 && yy < 380) { x.save(); x.translate(CX + (e.carril - 1) * CARRIL, yy); x.scale(1.7, 1.7); EL.dibujarEco(x, 0, 0, t); x.restore(); } }
      for (const o of seg.obs) {
        const yy = this.ySeg(o.d); if (yy < -40 || yy > 400) continue;
        const ox = CX + (o.carril - 1) * CARRIL;
        if (o.tipo === 'punches') { P.rect(x, CX - MEDIO, yy - 4, MEDIO * 2, 8, 'rgba(255,211,74,0.25)'); for (let c = 0; c < 3; c++) { const s = EL.sprite('punche', Math.floor(t * 8 + c) % 2 ? 'paso' : 'quieto', EL.progreso.traje('punche')), k = 2.6; const dx = Math.sin(t * 6 + c) * 4; x.drawImage(s, Math.round(CX + (c - 1) * CARRIL - s.width * k / 2 + dx), Math.round(yy - s.height * k / 2), s.width * k, s.height * k); } }
        else if (o.tipo === 'roca') { P.ellipse(x, ox + 4, yy + 12, 24, 8, 'rgba(0,0,0,0.4)'); x.save(); x.translate(ox, yy); x.scale(1.8, 1.8); EL.dibujarRoca(x, 0, 0, 13, 0.6); x.restore(); }
        else if (o.tipo === 'barril') { P.ellipse(x, ox + 4, yy + 12, 24, 8, 'rgba(0,0,0,0.4)'); x.save(); x.translate(ox, yy); x.scale(1.8, 1.8); EL.dibujarBarril(x, 0, 0, 13, 0); x.restore(); }
        else if (o.tipo === 'cadejo' && !o.pasado) { const s = perro('negro', Math.floor(t * 10) % 2), k = 3.4; x.save(); x.translate(ox, yy); x.rotate(Math.PI); x.drawImage(s, -s.width * k / 2, -s.height * k / 2, s.width * k, s.height * k); x.restore(); if (yy > -10 && yy < PY - 60) { x.save(); x.translate(ox, Math.max(40, yy - 50)); x.scale(1.6, 1.6); EL.dibujarAviso(x, 0, 0, t); x.restore(); } }
      }
    }
    muro(x, X, Y, w, h, horizontal) {
      const P = EL.px; P.rect(x, X, Y, w, h, '#c48a5a');
      if (horizontal) { P.rect(x, X, Y, w, 6, '#e0a878'); P.rect(x, X, Y + h - 4, w, 4, '#7a4e2e'); for (let i = X; i < X + w; i += 14) P.rect(x, i, Y + 8, 1, h - 12, '#94603a'); }
      else { P.rect(x, X, Y, 6, h, '#e0a878'); P.rect(x, X + w - 4, Y, 4, h, '#7a4e2e'); for (let j = Y + ((this.s % 14)); j < Y + h; j += 14) P.rect(x, X + 7, j, w - 12, 1, '#94603a'); }
      P.rect(x, X - 1, Y - 1, w + 2, 1, '#1b1222'); P.rect(x, X - 1, Y + h, w + 2, 1, '#1b1222'); P.rect(x, X - 1, Y, 1, h, '#1b1222'); P.rect(x, X + w, Y, 1, h, '#1b1222');
    }
    dibujarPersonajes(x) {
      const t = this.t, P = EL.px;
      // el Cadejo que persigue (detrás)
      if (this.estado !== 'listo') { const s = perro('negro', Math.floor(t * 10) % 2), k = 3.4, yy = PY + 30 + this.perseguidor, cx = CX + this.xCarril * 0.6; P.ellipse(x, cx + 4, yy + 4, 22, 7, 'rgba(0,0,0,0.4)'); x.drawImage(s, Math.round(cx - s.width * k / 2), Math.round(yy - s.height * k / 2), s.width * k, s.height * k); }
      // explorador (desde arriba): al saltar se ve más grande y su sombra se separa
      if (this.inv > 0 && Math.floor(t * 12) % 2 && this.estado === 'corre') return;
      const s = EL.sprite('exploradorAereo'), k = 4.4 + this.z / 50, px = CX + this.xCarril, bob = this.z > 0 ? 0 : Math.round(Math.sin(t * 18));
      P.ellipse(x, px + 3, PY + 10, 22 - this.z / 8, 8 - this.z / 20, 'rgba(0,0,0,0.45)');
      x.drawImage(s, Math.round(px - s.width * k / 2), Math.round(PY - s.height * k / 2 - this.z * 0.45 + bob), s.width * k, s.height * k);
      for (const q of this.particulas) { x.fillStyle = q.c; x.fillRect(Math.round(q.x), Math.round(q.y), 2, 2); }
    }
    hud(x) {
      const P = EL.px;
      for (let i = 0; i < 3; i++) { x.save(); x.translate(14 + i * 36, 50); x.scale(2, 2); EL.dibujarCorazon(x, 0, 0, i < this.vidas); x.restore(); }
      x.font = 'bold 13px "Segoe UI", sans-serif'; x.lineJoin = 'round';
      const rot = (txt, X, Y, col = '#fff') => { x.lineWidth = 4; x.strokeStyle = '#1b1222'; x.strokeText(txt, X, Y); x.fillStyle = col; x.fillText(txt, X, Y); };
      // qué tan cerca está el Cadejo
      const cerca = 1 - (this.perseguidor - 18) / 52;
      P.rect(x, 12, 80, 124, 14, '#1b1222'); P.rect(x, 14, 82, 120 * Math.max(0.04, cerca), 10, cerca > 0.6 ? '#ff5a3a' : '#7fd68f'); rot('Cadejo cerca', 14, 112);
      // progreso hacia la meta
      const prog = Math.min(1, this.dist / this.meta); P.rect(x, 474, 50, 154, 14, '#1b1222'); P.rect(x, 476, 52, 150 * prog, 10, '#ffd34a'); rot('Meta ' + this.meta / 10 + ' m', 476, 82, '#ffd96a');
      if (this.estado === 'listo') {
        P.rect(x, 128, 112, 384, 112, '#1b1222'); P.rect(x, 131, 115, 378, 106, '#2a2444'); x.textAlign = 'center'; x.font = 'bold 17px "Segoe UI", sans-serif';
        rot('◀ ▶  cambia de carril y gira en las esquinas', 320, 144, '#ffd96a'); rot('▲  salta las filas de Punches de Oro', 320, 170, '#ffd96a'); rot('Toca o pulsa ▲ para correr', 320, 204); x.textAlign = 'left';
      }
      if (this.msj) { x.font = 'bold 17px "Segoe UI", sans-serif'; const w = x.measureText(this.msj.txt).width + 30; P.rect(x, 320 - w / 2 - 3, 97, w + 6, 34, '#1b1222'); P.rect(x, 320 - w / 2, 100, w, 28, '#ffd96a'); x.fillStyle = '#1b1222'; x.textAlign = 'center'; x.fillText(this.msj.txt, 320, 120); x.textAlign = 'left'; }
    }
  }

  return {
    iniciar(dif, fin) {
      const c = EL.pantallas.marcoMJ('Laberinto nocturno', dif);
      c.style.background = 'transparent'; c.style.pointerEvents = 'none'; c.querySelector('.mj-barra').style.pointerEvents = 'auto';
      const esc = new Escena(dif, fin); EL.escena = esc; EL.enJuego = true; EL.pantallas.tactil('laberinto');
      // deslizar el dedo: izquierda/derecha/arriba
      let ini = null;
      this._down = e => { ini = [e.clientX, e.clientY]; if (esc.estado === 'listo') esc.swipe = 'arr'; };
      this._up = e => { if (!ini) return; const dx = e.clientX - ini[0], dy = e.clientY - ini[1]; ini = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return; esc.swipe = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'izq' : 'der') : (dy < 0 ? 'arr' : null); };
      const z = EL.$('#ui'); z.addEventListener('pointerdown', this._down); z.addEventListener('pointerup', this._up);
    },
    salir() { const z = EL.$('#ui'); if (this._down) { z.removeEventListener('pointerdown', this._down); z.removeEventListener('pointerup', this._up); } EL.escena = null; EL.enJuego = false; EL.pantallas.tactil(null); }
  };
})();
