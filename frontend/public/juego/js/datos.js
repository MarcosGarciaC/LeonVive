/* eslint-disable */
/* Ecos de León · datos del juego: zonas, personajes, vestuario, economía, historia y contenidos */
'use strict';

/* ---------- Economía (ecos) ----------
   Los ecos se ganan en los niveles y en los minijuegos y SOLO compran vestuario.
   Los personajes se desbloquean al terminar cada zona; los escenarios son fijos por zona. */
EL.ECONOMIA = {
  // ecos colocados en cada nivel de una zona: crecen con el nivel (1–50) y con la dificultad elegida
  ecosNivel: (k, dif) => 4 + Math.floor(k / 12) + dif,
  // bono al sonar la campana (zona completa) según la dificultad: fácil, medio, difícil
  bonoZona: [25, 40, 60],
  // premio de minijuego: primera victoria / repeticiones
  minijuego: { f: [15, 5], m: [30, 10], d: [50, 15] },
  // los ecos se guardan al sonar la campana; si se acaban las vidas o se sale, se pierden los de esa zona
  perderAlCaer: true
};
/* VERSIÓN DE PRUEBA: modo libre, todo abierto desde el inicio (zonas, personajes y minijuegos) */
EL.LIBRE = EL.VERSION !== 'final';   // prueba, demo y libre: todo abierto · final: se desbloquea jugando

/* ---------- Personajes jugables ---------- */
EL.PERSONAJES = {
  explorador: { nombre: 'Explorador', zona: 'leonviejo', rol: 'Protagonista del tutorial', habilidad: 'Corre, salta y reúne ecos.', icono: 'mover', stats: { vel: 140, salto: 470, w: 10, h: 21 }, desbloqueo: 'Disponible desde el inicio', minijuego: 'memoria' },
  dario: { nombre: 'Rubén Darío niño', zona: 'metapa', rol: 'El niño poeta', habilidad: '«Verso»: sus ondas hacen aparecer plataformas de palabras.', icono: 'verso', stats: { vel: 140, salto: 470, w: 10, h: 21 }, desbloqueo: 'Termina León Viejo (tutorial)', minijuego: 'sopa' },
  gigantona: { nombre: 'Gigantona y Enano Cabezón', zona: 'sutiaba', rol: 'Pareja de la tradición leonesa', habilidad: 'Cambia de personaje: la Gigantona salta muy alto; el Enano cabe por pasajes estrechos.', icono: 'cambio', stats: { vel: 120, salto: 560, w: 14, h: 36 }, enano: { vel: 140, salto: 430, w: 12, h: 19 }, desbloqueo: 'Termina Metapa', minijuego: 'ajedrez' },
  margarita: { nombre: 'Margarita', zona: 'centro', rol: 'La niña del poema «A Margarita Debayle»', habilidad: 'La estrella de su broche ilumina la oscuridad.', icono: 'luz', stats: { vel: 140, salto: 470, w: 10, h: 21 }, desbloqueo: 'Termina Sutiaba', minijuego: 'rompecabezas' },
  cadejo: { nombre: 'El Cadejo', zona: 'callereal', rol: 'Perro protector de los caminantes', habilidad: 'Muy veloz y con doble salto en la noche.', icono: 'doble', stats: { vel: 175, salto: 470, w: 20, h: 13, doble: true }, desbloqueo: 'Termina el Centro', minijuego: 'laberinto' },
  punche: { nombre: 'El Punche de Oro', zona: 'poneloya', rol: 'Cangrejo dorado de la leyenda', habilidad: 'Camina de lado y nada en la orilla.', icono: 'nado', stats: { vel: 135, salto: 450, w: 16, h: 10, nada: true }, desbloqueo: 'Termina la Calle Real de noche', minijuego: 'laberinto' }
};
EL.ORDEN_PERSONAJES = ['explorador', 'dario', 'gigantona', 'margarita', 'cadejo', 'punche'];

