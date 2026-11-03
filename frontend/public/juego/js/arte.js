/* eslint-disable */
/* Ecos de León · escenarios 2D por zona (fondos en capas, bloques, objetos)
   Todo se dibuja en código a 640×360 y se amplía sin suavizado: aspecto pixel art. */
'use strict';
(function () {
  const P = EL.px;
  const W = 960, H = 360; // capas de paralaje que se repiten

  /* ---------- Pinceles reutilizables ---------- */
  const B = {
    nube(x, cx, cy, s = 1, col = '#ffffff', sh = '#dbe8f2') {
      P.ellipse(x, cx, cy + 3 * s, 22 * s, 6 * s, sh);
      P.circle(x, cx - 12 * s, cy, 8 * s, col); P.circle(x, cx + 2 * s, cy - 5 * s, 11 * s, col); P.circle(x, cx + 15 * s, cy, 7 * s, col);
      P.rect(x, cx - 20 * s, cy, 42 * s, 6 * s, col);
    },
    volcan(x, cx, base, w, h, c, cs, humo = true, crater = '#5b4a44') {
      P.poly(x, [[cx - w / 2, base], [cx - 7, base - h], [cx + 7, base - h], [cx + w / 2, base]], c);
      P.poly(x, [[cx + 2, base - h], [cx + 7, base - h], [cx + w / 2, base], [cx + w / 6, base]], cs);
      P.rect(x, cx - 7, base - h, 14, 2, crater);
      for (let i = 0; i < 6; i++) P.line(x, cx - 3 + i * 2, base - h + 4, cx - w / 4 + i * w / 10, base - h / 3, cs);
      if (humo) { P.circle(x, cx + 2, base - h - 8, 6, '#e9e4e0'); P.circle(x, cx + 10, base - h - 16, 8, '#f2eeea'); P.circle(x, cx + 22, base - h - 22, 7, '#e9e4e0'); }
    },
    colinas(x, base, amp, per, fase, col, y0 = 0) {
      x.fillStyle = col;
      for (let i = 0; i < W; i++) {
        const y = base - amp * (0.6 * Math.sin((i + fase) / per) + 0.4 * Math.sin((i + fase * 1.7) / (per * 0.43)));
        x.fillRect(i, Math.round(y), 1, H - Math.round(y) + y0);
      }
    },
    arbol(x, cx, base, r, hoja, hojaS, tronco = '#6b4226') {
      P.rect(x, cx - 2, base - r * 1.6, 5, r * 1.6, tronco); P.rect(x, cx + 1, base - r * 1.6, 2, r * 1.6, EL.shade(tronco, -0.3));
      P.circle(x, cx, base - r * 2, r, hojaS); P.circle(x, cx - r * 0.6, base - r * 1.9, r * 0.7, hojaS);
      P.circle(x, cx - 1, base - r * 2.1, r - 2, hoja); P.circle(x, cx - r * 0.6, base - r * 2, r * 0.6 - 1, hoja); P.circle(x, cx + r * 0.6, base - r * 1.8, r * 0.6, hojaS);
      P.circle(x, cx - r * 0.3, base - r * 2.4, r * 0.35, EL.shade(hoja, 0.25));
    },
    palmera(x, cx, base, h, hoja = '#3f9a3a', tronco = '#8a6a3e') {
      for (let i = 0; i < h; i++) P.rect(x, cx + Math.round(Math.sin(i / h * 1.6) * 6), base - i, 4, 1, i % 4 === 0 ? EL.shade(tronco, -0.25) : tronco);
      const tx = cx + Math.round(Math.sin(1.6) * 6) + 2, ty = base - h;
      [[-18, 6], [18, 6], [-12, 10], [14, 11], [-4, -6], [8, -5]].forEach(([dx, dy]) => { P.line(x, tx, ty, tx + dx, ty + dy, hoja); P.line(x, tx, ty + 1, tx + dx, ty + dy + 1, EL.shade(hoja, -0.25)); });
      P.circle(x, tx, ty + 2, 2, '#6b4a1e');
    },
    casa(x, X, base, w, h, pared, techo = '#a9442e', puerta = '#5a3a22') {
      P.rect(x, X, base - h, w, h, pared); P.rect(x, X + w - 3, base - h, 3, h, EL.shade(pared, -0.12));
      P.poly(x, [[X - 4, base - h], [X + w / 2, base - h - 10], [X + w + 4, base - h]], techo);
      for (let i = X - 3; i < X + w + 3; i += 3) P.rect(x, i, base - h - 2, 1, 2, EL.shade(techo, -0.25));
      P.rect(x, X - 4, base - h, w + 8, 2, EL.shade(techo, -0.3));
      P.rect(x, X + Math.floor(w / 2) - 4, base - 14, 9, 14, puerta); P.rect(x, X + Math.floor(w / 2), base - 14, 1, 14, EL.shade(puerta, -0.3));
      if (w > 30) { [X + 5, X + w - 13].forEach(wx => { P.rect(x, wx, base - h + 8, 8, 9, '#3a2a22'); for (let i = 0; i < 4; i++) P.rect(x, wx + 1 + i * 2, base - h + 8, 1, 9, '#c9b48a'); }); }
      P.rect(x, X, base - 3, w, 3, EL.shade(pared, -0.2));
    },
    farol(x, cx, base, alto = 34, luz = true) {
      P.rect(x, cx, base - alto, 2, alto, '#2a2230'); P.rect(x, cx - 3, base - alto - 1, 8, 2, '#2a2230');
      P.rect(x, cx - 3, base - alto - 10, 8, 9, '#2a2230'); P.rect(x, cx - 2, base - alto - 9, 6, 7, luz ? '#ffd76a' : '#7a6a4a');
      if (luz) { x.fillStyle = 'rgba(255,215,106,0.18)'; P.circle(x, cx + 1, base - alto - 5, 14, 'rgba(255,215,106,0.16)'); }
    },
    farolColgante(x, cx, cy) {
      P.rect(x, cx, cy - 4, 1, 4, '#3a2a22'); P.rect(x, cx - 3, cy, 7, 2, '#5a3a22');
      P.rect(x, cx - 3, cy + 2, 7, 8, '#ffcf5a'); P.rect(x, cx - 2, cy + 3, 5, 6, '#fff0a8'); P.rect(x, cx - 3, cy + 10, 7, 2, '#5a3a22');
      P.circle(x, cx, cy + 6, 11, 'rgba(255,207,90,0.12)');
    },
    cuerdaFaroles(x, x0, x1, y, caida, n) {
      for (let i = 0; i <= 60; i++) { const t = i / 60, xx = x0 + (x1 - x0) * t, yy = y + Math.sin(t * Math.PI) * caida; P.rect(x, xx, yy, 2, 1, '#3a2a22'); }
      for (let k = 1; k <= n; k++) { const t = k / (n + 1); B.farolColgante(x, Math.round(x0 + (x1 - x0) * t), Math.round(y + Math.sin(t * Math.PI) * caida) + 4); }
    },
    estrellas(x, n, h, rng) { for (let i = 0; i < n; i++) { const c = rng() > 0.8 ? '#fff6c8' : '#cfd8ff'; P.rect(x, rng() * W, rng() * h, 1, 1, c); if (rng() > 0.93) { const sx = rng() * W, sy = rng() * h; P.rect(x, sx - 1, sy, 3, 1, '#ffffff'); P.rect(x, sx, sy - 1, 1, 3, '#ffffff'); } } },
    banda(x, base, r, c, cs, sep = 14, rng) { for (let i = -10; i < W + 20; i += sep) { const rr = r + ((i * 37) % 7) - 3; P.circle(x, i, base - rr * 0.4 + 2, rr, cs); } for (let i = -4; i < W + 20; i += sep) { const rr = r + ((i * 53) % 6) - 4; P.circle(x, i, base - rr * 0.3, rr - 1, c); P.circle(x, i - 2, base - rr * 0.5, Math.max(2, rr / 3), EL.shade(c, 0.18)); } P.rect(x, 0, base, W, H - base, cs); },
    arbusto(x, cx, base, r, c, cs) { P.circle(x, cx, base - r + 2, r, cs); P.circle(x, cx - r * 0.6, base - r * 0.6, r * 0.7, c); P.circle(x, cx + r * 0.5, base - r * 0.7, r * 0.75, c); P.circle(x, cx, base - r, r * 0.6, EL.shade(c, 0.15)); }
  };

  /* Fachadas emblemáticas (simplificadas y respetuosas) */
  function catedral(x, cx, base, s = 1, muro = '#f4efe4', sombra = '#d8cfbd', luz = null) {
    const w = 150 * s, h = 70 * s, X = cx - w / 2;
    P.rect(x, X, base - h, w, h, muro);
    // torres
    [X, X + w - 30 * s].forEach(tx => {
      P.rect(x, tx, base - h - 34 * s, 30 * s, 34 * s, muro); P.rect(x, tx + 24 * s, base - h - 34 * s, 6 * s, 34 * s + h, sombra);
      P.rect(x, tx + 9 * s, base - h - 28 * s, 12 * s, 14 * s, '#6a5a4a'); P.ellipse(x, tx + 15 * s, base - h - 28 * s, 6 * s, 4 * s, '#6a5a4a');
      P.ellipse(x, tx + 15 * s, base - h - 38 * s, 14 * s, 9 * s, muro); P.rect(x, tx + 1, base - h - 38 * s, 28 * s, 4 * s, muro);
      P.rect(x, tx + 14 * s, base - h - 56 * s, 2 * s, 10 * s, '#c9a43e'); P.rect(x, tx + 11 * s, base - h - 52 * s, 8 * s, 2 * s, '#c9a43e');
    });
    // frontón y cúpula central
    P.poly(x, [[X + 32 * s, base - h], [cx, base - h - 26 * s], [X + w - 32 * s, base - h]], muro);
    P.ellipse(x, cx, base - h - 30 * s, 18 * s, 12 * s, sombra); P.ellipse(x, cx - 2, base - h - 31 * s, 15 * s, 10 * s, muro);
    P.rect(x, cx - 1, base - h - 48 * s, 3 * s, 10 * s, '#c9a43e'); P.rect(x, cx - 4 * s, base - h - 45 * s, 9 * s, 2 * s, '#c9a43e');
    // pilastras y puertas
    for (let i = 0; i < 7; i++) P.rect(x, X + 34 * s + i * 14 * s, base - h + 6 * s, 3 * s, h - 6 * s, sombra);
    [cx - 32 * s, cx - 6 * s, cx + 20 * s].forEach((dx, i) => { const dw = (i === 1 ? 14 : 10) * s, dh = (i === 1 ? 30 : 22) * s; P.rect(x, dx, base - dh, dw, dh, luz || '#6a4a32'); P.ellipse(x, dx + dw / 2, base - dh, dw / 2, 4 * s, luz || '#6a4a32'); });
    P.rect(x, X - 6, base - 4 * s, w + 12, 4 * s, sombra);
    // leones del frontón
    P.rect(x, cx - 8 * s, base - h - 6 * s, 4 * s, 4 * s, '#c9a43e'); P.rect(x, cx + 5 * s, base - h - 6 * s, 4 * s, 4 * s, '#c9a43e');
  }
  function iglesiaSutiaba(x, cx, base, s = 1) {
    const w = 120 * s, h = 64 * s, X = cx - w / 2, muro = '#f6f1e6', sm = '#d9cfba';
    P.rect(x, X, base - h, w, h, muro);
    P.poly(x, [[X + 10 * s, base - h], [cx, base - h - 30 * s], [X + w - 10 * s, base - h]], muro);
    P.poly(x, [[cx, base - h - 30 * s], [X + w - 10 * s, base - h], [cx + 10 * s, base - h]], sm);
    [X, X + 28 * s, X + w - 34 * s, X + w - 6 * s].forEach(bx => P.rect(x, bx, base - h, 6 * s, h, sm));
    P.rect(x, cx - 10 * s, base - 34 * s, 20 * s, 34 * s, '#7a4e2e'); P.ellipse(x, cx, base - 34 * s, 10 * s, 6 * s, '#7a4e2e');
    P.rect(x, cx - 1, base - 34 * s, 2, 34 * s, '#5a361e');
    P.ellipse(x, cx, base - h - 8 * s, 5 * s, 5 * s, '#7a4e2e');
    P.rect(x, X - 4, base - 4, w + 8, 4, sm);
    P.rect(x, X + w + 6 * s, base - 50 * s, 18 * s, 50 * s, muro); P.rect(x, X + w + 6 * s, base - 62 * s, 18 * s, 12 * s, sm);
    P.rect(x, X + w + 11 * s, base - 58 * s, 8 * s, 8 * s, '#6a4a32'); P.ellipse(x, X + w + 15 * s, base - 64 * s, 9 * s, 5 * s, '#c84a32');
  }
  function tamarindon(x, cx, base) {
    P.rect(x, cx - 6, base - 50, 12, 50, '#5a3a22'); P.rect(x, cx + 2, base - 50, 4, 50, '#3e2716');
    P.line(x, cx, base - 40, cx - 22, base - 58, '#5a3a22'); P.line(x, cx + 2, base - 44, cx + 24, base - 60, '#5a3a22');
    [[-30, -62, 20], [0, -78, 26], [28, -64, 20], [-14, -88, 16], [16, -88, 16]].forEach(([dx, dy, r]) => P.circle(x, cx + dx, base + dy + 2, r, '#2f6b2a'));
    [[-30, -64, 17], [0, -80, 23], [28, -66, 17], [-14, -90, 13], [16, -90, 13]].forEach(([dx, dy, r]) => P.circle(x, cx + dx, base + dy, r, '#4a8f3a'));
    [[-34, -70, 6], [-4, -90, 8], [24, -72, 6]].forEach(([dx, dy, r]) => P.circle(x, cx + dx, base + dy, r, '#6db24e'));
  }
  function ruinas(x, X, base, w, h) {
    const c = '#c48a5a', cs = '#94603a', cl = '#dba57a';
    P.rect(x, X, base - h, w, h, c);
    for (let i = 0; i < w; i += 6) P.rect(x, X + i, base - h - (i * 7 % 9), 6, (i * 7 % 9), c);
    P.rect(x, X + w - 4, base - h, 4, h, cs); P.rect(x, X, base - h, 3, h, cl);
    for (let j = base - h + 6; j < base - 4; j += 7) for (let i = X + ((j / 7) % 2) * 5; i < X + w - 6; i += 11) P.rect(x, i, j, 8, 1, cs);
    if (w > 40) { const ax = X + w / 2 - 9; P.rect(x, ax, base - h * 0.62, 18, h * 0.62, '#3c2a26'); P.ellipse(x, ax + 9, base - h * 0.62, 9, 6, '#3c2a26'); }
    P.rect(x, X + 4, base - h - 2, 6, 3, '#6fa84a');
  }

  /* ---------- Definición de zonas ---------- */
  const Z = {};
  Z.leonviejo = {
    cielo: ['#6ec2ee', '#b9e4f6', '#fbefc8'], suelo: { pasto: '#79c24c', pastoS: '#3f8a2e', tierra: '#9c6a3e', tierraS: '#6e4426', roca: '#b9a48a' },
    lejos(x, r) {
      B.nube(x, 120, 60, 1.2); B.nube(x, 480, 40, 0.9); B.nube(x, 800, 70, 1.1); B.nube(x, 650, 120, 0.7);
      B.colinas(x, 250, 10, 60, 0, '#9cc7c9');
      B.volcan(x, 300, 262, 300, 150, '#7b6f86', '#5e536b'); B.volcan(x, 760, 262, 200, 90, '#8a7f96', '#6e6380', false);
      P.rect(x, 0, 258, W, 30, '#5ab0d8'); for (let i = 0; i < 40; i++) P.rect(x, r() * W, 262 + r() * 22, 10 + r() * 20, 1, '#9fd8f0');
    },
    medio(x, r) { B.colinas(x, 268, 8, 40, 30, '#5f9e48'); B.banda(x, 292, 12, '#4f9a3a', '#2f6b2a'); ruinas(x, 90, 290, 70, 40); ruinas(x, 380, 290, 46, 28); ruinas(x, 640, 290, 90, 48); B.arbol(x, 270, 286, 16, '#4f9a3a', '#2f6b2a'); B.palmera(x, 560, 290, 50); B.arbol(x, 860, 290, 13, '#5aa63e', '#2f6b2a'); },
    cerca(x, r) { B.cuerdaFaroles(x, 40, 300, 30, 26, 4); B.cuerdaFaroles(x, 520, 820, 22, 30, 5); }
  };
  Z.metapa = {
    cielo: ['#8fd0f6', '#d6eefa', '#ffe0b5'], suelo: { pasto: '#7fcd52', pastoS: '#3f8f2e', tierra: '#a8703e', tierraS: '#734a26', roca: '#c2ad8c' },
    lejos(x, r) { B.nube(x, 200, 50, 1); B.nube(x, 640, 70, 1.3); B.nube(x, 420, 110, 0.7); B.colinas(x, 180, 40, 90, 200, '#a9cdb8'); P.circle(x, 820, 70, 16, '#fff3b0'); B.colinas(x, 210, 30, 70, 0, '#7fb59a'); B.colinas(x, 240, 26, 50, 90, '#5f9e70'); },
    medio(x, r) {
      B.colinas(x, 272, 10, 36, 10, '#4f9a44'); B.banda(x, 294, 11, '#5aa83e', '#2f7a2a', 13);
      B.casa(x, 70, 290, 46, 30, '#f2e6cf'); B.casa(x, 300, 290, 60, 34, '#f4ead6', '#b34a30', '#6a3c22'); // casa natal
      P.rect(x, 316, 246, 28, 5, '#e3cfa2'); P.rect(x, 320, 247, 20, 3, '#7a4e2e');
      B.casa(x, 600, 290, 40, 28, '#e9d8b8'); B.arbol(x, 200, 290, 15, '#58a83e', '#2f6b2a', '#5a3a22'); B.arbol(x, 480, 290, 18, '#4f9a3a', '#2f6b2a'); B.palmera(x, 760, 290, 54); B.arbol(x, 880, 290, 12, '#6ab84a', '#3f7f2e');
    },
    cerca(x, r) { for (let i = 0; i < 6; i++) { const cx = 60 + i * 160; P.rect(x, cx, 300, 2, 30, '#7a5a3a'); } B.cuerdaFaroles(x, 420, 700, 34, 22, 3); }
  };
  Z.sutiaba = {
    cielo: ['#f39a62', '#f7c98a', '#fde8b8'], suelo: { pasto: '#9bbd4a', pastoS: '#5f8a2e', tierra: '#b57446', tierraS: '#7e4c2a', roca: '#d0a87a' },
    lejos(x, r) { P.circle(x, 700, 150, 30, '#ffe9a8'); P.circle(x, 700, 150, 24, '#fff3c8'); B.nube(x, 180, 70, 1.1, '#ffe5cf', '#f2b98e'); B.nube(x, 520, 50, 0.8, '#ffe5cf', '#f2b98e'); B.colinas(x, 250, 14, 60, 40, '#c98a6a'); },
    medio(x, r) { B.colinas(x, 276, 6, 40, 20, '#7f9a4a'); B.banda(x, 296, 10, '#8aa84a', '#5f7a2e', 15); iglesiaSutiaba(x, 200, 292, 1.35); tamarindon(x, 520, 292); B.casa(x, 640, 290, 50, 30, '#e8c79a', '#a5442e'); B.casa(x, 720, 290, 44, 26, '#f0d9b5'); B.casa(x, 860, 290, 40, 30, '#e3b98a'); },
    cerca(x, r) { B.cuerdaFaroles(x, 0, 380, 26, 28, 5); for (let i = 0; i < 10; i++) P.rect(x, 600 + i * 34, 40 + (i % 2) * 6, 10, 6, ['#e94f64', '#f2c94c', '#3f8ad8', '#2e8b57'][i % 4]); }
  };
  Z.centro = {
    cielo: ['#2f2a68', '#7a4f8f', '#e58a66'], suelo: { pasto: '#a39b8f', pastoS: '#6e675d', tierra: '#857d72', tierraS: '#5e574e', roca: '#b8b0a2', adoquin: true },
    lejos(x, r) { B.estrellas(x, 50, 120, r); P.circle(x, 120, 70, 12, '#fff1c8'); B.colinas(x, 240, 10, 80, 0, '#5a4a7a'); },
    medio(x, r) { catedral(x, 330, 294, 1.5); B.casa(x, 10, 292, 80, 52, '#e7c27a'); B.casa(x, 580, 292, 70, 50, '#d6886a'); B.casa(x, 660, 292, 74, 56, '#9fc0c9'); B.casa(x, 820, 292, 84, 50, '#e9d29a'); B.farol(x, 120, 292, 30); B.farol(x, 600, 292, 30); B.farol(x, 900, 292, 30); },
    cerca(x, r) { B.cuerdaFaroles(x, 200, 480, 18, 20, 4); }
  };
  Z.callereal = {
    cielo: ['#0b1130', '#1c2756', '#33447a'], suelo: { pasto: '#6d6a78', pastoS: '#45424f', tierra: '#55525f', tierraS: '#3a3844', roca: '#7d7a88', adoquin: true },
    lejos(x, r) { B.estrellas(x, 160, 200, r); P.circle(x, 600, 70, 22, '#fff4cf'); P.circle(x, 592, 64, 6, '#efe2b8'); P.circle(x, 610, 78, 4, '#efe2b8'); B.colinas(x, 250, 12, 70, 0, '#202a4c'); },
    medio(x, r) {
      const cols = ['#c9775a', '#d9b56a', '#7aa0b0', '#c98aa0', '#9ab07a', '#d0a07a'];
      let X = 0; let i = 0; while (X < W) { const w = 54 + (i * 13 % 30); B.casa(x, X + 4, 294, w + 16, 62 + (i * 7 % 20), EL.shade(cols[i % cols.length], -0.22), '#6a2e24', '#2a1a14'); X += w + 26; i++; }
      for (let j = 0; j < 6; j++) B.farol(x, 70 + j * 160, 294, 50);
      x.fillStyle = 'rgba(255,215,106,0.07)'; for (let j = 0; j < 6; j++) P.circle(x, 71 + j * 160, 256, 30, 'rgba(255,215,106,0.06)');
    },
    cerca(x, r) { }
  };
  Z.poneloya = {
    cielo: ['#ff8f66', '#ffc48a', '#ffe9b5'], suelo: { pasto: '#efd690', pastoS: '#c7a865', tierra: '#e0c27e', tierraS: '#b8954e', roca: '#8d7a6a', arena: true },
    lejos(x, r) {
      P.circle(x, 480, 200, 34, '#ffd66e'); P.circle(x, 480, 200, 28, '#fff0a0');
      B.nube(x, 160, 80, 1.2, '#ffd9c2', '#f5a77e'); B.nube(x, 760, 60, 1, '#ffd9c2', '#f5a77e');
      P.rect(x, 0, 214, W, 80, '#2f8fbf'); for (let i = 0; i < 70; i++) P.rect(x, r() * W, 216 + r() * 70, 8 + r() * 20, 1, r() > 0.5 ? '#7fd0ee' : '#ffd38a');
      P.rect(x, 470, 216, 20, 70, 'rgba(255,220,120,0.25)');
    },
    medio(x, r) {
      P.poly(x, [[120, 290], [140, 240], [170, 230], [196, 252], [210, 290]], '#6e5c50'); P.poly(x, [[170, 230], [196, 252], [210, 290], [180, 290]], '#54453c');
      for (let i = 0; i < W; i += 9) { P.line(x, i, 296, i + 3, 284 - (i * 7 % 6), '#9aa84a'); P.line(x, i + 4, 296, i + 5, 288 - (i * 5 % 5), '#7f8a3a'); }
      B.palmera(x, 330, 292, 62); B.palmera(x, 360, 292, 46); B.palmera(x, 720, 292, 58); P.poly(x, [[820, 292], [840, 262], [880, 258], [900, 292]], '#6e5c50');
      for (let i = 0; i < 4; i++) { const cx = 520 + i * 40; P.rect(x, cx, 270, 26, 22, '#c9a06a'); P.poly(x, [[cx - 4, 270], [cx + 13, 256], [cx + 30, 270]], '#d9b26a'); }
    },
    cerca(x, r) { }
  };
  Z.griteria = {
    cielo: ['#0a0f2a', '#1a2454', '#3a3a78'], suelo: { pasto: '#8a8378', pastoS: '#5e574e', tierra: '#6e675d', tierraS: '#4a443c', roca: '#a39b8f', adoquin: true },
    lejos(x, r) { B.estrellas(x, 120, 200, r); }, medio(x, r) { catedral(x, 480, 300, 1.6, '#f6f0e2', '#cfc4ad', '#ffcf6a'); }, cerca(x, r) { B.cuerdaFaroles(x, 0, 960, 20, 40, 12); }
  };
  /* ---------- Escenarios en capas horizontales (atrás, medio y delante) ----------
     Cada escenario tiene: cielo con sol o luna, 4 planos de fondo que se mueven a distinta velocidad
     (lejos, lejos2, medio, cerca) y un plano delantero arriba. Todo se repite sin cortes cada 960 px
     y recibe textura, volumen y luz de borde en un acabado común. */
  const TAU = Math.PI * 2;
  const ciclo = (i, k, f) => Math.sin(TAU * i * k / W + f);
  const envolver = (cx, ancho, fn) => { fn(cx); if (cx - ancho < 0) fn(cx + W); if (cx + ancho > W) fn(cx - W); };
  const rgb = c => EL.hex(c);
  const M = {
    // relleno bajo un perfil
    perfil(x, ys, col) { x.fillStyle = col; for (let i = 0; i < W; i++) x.fillRect(i, ys[i], 1, H - ys[i]); },
    cordillera(x, r, o) {
      const f = [r() * 9, r() * 9, r() * 9, r() * 9], k = o.k || [2, 5, 13];
      const ys = []; for (let i = 0; i < W; i++) ys.push(Math.round(o.base - o.amp * (0.55 * Math.abs(ciclo(i, k[0], f[0])) + 0.3 * Math.abs(ciclo(i, k[1], f[1])) + 0.15 * Math.abs(ciclo(i, k[2], f[2])))));
      M.perfil(x, ys, o.col);
      if (o.vetas) for (let i = 0; i < W; i += 3) { const n = Math.abs(ciclo(i, 31, f[3])); if (n > 0.7) P.line(x, i, ys[i] + 2, i + (ys[(i + 6) % W] > ys[i] ? 6 : -6), ys[i] + 18 + n * 20, o.vetas); }
      return ys;
    },
    colinas(x, r, o) { const f = [r() * 9, r() * 9]; const ys = []; for (let i = 0; i < W; i++) ys.push(Math.round(o.base - o.amp * (0.6 * (ciclo(i, o.k || 3, f[0]) + 1) / 2 + 0.4 * (ciclo(i, (o.k || 3) * 2 + 1, f[1]) + 1) / 2))); M.perfil(x, ys, o.col); return ys; },
    volcan(x, cx, base, w, h, col, humo) {
      const cs = EL.shade(col, -0.18), cl = EL.shade(col, 0.12);
      envolver(cx, w, X => {
        const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20, xx = X - w / 2 + w * t, d = Math.abs(t - 0.5) * 2; pts.push([xx, base - h * (1 - Math.pow(d, 0.7)) * (d < 0.08 ? 0.94 : 1)]); }
        pts.push([X + w / 2, H]); pts.push([X - w / 2, H]); P.poly(x, pts, col);
        P.poly(x, [[X + 3, base - h * 0.95], [X + w / 2, base], [X + w / 2, H], [X + w * 0.1, H]], cs);
        for (let g = -3; g <= 3; g++) P.line(x, X + g * 4, base - h * 0.9, X + g * w * 0.09, base - h * 0.25, g > 0 ? EL.shade(cs, -0.1) : cl);
        P.rect(x, X - 8, base - h * 0.95, 16, 2, EL.shade(col, -0.35));
        if (humo) [[2, -14, 9], [12, -28, 12], [28, -40, 11], [46, -48, 9]].forEach(([dx, dy, rr]) => { P.circle(x, X + dx, base - h + dy, rr, '#ece6e2'); P.circle(x, X + dx - 2, base - h + dy - 2, rr * 0.6, '#ffffff'); });
      });
    },
    // pilares de roca con repisas y césped, como en los juegos de plataformas
    mesetas(x, r, o) {
      for (let k = 0; k < o.n; k++) {
        const cx = (k + 0.2 + r() * 0.6) * W / o.n, w = o.w[0] + r() * (o.w[1] - o.w[0]), h = o.h[0] + r() * (o.h[1] - o.h[0]);
        envolver(cx, w, X => {
          const top = o.base - h, pts = [];
          for (let y = top; y <= o.base; y += 8) { const ens = (y - top) / h * w * 0.18; pts.push([X - w / 2 - ens + ((y * 7 + k * 13) % 5) - 2, y]); }
          const der = []; for (let y = o.base; y >= top; y -= 8) { const ens = (y - top) / h * w * 0.18; der.push([X + w / 2 + ens + ((y * 11 + k * 7) % 5) - 2, y]); }
          P.poly(x, pts.concat([[X + w / 2 + w * 0.18, H], [X - w / 2 - w * 0.18, H]]).concat(der), o.col);
          P.poly(x, [[X + w * 0.15, top], [X + w / 2, top], [X + w / 2 + w * 0.18, H], [X + w * 0.15, H]], EL.shade(o.col, -0.16));
          for (let j = 1; j < 4; j++) { const yy = top + h * j / 4; P.rect(x, X - w / 2 - 2, yy, w * 0.7, 3, EL.shade(o.col, 0.14)); P.rect(x, X - w / 2 - 2, yy + 3, w * 0.7, 2, EL.shade(o.col, -0.28)); }
          for (let c = 0; c < 4; c++) { const cxx = X - w / 2 + w * (0.15 + c * 0.22); P.line(x, cxx, top + 10 + c * 6, cxx + 3, top + 40 + c * 10, EL.shade(o.col, -0.3)); }
          if (o.pasto) { P.rect(x, X - w / 2 - 6, top - 4, w + 12, 7, o.pasto); P.rect(x, X - w / 2 - 6, top - 4, w + 12, 2, EL.shade(o.pasto, 0.25)); for (let q = -w / 2 - 4; q < w / 2 + 4; q += 5) { const l = 3 + ((q * 7 + k) % 9 + 9) % 9; P.rect(x, X + q, top + 3, 2, l, EL.shade(o.pasto, -0.2)); } }
          if (o.palma && k % 2 === 0) M.palma(x, X - w * 0.2, top - 2, 30 + h * 0.12, o.palma, '#6a4a2e');
        });
      }
    },
    bosque(x, r, o) {
      const c2 = o.col2 || EL.shade(o.col, 0.2), c3 = EL.shade(o.col, -0.2);
      P.rect(x, 0, o.base, W, H - o.base, o.col);
      for (let i = 0; i < W; i += o.paso || 12) { const rr = o.alto * (0.55 + 0.45 * Math.abs(ciclo(i, 7, 1.3) * ciclo(i, 3, 0.4))); envolver(i, rr, X => { P.circle(x, X, o.base - rr * 0.5, rr, c3); P.circle(x, X - 1, o.base - rr * 0.62, rr - 2, o.col); P.circle(x, X - rr * 0.3, o.base - rr * 0.85, rr * 0.45, c2); }); }
    },
    arbol(x, cx, base, h, col, tronco = '#5a3a22') {
      envolver(cx, h, X => { P.rect(x, X - 3, base - h * 0.6, 7, h * 0.6, tronco); P.rect(x, X + 2, base - h * 0.6, 2, h * 0.6, EL.shade(tronco, -0.3)); [[-0.35, 0.72, 0.36], [0.35, 0.7, 0.34], [0, 0.9, 0.44], [-0.15, 1.05, 0.3]].forEach(([dx, dy, rr]) => P.circle(x, X + dx * h, base - dy * h, rr * h, EL.shade(col, -0.15))); [[-0.38, 0.76, 0.28], [0.3, 0.74, 0.27], [0, 0.95, 0.36]].forEach(([dx, dy, rr]) => P.circle(x, X + dx * h, base - dy * h, rr * h, col)); P.circle(x, X - 0.15 * h, base - 1.05 * h, 0.16 * h, EL.shade(col, 0.25)); });
    },
    palma(x, cx, base, h, col = '#2f8a3a', tronco = '#8a6a3e') {
      envolver(cx, h, X => {
        for (let i = 0; i < h; i++) { const dx = Math.round(Math.sin(i / h * 1.4) * h * 0.12); P.rect(x, X + dx - 2, base - i, 5, 1, i % 5 === 0 ? EL.shade(tronco, -0.3) : tronco); P.rect(x, X + dx + 2, base - i, 1, 1, EL.shade(tronco, -0.2)); }
        const tx = X + Math.round(Math.sin(1.4) * h * 0.12), ty = base - h;
        for (let k = 0; k < 7; k++) { const a = -Math.PI + k * Math.PI / 6 + 0.1, L = h * 0.55; for (let q = 0; q < 10; q++) { const t = q / 10, px = tx + Math.cos(a) * L * t, py = ty + Math.sin(a) * L * t * 0.6 + t * t * L * 0.5; P.ellipse(x, px, py, 4 - t * 2.5, 2, q % 2 ? col : EL.shade(col, -0.18)); } }
        P.circle(x, tx, ty + 2, 3, '#6b4a1e');
      });
    },
    // fila de casas coloniales vistas de lado (sin cortes al repetirse)
    casas(x, r, o) {
      const n = o.n || 9, w0 = W / n, cols = o.cols;
      for (let i = 0; i < n; i++) {
        const X = i * w0, w = w0 - (o.sep || 0), h = o.alto[0] + ((i * 37) % 7) / 6 * (o.alto[1] - o.alto[0]), b = o.base, c = cols[i % cols.length];
        P.rect(x, X, b - h, w, H - b + h, c);
        P.rect(x, X, b - 8, w, 8, EL.shade(c, -0.3)); P.rect(x, X, b - 9, w, 1, EL.shade(c, 0.2));                 // zócalo
        const t = o.techo || '#a9442e'; P.rect(x, X - 3, b - h - 12, w + 6, 12, t);
        for (let q = X - 3; q < X + w + 3; q += 4) { P.rect(x, q, b - h - 12, 1, 12, EL.shade(t, -0.25)); P.rect(x, q + 2, b - h - 12, 1, 12, EL.shade(t, 0.12)); }
        P.rect(x, X - 3, b - h - 13, w + 6, 2, EL.shade(t, 0.3)); P.rect(x, X - 3, b - h, w + 6, 2, EL.shade(t, -0.45));
        // puerta en arco y ventanas con barrotes
        const pw = Math.min(16, w * 0.22), pX = X + w * 0.5 - pw / 2, ph = Math.min(h - 8, 28);
        P.rect(x, pX - 2, b - ph - 2, pw + 4, ph + 2, EL.shade(c, -0.15)); P.rect(x, pX, b - ph, pw, ph, o.puerta || '#5a3a22'); P.ellipse(x, pX + pw / 2, b - ph, pw / 2, 4, o.puerta || '#5a3a22'); P.rect(x, pX + pw / 2, b - ph, 1, ph, EL.shade(o.puerta || '#5a3a22', -0.3));
        if (h > 90) for (let wy = b - h + 22; wy < b - 60; wy += 38) { for (let wx = X + 10; wx < X + w - 20; wx += 26) { P.rect(x, wx - 2, wy - 2, 16, 22, EL.shade(c, -0.12)); P.rect(x, wx, wy, 12, 18, o.luz || '#3a2a22'); for (let q = 1; q < 12; q += 3) P.rect(x, wx + q, wy, 1, 18, '#2a1a14'); } P.rect(x, X + 4, wy + 18, w - 8, 3, EL.shade(c, -0.35)); for (let q = X + 6; q < X + w - 6; q += 5) P.rect(x, q, wy + 10, 1, 8, EL.shade(c, -0.35)); P.rect(x, X + 4, wy + 9, w - 8, 1, EL.shade(c, -0.35)); }
        [X + w * 0.14, X + w * 0.86 - 12].forEach(wx => { const wy = b - h * 0.72; P.rect(x, wx - 2, wy - 2, 16, 20, EL.shade(c, -0.12)); P.rect(x, wx, wy, 12, 16, o.luz || '#3a2a22'); for (let q = 1; q < 12; q += 3) P.rect(x, wx + q, wy, 1, 16, '#2a1a14'); P.rect(x, wx - 2, wy + 16, 16, 2, EL.shade(c, 0.15)); });
        if (o.farol && i % 2 === 0) { P.rect(x, X + w, b - 50, 2, 42, '#2a2230'); P.rect(x, X + w - 3, b - 58, 8, 9, '#2a2230'); P.rect(x, X + w - 2, b - 57, 6, 7, '#ffd76a'); P.circle(x, X + w + 1, b - 54, 16, 'rgba(255,215,106,0.14)'); }
      }
    },
    ruinas(x, r, o) {
      for (let k = 0; k < o.n; k++) {
        const cx = (k + 0.5) * W / o.n + (r() - 0.5) * 30, w = o.w[0] + r() * (o.w[1] - o.w[0]), h = o.h[0] + r() * (o.h[1] - o.h[0]);
        envolver(cx, w, X => {
          const pts = [[X - w / 2, o.base], [X - w / 2, o.base - h * 0.8]]; for (let q = 0; q <= 10; q++) pts.push([X - w / 2 + w * q / 10, o.base - h + ((q * 37 + k * 11) % 19) * (q % 3 === 0 ? 1.4 : 0.6)]); pts.push([X + w / 2, o.base - h * 0.7]); pts.push([X + w / 2, o.base]);
          P.poly(x, pts, o.col); P.rect(x, X - w / 2, o.base, w, H - o.base, o.col);
          for (let y = o.base - h + 14; y < o.base; y += 6) for (let q = X - w / 2 + ((y / 6) % 2) * 5; q < X + w / 2 - 6; q += 11) P.rect(x, q, y, 9, 1, EL.shade(o.col, -0.22));
          const aw = w * 0.32, ah = h * 0.5; P.rect(x, X - aw / 2, o.base - ah, aw, ah, o.hueco || '#2a1a18'); P.ellipse(x, X, o.base - ah, aw / 2, aw * 0.35, o.hueco || '#2a1a18');
          if (o.pasto) for (let q = -w / 2; q < w / 2; q += 4) P.rect(x, X + q, o.base - h + ((Math.round(q) * 37 + k * 11) % 19 + 19) % 19 * 0.6 - 2, 3, 3, o.pasto);
        });
      }
    },
    agua(x, y0, col, o = {}) {
      P.rect(x, 0, y0, W, H - y0, col); P.rect(x, 0, y0, W, 2, EL.shade(col, 0.3));
      for (let i = 0; i < 260; i++) { const yy = y0 + 4 + ((i * 53) % (H - y0)), xx = (i * 97) % W, l = 6 + (i % 5) * 4; P.rect(x, xx, yy, l, 1, (i % 3) ? EL.shade(col, 0.22) : EL.shade(col, -0.15)); }
      if (o.brillo != null) for (let yy = y0 + 3; yy < Math.min(H, y0 + 90); yy += 3) { const w = 10 + (yy - y0) * 0.5 + ((yy * 7) % 9); P.rect(x, o.brillo - w / 2 + ((yy * 13) % 7) - 3, yy, w, 1, o.brilloCol || '#ffe39a'); }
    },
    nubes(x, r, o) {
      for (let k = 0; k < o.n; k++) { const cx = (k + r()) * W / o.n, cy = o.y + (r() - 0.5) * o.dy, s = o.s * (0.7 + r() * 0.6);
        envolver(cx, 60 * s, X => { const sh = o.sombra; P.rect(x, X - 40 * s, cy, 80 * s, 6 * s, sh); [[-24, 0, 14], [-6, -8, 20], [16, -4, 16], [34, 2, 10]].forEach(([dx, dy, rr]) => P.circle(x, X + dx * s, cy + dy * s, rr * s, sh)); [[-24, -2, 12], [-6, -10, 18], [16, -6, 14], [34, 0, 8]].forEach(([dx, dy, rr]) => P.circle(x, X + dx * s, cy + dy * s, rr * s, o.col)); P.circle(x, X - 10 * s, cy - 16 * s, 8 * s, o.luz || '#ffffff'); }); }
    },
    iglesia(x, cx, base, s, muro = '#f6f1e6') { envolver(cx, 120 * s, X => iglesiaSutiaba(x, X, base, s)); },
    catedral(x, cx, base, s, luz) { envolver(cx, 100 * s, X => catedral(x, X, base, s, '#f4efe4', '#d8cfbd', luz)); },
    tamarindon(x, cx, base, k = 1) { envolver(cx, 60 * k, X => { x.save(); x.translate(X, base); x.scale(k, k); tamarindon(x, 0, 0); x.restore(); }); },
    arcos(x, o) {
      const n = o.n || 8, w0 = W / n; P.rect(x, 0, o.base - o.alto - 16, W, o.alto + 16 + H - o.base, o.col);
      P.rect(x, 0, o.base - o.alto - 22, W, 8, o.techo || '#a9442e'); for (let q = 0; q < W; q += 4) P.rect(x, q, o.base - o.alto - 22, 1, 8, EL.shade(o.techo || '#a9442e', -0.25));
      for (let i = 0; i < n; i++) { const cx = i * w0 + w0 / 2, aw = w0 * 0.62; P.rect(x, cx - aw / 2, o.base - o.alto * 0.7, aw, o.alto * 0.7, o.hueco); P.ellipse(x, cx, o.base - o.alto * 0.7, aw / 2, aw * 0.4, o.hueco); P.rect(x, i * w0 - 3, o.base - o.alto, 6, o.alto, EL.shade(o.col, -0.15)); P.rect(x, i * w0 - 5, o.base - o.alto * 0.72, 10, 4, EL.shade(o.col, 0.2)); if (o.mascaras) { P.circle(x, cx, o.base - o.alto * 0.45, 7, o.mascaras[i % o.mascaras.length]); P.rect(x, cx - 4, o.base - o.alto * 0.47, 2, 2, '#1b1222'); P.rect(x, cx + 2, o.base - o.alto * 0.47, 2, 2, '#1b1222'); P.rect(x, cx - 3, o.base - o.alto * 0.4, 6, 1, '#c8323a'); } if (o.farol) { P.rect(x, cx - 1, o.base - o.alto * 0.7 - 2, 2, 8, '#2a2230'); P.rect(x, cx - 3, o.base - o.alto * 0.7 + 6, 7, 8, '#ffd76a'); P.circle(x, cx, o.base - o.alto * 0.7 + 10, 12, 'rgba(255,215,106,0.15)'); } }
    },
    tejados(x, r, o) {     // techos de teja vistos de lado, escalonados
      for (let fila = 0; fila < o.filas; fila++) { const b = o.base + fila * 18, t = o.cols[fila % o.cols.length]; for (let X = -((fila * 47) % 90); X < W; X += 90) { const w = 84, h = 22 + (fila % 2) * 6; P.poly(x, [[X, b], [X + 12, b - h], [X + w - 12, b - h], [X + w, b]], t); for (let q = X + 4; q < X + w - 4; q += 4) P.rect(x, q, b - h + 2, 1, h - 2, EL.shade(t, -0.22)); P.rect(x, X + 12, b - h, w - 24, 2, EL.shade(t, 0.3)); P.rect(x, X, b, w, H - b, EL.shade(o.pared || '#c9b48a', -fila * 0.06)); if (o.luz && (X + fila) % 3 === 0) P.rect(x, X + 30, b + 6, 8, 8, o.luz); } }
    },
    cupulas(x, o) { for (let i = 0; i < W; i += 64) { P.rect(x, i, o.base - 6, 64, H - o.base + 6, '#e9e6dc'); P.ellipse(x, i + 32, o.base - 8, 22, 16, '#d6d2c4'); P.ellipse(x, i + 30, o.base - 10, 19, 13, '#ffffff'); P.rect(x, i + 31, o.base - 32, 2, 8, '#c9a43e'); P.rect(x, i + 28, o.base - 29, 8, 2, '#c9a43e'); for (let q = i + 4; q < i + 60; q += 8) P.rect(x, q, o.base + 4, 4, 10, '#d0ccc0'); } },
    muelle(x, o) { P.rect(x, 0, o.y, W, 6, '#8a5a32'); for (let q = 0; q < W; q += 6) P.rect(x, q, o.y, 1, 6, '#5a361e'); P.rect(x, 0, o.y, W, 1, '#c08a52'); for (let q = 10; q < W; q += 48) { P.rect(x, q, o.y + 6, 6, H - o.y, '#4a2a16'); P.rect(x, q, o.y - 18, 3, 18, '#5a361e'); } P.rect(x, 0, o.y - 18, W, 2, '#5a361e'); },
    ranchos(x, o) { for (let i = 0; i < o.xs.length; i++) envolver(o.xs[i], 40, X => { P.rect(x, X - 2, o.base - 26, 3, 26, '#5a3a22'); P.rect(x, X + 34, o.base - 26, 3, 26, '#5a3a22'); P.poly(x, [[X - 10, o.base - 24], [X + 17, o.base - 44], [X + 45, o.base - 24]], '#c9a06a'); for (let q = X - 8; q < X + 44; q += 3) P.rect(x, q, o.base - 26 - (q < X + 17 ? (q - X + 10) * 0.7 : (X + 45 - q) * 0.7), 1, 4, '#9a7848'); if (o.luz) P.rect(x, X + 10, o.base - 14, 14, 8, o.luz); }); },
    juncos(x, o) { for (let i = 0; i < W; i += 4) { const h = 10 + ((i * 13) % 14); P.line(x, i, o.base, i + 2, o.base - h, i % 8 ? o.col : EL.shade(o.col, -0.2)); if (i % 16 === 0) P.ellipse(x, i + 2, o.base - h, 1.5, 4, '#6a4a2a'); } },
    bote(x, cx, y, s) { envolver(cx, 30, X => { P.poly(x, [[X - 16 * s, y], [X + 16 * s, y], [X + 11 * s, y + 6 * s], [X - 11 * s, y + 6 * s]], '#6a3a22'); P.rect(x, X, y - 22 * s, 1, 22 * s, '#3a2a22'); P.poly(x, [[X + 1, y - 22 * s], [X + 13 * s, y - 4 * s], [X + 1, y - 4 * s]], '#f4ead6'); }); },
    puente(x, o) { P.rect(x, o.x0, o.y, o.x1 - o.x0, 6, '#8a5a32'); for (let q = o.x0; q < o.x1; q += 5) P.rect(x, q, o.y, 1, 6, '#5a361e'); P.rect(x, o.x0, o.y - 14, o.x1 - o.x0, 2, '#5a361e'); for (let q = o.x0; q <= o.x1; q += 20) { P.rect(x, q, o.y - 14, 2, 14, '#5a361e'); P.rect(x, q, o.y + 6, 4, 30, '#4a2a16'); } },
    fuegos(x, o) { o.p.forEach(([cx, cy, c, rr]) => { for (let a = 0; a < 16; a++) { const an = a / 16 * TAU; for (let q = 0.3; q < 1; q += 0.14) P.rect(x, cx + Math.cos(an) * rr * q, cy + Math.sin(an) * rr * q + q * q * 6, 2, 2, q > 0.8 ? '#ffffff' : c); } P.circle(x, cx, cy, rr * 1.1, 'rgba(255,255,255,0.05)'); }); },
    niebla(x, y, a) { for (let i = 0; i < W; i += 24) P.ellipse(x, i, y + Math.sin(TAU * i / W * 4) * 5, 40, 9, `rgba(214,222,255,${a})`); },
    faroles(x, o) { for (let i = 0; i < W; i += o.sep) { P.rect(x, i, o.base - o.alto, 3, o.alto, '#2a2230'); P.rect(x, i - 4, o.base - o.alto - 12, 11, 12, '#2a2230'); P.rect(x, i - 2, o.base - o.alto - 10, 7, 8, '#ffd76a'); P.circle(x, i + 1, o.base - o.alto - 6, 22, 'rgba(255,215,106,0.12)'); P.rect(x, i - 3, o.base - 4, 9, 4, '#2a2230'); } },
    kiosko(x, cx, base) { envolver(cx, 60, X => { P.rect(x, X - 40, base - 8, 80, 8, '#e8e0cc'); for (let q = -34; q <= 34; q += 17) P.rect(x, X + q, base - 44, 3, 36, '#f4efe4'); P.poly(x, [[X - 46, base - 44], [X, base - 66], [X + 46, base - 44]], '#3f8a7a'); P.rect(x, X - 46, base - 46, 92, 3, '#2f6a5a'); }); },
    // ---- planos delanteros (arriba, oscuros) ----
    lianas(x, col = '#1e3a20') { for (let i = 0; i < W; i += 9) { const l = 10 + Math.abs(ciclo(i, 5, 0.7) * ciclo(i, 11, 2)) * 46; P.rect(x, i, 0, 2, l, col); for (let q = 4; q < l; q += 7) P.ellipse(x, i + (q % 14 ? 3 : -2), q, 3, 2, EL.shade(col, 0.15)); } P.rect(x, 0, 0, W, 6, col); for (let i = 0; i < W; i += 20) P.circle(x, i, 4, 9, col); },
    farolesColg(x, o = {}) { const col = o.col || '#241a28'; P.rect(x, 0, 0, W, 8, col); for (let i = 0; i < W; i += 24) { const h = 6 + ((i * 7) % 5) * 3; P.poly(x, [[i, 6], [i + 22, 6], [i + 11, 6 + h]], col); } for (let i = 60; i < W; i += 160) { const l = 22 + (i % 3) * 10; for (let q = 8; q < l; q += 4) P.rect(x, i, q, 2, 3, '#4a3a3a'); P.rect(x, i - 5, l, 12, 3, '#3a2a22'); P.rect(x, i - 4, l + 3, 10, 10, '#ffcf5a'); P.rect(x, i - 2, l + 5, 6, 6, '#fff0a8'); P.rect(x, i - 5, l + 13, 12, 2, '#3a2a22'); P.circle(x, i + 1, l + 8, 16, 'rgba(255,207,90,0.16)'); } },
    papelPicado(x, cols) { for (let i = 0; i < W; i += 320) { for (let k = 0; k <= 60; k++) { const t = k / 60; P.rect(x, i + t * 320, 4 + Math.sin(t * Math.PI) * 16, 2, 1, '#3a2a22'); } for (let k = 1; k < 16; k++) { const t = k / 16, xx = i + t * 320, yy = 5 + Math.sin(t * Math.PI) * 16; P.rect(x, xx - 7, yy, 14, 14, cols[k % cols.length]); P.rect(x, xx - 3, yy + 4, 2, 2, 'rgba(0,0,0,0.25)'); P.rect(x, xx + 2, yy + 8, 2, 2, 'rgba(0,0,0,0.25)'); for (let q = -7; q < 7; q += 3) P.rect(x, xx + q, yy + 14, 2, 2, cols[k % cols.length]); } } },
    alero(x, c = '#4a2a1e') { P.rect(x, 0, 0, W, 14, c); for (let q = 0; q < W; q += 5) { P.rect(x, q, 14, 3, 6, EL.shade(c, -0.25)); P.rect(x, q + 1, 0, 1, 14, EL.shade(c, 0.12)); } for (let i = 80; i < W; i += 240) { P.rect(x, i, 20, 2, 10, '#2a2230'); P.rect(x, i - 4, 30, 10, 11, '#ffd76a'); P.rect(x, i - 4, 30, 10, 2, '#2a2230'); P.circle(x, i + 1, 36, 15, 'rgba(255,215,106,0.15)'); } },
    hojasPalma(x, col = '#1f4a22') { for (let i = 0; i < W; i += 240) { for (let k = 0; k < 6; k++) { const a = 0.15 + k * 0.5; for (let q = 0; q < 14; q++) { const t = q / 14, px = i + 40 + Math.cos(a) * 90 * t, py = t * 26 + t * t * 26 * (k % 2 ? 1 : 0.6); P.ellipse(x, px, py, 6 - t * 3, 2.5, q % 2 ? col : EL.shade(col, 0.18)); } } } },
    rocaTecho(x, col = '#2a1e26') { const ys = []; for (let i = 0; i < W; i++) ys.push(8 + Math.round(Math.abs(ciclo(i, 9, 0.3)) * 14 + Math.abs(ciclo(i, 23, 1.1)) * 8)); x.fillStyle = col; for (let i = 0; i < W; i++) x.fillRect(i, 0, 1, ys[i]); for (let i = 30; i < W; i += 70) P.poly(x, [[i - 7, 10], [i + 7, 10], [i, 30 + (i % 3) * 8]], col); }
  };

  /* Acabado: textura en bloques, sombra hacia abajo y luz de borde en la parte de arriba de cada forma */
  function acabado(cv, luz, fuerza = 1) {
    const x = cv.x, w = cv.width, h = cv.height, im = x.getImageData(0, 0, w, h), d = im.data, L = rgb(luz), corrida = new Int16Array(w);
    for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) {
      const p = (y * w + i) * 4;
      if (d[p + 3] < 20) { corrida[i] = 0; continue; }
      const run = ++corrida[i];
      const hsh = ((Math.imul(i >> 1, 73856093) ^ Math.imul(y >> 1, 19349663)) >>> 0) % 1000 / 1000;
      let k = 1; if (hsh < 0.09) k = 0.9; else if (hsh > 0.93) k = 1.08;
      k *= 1 - Math.min(0.22, run / 260) * fuerza;
      const borde = run === 1 ? 0.55 : run === 2 ? 0.3 : run === 3 ? 0.12 : 0;
      for (let c = 0; c < 3; c++) { let v = d[p + c] * k; v = v + (L[c] - v) * borde * fuerza; d[p + c] = Math.max(0, Math.min(255, v)); }
    }
    x.putImageData(im, 0, 0);
  }
  function tinte(cv, col, a) { const x = cv.x; x.globalCompositeOperation = 'source-atop'; x.globalAlpha = a; x.fillStyle = col; x.fillRect(0, 0, cv.width, cv.height); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
  function cieloEscena(e, r) {
    const c = EL.canvas(640, 360), x = c.x; P.grad(x, 0, 0, 640, 360, e.cielo);
    if (e.estrellas) B.estrellas(x, e.estrellas, 220, r);
    const s = e.sol || e.luna;
    if (s) { for (let k = 5; k >= 1; k--) P.circle(x, s.x, s.y, s.r + k * 12, `rgba(${rgb(s.c).join(',')},${0.05})`); P.circle(x, s.x, s.y, s.r, s.c); P.circle(x, s.x - s.r * 0.2, s.y - s.r * 0.2, s.r * 0.75, EL.shade(s.c, 0.25));
      if (e.luna) { P.circle(x, s.x - s.r * 0.35, s.y + s.r * 0.1, s.r * 0.18, EL.shade(s.c, -0.1)); P.circle(x, s.x + s.r * 0.3, s.y - s.r * 0.3, s.r * 0.12, EL.shade(s.c, -0.1)); }
      if (e.rayos) { x.fillStyle = `rgba(${rgb(s.c).join(',')},0.08)`; for (let k = 0; k < 7; k++) { const a = Math.PI * 0.15 + k * 0.12; x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + Math.cos(a) * 700, s.y + Math.sin(a) * 700); x.lineTo(s.x + Math.cos(a + 0.05) * 700, s.y + Math.sin(a + 0.05) * 700); x.fill(); x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x - Math.cos(a) * 700, s.y + Math.sin(a) * 700); x.lineTo(s.x - Math.cos(a + 0.05) * 700, s.y + Math.sin(a + 0.05) * 700); x.fill(); } }
    }
    if (e.nubes) { const n = EL.canvas(W, H); M.nubes(n.x, r, e.nubes); c.nubes = n; }
    return c;
  }
  const verdes = { l: '#9fc7a8', l2: '#6fa86a', m: '#4f8f3e', c: '#2f5e2a' };
  const ESC = {
    leonviejo: [
      { nombre: 'Ruinas y Momotombo', cielo: ['#5cb6ea', '#a9dcf4', '#f6efcf'], sol: { x: 520, y: 70, r: 18, c: '#fff3b0' }, luz: '#fff2c4', nubes: { n: 4, y: 70, dy: 40, s: 1, col: '#ffffff', sombra: '#cfe2ee' },
        lejos(x, r) { M.volcan(x, 300, 250, 330, 165, '#8a7f9a', true); M.volcan(x, 740, 255, 210, 90, '#9a90a8', false); M.colinas(x, r, { base: 262, amp: 14, col: '#9cc4c0', k: 4 }); },
        lejos2(x, r) { M.agua(x, 262, '#4aa6d6', { brillo: 520 }); M.colinas(x, r, { base: 282, amp: 10, col: '#7fb06a', k: 5 }); },
        medio(x, r) { M.bosque(x, r, { base: 290, alto: 16, col: '#4a8a3a' }); M.ruinas(x, r, { n: 4, base: 292, w: [50, 80], h: [30, 46], col: '#c48a5a', pasto: '#6fa84a' }); },
        cerca(x, r) { M.ruinas(x, r, { n: 2, base: 300, w: [110, 150], h: [110, 150], col: '#9a6040', pasto: '#4f8a3a', hueco: '#2a1a18' }); M.arbol(x, 480, 300, 90, '#3f7f32'); },
        frente(x) { M.lianas(x); } },
      { nombre: 'Camino al lago', cielo: ['#6cc0f0', '#bfe6f8', '#fff3d0'], sol: { x: 160, y: 60, r: 16, c: '#fff6c0' }, luz: '#fff6d0', nubes: { n: 5, y: 60, dy: 50, s: 1.1, col: '#ffffff', sombra: '#d2e4ee' },
        lejos(x, r) { M.volcan(x, 600, 240, 380, 175, '#8a7f9a', true); M.cordillera(x, r, { base: 256, amp: 26, col: '#a7c4cf', k: [3, 7, 15] }); },
        lejos2(x, r) { M.agua(x, 252, '#3f9ed0', { brillo: 160, brilloCol: '#fff6c0' }); M.bote(x, 300, 262, 0.7); M.bote(x, 820, 268, 0.9); },
        medio(x, r) { M.bosque(x, r, { base: 288, alto: 20, col: '#4a8f3a' }); for (let i = 40; i < W; i += 150) M.palma(x, i, 292, 48, '#3a8a3a'); },
        cerca(x, r) { M.mesetas(x, r, { n: 3, base: 304, w: [70, 110], h: [80, 150], col: '#7a5a48', pasto: '#5aa03e', palma: '#2f7a32' }); },
        frente(x) { M.lianas(x, '#1f4020'); } },
      { nombre: 'La excavación', cielo: ['#7cc8f0', '#c8e8f4', '#f4e6c0'], sol: { x: 420, y: 50, r: 16, c: '#fff6c0' }, luz: '#fff0c8', nubes: { n: 3, y: 80, dy: 40, s: 1.2, col: '#ffffff', sombra: '#d8e2e6' },
        lejos(x, r) { M.cordillera(x, r, { base: 240, amp: 60, col: '#a9b8c8', k: [2, 6, 14] }); M.volcan(x, 820, 248, 230, 110, '#968aa4', true); },
        lejos2(x, r) { M.colinas(x, r, { base: 268, amp: 22, col: '#b9a676', k: 4 }); M.ruinas(x, r, { n: 6, base: 274, w: [30, 46], h: [18, 30], col: '#c9966a' }); },
        medio(x, r) { M.colinas(x, r, { base: 290, amp: 10, col: '#c8a070', k: 6 }); M.ruinas(x, r, { n: 4, base: 292, w: [70, 100], h: [40, 60], col: '#b97a50', pasto: '#7aa84a' }); for (let i = 100; i < W; i += 240) { P.rect(x, i, 250, 3, 42, '#6a4a2a'); P.rect(x, i + 40, 250, 3, 42, '#6a4a2a'); P.rect(x, i - 4, 250, 50, 3, '#6a4a2a'); P.rect(x, i, 270, 43, 2, '#6a4a2a'); } },
        cerca(x, r) { M.mesetas(x, r, { n: 3, base: 304, w: [90, 130], h: [70, 120], col: '#8a5a3e', pasto: '#6a9a3e' }); },
        frente(x) { M.rocaTecho(x, '#3a2a22'); } },
      { nombre: 'Orilla del Xolotlán', cielo: ['#58b0e4', '#a8daf2', '#e8f6f6'], sol: { x: 700, y: 80, r: 18, c: '#fff8d0' }, luz: '#f4fbff', nubes: { n: 4, y: 60, dy: 40, s: 1.3, col: '#ffffff', sombra: '#c9dcea' },
        lejos(x, r) { M.volcan(x, 220, 236, 300, 140, '#8f86a2', true); M.volcan(x, 380, 240, 120, 50, '#9e96b0', false); M.cordillera(x, r, { base: 244, amp: 18, col: '#a9c4d4', k: [4, 9, 17] }); },
        lejos2(x, r) { M.agua(x, 240, '#3a9ad0', { brillo: 700, brilloCol: '#fff8d0' }); M.bote(x, 560, 252, 0.7); },
        medio(x, r) { M.agua(x, 276, '#3592c8'); M.juncos(x, { base: 292, col: '#6f9a3a' }); P.rect(x, 0, 292, W, 70, '#d8c48a'); },
        cerca(x, r) { for (let i = 60; i < W; i += 220) M.palma(x, i, 306, 120, '#2f7a32'); M.bosque(x, r, { base: 300, alto: 18, col: '#3f7a32' }); },
        frente(x) { M.hojasPalma(x); } },
      { nombre: 'Atardecer en las ruinas', cielo: ['#3e2a6a', '#b85a6a', '#ffb070', '#ffe2a0'], sol: { x: 480, y: 210, r: 42, c: '#ffe39a' }, rayos: true, luz: '#ffcf8a', nubes: { n: 3, y: 120, dy: 50, s: 1.3, col: '#ffb08a', sombra: '#c86a6a', luz: '#ffd0a0' },
        lejos(x, r) { M.volcan(x, 760, 250, 280, 140, '#7a4a6a', true); M.cordillera(x, r, { base: 250, amp: 50, col: '#8a5a72', k: [2, 5, 13] }); },
        lejos2(x, r) { M.mesetas(x, r, { n: 4, base: 290, w: [50, 80], h: [90, 150], col: '#6a3a50' }); },
        medio(x, r) { M.ruinas(x, r, { n: 4, base: 294, w: [70, 110], h: [50, 80], col: '#5a3040', hueco: '#2a1424' }); },
        cerca(x, r) { M.mesetas(x, r, { n: 3, base: 308, w: [80, 120], h: [120, 190], col: '#3a2030', pasto: '#3a5a2a', palma: '#24402a' }); },
        frente(x) { M.farolesColg(x, { col: '#1e1420' }); } }
    ],
    metapa: [
      { nombre: 'Casa natal de Darío', cielo: ['#7cc8f2', '#c8eaf8', '#ffe8c0'], sol: { x: 820, y: 70, r: 16, c: '#fff6c0' }, luz: '#fff6d0', nubes: { n: 4, y: 60, dy: 40, s: 1.1, col: '#ffffff', sombra: '#d0e2ec' },
        lejos(x, r) { M.cordillera(x, r, { base: 220, amp: 70, col: '#a6c6c0', k: [2, 5, 11] }); },
        lejos2(x, r) { M.colinas(x, r, { base: 262, amp: 40, col: '#6fae6a', k: 3 }); M.bosque(x, r, { base: 268, alto: 10, col: '#5a9a50', paso: 9 }); },
        medio(x, r) { M.casas(x, r, { n: 8, base: 292, alto: [30, 42], cols: ['#f2e6cf', '#f4d6a6', '#e9d8b8', '#dfe8c8'], techo: '#b34a30', sep: 14 }); },
        cerca(x, r) { for (let i = 80; i < W; i += 240) M.arbol(x, i, 306, 80 + (i % 3) * 14, '#3f8a34'); },
        frente(x) { M.lianas(x, '#21401f'); } },
      { nombre: 'Calle del pueblo', cielo: ['#86ccf4', '#d2eefa', '#ffeccc'], sol: { x: 300, y: 60, r: 16, c: '#fff6c0' }, luz: '#fff4d0', nubes: { n: 3, y: 60, dy: 30, s: 1, col: '#ffffff', sombra: '#d0e2ec' },
        lejos(x, r) { M.colinas(x, r, { base: 220, amp: 50, col: '#a6c8b8', k: 2 }); M.iglesia(x, 640, 236, 0.6); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 262, alto: [22, 30], cols: ['#e8dcc4', '#ead2a8', '#dcdcc0'], techo: '#a65040' }); },
        medio(x, r) { M.casas(x, r, { n: 8, base: 288, alto: [36, 50], cols: ['#f4d6a6', '#9fc0c9', '#f2e6cf', '#e8a87a'], techo: '#b34a30', farol: true }); },
        cerca(x, r) { M.casas(x, r, { n: 4, base: 312, alto: [120, 150], cols: ['#c9a87a', '#a8846a'], techo: '#7a3424', sep: 140 }); },
        frente(x) { M.papelPicado(x, ['#3f8ad8', '#ffffff', '#5ab0e8']); } },
      { nombre: 'Cafetales y cerros', cielo: ['#70c0ee', '#c0e4f6', '#eef6e0'], sol: { x: 600, y: 60, r: 15, c: '#fffbe0' }, luz: '#f8ffe8', nubes: { n: 5, y: 80, dy: 50, s: 1.2, col: '#ffffff', sombra: '#d4e4e8' },
        lejos(x, r) { M.cordillera(x, r, { base: 200, amp: 80, col: '#9cc0bc', k: [2, 4, 9] }); },
        lejos2(x, r) { M.colinas(x, r, { base: 250, amp: 50, col: '#6aa864', k: 3 }); for (let i = 0; i < W; i += 7) { const y = 262 + Math.sin(TAU * i / W * 6) * 4; P.circle(x, i, y, 3, '#4a8a44'); } },
        medio(x, r) { M.colinas(x, r, { base: 286, amp: 22, col: '#5a9a44', k: 4 }); for (let f = 0; f < 3; f++) for (let i = (f * 9) % 18; i < W; i += 18) { const y = 270 + f * 9 + Math.sin(TAU * i / W * 4) * 6; P.circle(x, i, y, 6, '#2f6b2a'); P.circle(x, i - 1, y - 2, 4, '#4a8f3a'); P.rect(x, i + 2, y, 2, 2, '#c8323a'); } },
        cerca(x, r) { M.bosque(x, r, { base: 304, alto: 40, col: '#2f6a2c', paso: 26 }); },
        frente(x) { M.lianas(x, '#1d3c1e'); } },
      { nombre: 'Plaza e iglesia', cielo: ['#8ad0f6', '#d8f0fa', '#fff0d0'], sol: { x: 180, y: 70, r: 16, c: '#fff6c0' }, luz: '#fff6d4', nubes: { n: 4, y: 70, dy: 30, s: 1, col: '#ffffff', sombra: '#d4e4ee' },
        lejos(x, r) { M.colinas(x, r, { base: 230, amp: 50, col: '#a2c6b6', k: 2 }); },
        lejos2(x, r) { M.bosque(x, r, { base: 262, alto: 16, col: '#5f9e56' }); },
        medio(x, r) { P.rect(x, 0, 290, W, 70, '#d8c49a'); M.iglesia(x, 480, 292, 1.4); M.casas(x, r, { n: 10, base: 292, alto: [30, 36], cols: ['#f2e6cf', '#e9d8b8'], techo: '#b34a30', sep: 60 }); M.iglesia(x, 480, 292, 1.4); },
        cerca(x, r) { [120, 360, 600, 840].forEach(i => M.arbol(x, i, 308, 70, '#3a8432')); M.faroles(x, { base: 308, alto: 60, sep: 240 }); },
        frente(x) { M.papelPicado(x, ['#3f8ad8', '#ffffff', '#3f8ad8', '#ffd34a']); } },
      { nombre: 'Río y puente', cielo: ['#5a6ab0', '#e08a7a', '#ffc890', '#ffe8b8'], sol: { x: 400, y: 200, r: 30, c: '#ffe8a0' }, rayos: true, luz: '#ffd8a0', nubes: { n: 3, y: 110, dy: 40, s: 1.2, col: '#ffc8a8', sombra: '#d08888' },
        lejos(x, r) { M.cordillera(x, r, { base: 230, amp: 70, col: '#8a7a9a', k: [2, 5, 12] }); },
        lejos2(x, r) { M.bosque(x, r, { base: 262, alto: 14, col: '#5a6a5a' }); },
        medio(x, r) { M.agua(x, 272, '#4a7ab0', { brillo: 400, brilloCol: '#ffd8a0' }); M.puente(x, { x0: 200, x1: 640, y: 264 }); M.juncos(x, { base: 294, col: '#4a6a3a' }); },
        cerca(x, r) { M.mesetas(x, r, { n: 3, base: 308, w: [60, 100], h: [60, 120], col: '#4a3a44', pasto: '#3f6a34' }); for (let i = 160; i < W; i += 320) M.arbol(x, i, 306, 96, '#2f5a30'); },
        frente(x) { M.lianas(x, '#1a2a1e'); } }
    ],
    sutiaba: [
      { nombre: 'Iglesia y Tamarindón', cielo: ['#e8805a', '#f6b882', '#fde4b4'], sol: { x: 760, y: 120, r: 26, c: '#fff0b0' }, luz: '#ffe0a8', nubes: { n: 3, y: 80, dy: 40, s: 1.1, col: '#ffe0c8', sombra: '#eaa080' },
        lejos(x, r) { M.colinas(x, r, { base: 236, amp: 30, col: '#d09a7a', k: 2 }); M.volcan(x, 180, 240, 200, 70, '#c08a80', false); },
        lejos2(x, r) { M.casas(x, r, { n: 14, base: 266, alto: [18, 24], cols: ['#e8c8a0', '#e0b890'], techo: '#a65040' }); },
        medio(x, r) { P.rect(x, 0, 290, W, 70, '#b88a5a'); M.iglesia(x, 260, 292, 1.35); M.tamarindon(x, 640, 292, 1.3); M.casas(x, r, { n: 4, base: 292, alto: [30, 34], cols: ['#e8c79a'], techo: '#a5442e', sep: 210 }); M.iglesia(x, 260, 292, 1.35); M.tamarindon(x, 640, 292, 1.3); },
        cerca(x, r) { M.bosque(x, r, { base: 304, alto: 30, col: '#3f6a2c', paso: 30 }); },
        frente(x) { M.papelPicado(x, ['#e94f64', '#f2c94c', '#3f8ad8', '#2e8b57']); } },
      { nombre: 'Fiesta en la calle', cielo: ['#f08a5a', '#f8c088', '#fde8bc'], sol: { x: 200, y: 110, r: 24, c: '#fff0b0' }, luz: '#ffe0a8',
        lejos(x, r) { M.colinas(x, r, { base: 230, amp: 30, col: '#d8a080', k: 3 }); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 262, alto: [24, 30], cols: ['#e6c49c', '#ddb48c'], techo: '#a65040' }); },
        medio(x, r) { M.casas(x, r, { n: 8, base: 290, alto: [40, 52], cols: ['#e8c79a', '#f0d9b5', '#e3b98a', '#d98a6a'], techo: '#a5442e', farol: true }); for (let i = 0; i < W; i += 8) P.rect(x, i, 226 + Math.sin(TAU * i / W * 8) * 6, 6, 7, ['#e94f64', '#f2c94c', '#3f8ad8', '#2e8b57'][(i / 8) % 4]); },
        cerca(x, r) { M.casas(x, r, { n: 3, base: 312, alto: [130, 160], cols: ['#b57446', '#9a6040'], techo: '#6a2a1e', sep: 200 }); },
        frente(x) { M.papelPicado(x, ['#e94f64', '#f2c94c', '#3f8ad8', '#ffffff']); } },
      { nombre: 'Bajo el Tamarindón', cielo: ['#e07a50', '#f2b07a', '#fde0b0'], sol: { x: 560, y: 150, r: 28, c: '#fff0b0' }, rayos: true, luz: '#ffdca0',
        lejos(x, r) { M.iglesia(x, 760, 252, 0.8); M.colinas(x, r, { base: 258, amp: 16, col: '#cc9474', k: 3 }); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 272, alto: [20, 26], cols: ['#e2be98'], techo: '#a65040' }); },
        medio(x, r) { P.rect(x, 0, 290, W, 70, '#a8784a'); M.tamarindon(x, 300, 292, 1.6); M.tamarindon(x, 780, 292, 1.2); },
        cerca(x, r) { M.tamarindon(x, 100, 320, 3.2); M.tamarindon(x, 600, 320, 2.8); },
        frente(x) { M.lianas(x, '#24401e'); } },
      { nombre: 'Taller de máscaras', cielo: ['#c8603e', '#eaa070', '#f8d8a8'], sol: { x: 120, y: 90, r: 22, c: '#fff0b0' }, luz: '#ffd8a0',
        lejos(x, r) { M.colinas(x, r, { base: 226, amp: 26, col: '#c88a6a', k: 2 }); },
        lejos2(x, r) { M.casas(x, r, { n: 10, base: 258, alto: [26, 32], cols: ['#ddb48c'], techo: '#a65040' }); },
        medio(x, r) { M.arcos(x, { base: 292, alto: 96, n: 8, col: '#e8c79a', hueco: '#6a3a24', techo: '#a5442e', mascaras: ['#f4d2b0', '#f2e6cf', '#e8b0a0', '#ffd8a8'] }); },
        cerca(x, r) { M.arcos(x, { base: 316, alto: 120, n: 4, col: '#a8744a', hueco: '#3a2014', techo: '#7a3424' }); },
        frente(x) { M.alero(x, '#5a2e1e'); } },
      { nombre: 'Noche de pólvora', cielo: ['#121838', '#262c60', '#4a3e72'], estrellas: 90, luz: '#b8b0ff',
        lejos(x, r) { M.fuegos(x, { p: [[160, 70, '#ff6b8a', 34], [480, 50, '#ffd34a', 40], [760, 90, '#7fd0ee', 30]] }); M.colinas(x, r, { base: 240, amp: 20, col: '#3a3a6a', k: 3 }); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 266, alto: [22, 28], cols: ['#4a4470'], techo: '#3a2a4a', luz: '#ffd76a' }); },
        medio(x, r) { P.rect(x, 0, 290, W, 70, '#3a3050'); M.iglesia(x, 480, 292, 1.5); M.casas(x, r, { n: 4, base: 292, alto: [30, 36], cols: ['#5a4a6a'], techo: '#4a2a3a', luz: '#ffd76a', sep: 200 }); M.iglesia(x, 480, 292, 1.5); },
        cerca(x, r) { M.bosque(x, r, { base: 306, alto: 30, col: '#1e2a2a', paso: 30 }); },
        frente(x) { M.papelPicado(x, ['#e94f64', '#f2c94c', '#3f8ad8']); } }
    ],
    centro: [
      { nombre: 'Catedral al atardecer', cielo: ['#2a2662', '#7a4a8a', '#e88a62', '#ffc890'], sol: { x: 120, y: 220, r: 26, c: '#ffd890' }, rayos: true, luz: '#ffc890',
        lejos(x, r) { M.cordillera(x, r, { base: 240, amp: 40, col: '#6a4a7a', k: [3, 7, 16] }); M.volcan(x, 820, 244, 160, 70, '#5a4070', true); },
        lejos2(x, r) { M.casas(x, r, { n: 14, base: 270, alto: [22, 30], cols: ['#a07080', '#906878'], techo: '#6a3a4a' }); },
        medio(x, r) { P.rect(x, 0, 290, W, 70, '#8a8378'); M.catedral(x, 400, 294, 1.5); M.casas(x, r, { n: 5, base: 292, alto: [44, 52], cols: ['#e7c27a', '#d6886a', '#9fc0c9', '#e9d29a'], techo: '#a9442e', sep: 140, farol: true }); M.catedral(x, 400, 294, 1.5); },
        cerca(x, r) { [60, 300, 700, 900].forEach(i => M.arbol(x, i, 312, 84, '#2f5a3a')); M.faroles(x, { base: 312, alto: 70, sep: 320 }); },
        frente(x) { M.farolesColg(x, { col: '#1e1828' }); } },
      { nombre: 'Calle hacia la Catedral', cielo: ['#342e70', '#8a5a9a', '#f0a070'], sol: { x: 760, y: 230, r: 22, c: '#ffd890' }, luz: '#ffc890',
        lejos(x, r) { M.catedral(x, 300, 250, 0.7); M.colinas(x, r, { base: 252, amp: 12, col: '#6a4e7e', k: 4 }); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 270, alto: [28, 34], cols: ['#b08a90', '#a07a8a'], techo: '#7a4050' }); },
        medio(x, r) { M.casas(x, r, { n: 8, base: 292, alto: [46, 60], cols: ['#e7c27a', '#d6886a', '#9fc0c9', '#e9d29a'], techo: '#a9442e', farol: true, luz: '#ffd76a' }); },
        cerca(x, r) { M.casas(x, r, { n: 3, base: 316, alto: [150, 180], cols: ['#7a5a6a', '#6a4a5a'], techo: '#4a2430', sep: 220, luz: '#ffd76a' }); },
        frente(x) { M.alero(x, '#3a1e24'); } },
      { nombre: 'Techos de la Catedral', cielo: ['#3e98dc', '#9ad2f2', '#eef4ea'], sol: { x: 700, y: 60, r: 16, c: '#fffbe0' }, luz: '#ffffff', nubes: { n: 5, y: 70, dy: 50, s: 1.3, col: '#ffffff', sombra: '#cfe0ec' },
        lejos(x, r) { M.volcan(x, 200, 236, 180, 80, '#8a90a8', true); M.volcan(x, 420, 238, 150, 60, '#9298ae', false); M.volcan(x, 640, 236, 200, 90, '#868ca4', true); M.volcan(x, 860, 240, 140, 56, '#9aa0b4', false); M.colinas(x, r, { base: 246, amp: 8, col: '#9cb8a8', k: 5 }); },
        lejos2(x, r) { M.tejados(x, r, { base: 262, filas: 2, cols: ['#b8705a', '#a8604a'], pared: '#d8c8a8' }); },
        medio(x, r) { M.cupulas(x, { base: 286 }); },
        cerca(x, r) { P.rect(x, 0, 296, W, 70, '#e4e0d4'); for (let i = 0; i < W; i += 14) { P.rect(x, i, 270, 8, 26, '#f2efe6'); P.ellipse(x, i + 4, 270, 5, 3, '#f2efe6'); } P.rect(x, 0, 266, W, 5, '#d8d4c6'); for (let i = 120; i < W; i += 320) { P.ellipse(x, i, 250, 34, 26, '#e6e2d6'); P.ellipse(x, i - 3, 247, 29, 22, '#ffffff'); P.rect(x, i - 2, 210, 4, 16, '#c9a43e'); P.rect(x, i - 8, 216, 16, 3, '#c9a43e'); } },
        frente(x) { } },
      { nombre: 'Portales del centro', cielo: ['#2a2662', '#7a4a8a', '#e88a62'], sol: { x: 820, y: 230, r: 22, c: '#ffd890' }, luz: '#ffc890', estrellas: 30,
        lejos(x, r) { M.catedral(x, 200, 248, 0.7); M.colinas(x, r, { base: 250, amp: 10, col: '#5a4a7a', k: 3 }); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 268, alto: [26, 32], cols: ['#a07080'], techo: '#6a3a4a' }); },
        medio(x, r) { M.arcos(x, { base: 292, alto: 90, n: 9, col: '#e7c27a', hueco: '#5a3a2a', techo: '#a9442e', farol: true }); },
        cerca(x, r) { M.arcos(x, { base: 318, alto: 120, n: 4, col: '#8a6040', hueco: '#2a1a14', techo: '#5a2a1e' }); },
        frente(x) { M.alero(x, '#3a2018'); } },
      { nombre: 'Parque y leones', cielo: ['#342e70', '#9a5a8a', '#f2a068', '#ffd090'], sol: { x: 500, y: 236, r: 24, c: '#ffd890' }, rayos: true, luz: '#ffc890',
        lejos(x, r) { M.catedral(x, 700, 250, 0.9); M.colinas(x, r, { base: 254, amp: 10, col: '#6a4a7a', k: 3 }); },
        lejos2(x, r) { M.bosque(x, r, { base: 272, alto: 14, col: '#5a5a6a' }); },
        medio(x, r) { P.rect(x, 0, 290, W, 70, '#a39b8f'); M.kiosko(x, 300, 292); [140, 460].forEach(cx => { P.rect(x, cx - 16, 262, 32, 30, '#d8cfbd'); P.rect(x, cx - 18, 260, 36, 4, '#e8e0cc'); P.ellipse(x, cx, 252, 15, 9, '#c9a43e'); P.circle(x, cx - 10, 246, 6, '#d9b44e'); }); M.arbol(x, 620, 292, 60, '#4a7a4a'); M.arbol(x, 860, 292, 50, '#4a7a4a'); },
        cerca(x, r) { M.bosque(x, r, { base: 310, alto: 36, col: '#2a3a3a', paso: 34 }); M.faroles(x, { base: 310, alto: 76, sep: 240 }); },
        frente(x) { M.farolesColg(x, { col: '#1e1828' }); } }
    ],
    callereal: [
      { nombre: 'Calle Real con faroles', cielo: ['#0a1030', '#1c2756', '#33447a'], luna: { x: 600, y: 70, r: 20, c: '#fff4cf' }, estrellas: 140, luz: '#a8b8ff',
        lejos(x, r) { M.colinas(x, r, { base: 244, amp: 20, col: '#24305a', k: 3 }); M.iglesia(x, 760, 250, 0.7); },
        lejos2(x, r) { M.casas(x, r, { n: 12, base: 268, alto: [26, 32], cols: ['#3a4270'], techo: '#2a2440', luz: '#ffd76a' }); },
        medio(x, r) { M.casas(x, r, { n: 8, base: 294, alto: [50, 64], cols: ['#8a5a4a', '#9a8a5a', '#5a7080', '#8a6070'], techo: '#5a2620', farol: true, luz: '#ffd76a', puerta: '#2a1a14' }); },
        cerca(x, r) { M.faroles(x, { base: 314, alto: 110, sep: 320 }); M.casas(x, r, { n: 3, base: 318, alto: [160, 190], cols: ['#2e2a40', '#262236'], techo: '#1e1420', sep: 230, luz: '#ffd76a' }); },
        frente(x) { M.alero(x, '#1e1418'); } },
      { nombre: 'Callejón', cielo: ['#0b1130', '#1c2756', '#2e3e74'], luna: { x: 220, y: 90, r: 18, c: '#fff4cf' }, estrellas: 120, luz: '#a8b8ff',
        lejos(x, r) { M.casas(x, r, { n: 14, base: 250, alto: [30, 40], cols: ['#26305a'], techo: '#1e2240', luz: '#e8c060' }); },
        lejos2(x, r) { M.casas(x, r, { n: 10, base: 272, alto: [40, 50], cols: ['#3a3e64', '#343a5e'], techo: '#2a2440', luz: '#ffd76a' }); },
        medio(x, r) { M.arcos(x, { base: 294, alto: 80, n: 8, col: '#6a5a6a', hueco: '#1e1424', techo: '#4a2424', farol: true }); },
        cerca(x, r) { M.casas(x, r, { n: 2, base: 320, alto: [190, 210], cols: ['#24203a'], techo: '#140e1a', sep: 360, luz: '#ffd76a' }); },
        frente(x) { M.farolesColg(x, { col: '#120c18' }); } },
      { nombre: 'Desde los tejados', cielo: ['#0b1130', '#1a2550', '#2a3a70'], luna: { x: 760, y: 70, r: 24, c: '#fff4cf' }, estrellas: 160, luz: '#b0c0ff',
        lejos(x, r) { M.catedral(x, 300, 236, 0.6); M.iglesia(x, 700, 240, 0.5); M.colinas(x, r, { base: 244, amp: 8, col: '#1e2850', k: 5 }); },
        lejos2(x, r) { M.tejados(x, r, { base: 256, filas: 2, cols: ['#4a2a34', '#3e2430'], pared: '#3a3a5a', luz: '#ffd76a' }); },
        medio(x, r) { M.tejados(x, r, { base: 282, filas: 2, cols: ['#6a2e24', '#7a3a2a'], pared: '#5a5070', luz: '#ffd76a' }); },
        cerca(x, r) { M.tejados(x, r, { base: 312, filas: 1, cols: ['#3a1a16'], pared: '#2a2236' }); },
        frente(x) { } },
      { nombre: 'Luna llena', cielo: ['#141c44', '#2a3a74', '#4a5a94'], luna: { x: 480, y: 130, r: 56, c: '#fff4cf' }, estrellas: 60, luz: '#e8ecff',
        lejos(x, r) { M.cordillera(x, r, { base: 240, amp: 40, col: '#2a3a6a', k: [2, 5, 12] }); },
        lejos2(x, r) { M.bosque(x, r, { base: 268, alto: 14, col: '#22305a' }); },
        medio(x, r) { M.casas(x, r, { n: 9, base: 294, alto: [40, 56], cols: ['#3a3e60', '#34385a'], techo: '#241c30', luz: '#ffd76a' }); },
        cerca(x, r) { [100, 420, 760].forEach(i => M.arbol(x, i, 318, 120, '#141c2a', '#0e0e18')); },
        frente(x) { M.lianas(x, '#0e1418'); } },
      { nombre: 'Noche de niebla', cielo: ['#1a2040', '#2e3a5e', '#4a5a7a'], luna: { x: 300, y: 80, r: 18, c: '#e8e8f8' }, estrellas: 40, luz: '#c8d0f0',
        lejos(x, r) { M.casas(x, r, { n: 12, base: 250, alto: [30, 40], cols: ['#34405e'], techo: '#262c46' }); M.niebla(x, 248, 0.5); },
        lejos2(x, r) { M.casas(x, r, { n: 10, base: 274, alto: [40, 50], cols: ['#3e4662'], techo: '#2a2a44', luz: '#e8c070' }); M.niebla(x, 270, 0.45); },
        medio(x, r) { M.casas(x, r, { n: 8, base: 294, alto: [50, 60], cols: ['#4a4a5e', '#545064'], techo: '#2a2430', farol: true, luz: '#ffd76a' }); M.niebla(x, 290, 0.35); },
        cerca(x, r) { M.faroles(x, { base: 316, alto: 120, sep: 300 }); },
        frente(x) { M.alero(x, '#16121c'); } }
    ],
    poneloya: [
      { nombre: 'Playa al atardecer', cielo: ['#ff8a62', '#ffc086', '#ffe6b0'], sol: { x: 480, y: 196, r: 32, c: '#fff0a0' }, rayos: true, luz: '#ffe0a0', nubes: { n: 3, y: 90, dy: 40, s: 1.2, col: '#ffd8c0', sombra: '#f0a07e' },
        lejos(x, r) { M.agua(x, 210, '#3a8ec0', { brillo: 480 }); },
        lejos2(x, r) { M.mesetas(x, r, { n: 2, base: 262, w: [40, 60], h: [40, 70], col: '#7a5a58' }); },
        medio(x, r) { P.rect(x, 0, 284, W, 80, '#efd690'); M.ranchos(x, { base: 288, xs: [560, 620, 680] }); for (let i = 120; i < W; i += 260) M.palma(x, i, 290, 60, '#3a8a3a'); },
        cerca(x, r) { for (let i = 40; i < W; i += 300) M.palma(x, i, 310, 140, '#245a2a', '#6a4a2a'); },
        frente(x) { M.hojasPalma(x); } },
      { nombre: 'El muelle', cielo: ['#ff9a6a', '#ffc890', '#ffeec0'], sol: { x: 760, y: 190, r: 28, c: '#fff0a0' }, luz: '#ffe0a0', nubes: { n: 4, y: 80, dy: 40, s: 1, col: '#ffd8c0', sombra: '#f0a07e' },
        lejos(x, r) { M.agua(x, 206, '#3a8ec0', { brillo: 760 }); M.bote(x, 300, 216, 0.6); },
        lejos2(x, r) { M.mesetas(x, r, { n: 2, base: 250, w: [30, 50], h: [30, 50], col: '#7a6060' }); M.agua(x, 250, '#3486ba'); },
        medio(x, r) { M.agua(x, 266, '#2e7eb2'); M.muelle(x, { y: 272 }); },
        cerca(x, r) { for (let i = 200; i < W; i += 480) M.palma(x, i, 312, 150, '#245a2a', '#6a4a2a'); },
        frente(x) { M.hojasPalma(x); } },
      { nombre: 'Rocas de la costa', cielo: ['#ff8f66', '#ffc48a', '#ffe9b5'], sol: { x: 300, y: 170, r: 30, c: '#fff0a0' }, rayos: true, luz: '#ffe0a0',
        lejos(x, r) { M.agua(x, 214, '#3a8ec0', { brillo: 300 }); },
        lejos2(x, r) { M.mesetas(x, r, { n: 4, base: 268, w: [40, 70], h: [70, 130], col: '#8a6a68', pasto: '#7a9a4a' }); M.agua(x, 266, '#3486ba'); },
        medio(x, r) { M.mesetas(x, r, { n: 3, base: 294, w: [60, 90], h: [60, 100], col: '#6e5450', pasto: '#6a8a3e' }); for (let i = 0; i < W; i += 10) P.ellipse(x, i, 292 + Math.sin(i) * 2, 8, 3, '#ffffff'); },
        cerca(x, r) { M.mesetas(x, r, { n: 2, base: 316, w: [100, 140], h: [150, 210], col: '#4a3434', pasto: '#4a6a2e', palma: '#1f4a24' }); },
        frente(x) { M.rocaTecho(x, '#2a1c1c'); } },
      { nombre: 'Palmar', cielo: ['#ffa070', '#ffd09a', '#fff0c8'], sol: { x: 640, y: 160, r: 26, c: '#fff0a0' }, luz: '#ffe8b0', nubes: { n: 3, y: 90, dy: 30, s: 1, col: '#ffe0c8', sombra: '#f0b088' },
        lejos(x, r) { M.agua(x, 220, '#3a8ec0', { brillo: 640 }); },
        lejos2(x, r) { P.rect(x, 0, 254, W, 110, '#e8c880'); for (let i = 0; i < W; i += 60) M.palma(x, i, 258, 34, '#5a9a4a'); },
        medio(x, r) { P.rect(x, 0, 284, W, 80, '#efd690'); for (let i = 30; i < W; i += 120) M.palma(x, i, 288, 64, '#3a8a3a'); },
        cerca(x, r) { for (let i = 100; i < W; i += 240) M.palma(x, i, 312, 160, '#245a2a', '#6a4a2a'); },
        frente(x) { M.hojasPalma(x, '#1a3e1e'); } },
      { nombre: 'Luna sobre el mar', cielo: ['#0e1a40', '#24386e', '#3a5a8e'], luna: { x: 320, y: 100, r: 28, c: '#fff4cf' }, estrellas: 120, luz: '#c8d8ff',
        lejos(x, r) { M.agua(x, 214, '#1a4a78', { brillo: 320, brilloCol: '#fff4cf' }); },
        lejos2(x, r) { M.mesetas(x, r, { n: 2, base: 262, w: [40, 60], h: [40, 70], col: '#2a3450' }); },
        medio(x, r) { P.rect(x, 0, 286, W, 80, '#7a7a8a'); M.ranchos(x, { base: 290, xs: [600, 660, 720], luz: '#ffd76a' }); for (let i = 200; i < W; i += 300) M.palma(x, i, 292, 60, '#1f3a2a', '#3a2a22'); },
        cerca(x, r) { for (let i = 40; i < W; i += 340) M.palma(x, i, 312, 150, '#0e2018', '#2a1a14'); },
        frente(x) { M.hojasPalma(x, '#0a1810'); } }
    ]
  };
  for (const id in ESC) Z[id].escenas = ESC[id];
  EL.ESCENAS_ZONA = ESC;
  EL.ZONA_ARTE = Z;

  /* ---------- Capas prerenderizadas (una por escenario de la zona) ---------- */
  const capas = {}, FACT = { lejos: 0.06, lejos2: 0.16, medio: 0.3, cerca: 0.5 };
  EL.capasZona = function (id, e = 0) {
    const key = id + '|' + e; if (capas[key]) return capas[key];
    const z = Z[id], esc = z.escenas && z.escenas[e % z.escenas.length], r = EL.rng(id.length * 7919 + 13 + e * 101);
    if (!esc) {   // escenario único (Gritería)
      const cielo = EL.canvas(640, 360); P.grad(cielo.x, 0, 0, 640, 360, z.cielo);
      const lejos = EL.canvas(W, H), medio = EL.canvas(W, H), cerca = EL.canvas(W, H); z.lejos(lejos.x, r); z.medio(medio.x, r); z.cerca(cerca.x, r);
      acabado(medio, '#ffe8b0', 0.8); tinte(lejos, z.cielo[z.cielo.length - 1], 0.3);
      return (capas[key] = { cielo, planos: [[lejos, 0.12], [medio, 0.35], [cerca, 0.7]], frente: null, nombre: '' });
    }
    const cielo = cieloEscena(esc, r), horiz = esc.cielo[esc.cielo.length - 1], luz = esc.luz || '#fff0c8';
    const planos = [];
    [['lejos', 0.5, 0.45], ['lejos2', 0.32, 0.7], ['medio', 0.14, 0.9], ['cerca', 0, 1]].forEach(([n, velo, f]) => {
      if (!esc[n]) return; const cv = EL.canvas(W, H); esc[n](cv.x, r); acabado(cv, luz, f);
      if (velo) tinte(cv, horiz, velo); else tinte(cv, esc.sombra || '#1a1430', 0.3);   // el plano cercano, más oscuro: no se confunde con el suelo del juego
      planos.push([cv, FACT[n]]);
    });
    let frente = null; if (esc.frente) { frente = EL.canvas(W, 70); esc.frente(frente.x, r); acabado(frente, luz, 0.5); }
    return (capas[key] = { cielo, planos, frente, nombre: esc.nombre });
  };
  EL.nEscenas = id => (Z[id] && Z[id].escenas) ? Z[id].escenas.length : 1;
  EL.nombreEscena = (id, e) => (Z[id] && Z[id].escenas && Z[id].escenas[e]) ? Z[id].escenas[e].nombre : '';
  const rep = (x, cv, off) => { x.drawImage(cv, off, 0); x.drawImage(cv, off + W, 0); if (off + 2 * W < 640) x.drawImage(cv, off + 2 * W, 0); };
  EL.dibujarFondo = function (x, id, camX, t = 0, e = 0, alfa = 1) {
    const c = EL.capasZona(id, e);
    x.globalAlpha = alfa;
    x.drawImage(c.cielo, 0, 0);
    if (c.cielo.nubes) rep(x, c.cielo.nubes, Math.floor(-(camX * 0.03 + t * 4) % W) - (camX * 0.03 + t * 4 < 0 ? 0 : 0));
    c.planos.forEach(([cv, f]) => rep(x, cv, Math.floor(-(camX * f) % W)));
    x.globalAlpha = 1;
  };
  // plano delantero: pasa más rápido que el juego, solo en la franja de arriba
  EL.dibujarFrente = function (x, id, camX, e = 0, alfa = 1) {
    const c = EL.capasZona(id, e); if (!c.frente) return;
    x.globalAlpha = 0.92 * alfa; rep(x, c.frente, Math.floor(-(camX * 1.25) % W)); x.globalAlpha = 1;
  };

  /* ---------- Bloques del suelo por zona ---------- */
  const bloques = {};
  EL.bloquesZona = function (id) {
    if (bloques[id]) return bloques[id];
    const s = Z[id].suelo, r = EL.rng(id.length * 31 + 7);
    const mk = (fn) => { const c = EL.canvas(16, 16); fn(c.x); return c; };
    const relleno = mk(x => {
      P.rect(x, 0, 0, 16, 16, s.tierra);
      if (s.adoquin) { for (let j = 0; j < 16; j += 6) for (let i = (j / 6 % 2) * 4; i < 16; i += 8) { P.rect(x, i, j, 7, 5, s.roca); P.rect(x, i, j + 4, 7, 1, s.tierraS); } }
      else { for (let i = 0; i < 7; i++) P.rect(x, r() * 15, r() * 15, 2, 1, s.tierraS); for (let i = 0; i < 2; i++) { const a = r() * 12, b = r() * 12; P.rect(x, a, b, 3, 2, s.roca); P.rect(x, a, b + 2, 3, 1, s.tierraS); } }
    });
    const tope = mk(x => {
      x.drawImage(relleno, 0, 0);
      if (s.adoquin) { P.rect(x, 0, 0, 16, 4, s.pasto); P.rect(x, 0, 4, 16, 1, s.pastoS); for (let i = 0; i < 16; i += 5) P.rect(x, i, 0, 1, 4, s.pastoS); }
      else if (s.arena) { P.rect(x, 0, 0, 16, 5, s.pasto); P.rect(x, 0, 5, 16, 1, s.pastoS); for (let i = 0; i < 5; i++) P.rect(x, r() * 15, r() * 4, 1, 1, '#fff2c4'); }
      else { P.rect(x, 0, 0, 16, 5, s.pasto); P.rect(x, 0, 0, 16, 1, EL.shade(s.pasto, 0.25)); for (let i = 0; i < 16; i += 2) P.rect(x, i, 5, 1, 1 + ((i * 5) % 3), s.pastoS); P.rect(x, 0, 5, 16, 1, s.pastoS); }
    });
    const tabla = mk(x => {
      P.rect(x, 0, 0, 16, 5, '#a8743e'); P.rect(x, 0, 0, 16, 1, '#d29a5a'); P.rect(x, 0, 4, 16, 1, '#5e3a1e');
      P.rect(x, 7, 0, 1, 5, '#5e3a1e'); P.rect(x, 2, 5, 2, 6, '#6e4426'); P.rect(x, 12, 5, 2, 6, '#6e4426'); P.line(x, 3, 6, 12, 10, '#6e4426');
    });
    const zid = id;
    const espina = mk(x => {
      if (zid === 'poneloya') { P.circle(x, 8, 12, 4, '#3a2a4a'); for (let a = 0; a < 8; a++) P.line(x, 8, 12, 8 + Math.cos(a * 0.8) * 7, 12 + Math.sin(a * 0.8) * 6, '#5a3a6a'); P.rect(x, 0, 15, 16, 1, '#2a1a2a'); }
      else if (zid === 'leonviejo') { P.poly(x, [[0, 16], [4, 6], [8, 12], [11, 4], [16, 16]], '#3a2e2e'); P.rect(x, 4, 8, 1, 2, '#ff7a2a'); P.rect(x, 11, 6, 1, 3, '#ff9a3a'); P.rect(x, 7, 12, 2, 1, '#ffb04a'); }
      else if (zid === 'centro' || zid === 'callereal' || zid === 'griteria') { P.rect(x, 0, 13, 16, 3, '#2a2230'); for (let i = 1; i < 16; i += 5) { P.rect(x, i, 4, 2, 10, '#3a3448'); P.poly(x, [[i - 1, 5], [i + 1, 0], [i + 3, 5]], '#c9c2d6'); } P.rect(x, 0, 9, 16, 1, '#3a3448'); }
      else { P.poly(x, [[0, 16], [3, 4], [6, 16]], '#4a6a2a'); P.poly(x, [[5, 16], [8, 2], [11, 16]], '#5f8a32'); P.poly(x, [[10, 16], [13, 5], [16, 16]], '#4a6a2a'); P.rect(x, 8, 2, 1, 2, '#e8e2c8'); P.rect(x, 3, 4, 1, 2, '#e8e2c8'); P.rect(x, 13, 5, 1, 2, '#e8e2c8'); }
    });
    const piedra = mk(x => {
      P.rect(x, 0, 0, 16, 16, '#7a6e66'); for (let j = 0; j < 16; j += 5) for (let i = (j / 5 % 2) * 4 - 4; i < 16; i += 8) { P.rect(x, i + 1, j + 1, 7, 4, '#968a80'); P.rect(x, i + 1, j + 1, 7, 1, '#b0a498'); }
    });
    bloques[id] = { relleno, tope, tabla, espina, piedra, s };
    return bloques[id];
  };

  /* ---------- Objetos del juego ---------- */
  EL.dibujarEco = function (x, cx, cy, t, grande = false) {
    const b = Math.round(Math.sin(t * 4 + cx * 0.1) * 2), r = grande ? 9 : 4;
    if (grande) { P.circle(x, cx, cy + b, r + 6, 'rgba(255,230,140,0.25)'); for (let i = 0; i < 3; i++) { const rr = r + 3 + ((t * 20 + i * 6) % 18); x.strokeStyle = 'rgba(255,240,170,' + (0.6 - rr / 40) + ')'; x.lineWidth = 1; x.beginPath(); x.arc(cx, cy + b, rr, 0, 7); x.stroke(); } }
    P.circle(x, cx, cy + b, r + 1, '#7a4a10'); P.circle(x, cx, cy + b, r, '#f2b632'); P.circle(x, cx - 1, cy + b - 1, r - 1, '#ffd96a');
    P.rect(x, cx - Math.floor(r / 2), cy + b - Math.floor(r / 2), 2, 2, '#fff6cf');
    if (!grande) { P.rect(x, cx - 1, cy + b - 1, 1, 3, '#b37a12'); P.rect(x, cx + 1, cy + b - 2, 1, 5, '#b37a12'); }
    else { P.rect(x, cx - 4, cy + b - 1, 1, 3, '#b37a12'); P.rect(x, cx - 2, cy + b - 3, 1, 7, '#b37a12'); P.rect(x, cx, cy + b - 5, 1, 11, '#b37a12'); P.rect(x, cx + 2, cy + b - 3, 1, 7, '#b37a12'); P.rect(x, cx + 4, cy + b - 1, 1, 3, '#b37a12'); }
  };
  EL.dibujarCorazon = function (x, X, Y, lleno) {
    const m = ['.11.11.', '1221221', '1222221', '.12221.', '..121..', '...1...'];
    m.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; x.fillStyle = ch === '1' ? '#1b1222' : (lleno ? (j < 2 && i < 3 ? '#ff8a9a' : '#e8344a') : '#5a5068'); x.fillRect(X + i * 2, Y + j * 2, 2, 2); }));
  };
  EL.dibujarFarolCheck = function (x, cx, base, encendido, t) {
    P.rect(x, cx - 1, base - 30, 3, 30, '#2a2230'); P.rect(x, cx - 5, base - 2, 11, 2, '#2a2230');
    P.rect(x, cx - 4, base - 42, 9, 12, '#2a2230');
    P.rect(x, cx - 3, base - 41, 7, 10, encendido ? (Math.sin(t * 8) > 0 ? '#ffd76a' : '#ffe48a') : '#4a4258');
    P.rect(x, cx - 5, base - 44, 11, 3, '#2a2230');
    if (encendido) P.circle(x, cx, base - 36, 16, 'rgba(255,215,106,0.15)');
  };
  EL.dibujarVerso = function (x, X, Y, activo, t) {
    if (activo) { P.rect(x, X, Y, 16, 6, '#7fe0ff'); P.rect(x, X, Y, 16, 1, '#e6fbff'); P.rect(x, X, Y + 5, 16, 1, '#3aa0c8'); P.rect(x, X + 6, Y - 6 + Math.round(Math.sin(t * 6 + X) * 1), 2, 5, '#bff3ff'); P.rect(x, X + 8, Y - 6 + Math.round(Math.sin(t * 6 + X)), 2, 2, '#bff3ff'); }
    else { for (let i = 0; i < 16; i += 4) { P.rect(x, X + i, Y, 2, 1, 'rgba(127,224,255,0.7)'); P.rect(x, X + i, Y + 5, 2, 1, 'rgba(127,224,255,0.7)'); } P.rect(x, X, Y, 1, 6, 'rgba(127,224,255,0.5)'); P.rect(x, X + 15, Y, 1, 6, 'rgba(127,224,255,0.5)'); }
  };
  EL.dibujarAgua = function (x, X, Y, sup, t) {
    x.fillStyle = 'rgba(40,140,200,0.62)'; x.fillRect(X, Y, 16, 16);
    if (sup) { const o = Math.round(Math.sin(t * 3 + X * 0.2) * 1.5); x.fillStyle = 'rgba(200,240,255,0.85)'; x.fillRect(X, Y + 2 + o, 16, 2); x.fillStyle = 'rgba(255,255,255,0.9)'; x.fillRect(X + ((t * 20 + X) % 16 | 0), Y + 1 + o, 4, 1); }
  };
  EL.dibujarRoca = function (x, cx, cy, r, rot) {
    P.circle(x, cx, cy, r + 1, '#1b1222'); P.circle(x, cx, cy, r, '#6e5c58'); P.circle(x, cx - 2, cy - 2, r - 3, '#8a7a72');
    P.rect(x, cx + Math.round(Math.cos(rot) * (r - 3)), cy + Math.round(Math.sin(rot) * (r - 3)), 2, 2, '#ff8a3a');
    P.rect(x, cx + Math.round(Math.cos(rot + 2.5) * (r - 4)), cy + Math.round(Math.sin(rot + 2.5) * (r - 4)), 2, 1, '#4a3a38');
  };
  /* ---------- Obstáculos de la naturaleza y del escenario ---------- */
  EL.dibujarCaida = function (x, tipo, cx, cy, rot) {
    if (tipo === 'teja') { // teja de barro que cae de un techo
      x.save(); x.translate(cx, cy); x.rotate(rot);
      P.rect(x, -9, -5, 18, 10, '#1b1222'); P.rect(x, -8, -4, 16, 8, '#c8553d'); P.rect(x, -8, -4, 16, 2, '#e8805f'); P.rect(x, -8, 2, 16, 2, '#8e3424');
      x.restore(); return;
    }
    if (tipo === 'coco') { P.circle(x, cx, cy, 8, '#1b1222'); P.circle(x, cx, cy, 7, '#6b4a2a'); P.circle(x, cx - 2, cy - 2, 3, '#8a6a3e'); P.rect(x, cx - 1, cy - 4, 2, 2, '#3a2414'); P.rect(x, cx + 2, cy - 3, 2, 2, '#3a2414'); return; }
    EL.dibujarRoca(x, cx, cy, 8, rot);
  };
  EL.dibujarBarril = function (x, cx, cy, r, rot) {
    P.circle(x, cx, cy, r + 1, '#1b1222'); P.circle(x, cx, cy, r, '#a8743e'); P.circle(x, cx, cy, r - 3, '#c48a4a');
    for (let k = 0; k < 4; k++) { const a = rot + k * Math.PI / 2; P.line(x, cx, cy, cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1), '#6b4226'); }
    P.circle(x, cx, cy, 2, '#3a3448');
  };
  /* Aviso grande y parpadeante: el obstáculo nunca aparece de la nada */
  EL.dibujarAviso = function (x, cx, cy, t, flecha = 'abajo') {
    if (Math.floor(t * 8) % 2) return;
    P.poly(x, [[cx, cy - 13], [cx - 12, cy + 9], [cx + 12, cy + 9]], '#1b1222');
    P.poly(x, [[cx, cy - 10], [cx - 9, cy + 7], [cx + 9, cy + 7]], '#ffd34a');
    P.rect(x, cx - 1, cy - 4, 3, 6, '#1b1222'); P.rect(x, cx - 1, cy + 3, 3, 2, '#1b1222');
    if (flecha === 'abajo') { P.rect(x, cx - 1, cy + 12, 3, 6, '#ff5a3a'); P.poly(x, [[cx - 5, cy + 17], [cx + 6, cy + 17], [cx, cy + 23]], '#ff5a3a'); }
    else { P.rect(x, cx - 22, cy, 8, 3, '#ff5a3a'); P.poly(x, [[cx - 22, cy - 4], [cx - 22, cy + 6], [cx - 28, cy + 1]], '#ff5a3a'); }
  };
  /* Campana de fin de zona (en un arco de madera) */
  EL.dibujarCampana = function (x, cx, base, t, sonando) {
    P.rect(x, cx - 22, base - 58, 5, 58, '#6b4226'); P.rect(x, cx + 17, base - 58, 5, 58, '#6b4226');
    P.rect(x, cx - 26, base - 62, 52, 6, '#8a5a32'); P.rect(x, cx - 26, base - 62, 52, 2, '#b07a4a'); P.rect(x, cx - 27, base - 63, 54, 1, '#1b1222');
    const a = sonando ? Math.sin(t * 18) * 0.35 : Math.sin(t * 2) * 0.05;
    x.save(); x.translate(cx, base - 56); x.rotate(a);
    P.rect(x, -1, 0, 3, 5, '#3a2a22');
    P.poly(x, [[-6, 5], [6, 5], [10, 20], [14, 26], [-14, 26], [-10, 20]], '#1b1222');
    P.poly(x, [[-5, 6], [5, 6], [9, 20], [12, 25], [-12, 25], [-9, 20]], '#f2c230');
    P.poly(x, [[-4, 7], [-1, 7], [-5, 24], [-10, 24]], '#ffe27a'); P.rect(x, -12, 23, 24, 2, '#b8860b');
    P.circle(x, 0, 28, 3, '#6b4a1e');
    x.restore();
    if (sonando) for (let i = 0; i < 3; i++) { const rr = 16 + ((t * 40 + i * 10) % 30); x.strokeStyle = 'rgba(255,230,140,' + (0.8 - rr / 50) + ')'; x.lineWidth = 2; x.beginPath(); x.arc(cx, base - 40, rr, -2.6, -0.5); x.stroke(); }
  };
  EL.dibujarCorazonItem = function (x, cx, cy, t) { const b = Math.round(Math.sin(t * 4) * 2); P.circle(x, cx, cy + b, 10, 'rgba(255,120,140,0.25)'); EL.dibujarCorazon(x, cx - 7, cy - 6 + b, true); };

  /* Pictogramas del tutorial (sin texto) */
  EL.dibujarPicto = function (x, tipo, cx, cy, t) {
    P.rect(x, cx - 14, cy - 12, 28, 24, '#fdf3dc'); P.rect(x, cx - 14, cy - 12, 28, 1, '#ffffff'); P.rect(x, cx - 15, cy - 13, 30, 1, '#1b1222'); P.rect(x, cx - 15, cy + 12, 30, 1, '#1b1222'); P.rect(x, cx - 15, cy - 12, 1, 24, '#1b1222'); P.rect(x, cx + 14, cy - 12, 1, 24, '#1b1222');
    P.rect(x, cx - 1, cy + 12, 3, 22, '#6b4a2a');
    const k = '#2a1a2e', b = Math.round(Math.sin(t * 5) * 1);
    if (tipo === 'mover') { P.poly(x, [[cx - 10, cy], [cx - 3, cy - 6], [cx - 3, cy + 6]], k); P.poly(x, [[cx + 10 + b, cy], [cx + 3 + b, cy - 6], [cx + 3 + b, cy + 6]], '#e8344a'); }
    if (tipo === 'saltar') { P.poly(x, [[cx, cy - 9 + b], [cx - 7, cy - 1 + b], [cx + 7, cy - 1 + b]], '#2e8b57'); P.rect(x, cx - 2, cy - 1 + b, 5, 8, '#2e8b57'); P.rect(x, cx - 8, cy + 8, 17, 2, k); }
    if (tipo === 'eco') EL.dibujarEco(x, cx, cy, t);
    if (tipo === 'peligro') { P.poly(x, [[cx - 9, cy + 7], [cx - 4, cy - 3], [cx, cy + 7]], '#4a6a2a'); P.poly(x, [[cx, cy + 7], [cx + 4, cy - 6], [cx + 9, cy + 7]], '#5f8a32'); P.line(x, cx - 10, cy - 9, cx + 10, cy + 9, '#e8344a'); P.line(x, cx - 9, cy - 9, cx + 11, cy + 9, '#e8344a'); }
    if (tipo === 'farol') EL.dibujarFarolCheck(x, cx, cy + 10, true, t);
    if (tipo === 'meta') EL.dibujarEco(x, cx, cy, t, true);
    if (tipo === 'doble') { P.poly(x, [[cx - 4, cy - 9 + b], [cx - 9, cy - 3 + b], [cx + 1, cy - 3 + b]], '#2e8b57'); P.poly(x, [[cx + 4, cy - 3 + b], [cx - 1, cy + 3 + b], [cx + 9, cy + 3 + b]], '#2e8b57'); }
  };
})();
