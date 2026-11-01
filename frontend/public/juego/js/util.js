/* eslint-disable */
/* Ecos de León · utilidades: azar, dibujo en píxeles, sonido, voz, guardado y controles */
'use strict';
const EL = window.EL = {};
EL.CONFIG = window.EL_CONFIG || { version: 'prueba', sello: 'VERSIÓN DE PRUEBA' };
EL.VERSION = EL.CONFIG.version;   // 'prueba' | 'demo' | 'final' | 'libre' (final con todo desbloqueado)
EL.WEB = location.protocol === 'file:' ? '' : (EL.CONFIG.web || '');   // dentro de la web de Ecos de León

/* ---------- Azar con semilla ---------- */
EL.rng = function (seed) {
  let s = (seed >>> 0) || 1;
  const r = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  r.int = (a, b) => a + Math.floor(r() * (b - a + 1));
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  r.shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  return r;
};
EL.R = EL.rng(Date.now() ^ 0x5eed);

/* ---------- Dibujo en píxeles (sin suavizado) ---------- */
EL.canvas = function (w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false; c.x = x; return c;
};
EL.px = {
  rect(x, cx, cy, w, h, col) { x.fillStyle = col; x.fillRect(Math.round(cx), Math.round(cy), Math.round(w), Math.round(h)); },
  circle(x, cx, cy, r, col) {
    x.fillStyle = col;
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.8));
      x.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1);
    }
  },
  ellipse(x, cx, cy, rx, ry, col) {
    x.fillStyle = col;
    for (let dy = -ry; dy <= ry; dy++) {
      const dx = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.01))));
      x.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1);
    }
  },
  poly(x, pts, col) { // relleno por barrido de líneas
    x.fillStyle = col;
    let minY = Infinity, maxY = -Infinity;
    pts.forEach(p => { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= y + 0.5 && b[1] > y + 0.5) || (b[1] <= y + 0.5 && a[1] > y + 0.5)) {
          xs.push(a[0] + (y + 0.5 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
        }
      }
      xs.sort((p, q) => p - q);
      for (let i = 0; i + 1 < xs.length; i += 2) x.fillRect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1);
    }
  },
  line(x, x0, y0, x1, y1, col) {
    x.fillStyle = col;
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0 || 1;
    for (let i = 0; i <= n; i++) x.fillRect(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), 1, 1);
  },
  grad(x, X, Y, w, h, stops) { // degradado en bandas (aspecto pixelado)
    const n = stops.length - 1, bands = Math.max(6, Math.round(h / 6));
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1), k = Math.min(n - 1, Math.floor(t * n)), f = t * n - k;
      x.fillStyle = EL.mix(stops[k], stops[k + 1], f);
      x.fillRect(X, Math.floor(Y + i * h / bands), w, Math.ceil(h / bands) + 1);
    }
  }
};
EL.hex = c => { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(v => v + v).join(''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; };
EL.mix = (a, b, t) => { const A = EL.hex(a), B = EL.hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
EL.shade = (c, t) => t < 0 ? EL.mix(c, '#000000', -t) : EL.mix(c, '#ffffff', t);

/* ---------- Sonido sintetizado (sin archivos) ---------- */
EL.audio = (function () {
  let ctx = null;
  const on = () => EL.save && EL.save.data.ajustes.sonido;
  function ac() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; }
  function tone(f, d, type = 'square', vol = 0.08, slide = 0, delay = 0) {
    if (!on()) return; const c = ac(); if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02);
  }
  function noise(d, vol = 0.1, delay = 0) {
    if (!on()) return; const c = ac(); if (!c) return;
    const b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
    const s = c.createBufferSource(), g = c.createGain(); s.buffer = b; g.gain.value = vol;
    s.connect(g); g.connect(c.destination); s.start(c.currentTime + delay);
  }
  return {
    unlock: ac,
    salto: () => tone(330, 0.14, 'square', 0.05, 330),
    eco: () => { tone(880, 0.08, 'triangle', 0.07); tone(1320, 0.12, 'triangle', 0.06, 0, 0.06); },
    golpe: () => { tone(200, 0.25, 'sawtooth', 0.07, -150); noise(0.15, 0.05); },
    clic: () => tone(600, 0.05, 'square', 0.04),
    verso: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'sine', 0.06, 0, i * 0.06)); },
    cambio: () => { tone(260, 0.1, 'square', 0.05, 200); tone(520, 0.1, 'square', 0.05, -200, 0.08); },
    luz: () => tone(1200, 0.4, 'sine', 0.05, 600),
    ladrido: () => { tone(420, 0.09, 'sawtooth', 0.08, -180); tone(380, 0.11, 'sawtooth', 0.08, -200, 0.14); },
    caballo: () => { for (let i = 0; i < 6; i++) noise(0.05, 0.12, i * 0.16 + (i % 2) * 0.05); },
    agua: () => noise(0.25, 0.05),
    victoria: () => { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, 0.22, 'square', 0.05, 0, i * 0.11)); },
    derrota: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.28, 'triangle', 0.07, 0, i * 0.16)); },
    compra: () => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.12, 'triangle', 0.06, 0, i * 0.05)); },
    cohete: () => { tone(300, 0.6, 'sine', 0.04, 1200); noise(0.4, 0.12, 0.6); },
    tambor: () => { tone(110, 0.18, 'sine', 0.2, -60); noise(0.06, 0.08); },
    error: () => tone(160, 0.2, 'square', 0.05),
    campana: () => { [0, 0.45, 0.9].forEach(d => { tone(880, 1.4, 'sine', 0.09, 0, d); tone(1320, 1.0, 'sine', 0.04, 0, d); tone(440, 1.6, 'triangle', 0.05, 0, d); }); }
  };
})();