/* ---------- Zonas del mapa (escenario fijo en cada una) ---------- */
EL.ZONAS = [
  {
    id: 'leonviejo', nombre: 'León Viejo', sub: 'Tutorial', personaje: 'explorador', desbloquea: 'dario', mapa: [468, 282],
    mecanica: 'Moverse, saltar y reunir ecos', peligros: ['rocas'],
    dato: 'León Viejo fue fundada en 1524 a orillas del lago Xolotlán, frente al volcán Momotombo. Sus ruinas son Patrimonio de la Humanidad desde el año 2000.',
    fuente: 'UNESCO, Ruinas de León Viejo'
  },
  {
    id: 'metapa', nombre: 'Metapa', sub: 'Hoy Ciudad Darío', personaje: 'dario', desbloquea: 'gigantona', mapa: [490, 80],
    mecanica: 'Plataformas de verso', peligros: ['verso'],
    dato: 'Rubén Darío nació en Metapa (hoy Ciudad Darío, Matagalpa) el 18 de enero de 1867 y creció en León con su tía abuela Bernarda Sarmiento y el coronel Félix Ramírez.',
    fuente: 'Biografía de Rubén Darío, Biblioteca Virtual Miguel de Cervantes'
  },
  {
    id: 'sutiaba', nombre: 'Sutiaba', sub: 'Barrio indígena', personaje: 'gigantona', desbloquea: 'margarita', mapa: [198, 188],
    mecanica: 'Salto alto y pasajes estrechos', peligros: ['muro', 'tunel'],
    dato: 'Sutiaba es la comunidad indígena de León. La Gigantona y el Enano Cabezón bailan por las calles al son del tambor, sobre todo en diciembre.',
    fuente: 'Ficha «Gigantona», informe de identidad de Ecos de León'
  },
  {
    id: 'centro', nombre: 'Centro histórico', sub: 'La Catedral', personaje: 'margarita', desbloquea: 'cadejo', mapa: [312, 148],
    mecanica: 'Iluminar zonas oscuras', peligros: ['oscuro'],
    dato: 'La Catedral de León (Basílica de la Asunción) es Patrimonio de la Humanidad desde 2011. Allí descansan los restos de Rubén Darío, fallecido en León en 1916.',
    fuente: 'UNESCO, Catedral de León'
  },
  {
    id: 'callereal', nombre: 'Calle Real de noche', sub: 'Leyendas', personaje: 'cadejo', desbloquea: 'punche', mapa: [420, 196],
    mecanica: 'Velocidad, doble salto, tejas y barriles', peligros: ['tejas', 'barriles'],
    dato: 'Según la tradición oral, el Cadejo es un perro que acompaña y protege a quienes caminan de noche; el jinete fantasma recuerda la leyenda del coronel Arrechavala.',
    fuente: 'Tradición oral leonesa'
  },
  {
    id: 'poneloya', nombre: 'Poneloya', sub: 'Playa del Pacífico', personaje: 'punche', desbloquea: null, mapa: [90, 232],
    mecanica: 'Nado y movimiento lateral', peligros: ['agua', 'erizos'],
    dato: 'Poneloya es una playa del Pacífico cercana a León. La leyenda del Punche de Oro, de la tradición de Sutiaba, habla de un cangrejo dorado que guarda un tesoro.',
    fuente: 'Tradición oral de Sutiaba'
  },
  {
    id: 'griteria', nombre: 'La Gritería', sub: '7 de diciembre', personaje: null, final: true, mapa: [300, 246],
    dato: 'La Gritería se celebra cada 7 de diciembre en honor a la Purísima Concepción. Se atribuye su inicio en León, en 1857, a monseñor Gordiano Carranza.',
    fuente: 'Ficha «Gritería», informe de identidad de Ecos de León'
  }
];
EL.NIVELES = [
  { nombre: 'Avance', dif: 'Fácil', clave: 'f' },
  { nombre: 'Carrera', dif: 'Medio', clave: 'm', carrera: true },
  { nombre: 'Desafío', dif: 'Difícil', clave: 'd' }
];

/* ---------- Vestuario (lo único que se compra con ecos) ----------
   Cada traje pertenece a un personaje y solo se aplica a ese personaje.
   Precio: tramo del personaje (0 a 5) → 180+45·t, 300+60·t, 450+75·t */
