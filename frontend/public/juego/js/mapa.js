/* eslint-disable */
/* Ecos de León · mapa ilustrado (2D, vista aérea en 3/4, al estilo de una capital de clan)
   La tierra tiene la forma real del departamento de León (Nicaragua): costa del Pacífico al suroeste,
   lago Xolotlán al sureste, municipios con sus límites y vecinos (Chinandega, Estelí, Matagalpa, Managua).
   Metapa (hoy Ciudad Darío) queda fuera, en Matagalpa, unida por un camino. El mapa se arrastra y
   tiene una vista completa («Ver toda León»). */
'use strict';
(function () {
  const K = 2.4, O = 40;                                   // coordenadas del mapa de referencia → mundo (px HD)
  const T = ([a, b]) => [(a - O) * K, (b - O) * K];
  const W = Math.round((760 - O) * K), H = Math.round((720 - O) * K);
  let base = null, yaVisto = false;
  /* Contornos (trazados sobre el mapa del departamento de León) */
  const LEON = [[110, 432], [160, 452], [210, 485], [255, 525], [292, 562], [302, 578], [306, 612], [324, 642], [344, 666], [360, 682], [374, 660], [398, 606], [420, 566], [430, 522], [412, 504], [390, 476], [398, 456], [432, 442], [466, 432], [502, 427], [530, 418], [552, 410], [576, 410], [578, 330], [577, 262], [576, 182], [532, 186], [498, 180], [499, 128], [500, 82], [470, 70], [400, 74], [316, 72], [322, 102], [346, 126], [350, 152], [351, 210], [350, 255], [314, 262], [282, 268], [268, 296], [232, 312], [214, 338], [204, 360], [190, 388], [166, 410]].map(T);
  const COSTA = [[-40, 300], [5, 360], [60, 392], [110, 432], [160, 452], [210, 485], [255, 525], [292, 562], [302, 578], [318, 630], [340, 680], [372, 740], [-40, 740]].map(T);
  const LAGO = [[390, 476], [398, 456], [432, 442], [466, 432], [502, 427], [530, 418], [552, 410], [600, 404], [660, 400], [700, 410], [700, 590], [640, 584], [580, 560], [520, 552], [470, 566], [440, 540], [430, 522], [412, 504]].map(T);
  const LIMITES = [[[350, 152], [395, 140], [435, 126], [470, 110], [499, 100]], [[350, 255], [420, 266], [500, 262], [577, 262]], [[498, 186], [500, 262]],
    [[500, 262], [490, 320], [472, 370], [466, 400], [492, 428]], [[472, 370], [400, 372], [348, 386], [322, 390]], [[282, 268], [314, 300], [322, 350], [322, 390]],
    [[232, 312], [233, 350], [231, 394]], [[166, 410], [231, 394], [322, 390], [336, 392]], [[336, 392], [312, 432], [288, 480], [290, 512], [300, 560]], [[290, 512], [330, 526], [390, 516], [430, 522]]].map(l => l.map(T));
  const MUNICIPIOS = [['Achuapa', 405, 100], ['El Sauce', 425, 205], ['Santa Rosa', 538, 212], ['del Peñón', 538, 226], ['El Jicaral', 535, 330], ['Larreynaga', 405, 318], ['Telica', 246, 300], ['Quezalguaque', 196, 372], ['La Paz Centro', 452, 374], ['Nagarote', 362, 620]].map(([t, a, b]) => [t, ...T([a, b])]);
  const VECINOS = [['CHINANDEGA', 160, 250], ['ESTELÍ', 430, 52], ['MATAGALPA', 640, 250], ['MANAGUA', 520, 640]].map(([t, a, b]) => [t, ...T([a, b])]);
  /* Zonas del juego (orden de EL.ZONAS) y volcanes */
  const POS = { leonviejo: [415, 425], metapa: [640, 352], sutiaba: [215, 425], centro: [290, 408], callereal: [345, 476], poneloya: [135, 452], griteria: [255, 492] };
  const posZona = i => T(POS[EL.ZONAS[i].id]);
  const VOLCANES = [[[352, 372], 74, 58, '#3a3640', '#24212a', true, 'Cerro Negro'], [[268, 358], 84, 64, '#7b8a5a', '#5e6a4a', true, 'Volcán Telica'], [[402, 566], 120, 96, '#8a7f96', '#665a78', true, 'Momotombo']].map(([p, ...r]) => [...T(p), ...r]);
  const CERROS = [[380, 160], [450, 150], [430, 240], [535, 290], [470, 300], [395, 250], [545, 370]].map(T);
  function curva(x, pts, cerrar = true) {
    x.beginPath(); const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (cerrar) { const s = m(pts[n - 1], pts[0]); x.moveTo(s[0], s[1]); for (let i = 0; i < n; i++) { const e = m(pts[i], pts[(i + 1) % n]); x.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]); } x.closePath(); }
    else { x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n - 1; i++) { const e = m(pts[i], pts[i + 1]); x.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]); } x.lineTo(pts[n - 1][0], pts[n - 1][1]); }
  }

  /* ---------- Pinceles suaves ---------- */
  function blob(x, cx, cy, rx, ry, irreg, seed, pts = 40) {
    const r = EL.rng(seed); const ps = [];
    for (let i = 0; i < pts; i++) { const a = i / pts * Math.PI * 2, k = 1 + (r() - 0.5) * irreg; ps.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    x.beginPath(); x.moveTo((ps[0][0] + ps[pts - 1][0]) / 2, (ps[0][1] + ps[pts - 1][1]) / 2);
    for (let i = 0; i < pts; i++) { const a = ps[i], b = ps[(i + 1) % pts]; x.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
    x.closePath();
  }
  function meseta(x, cx, cy, rx, ry, seed, top = '#86d04f', top2 = '#a6e066', alto = 16) {
    // acantilado (lado) y superficie de césped, como las islas-distrito de los juegos de estrategia
    blob(x, cx, cy + alto, rx, ry, 0.12, seed); x.fillStyle = '#7a5434'; x.fill();
    blob(x, cx, cy + alto * 0.55, rx, ry, 0.12, seed); x.fillStyle = '#9a6b42'; x.fill();
    x.lineWidth = 4; x.strokeStyle = '#3b2716'; blob(x, cx, cy + alto, rx, ry, 0.12, seed); x.stroke();
    const g = x.createRadialGradient(cx - rx * 0.2, cy - ry * 0.3, 10, cx, cy, rx); g.addColorStop(0, top2); g.addColorStop(1, top);
    blob(x, cx, cy, rx, ry, 0.12, seed); x.fillStyle = g; x.fill(); x.lineWidth = 4; x.strokeStyle = '#2f5a1e'; x.stroke();
  }
  function arbol(x, cx, cy, r, c1 = '#3f8f35', c2 = '#5fb447') {
    x.fillStyle = 'rgba(0,0,0,0.22)'; x.beginPath(); x.ellipse(cx + 4, cy + r * 0.9, r * 1.05, r * 0.45, 0, 0, 7); x.fill();
    x.fillStyle = '#6b4226'; x.fillRect(cx - 3, cy, 6, r * 0.8);
    x.fillStyle = c1; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.fillStyle = c2; x.beginPath(); x.arc(cx - r * 0.3, cy - r * 0.35, r * 0.62, 0, 7); x.fill();
    x.lineWidth = 3; x.strokeStyle = '#1f4a1a'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
  }
  function palmera(x, cx, cy) {
    x.strokeStyle = '#8a6a3e'; x.lineWidth = 6; x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + 8, cy - 20, cx + 4, cy - 38); x.stroke();
    x.fillStyle = '#3f9a3a'; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; x.beginPath(); x.ellipse(cx + 4 + Math.cos(a) * 12, cy - 38 + Math.sin(a) * 6, 14, 5, a, 0, 7); x.fill(); }
  }
  function casa(x, cx, cy, w, h, pared, techo, lado = 0.55) {
    // casa en 3/4: frente, lado y techo de teja
    const d = w * lado * 0.5;
    x.lineWidth = 3; x.strokeStyle = '#2a1a14';
    x.fillStyle = pared; x.fillRect(cx - w / 2, cy - h, w, h); x.strokeRect(cx - w / 2, cy - h, w, h);
    x.fillStyle = EL.shade(pared, -0.18); x.beginPath(); x.moveTo(cx + w / 2, cy); x.lineTo(cx + w / 2 + d, cy - d * 0.6); x.lineTo(cx + w / 2 + d, cy - h - d * 0.6); x.lineTo(cx + w / 2, cy - h); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = techo; x.beginPath(); x.moveTo(cx - w / 2 - 6, cy - h); x.lineTo(cx - w / 2 + d * 0.6, cy - h - 18 - d * 0.3); x.lineTo(cx + w / 2 + d + 4, cy - h - 18 - d * 0.9); x.lineTo(cx + w / 2 + d + 6, cy - h - d * 0.6); x.lineTo(cx + w / 2 + 6, cy - h); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = EL.shade(techo, -0.3); x.lineWidth = 2; for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(cx - w / 2 + i * w / 5, cy - h); x.lineTo(cx - w / 2 + i * w / 5 + d * 0.6, cy - h - 18 - d * 0.5); x.stroke(); }
    x.fillStyle = '#5a3a22'; x.fillRect(cx - 5, cy - 16, 10, 16); x.fillStyle = '#9fd3f5'; x.fillRect(cx - w / 2 + 6, cy - h + 8, 8, 8); if (w > 40) x.fillRect(cx + w / 2 - 14, cy - h + 8, 8, 8);
  }
  function catedral(x, cx, cy, k = 1) {
    const b = '#f6f1e4', s = '#d6ccb6';
    x.lineWidth = 3; x.strokeStyle = '#2a1a14';
    x.fillStyle = s; x.beginPath(); x.moveTo(cx + 60 * k, cy); x.lineTo(cx + 90 * k, cy - 20 * k); x.lineTo(cx + 90 * k, cy - 70 * k); x.lineTo(cx + 60 * k, cy - 50 * k); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = b; x.fillRect(cx - 60 * k, cy - 50 * k, 120 * k, 50 * k); x.strokeRect(cx - 60 * k, cy - 50 * k, 120 * k, 50 * k);
    [-60, 36].forEach(dx => { x.fillStyle = b; x.fillRect(cx + dx * k, cy - 84 * k, 24 * k, 84 * k); x.strokeRect(cx + dx * k, cy - 84 * k, 24 * k, 84 * k); x.beginPath(); x.ellipse(cx + (dx + 12) * k, cy - 84 * k, 13 * k, 10 * k, 0, Math.PI, 0); x.fill(); x.stroke(); x.fillStyle = '#6a5a4a'; x.fillRect(cx + (dx + 7) * k, cy - 74 * k, 10 * k, 12 * k); });
    x.fillStyle = s; x.beginPath(); x.ellipse(cx, cy - 64 * k, 24 * k, 18 * k, 0, Math.PI, 0); x.fill(); x.stroke();
    x.fillStyle = b; x.beginPath(); x.moveTo(cx - 34 * k, cy - 50 * k); x.lineTo(cx, cy - 74 * k); x.lineTo(cx + 34 * k, cy - 50 * k); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#c9a43e'; x.fillRect(cx - 2 * k, cy - 100 * k, 4 * k, 20 * k); x.fillRect(cx - 7 * k, cy - 94 * k, 14 * k, 4 * k);
    x.fillStyle = '#6a4a32'; [-30, -4, 22].forEach((dx, i) => { const h = (i === 1 ? 26 : 18) * k; x.beginPath(); x.moveTo(cx + dx * k, cy); x.lineTo(cx + dx * k, cy - h); x.arc(cx + (dx + 4) * k, cy - h, 4 * k, Math.PI, 0); x.lineTo(cx + (dx + 8) * k, cy); x.fill(); });
  }
  function iglesia(x, cx, cy) {
    x.lineWidth = 3; x.strokeStyle = '#2a1a14';
    x.fillStyle = '#d9cfba'; x.beginPath(); x.moveTo(cx + 40, cy); x.lineTo(cx + 64, cy - 16); x.lineTo(cx + 64, cy - 56); x.lineTo(cx + 40, cy - 42); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#f6f1e6'; x.fillRect(cx - 40, cy - 42, 80, 42); x.strokeRect(cx - 40, cy - 42, 80, 42);
    x.beginPath(); x.moveTo(cx - 34, cy - 42); x.lineTo(cx, cy - 66); x.lineTo(cx + 34, cy - 42); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#7a4e2e'; x.beginPath(); x.moveTo(cx - 8, cy); x.lineTo(cx - 8, cy - 22); x.arc(cx, cy - 22, 8, Math.PI, 0); x.lineTo(cx + 8, cy); x.fill();
    x.beginPath(); x.arc(cx, cy - 50, 4, 0, 7); x.fill();
  }
  function ruinas(x, cx, cy) {
    x.lineWidth = 3; x.strokeStyle = '#3b2716';
    [[-46, 0, 34, 26], [-6, -10, 40, 34], [40, 4, 26, 20]].forEach(([dx, dy, w, h], i) => {
      x.fillStyle = '#c48a5a'; x.beginPath(); x.moveTo(cx + dx, cy + dy); x.lineTo(cx + dx, cy + dy - h); for (let k = 0; k <= w; k += 8) x.lineTo(cx + dx + k, cy + dy - h + ((k * 7 + i * 5) % 9)); x.lineTo(cx + dx + w, cy + dy); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = '#94603a'; x.fillRect(cx + dx + w, cy + dy - h + 6, 8, h - 6);
      if (i === 1) { x.fillStyle = '#3c2a26'; x.beginPath(); x.moveTo(cx + dx + 12, cy + dy); x.lineTo(cx + dx + 12, cy + dy - 14); x.arc(cx + dx + 20, cy + dy - 14, 8, Math.PI, 0); x.lineTo(cx + dx + 28, cy + dy); x.fill(); }
    });
  }
  function volcan(x, cx, cy, w, h, c1, c2, humo) {
    x.lineWidth = 4; x.strokeStyle = '#2a1a24';
    x.fillStyle = c1; x.beginPath(); x.moveTo(cx - w / 2, cy); x.quadraticCurveTo(cx - w * 0.15, cy - h * 0.7, cx - 12, cy - h); x.lineTo(cx + 12, cy - h); x.quadraticCurveTo(cx + w * 0.15, cy - h * 0.7, cx + w / 2, cy); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = c2; x.beginPath(); x.moveTo(cx + 4, cy - h); x.lineTo(cx + 12, cy - h); x.quadraticCurveTo(cx + w * 0.15, cy - h * 0.7, cx + w / 2, cy); x.lineTo(cx + w * 0.12, cy); x.closePath(); x.fill();
    x.fillStyle = '#4a3a3a'; x.beginPath(); x.ellipse(cx, cy - h, 12, 4, 0, 0, 7); x.fill();
    if (humo) { x.fillStyle = 'rgba(240,236,232,0.92)'; [[4, -14, 10], [16, -28, 13], [32, -40, 11]].forEach(([dx, dy, r]) => { x.beginPath(); x.arc(cx + dx, cy - h + dy, r, 0, 7); x.fill(); }); }
  }
  function camino(x, pts) {
    const tr = () => { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 18; x.quadraticCurveTo(mx, my, b[0], b[1]); } };
    x.lineCap = 'round'; x.lineJoin = 'round';
    tr(); x.strokeStyle = '#8a6a3e'; x.lineWidth = 22; x.stroke();
    tr(); x.strokeStyle = '#e8d3a0'; x.lineWidth = 15; x.stroke();
    tr(); x.setLineDash([4, 14]); x.strokeStyle = '#c9b07a'; x.lineWidth = 4; x.stroke(); x.setLineDash([]);
  }

  function cerro(x, cx, cy, w, h) {
    x.lineWidth = 3; x.strokeStyle = '#2f5a1e';
    x.fillStyle = '#5f9e3c'; x.beginPath(); x.moveTo(cx - w / 2, cy); x.quadraticCurveTo(cx - w / 4, cy - h, cx, cy - h); x.quadraticCurveTo(cx + w / 4, cy - h, cx + w / 2, cy); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#4e8a32'; x.beginPath(); x.moveTo(cx, cy - h); x.quadraticCurveTo(cx + w / 4, cy - h, cx + w / 2, cy); x.lineTo(cx + w * 0.1, cy); x.closePath(); x.fill();
  }

  function dibujarBase() {
    const c = EL.canvas(W, H), x = c.x; x.imageSmoothingEnabled = true;
    const r = EL.rng(77), Zp = EL.ZONAS.map((z, i) => posZona(i));
    const pLeon = new Path2D(), pLago = new Path2D();
    const aPath = (p, pts) => { const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = m(pts[n - 1], pts[0]); p.moveTo(s[0], s[1]); for (let i = 0; i < n; i++) { const e = m(pts[i], pts[(i + 1) % n]); p.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]); } p.closePath(); };
    aPath(pLeon, LEON); aPath(pLago, LAGO);
    // tierra vecina (apagada para que destaque León), playa y océano
    x.fillStyle = '#a9c57e'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { x.fillStyle = 'rgba(255,255,255,0.08)'; x.beginPath(); x.ellipse(r() * W, r() * H, 8 + r() * 12, 3 + r() * 4, 0, 0, 7); x.fill(); }
    x.save(); x.translate(22, -26); curva(x, COSTA); x.fillStyle = '#f2dc9b'; x.fill(); x.restore();
    const gm = x.createLinearGradient(0, 0, 0, H); gm.addColorStop(0, '#3fa7d6'); gm.addColorStop(1, '#2276b8');
    curva(x, COSTA); x.fillStyle = gm; x.fill(); x.lineWidth = 4; x.strokeStyle = '#1f6a9a'; x.stroke();
    x.save(); curva(x, COSTA); x.clip(); for (let i = 0; i < 120; i++) { x.strokeStyle = 'rgba(255,255,255,0.3)'; x.lineWidth = 2; x.beginPath(); x.arc(r() * W, r() * H, 7 + r() * 8, 0.2, 1.2); x.stroke(); } x.restore();
    // departamento de León: acantilado + césped
    x.save(); x.translate(0, 16); x.fillStyle = '#7a5434'; x.fill(pLeon); x.restore();
    x.save(); x.translate(0, 8); x.fillStyle = '#9a6b42'; x.fill(pLeon); x.restore();
    const gl = x.createLinearGradient(0, 0, 0, H); gl.addColorStop(0, '#86cc4c'); gl.addColorStop(1, '#79c24c'); x.fillStyle = gl; x.fill(pLeon);
    x.save(); x.clip(pLeon); for (let i = 0; i < 520; i++) { x.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,60,0,0.08)'; x.beginPath(); x.ellipse(r() * W, r() * H, 6 + r() * 12, 3 + r() * 4, 0, 0, 7); x.fill(); }
    // límites municipales (suaves)
    x.setLineDash([10, 10]); x.lineCap = 'round'; x.lineWidth = 3; x.strokeStyle = 'rgba(40,80,20,0.45)'; LIMITES.forEach(l => { curva(x, l, false); x.stroke(); }); x.setLineDash([]); x.restore();
    x.lineWidth = 7; x.strokeStyle = '#2f5a1e'; x.stroke(pLeon); x.setLineDash([14, 10]); x.lineWidth = 3; x.strokeStyle = '#f7f0c8'; x.stroke(pLeon); x.setLineDash([]);
    // lago Xolotlán
    x.lineWidth = 22; x.strokeStyle = '#f2dc9b'; x.stroke(pLago);
    x.fillStyle = '#3a9ad0'; x.fill(pLago); x.lineWidth = 4; x.strokeStyle = '#1f6a9a'; x.stroke(pLago);
    x.save(); x.clip(pLago); for (let i = 0; i < 40; i++) { x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 2; x.beginPath(); x.arc(r() * W, r() * H, 6 + r() * 6, 0.2, 1.2); x.stroke(); } x.restore();
    // ríos
    x.lineCap = 'round'; [[[300, 430], [270, 470], [225, 500]], [[440, 300], [452, 370], [470, 434]]].forEach(rio => { curva(x, rio.map(T), false); x.strokeStyle = '#3a9ad0'; x.lineWidth = 9; x.stroke(); x.strokeStyle = '#7fd0ee'; x.lineWidth = 3; x.stroke(); });
    // caminos
    const tramos = [[Zp[0], T([470, 395]), T([560, 368]), Zp[1]], [Zp[0], T([385, 452]), Zp[4]], [Zp[4], T([320, 440]), Zp[3]], [Zp[3], T([250, 410]), Zp[2]], [Zp[2], T([175, 440]), Zp[5]], [Zp[2], T([240, 460]), Zp[6]], [Zp[6], T([300, 490]), Zp[4]]];
    const ptsCamino = [];
    tramos.forEach(t => { for (let i = 1; i < t.length; i++) { const a = t[i - 1], b = t[i], cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - 18; for (let k = 0; k <= 20; k++) { const u = k / 20; ptsCamino.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * cx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * cy + u * u * b[1]]); } } });
    // árboles y cerros: solo dentro de León y sin tocar nada
    const ocupado = [];  // [x, y, rx, ry]
    Zp.forEach(([a, b]) => ocupado.push([a, b - 10, 130, 95]));
    VOLCANES.forEach(v => ocupado.push([v[0], v[1] - v[3] / 2, v[2] * 0.6 + 10, v[3] * 0.6 + 26]));
    MUNICIPIOS.forEach(([t, a, b]) => ocupado.push([a, b - 6, t.length * 7 + 10, 18]));
    CERROS.forEach(([a, b]) => ocupado.push([a, b - 20, 50, 34]));
    const libre = (a, b, rr) => x.isPointInPath(pLeon, a, b) && !x.isPointInPath(pLago, a, b) && x.isPointInPath(pLeon, a, b + rr + 10) && x.isPointInPath(pLeon, a - rr, b) && x.isPointInPath(pLeon, a + rr, b) && !x.isPointInPath(pLago, a, b + rr + 14)
      && ocupado.every(([ox, oy, rx, ry]) => Math.abs(a - ox) > rx + rr || Math.abs(b - oy) > ry + rr) && ptsCamino.every(([px, py]) => Math.hypot(a - px, b - py) > 22 + rr);
    CERROS.forEach(([a, b], i) => cerro(x, a, b, 90 - (i % 3) * 10, 40 - (i % 2) * 8));
    const puestos = [];
    for (let i = 0; i < 2500 && puestos.length < 150; i++) { const a = r() * W, b = r() * H, rr = 9 + r() * 7; if (libre(a, b, rr) && puestos.every(([pa, pb, pr]) => Math.hypot(a - pa, b - pb) > pr + rr + 6)) puestos.push([a, b, rr]); }
    puestos.sort((p1, p2) => p1[1] - p2[1]).forEach(([a, b, rr]) => arbol(x, a, b, rr, r() > 0.5 ? '#3f8f35' : '#4a9a3a'));
    tramos.forEach(t => camino(x, t));
    VOLCANES.forEach(v => volcan(x, v[0], v[1], v[2], v[3], v[4], v[5], v[6]));
    // distritos (pequeños y separados)
    const dist = (i, fn, top, top2) => { const [cx, cy] = Zp[i]; meseta(x, cx, cy + 6, 76, 38, 11 + i, top, top2, 12); x.save(); x.translate(cx, cy + 22); x.scale(0.56, 0.56); fn(x); x.restore(); };
    dist(0, x => { ruinas(x, -6, 0); }, '#86d04f', '#a6e066');
    dist(1, x => { casa(x, -30, 0, 52, 30, '#f4ead6', '#b34a30'); casa(x, 54, 4, 34, 24, '#e9d8b8', '#a9442e'); }, '#7fcd52', '#a8e07a');
    dist(2, x => { iglesia(x, -18, 0); arbol(x, 72, -34, 22, '#2f6b2a', '#4a8f3a'); }, '#9bbd4a', '#bbd96a');
    dist(3, x => { catedral(x, -8, 4, 0.85); }, '#b7afa3', '#d2cbc0');
    dist(4, x => { const cols = ['#e8a87a', '#f2d16b', '#9fc0c9', '#e98aa0']; for (let i = 0; i < 4; i++) casa(x, -66 + i * 40, (i % 2) * 6, 32, 28, cols[i], '#a9442e', 0.35); }, '#9d968b', '#b8b1a6');
    dist(5, x => { palmera(x, -50, 0); palmera(x, 60, -6); casa(x, 4, 6, 34, 22, '#d9b26a', '#c9a06a'); }, '#efd690', '#fff0b8');
    dist(6, x => {
      x.lineWidth = 3; x.strokeStyle = '#2a1a14'; x.fillStyle = '#f9e7c0'; x.fillRect(-30, -50, 60, 50); x.strokeRect(-30, -50, 60, 50);
      x.fillStyle = '#5b8fd9'; x.beginPath(); x.moveTo(0, -42); x.lineTo(-14, 0); x.lineTo(14, 0); x.closePath(); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(0, -34); x.lineTo(-7, 0); x.lineTo(7, 0); x.closePath(); x.fill();
      ['#ff6b8a', '#ffd34a', '#ffffff', '#7fd0ee'].forEach((col, i) => { for (let k = 0; k < 4; k++) { x.fillStyle = col; x.beginPath(); x.arc(-30 + ((i * 4 + k) * 4) % 60, -52 + ((i + k) % 2) * 3, 4, 0, 7); x.fill(); } });
    }, '#9d968b', '#b8b1a6');
    // rótulos
    x.textAlign = 'center'; x.lineJoin = 'round';
    x.font = '900 26px "Segoe UI Black", "Arial Black", sans-serif'; x.fillStyle = 'rgba(70,80,50,0.55)'; VECINOS.forEach(([t, a, b]) => x.fillText(t, a, b));
    x.font = '800 17px "Segoe UI", sans-serif'; x.lineWidth = 4; x.strokeStyle = 'rgba(255,255,255,0.75)'; x.fillStyle = '#2f5a1e'; MUNICIPIOS.forEach(([t, a, b]) => { x.strokeText(t, a, b); x.fillText(t, a, b); });
    x.font = '900 20px "Segoe UI Black", "Arial Black", sans-serif'; x.lineWidth = 5; x.strokeStyle = 'rgba(20,40,80,0.85)'; x.fillStyle = '#e8f6ff';
    VOLCANES.forEach(v => { x.strokeText(v[7], v[0], v[1] + 24); x.fillText(v[7], v[0], v[1] + 24); });
    [['Océano', ...T([120, 560])], ['Pacífico', ...T([120, 570])], ['Lago Xolotlán', ...T([560, 490])]].forEach(([t, a, b], i) => { const yy = i === 1 ? b + 14 : b; x.strokeText(t, a, yy); x.fillText(t, a, yy); });
    x.textAlign = 'left';
    return c;
  }

  class Mapa {
    constructor(alElegir) {
      if (!base) base = dibujarBase();
      this.hd = true; this.t = 0; this.alElegir = alElegir;
      const d = EL.save.data; this.pos = d.mapaPos != null ? d.mapaPos : 0;
      const [x0, y0] = posZona(this.pos); this.ex = x0 - 100; this.ey = y0 + 36; this.ruta = []; this.hover = -1;
      this.zFit = Math.min(1240 / W, 636 / H);
      // primera vez en la sesión: se ve toda León y luego se acerca a la zona actual
      this.cam = { x: x0, y: y0, z: 0.85 }; this.obj = { x: x0, y: y0, z: 0.85 };
      if (!yaVisto) { yaVisto = true; this.cam = { x: W / 2, y: H / 2, z: this.zFit }; this.limitar(this.cam); this.obj = { ...this.cam }; this.acercarEn = 1.6; }
      this.limitar(this.cam);
    }
    get completa() { return this.obj.z < 0.7; }
    verTodo(si) { if (si) { this.obj = { x: W / 2, y: H / 2, z: this.zFit }; this.limitar(this.obj); } else { const [a, b] = posZona(this.pos); this.obj = { x: a, y: b, z: 0.85 }; this.limitar(this.obj); } this.acercarEn = 0; if (this.alCambiarVista) this.alCambiarVista(si); }
    limitar(c) {
      const vw = 1280 / c.z, vh = 720 / c.z;
      c.x = vw >= W ? W / 2 : Math.max(vw / 2, Math.min(W - vw / 2, c.x));
      c.y = vh >= H ? H / 2 - 34 / c.z : Math.max(vh / 2 - 60 / c.z, Math.min(H - vh / 2 + 80 / c.z, c.y));
    }
    aMundo(px, py) { const c = this.cam; return [(px * 2 - 640) / c.z + c.x, (py * 2 - 360) / c.z + c.y]; }
    abierta(i) { return EL.progreso ? EL.progreso.zonaAbierta(i) : true; }
    hecha(i) { const z = EL.ZONAS[i]; return z.final ? EL.save.data.griteria : EL.save.data.zonas.includes(z.id); }
    zonaEn(px, py) { const [a, b] = this.aMundo(px, py); for (let i = 0; i < EL.ZONAS.length; i++) { const [nx, ny] = posZona(i); if (Math.abs(a - nx) < 88 && b > ny - 64 && b < ny + 96) return i; } return -1; }
    clic(px, py) { this.arrastre = { x: px, y: py, cx: this.cam.x, cy: this.cam.y, movio: false }; }
    mover(px, py, botones) {
      const a = this.arrastre;
      if (a && botones) { const dx = (px - a.x) * 2 / this.cam.z, dy = (py - a.y) * 2 / this.cam.z; if (Math.hypot(dx, dy) > 12) a.movio = true; if (a.movio) { this.obj.x = a.cx - dx; this.obj.y = a.cy - dy; this.limitar(this.obj); this.cam.x = this.obj.x; this.cam.y = this.obj.y; this.acercarEn = 0; } return; }
      this.hover = this.zonaEn(px, py);
    }
    soltar(px, py) {
      const a = this.arrastre; this.arrastre = null; if (!a || a.movio) return;
      const i = this.zonaEn(px, py); if (i < 0) return;
      if (!this.abierta(i)) { EL.audio.error(); return; }
      EL.audio.clic();
      if (this.completa) { const [nx, ny] = posZona(i); this.obj = { x: nx, y: ny, z: 0.85 }; this.limitar(this.obj); if (this.alCambiarVista) this.alCambiarVista(false); }
      if (i === this.pos && !this.ruta.length) { this.alElegir(i); return; }
      this.ruta = [i];
    }
    rueda(d) { const z = Math.max(this.zFit, Math.min(1.25, this.obj.z * (d > 0 ? 0.85 : 1.18))); this.obj.z = z; this.limitar(this.obj); this.acercarEn = 0; if (this.alCambiarVista) this.alCambiarVista(this.completa); }
    actualizar(dt) {
      this.t += dt;
      if (this.acercarEn > 0) { this.acercarEn -= dt; if (this.acercarEn <= 0) { const [a, b] = posZona(this.pos); this.obj = { x: a, y: b, z: 0.85 }; this.limitar(this.obj); if (this.alCambiarVista) this.alCambiarVista(false); } }
      if (this.ruta.length) {
        const [tx0, ty0] = posZona(this.ruta[0]), tx = tx0 - 100, ty = ty0 + 36, dx = tx - this.ex, dy = ty - this.ey, d = Math.hypot(dx, dy), v = 520 * dt;
        if (d <= v) { this.ex = tx; this.ey = ty; this.pos = this.ruta.shift(); EL.save.data.mapaPos = this.pos; EL.save.guardar(); if (!this.ruta.length) setTimeout(() => this.alElegir(this.pos), 150); }
        else { this.ex += dx / d * v; this.ey += dy / d * v; }
        if (!this.completa) { this.obj.x = this.ex + 100; this.obj.y = this.ey - 36; this.limitar(this.obj); }
      }
      const c = this.cam, o = this.obj, k = Math.min(1, dt * 5);
      c.z += (o.z - c.z) * k; c.x += (o.x - c.x) * k; c.y += (o.y - c.y) * k;
    }
    dibujar(x) {
      const t = this.t, c = this.cam;
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.imageSmoothingEnabled = true;
      x.fillStyle = '#2276b8'; x.fillRect(0, 0, 1280, 720);
      x.translate(640, 360); x.scale(c.z, c.z); x.translate(-c.x, -c.y);
      if (c.z < 0.95) { x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(14, 22, W, H); }
      x.drawImage(base, 0, 0);
      if (c.z < 0.95) { x.lineWidth = 10 / c.z * 0.5; x.strokeStyle = '#3b2716'; x.strokeRect(0, 0, W, H); }
      // fuegos de la Gritería
      { const [gx, gy] = posZona(6); for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i * 0.33) % 1; if (ph < 0.6) { const r = ph * 44, a = 1 - ph / 0.6; x.strokeStyle = `rgba(${['255,210,80', '255,130,170', '130,220,255'][i]},${a})`; x.lineWidth = 3; x.beginPath(); x.arc(gx - 32 + i * 32, gy - 60 - i * 6, r * 0.6, 0, 7); x.stroke(); } } }
      // carteles de madera con el nombre de cada zona
      EL.ZONAS.forEach((z, i) => {
        const [nx, ny] = posZona(i), hecha = this.hecha(i), hov = i === this.hover;
        const cerrada = !this.abierta(i);
        if (cerrada) {   // zona todavía bloqueada (versión final): se oscurece y lleva candado
          x.fillStyle = 'rgba(20,18,40,0.5)'; x.beginPath(); x.ellipse(nx, ny - 4, 84, 58, 0, 0, 7); x.fill();
          x.fillStyle = '#1b1222'; x.fillRect(nx - 17, ny - 22, 34, 28); x.fillStyle = '#f2c94c'; x.fillRect(nx - 14, ny - 19, 28, 22);
          x.lineWidth = 6; x.strokeStyle = '#1b1222'; x.beginPath(); x.arc(nx, ny - 24, 11, Math.PI, 0); x.stroke(); x.lineWidth = 3; x.strokeStyle = '#f2c94c'; x.beginPath(); x.arc(nx, ny - 24, 11, Math.PI, 0); x.stroke();
          x.fillStyle = '#1b1222'; x.fillRect(nx - 2, ny - 13, 4, 9);
        }
        x.font = '900 22px "Segoe UI Black", "Arial Black", sans-serif'; x.textAlign = 'center'; x.lineJoin = 'round';
        const w = x.measureText(z.nombre).width + 28, yy = ny + 74;
        x.fillStyle = '#3b2716'; x.fillRect(nx - w / 2 - 4, yy - 22, w + 8, 38);
        x.fillStyle = cerrada ? '#8a8494' : hov ? '#d9a35a' : '#b07a42'; x.fillRect(nx - w / 2, yy - 18, w, 30); x.fillStyle = 'rgba(255,255,255,0.25)'; x.fillRect(nx - w / 2, yy - 18, w, 4);
        x.lineWidth = 6; x.strokeStyle = '#1b1222'; x.strokeText(z.nombre, nx, yy + 6); x.fillStyle = '#fff'; x.fillText(z.nombre, nx, yy + 6);
        if (z.id === 'metapa') { x.font = '800 17px "Segoe UI", sans-serif'; const t2 = 'Origen de Rubén Darío', w2 = x.measureText(t2).width + 20; x.fillStyle = '#3b2716'; x.fillRect(nx - w2 / 2 - 3, yy + 16, w2 + 6, 28); x.fillStyle = '#7a4e2e'; x.fillRect(nx - w2 / 2, yy + 19, w2, 22); x.lineWidth = 4; x.strokeStyle = '#1b1222'; x.strokeText(t2, nx, yy + 36); x.fillStyle = '#ffe9a8'; x.fillText(t2, nx, yy + 36); x.font = '900 22px "Segoe UI Black", "Arial Black", sans-serif'; }
        if (hecha) { const bx = nx + w / 2 + 18; x.fillStyle = '#1b1222'; x.beginPath(); x.arc(bx, yy - 2, 16, 0, 7); x.fill(); x.fillStyle = '#4f9d1f'; x.beginPath(); x.arc(bx, yy - 2, 12, 0, 7); x.fill(); x.fillStyle = '#fff'; x.font = '900 18px sans-serif'; x.fillText('✓', bx, yy + 4); }
        x.textAlign = 'left';
      });
      // explorador (vista aérea) caminando por el mapa
      const s = EL.sprite('exploradorAereo'), bob = this.ruta.length ? Math.round(Math.sin(t * 16)) * 2 : 0; x.imageSmoothingEnabled = false;
      x.fillStyle = 'rgba(0,0,0,0.3)'; x.beginPath(); x.ellipse(this.ex, this.ey + 4, 18, 6, 0, 0, 7); x.fill();
      x.drawImage(s, Math.round(this.ex - s.width * 1.5), Math.round(this.ey - s.height * 3 + bob), s.width * 3, s.height * 3);
      // flecha a la siguiente zona
      const sig = EL.progreso ? EL.progreso.siguienteZona() : 0;
      if (!this.ruta.length) { const [nx, ny] = posZona(sig), yy = ny - 64 + Math.sin(t * 5) * 6; x.fillStyle = '#1b1222'; x.beginPath(); x.moveTo(nx - 20, yy - 4); x.lineTo(nx + 20, yy - 4); x.lineTo(nx, yy + 24); x.fill(); x.fillStyle = '#ff5a3a'; x.beginPath(); x.moveTo(nx - 14, yy); x.lineTo(nx + 14, yy); x.lineTo(nx, yy + 18); x.fill(); x.fillRect(nx - 6, yy - 24, 12, 24); }
      x.restore();
    }
  }
  EL.Mapa = Mapa;
})();