/* ---------- Voz del narrador (síntesis del sistema, funciona sin internet si hay voz instalada) ---------- */
EL.voz = (function () {
  let voz = null;
  function elegir() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    voz = vs.find(v => /es[-_](MX|US|419|NI|CR|CO)/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { elegir(); speechSynthesis.onvoiceschanged = elegir; }
  return {
    decir(txt) {
      if (!EL.save || !EL.save.data.ajustes.voz || !('speechSynthesis' in window)) return;
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt.replace(/[«»]/g, '')); u.lang = 'es-419'; if (voz) u.voice = voz; u.rate = 1; u.pitch = 1.05; speechSynthesis.speak(u); } catch (e) { }
    },
    callar() { try { speechSynthesis.cancel(); } catch (e) { } }
  };
})();

/* ---------- Guardado (en el dispositivo) ---------- */
EL.save = (function () {
  const KEY = { prueba: 'ecosdeleon_prueba_v2', demo: 'ecosdeleon_demo_v2', final: 'ecosdeleon_v1', libre: 'ecosdeleon_libre_v1' }[EL.VERSION] || 'ecosdeleon_prueba_v2';   // cada versión guarda aparte
  const nuevo = () => ({
    v: 2, ecos: 0, ecosTotales: 0,
    niveles: {},            // 'zona-n': {hecho, mejor}
    zonas: [],              // zonas completadas
    personajes: ['explorador'],
    minijuegos: {},         // id: {f:{gan,mejor}, m:{...}, d:{...}}
    vestuario: {},          // personaje: {tiene:[...], usa:'base'}
    griteria: false,
    vistos: {},             // escenas de historia vistas
    rot: { sopa: {}, memoria: [], rompe: [] },
    ajustes: { sonido: true, voz: true, subt: true, lento: false, tactil: 'auto' }
  });
  let mem = null;
  const api = {
    data: null,
    cargar() {
      try { mem = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { mem = null; }
      const base = nuevo();
      api.data = mem ? Object.assign(base, mem, { ajustes: Object.assign(base.ajustes, mem.ajustes || {}), rot: Object.assign(base.rot, mem.rot || {}) }) : base;
    },
    guardar() { try { localStorage.setItem(KEY, JSON.stringify(api.data)); } catch (e) { } },
    reiniciar() { api.data = nuevo(); api.guardar(); },
    sumarEcos(n) { api.data.ecos += n; if (n > 0) api.data.ecosTotales += n; api.guardar(); }
  };
  api.cargar();
  return api;
})();

/* ---------- Controles: teclado, táctil y mando ---------- */
EL.input = (function () {
  const k = {}, prev = {}, tactil = {}, latch = {};
  const map = { ArrowLeft: 'izq', KeyA: 'izq', ArrowRight: 'der', KeyD: 'der', ArrowUp: 'arr', KeyW: 'arr', ArrowDown: 'aba', KeyS: 'aba', Space: 'salto', KeyZ: 'salto', KeyK: 'salto', KeyX: 'accion', ShiftLeft: 'accion', ShiftRight: 'accion', KeyJ: 'accion', Escape: 'pausa', KeyP: 'pausa', Enter: 'ok' };
  addEventListener('keydown', e => { const a = map[e.code]; if (a) { k[a] = true; if (!e.repeat) latch[a] = true; if (['salto', 'arr', 'aba', 'izq', 'der'].includes(a) && EL.enJuego) e.preventDefault(); } EL.audio.unlock(); });
  addEventListener('keyup', e => { const a = map[e.code]; if (a) k[a] = false; });
  addEventListener('blur', () => { for (const a in k) k[a] = false; });
  function pad() {
    const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(g => g) : null; const r = {};
    if (gp) {
      const ax = gp.axes[0] || 0;
      r.izq = ax < -0.4 || (gp.buttons[14] && gp.buttons[14].pressed);
      r.der = ax > 0.4 || (gp.buttons[15] && gp.buttons[15].pressed);
      r.arr = (gp.axes[1] || 0) < -0.5 || (gp.buttons[12] && gp.buttons[12].pressed);
      r.aba = (gp.axes[1] || 0) > 0.5 || (gp.buttons[13] && gp.buttons[13].pressed);
      r.salto = gp.buttons[0] && gp.buttons[0].pressed;
      r.accion = (gp.buttons[2] && gp.buttons[2].pressed) || (gp.buttons[1] && gp.buttons[1].pressed);
      r.pausa = gp.buttons[9] && gp.buttons[9].pressed;
    }
    return r;
  }
  const api = {
    est: {},
    actualizar() {
      const p = pad();
      for (const a of ['izq', 'der', 'arr', 'aba', 'salto', 'accion', 'pausa', 'ok']) {
        prev[a] = api.est[a];
        api.est[a] = !!(k[a] || tactil[a] || p[a] || latch[a]); latch[a] = false;
      }
    },
    abajo: a => !!api.est[a],
    pulso: a => !!api.est[a] && !prev[a],
    tactil, latch,
    limpiar() { for (const a in k) k[a] = false; for (const a in tactil) tactil[a] = false; for (const a in latch) latch[a] = false; }
  };
  return api;
})();

EL.esTactil = () => EL.save.data.ajustes.tactil === 'si' || (EL.save.data.ajustes.tactil === 'auto' && (('ontouchstart' in window) || matchMedia('(pointer: coarse)').matches));

/* Botones táctiles: <button data-k="izq"> */
EL.enlazarTactil = function (raiz) {
  raiz.querySelectorAll('[data-k]').forEach(b => {
    const a = b.dataset.k;
    const on = e => { e.preventDefault(); EL.input.tactil[a] = true; EL.input.latch[a] = true; b.classList.add('activo'); EL.audio.unlock(); };
    const off = e => { e.preventDefault(); EL.input.tactil[a] = false; b.classList.remove('activo'); };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
  });
};

/* Utilidades DOM */
EL.$ = (s, r = document) => r.querySelector(s);
EL.el = function (tag, attrs = {}, html = '') {
  const e = document.createElement(tag);
  for (const a in attrs) { if (a === 'on') { for (const ev in attrs.on) e.addEventListener(ev, attrs.on[ev]); } else if (a === 'class') e.className = attrs[a]; else e.setAttribute(a, attrs[a]); }
  if (html) e.innerHTML = html; return e;
};
EL.esperar = ms => new Promise(r => setTimeout(r, ms));