(function () {
  const precio = (t, n) => [180 + 45 * t, 300 + 60 * t, 450 + 75 * t][n];
  /* Cada traje cambia colores Y agrega un accesorio visible (sombrero, capucha, corona, velo...)
     «cambia» reemplaza filas del dibujo; «arriba» agrega filas sobre la cabeza. */
  EL.VESTUARIO = {
    explorador: [
      { id: 'base', nombre: 'Caqui de expedición', precio: 0 },
      { id: 'invierno', nombre: 'Capucha de invierno', precio: precio(0, 0),
        pal: { h: '#f2c230', H: '#c79a14', c: '#f2c230', C: '#c79a14', k: '#2e6db0', b: '#2e6db0', p: '#2e4b7a', P: '#1e3256', f: '#2b2b2b' },
        cambia: { 0: '......hhhh......', 1: '....hhhhhhhh....', 2: '...hhhhhhhhhh...', 3: '..hhHHHHHHHHhh..', 4: '..hhssssssssHh..', 5: '..hsssssssssSh..', 6: '..hssessssesSh..', 7: '..hssessssesSh..', 8: '..hsqssssssqSh..' } },
      { id: 'cotona', nombre: 'Sombrero de palma y cotona', precio: precio(0, 1),
        pal: { c: '#f4efe1', C: '#cfc6ad', h: '#e8cc85', H: '#b8964c', b: '#7a2f22', x: '#c0392b', p: '#3a4a6b', P: '#28344d', k: '#a07a4a', f: '#6b4226' },
        cambia: { 0: '.....hhhhhh.....', 1: '.....hHhHhH.....', 2: '.....bbbbbb.....', 3: 'hhHhhHhhHhhHhhHh', 10: '.....xxxxxx.....' } },
      { id: 'cerronegro', nombre: 'Casco y gafas del Cerro Negro', precio: precio(0, 2),
        pal: { c: '#ff7a1a', C: '#c95a0a', h: '#2b2b2b', H: '#111111', g: '#7fe0ff', k: '#ff7a1a', p: '#ff7a1a', P: '#c95a0a', f: '#222222', b: '#222222' },
        cambia: { 0: '....hhhhhhhh....', 1: '...hhhhhhhhhh...', 2: '...kggkkkkggk...', 3: '...hhhhhhhhhh...' } }
    ],
    dario: [
      { id: 'base', nombre: 'Traje oscuro de domingo', precio: 0 },
      { id: 'marinero', nombre: 'Marinerito con gorra', precio: precio(1, 0),
        pal: { c: '#f4f4f4', C: '#c8ced8', w: '#ffffff', x: '#2f5fa8', p: '#2f5fa8', P: '#1f3f78' },
        cambia: { 0: '....wwwwwwww....', 1: '...wwwwwwwwww...', 2: '...xxxxxxxxxx...', 11: '....xxwxxwxx....' } },
      { id: 'lino', nombre: 'Lino blanco y canotier', precio: precio(1, 1),
        pal: { c: '#efe6cf', C: '#cbbf9f', x: '#2b2b2b', p: '#efe6cf', P: '#cbbf9f', f: '#7a4a2a', h: '#e8cc85', b: '#2b2b2b' },
        cambia: { 0: '....hhhhhhhh....', 1: '....bbbbbbbb....', 2: '.hhhhhhhhhhhhhh.' } },
      { id: 'azul', nombre: 'Boina y traje «Azul...»', precio: precio(1, 2),
        pal: { c: '#2b5fd9', C: '#1c3f99', x: '#f2c94c', p: '#1c3f99', P: '#122a6b', z: '#3a2a8a' },
        cambia: { 0: '......zzzzz.....', 1: '....zzzzzzzzz...', 2: '...zzzzzzzzzzz..' } }
    ],
    gigantona: [
      { id: 'base', nombre: 'Fiesta tradicional', precio: 0 },
      { id: 'purisima', nombre: 'Corona de flores (Purísima)', precio: precio(2, 0),
        pal: { c: '#ffffff', C: '#d9e4f2', k: '#7fb6ee', K: '#ffffff', v: '#7fb6ee', p: '#ff8fb8', f: '#ffffff' }, cambia: { 0: '......pfpfpfpf......' },
        enano: { pal: { c: '#7fb6ee', C: '#5a8fc6', h: '#ffffff', H: '#cfd8e6', p: '#ff8fb8' }, arriba: ['......pp.pp.....'] } },
      { id: 'diciembre', nombre: 'Flor de Pascua de diciembre', precio: precio(2, 1),
        pal: { c: '#2e8b57', C: '#1f6b42', k: '#c0392b', K: '#f2c94c', v: '#2e8b57', p: '#e8344a', f: '#2e8b57' }, cambia: { 0: '.......fppf.fppf....' },
        enano: { pal: { c: '#c0392b', C: '#8e2a20', h: '#c0392b', H: '#8e2a20', f: '#ffffff' }, arriba: ['...........ff...', '..........hh....'] } },
      { id: 'gala', nombre: 'Corona alta de gala', precio: precio(2, 2),
        pal: { c: '#f2c94c', C: '#c79a14', k: '#6b2fa0', K: '#f2c94c', v: '#f2c94c', w: '#fff3c4' }, arriba: ['........y..y........', '.......yyyyyy.......'],
        enano: { pal: { c: '#6b2fa0', C: '#4a1f70', h: '#2b2b2b', H: '#111111', y: '#f2c94c' }, arriba: ['....hhhhhhhh....', '....yyyyyyyy....', '....hhhhhhhh....'] } }
    ],
    margarita: [
      { id: 'base', nombre: 'Vestido celeste', precio: 0 },
      { id: 'malaquita', nombre: 'Tiara de malaquita', precio: precio(3, 0), pal: { c: '#3fae7a', C: '#2a8059', x: '#2a8059', t: '#ffd84a' }, cambia: { 0: '.....t.tt.t.....', 1: '.....rrxxrr.....' } },
      { id: 'tisu', nombre: 'Velo y manto de tisú', precio: precio(3, 1), pal: { c: '#d8c8f0', C: '#ad97d6', w: '#f4eefe', x: '#b8a2e6', V: '#ffffff' }, cambia: { 0: '....VVVVVVVV....', 1: '...VVrrxxrrVV...' } },
      { id: 'azahar', nombre: 'Corona de azahar', precio: precio(3, 2), pal: { c: '#fff7ee', C: '#e8d6c4', x: '#ff9f43', w: '#ffd9b0', F: '#ffffff', o: '#ff9f43' }, cambia: { 0: '....FoFoFoFo....', 1: '.....rrrrrr.....' } }
    ],
    cadejo: [
      { id: 'base', nombre: 'Cadejo blanco', precio: 0 },
      { id: 'negro', nombre: 'Cadejo negro', precio: precio(4, 0), pal: { c: '#34303d', C: '#1b1822', e: '#ffb02a', n: '#000000', f: '#3a2e24' } }
    ],
    // El Punche de Oro solo existe en oro: es su seña de identidad en la leyenda (se quitaron nácar, coral y jade)
    punche: [
      { id: 'base', nombre: 'Oro', precio: 0 }
    ]
  };
  // Partidas guardadas que compraron los trajes retirados del Punche: se devuelven sus ecos
  const retirados = { nacar: precio(5, 0), coral: precio(5, 1), jade: precio(5, 2) };
  const v = EL.save && EL.save.data && EL.save.data.vestuario && EL.save.data.vestuario.punche;
  if (v && Array.isArray(v.tiene)) {
    const devolver = v.tiene.filter(t => retirados[t]);
    if (devolver.length) { devolver.forEach(t => { EL.save.data.ecos += retirados[t]; }); v.tiene = v.tiene.filter(t => !retirados[t]); v.usa = 'base'; EL.save.guardar(); }
  }
  // El Enano comparte el traje de la Gigantona
  EL.VESTUARIO.enano = EL.VESTUARIO.gigantona.map(v => Object.assign({ id: v.id, nombre: v.nombre, precio: v.precio }, v.enano || {}));
})();

