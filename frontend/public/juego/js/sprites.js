/* eslint-disable */
/* Ecos de León · personajes en pixel art 2D (contorno oscuro, sombras y volumen)
   Cada letra del mapa es un color de la paleta; '.' es transparente. */
'use strict';
(function () {
  const CONTORNO = '#1b1222';

  /* ---- Piernas compartidas (6 filas) ---- */
  const PIERNAS = {
    pantalon: {
      quieto: ['....pppppppP....', '....ppP..ppP....', '....ppP..ppP....', '....ppP..ppP....', '....fff..fff....', '...ffff..ffff...'],
      paso: ['....pppppppP....', '...pppP..ppP....', '...ppP....ppP...', '..ppP.....ppP...', '..fff.....fff...', '.ffff.....ffff..'],
      salto: ['....pppppppP....', '....ppP..ppP....', '...ppP....ppP...', '...fff....fff...', '..ffff....ffff..', '................']
    },
    delgadas: {
      quieto: ['.....pP..pP.....', '.....pP..pP.....', '.....pP..pP.....', '.....pP..pP.....', '....fff..fff....', '...ffff..ffff...'],
      paso: ['....pP....pP....', '....pP....pP....', '...pP......pP...', '...pP......pP...', '..fff......fff..', '.ffff......ffff.'],
      salto: ['....pP....pP....', '...pP......pP...', '...fff....fff...', '..ffff....ffff..', '................', '................']
    }
  };

  const S = {};

  /* ---- Explorador (protagonista del tutorial) ---- */
  S.explorador = {
    nombre: 'Explorador', piernas: 'pantalon',
    cuerpo: [
      '......hhhh......',
      '.....hhhhhh.....',
      '.....bbbbbb.....',
      '..HhhhhhhhhhhH..',
      '...rssssssssr...',
      '...sssssssssS...',
      '...ssessssesS...',
      '...ssessssesS...',
      '...sqssssssqS...',
      '....sssmmssS....',
      '......SSSS......',
      '....ckcccckC....',
      '...cckcccckCC...',
      '...cckccyckCC...',
      '...sckcccckCs...',
      '....bbbybbbb....'
    ],
    pal: { h: '#dcb877', H: '#a8844d', b: '#6b3f1f', r: '#5a3a1e', s: '#f0c39a', S: '#d39a72', e: '#1e1420', q: '#ef9a8a', m: '#a8433a', c: '#c9a25c', C: '#9b7a3e', k: '#6b3f1f', y: '#f2c94c', p: '#6e5a3a', P: '#4e3f28', f: '#4a2e1c' }
  };

  /* ---- Rubén Darío niño ---- */
  S.dario = {
    nombre: 'Rubén Darío niño', piernas: 'pantalon',
    cuerpo: [
      '.....rrrrrr.....',
      '....rrrrrrrr....',
      '...rrrrrrrrRr...',
      '...rrrrrrrrrr...',
      '...rrssssssrr...',
      '...rssssssssr...',
      '...ssessssesS...',
      '...ssessssesS...',
      '...sqssssssqS...',
      '....sssmmssS....',
      '......wxxw......',
      '....ccwxxwcC....',
      '...cccwwwwcCC...',
      '...ccccwwccCC...',
      '...sccccccnnN...',
      '....ccccccnnN...'
    ],
    pal: { r: '#2a1c14', R: '#5a4434', s: '#e9b98f', S: '#c99570', e: '#1e1420', q: '#e8907e', m: '#9a3b33', w: '#f5f1e6', x: '#b3262e', c: '#26304f', C: '#171d33', n: '#f7f2dc', N: '#c9bf9c', p: '#1f2640', P: '#141a2e', f: '#151515' }
  };

  /* ---- Margarita (de «A Margarita Debayle») ---- */
  S.margarita = {
    nombre: 'Margarita', piernas: 'delgadas',
    cuerpo: [
      '......xxxx......',
      '.....rrxxrr.....',
      '....rrrrrrrr....',
      '...rrrrrrrrrR...',
      '...rrssssssrR...',
      '..rrssssssssRr..',
      '..rssessssesSR..',
      '..rssessssesSR..',
      '..rsqssssssqSR..',
      '..rRsssmmssSRr..',
      '..rR..SSSS..Rr..',
      '....cccyyccC....',
      '...scccyyccCs...',
      '...scccccccCs...',
      '..ccccccccccCC..',
      '..cwcwcwcwcwcC..'
    ],
    pal: { x: '#ff8fb8', r: '#f6d36a', R: '#d4a93c', s: '#f7d6bd', S: '#e2b497', e: '#1e1420', q: '#f29a9a', m: '#d0505a', c: '#8ec9f0', C: '#5fa3d4', y: '#ffd84a', w: '#ffffff', p: '#ffffff', P: '#d9d9e6', f: '#2a2a3a' }
  };

  /* ---- Enano Cabezón ---- */
  S.enano = {
    nombre: 'Enano Cabezón', piernas: 'delgadas',
    cuerpo: [
      '....hhhhhhhh....',
      '...hhhhhhhhhh...',
      '.HHHHHHHHHHHHHH.',
      '.ssssssssssssSS.',
      '.sseesssssseesS.',
      '.sseesssssseesS.',
      '.ssssssnnssssSS.',
      '.sqsMMMMMMMMqsS.',
      '.ssMMssmmssMMsS.',
      '..ssssssssssS...',
      '...SSSSSSSSSS...',
      '....cccxxccC....',
      '...scccxxcccs...',
      '....bbbybbbb....'
    ],
    pal: { h: '#3b2a1e', H: '#24180f', s: '#f0c39a', S: '#d39a72', e: '#1e1420', n: '#e0a585', q: '#ef9a8a', M: '#3a2414', m: '#a8433a', c: '#2e8b57', C: '#1f6b42', x: '#f2c94c', b: '#6b3f1f', y: '#f2c94c', p: '#3a3a5a', P: '#26263d', f: '#2b1d14' }
  };

  /* ---- La Gigantona (muy alta, falda amplia) ---- */
  S.gigantona = {
    nombre: 'La Gigantona', alta: true,
    cuerpo: [
      '.......y.yy.y.......',
      '......yyyxyyyy......',
      '.....rrrrrrrrrr.....',
      '....rrssssssssrr....',
      '....rssssssssssr....',
      '....rssessssesSr....',
      '....rssessssesSr....',
      '....rsqssssssqSr....',
      '....rsssmmmmssSr....',
      '....rrsssssssSrr....',
      '...rrr..SSSS..rrr...',
      '...rR..cccccC..Rr...',
      '...rR.ccccccCC.Rr...',
      '...yR.scccccCs.Ry...',
      '......scccccCs......',
      '......syyyyyys......',
      '.......kkkkkk.......',
      '......kkKkkKkk......',
      '......kkKkkKkk......',
      '.....kkkKkkKkkk.....',
      '.....kkkKkkKkkk.....',
      '.....wwwwwwwwww.....',
      '....kkkkKkkKkkkk....',
      '....kkkkKkkKkkkk....',
      '....kkkkKkkKkkkk....',
      '...kkkkkKkkKkkkkk...',
      '...kkkkkKkkKkkkkk...',
      '...vvvvvvvvvvvvvv...',
      '..kkkkkkKkkKkkkkkk..',
      '..kkkkkkKkkKkkkkkk..',
      '..kkkkkkKkkKkkkkkk..',
      '.kkkkkkkKkkKkkkkkkk.',
      '.kkkkkkkKkkKkkkkkkk.',
      '.kkkkkkkKkkKkkkkkkk.',
      '.wwwwwwwwwwwwwwwwww.',
      'wkwkwkwkwkwkwkwkwkwk'
    ],
    pal: { y: '#f2c94c', x: '#d63a5a', r: '#f2d16b', R: '#c9a43e', s: '#fbe9de', S: '#e8c8b8', e: '#1e1420', q: '#f29a9a', m: '#d0283c', c: '#e94f64', C: '#b8384a', k: '#3f8ad8', K: '#f2c94c', w: '#ffffff', v: '#e94f64' }
  };

  /* ---- El Cadejo (perro protector, de lado) ---- */
  S.cadejo = {
    nombre: 'El Cadejo', animal: true,
    frames: {
      quieto: [
        '................cccc....',
        '...............ccccccC..',
        '..............Cccceccccn',
        '..............CCccccccc.',
        'C.............CCcccmm...',
        'CC...cCccCcccccccccc....',
        '.CcccccccccccccccccC....',
        '..ccccccccccccccccccC...',
        '..cccccccccccccccccCC...',
        '..CccccccccccccccCCC....',
        '...CCcccCCCCCCcccCC.....',
        '...cC..cC.....cC..cC....',
        '...cC..cC.....cC..cC....',
        '...cC..cC.....cC..cC....',
        '...ff..ff.....ff..ff....'
      ],
      paso: [
        '................cccc....',
        '...............ccccccC..',
        '..............Cccceccccn',
        '..............CCccccccc.',
        '.C............CCcccmm...',
        'CC...cCccCcccccccccc....',
        '.CcccccccccccccccccC....',
        '..ccccccccccccccccccC...',
        '..cccccccccccccccccCC...',
        '..CccccccccccccccCCC....',
        '...CCcccCCCCCCcccCC.....',
        '..cC....cC...cC....cC...',
        '.cC......cC..cC.....cC..',
        '.cC......cC...cC....cC..',
        '.ff......ff...ff....ff..'
      ]
    },
    pal: { c: '#f2f0ea', C: '#bdb8b0', e: '#46b4ff', n: '#2b2b2b', m: '#e86a7a', f: '#5a4632' }
  };

  /* ---- El Punche de Oro (cangrejo dorado) ---- */
  S.punche = {
    nombre: 'El Punche de Oro', animal: true,
    frames: {
      quieto: [
        '......g......g......',
        '......C......C......',
        '.cc...C......C...cc.',
        'cwcc..cccccccc..ccwc',
        'cCC.ccwwccccccCc.CCc',
        '.CC.cccccccccccC.CC.',
        '....CccccccccccC....',
        '.....CCCCCCCCCC.....',
        '....C.C.C..C.C.C....',
        '...C.C.C....C.C.C...'
      ],
      paso: [
        '......g......g......',
        '......C......C......',
        '..cc..C......C..cc..',
        '.cwcc.cccccccc.ccwc.',
        '.cCC.cwwccccccCc.CCc',
        '..CC.cccccccccccCCC.',
        '....CccccccccccC....',
        '.....CCCCCCCCCC.....',
        '...C.C.C....C.C.C...',
        '....C.C.C..C.C.C....'
      ]
    },
    pal: { c: '#f2c230', C: '#b8860b', w: '#fff1a8', g: '#e8344a' }
  };

  /* ---- León, el narrador ---- */
  S.leon = {
    nombre: 'León', animal: true,
    frames: {
      quieto: [
        '...............rrrrr....',
        '.............rrrrrrrrr..',
        '............rrrRcccRrrr.',
        '............rrRccecccRrr',
        '............rrRccccccnRr',
        '............rrRcccmmccRr',
        '.r..........rrrRccccRrr.',
        '.r...cccccccrrrrRRrrrr..',
        '..c.ccccccccccrrrrrr....',
        '...ccccccccccccccc......',
        '...cccccccccccccccC.....',
        '...CccccccccccccCC......',
        '....cC..cC....cC..cC....',
        '....cC..cC....cC..cC....',
        '....CC..CC....CC..CC....'
      ]
    },
    pal: { r: '#d9772b', R: '#a65218', c: '#f2c46b', C: '#c99a3e', e: '#1e1420', n: '#5a3020', m: '#8a3a2a' }
  };

  /* ---- Coronel Arrechavala, jinete fantasma (obstáculo, no se combate) ---- */
  S.jinete = {
    nombre: 'Jinete fantasma', animal: true, alfa: 0.78,
    frames: {
      quieto: [
        '..........hhhh..............',
        '........hhhhhhhh............',
        '..........ssss..............',
        '..........sees..............',
        '..........SSSS..............',
        '.........kkkkkk.............',
        '........kkkkkkkk............',
        '........kkkkkkkkk...........',
        '........kkkkkk.kk...........',
        '.......cckkkkkcc....cc......',
        '......ccccckkcccccccccc.....',
        '..C..cccccccccccccccccccc...',
        '.CC.ccccccccccccccccccecc...',
        '.C..cccccccccccccccc..cccc..',
        '.C..Ccccccccccccccc....ccc..',
        '....CCCCCCCCCCCCCCC.........',
        '.....cC..cC....cC..cC.......',
        '.....cC..cC....cC..cC.......',
        '....cC...cC.....cC..cC......',
        '....ff...ff.....ff..ff......'
      ],
      paso: [
        '..........hhhh..............',
        '........hhhhhhhh............',
        '..........ssss..............',
        '..........sees..............',
        '..........SSSS..............',
        '.........kkkkkk.............',
        '........kkkkkkkk............',
        '........kkkkkkkkk...........',
        '........kkkkkk.kk...........',
        '.......cckkkkkcc....cc......',
        '......ccccckkcccccccccc.....',
        '.C...cccccccccccccccccccc...',
        'CC..ccccccccccccccccccecc...',
        'C...cccccccccccccccc..cccc..',
        '....Ccccccccccccccc....ccc..',
        '....CCCCCCCCCCCCCCC.........',
        '...cC....cC..cC.....cC......',
        '..cC......cC.cC......cC.....',
        '..cC.......cC.cC.....cC.....',
        '..ff.......ff.ff.....ff.....'
      ]
    },
    pal: { h: '#2a2f4a', s: '#dfe8ff', S: '#a8b6d8', e: '#7cf7ff', k: '#3a4570', c: '#b8c8ee', C: '#7f93c4', f: '#5b6a94' }
  };

  /* ---- Explorador visto desde arriba (mapa aéreo) ---- */
  S.exploradorAereo = {
    nombre: 'Explorador (vista aérea)', animal: true,
    frames: {
      quieto: [
        '....hhhh....',
        '..hhhhhhhh..',
        '.hhhbbbbhhh.',
        '.hhbhhhhbhh.',
        'hhhbhhhhbhhH',
        'hhhbhhhhbhhH',
        '.hhhbbbbhhH.',
        '.chhhhhhhhc.',
        'ccchhhhhhccC',
        '.ccccccccCC.',
        '..ss....ss..'
      ]
    },
    pal: { h: '#dcb877', H: '#a8844d', b: '#6b3f1f', c: '#c9a25c', C: '#9b7a3e', s: '#f0c39a' }
  };

  /* ---- Piezas de ajedrez (Gigantona y Enano Cabezón) ---- */
  const BASE = ['...bbbbbbbb...', '..AAAAAAAAAA..'];
  S.piezas = {
    K: ['....b.bb.b....', '....bbbbbb....', '..ssssssssss..', '.sseessseesss.', '.ssssssssssss.', '.ssMMMMMMMMss.', '..ssssmmsssS..', '...SSSSSSSS...', '....aabbaa....', '...aaabbaaA...', '....aaaaaA....', '....aA..aA....'].concat(BASE),
    Q: ['....b.bb.b....', '....bbbbbb....', '...rssssssr...', '...rsesseSr...', '...rsqmmqsr...', '...rr.SS.rr...', '....aaaaaA....', '....sbbbbs....', '....aaaaaA....', '...aaAaaAaA...', '..aaaAaaAaaA..', '.aaaaAaaAaaaA.'].concat(BASE),
    N: ['..............', '.....aa.......', '....aaaa......', '...aaaeaa.....', '..aaaaaaaa....', '.aaaaaaaaaA...', '.aA..aaaaaA...', '......aaaaAb..', '.....aaaaaAb..', '....aaaaaaAb..', '....aaaaaaaA..', '...aaaaaaaaA..'].concat(BASE),
    R: ['....f.ff.f....', '.....ffff.....', '.....aFFa.....', '....aaaaaA....', '....aaaaaA....', '...aaaaaaaA...', '...aaAaaaaA...', '..aaaaaAaaaA..', '..aaAaaaaaaA..', '.aaaaaaaAaaaA.', '.aaaAaaaaaaaA.', '.aaaaaaaaaaaA.'].concat(BASE),
    B: ['.....aaaa.....', '....aaaaaa....', '...AAAAAAAA...', '.....ssss..b..', '.....sees...b.', '.....ssss...b.', '....aaaaaasbb.', '....aaaaaA..b.', '....aaaaaA.b..', '....aaaaaA....', '....aaaaaA....', '....aA..aA....'].concat(BASE),
    P: ['..............', '..............', '..............', '.....AAAA.....', '....AAAAAA....', '.....ssss.....', '.....sees.....', '.....ssss.....', '....aaaaaA....', '...saaaaaAs...', '....aaaaaA....', '....aA..aA....'].concat(BASE)
  };
  S.palPiezas = {
    blancas: { a: '#f6f1e4', A: '#c9bfa8', b: '#ffffff', s: '#f1c9a0', S: '#d39a72', e: '#2a1a1a', M: '#3a2414', r: '#f2d16b', q: '#f08a8a', m: '#c0392b', f: '#ff7a2a', F: '#ffd34a' },
    negras: { a: '#3b3746', A: '#1f1c27', b: '#8f88a3', s: '#c99a74', S: '#9a7052', e: '#0d0a12', M: '#1a120c', r: '#6a5a3a', q: '#b86a6a', m: '#8a2424', f: '#ff5a3a', F: '#ffb02a' }
  };


  /* ---- Constructor de sprites con contorno ---- */
  const cache = new Map();
  function construir(rows, pal, opts = {}) {
    const h = rows.length, w = Math.max(...rows.map(r => r.length));
    const pad = 2, c = EL.canvas(w + pad * 2, h + pad * 2), x = c.x;
    const op = Array.from({ length: h + pad * 2 }, () => new Uint8Array(w + pad * 2));
    for (let j = 0; j < h; j++) for (let i = 0; i < rows[j].length; i++) {
      const ch = rows[j][i]; if (ch === '.' || ch === ' ') continue;
      const col = pal[ch]; if (!col) continue;
      x.fillStyle = col; x.fillRect(i + pad, j + pad, 1, 1); op[j + pad][i + pad] = 1;
    }
    if (!opts.sinContorno) {
      x.fillStyle = opts.contorno || CONTORNO;
      for (let j = 0; j < h + pad * 2; j++) for (let i = 0; i < w + pad * 2; i++) {
        if (op[j][i]) continue;
        if ((op[j - 1] && op[j - 1][i]) || (op[j + 1] && op[j + 1][i]) || op[j][i - 1] || op[j][i + 1]) x.fillRect(i, j, 1, 1);
      }
    }
    c.pad = pad; return c;
  }

  function datosTraje(id, traje) { return (traje && EL.VESTUARIO && EL.VESTUARIO[id]) ? (EL.VESTUARIO[id].find(v => v.id === traje) || {}) : {}; }
  function conAccesorio(rows, t) {
    if (!t.cambia && !t.arriba) return rows;
    let r = rows.slice(); if (t.cambia) for (const i in t.cambia) if (r[i] != null) r[i] = t.cambia[i];
    if (t.arriba) r = t.arriba.concat(r); return r;
  }
  function paleta(id, traje) {
    const def = S[id]; const t = traje && EL.VESTUARIO && EL.VESTUARIO[id] ? (EL.VESTUARIO[id].find(v => v.id === traje) || {}) : {};
    return Object.assign({}, def.pal, t.pal || {});
  }

  /* Devuelve el lienzo de un cuadro: estado = 'quieto' | 'paso' | 'salto' */
  EL.sprite = function (id, estado = 'quieto', traje = 'base') {
    const key = id + '|' + estado + '|' + traje;
    if (cache.has(key)) return cache.get(key);
    const def = S[id], tr = datosTraje(id, traje); let rows;
    if (def.animal) rows = conAccesorio(def.frames[estado] || def.frames.quieto, tr);
    else if (def.alta) {
      rows = conAccesorio(def.cuerpo, tr); const extra = rows.length - def.cuerpo.length;
      if (estado === 'paso') rows = rows.map((r, i) => i >= 22 + extra ? ('.' + r).slice(0, r.length + 1) : r + '.');
      else if (estado === 'salto') rows = rows.map((r, i) => i >= 28 + extra ? r.replace(/w/g, 'k') : r);
      rows = rows.map(r => r.padEnd(21, '.'));
    } else {
      rows = conAccesorio(def.cuerpo, tr).concat(PIERNAS[def.piernas][estado] || PIERNAS[def.piernas].quieto);
    }
    const c = construir(rows, paleta(id, traje));
    if (def.alfa) c.alfa = def.alfa;
    cache.set(key, c); return c;
  };
  EL.pieza = function (tipo, lado) {
    const key = 'pieza|' + tipo + lado;
    if (!cache.has(key)) cache.set(key, construir(S.piezas[tipo], S.palPiezas[lado], lado === 'negras' ? { contorno: '#f4ead2' } : {}));
    return cache.get(key);
  };
  /* Imagen ampliada como URL (para menús y tarjetas) */
  EL.spriteURL = function (id, escala = 4, traje = 'base', estado = 'quieto') {
    const s = id.startsWith('pieza:') ? EL.pieza(id.split(':')[1], id.split(':')[2]) : EL.sprite(id, estado, traje);
    const c = EL.canvas(s.width * escala, s.height * escala);
    c.x.drawImage(s, 0, 0, c.width, c.height); return c.toDataURL();
  };
  /* Silueta (personaje bloqueado) */
  EL.siluetaURL = function (id, escala = 4) {
    const s = EL.sprite(id), c = EL.canvas(s.width * escala, s.height * escala);
    c.x.drawImage(s, 0, 0, c.width, c.height); c.x.globalCompositeOperation = 'source-in'; c.x.fillStyle = '#2b2440'; c.x.fillRect(0, 0, c.width, c.height);
    return c.toDataURL();
  };
  EL.SPR = S;
  EL._construirSprite = construir;
})();
