// Curated from the two supplied Ecos de León project reports.
// Photographs on Wikimedia Commons can load when online; local illustration fallbacks are provided.
export const places = [
  {
    id: 'catedral', category: 'Patrimonio mundial', title: 'Catedral de León',
    subtitle: 'Un símbolo que toca el cielo', area: 'Centro histórico',
    description: 'La Basílica Catedral de la Asunción es uno de los símbolos de León. Su arquitectura combina influencias barrocas y neoclásicas y fue declarada Patrimonio Mundial por la UNESCO en 2011.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Leon_Cathedral_2018.jpg/1280px-Leon_Cathedral_2018.jpg',
    fallback: '/images/leon-arquitectura.webp',
    map: 'Catedral de León Nicaragua', source: 'Documentado',
  },
  {
    id: 'cerro-negro', category: 'Naturaleza y aventura', title: 'Volcán Cerro Negro',
    subtitle: 'La fuerza de una tierra viva', area: 'Cordillera de los Maribios',
    description: 'Nacido en 1850, el Cerro Negro es uno de los volcanes más jóvenes del mundo. Su paisaje de ceniza negra forma parte de la identidad natural del departamento.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Cerro_Negro_volcano_in_Nicaragua_01.jpg/1280px-Cerro_Negro_volcano_in_Nicaragua_01.jpg',
    fallback: '/images/leon-volcanes.webp',
    map: 'Volcán Cerro Negro León Nicaragua', source: 'Documentado',
  },
  {
    id: 'leon-viejo', category: 'Historia y arqueología', title: 'Ruinas de León Viejo',
    subtitle: 'Donde comenzó la historia', area: 'La Paz Centro',
    description: 'Las ruinas preservan el trazado de la ciudad fundada en 1524 a orillas del lago Xolotlán. El sitio integra la Lista del Patrimonio Mundial desde el año 2000.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Ruinas_leon_viejo08.jpg/960px-Ruinas_leon_viejo08.jpg',
    fallback: '/images/leon-centro.webp',
    map: 'Ruinas de León Viejo La Paz Centro Nicaragua', source: 'Documentado',
  },
  {
    id: 'sutiaba', category: 'Comunidad y tradición', title: 'Sutiaba',
    subtitle: 'La memoria que sigue presente', area: 'Occidente de León',
    description: 'Más que un barrio histórico, Sutiaba es una comunidad indígena viva que conserva expresiones culturales, memoria colectiva y saberes transmitidos entre generaciones.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Iglesia_de_San_Juan_Bautista_de_Sutiava_05_2024_A_Vista_general.jpg/1280px-Iglesia_de_San_Juan_Bautista_de_Sutiava_05_2024_A_Vista_general.jpg',
    fallback: '/images/leon-centro.webp',
    map: 'Iglesia San Juan Bautista Sutiaba León Nicaragua', source: 'Documentado', imageAlt: 'Iglesia de San Juan Bautista de Sutiaba',
  },
  {
    id: 'museo-dario', category: 'Arte y literatura', title: 'Museo-Archivo Rubén Darío',
    subtitle: 'La casa de la palabra', area: 'Ciudad de León',
    description: 'Conoce la casa donde el poeta vivió su niñez. Hoy conserva recuerdos y materiales vinculados con una de las grandes figuras del modernismo en lengua española.',
    image: '/images/leon-centro.webp', imageAlt: 'Ilustración contextual del centro histórico leonés, no del interior del museo',
    fallback: '/images/leon-arquitectura.webp',
    map: 'Museo Archivo Rubén Darío León Nicaragua', source: 'Documentado',
  },
  {
    id: 'las-penitas', category: 'Costa del Pacífico', title: 'Las Peñitas',
    subtitle: 'El océano también cuenta historias', area: 'Costa de León',
    description: 'A poca distancia de la ciudad, la costa del Pacífico ofrece otro rostro de León: paisajes abiertos, comunidades pesqueras y atardeceres frente al mar.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Foto_Poneloya.jpg/960px-Foto_Poneloya.jpg',
    fallback: '/images/leon-volcanes.webp',
    map: 'Playa Las Peñitas León Nicaragua', source: 'Lugar de interés',
  },
]