/* ---------- Minijuegos (uno por personaje; el laberinto une al Cadejo y al Punche de Oro) ---------- */
EL.MINIJUEGOS = [
  { id: 'memoria', nombre: 'Álbum del Explorador', tipo: 'Memoria de imágenes', personaje: 'explorador', abre: 'Termina el tutorial de León Viejo', lectura: false, niveles: ['6 parejas', '8 parejas', '12 parejas'] },
  { id: 'sopa', nombre: 'Letras de Darío', tipo: 'Sopa de letras', personaje: 'dario', abre: 'Desbloquea a Rubén Darío', lectura: true, niveles: ['6 palabras · 9×9', '9 palabras · 11×11', '13 palabras · 14×14'] },
  { id: 'ajedrez', nombre: 'Ajedrez de la Gigantona', tipo: 'Ajedrez', personaje: 'gigantona', abre: 'Desbloquea a la Gigantona y al Enano', lectura: false, niveles: ['Rival principiante', 'Rival atento', 'Rival experto'] },
  { id: 'rompecabezas', nombre: 'El cuento de Margarita', tipo: 'Rompecabezas', personaje: 'margarita', abre: 'Desbloquea a Margarita', lectura: false, niveles: ['9 piezas', '16 piezas', '25 piezas'] },
  { id: 'laberinto', nombre: 'Laberinto nocturno', tipo: 'Carrera sin fin', personaje: 'cadejo', abre: 'Desbloquea al Cadejo', lectura: false, niveles: ['Meta 300 m · más lento', 'Meta 500 m', 'Meta 700 m · más rápido'] }
];

