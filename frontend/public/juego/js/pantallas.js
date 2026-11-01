/* eslint-disable */
/* Ecos de León · pantallas con estilo de videojuego: inicio, narrador, mapa, zonas, partida, vestuario, minijuegos y ajustes */
'use strict';
(function () {
  const $ = EL.$, el = EL.el;
  const ui = () => $('#ui');
  const D = () => EL.save.data;
  const ECO = '<i class="icono-eco"></i>';

  /* ---------- Progreso (en la versión de prueba, todo está abierto) ---------- */
  const PG = EL.progreso = {
    zonaHecha: i => D().zonas.includes(EL.ZONAS[i].id),
    zonaAbierta(i) { if (EL.LIBRE || i === 0) return true; const z = EL.ZONAS[i]; if (z.final) return PG.todasHechas(); return D().zonas.includes(EL.ZONAS[i - 1].id); },
    todasHechas: () => EL.ZONAS.every((z, k) => z.final || PG.zonaHecha(k)),   // las 6 zonas completas: se abre la Gritería
    tiene: id => EL.LIBRE || D().personajes.includes(id),
    mjAbierto(id) { if (EL.LIBRE) return true; if (id === 'memoria') return !!(D().albumAbierto || D().tutorialHecho || D().zonas.includes('leonviejo')); /* no se vuelve a cerrar al repetir el tutorial */ const m = EL.MINIJUEGOS.find(q => q.id === id); return PG.tiene(m.personaje); },
    mjDato: id => D().minijuegos[id] || (D().minijuegos[id] = {}),
    difAbierta(id, d) { if (EL.LIBRE || d === 'f') return true; const m = PG.mjDato(id); return d === 'm' ? !!(m.f && m.f.gan) : !!(m.m && m.m.gan); },
    traje: id => { const t = (D().vestuario[id] || {}).usa || 'base'; return (EL.VESTUARIO[id] || []).some(v => v.id === t) ? t : 'base'; },
    tieneTraje: (id, t) => t === 'base' || ((D().vestuario[id] || {}).tiene || []).includes(t),
    siguienteZona() { const i = EL.ZONAS.findIndex((z, k) => !z.final && !PG.zonaHecha(k)); return i < 0 ? EL.ZONAS.findIndex(z => z.final) : i; }   // con todas las zonas completas, lo que sigue es la Gritería
  };

  /* ---------- Escena decorativa para menús (desfile de personajes) ---------- */
  class Desfile {
    constructor(zona = 'leonviejo') { this.t = 0; this.zona = zona; this.cam = 0; }
    actualizar(dt) { this.t += dt; this.cam += dt * 30; }
    dibujar(x) {
      EL.dibujarFondo(x, this.zona, this.cam, this.t); const b = EL.bloquesZona(this.zona);
      const off = -Math.floor(this.cam % 32);
      x.save(); x.scale(2, 2);
      for (let c = 0; c < 22; c++) { x.drawImage(b.tope, off / 2 + c * 16, 140); x.drawImage(b.relleno, off / 2 + c * 16, 156); x.drawImage(b.relleno, off / 2 + c * 16, 172); }
      const lista = EL.ORDEN_PERSONAJES.filter(id => PG.tiene(id)).concat(PG.tiene('gigantona') ? ['enano'] : []);
      lista.forEach((id, i) => {
        const s = EL.sprite(id, Math.floor(this.t * 6 + i) % 2 ? 'paso' : 'quieto', PG.traje(id === 'enano' ? 'gigantona' : id));
        const xx = ((i * 52 + this.t * 22) % 380) - 40;
        x.fillStyle = 'rgba(20,10,30,0.3)'; x.fillRect(xx + 2, 140, s.width - 4, 2);
        x.drawImage(s, Math.round(xx), 142 - s.height + s.pad);
      });
      x.restore();
    }
  }
  EL.Desfile = Desfile;

  const P = EL.pantallas = {
    limpiar() { if (EL.mjActual && EL.mjActual.salir) { const m = EL.mjActual; EL.mjActual = null; m.salir(); } ui().innerHTML = ''; EL.voz.callar(); P.tactil(null); EL.enJuego = false; },
    tactil(modo) {
      $('#tactil').classList.toggle('oculto', modo !== 'nivel' || !EL.esTactil());
      $('#tactil-laberinto').classList.toggle('oculto', modo !== 'laberinto' || !EL.esTactil());
      const acc = $('#tactil .b-accion'); if (acc) acc.style.visibility = (EL.escena && EL.escena.pjId && ['dario', 'gigantona', 'margarita'].includes(EL.escena.pjId)) ? 'visible' : 'hidden';
      EL.input.limpiar();
    },
    recurso() { return `<div class="recursos"><div class="recurso"><i class="icono-eco ic"></i><b id="ecos-n">${D().ecos}</b></div></div>`; },
    fondoMenu(z) { if (!(EL.escena instanceof Desfile) || EL.escena.zona !== z) EL.escena = new Desfile(z || 'leonviejo'); },
    ventana(titulo, html, clase = 'ventana', conCerrar = true) {
      const c = el('div', { class: 'capa oscurecer' }, `<div class="panel ${clase}"><div class="cinta">${titulo}</div>${conCerrar ? '<button class="btn cerrar" aria-label="Cerrar">✕</button>' : ''}${html}</div>`);
      ui().appendChild(c);
      const x = c.querySelector('.cerrar'); if (x) x.onclick = () => { EL.audio.clic(); c.remove(); };
      return c;
    },

    /* ================= NARRADOR (estilo tutorial: aparece solo cuando se necesita y pausa el juego) ================= */
    narrar(lineas, alTerminar) {
      const viejo = $('.narrador'); if (viejo) viejo.remove();
      let i = 0; const c = el('div', { class: 'narrador' }); ui().appendChild(c);
      const teclas = e => { if (['Space', 'Enter', 'KeyZ', 'ArrowRight'].includes(e.code)) { e.preventDefault(); sig(); } };
      const sig = () => { EL.audio.clic(); i++; mostrar(); };
      const mostrar = () => {
        const l = lineas[i];
        if (!l) { removeEventListener('keydown', teclas); c.remove(); EL.voz.callar(); alTerminar && alTerminar(); return; }
        const q = l.quien || 'leon', traje = PG.traje(q === 'enano' ? 'gigantona' : q);
        const esc = q === 'gigantona' ? 6 : ['leon', 'cadejo', 'punche'].includes(q) ? 11 : 10;
        c.innerHTML = `<div class="figura"><img class="px" src="${EL.spriteURL(q, esc, traje)}"></div>
          <div class="globo"><div class="quien">${EL.QUIEN[q]}</div><div class="txt">${l.txt}</div><div class="seguir">Toca para seguir ▶</div></div>`;
        EL.voz.decir(l.txt);
        if (EL.VERSION === 'demo') { clearTimeout(c._auto); c._auto = setTimeout(() => { if (c.isConnected) sig(); }, 2400 + l.txt.length * 38); }
      };
      c.addEventListener('pointerdown', e => { e.stopPropagation(); sig(); });
      addEventListener('keydown', teclas);
      mostrar();
    },

    /* ================= INICIO ================= */
    inicio() {
      P.limpiar(); P.fondoMenu('leonviejo');
      /* Pantalla de título minimalista: logo, un solo botón grande y una línea con el avance.
         El menú (Vestuario, Minijuegos, Ajustes) va como íconos en la esquina superior derecha. */
      const d = D(), jugado = !!d.vistos.intro;
      const zonas = EL.ZONAS.filter(z => !z.final), hechas = zonas.filter(z => d.zonas.includes(z.id)).length, todo = hechas >= zonas.length;
      const linea = !jugado ? 'Tu aventura empieza en León Viejo'
        : todo ? (d.griteria ? `¡Aventura completa! · ${hechas} de ${zonas.length} zonas` : `Te espera la Gritería · ${hechas} de ${zonas.length} zonas`)
        : `${EL.ZONAS[PG.siguienteZona()].nombre} · ${hechas} de ${zonas.length} zonas`;
      const c = el('div', { class: 'capa inicio' }, `
        <div class="ini-centro">
          <div class="ini-logo" role="img" aria-label="Ecos de León"><img class="logo-cupula" src="img/logo-cupula.png" alt=""><img class="logo-letras" src="img/logo-texto.png" alt=""></div>
          <button class="btn grande ini-jugar" id="b-jugar">▶ ${jugado ? 'CONTINUAR' : 'JUGAR'}</button>
          <div class="ini-linea ct">${linea}</div>
        </div>
        <div class="ini-iconos">
          <button class="btn azul boton-icono" id="b-vest" aria-label="Vestuario">👕<span>Vestuario</span></button>
          <button class="btn naranja boton-icono" id="b-mj" aria-label="Minijuegos">🧩<span>Minijuegos</span></button>
          <button class="btn gris boton-icono" style="cursor:pointer" id="b-aj" aria-label="Ajustes">⚙<span>Ajustes</span></button>
        </div>
        <div class="nota">${EL.EQUIPO}</div>
        ${EL.WEB ? `<button class="btn rojo boton-volver" id="b-web" aria-label="Salir del juego y volver a Ecos de León">◀ Salir del juego</button>` : ''}`);
      ui().appendChild(c);
      if ($('#b-web')) $('#b-web').onclick = () => { EL.audio.clic(); EL.voz.callar(); location.href = EL.WEB; };
      $('#b-jugar').onclick = () => { EL.audio.clic(); if (!D().vistos.intro) P.historia('intro', () => { D().vistos.intro = true; EL.save.guardar(); P.mapa(true); }); else P.mapa(); };
      $('#b-vest').onclick = () => { EL.audio.clic(); P.vestuario(); };
      $('#b-mj').onclick = () => { EL.audio.clic(); P.minijuegos(); };
      $('#b-aj').onclick = () => { EL.audio.clic(); P.ajustes(); };
    },
    historia(clave, luego) {
      P.limpiar();
      const fondo = { intro: 'leonviejo', leonviejo: 'metapa', metapa: 'sutiaba', sutiaba: 'centro', centro: 'callereal', callereal: 'poneloya', poneloya: 'griteria' }[clave] || 'leonviejo';
      EL.escena = new Desfile(fondo);
      P.narrar(EL.HISTORIA[clave] || [], luego);
    },

    /* ================= MAPA ================= */
    mapa(abrirSiguiente) {
      P.limpiar();
      EL.escena = new EL.Mapa(i => P.zona(i));
      ui().insertAdjacentHTML('beforeend', `${P.recurso()}
        <div class="titulo-mapa ct">Mapa de León</div>
        <div class="menu-lateral">
          <button class="btn gris boton-icono" style="cursor:pointer" id="m-ini">🏠<span>Inicio</span></button>
          <button class="btn azul boton-icono" id="m-vest">👕<span>Vestuario</span></button>
          <button class="btn naranja boton-icono" id="m-mj">🧩<span>Minijuegos</span></button>
          <button class="btn gris boton-icono" style="cursor:pointer" id="m-aj">⚙<span>Ajustes</span></button>
        </div>
        <div class="abajo-centro"><button class="btn grande" id="m-seguir">▶ ${EL.ZONAS[PG.siguienteZona()].nombre}</button></div>
        <div class="abajo-izq"><button class="btn azul" id="m-vista">🗺 Ver toda León</button></div>`);
      const vista = $('#m-vista'), rotular = todo => { vista.textContent = todo ? '🔍 Acercar' : '🗺 Ver toda León'; const b = $('.abajo-centro'); if (b) b.style.display = todo ? 'none' : ''; };
      EL.escena.alCambiarVista = rotular; rotular(EL.escena.completa);
      vista.onclick = () => { EL.audio.clic(); EL.escena.verTodo(!EL.escena.completa); };
      $('#m-ini').onclick = () => { EL.audio.clic(); P.inicio(); };
      $('#m-seguir').onclick = () => { EL.audio.clic(); P.zona(PG.siguienteZona()); };
      $('#m-vest').onclick = () => { EL.audio.clic(); P.vestuario(); };
      $('#m-mj').onclick = () => { EL.audio.clic(); P.minijuegos(); };
      $('#m-aj').onclick = () => { EL.audio.clic(); P.ajustes(); };
      // apenas se completan todas las zonas, la Gritería aparece sola al entrar al mapa (hasta que se celebre)
      const griteriaPendiente = PG.todasHechas() && !D().griteria;
      if (abrirSiguiente || griteriaPendiente) setTimeout(() => { if (EL.escena instanceof EL.Mapa && !document.querySelector('.zona-capa')) P.zona(PG.siguienteZona()); }, 700);
    },

    /* ================= VENTANA DE ZONA (ficha mínima) ================= */
    zona(i) {
      const z = EL.ZONAS[i]; document.querySelectorAll('.zona-capa').forEach(n => n.remove());
      if (z.final) { P.griteriaPanel(); return; }
      const pj = EL.PERSONAJES[z.personaje];
      const prev = EL.canvas(640, 360); EL.dibujarFondo(prev.x, z.id, 120, 0);
      const hecha = PG.zonaHecha(i), mejor = hecha ? 50 : Math.min(50, (D().mejorNivel || {})[z.id] || 0);
      const total = EL.ZONAS.filter(q => !q.final).length;
      const nombrePj = pj.nombre;
      /* Ficha mínima: franja con la imagen de la zona (nombre, personaje y avance), el dato y la dificultad. */
      const chip = hecha ? '✔ Completada' : mejor ? `Mejor: nivel ${mejor} de 50` : '';
      const c = P.ventana('', `
        <div class="zf-banda" style="background-image:url(${prev.toDataURL()})">
          ${chip ? `<span class="zf-chip ${hecha ? 'hecha' : ''}">${chip}</span>` : ''}
          <div class="zf-texto">
            <small>Zona ${i + 1} de ${total} · ${z.sub}</small>
            <h2>${z.nombre}</h2>
            <span>Con ${nombrePj}</span>
          </div>
          <img class="px zf-pj" src="${EL.spriteURL(z.personaje, z.personaje === 'gigantona' ? 4 : 6, PG.traje(z.personaje))}" alt="${nombrePj}">
        </div>
        <p class="zf-dato">${z.dato}<small>Fuente: ${z.fuente}</small></p>
        <div class="difs-zona">
          <button class="btn" data-dif="0">Fácil</button><button class="btn naranja" data-dif="1">Medio</button><button class="btn rojo" data-dif="2">Difícil</button>
        </div>`, 'zona-panel');
      c.classList.add('zona-capa');
      c.querySelectorAll('[data-dif]').forEach(b => b.onclick = () => { EL.audio.clic(); P.jugar(i, +b.dataset.dif); });
    },

    /* ================= RECORRIDO ================= */
    jugar(z, dif) {
      P.limpiar(); EL.enJuego = true; D().ultimaDif = dif; D().zonaActual = z; EL.save.guardar();
      const rec = new EL.Recorrido(z, dif);
      EL.escena = rec; P.tactil('nivel');
      const bp = el('button', { class: 'btn gris boton-pausa', style: 'cursor:pointer', 'aria-label': 'Pausa' }, 'II'); bp.onclick = () => P.pausaNivel(); ui().appendChild(bp);
      P.avisoHabilidad(rec);
    },
    avisoHabilidad(rec) {
      const txt = { explorador: 'Muévete con ◀ ▶ y salta con ▲', dario: 'Pulsa ★ (X) para recitar un verso: aparecen plataformas', gigantona: 'Pulsa ★ (X): la Gigantona salta muros y el Enano pasa por túneles', margarita: 'Pulsa ★ (X): la estrella ilumina el camino', cadejo: 'Salta dos veces en el aire', punche: 'En el agua, pulsa ▲ varias veces para nadar' }[rec.pjId];
      const av = el('div', { class: 'aviso-hab' }, `<img class="px" src="${EL.spriteURL(rec.pjId, rec.pjId === 'gigantona' ? 2 : 3, PG.traje(rec.pjId))}"><div class="ct"><small>${rec.zona.nombre} · ${['Fácil', 'Medio', 'Difícil'][rec.dif]}</small>${txt}</div>`);
      ui().appendChild(av); setTimeout(() => av.remove(), 4000);
    },
    cambioZona(rec) { P.tactil('nivel'); P.avisoHabilidad(rec); },
    guardarZona(rec) {   // la campana guarda la zona (y sus ecos)
      const d = D(), z = rec.zona, bono = EL.ECONOMIA.bonoZona[rec.dif];
      EL.save.sumarEcos(rec.ecosZona + bono);
      if (!d.zonas.includes(z.id)) d.zonas.push(z.id);
      (d.mejorNivel = d.mejorNivel || {})[z.id] = 50;
      let nuevo = null; if (z.desbloquea) { nuevo = z.desbloquea; if (!d.personajes.includes(nuevo)) d.personajes.push(nuevo); }
      d.zonaActual = Math.min(5, rec.zIdx + 1); EL.save.guardar();
      return { txt: '¡Zona completada!', sub: `+${rec.ecosZona} ecos y +${bono} de bono (guardados)` + (nuevo ? ` · Se une: ${EL.PERSONAJES[nuevo].nombre}` : ''), nuevo };
    },
    irGriteria() { P.limpiar(); EL.escena = new EL.Griteria(() => { D().griteria = true; EL.save.guardar(); P.mapa(); }); },
    pausaNivel() {
      const nv = EL.escena; if (!nv || !(nv instanceof EL.Recorrido) || nv.terminado || nv.zonaHecha || nv.transicion || nv.pausado || $('#pausa-capa')) return;
      nv.pausado = true; P.tactil(null); EL.enJuego = false;
      const c = P.ventana('Pausa', `<div class="stats"><span class="stat">${nv.zona.nombre}</span><span class="stat">Nivel ${nv.nivelActual}/50</span><span class="stat">${ECO} ${nv.ecosZona}</span></div>
        <div class="fila-btn" style="flex-direction:column;align-items:center"><button class="btn grande" id="p-seg">▶ Continuar</button>
        <div class="fila-btn" style="margin-top:4px"><button class="btn naranja" id="p-rei">↻ Reiniciar zona</button><button class="btn azul" id="p-mapa">🗺 Mapa</button></div></div>
        <div class="caja-texto" style="margin-top:14px;font-size:16px;text-align:center">Solo la campana guarda. Si sales, los ecos de esta zona se pierden.</div>`, 'ventana', false);
      c.id = 'pausa-capa';
      $('#p-seg').onclick = () => { c.remove(); nv.pausado = false; EL.enJuego = true; P.tactil('nivel'); };
      $('#p-rei').onclick = () => P.jugar(nv.zIdx, nv.dif);
      $('#p-mapa').onclick = () => P.mapa();
    },
    finRecorrido(rec) {
      P.tactil(null); EL.enJuego = false;
      const d = D(); (d.mejorNivel = d.mejorNivel || {})[rec.zona.id] = Math.max(d.mejorNivel[rec.zona.id] || 0, rec.nivelActual); EL.save.guardar();
      P.ventana('¡Sin vidas!', `<div class="grande-txt">Llegaste al nivel ${rec.nivelActual} de 50</div>
        <div class="caja-texto" style="text-align:center">Los ${rec.ecosZona} ecos de ${rec.zona.nombre} se pierden porque la campana no sonó.</div>
        <div class="fila-btn"><button class="btn grande" id="r-rei">↻ Otra vez</button><button class="btn azul" id="r-mapa">🗺 Mapa</button></div>`, 'ventana', false);
      $('#r-rei').onclick = () => P.jugar(rec.zIdx, rec.dif); $('#r-mapa').onclick = () => P.mapa();
    },
    griteriaPanel() {
      const z = EL.ZONAS[6];
      const c = P.ventana('La Gritería', `<div class="caja-texto">${z.dato}<small>Fuente: ${z.fuente}</small></div>
        <div class="grande-txt">Aquí no se recogen ecos: ¡todos celebran frente al altar de la Purísima!</div>
        <div class="fila-btn"><button class="btn grande" id="g-ir">🎉 ¡A celebrar!</button></div>`);
      c.classList.add('zona-capa');
      $('#g-ir').onclick = () => { EL.audio.clic(); P.irGriteria(); };
    },

    /* ================= VESTUARIO ================= */
    vestuario(sel) {
      P.limpiar(); P.fondoMenu('metapa');
      sel = sel || 'explorador';
      ui().insertAdjacentHTML('beforeend', P.recurso());
      const pest = EL.ORDEN_PERSONAJES.map(id => `<div class="pestana ${id === sel ? 'sel' : ''} ${PG.tiene(id) ? '' : 'bloq'}" data-id="${id}">${PG.tiene(id) ? '' : '<i class="candado">🔒</i>'}<img class="px" src="${PG.tiene(id) ? EL.spriteURL(id, id === 'gigantona' ? 2 : 3, PG.traje(id)) : EL.siluetaURL(id, id === 'gigantona' ? 2 : 3)}"><span>${PG.tiene(id) ? EL.PERSONAJES[id].nombre.replace(' y Enano Cabezón', ' y Enano') : '???'}</span></div>`).join('');
      const c = P.ventana('Personajes y vestuario', `<div class="pestanas">${pest}</div><div class="cuerpo"><div class="vitrina" id="v-vit"></div><div class="info" id="v-info"></div></div>`, 'vest');
      c.querySelector('.cerrar').onclick = () => { EL.audio.clic(); P.volver(); };
      c.querySelectorAll('.pestana').forEach(t => t.onclick = () => { EL.audio.clic(); P.vestuario(t.dataset.id); });
      let vista = PG.traje(sel);
      const pintar = () => {
        if (!PG.tiene(sel)) {   // personaje que aún no se une
          $('#v-vit').innerHTML = `<div class="nombre-traje ct">🔒 Bloqueado</div><div class="figuras"><img class="px" src="${EL.siluetaURL(sel, sel === 'gigantona' ? 8 : ['cadejo', 'punche'].includes(sel) ? 11 : 13)}"></div>`;
          $('#v-info').innerHTML = `<h3>¿Quién será?</h3><div class="caja-texto" style="font-size:19px">🔒 Este personaje se une a la aventura cuando: <b>${EL.PERSONAJES[sel].desbloqueo.charAt(0).toLowerCase() + EL.PERSONAJES[sel].desbloqueo.slice(1)}</b>.</div><div class="caja-texto" style="font-size:15px">Cuando se una podrás comprar su vestuario con los ecos.</div>`;
          return;
        }
        const pj = EL.PERSONAJES[sel], trajes = EL.VESTUARIO[sel], t = trajes.find(q => q.id === vista);
        $('#v-vit').innerHTML = `<div class="nombre-traje ct">${t.nombre}</div><div class="figuras">${sel === 'gigantona' ? `<img class="px" src="${EL.spriteURL('gigantona', 8, vista)}"><img class="px" src="${EL.spriteURL('enano', 8, vista)}">` : `<img class="px" src="${EL.spriteURL(sel, ['cadejo', 'punche'].includes(sel) ? 11 : 13, vista)}">`}</div>`;
        $('#v-info').innerHTML = `<h3>${pj.nombre}</h3><div class="caja-texto" style="font-size:17px">⭐ ${pj.habilidad}</div>
          <div class="trajes">${trajes.map(q => {
            const tiene = PG.tieneTraje(sel, q.id), usa = PG.traje(sel) === q.id, alcanza = D().ecos >= q.precio;
            const boton = usa ? `<button class="btn gris peq" disabled>✔ Puesto</button>` : tiene ? `<button class="btn azul peq" data-usar="${q.id}">Usar</button>` : `<button class="btn peq ${alcanza ? '' : 'gris'}" data-comprar="${q.id}" ${alcanza ? '' : 'disabled'}>${q.precio} ${ECO}</button>`;
            return `<div class="traje ${usa ? 'usa' : ''} ${q.id === vista ? 'visto' : ''}" data-t="${q.id}"><img class="px" src="${EL.spriteURL(sel, sel === 'gigantona' ? 2 : 4, q.id)}"><div><b>${q.nombre}</b><div class="estado">${boton}</div></div></div>`;
          }).join('')}</div>
          <div class="caja-texto" style="font-size:15px">Los ecos solo compran vestuario y cada traje es solo para su personaje. Se guardan al sonar la campana de cada zona.</div>`;
        $('#v-info').querySelectorAll('.traje').forEach(n => n.onclick = e => { if (e.target.closest('button')) return; vista = n.dataset.t; EL.audio.clic(); pintar(); });
        $('#v-info').querySelectorAll('[data-usar]').forEach(b => b.onclick = () => { (D().vestuario[sel] = D().vestuario[sel] || { tiene: [], usa: 'base' }).usa = b.dataset.usar; vista = b.dataset.usar; EL.save.guardar(); EL.audio.clic(); pintar(); });
        $('#v-info').querySelectorAll('[data-comprar]').forEach(b => b.onclick = () => {
          const q = trajes.find(z => z.id === b.dataset.comprar); if (D().ecos < q.precio) return;
          const v = D().vestuario[sel] = D().vestuario[sel] || { tiene: [], usa: 'base' };
          EL.save.sumarEcos(-q.precio); v.tiene.push(q.id); v.usa = q.id; vista = q.id; EL.save.guardar(); EL.audio.compra(); $('#ecos-n').textContent = D().ecos; pintar();
        });
      };
      pintar();
    },
    volver() { if (D().vistos.intro) P.mapa(); else P.inicio(); },

    /* ================= MINIJUEGOS ================= */
    minijuegos(resaltar) {
      P.limpiar(); P.fondoMenu('sutiaba');
      ui().insertAdjacentHTML('beforeend', P.recurso());
      const cards = EL.MINIJUEGOS.map(m => {
        const dat = PG.mjDato(m.id);
        const fig = m.id === 'laberinto' ? `<img class="px" src="${EL.spriteURL('explorador', 4)}"><img class="px" src="${EL.spriteURL('cadejo', 4, 'negro')}"><img class="px" style="max-width:30%" src="${EL.spriteURL('punche', 4)}">` : m.id === 'ajedrez' ? `<img class="px" src="${EL.spriteURL('gigantona', 3)}"><img class="px" src="${EL.spriteURL('enano', 4)}">` : `<img class="px" src="${EL.spriteURL(m.personaje, 5)}">`;
        const abierto = PG.mjAbierto(m.id);
        const difs = ['f', 'm', 'd'].map((d, k) => abierto && PG.difAbierta(m.id, d) ? `<button class="btn ${['', 'naranja', 'rojo'][k]}" data-mj="${m.id}" data-d="${d}">${dat[d] && dat[d].gan ? '✔ ' : ''}${['Fácil', 'Medio', 'Difícil'][k]}</button>` : `<button class="btn gris" disabled title="${abierto ? 'Gana el nivel anterior' : ''}">🔒 ${['Fácil', 'Medio', 'Difícil'][k]}</button>`).join('');
        const pista = abierto ? '' : `<div class="mj-bloq ct">🔒 ${m.id === 'memoria' ? 'Termina el tutorial' : 'Se abre cuando se une ' + EL.PERSONAJES[m.personaje].nombre.replace(' y Enano Cabezón', '')}</div>`;
        return `<div class="mj-card ${abierto ? '' : 'bloq'}" ${resaltar === m.id ? 'style="outline:6px solid #ffd34a"' : ''}><div class="fig">${fig}${pista}</div><h3>${m.nombre}</h3><div class="tipo">${m.tipo}${m.lectura ? ' · con lectura' : ''}</div><div class="difs">${difs}</div></div>`;
      }).join('');
      const c = P.ventana('Minijuegos', `<div class="mj-lista">${cards}</div>`, '');
      c.querySelector('.cerrar').onclick = () => { EL.audio.clic(); P.volver(); };
      c.querySelectorAll('[data-mj]').forEach(b => b.onclick = () => { EL.audio.clic(); P.jugarMJ(b.dataset.mj, b.dataset.d); });
    },
    marcoMJ(titulo, dif) {
      P.limpiar(); EL.escena = null;
      const c = el('div', { class: 'mj' }); ui().appendChild(c);
      c.insertAdjacentHTML('beforeend', `<div class="mj-barra"><button class="btn rojo peq" id="mj-salir" style="font-size:24px;padding:8px 16px">✕</button><div class="tit-juego">${titulo}</div><span class="dif-chip d-${dif}">${{ f: 'Fácil', m: 'Medio', d: 'Difícil' }[dif]}</span><div class="estado" id="mj-estado"></div></div>`);
      $('#mj-salir').onclick = () => { EL.audio.clic(); P.minijuegos(); };
      return c;
    },
    jugarMJ(id, dif) {
      const m = EL.MINIJUEGOS.find(q => q.id === id), mod = EL.MJ[id];
      mod.iniciar(dif, res => P.finMJ(id, dif, res), m);
      EL.mjActual = mod;
    },
    finMJ(id, dif, res) {
      const dat = PG.mjDato(id), prev = dat[dif] || {};
      let premio = 0;
      if (res.gano) { premio = EL.ECONOMIA.minijuego[dif][prev.gan ? 1 : 0] + (res.extra || 0); dat[dif] = { gan: (prev.gan || 0) + 1, mejor: res.mejor != null ? Math.max(res.mejor, prev.mejor || 0) : prev.mejor }; EL.save.sumarEcos(premio); EL.audio.victoria(); }
      else { if (res.extra) EL.save.sumarEcos(res.extra); premio = res.extra || 0; EL.audio.derrota(); }
      EL.save.guardar();
      const sig = dif === 'f' ? 'm' : dif === 'm' ? 'd' : null;
      P.ventana(res.titulo || (res.gano ? '¡Ganaste!' : 'Fin del juego'), `${res.html || ''}${res.verso ? `<pre>${res.verso}</pre>` : ''}
        <div class="stats"><span class="stat">Premio: +${premio} ${ECO}</span><span class="stat">Tienes: ${D().ecos} ${ECO}</span></div>
        <div class="fila-btn">${res.gano && sig ? `<button class="btn" id="f-sig">${{ m: 'Medio', d: 'Difícil' }[sig]} ▶</button>` : ''}<button class="btn ${res.gano ? 'naranja' : ''}" id="f-otra">↻ Otra vez</button><button class="btn azul" id="f-lista">🧩 Minijuegos</button></div>`, 'tarjeta-fin', false);
      if ($('#f-sig')) $('#f-sig').onclick = () => P.jugarMJ(id, sig);
      $('#f-otra').onclick = () => P.jugarMJ(id, dif); $('#f-lista').onclick = () => P.minijuegos();
    },

    /* ================= AJUSTES ================= */
    ajustes() {
      P.limpiar(); P.fondoMenu('poneloya'); const a = D().ajustes;
      const op = (k, txt) => `<div class="op"><div class="ct">${txt}</div><button class="btn ${a[k] ? '' : 'rojo'}" data-k="${k}">${a[k] ? 'Sí' : 'No'}</button></div>`;
      const c = P.ventana('Ajustes', `<div class="rejilla">${op('sonido', 'Sonido')}${op('voz', 'Voz del narrador')}${op('lento', 'Velocidad reducida')}
          <div class="op"><div class="ct">Controles táctiles</div><button class="btn azul" id="a-tac">${{ auto: 'Automático', si: 'Siempre', no: 'Nunca' }[a.tactil]}</button></div>
          <div class="op"><div class="ct">Pantalla</div><button class="btn azul" id="a-pant">Completa</button></div>
          <div class="op"><div class="ct">Tutorial</div><button class="btn naranja" id="a-tuto">${D().tutorialHecho ? 'Verlo otra vez' : 'Activo'}</button></div></div>
        ${EL.VERSION === 'prueba' || EL.VERSION === 'libre' ? `<div class="prueba"><div class="ct" style="font:900 20px var(--juego);text-align:center">${EL.VERSION === 'libre' ? 'Versión libre: todo desbloqueado' : 'Versión de prueba'}</div>
          <div class="fila-btn">${EL.WEB ? '<button class="btn azul" id="a-salir">◀ Salir del juego</button>' : ''}<button class="btn" id="a-ecos">+500 ${ECO}</button><button class="btn rojo" id="a-reset">Reiniciar progreso</button></div></div>` : `<div class="prueba"><div class="fila-btn">${EL.WEB ? '<button class="btn azul" id="a-salir">◀ Salir del juego</button>' : ''}<button class="btn rojo" id="a-reset">Borrar mi progreso</button></div></div>`}`, 'ajustes');
      if ($('#a-salir')) $('#a-salir').onclick = () => { EL.audio.clic(); EL.voz.callar(); location.href = EL.WEB; };   // vuelve a la web (/juegos); el progreso ya está guardado
      c.querySelector('.cerrar').onclick = () => { EL.audio.clic(); P.volver(); };
      c.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k; a[k] = !a[k]; b.textContent = a[k] ? 'Sí' : 'No'; b.classList.toggle('rojo', !a[k]); EL.save.guardar(); EL.audio.clic(); if (k === 'voz' && !a.voz) EL.voz.callar(); });
      $('#a-tac').onclick = () => { a.tactil = { auto: 'si', si: 'no', no: 'auto' }[a.tactil]; $('#a-tac').textContent = { auto: 'Automático', si: 'Siempre', no: 'Nunca' }[a.tactil]; EL.save.guardar(); EL.audio.clic(); };
      $('#a-pant').onclick = () => { const d = document.documentElement; if (!document.fullscreenElement) (d.requestFullscreen || d.webkitRequestFullscreen || (() => { })).call(d); else document.exitFullscreen(); };
      $('#a-tuto').onclick = () => { D().tutorialHecho = false; EL.save.guardar(); EL.audio.clic(); $('#a-tuto').textContent = 'Activo'; };
      if ($('#a-ecos')) $('#a-ecos').onclick = () => { EL.save.sumarEcos(500); EL.audio.compra(); $('#a-ecos').innerHTML = `+500 ${ECO} (${D().ecos})`; };
      let conf = false; $('#a-reset').onclick = () => { if (!conf) { conf = true; $('#a-reset').textContent = '¿Seguro? Se borra todo'; return; } EL.save.reiniciar(); P.inicio(); };
    }
  };
  EL.MJ = {};
})();