export const celebrations = [
  { id: 'alfombras', title: 'Alfombras pasionarias', month: 3, day: null, dateLabel: 'Viernes Santo · fecha variable', location: 'Sutiaba', type: 'Arte y devoción', description: 'Los artesanos realizan coloridas alfombras con aserrín teñido, flores y otros materiales.' },
  { id: 'griteria-chiquita', title: 'Gritería Chiquita', month: 7, day: 15, dateLabel: 'Alrededor del 15 de agosto', location: 'León', type: 'Tradición religiosa', description: 'Celebración vinculada con la Virgen de la Asunción y la memoria de las erupciones del Cerro Negro de 1947.' },
  { id: 'merced', title: 'Virgen de la Merced', month: 8, day: 24, dateLabel: '24 de septiembre', location: 'Santuario de La Merced', type: 'Fiesta patronal', description: 'Celebración de la patrona de León que reúne a familias y comunidades.' },
  { id: 'carnaval', title: 'Carnaval de Mitos y Leyendas', month: 10, day: null, dateLabel: 'Noviembre · fecha por confirmar', location: 'De Sutiaba al centro', type: 'Cultura popular', description: 'Comparsas y música llevan los personajes de las leyendas a las calles.' },
  { id: 'gigantona', title: 'La Gigantona y el Enano Cabezón', month: 11, day: null, dateLabel: 'Noviembre y diciembre', location: 'Calles de León', type: 'Arte popular', description: 'Copleros, tambores y figuras danzantes animan las calles de la ciudad.' },
  { id: 'purisima', title: 'La Purísima y la Gritería', month: 11, day: 7, dateLabel: '7 de diciembre', location: 'Barrios de León', type: 'Tradición religiosa', description: 'Cantos, altares y encuentros familiares recuerdan una tradición que nació en León en 1857.' },
]

export const curiosities = [
  { number: '1524', title: 'Una ciudad con siglos de historia', text: 'La primera León fue fundada en 1524, cerca del volcán Momotombo.' },
  { number: '1816', title: 'Una ciudad universitaria', text: 'Se instaló la Universidad de León, la segunda de Centroamérica.' },
  { number: '02', title: 'Patrimonios mundiales', text: 'León Viejo y la Catedral figuran en la lista de la UNESCO.' },
  { number: '1850', title: 'Una tierra que se transforma', text: 'Ese año surgió el volcán Cerro Negro en el departamento.' },
]

export const people = [
  { name: 'Rubén Darío', category: 'Literatura', description: 'Poeta central del modernismo, creció en León y está sepultado en la Catedral.' },
  { name: 'Salomón de la Selva', category: 'Literatura', description: 'Poeta nacido en León, autor de El soldado desconocido.' },
  { name: 'Miguel Larreynaga', category: 'Historia', description: 'Jurista leonés y firmante del Acta de Independencia de 1821.' },
  { name: 'José de la Cruz Mena', category: 'Música', description: 'Compositor leonés reconocido por sus valses.' },
]

export const story = [
  { id: 'origen', title: 'De León Viejo a la ciudad actual', label: 'Historia', description: 'Conoce su fundación en 1524 y el traslado de la ciudad en 1610.' },
  { id: 'sutiaba-historia', title: 'Sutiaba, una comunidad viva', label: 'Identidad', description: 'Una cultura originaria que sigue conservando sus saberes y su memoria.' },
  { id: 'ruben', title: 'El León de Rubén Darío', label: 'Personajes', description: 'Descubre los lugares y los recuerdos del poeta en la ciudad.' },
  { id: 'tradiciones', title: 'Fiestas que cuentan historias', label: 'Tradiciones', description: 'Gigantonas, Gritería, alfombras y los ecos del pueblo leonés.' },
]