/* ---------- Historia (escenas narradas) ---------- */
EL.HISTORIA = {
  intro: [
    { quien: 'leon', txt: '¡Hola, explorador! Soy León, el guardián de los ecos de esta ciudad.' },
    { quien: 'leon', txt: 'Un temblor del Momotombo esparció los ecos: los recuerdos de nuestra historia, nuestras tradiciones y nuestras leyendas.' },
    { quien: 'explorador', txt: '¡Yo te ayudo a recuperarlos!' },
    { quien: 'leon', txt: 'Empecemos en León Viejo, la primera ciudad. Aprende a moverte, a saltar y a reunir ecos.' }
  ],
  leonviejo: [
    { quien: 'leon', txt: '¡Lo lograste! Terminaste el tutorial de León Viejo.' },
    { quien: 'dario', txt: 'Ese eco que encontraste tiene versos... ¡son míos! Me llamo Rubén y nací en Metapa en 1867.' },
    { quien: 'dario', txt: '¿Me acompañas a Metapa? Mis primeros versos se perdieron entre los cerros.' },
    { quien: 'leon', txt: '¡Rubén Darío niño se une a la aventura! Metapa ya aparece en el mapa.' }
  ],
  metapa: [
    { quien: 'dario', txt: '¡Recuperé mis versos! Ahora vamos a León, a Sutiaba.' },
    { quien: 'gigantona', txt: '¡Pum, pum, pum! Con el tambor bailamos por las calles.' },
    { quien: 'enano', txt: 'Ella salta muy alto y yo quepo por donde nadie cabe. ¡Juntos somos un equipo!' },
    { quien: 'leon', txt: '¡La Gigantona y el Enano Cabezón se unen! También se abrió su juego de ajedrez.' }
  ],
  sutiaba: [
    { quien: 'margarita', txt: 'Margarita, está linda la mar, y el viento lleva esencia sutil de azahar...' },
    { quien: 'margarita', txt: 'Soy Margarita. La estrella de mi broche ilumina la oscuridad. Vamos al centro, junto a la Catedral.' },
    { quien: 'leon', txt: '¡Margarita se une! Ya puedes armar su cuento en el rompecabezas.' }
  ],
  centro: [
    { quien: 'leon', txt: 'Cae la noche sobre la Calle Real. Cuidado con las tejas que caen de los techos y con los barriles que ruedan.' },
    { quien: 'cadejo', txt: '¡Guau! Yo acompaño a quienes caminan de noche. Conmigo no hay que temer.' },
    { quien: 'leon', txt: '¡El Cadejo se une! Se abrió la carrera del laberinto nocturno.' }
  ],
  callereal: [
    { quien: 'punche', txt: '¡Clic, clic! Me viste brillar a la luz de la luna. Soy el Punche de Oro.' },
    { quien: 'punche', txt: 'Te llevo a Poneloya, donde el mar guarda el último eco.' },
    { quien: 'leon', txt: '¡El Punche de Oro se une! En el laberinto nocturno hay filas de Punches que debes saltar.' }
  ],
  poneloya: [
    { quien: 'leon', txt: '¡Recuperaste todos los ecos de León!' },
    { quien: 'leon', txt: 'Es 7 de diciembre. Vamos todos a celebrar la Gritería frente al altar de la Purísima.' }
  ]
};
EL.QUIEN = { leon: 'León', explorador: 'Explorador', dario: 'Rubén', gigantona: 'Gigantona', enano: 'Enano Cabezón', margarita: 'Margarita', cadejo: 'Cadejo', punche: 'Punche de Oro' };

