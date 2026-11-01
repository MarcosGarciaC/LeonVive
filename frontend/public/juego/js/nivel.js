/* eslint-disable */
/* Ecos de León · juego principal: RECORRIDO CONTINUO POR ZONAS
   - Cada zona tiene 50 niveles seguidos, sin pausas; crecen en largo y en reto a medida que se avanza.
   - Cada nivel termina en un farol: al pasarlo ya no se puede regresar y es el punto de reaparición.
   - Tres vidas: se gastan al no superar bien un obstáculo. Sin vidas, se reinicia la zona.
   - La campana al final del nivel 50 guarda la zona y lleva de inmediato a la siguiente.
   - Los obstáculos son solo elementos de la naturaleza o del escenario, y siempre avisan antes de aparecer. */
'use strict';
(function () {
  const TS = 16, FILAS = 22, GY = 18;
  const Z = 2, VW = 640 / Z, VH = 360 / Z;          // cámara ampliada ×2: personajes y obstáculos grandes
  const NIVELES_ZONA = 50;
  const T = { VACIO: 0, SUELO: 1, TABLA: 2, ESPINA: 3, VERSO: 4, AGUA: 5, PIEDRA: 6 };
  EL.T = T; EL.TS = TS; EL.NIVELES_ZONA = NIVELES_ZONA;
  const CAE = { leonviejo: 'roca', metapa: 'roca', sutiaba: 'roca', centro: 'teja', callereal: 'teja', poneloya: 'coco' };
  const RUEDA = { leonviejo: 'roca', metapa: 'roca', sutiaba: 'roca', centro: 'barril', callereal: 'barril', poneloya: 'roca' };

  /* ================= GENERADOR POR NIVELES ================= */
  class Generador {
    constructor(zIdx, dif, semilla) {
      this.zIdx = zIdx; this.zona = EL.ZONAS[zIdx]; this.dif = dif; this.rng = EL.rng(semilla);
      this.cols = []; this.H = 1; this.niveles = [];
      this.tutorialHecho = !!EL.save.data.tutorialHecho; // el tutorial se juega una sola vez
    }
    tope() { return GY - this.H; }
    col(h = this.H, extra) { const c = new Uint8Array(FILAS); if (h !== null) for (let r = GY - h; r < FILAS; r++) c[r] = T.SUELO; if (extra) extra(c); this.cols.push(c); return this.cols.length - 1; }
    /* Genera el nivel k y devuelve sus entidades */
    nivel(k) {
      const rng = this.rng, ents = [], picto = [], narr = [], zid = this.zona.id;
      const x0 = this.cols.length;
      const reto = this.dif * 0.8 + (k / NIVELES_ZONA) * 1.8 + this.zIdx * 0.15; // 0 … ~4,4
      const carrera = k % 10 === 7;
      const maxHueco = carrera ? 3 : Math.min(4, 2 + Math.floor(reto / 1.4));
      const eco = (c, f) => ents.push({ t: 'eco', x: c * TS + 8, y: f * TS + 8 });
      const g = this, tope = () => g.tope(), col = (h, e) => g.col(h, e);
      const tramo = {
        plano(n, conEcos = true) { const f = tope() - 2; for (let i = 0; i < n; i++) { const c = col(); if (conEcos && i > 0 && i < n - 1 && rng() < 0.6) eco(c, f); } },
        hueco(gap = rng.int(2, maxHueco)) { col(); const f = tope() - 3; for (let i = 0; i < gap; i++) { const c = col(null); eco(c, f - (i === Math.floor(gap / 2) ? 1 : 0)); } col(); },
        escalon() { const d = rng.pick([-2, -1, 1, 1, 2]); g.H = Math.max(0, Math.min(4, g.H + d)); tramo.plano(rng.int(3, 5)); },
        espinas(n = rng.int(1, carrera ? 2 : Math.min(3, 1 + Math.floor(reto)))) { col(); col(); const f = tope() - 3; for (let i = 0; i < n; i++) { const c = col(g.H, kk => { kk[tope() - 1] = T.ESPINA; }); eco(c, f); } col(); col(); },
        plataformas() { col(); const w = rng.int(5, carrera ? 6 : 8), alto = tope() - rng.int(2, 3); for (let i = 0; i < w; i++) { const c = col(null, kk => { if (i % 3 !== 2) kk[alto] = T.TABLA; }); if (i % 3 !== 2) eco(c, alto - 1); } col(); col(); },
        pilar() { col(); const h = Math.min(g.H + 2, 6); for (let i = 0; i < 2; i++) { const c = col(h); eco(c, GY - h - 2); } col(); col(); },
        alto() { const n = rng.int(6, 9), f = tope() - 4; for (let i = 0; i < n; i++) { const c = col(g.H, kk => { if (i >= 1 && i < n - 1 && i % 4 !== 0) kk[f] = T.TABLA; }); if (i >= 1 && i < n - 1 && i % 4 !== 0) eco(c, f - 1); } },
        caida() { const a = g.cols.length; tramo.plano(rng.int(8, 11)); ents.push({ t: 'lluvia', x0: a * TS, x1: g.cols.length * TS, cada: Math.max(1.4, 2.6 - reto * 0.25), tipo: CAE[zid] || 'roca' }); },
        rodante() { const a = g.cols.length; tramo.plano(rng.int(11, 14), false); const f = tope() - 3; for (let i = 2; i < 9; i += 2) eco(a + i, f); ents.push({ t: 'rodante', x0: a * TS, x1: g.cols.length * TS, y: tope() * TS, tipo: RUEDA[zid] || 'roca', vel: 85 + reto * 12 }); },
        verso() { col(); col(); const w = rng.int(5, carrera ? 6 : 8), f = tope(); picto.push({ tipo: 'verso', x: (g.cols.length - 1) * TS + 8, y: (f - 3) * TS }); for (let i = 0; i < w; i++) { const c = col(null, kk => { kk[f] = T.VERSO; }); if (i % 2) eco(c, f - 2); } col(); col(); },
        muro() { col(); col(); const h = Math.min(g.H + 5, 9); picto.push({ tipo: 'gigantona', x: (g.cols.length - 1) * TS, y: (GY - h - 3) * TS }); const c = col(h); eco(c, GY - h - 2); col(h); col(h); g.H = Math.max(0, h - 5); col(); col(); },
        tunel() { col(); col(); const n = rng.int(5, 8), f = tope(); picto.push({ tipo: 'enano', x: (g.cols.length - 1) * TS, y: (f - 6) * TS }); for (let i = 0; i < n; i++) { const c = col(g.H, kk => { for (let r = 0; r <= f - 3; r++) kk[r] = T.PIEDRA; }); if (i % 2) eco(c, f - 1); } col(); col(); },
        balcon() { const n = rng.int(6, 9), f = tope() - 3; for (let i = 0; i < n; i++) { const c = col(g.H, kk => { if (i > 0 && i < n - 1) kk[f] = T.TABLA; }); if (i > 0 && i < n - 1 && i % 2) eco(c, f - 1); } },
        charco() { col(); const w = rng.int(5, carrera ? 6 : 8), f = tope(); for (let i = 0; i < w; i++) { const c = col(null, kk => { for (let r = f; r < FILAS - 1; r++) kk[r] = T.AGUA; kk[FILAS - 1] = T.SUELO; if (rng() < 0.2 + reto * 0.05 && i > 0 && i < w - 1) kk[FILAS - 2] = T.ESPINA; }); eco(c, f + 2 + (i % 2)); } col(); col(); }
      };
      const comunes = carrera ? ['plano', 'hueco', 'espinas', 'plataformas'] : ['plano', 'hueco', 'escalon', 'espinas', 'plataformas', 'pilar', 'alto', 'hueco'];
      const propios = {
        leonviejo: ['caida', 'rodante', 'espinas'], metapa: ['verso', 'verso', 'rodante'], sutiaba: ['muro', 'tunel', 'caida'],
        centro: ['caida', 'rodante', 'espinas', 'plataformas'], callereal: ['balcon', 'caida', 'rodante'], poneloya: ['charco', 'charco', 'caida', 'espinas']
      }[zid] || [];

      if (k === 1) { this.H = 1; tramo.plano(7, false); ents.push({ t: 'inicio', x: 3 * TS + x0 * TS, y: tope() * TS }); }
      const N = (txt) => narr.push({ x: this.cols.length * TS, txt });
      const Pc = (tipo, dx = 0) => picto.push({ tipo, x: (this.cols.length + dx) * TS + 8, y: (tope() - 3) * TS });

      if (zid === 'leonviejo' && k <= 4 && !this.tutorialHecho) {
        /* Tutorial (niveles 1 a 4, fijos y con pictogramas) */
        if (k === 1) { N('Usa las flechas o los botones para caminar.'); Pc('mover', -3); tramo.plano(5, false); N('Pulsa saltar para subir y cruzar huecos.'); Pc('saltar'); tramo.plano(3, false); this.H = 2; tramo.plano(4, false); tramo.hueco(2); tramo.plano(3, false); }
        if (k === 2) { N('Los ecos brillan: ¡reúnelos! Con ellos podrás comprar vestuario.'); Pc('eco'); tramo.plano(9, true); this.H = 1; tramo.hueco(2); tramo.plano(5, true); }
        if (k === 3) { N('Cada nivel termina en un farol. Si lo pasas, ya no hay vuelta atrás: ahí reapareces si pierdes una vida.'); tramo.plano(4, false); N('¡Cuidado con las rocas volcánicas! Sáltalas.'); Pc('peligro'); tramo.espinas(1); tramo.plano(3, false); tramo.plataformas(); tramo.plano(3); }
        if (k === 4) { N('Cuando veas el aviso amarillo, algo va a caer: ¡apártate!'); Pc('cuidado'); tramo.caida(); tramo.plano(3); tramo.hueco(3); tramo.plano(4); }
      } else {
        const n = Math.min(9, 2 + Math.floor(k / 7) + (this.dif > 1 ? 1 : 0));
        let ultimo = '';
        const pProp = 0.35 + this.dif * 0.08 + (k / NIVELES_ZONA) * 0.25;
        for (let i = 0; i < n; i++) {
          let nombre = (propios.length && rng() < pProp) ? rng.pick(propios) : rng.pick(comunes);
          if (nombre === ultimo && nombre !== 'plano') nombre = 'plano';
          tramo[nombre](); ultimo = nombre;
          if (zid === 'callereal' && this.H > 2) this.H = 2;
        }
      }
      /* Fin del nivel: farol (o campana en el nivel 50) */
      if (k < NIVELES_ZONA) {
        tramo.plano(3, false); const fx = (this.cols.length - 2) * TS + 8;
        ents.push({ t: 'farol', x: fx, y: tope() * TS, k });
        if (k % 10 === 9) ents.push({ t: 'corazon', x: fx - 40, y: (tope() - 2) * TS }); // vida extra cada 10 niveles
      } else {
        tramo.plano(4, false); const cx = (this.cols.length + 3) * TS; tramo.plano(14, false);
        ents.push({ t: 'campana', x: cx, y: tope() * TS });
      }
      /* Ecos del nivel ajustados a la economía (crecen con el nivel y la dificultad) */
      const objetivo = EL.ECONOMIA.ecosNivel(k, this.dif);
      let ecos = ents.filter(e => e.t === 'eco');
      if (ecos.length > objetivo) { rng.shuffle(ecos); const fuera = new Set(ecos.slice(objetivo)); for (let i = ents.length - 1; i >= 0; i--) if (fuera.has(ents[i])) ents.splice(i, 1); }
      ecos = ents.filter(e => e.t === 'eco');
      if (ecos.length < objetivo) {
        const ocup = new Set(ecos.map(e => Math.floor(e.x / TS))), cand = [];
        for (let c = x0 + 2; c < this.cols.length - 4; c++) { if (ocup.has(c)) continue; const cc = this.cols[c]; let r = 0; while (r < FILAS && cc[r] === T.VACIO) r++; if (r < FILAS && r > 3 && cc[r] === T.SUELO) cand.push([c, r]); }
        rng.shuffle(cand); for (const [c, r] of cand.slice(0, objetivo - ecos.length)) eco(c, r - 2);
      }
      const info = { k, x0: x0 * TS, x1: this.cols.length * TS, carrera };
      this.niveles.push(info);
      return { ents, picto, narr, info };
    }
  }
  EL.Generador = Generador;

  /* ================= MOTOR DEL RECORRIDO ================= */
  class Recorrido {
    constructor(zIdx, dif, opciones = {}) {
      this.dif = dif; this.t = 0; this.pausado = false; this.particulas = []; this.ecosPartida = 0; this.op = opciones;
      this.iniciarZona(zIdx, true);
    }
    iniciarZona(zIdx, primera) {
      this.zIdx = zIdx; this.zona = EL.ZONAS[zIdx]; this.pjId = this.zona.personaje;
      this.forma = this.pjId; this.traje = EL.progreso.traje(this.pjId);
      this.gen = new Generador(zIdx, this.dif, (Date.now() & 0xffffff) ^ (zIdx * 977));
      this.bloques = EL.bloquesZona(this.zona.id);
      this.ecosEnt = []; this.faroles = []; this.lluvias = []; this.rodantes = []; this.picto = []; this.narr = []; this.corazones = []; this.campana = null; this.caidas = [];
      this.nivelActual = 1; this.generado = 0; this.vidas = 3; this.ecosZona = 0; this.terminado = false; this.zonaHecha = false;
      this.versoT = 0; this.luzT = 0; this.luzCd = 0; this.narrIdx = 0; this.burbuja = null; this.fundido = primera ? 0 : 1; this.esc = null; this.cambioEsc = 0;
      while (this.generado < 3) this.generarSiguiente();
      const ini = this.ini; this.respawn = { x: ini.x, y: ini.y }; this.limite = 0; this.camMin = 0;
      this.sueloY = null; this.crearJugador(); this.camX = 0; this.camY = this.objetivoCamY();
      this.dialogos = (!primera && EL.HISTORIA[EL.ZONAS[zIdx - 1].id]) ? EL.HISTORIA[EL.ZONAS[zIdx - 1].id].slice() : [];
      this.dialogoT = 0;
    }
    generarSiguiente() {
      if (this.generado >= NIVELES_ZONA) return;
      const k = ++this.generado, { ents, picto, narr } = this.gen.nivel(k);
      for (const e of ents) {
        if (e.t === 'eco') this.ecosEnt.push(Object.assign({ vivo: true }, e));
        else if (e.t === 'farol') this.faroles.push(Object.assign({ on: false }, e));
        else if (e.t === 'lluvia') this.lluvias.push(Object.assign({ cd: 0.6 }, e));
        else if (e.t === 'rodante') this.rodantes.push(Object.assign({ est: 'espera', cd: 0, x: e.x1, rot: 0 }, e));
        else if (e.t === 'corazon') this.corazones.push(Object.assign({ vivo: true }, e));
        else if (e.t === 'campana') this.campana = Object.assign({ sonando: false }, e);
        else if (e.t === 'inicio') this.ini = e;
      }
      this.picto.push(...picto); this.narr.push(...narr);
    }
    get ancho() { return this.gen.cols.length * TS; }
    stats() { const p = EL.PERSONAJES[this.pjId]; return this.forma === 'enano' ? p.enano : p.stats; }
    crearJugador() { const s = this.stats(); this.p = { x: this.respawn.x, y: this.respawn.y - s.h - 2, w: s.w, h: s.h, vx: 0, vy: 0, suelo: false, dir: 1, coyote: 0, buffer: 0, inv: 1.2, saltos: 0, agua: false, anim: 0 }; }
    nivelInfo() { return this.gen.niveles[this.nivelActual - 1] || this.gen.niveles[this.gen.niveles.length - 1]; }

    /* ---- Mapa ---- */
    celda(px, py) { const c = Math.floor(px / TS), r = Math.floor(py / TS); if (c < 0) return T.SUELO; const col = this.gen.cols[c]; if (!col) return T.SUELO; if (r < 0 || r >= FILAS) return T.VACIO; return col[r]; }
    esSolido(v) { return v === T.SUELO || v === T.PIEDRA; }
    choca(x, y, w, h) {
      const c0 = Math.floor(x / TS), c1 = Math.floor((x + w - 0.01) / TS), r0 = Math.floor(y / TS), r1 = Math.floor((y + h - 0.01) / TS);
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) { if (c < 0 || c >= this.gen.cols.length) return true; if (r < 0 || r >= FILAS) continue; if (this.esSolido(this.gen.cols[c][r])) return true; }
      return false;
    }
    sobrePlataforma(x, w, yA, yD) {
      for (let r = Math.floor(yA / TS); r <= Math.floor(yD / TS); r++) {
        if (r < 0 || r >= FILAS) continue; const top = r * TS; if (yA > top + 1 || yD < top) continue;
        for (let xx = x + 1; xx <= x + w - 1; xx += 3) { const v = this.celda(Math.min(xx, x + w - 1), top + 1); if (v === T.TABLA || (v === T.VERSO && this.versoT > 0)) return top; }
      }
      return null;
    }
    sueloEn(px) { const col = this.gen.cols[Math.floor(px / TS)]; if (!col) return FILAS * TS; for (let r = 0; r < FILAS; r++) if (this.esSolido(col[r]) || col[r] === T.TABLA) return r * TS; return FILAS * TS; }

    /* ---- Vidas ---- */
    herir(caida) {
      if (EL.VERSION === 'demo') { if (caida) this.rescateDemo(); return; }   // la demo nunca pierde vidas
      if (this.p.inv > 0 || this.terminado) return;
      this.vidas--; EL.audio.golpe(); this.sacudir = 0.35;
      if (this.vidas <= 0) { this.perder(); return; }
      this.forma = this.pjId; this.crearJugador();
    }
    /* Demo publicitaria: si el piloto automático cae, reaparece sobre el siguiente suelo firme */
    rescateDemo() {
      const p = this.p; let c = Math.floor((p.x + p.w) / TS) + 1;
      for (let g = 0; g < 40; g++, c++) {
        const col = this.gen.cols[c], col2 = this.gen.cols[c + 1]; if (!col || !col2) break;
        let r = 0; while (r < FILAS && col[r] === T.VACIO) r++;
        if (r < FILAS && r > 3 && col[r] === T.SUELO && col2[r] === T.SUELO && col[r - 1] !== T.ESPINA) { p.x = c * TS + 2; p.y = r * TS - p.h - 1; p.vx = 0; p.vy = 0; p.inv = 0.5; this.brillo(p.x + p.w / 2, p.y + p.h / 2); return; }
      }
      p.x = this.respawn.x; p.y = this.respawn.y - p.h - 2; p.vy = 0;
    }
    perder() {
      this.terminado = true; EL.audio.derrota();
      setTimeout(() => EL.pantallas.finRecorrido(this), 700);
    }
    sonarCampana() {
      if (this.zonaHecha) return; this.zonaHecha = true; this.campana.sonando = true;
      EL.audio.campana(); this.fiesta(this.campana.x, this.campana.y - 40);
      const res = EL.pantallas.guardarZona(this);   // guarda la zona y los ecos
      this.banner = { txt: res.txt, sub: res.sub, t: 3.2, id: res.nuevo };
      setTimeout(() => {
        if (EL.escena !== this) return;   // se salió al mapa o se reinició: no saltar a otra zona ni a la Gritería
        if (this.zIdx >= 5) { EL.pantallas.irGriteria(); return; }
        this.transicion = 1;      // fundido y entrada inmediata a la siguiente zona
      }, 2600);
    }
    fiesta(x, y) { for (let i = 0; i < 40; i++) this.particulas.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 260, v: 1.2, c: ['#ffd96a', '#ff8fb8', '#7fe0ff', '#9be07a'][i % 4] }); }

    /* ---- Actualización ---- */
    actualizar(dt) {
      if (this.pausado) return;
      dt = Math.min(dt, 1 / 30) * (EL.save.data.ajustes.lento ? 0.8 : 1);
      this.t += dt; const I = EL.input, p = this.p, s = this.stats();
      if (this.transicion) { this.transicion += dt; if (this.transicion > 1.6 && !this._cambio) { this._cambio = true; this.iniciarZona(this.zIdx + 1, false); this.transicion = 0; this._cambio = false; EL.pantallas.cambioZona(this); } return; }
      if (this.fundido > 0) this.fundido = Math.max(0, this.fundido - dt * 1.5);
      this.actParticulas(dt);
      if (this.banner) { this.banner.t -= dt; if (this.banner.t <= 0) this.banner = null; }
      this.actDialogos(dt); if (this.pausado) return;
      if (this.terminado || this.zonaHecha) { this.camara(dt); return; }
      if (I.pulso('pausa')) { EL.pantallas.pausaNivel(); return; }
      while (this.generado < Math.min(NIVELES_ZONA, this.nivelActual + 2)) this.generarSiguiente();
      const info = this.nivelInfo(), carrera = info && info.carrera && p.x > info.x0;

      if (I.pulso('accion')) this.accion();
      if (this.versoT > 0) this.versoT -= dt; if (this.luzT > 0) this.luzT -= dt; if (this.luzCd > 0) this.luzCd -= dt;

      const enAgua = this.celda(p.x + p.w / 2, p.y + p.h * 0.6) === T.AGUA; p.agua = enAgua;
      let dir = (I.abajo('der') ? 1 : 0) - (I.abajo('izq') ? 1 : 0); if (carrera) dir = 1;
      const vmax = s.vel * (carrera ? 1.08 : 1) * (enAgua ? 0.7 : 1), acel = p.suelo ? 1800 : 1100;
      if (dir) { p.vx += dir * acel * dt; p.vx = Math.max(-vmax, Math.min(vmax, p.vx)); p.dir = dir; }
      else { const fr = (p.suelo ? 2000 : 700) * dt; p.vx = Math.abs(p.vx) <= fr ? 0 : p.vx - Math.sign(p.vx) * fr; }

      p.coyote = p.suelo ? 0.12 : p.coyote - dt;
      p.buffer = (I.pulso('salto') || I.pulso('arr')) ? 0.14 : p.buffer - dt;
      if (enAgua && s.nada) { if (p.buffer > 0) { p.vy = -260; p.buffer = 0; EL.audio.agua(); } }
      else if (p.buffer > 0 && p.coyote > 0) { p.vy = -s.salto; p.buffer = 0; p.coyote = 0; p.saltos = 1; EL.audio.salto(); this.polvo(p.x + p.w / 2, p.y + p.h); }
      else if (p.buffer > 0 && s.doble && p.saltos === 1 && !p.suelo) { p.vy = -s.salto * 0.85; p.buffer = 0; p.saltos = 2; EL.audio.salto(); this.polvo(p.x + p.w / 2, p.y + p.h); }
      if (!I.abajo('salto') && !I.abajo('arr') && p.vy < -150 && !enAgua) p.vy *= 0.55;
      const gr = enAgua && s.nada ? 380 : 1400, vfall = enAgua ? (s.nada ? 90 : 160) : 540;
      p.vy = Math.min(vfall, p.vy + gr * dt);

      // horizontal (con límite: no se puede volver detrás del último farol)
      let nx = p.x + p.vx * dt;
      if (nx < this.limite) { nx = this.limite; p.vx = 0; }
      if (this.choca(nx, p.y, p.w, p.h)) { const paso = Math.sign(p.vx); let g = 0; while (!this.choca(p.x + paso, p.y, p.w, p.h) && Math.abs(nx - p.x) >= 1 && g++ < 30) p.x += paso; p.vx = 0; }
      else p.x = nx;
      // vertical
      const yA = p.y + p.h; let ny = p.y + p.vy * dt; p.suelo = false;
      if (p.vy >= 0) { const tp = this.sobrePlataforma(p.x, p.w, yA, ny + p.h); if (tp !== null) { ny = tp - p.h; p.vy = 0; p.suelo = true; p.saltos = 0; } }
      if (this.choca(p.x, ny, p.w, p.h)) { const paso = Math.sign(p.vy) || 1; let g = 0; while (!this.choca(p.x, p.y + paso, p.w, p.h) && g++ < 40) p.y += paso; if (p.vy > 0) { p.suelo = true; p.saltos = 0; } p.vy = 0; }
      else p.y = ny;

      if (this.tocaEspina()) this.herir();
      if (p.y > FILAS * TS + 20) this.herir(true);
      if (p.inv > 0) p.inv -= dt;

      for (const e of this.ecosEnt) if (e.vivo && Math.abs(e.x - (p.x + p.w / 2)) < 9 + p.w / 2 && Math.abs(e.y - (p.y + p.h / 2)) < 9 + p.h / 2) { e.vivo = false; this.ecosZona++; EL.audio.eco(); this.brillo(e.x, e.y); }
      for (const c of this.corazones) if (c.vivo && Math.abs(c.x - (p.x + p.w / 2)) < 12 + p.w / 2 && Math.abs(c.y - (p.y + p.h / 2)) < 14 + p.h / 2) { c.vivo = false; if (this.vidas < 3) this.vidas++; EL.audio.compra(); this.brillo(c.x, c.y); }
      // faroles: al pasarlos se completa el nivel y se cierra el camino de regreso
      for (const f of this.faroles) if (!f.on && p.x + p.w / 2 >= f.x) {
        f.on = true; this.respawn = { x: f.x + 6, y: f.y }; this.limite = f.x - 4; EL.audio.luz();
        if (this.zona.id === 'leonviejo' && f.k === 4 && !EL.save.data.tutorialHecho) { EL.save.data.tutorialHecho = true; EL.save.data.albumAbierto = true; EL.save.guardar(); }
        this.nivelActual = Math.min(NIVELES_ZONA, f.k + 1); this.aviso = { txt: 'Nivel ' + this.nivelActual + ' de ' + NIVELES_ZONA, t: 1.6 };
        const e = this.escenaDe(this.nivelActual); if (e !== this.esc) { this.escAnt = this.esc; this.esc = e; this.cambioEsc = 1; this.aviso = { txt: 'Nivel ' + this.nivelActual + ' · ' + EL.nombreEscena(this.zona.id, e), t: 2.2 }; }
      }
      if (this.campana && Math.abs(this.campana.x - (p.x + p.w / 2)) < 22 && p.y + p.h > this.campana.y - 60) this.sonarCampana();

      this.actPeligros(dt);
      const nr = this.narr[this.narrIdx]; if (nr && p.x >= nr.x - 20) { this.narrIdx++; this.pausarPara([{ quien: 'leon', txt: nr.txt }]); return; }
      if (this.burbuja) { this.burbuja.t -= dt; if (this.burbuja.t <= 0) this.burbuja = null; }
      if (this.aviso) { this.aviso.t -= dt; if (this.aviso.t <= 0) this.aviso = null; }
      p.anim += dt * (Math.abs(p.vx) > 10 ? 1 : 0);
      this.camara(dt);
      if (this.sacudir > 0) this.sacudir -= dt;
    }
    objetivoCamY() {
      const p = this.p;
      if (p.suelo || this.sueloY == null) this.sueloY = p.y + p.h;            // la cámara sigue el suelo, no cada salto
      let obj = this.sueloY - VH * 0.72;
      if (p.y < obj + 16) obj = p.y - 16;                                       // si sube mucho (muro, plataformas altas)
      return Math.max(0, Math.min(FILAS * TS - VH, obj));
    }
    camara(dt) {
      const p = this.p, info = this.nivelInfo(), carrera = info && info.carrera;
      const objX = p.x + p.w / 2 - VW * (carrera ? 0.3 : 0.38) + p.dir * 18;
      this.camX += (objX - this.camX) * Math.min(1, dt * 6);
      if (this.limite > 0) this.camMin = Math.max(this.camMin, Math.min(this.limite - 30, this.camX));
      this.camX = Math.max(this.camMin, Math.min(this.ancho - VW, this.camX));
      this.camY += (this.objetivoCamY() - this.camY) * Math.min(1, dt * 4);
    }
    tocaEspina() { const p = this.p; for (const [xx, yy] of [[p.x + 2, p.y + p.h - 1], [p.x + p.w - 2, p.y + p.h - 1], [p.x + p.w / 2, p.y + p.h - 1]]) { if (this.celda(xx, yy) === T.ESPINA && (yy % TS) > 5) return true; } return false; }
    accion() {
      const id = this.pjId, p = this.p;
      if (id === 'dario') { this.versoT = 5; EL.audio.verso(); this.onda = { t: 0 }; }
      else if (id === 'gigantona') {
        const nueva = this.forma === 'gigantona' ? 'enano' : 'gigantona', st = nueva === 'enano' ? EL.PERSONAJES.gigantona.enano : EL.PERSONAJES.gigantona.stats;
        const nx = p.x + p.w / 2 - st.w / 2, ny = p.y + p.h - st.h;
        if (!this.choca(nx, ny, st.w, st.h)) { this.forma = nueva; p.x = nx; p.y = ny; p.w = st.w; p.h = st.h; EL.audio.cambio(); this.brillo(p.x + p.w / 2, p.y + p.h / 2); } else EL.audio.error();
      }
      else if (id === 'margarita') { if (this.luzCd <= 0) { this.luzT = 3.5; this.luzCd = 5.5; EL.audio.luz(); } else EL.audio.error(); }
      else if (id === 'cadejo') EL.audio.ladrido();
    }
    actPeligros(dt) {
      const p = this.p;
      /* Objetos que caen (rocas, tejas, cocos): aviso grande 1,3 s antes */
      for (const l of this.lluvias) {
        if (p.x + 160 < l.x0 || p.x - 60 > l.x1) continue;
        l.cd -= dt; if (l.cd <= 0) { l.cd = l.cada + Math.random() * 0.8; const x = Math.max(l.x0 + 8, Math.min(l.x1 - 8, p.x + 50 + Math.random() * 110)); this.caidas.push({ x, y: 0, vy: 0, aviso: 1.3, tipo: l.tipo, rot: 0 }); }
      }
      for (const r of this.caidas) {
        if (r.aviso > 0) { r.aviso -= dt; if (r.aviso <= 0) r.y = this.camY - 14; continue; }
        r.vy = Math.min(420, r.vy + 700 * dt); r.y += r.vy * dt; r.rot += dt * 5;
        if (Math.abs(r.x - (p.x + p.w / 2)) < 7 + p.w / 2 && Math.abs(r.y - (p.y + p.h / 2)) < 7 + p.h / 2) { r.muerta = true; this.herir(); }
        if (r.y + 7 >= this.sueloEn(r.x) || r.y > FILAS * TS) { r.muerta = true; this.polvo(r.x, r.y + 6, r.tipo === 'teja' ? '#c8553d' : '#8a7a72'); }
      }
      this.caidas = this.caidas.filter(r => !r.muerta);
      /* Objetos que ruedan (piedras, barriles): aparecen a la vista, avisan y luego ruedan despacio */
      for (const r of this.rodantes) {
        const vista = this.camX + VW;
        if (r.est === 'espera') { r.cd -= dt; if (r.cd <= 0 && p.x > r.x0 - 140 && p.x < r.x1 - 20) { r.est = 'aviso'; r.t = 1.2; r.x = Math.min(r.x1 - 12, vista - 18); r.y = this.sueloEn(r.x); } }
        else if (r.est === 'aviso') { r.t -= dt; if (r.t <= 0) r.est = 'rueda'; }
        else if (r.est === 'rueda') {
          r.x -= r.vel * dt; r.rot -= r.vel * dt / 10; r.y += (this.sueloEn(r.x) - r.y) * Math.min(1, dt * 10);
          if (Math.abs(r.x - (p.x + p.w / 2)) < 10 + p.w / 2 && Math.abs((r.y - 11) - (p.y + p.h / 2)) < 10 + p.h / 2) this.herir();
          if (r.x < r.x0 - 20 || r.x < this.camX - 30) { r.est = 'espera'; r.cd = 2.5; }
        }
      }
    }
    brillo(x, y) { for (let i = 0; i < 8; i++) this.particulas.push({ x, y, vx: Math.cos(i) * 70, vy: Math.sin(i) * 70, v: 0.4, c: '#fff1a8' }); }
    polvo(x, y, c = '#e8dcc0') { for (let i = 0; i < 6; i++) this.particulas.push({ x: x + (Math.random() - 0.5) * 8, y, vx: (Math.random() - 0.5) * 60, vy: -Math.random() * 40, v: 0.35, c }); }
    actParticulas(dt) { for (const q of this.particulas) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 300 * dt; q.v -= dt; } this.particulas = this.particulas.filter(q => q.v > 0); }
    decir(txt, quien = 'leon') { this.burbuja = { txt, t: 5, quien }; EL.voz.decir(txt); }
    actDialogos(dt) {
      if (!this.dialogos.length || this.fundido > 0.2) return;
      const lineas = this.dialogos.splice(0); this.pausarPara(lineas);
    }
    /* El narrador aparece en grande, pausa el juego y espera un toque (estilo tutorial) */
    escenaDe(k) { return Math.floor((Math.max(1, k) - 1) / 2) % EL.nEscenas(this.zona.id); }
    pausarPara(lineas) {
      this.pausado = true; EL.input.limpiar(); EL.pantallas.tactil(null);
      EL.pantallas.narrar(lineas, () => { this.pausado = false; EL.input.limpiar(); if (EL.escena === this) EL.pantallas.tactil('nivel'); });
    }

    /* ---- Dibujo ---- */
    dibujar(x) {
      const t = this.t, p = this.p;
      const sx = this.sacudir > 0 ? (Math.random() - 0.5) * 4 : 0;
      const cx = Math.round((this.camX + sx) * Z) / Z, cy = Math.round(this.camY * Z) / Z;
      // un escenario distinto cada 2 niveles (5 por zona), con fundido al cambiar
      if (this.esc == null) this.esc = this.escenaDe(this.nivelActual);
      if (this.cambioEsc > 0) { this.cambioEsc = Math.max(0, this.cambioEsc - 1 / 70); EL.dibujarFondo(x, this.zona.id, this.camX * 1.6, t, this.escAnt); EL.dibujarFondo(x, this.zona.id, this.camX * 1.6, t, this.esc, 1 - this.cambioEsc); }
      else EL.dibujarFondo(x, this.zona.id, this.camX * 1.6, t, this.esc);
      x.save(); x.scale(Z, Z); x.translate(-cx, -cy);
      this.dibujarBloques(x, cx, cy, t);
      for (const pc of this.picto) if (pc.x > cx - 40 && pc.x < cx + VW + 40) {
        if (['verso', 'gigantona', 'enano'].includes(pc.tipo)) this.pictoPersonaje(x, pc, t);
        else if (pc.tipo === 'cuidado') { EL.dibujarPicto(x, 'farol', pc.x, pc.y, t); EL.dibujarAviso(x, pc.x, pc.y - 4, 0); }
        else EL.dibujarPicto(x, pc.tipo, pc.x, pc.y, t);
      }
      for (const f of this.faroles) if (f.x > cx - 30 && f.x < cx + VW + 30) { EL.dibujarFarolCheck(x, f.x, f.y, f.on, t); EL.px.rect(x, f.x - 7, f.y - 26, 15, 9, f.on ? '#ffd96a' : '#fdf3dc'); EL.px.rect(x, f.x - 8, f.y - 27, 17, 1, '#1b1222'); x.fillStyle = '#1b1222'; x.font = 'bold 7px monospace'; x.textAlign = 'center'; x.fillText(String(f.k), f.x + 1, f.y - 19); x.textAlign = 'left'; }
      if (this.campana && this.campana.x > cx - 60 && this.campana.x < cx + VW + 60) EL.dibujarCampana(x, this.campana.x, this.campana.y, t, this.campana.sonando);
      for (const e of this.ecosEnt) if (e.vivo && e.x > cx - 10 && e.x < cx + VW + 10) EL.dibujarEco(x, e.x, e.y, t);
      for (const c of this.corazones) if (c.vivo && c.x > cx - 10 && c.x < cx + VW + 10) EL.dibujarCorazonItem(x, c.x, c.y, t);
      // peligros
      for (const r of this.caidas) {
        if (r.aviso > 0) { const g = this.sueloEn(r.x); x.fillStyle = 'rgba(30,10,10,' + (0.65 - r.aviso * 0.35) + ')'; x.fillRect(r.x - 8, g - 2, 16, 3); EL.dibujarAviso(x, r.x, cy + 18, t); }
        else EL.dibujarCaida(x, r.tipo, r.x, r.y, r.rot);
      }
      for (const r of this.rodantes) {
        if (r.est === 'espera') continue;
        const rr = 10; if (r.tipo === 'barril') EL.dibujarBarril(x, r.x, r.y - rr, rr, r.rot); else EL.dibujarRoca(x, r.x, r.y - rr, rr, r.rot);
        if (r.est === 'aviso') EL.dibujarAviso(x, r.x, r.y - rr * 2 - 18, t, 'izq');
      }
      this.dibujarJugador(x);
      if (this.onda) { this.onda.t += 1 / 60; const rr = this.onda.t * 200; if (rr < 170) { x.strokeStyle = 'rgba(127,224,255,' + (1 - rr / 170) + ')'; x.lineWidth = 2; for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(p.x + p.w / 2, p.y + 6, Math.max(1, rr - k * 14), -1.2, 1.2); x.stroke(); } } else this.onda = null; }
      for (const q of this.particulas) { x.fillStyle = q.c; x.fillRect(Math.round(q.x), Math.round(q.y), 2, 2); }
      x.restore();
      // plano delantero (estilo multiplano de las caricaturas clásicas)
      if (this.cambioEsc > 0) { EL.dibujarFrente(x, this.zona.id, this.camX * 1.6, this.escAnt, this.cambioEsc); EL.dibujarFrente(x, this.zona.id, this.camX * 1.6, this.esc, 1 - this.cambioEsc); } else EL.dibujarFrente(x, this.zona.id, this.camX * 1.6, this.esc);
      if (this.zona.id === 'centro') this.oscuridad(x, cx, cy);
      if (this.zona.id === 'callereal') { x.fillStyle = 'rgba(10,12,40,0.22)'; x.fillRect(0, 0, 640, 360); }
      this.hud(x);
      const fade = Math.max(this.fundido, this.transicion ? Math.min(1, this.transicion / 1.2) : 0);
      if (fade > 0) { x.fillStyle = 'rgba(13,11,28,' + fade + ')'; x.fillRect(0, 0, 640, 360); }
    }
    dibujarBloques(x, cx, cy, t) {
      const b = this.bloques, cols = this.gen.cols, c0 = Math.max(0, Math.floor(cx / TS)), c1 = Math.min(cols.length - 1, Math.ceil((cx + VW) / TS));
      const r0 = Math.max(0, Math.floor(cy / TS)), r1 = Math.min(FILAS - 1, Math.ceil((cy + VH) / TS));
      const sol = (c, r) => r >= 0 && r < FILAS && cols[c] && this.esSolido(cols[c][r]);
      for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
        const v = cols[c][r], X = c * TS, Y = r * TS;
        if (v === T.SUELO || v === T.PIEDRA) {
          const arriba = sol(c, r - 1);
          x.drawImage(v === T.PIEDRA ? b.piedra : (arriba ? b.relleno : b.tope), X, Y);
          if (!sol(c - 1, r)) { x.fillStyle = b.s.tierraS; x.fillRect(X, Y + (arriba ? 0 : 4), 2, TS); x.fillStyle = '#1b1222'; x.fillRect(X, Y + (arriba ? 0 : 1), 1, TS); }
          if (!sol(c + 1, r)) { x.fillStyle = b.s.tierraS; x.fillRect(X + TS - 2, Y + (arriba ? 0 : 4), 2, TS); x.fillStyle = '#1b1222'; x.fillRect(X + TS - 1, Y + (arriba ? 0 : 1), 1, TS); }
          if (!arriba) {
            x.fillStyle = '#1b1222'; x.fillRect(X, Y, TS, 1);
            const h = (c * 7919 + r * 31) % 100;
            if (!b.s.adoquin && h < 30) { const dx = X + 3 + (h % 9); if (h < 15) { x.fillStyle = b.s.pastoS; x.fillRect(dx, Y - 3, 1, 3); x.fillRect(dx + 2, Y - 4, 1, 4); x.fillRect(dx + 4, Y - 2, 1, 2); } else { x.fillStyle = ['#ff6b8a', '#ffd34a', '#ffffff', '#b38aff'][h % 4]; x.fillRect(dx, Y - 3, 2, 2); } }
          }
          if (r + 1 < FILAS && !sol(c, r + 1)) { x.fillStyle = '#1b1222'; x.fillRect(X, Y + TS - 1, TS, 1); }
        } else if (v === T.TABLA) x.drawImage(b.tabla, X, Y);
        else if (v === T.ESPINA) x.drawImage(b.espina, X, Y);
        else if (v === T.VERSO) EL.dibujarVerso(x, X, Y, this.versoT > 0 && (this.versoT > 1 || Math.sin(t * 20) > 0), t);
        else if (v === T.AGUA) EL.dibujarAgua(x, X, Y, r === 0 || cols[c][r - 1] !== T.AGUA, t);
      }
    }
    pictoPersonaje(x, pc, t) {
      const id = pc.tipo === 'verso' ? 'dario' : pc.tipo, s = EL.sprite(id), b = Math.round(Math.sin(t * 4) * 2);
      EL.px.rect(x, pc.x - 16, pc.y - 4 + b, 32, 40, 'rgba(253,243,220,0.85)');
      const k = id === 'gigantona' ? 0.8 : 1.2; x.drawImage(s, pc.x - s.width * k / 2, pc.y + 34 + b - s.height * k, s.width * k, s.height * k);
      EL.px.rect(x, pc.x + 8, pc.y + b - 2, 8, 8, '#2e8b57'); EL.px.rect(x, pc.x + 11, pc.y + b, 2, 4, '#fff');
    }
    dibujarJugador(x) {
      const p = this.p, t = this.t;
      if (p.inv > 0 && Math.floor(t * 12) % 2) return;
      const est = !p.suelo && !p.agua ? 'salto' : (Math.abs(p.vx) > 10 ? (Math.floor(p.anim * 9) % 2 ? 'paso' : 'quieto') : 'quieto');
      const s = EL.sprite(this.forma, est, this.traje);
      if (p.suelo) { x.fillStyle = 'rgba(20,10,30,0.3)'; x.fillRect(Math.round(p.x - 2), Math.round(p.y + p.h - 1), p.w + 4, 2); }
      const dx = Math.round(p.x + p.w / 2 - s.width / 2), dy = Math.round(p.y + p.h - s.height + s.pad) + (est === 'paso' ? -1 : 0);
      if (p.dir < 0 && this.forma !== 'punche') { x.save(); x.translate(dx + s.width, dy); x.scale(-1, 1); x.drawImage(s, 0, 0); x.restore(); } else x.drawImage(s, dx, dy);
      if (this.luzT > 0) EL.px.rect(x, p.x + p.w / 2 - 1, p.y + 10, 3, 3, '#fff6b0');
    }
    oscuridad(x, cx, cy) {
      if (!this.sombra) this.sombra = EL.canvas(640, 360);
      const o = this.sombra.x, p = this.p, S = (wx, wy) => [(wx - cx) * Z, (wy - cy) * Z];
      o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, 640, 360); o.fillStyle = 'rgba(6,4,22,0.9)'; o.fillRect(0, 0, 640, 360);
      o.globalCompositeOperation = 'destination-out';
      const luz = (wx, wy, r) => { const [lx, ly] = S(wx, wy), g = o.createRadialGradient(lx, ly, r * 0.25, lx, ly, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = g; o.beginPath(); o.arc(lx, ly, r, 0, 7); o.fill(); };
      luz(p.x + p.w / 2, p.y + p.h / 2, this.luzT > 0 ? 330 : 170);
      for (const f of this.faroles) if (f.x > cx - 60 && f.x < cx + VW + 60) luz(f.x, f.y - 34, f.on ? 120 : 60);
      for (const e of this.ecosEnt) if (e.vivo && e.x > cx && e.x < cx + VW) luz(e.x, e.y, 22);
      for (const r of this.caidas) luz(r.x, r.aviso > 0 ? this.sueloEn(r.x) : r.y, 60);
      for (const r of this.rodantes) if (r.est !== 'espera') luz(r.x, r.y - 10, 70);
      x.drawImage(this.sombra, 0, 0);
      for (const r of this.caidas) if (r.aviso > 0) { x.save(); x.scale(Z, Z); x.translate(-cx, -cy); EL.dibujarAviso(x, r.x, cy + 18, this.t); x.restore(); }
    }
    hud(x) {
      const P = EL.px;
      for (let i = 0; i < 3; i++) { x.save(); x.translate(10 + i * 30, 8); x.scale(1.6, 1.6); EL.dibujarCorazon(x, 0, 0, i < this.vidas); x.restore(); }
      P.rect(x, 8, 32, 96, 22, 'rgba(27,18,34,0.7)'); EL.dibujarEco(x, 20, 43, 0); x.fillStyle = '#fff6cf'; x.font = 'bold 14px monospace'; x.fillText(String(this.ecosZona), 32, 48);
      // zona y nivel
      const txt = this.zona.nombre + ' · Nivel ' + this.nivelActual + '/' + NIVELES_ZONA; x.font = 'bold 12px sans-serif'; const w = x.measureText(txt).width + 20;
      P.rect(x, 320 - w / 2, 6, w, 18, 'rgba(27,18,34,0.75)'); x.fillStyle = '#ffd96a'; x.textAlign = 'center'; x.fillText(txt, 320, 19); x.textAlign = 'left';
      const info = this.nivelInfo(), dentro = info ? Math.max(0, Math.min(1, (this.p.x - info.x0) / (info.x1 - info.x0))) : 0, prog = (this.nivelActual - 1 + dentro) / NIVELES_ZONA;
      P.rect(x, 220, 28, 200, 6, 'rgba(27,18,34,0.6)'); P.rect(x, 221, 29, 198 * prog, 4, '#ffd34a');
      for (let i = 10; i < 50; i += 10) P.rect(x, 220 + i * 4, 27, 1, 8, 'rgba(255,255,255,0.5)');
      const dn = ['Fácil', 'Medio', 'Difícil'][this.dif]; x.font = 'bold 10px sans-serif'; x.fillStyle = '#fff'; x.fillText(dn, 426, 34);
      if (info && info.carrera) { P.rect(x, 268, 40, 104, 14, 'rgba(232,52,74,0.85)'); x.fillStyle = '#fff'; x.font = 'bold 10px sans-serif'; x.fillText('¡Tramo de carrera!', 274, 51); }
      // habilidad
      const id = this.pjId;
      if (['dario', 'gigantona', 'margarita'].includes(id)) {
        const ready = id === 'margarita' ? this.luzCd <= 0 : true;
        P.rect(x, 590, 52, 40, 40, ready ? 'rgba(255,214,90,0.9)' : 'rgba(80,70,100,0.8)');
        const ic = id === 'gigantona' ? (this.forma === 'gigantona' ? 'enano' : 'gigantona') : id, sp = EL.sprite(ic), k = Math.min(34 / sp.height, 1.6);
        x.drawImage(sp, 610 - sp.width * k / 2, 90 - sp.height * k, sp.width * k, sp.height * k);
        if (id === 'margarita' && this.luzCd > 0) { x.fillStyle = 'rgba(20,10,30,0.6)'; x.fillRect(590, 52, 40, 40 * Math.min(1, this.luzCd / 5.5)); }
      }
      if (this.aviso) { x.font = 'bold 16px sans-serif'; const w2 = x.measureText(this.aviso.txt).width + 24; P.rect(x, 320 - w2 / 2, 60, w2, 26, 'rgba(255,217,106,0.95)'); x.fillStyle = '#1b1222'; x.textAlign = 'center'; x.fillText(this.aviso.txt, 320, 79); x.textAlign = 'left'; }
      if (this.banner) {
        P.rect(x, 120, 110, 400, 90, 'rgba(253,243,220,0.97)'); P.rect(x, 120, 110, 400, 3, '#1b1222'); P.rect(x, 120, 197, 400, 3, '#1b1222');
        if (this.banner.id) { const s = EL.sprite(this.banner.id === 'gigantona' ? 'enano' : this.banner.id); x.drawImage(s, 140, 190 - s.height * 2.2, s.width * 2.2, s.height * 2.2); }
        const partes = this.banner.sub.split(' · ');
        x.fillStyle = '#c8553d'; x.font = 'bold 20px sans-serif'; x.fillText(this.banner.txt, 210, 140); x.fillStyle = '#1b1222'; x.font = 'bold 12px sans-serif'; partes.forEach((ln, i) => x.fillText(ln, 210, 162 + i * 17));
      }
      if (this.burbuja && EL.save.data.ajustes.subt) {
        const txt = this.burbuja.txt; x.font = 'bold 13px sans-serif';
        const lineas = []; let l = ''; for (const w3 of txt.split(' ')) { if (x.measureText(l + w3).width > 470) { lineas.push(l); l = ''; } l += w3 + ' '; } lineas.push(l);
        const h = 16 + lineas.length * 16, y0 = 96;
        P.rect(x, 70, y0, 500, h, 'rgba(253,243,220,0.96)'); P.rect(x, 70, y0, 500, 2, '#1b1222'); P.rect(x, 70, y0 + h - 2, 500, 2, '#1b1222');
        const q = this.burbuja.quien || 'leon', l2 = EL.sprite(q === 'gigantona' ? 'enano' : q); const k2 = Math.min(1.4, (h - 6) / l2.height); x.drawImage(l2, 76, y0 + h - 3 - l2.height * k2, l2.width * k2, l2.height * k2);
        x.fillStyle = '#2a1a2e'; lineas.forEach((ln, i) => x.fillText(ln, 112, y0 + 20 + i * 16));
      }
    }
  }
  EL.Recorrido = Recorrido;
})();
