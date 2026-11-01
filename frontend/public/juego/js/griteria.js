/* eslint-disable */
/* Ecos de León · final: la Gritería (7 de diciembre). No se recogen ecos: todos celebran frente al altar de la Purísima. */
'use strict';
(function () {
  const P = EL.px;
  function altar(x, cx, base, t) {
    // estructura del altar con arco de flores y luces
    P.rect(x, cx - 46, base - 120, 92, 120, '#6b3f1f'); P.rect(x, cx - 42, base - 116, 84, 112, '#f9e7c0');
    P.ellipse(x, cx, base - 116, 46, 16, '#6b3f1f'); P.ellipse(x, cx, base - 116, 42, 13, '#f9e7c0');
    for (let i = 0; i < 26; i++) { const a = Math.PI + i / 25 * Math.PI, fx = cx + Math.cos(a) * 44, fy = base - 112 + Math.sin(a) * 18; P.circle(x, fx, fy, 3, ['#ff6b8a', '#ffd34a', '#ffffff', '#7fd0ee'][i % 4]); }
    for (let j = 0; j < 9; j++) { P.circle(x, cx - 44, base - 100 + j * 11, 3, ['#ff6b8a', '#ffd34a', '#ffffff'][j % 3]); P.circle(x, cx + 44, base - 100 + j * 11, 3, ['#ffffff', '#ff6b8a', '#ffd34a'][j % 3]); }
    // luces que titilan
    for (let i = 0; i < 12; i++) P.rect(x, cx - 40 + i * 7, base - 108, 2, 2, Math.sin(t * 6 + i) > 0 ? '#fff6b0' : '#ffb02a');
    // imagen de la Purísima (estilizada y respetuosa)
    P.circle(x, cx, base - 70, 22, 'rgba(255,246,176,0.35)');
    P.poly(x, [[cx, base - 84], [cx - 18, base - 22], [cx + 18, base - 22]], '#4f7fd0'); P.poly(x, [[cx, base - 80], [cx - 10, base - 22], [cx + 10, base - 22]], '#ffffff');
    P.circle(x, cx, base - 86, 6, '#f2d6bc'); P.rect(x, cx - 6, base - 92, 12, 4, '#4f7fd0'); P.rect(x, cx - 2, base - 74, 4, 6, '#f2d6bc');
    for (let i = 0; i < 7; i++) { const a = Math.PI + i / 6 * Math.PI; P.rect(x, cx + Math.cos(a) * 11, base - 88 + Math.sin(a) * 11, 2, 2, '#ffd34a'); }
    P.ellipse(x, cx, base - 20, 20, 4, '#c9a43e');
    // velas y flores al pie
    [-34, -24, 24, 34].forEach((dx, i) => { P.rect(x, cx + dx, base - 18, 3, 12, '#fff6cf'); P.rect(x, cx + dx + 1, base - 22 + Math.sin(t * 9 + i), 1, 3, '#ffb02a'); });
    P.rect(x, cx - 50, base - 8, 100, 8, '#c9a43e'); for (let i = 0; i < 10; i++) P.circle(x, cx - 45 + i * 10, base - 10, 3, ['#ff6b8a', '#ffffff', '#ffd34a'][i % 3]);
  }
  const REGALO = {
    'caña de azúcar': (x, X, Y) => { P.rect(x, X - 1, Y - 8, 3, 16, '#7fbf4a'); P.rect(x, X - 1, Y - 3, 3, 1, '#3f6a2a'); P.rect(x, X - 1, Y + 3, 3, 1, '#3f6a2a'); },
    'naranja': (x, X, Y) => { P.circle(x, X, Y, 5, '#1b1222'); P.circle(x, X, Y, 4, '#ff9a2a'); P.rect(x, X - 1, Y - 6, 2, 2, '#3f8a2e'); },
    'gofio': (x, X, Y) => { P.rect(x, X - 5, Y - 3, 10, 7, '#1b1222'); P.rect(x, X - 4, Y - 2, 8, 5, '#b07a3a'); },
    'limón dulce': (x, X, Y) => { P.circle(x, X, Y, 5, '#1b1222'); P.circle(x, X, Y, 4, '#d6e04a'); },
    'chimbomba': (x, X, Y) => { P.ellipse(x, X, Y - 2, 5, 6, '#1b1222'); P.ellipse(x, X, Y - 2, 4, 5, '#ff6b8a'); P.line(x, X, Y + 4, X + 1, Y + 10, '#ffffff'); },
    'pito de barro': (x, X, Y) => { P.ellipse(x, X, Y, 6, 4, '#1b1222'); P.ellipse(x, X, Y, 5, 3, '#c8553d'); P.rect(x, X + 4, Y - 1, 4, 2, '#c8553d'); },
    'cajeta': (x, X, Y) => { P.rect(x, X - 5, Y - 4, 10, 8, '#1b1222'); P.rect(x, X - 4, Y - 3, 8, 6, '#e8c07a'); P.rect(x, X - 4, Y - 3, 8, 2, '#fff2c4'); }
  };

  class Griteria {
    constructor(alTerminar) {
      this.t = 0; this.alTerminar = alTerminar; this.gritos = 0; this.fase = 'listo'; this.burbujas = []; this.chispas = []; this.regalos = []; this.salto = 0;
      this.pjs = ['explorador', 'dario', 'gigantona', 'enano', 'margarita', 'cadejo', 'punche'];
      this.ui();
      EL.voz.decir('Es 7 de diciembre. Pulsa gritar: ¿Quién causa tanta alegría?');
    }
    ui() {
      const c = EL.el('div', { id: 'gr-ui' }, `<div class="mj-barra"><button class="btn azul peq" id="gr-salir">🗺 Mapa</button><div class="tit-juego">¡La Gritería!</div><span class="stat">Hoy no hay ecos: ¡se celebra!</span></div>
        <div style="position:absolute;left:50%;bottom:28px;transform:translateX(-50%);display:flex;gap:14px"><button class="btn grande" id="gr-gritar">📣 ¡Gritar!</button><button class="btn azul" id="gr-polvora">🎆 Pólvora</button></div>`);
      EL.$('#ui').appendChild(c);
      EL.$('#gr-salir').onclick = () => { EL.audio.clic(); this.alTerminar(); };
      EL.$('#gr-gritar').onclick = () => this.gritar();
      EL.$('#gr-polvora').onclick = () => this.cohete();
    }
    cohete() { EL.audio.cohete(); this.chispas.push({ x: 120 + Math.random() * 400, y: 360, vy: -260 - Math.random() * 60, sube: true, c: ['#ffd34a', '#ff6b8a', '#7fe0ff', '#9be07a', '#ffffff'][Math.floor(Math.random() * 5)] }); }
    gritar() {
      if (this.fase !== 'listo') return; this.fase = 'gritando'; EL.audio.clic();
      this.burbujas = [{ quien: 'explorador', txt: '¿Quién causa tanta alegría?', t: 1.8 }];
      EL.voz.decir('¿Quién causa tanta alegría?');
      setTimeout(() => {
        this.burbujas = [{ quien: 'todos', txt: '¡La Concepción de María!', t: 2.4 }]; this.salto = 1.4; EL.voz.decir('¡La Concepción de María!');
        for (let i = 0; i < 4; i++) setTimeout(() => this.cohete(), i * 250); EL.audio.tambor();
        // la «gorra»: cada personaje recibe un regalo
        this.pjs.forEach((id, i) => { const g = EL.GORRA[(this.gritos * 3 + i) % EL.GORRA.length]; this.regalos.push({ i, g, t: 0, y0: 160 }); });
        this.gritos++;
        setTimeout(() => { this.fase = 'listo'; if (this.gritos === 3) this.final(); }, 2400);
      }, 1800);
    }
    final() {
      const d = EL.save.data; d.griteria = true; EL.save.guardar();
      const datos = EL.ZONAS.map(z => `<li><b>${z.nombre}:</b> ${z.dato}</li>`).join('');
      const c = EL.el('div', { class: 'capa oscurecer', id: 'gr-final' }, `<div class="tarjeta-fin panel" style="width:1000px;max-height:660px;text-align:left"><div class="cinta">¡Recuperaste los ecos!</div><div style="max-height:520px;overflow:auto">
        <div style="display:flex;justify-content:center;gap:10px;align-items:flex-end;margin:8px 0">${this.pjs.map(id => `<img class="px" style="height:${id === 'gigantona' ? 110 : 70}px" src="${EL.spriteURL(id, 4, EL.progreso.traje(id === 'enano' ? 'gigantona' : id))}">`).join('')}</div>
        <h3>Lo que aprendiste</h3><ul style="font-size:16px;line-height:1.35">${datos}</ul>
        <p style="font-size:15px;color:#5a5068">La historia del juego es ficticia; los datos culturales provienen de las fichas verificadas de Ecos de León. Las leyendas se presentan como tradición oral.</p>
        <p style="text-align:center;font-weight:800">${EL.EQUIPO}</p>
        </div><div class="fila-btn"><button class="btn" id="gr-fin">🗺 Volver al mapa</button><button class="btn azul" id="gr-mas">🎆 Seguir celebrando</button></div></div>`);
      EL.$('#ui').appendChild(c);
      EL.$('#gr-fin').onclick = () => this.alTerminar();
      EL.$('#gr-mas').onclick = () => c.remove();
    }
    actualizar(dt) {
      this.t += dt; if (this.salto > 0) this.salto -= dt;
      if (EL.input.pulso('salto') || EL.input.pulso('ok')) this.gritar();
      if (Math.random() < dt * 0.5) this.cohete();
      for (const b of this.burbujas) b.t -= dt; this.burbujas = this.burbujas.filter(b => b.t > 0);
      for (const r of this.regalos) r.t += dt;
      const nuevas = [];
      for (const ch of this.chispas) {
        if (ch.sube) { ch.y += ch.vy * dt; ch.vy += 120 * dt; if (ch.vy > -60) { ch.sube = false; ch.muerta = true; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; nuevas.push({ x: ch.x, y: ch.y, vx: Math.cos(a) * (60 + Math.random() * 50), vy: Math.sin(a) * (60 + Math.random() * 50), v: 1.3, c: ch.c }); } EL.audio.tambor(); } }
        else { ch.x += ch.vx * dt; ch.y += ch.vy * dt; ch.vy += 50 * dt; ch.v -= dt; if (ch.v <= 0) ch.muerta = true; }
      }
      this.chispas = this.chispas.filter(c => !c.muerta).concat(nuevas);
    }
    dibujar(x) {
      const t = this.t;
      EL.dibujarFondo(x, 'griteria', 0, t);
      for (const ch of this.chispas) { x.fillStyle = ch.c; x.fillRect(Math.round(ch.x), Math.round(ch.y), 2, 2); if (ch.sube) { x.fillStyle = 'rgba(255,220,150,0.5)'; x.fillRect(Math.round(ch.x), Math.round(ch.y) + 2, 1, 6); } }
      const b = EL.bloquesZona('griteria'); for (let c = 0; c < 40; c++) { x.drawImage(b.tope, c * 16, 300); x.drawImage(b.relleno, c * 16, 316); x.drawImage(b.relleno, c * 16, 332); x.drawImage(b.relleno, c * 16, 348); }
      altar(x, 520, 300, t);
      // personajes en fila frente al altar
      this.pjs.forEach((id, i) => {
        const traje = EL.progreso.traje(id === 'enano' ? 'gigantona' : id);
        const s = EL.sprite(id, this.salto > 0 && (Math.floor(t * 8) + i) % 2 ? 'salto' : 'quieto', traje);
        const X = 40 + i * 58, dy = this.salto > 0 ? -Math.abs(Math.sin((t * 7) + i)) * 14 : Math.round(Math.sin(t * 3 + i));
        x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(X - 6, 300, s.width - 4, 3);
        x.drawImage(s, X - 8, 302 - s.height + s.pad + dy);
        const r = this.regalos.filter(q => q.i === i).slice(-1)[0];
        if (r) { const k = Math.min(1, r.t / 0.8), ry = 60 + (300 - s.height - 70) * k; REGALO[r.g](x, X + s.width / 2 - 6, ry + (k >= 1 ? Math.sin(t * 4 + i) * 2 : 0)); }
      });
      // burbujas de diálogo
      for (const bb of this.burbujas) {
        x.font = 'bold 14px sans-serif'; const w = x.measureText(bb.txt).width + 24, X = bb.quien === 'todos' ? 220 : 60, Y = bb.quien === 'todos' ? 150 : 190;
        P.rect(x, X - 2, Y - 2, w + 4, 30, '#1b1222'); P.rect(x, X, Y, w, 26, '#fdf3dc'); P.poly(x, [[X + 20, Y + 26], [X + 34, Y + 26], [X + 22, Y + 38]], '#fdf3dc');
        x.fillStyle = '#c8553d'; x.fillText(bb.txt, X + 12, Y + 18);
      }
      x.font = 'bold 11px sans-serif'; x.fillStyle = '#fff3c4'; x.fillText('Gritos: ' + this.gritos + ' / 3', 12, 56);
    }
  }
  EL.Griteria = Griteria;
})();