/* ---------- Sopa de letras: bancos por tema (ninguna palabra se repite entre temas) ---------- */
EL.SOPA = {
  vida: {
    nombre: 'La vida de Darío',
    palabras: [
      ['METAPA', 'Nació en Metapa, hoy Ciudad Darío, en 1867.'], ['LEON', 'Creció en León con su tía abuela.'], ['BERNARDA', 'Bernarda Sarmiento, su tía abuela, lo crio.'],
      ['FELIX', 'Su nombre completo era Félix Rubén García Sarmiento.'], ['SARMIENTO', 'Sarmiento era el apellido de su madre, Rosa.'], ['POETA', 'Lo llamaron «el niño poeta».'],
      ['CHILE', 'Vivió en Chile entre 1886 y 1889.'], ['VALPARAISO', 'En Valparaíso publicó «Azul...» en 1888.'], ['BUENOSAIRES', 'En Buenos Aires publicó «Prosas profanas» (1896).'],
      ['MADRID', 'Vivió en Madrid, donde publicó «Cantos de vida y esperanza».'], ['PARIS', 'Pasó largas temporadas en París.'], ['PERIODISTA', 'Trabajó como periodista en varios países.'],
      ['DIPLOMATICO', 'En 1908 fue ministro de Nicaragua en España.'], ['MODERNISMO', 'Es la gran figura del modernismo literario.'], ['CATEDRAL', 'Sus restos descansan en la Catedral de León.'],
      ['NICARAGUA', 'Es el poeta más reconocido de Nicaragua.'], ['MANAGUA', 'De joven trabajó en la Biblioteca Nacional en Managua.'], ['CONSUL', 'Fue cónsul de Colombia en Buenos Aires.']
    ]
  },
  obras: {
    nombre: 'Sus libros y poemas',
    palabras: [
      ['AZUL', '«Azul...» (1888) renovó la poesía en español.'], ['ABROJOS', '«Abrojos» se publicó en Chile en 1887.'], ['RAROS', '«Los raros» (1896) reúne retratos de escritores.'],
      ['PROSAS', '«Prosas profanas» apareció en 1896.'], ['CANTOS', '«Cantos de vida y esperanza» se publicó en 1905.'], ['SONATINA', '«Sonatina»: «La princesa está triste...».'],
      ['CARACOL', '«Caracol»: un poema sobre un caracol de la playa.'], ['MARGARITA', '«A Margarita Debayle» es un cuento en verso.'], ['PRIMAVERA', '«Canción de otoño en primavera».'],
      ['JUVENTUD', '«Juventud, divino tesoro, ¡ya te vas para no volver!».'], ['FATAL', '«Lo fatal» habla de las dudas de la vida.'], ['TRIUNFAL', '«Marcha triunfal»: «¡Ya viene el cortejo!».'],
      ['CISNES', '«Los cisnes»: el cisne es un símbolo de su poesía.'], ['ERRANTE', '«El canto errante» se publicó en 1907.'], ['OTOÑO', '«Poema del otoño» apareció en 1910.'],
      ['NOCTURNO', '«Nocturno» es uno de sus poemas más conocidos.'], ['SALUTACION', '«Salutación del optimista».'], ['LETANIA', '«Letanía de nuestro señor Don Quijote».']
    ]
  },
  versos: {
    nombre: 'Palabras de sus versos',
    palabras: [
      ['PRINCESA', '«La princesa está triste...» (Sonatina).'], ['ESTRELLA', 'La princesa fue a cortar una estrella.'], ['PALACIO', '«un palacio de diamantes».'],
      ['DIAMANTES', 'El rey tenía un palacio de diamantes.'], ['ELEFANTES', '«y un rebaño de elefantes».'], ['KIOSKO', '«un kiosko de malaquita».'],
      ['MALAQUITA', 'La malaquita es una piedra verde.'], ['TISU', '«un gran manto de tisú».'], ['AZAHAR', '«lleva esencia sutil de azahar».'],
      ['PRENDEDOR', 'La princesa luce la estrella en su prendedor.'], ['VERSO', '«verso, perla, pluma y flor».'], ['PERLA', 'La perla aparece en el prendedor.'],
      ['PLUMA', 'La pluma: símbolo del poeta.'], ['FLOR', 'La flor completa el prendedor.'], ['SUSPIROS', '«Los suspiros se escapan de su boca de fresa».'],
      ['FRESA', '«su boca de fresa» (Sonatina).'], ['HADA', '«¡Calla, calla, princesa!», dice el hada madrina (Sonatina).'], ['TECLADO', '«está mudo el teclado de su clave sonoro».']
    ]
  }
};

