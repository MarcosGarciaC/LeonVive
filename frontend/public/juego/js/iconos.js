/* eslint-disable */
/* Ecos de León · imágenes del álbum (memoria) y escenas del poema (rompecabezas) */
'use strict';
(function () {
  const P = EL.px;
  function contorno(c, col = '#1b1222') {
    const x = c.x, w = c.width, h = c.height, d = x.getImageData(0, 0, w, h).data, o = x.createImageData(w, h);
    const a = (i, j) => i >= 0 && j >= 0 && i < w && j < h && d[(j * w + i) * 4 + 3] > 40;
    const [r, g, b] = EL.hex(col);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (!a(i, j) && (a(i - 1, j) || a(i + 1, j) || a(i, j - 1) || a(i, j + 1))) { const k = (j * w + i) * 4; o.data[k] = r; o.data[k + 1] = g; o.data[k + 2] = b; o.data[k + 3] = 255; }
    const t = EL.canvas(w, h); t.x.putImageData(o, 0, 0); x.drawImage(t, 0, 0);
  }
  EL.contorno = contorno;

  /* ---------- Iconos 32×32 ---------- */
  const I = {
    catedral(x) { P.rect(x, 4, 14, 24, 14, '#f4efe4'); P.rect(x, 4, 8, 6, 20, '#f4efe4'); P.rect(x, 22, 8, 6, 20, '#f4efe4'); P.ellipse(x, 7, 7, 3, 3, '#f4efe4'); P.ellipse(x, 25, 7, 3, 3, '#f4efe4'); P.ellipse(x, 16, 11, 5, 4, '#d8cfbd'); P.rect(x, 15, 4, 2, 4, '#c9a43e'); P.rect(x, 14, 20, 5, 8, '#7a5a3a'); P.rect(x, 26, 8, 2, 20, '#d8cfbd'); P.rect(x, 2, 28, 28, 2, '#a39b8f'); },
    ruinas(x) { P.rect(x, 3, 12, 26, 16, '#c48a5a'); for (let i = 3; i < 29; i += 4) P.rect(x, i, 9 + (i % 3), 4, 4, '#c48a5a'); P.rect(x, 12, 17, 8, 11, '#3c2a26'); P.ellipse(x, 16, 17, 4, 3, '#3c2a26'); P.rect(x, 3, 12, 2, 16, '#dba57a'); for (let j = 15; j < 27; j += 4) P.rect(x, 5, j, 6, 1, '#94603a'); P.rect(x, 2, 28, 28, 2, '#6fa84a'); },
    momotombo(x) { P.poly(x, [[2, 26], [14, 6], [18, 6], [30, 26]], '#7b6f86'); P.poly(x, [[17, 6], [18, 6], [30, 26], [22, 26]], '#5e536b'); P.circle(x, 20, 4, 3, '#eeeeee'); P.circle(x, 25, 2, 2, '#eeeeee'); P.rect(x, 0, 25, 32, 6, '#5ab0d8'); P.rect(x, 4, 27, 8, 1, '#a8e0f5'); },
    sutiabaIg(x) { P.rect(x, 4, 13, 24, 15, '#f6f1e6'); P.poly(x, [[5, 13], [16, 4], [27, 13]], '#f6f1e6'); P.rect(x, 13, 18, 6, 10, '#7a4e2e'); P.circle(x, 16, 10, 2, '#7a4e2e'); P.rect(x, 4, 13, 2, 15, '#d9cfba'); P.rect(x, 26, 13, 2, 15, '#d9cfba'); P.rect(x, 2, 28, 28, 2, '#b07a4a'); },
    cerronegro(x) { P.poly(x, [[1, 27], [12, 8], [20, 8], [31, 27]], '#2b2a33'); P.poly(x, [[19, 8], [20, 8], [31, 27], [24, 27]], '#17161c'); P.rect(x, 12, 8, 8, 2, '#6a5040'); P.line(x, 9, 18, 14, 22, '#ff7a1a'); P.rect(x, 0, 27, 32, 4, '#4f8a3a'); },
    mar(x) { P.rect(x, 0, 0, 32, 32, '#ffd9a8'); P.circle(x, 16, 13, 7, '#ffd34a'); P.rect(x, 0, 16, 32, 16, '#2f8fbf'); for (let j = 18; j < 30; j += 4) for (let i = (j % 8); i < 32; i += 8) P.rect(x, i, j, 5, 1, '#9fe0f5'); P.rect(x, 0, 28, 32, 4, '#efd690'); },
    farol(x) { P.rect(x, 15, 12, 3, 18, '#2a2230'); P.rect(x, 10, 2, 12, 2, '#2a2230'); P.rect(x, 11, 4, 10, 9, '#2a2230'); P.rect(x, 12, 5, 8, 7, '#ffd76a'); P.rect(x, 12, 5, 3, 3, '#fff3b0'); P.rect(x, 11, 29, 11, 2, '#2a2230'); },
    tamarindo(x) { P.rect(x, 13, 16, 6, 14, '#5a3a22'); P.circle(x, 9, 13, 7, '#2f6b2a'); P.circle(x, 23, 13, 7, '#2f6b2a'); P.circle(x, 16, 9, 9, '#4a8f3a'); P.circle(x, 13, 6, 3, '#6db24e'); P.rect(x, 2, 29, 28, 2, '#6fa84a'); },
    gigantona(x) { P.rect(x, 9, 3, 14, 4, '#f2c94c'); P.rect(x, 15, 1, 2, 2, '#d63a5a'); P.rect(x, 7, 7, 18, 18, '#f2d16b'); P.rect(x, 9, 8, 14, 15, '#fbe9de'); P.rect(x, 11, 13, 2, 3, '#1e1420'); P.rect(x, 19, 13, 2, 3, '#1e1420'); P.rect(x, 10, 17, 2, 2, '#f29a9a'); P.rect(x, 20, 17, 2, 2, '#f29a9a'); P.rect(x, 14, 19, 4, 2, '#d0283c'); P.rect(x, 9, 25, 14, 6, '#e94f64'); },
    cabezon(x) { P.rect(x, 7, 2, 18, 5, '#3b2a1e'); P.rect(x, 3, 7, 26, 2, '#24180f'); P.ellipse(x, 16, 17, 12, 9, '#f0c39a'); P.rect(x, 10, 13, 3, 3, '#1e1420'); P.rect(x, 19, 13, 3, 3, '#1e1420'); P.rect(x, 9, 20, 14, 2, '#3a2414'); P.rect(x, 14, 22, 4, 2, '#a8433a'); P.rect(x, 12, 27, 8, 4, '#2e8b57'); },
    altar(x) { P.rect(x, 2, 2, 28, 28, '#f9e7c0'); for (let i = 3; i < 29; i += 3) { P.rect(x, i, 2, 2, 2, ['#ff6b8a', '#ffd34a', '#ffffff'][i % 3]); } P.poly(x, [[16, 7], [9, 26], [23, 26]], '#5b8fd9'); P.poly(x, [[16, 10], [12, 26], [20, 26]], '#ffffff'); P.circle(x, 16, 8, 2, '#f0d0b0'); for (let i = 0; i < 5; i++) P.rect(x, 12 + i * 2, 4, 1, 1, '#ffd34a'); P.rect(x, 4, 18, 2, 8, '#fff6cf'); P.rect(x, 4, 16, 2, 2, '#ffb02a'); P.rect(x, 26, 18, 2, 8, '#fff6cf'); P.rect(x, 26, 16, 2, 2, '#ffb02a'); P.rect(x, 2, 26, 28, 4, '#c9a43e'); },
    cohete(x) { P.rect(x, 14, 8, 4, 14, '#e94f64'); P.poly(x, [[14, 8], [16, 3], [18, 8]], '#f2c94c'); P.rect(x, 15, 22, 2, 9, '#a8743e'); [[6, 6], [24, 5], [5, 16], [26, 15], [10, 2], [22, 12]].forEach(([a, b], i) => P.rect(x, a, b, 2, 2, ['#ffd34a', '#7fe0ff', '#ff8fb8'][i % 3])); },
    alfombra(x) { P.rect(x, 2, 6, 28, 20, '#e94f64'); P.rect(x, 4, 8, 24, 16, '#f2c94c'); P.rect(x, 7, 11, 18, 10, '#3f8ad8'); P.poly(x, [[16, 12], [20, 16], [16, 20], [12, 16]], '#ffffff'); for (let i = 5; i < 28; i += 4) { P.rect(x, i, 9, 2, 1, '#2e8b57'); P.rect(x, i, 22, 2, 1, '#2e8b57'); } },
    quesillo(x) { P.ellipse(x, 16, 18, 13, 9, '#f2deb0'); P.ellipse(x, 16, 16, 10, 5, '#ffffff'); P.rect(x, 9, 14, 3, 1, '#d98aa8'); P.rect(x, 15, 13, 3, 1, '#d98aa8'); P.rect(x, 20, 15, 3, 1, '#d98aa8'); P.rect(x, 8, 19, 16, 1, '#e8cf9a'); },
    cana(x) { [[8, '#7fbf4a'], [15, '#a8c84a'], [22, '#6fae3e']].forEach(([cx, c]) => { P.rect(x, cx, 3, 4, 27, c); for (let j = 7; j < 30; j += 6) P.rect(x, cx, j, 4, 1, '#3f6a2a'); P.rect(x, cx + 1, 3, 1, 27, EL.shade(c, 0.3)); }); P.line(x, 10, 3, 4, 0, '#4f9a3a'); },
    tambor(x) { P.rect(x, 5, 9, 22, 16, '#c8553d'); P.ellipse(x, 16, 9, 11, 4, '#f3e2bd'); P.ellipse(x, 16, 25, 11, 3, '#a8442e'); for (let i = 6; i < 27; i += 5) P.line(x, i, 11, i + 3, 24, '#f2c94c'); P.line(x, 22, 2, 27, 7, '#6b4226'); P.circle(x, 22, 2, 1, '#f2c94c'); },
    cisne(x) { P.rect(x, 0, 24, 32, 8, '#5ab0d8'); P.ellipse(x, 17, 21, 10, 5, '#ffffff'); P.rect(x, 9, 8, 3, 13, '#ffffff'); P.rect(x, 9, 6, 6, 3, '#ffffff'); P.rect(x, 15, 7, 3, 2, '#f28a1a'); P.rect(x, 11, 7, 1, 1, '#1e1420'); P.rect(x, 18, 19, 8, 2, '#e3e9f0'); },
    estrella(x) { P.poly(x, [[16, 1], [20, 11], [31, 12], [22, 19], [25, 30], [16, 24], [7, 30], [10, 19], [1, 12], [12, 11]], '#ffd34a'); P.poly(x, [[16, 6], [18, 12], [14, 12]], '#fff3b0'); },
    caracol(x) { P.ellipse(x, 16, 17, 13, 11, '#f2c4a8'); P.ellipse(x, 17, 17, 9, 8, '#e8a888'); P.ellipse(x, 18, 17, 5, 5, '#f2c4a8'); P.ellipse(x, 18, 17, 2, 2, '#c97a5a'); P.poly(x, [[3, 20], [0, 28], [10, 26]], '#e8a888'); },
    rosa(x) { P.rect(x, 15, 14, 2, 17, '#2f7a2a'); P.ellipse(x, 11, 21, 4, 2, '#4a9a3a'); P.ellipse(x, 21, 24, 4, 2, '#4a9a3a'); P.circle(x, 16, 9, 8, '#c0283c'); P.circle(x, 16, 8, 5, '#e94f64'); P.circle(x, 16, 7, 2, '#a01e30'); },
    pluma(x) { P.poly(x, [[26, 2], [10, 22], [13, 24]], '#ffffff'); P.poly(x, [[26, 2], [14, 15], [22, 12]], '#e3e9f0'); P.line(x, 26, 2, 9, 25, '#9aa6b8'); P.rect(x, 3, 22, 12, 9, '#2a2a4a'); P.rect(x, 5, 20, 8, 2, '#2a2a4a'); P.rect(x, 4, 23, 3, 2, '#5a5a8a'); },
    libro(x) { P.rect(x, 5, 3, 22, 27, '#2b5fd9'); P.rect(x, 5, 3, 3, 27, '#1c3f99'); P.rect(x, 10, 8, 14, 5, '#ffd34a'); P.rect(x, 11, 9, 2, 3, '#2b5fd9'); P.rect(x, 15, 9, 2, 3, '#2b5fd9'); P.rect(x, 19, 9, 2, 3, '#2b5fd9'); P.rect(x, 10, 18, 14, 1, '#7f9ff0'); P.rect(x, 10, 21, 10, 1, '#7f9ff0'); P.rect(x, 27, 4, 1, 25, '#f7f2dc'); },
    corona(x) { P.poly(x, [[3, 25], [3, 9], [9, 16], [16, 5], [23, 16], [29, 9], [29, 25]], '#f2c94c'); P.rect(x, 3, 22, 26, 3, '#c79a14'); P.circle(x, 16, 16, 2, '#d63a5a'); P.circle(x, 9, 19, 1, '#3fae7a'); P.circle(x, 23, 19, 1, '#3f8ad8'); P.rect(x, 15, 4, 2, 2, '#fff3b0'); },
    elefante(x) { P.ellipse(x, 15, 17, 11, 8, '#9aa0ad'); P.ellipse(x, 25, 13, 6, 6, '#9aa0ad'); P.rect(x, 28, 15, 3, 12, '#9aa0ad'); P.ellipse(x, 21, 13, 3, 5, '#80869a'); P.rect(x, 26, 11, 1, 2, '#1e1420'); [6, 11, 17, 21].forEach(i => P.rect(x, i, 22, 4, 8, '#80869a')); P.rect(x, 3, 14, 2, 4, '#80869a'); P.rect(x, 9, 8, 12, 4, '#d63a5a'); P.rect(x, 9, 8, 12, 1, '#f2c94c'); }
  };
  const cacheI = {};
  EL.iconoURL = function (id, escala = 3) {
    const k = id + escala; if (cacheI[k]) return cacheI[k];
    const c = EL.canvas(34, 34), t = EL.canvas(32, 32); I[id](t.x); c.x.drawImage(t, 1, 1); contorno(c);
    const big = EL.canvas(34 * escala, 34 * escala); big.x.drawImage(c, 0, 0, big.width, big.height);
    return (cacheI[k] = big.toDataURL());
  };
  EL.ICONOS = I;

  /* ---------- Escenas lisas (ilustración suave 480×480) de «A Margarita Debayle» ---------- */
  const T = '#2a1a2e';
  function trazo(x, w = 4) { x.lineWidth = w; x.strokeStyle = T; x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke(); }
  function gradV(x, y0, y1, cols) { const g = x.createLinearGradient(0, y0, 0, y1); cols.forEach((c, i) => g.addColorStop(i / (cols.length - 1), c)); return g; }
  function estrellaV(x, cx, cy, r, col = '#ffe14a', brillo = true) {
    if (brillo) { const g = x.createRadialGradient(cx, cy, 2, cx, cy, r * 2.6); g.addColorStop(0, 'rgba(255,246,176,0.75)'); g.addColorStop(1, 'rgba(255,246,176,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r * 2.6, 0, 7); x.fill(); }
    x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; x[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fillStyle = col; x.fill(); trazo(x, 3);
  }
  /* Margarita (o la princesa) en estilo de cuento: h = alto total */
  function nina(x, cx, base, h, o = {}) {
    const k = h / 300, vest = o.vestido || '#8ec9f0', vestS = o.vestidoS || '#5fa3d4';
    x.save(); x.translate(cx, base); x.scale(k, k);
    // piernas y zapatos
    x.fillStyle = '#fff'; x.fillRect(-26, -70, 16, 56); x.fillRect(10, -70, 16, 56); x.beginPath(); x.rect(-26, -70, 16, 56); x.rect(10, -70, 16, 56); trazo(x, 4);
    x.fillStyle = '#2a2a3a'; x.beginPath(); x.ellipse(-20, -10, 18, 10, 0, 0, 7); x.ellipse(18, -10, 18, 10, 0, 0, 7); x.fill(); trazo(x, 4);
    // manto opcional
    if (o.manto) { x.fillStyle = o.manto; x.beginPath(); x.moveTo(-50, -200); x.quadraticCurveTo(-110, -60, -90, -50); x.lineTo(90, -50); x.quadraticCurveTo(110, -60, 50, -200); x.closePath(); x.fill(); trazo(x, 4); }
    // vestido
    x.fillStyle = vest; x.beginPath(); x.moveTo(-34, -190); x.lineTo(34, -190); x.lineTo(80, -66); x.quadraticCurveTo(0, -50, -80, -66); x.closePath(); x.fill(); trazo(x, 5);
    x.fillStyle = vestS; x.beginPath(); x.moveTo(20, -190); x.lineTo(34, -190); x.lineTo(80, -66); x.quadraticCurveTo(60, -62, 46, -60); x.closePath(); x.fill();
    x.fillStyle = '#fff'; for (let i = -72; i <= 64; i += 18) { x.beginPath(); x.arc(i + 8, -64, 9, 0, Math.PI); x.fill(); }
    // brazos
    x.fillStyle = '#f7d6bd'; x.beginPath(); x.ellipse(-46, -150, 12, 34, 0.35, 0, 7); x.fill(); trazo(x, 4); x.beginPath(); x.ellipse(46, -150, 12, 34, -0.35, 0, 7); x.fill(); trazo(x, 4);
    // cabello (detrás), cara y flequillo
    x.fillStyle = o.pelo || '#f6d36a'; x.beginPath(); x.ellipse(0, -232, 62, 66, 0, 0, 7); x.fill(); trazo(x, 5);
    x.beginPath(); x.moveTo(-58, -232); x.quadraticCurveTo(-70, -150, -40, -176); x.lineTo(40, -176); x.quadraticCurveTo(70, -150, 58, -232); x.closePath(); x.fill(); trazo(x, 4);
    x.fillStyle = '#f7d6bd'; x.beginPath(); x.ellipse(0, -222, 46, 48, 0, 0, 7); x.fill(); trazo(x, 5);
    x.fillStyle = o.pelo || '#f6d36a'; x.beginPath(); x.moveTo(-48, -236); x.quadraticCurveTo(-20, -290, 30, -276); x.quadraticCurveTo(54, -262, 48, -230); x.quadraticCurveTo(10, -256, -48, -236); x.fill(); trazo(x, 4);
    x.fillStyle = T; x.beginPath(); x.ellipse(-16, -218, 5, 8, 0, 0, 7); x.ellipse(16, -218, 5, 8, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(240,120,130,0.55)'; x.beginPath(); x.ellipse(-28, -200, 9, 6, 0, 0, 7); x.ellipse(28, -200, 9, 6, 0, 0, 7); x.fill();
    x.beginPath(); x.arc(0, -198, 10, 0.2, Math.PI - 0.2); x.lineWidth = 3; x.strokeStyle = '#b0405a'; x.stroke();
    // lazo o corona
    if (o.corona) { x.fillStyle = '#ffd84a'; x.beginPath(); x.moveTo(-30, -272); x.lineTo(-30, -300); x.lineTo(-15, -284); x.lineTo(0, -306); x.lineTo(15, -284); x.lineTo(30, -300); x.lineTo(30, -272); x.closePath(); x.fill(); trazo(x, 4); }
    else { x.fillStyle = '#ff8fb8'; x.beginPath(); x.ellipse(-16, -282, 18, 11, -0.4, 0, 7); x.fill(); trazo(x, 4); x.beginPath(); x.ellipse(16, -282, 18, 11, 0.4, 0, 7); x.fill(); trazo(x, 4); x.beginPath(); x.arc(0, -282, 7, 0, 7); x.fill(); trazo(x, 3); }
    if (o.broche !== false) estrellaV(x, 0, -172, 12, '#ffd84a', false);
    x.restore();
  }
  function elefanteV(x, cx, base, k = 1) {
    x.save(); x.translate(cx, base); x.scale(k, k);
    x.fillStyle = '#9aa0ad'; [-34, -14, 12, 32].forEach(i => { x.beginPath(); x.rect(i - 8, -36, 16, 36); x.fill(); trazo(x, 3); });
    x.beginPath(); x.ellipse(0, -52, 50, 30, 0, 0, 7); x.fill(); trazo(x, 4);
    x.fillStyle = '#d63a5a'; x.beginPath(); x.ellipse(0, -66, 30, 16, 0, Math.PI, 0); x.fill(); trazo(x, 3); x.fillStyle = '#f2c94c'; x.fillRect(-30, -68, 60, 5);
    x.fillStyle = '#9aa0ad'; x.beginPath(); x.arc(48, -64, 22, 0, 7); x.fill(); trazo(x, 4);
    x.fillStyle = '#80869a'; x.beginPath(); x.ellipse(36, -62, 12, 18, 0.2, 0, 7); x.fill(); trazo(x, 3);
    x.beginPath(); x.moveTo(64, -60); x.quadraticCurveTo(84, -40, 74, -14); x.lineWidth = 11; x.strokeStyle = '#9aa0ad'; x.stroke(); x.lineWidth = 3; x.strokeStyle = T; x.beginPath(); x.moveTo(60, -54); x.quadraticCurveTo(78, -38, 68, -14); x.stroke();
    x.fillStyle = T; x.beginPath(); x.arc(54, -70, 3, 0, 7); x.fill();
    x.restore();
  }
  const E = {
    mar(x) {
      x.fillStyle = gradV(x, 0, 300, ['#1a2156', '#3b3d84', '#8a6aa8']); x.fillRect(0, 0, 480, 300);
      for (let i = 0; i < 60; i++) { x.fillStyle = 'rgba(255,255,255,' + (0.4 + (i % 3) * 0.2) + ')'; x.beginPath(); x.arc((i * 97) % 480, (i * 53) % 230, 1.5 + (i % 2), 0, 7); x.fill(); }
      const gl = x.createRadialGradient(360, 90, 10, 360, 90, 110); gl.addColorStop(0, 'rgba(255,244,207,0.6)'); gl.addColorStop(1, 'rgba(255,244,207,0)'); x.fillStyle = gl; x.fillRect(240, 0, 240, 220);
      x.fillStyle = '#fff4cf'; x.beginPath(); x.arc(360, 90, 36, 0, 7); x.fill(); trazo(x, 3);
      x.fillStyle = gradV(x, 280, 400, ['#2a4f9a', '#1f3d7a']); x.fillRect(0, 280, 480, 120);
      for (let i = 0; i < 14; i++) { x.fillStyle = 'rgba(255,244,207,' + (0.7 - i * 0.04) + ')'; x.fillRect(340 - i * 2, 286 + i * 8, 40 + i * 4, 3); }
      x.strokeStyle = 'rgba(160,190,255,0.6)'; x.lineWidth = 3; for (let i = 0; i < 12; i++) { x.beginPath(); x.arc((i * 83) % 460, 300 + (i * 29) % 90, 14, 0.3, 2.8); x.stroke(); }
      x.fillStyle = '#ecd9a6'; x.beginPath(); x.moveTo(0, 390); x.quadraticCurveTo(240, 360, 480, 392); x.lineTo(480, 480); x.lineTo(0, 480); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, 390); x.quadraticCurveTo(240, 360, 480, 392); x.stroke();
      x.fillStyle = '#f2c4a8'; x.beginPath(); x.moveTo(400, 450); x.quadraticCurveTo(430, 410, 450, 450); x.closePath(); x.fill(); trazo(x, 3);
      nina(x, 170, 468, 250);
    },
    palacio(x) {
      x.fillStyle = gradV(x, 0, 330, ['#7ec8f0', '#cfeefa', '#fff1c8']); x.fillRect(0, 0, 480, 330);
      x.fillStyle = '#fff3b0'; x.beginPath(); x.arc(70, 70, 34, 0, 7); x.fill(); trazo(x, 3);
      x.fillStyle = '#8acb5a'; x.beginPath(); x.moveTo(0, 320); x.quadraticCurveTo(240, 290, 480, 320); x.lineTo(480, 480); x.lineTo(0, 480); x.fill(); trazo(x, 4);
      const d = ['#bff3ff', '#8fe0f5', '#e6fbff', '#6fcbe8'];
      x.fillStyle = d[0]; x.beginPath(); x.rect(150, 150, 180, 160); x.fill(); trazo(x, 5);
      for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) { x.fillStyle = d[(i + j) % 4]; const px = 165 + i * 28, py = 168 + j * 28; x.beginPath(); x.moveTo(px, py + 12); x.lineTo(px + 12, py); x.lineTo(px + 24, py + 12); x.lineTo(px + 12, py + 24); x.closePath(); x.fill(); x.lineWidth = 1.5; x.strokeStyle = '#4aa8c8'; x.stroke(); }
      [[140, 90], [300, 90], [222, 60]].forEach(([tx, h]) => { x.fillStyle = d[1]; x.beginPath(); x.rect(tx, 150 - h, 40, h); x.fill(); trazo(x, 4); x.fillStyle = d[3]; x.beginPath(); x.moveTo(tx - 6, 150 - h); x.lineTo(tx + 20, 150 - h - 44); x.lineTo(tx + 46, 150 - h); x.closePath(); x.fill(); trazo(x, 4); estrellaV(x, tx + 20, 150 - h - 54, 8, '#ffd84a', false); });
      x.fillStyle = '#5a7ab0'; x.beginPath(); x.moveTo(222, 310); x.lineTo(222, 262); x.arc(240, 262, 18, Math.PI, 0); x.lineTo(258, 310); x.fill(); trazo(x, 4);
      x.fillStyle = '#ffe27a'; x.beginPath(); x.moveTo(360, 320); x.lineTo(410, 236); x.lineTo(460, 320); x.closePath(); x.fill(); trazo(x, 4); x.fillStyle = '#f2c230'; x.beginPath(); x.moveTo(410, 236); x.lineTo(460, 320); x.lineTo(430, 320); x.closePath(); x.fill();
      elefanteV(x, 70, 420, 0.9); elefanteV(x, 200, 456, 1.05); elefanteV(x, 340, 440, 0.95);
    },
    kiosko(x) {
      x.fillStyle = gradV(x, 0, 340, ['#a7dcf5', '#e2f4fb', '#ffe7c8']); x.fillRect(0, 0, 480, 340);
      x.fillStyle = '#7fc85a'; x.fillRect(0, 340, 480, 140); x.beginPath(); x.moveTo(0, 340); x.lineTo(480, 340); trazo(x, 4);
      for (let i = 0; i < 30; i++) { x.fillStyle = ['#ff8fb8', '#ffffff', '#ffd34a'][i % 3]; x.beginPath(); x.arc((i * 61) % 470 + 6, 360 + (i * 37) % 110, 6, 0, 7); x.fill(); }
      const v = '#3fae7a', vs = '#2a8059';
      x.fillStyle = vs; x.beginPath(); x.rect(90, 340, 300, 16); x.fill(); trazo(x, 4);
      [110, 190, 270, 350].forEach(px => { x.fillStyle = v; x.beginPath(); x.rect(px, 170, 20, 170); x.fill(); trazo(x, 4); });
      x.fillStyle = v; x.beginPath(); x.moveTo(70, 176); x.quadraticCurveTo(240, 40, 410, 176); x.closePath(); x.fill(); trazo(x, 5);
      x.fillStyle = '#9be0be'; for (let i = 80; i < 400; i += 22) { x.beginPath(); x.arc(i + 10, 178, 10, 0, Math.PI); x.fill(); }
      estrellaV(x, 240, 66, 14, '#ffd84a', false);
      nina(x, 240, 340, 210, { manto: '#e8e4f4', vestido: '#d8c8f0', vestidoS: '#ad97d6', corona: true });
    },
    estrella(x) {
      x.fillStyle = gradV(x, 0, 480, ['#2a2468', '#7a4f9f', '#f29a7a']); x.fillRect(0, 0, 480, 480);
      for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(255,255,255,0.7)'; x.beginPath(); x.arc((i * 89) % 480, (i * 41) % 260, 1.6, 0, 7); x.fill(); }
      estrellaV(x, 350, 100, 30, '#fff6b0');
      x.fillStyle = '#e9dcc8'; x.beginPath(); x.rect(0, 280, 230, 200); x.fill(); trazo(x, 5);
      x.fillStyle = '#5a4a7a'; [20, 90, 160].forEach(px => { x.beginPath(); x.moveTo(px, 380); x.lineTo(px, 320); x.arc(px + 22, 320, 22, Math.PI, 0); x.lineTo(px + 44, 380); x.fill(); trazo(x, 4); });
      nina(x, 190, 416, 200, { corona: true });
      x.fillStyle = '#c9a43e'; x.beginPath(); x.rect(0, 390, 270, 16); x.fill(); trazo(x, 4); for (let i = 8; i < 270; i += 22) { x.beginPath(); x.rect(i, 406, 8, 44); x.fill(); trazo(x, 3); } x.beginPath(); x.rect(0, 446, 270, 14); x.fill(); trazo(x, 4);
      x.fillStyle = '#2a3f7a'; x.fillRect(270, 420, 210, 60);
    },
    camino(x) {
      x.fillStyle = gradV(x, 0, 300, ['#14184a', '#2e3a8a', '#5a6ac8']); x.fillRect(0, 0, 480, 300);
      for (let i = 0; i < 70; i++) { x.fillStyle = 'rgba(220,230,255,0.75)'; x.beginPath(); x.arc((i * 71) % 480, (i * 37) % 280, 1.4, 0, 7); x.fill(); }
      x.fillStyle = gradV(x, 290, 480, ['#1f3f86', '#142a5a']); x.fillRect(0, 290, 480, 190);
      x.strokeStyle = 'rgba(160,190,255,0.5)'; x.lineWidth = 3; for (let i = 0; i < 16; i++) { x.beginPath(); x.arc((i * 61) % 470, 310 + (i * 23) % 160, 12, 0.3, 2.8); x.stroke(); }
      x.strokeStyle = 'rgba(255,246,176,0.85)'; x.lineWidth = 10; x.setLineDash([16, 12]); x.beginPath(); x.moveTo(40, 470); x.quadraticCurveTo(240, 300, 400, 80); x.stroke(); x.setLineDash([]);
      estrellaV(x, 400, 70, 26, '#ffffff');
      nina(x, 210, 330, 170);
    },
    prendedor(x) {
      const g = x.createRadialGradient(240, 220, 40, 240, 240, 320); g.addColorStop(0, '#fff4e0'); g.addColorStop(1, '#ffd0dc'); x.fillStyle = g; x.fillRect(0, 0, 480, 480);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; x.fillStyle = ['#ff8fb8', '#ffffff', '#ffd34a'][i % 3]; x.beginPath(); x.arc(240 + Math.cos(a) * 210, 240 + Math.sin(a) * 210, 16, 0, 7); x.fill(); trazo(x, 2); }
      nina(x, 240, 520, 470, { corona: true, broche: false });
      estrellaV(x, 240, 520 - 172 * 470 / 300, 22, '#ffe14a');
      // verso, perla, pluma y flor alrededor
      x.fillStyle = '#fff8e6'; x.beginPath(); x.rect(40, 60, 90, 64); x.fill(); trazo(x, 4); x.strokeStyle = '#8e879a'; x.lineWidth = 3; [80, 94, 108].forEach(y => { x.beginPath(); x.moveTo(52, y); x.lineTo(118, y); x.stroke(); });
      x.fillStyle = '#f4f1ec'; x.beginPath(); x.arc(400, 380, 24, 0, 7); x.fill(); trazo(x, 4); x.fillStyle = '#fff'; x.beginPath(); x.arc(392, 372, 8, 0, 7); x.fill();
      x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(420, 50); x.quadraticCurveTo(380, 110, 360, 160); x.quadraticCurveTo(400, 120, 420, 50); x.fill(); trazo(x, 3);
      x.fillStyle = '#e94f64'; x.beginPath(); x.arc(80, 380, 24, 0, 7); x.fill(); trazo(x, 4); x.fillStyle = '#c0283c'; x.beginPath(); x.arc(80, 380, 11, 0, 7); x.fill(); x.strokeStyle = '#2f7a2a'; x.lineWidth = 6; x.beginPath(); x.moveTo(80, 404); x.lineTo(84, 450); x.stroke();
    }
  };
  const cacheE = {};
  EL.escenaCanvas = function (id) {
    if (cacheE[id]) return cacheE[id];
    const c = EL.canvas(480, 480); c.x.imageSmoothingEnabled = true; E[id](c.x); return (cacheE[id] = c);
  };
  EL.escenaURL = function (id, escala = 3) { const s = EL.escenaCanvas(id), n = Math.round(160 * escala); if (n === 480) return s.toDataURL(); const c = EL.canvas(n, n); c.x.imageSmoothingEnabled = true; c.x.drawImage(s, 0, 0, n, n); return c.toDataURL(); };
})();