/* ---------- Rompecabezas: escenas de «A Margarita Debayle» (Rubén Darío, 1908; dominio público) ---------- */
EL.ESCENAS = [
  { id: 'mar', titulo: 'Linda la mar', verso: 'Margarita, está linda la mar,\ny el viento\nlleva esencia sutil de azahar.' },
  { id: 'palacio', titulo: 'El palacio de diamantes', verso: 'Este era un rey que tenía\nun palacio de diamantes,\nuna tienda hecha del día\ny un rebaño de elefantes.' },
  { id: 'kiosko', titulo: 'La princesita', verso: 'Un kiosko de malaquita,\nun gran manto de tisú,\ny una gentil princesita,\ntan bonita, Margarita,\ntan bonita como tú.' },
  { id: 'estrella', titulo: 'La estrella', verso: 'Una tarde la princesa\nvio una estrella aparecer;\nla princesa era traviesa\ny la quiso ir a coger.' },
  { id: 'camino', titulo: 'Bajo el cielo y sobre el mar', verso: 'Y se fue la niña bella,\nbajo el cielo y sobre el mar,\na cortar la blanca estrella\nque la hacía suspirar.' },
  { id: 'prendedor', titulo: 'El prendedor', verso: 'Y la princesa está bella,\npues ya tiene el prendedor\nen que lucen, con la estrella,\nverso, perla, pluma y flor.' }
];

/* ---------- Memoria: imágenes del álbum del explorador ---------- */
EL.ALBUM = {
  lugares: ['catedral', 'ruinas', 'momotombo', 'sutiabaIg', 'cerronegro', 'mar', 'farol', 'tamarindo'],
  tradiciones: ['gigantona', 'cabezon', 'altar', 'cohete', 'alfombra', 'quesillo', 'cana', 'tambor'],
  poemas: ['cisne', 'estrella', 'caracol', 'rosa', 'pluma', 'libro', 'corona', 'elefante']
};
EL.NOMBRE_ICONO = {
  catedral: 'Catedral de León', ruinas: 'Ruinas de León Viejo', momotombo: 'Volcán Momotombo', sutiabaIg: 'Iglesia de Sutiaba', cerronegro: 'Cerro Negro', mar: 'Mar de Poneloya', farol: 'Farol colonial', tamarindo: 'El Tamarindón',
  gigantona: 'La Gigantona', cabezon: 'Enano Cabezón', altar: 'Altar de la Purísima', cohete: 'Pólvora de fiesta', alfombra: 'Alfombras de Sutiaba', quesillo: 'Quesillo', cana: 'Caña de azúcar', tambor: 'Tambor',
  cisne: 'El cisne', estrella: 'La estrella de Margarita', caracol: 'Caracol', rosa: 'La rosa', pluma: 'Pluma y tintero', libro: 'Libro «Azul...»', corona: 'Corona de la princesa', elefante: 'Rebaño de elefantes'
};

/* ---------- Gritería: regalos («gorra») ---------- */
EL.GORRA = ['caña de azúcar', 'naranja', 'gofio', 'limón dulce', 'chimbomba', 'pito de barro', 'cajeta'];

EL.EQUIPO = { prueba: 'Ecos de León · Historia e Identidad Cultural · Versión de prueba (no publicada)', demo: 'Ecos de León · Historia e Identidad Cultural · Demo', final: 'Ecos de León · Historia e Identidad Cultural', libre: 'Ecos de León · Historia e Identidad Cultural · Versión libre (todo desbloqueado)' }[EL.VERSION];
