// Catálogo editorial: contenidos de los informes de Identidad y Web de Ecos de León,
// más referencias complementarias para gastronomía y avifauna.
// Los recuentos reflejan fichas incluidas en esta demostración, no inventarios oficiales.
const L = '/images/'
const commons = (name) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1400`
const pic = (image, fallback = `${L}leon-centro.webp`, credit = 'Fotografía contextual o ilustración de referencia') => ({ image, fallback, credit })

export const topics = [
  {
    slug: 'historia', title: 'Historia de León', short: 'Historia', eyebrow: '01 / HUELLAS DEL TIEMPO',
    kicker: 'El tiempo también tiene memoria',
    intro: 'Una ciudad que se ha levantado entre volcanes, generaciones y cambios. Cada calle es el inicio de otra historia.',
    description: 'De los primeros asentamientos indígenas a la vida universitaria y la riqueza de su patrimonio: descubre los momentos que dieron forma a León.',
    quote: 'No hay una sola historia de León. Hay siglos de memorias que todavía habitan sus calles.',
    hero: `${L}leon-arquitectura.webp`, secondary: `${L}leon-centro.webp`,
    palette: '#263d32', accent: '#e0be82', motif: '1524 · 1610 · 1816 · 2011',
    source: 'Informe de Identidad Cultural · UNESCO · UNAN-León',
    entries: [
      { title: 'León Viejo, el primer comienzo', kicker: '1524 · La Paz Centro', description: 'Fundada en 1524 cerca del Momotombo, la primera León conserva en sus ruinas parte de su trazado colonial. Es Patrimonio Mundial de la UNESCO desde 2000.', ...pic('https://www.beyondtheordinary.co.uk/wp-content/uploads/2024/07/Leon-Viejo-Ruins.jpg', `${L}leon-centro.webp`, 'Ruinas de León Viejo · fotografía de referencia'), tag: 'Documentado' },
      { title: 'El traslado de la ciudad', kicker: '1610 · Nuevo asentamiento', description: 'Después de los daños causados por fenómenos naturales, León se trasladó a su emplazamiento actual, junto a Sutiaba, una comunidad con identidad propia y viva.', ...pic(`${L}leon-centro.webp`), tag: 'Documentado' },
      { title: 'La Catedral de la Asunción', kicker: '1747–siglo XIX · Patrimonio Mundial', description: 'Su arquitectura combina rasgos barrocos y neoclásicos. En 2011 fue incorporada a la Lista del Patrimonio Mundial de la UNESCO.', ...pic(`${L}leon-arquitectura.webp`), tag: 'Documentado' },
      { title: 'León y su universidad', kicker: '1812–1816 · Educación', description: 'La Universidad de León se decretó en 1812 y comenzó a funcionar en 1816, consolidando la importancia académica de la ciudad en Centroamérica.', ...pic(`${L}leon-atardecer.webp`), tag: 'Documentado' },
      { title: 'Cerro Negro, paisaje cambiante', kicker: '1850 · Naturaleza', description: 'El volcán Cerro Negro surgió en 1850. Su presencia ha marcado el paisaje y la memoria de la ciudad, incluidas algunas de sus tradiciones.', ...pic(`${L}leon-volcanes.webp`), tag: 'Documentado' },
    ],
  },
  {
    slug: 'personajes', title: 'Personajes históricos', short: 'Personajes', eyebrow: '02 / VOCES INOLVIDABLES',
    kicker: 'Vidas que dejaron huella', intro: 'Poetas, artistas, docentes y pensadores. Detrás de cada legado hay una vida que merece ser contada.',
    description: 'Conoce las figuras que marcaron la literatura, la educación, la música y la memoria cultural de León.',
    quote: 'Una ciudad también se escribe con los nombres de quienes la soñaron.',
    hero: `${L}leon-atardecer.webp`, secondary: `${L}leon-arquitectura.webp`,
    palette: '#3b3b2f', accent: '#dbbc88', motif: 'POESÍA · MÚSICA · MEMORIA',
    source: 'Informe de Identidad Cultural · fichas de personajes',
    entries: [
      { title: 'Rubén Darío', kicker: '1867–1916 · Literatura', description: 'Félix Rubén García Sarmiento creció en León y se convirtió en la figura más destacada del modernismo literario en lengua española. Su casa de infancia es hoy museo.', ...pic('https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D768%2Ch%3D723%2Cfit%3Dcrop%2Ctrim%3D271.7647058823529%3B0%3B321.17647058823525%3B0/mP4PJowMRDhng3ay/afbeelding-van-whatsapp-op-2023-10-24-om-01.01.08_87c80ae8-d953Nw3gg2fE3D7k.jpg', `${L}leon-centro.webp`, 'Museo Rubén Darío · imagen de referencia'), tag: 'Documentado' },
      { title: 'Miguel Larreynaga', kicker: '1771 o 1772–1847 · Independencia', description: 'Jurista y científico nacido en León. Formó parte de los firmantes del Acta de Independencia de Centroamérica. Las fuentes difieren en su año de nacimiento.', ...pic(`${L}leon-arquitectura.webp`), tag: 'Fuentes discrepantes' },
      { title: 'Salomón de la Selva', kicker: '1893–1959 · Poesía', description: 'Poeta leonés cuya obra incluye El soldado desconocido (1922), inspirada por su experiencia durante la Primera Guerra Mundial.', ...pic(`${L}leon-centro.webp`), tag: 'Documentado' },
      { title: 'José de la Cruz Mena', kicker: '1874–1907 · Música', description: 'Compositor leonés conocido por valses como Ruinas. El Teatro Municipal de León lleva hoy su nombre.', ...pic(`${L}leon-atardecer.webp`), tag: 'Documentado' },
      { title: 'Carmen Toruño López', kicker: 'Memoria cultural · Museos', description: 'Promotora cultural que fundó en 1993 el Museo de Leyendas y Tradiciones, un espacio para preservar relatos y personajes populares.', ...pic(`${L}leon-centro.webp`), tag: 'Documentado' },
    ],
  },
  {
    slug: 'gastronomia', title: 'Gastronomía', short: 'Gastronomía', eyebrow: '03 / SABORES DE ORIGEN',
    kicker: 'El sabor de nuestra tierra', intro: 'Entre maíz, cacao, fogones y recetas compartidas, León guarda historias que también se cuentan al comer.',
    description: 'Un recorrido por preparaciones que pasan de generación en generación, de las cocinas familiares a los mercados y caminos del departamento.',
    quote: 'Hay recuerdos que no se leen: se reconocen en el aroma de una cocina.',
    hero: `${L}leon-centro.webp`, secondary: `${L}leon-atardecer.webp`,
    palette: '#5c4932', accent: '#f4ca93', motif: 'MAÍZ · CACAO · TRADICIÓN',
    source: 'Mapa gastronómico de León, INC 2023 · Mapa Nacional de Turismo',
    entries: [
      { title: 'El quesillo', kicker: 'Nagarote y La Paz Centro', description: 'Tortilla de maíz caliente con queso suave, crema y cebolla encurtida. Uno de los sabores más reconocibles del departamento.', ...pic('https://www.vivanicaragua.com.ni/contenido/archivos/2019/11/La-Paz-Centro-realiza-el-quesillo-m%C3%A1s-grande-de-Nicaragua.jpg', `${L}leon-centro.webp`, 'Preparación tradicional de quesillo · imagen de referencia'), tag: 'Cocina tradicional' },
      { title: 'Enchiladitas leonesas', kicker: 'León · Cocina popular', description: 'Bocado popular asociado a la cocina local, presente en la oferta de fritangas y preparaciones tradicionales del municipio.', ...pic(`${L}leon-atardecer.webp`), tag: 'Cocina tradicional' },
      { title: 'Nacatamales', kicker: 'Hojas de plátano · Maíz', description: 'Masa de maíz rellena y envuelta en hojas de plátano; una preparación familiar compartida también en otras regiones de Nicaragua.', ...pic(`${L}leon-centro.webp`), tag: 'Tradición nacional' },
      { title: 'Tiste y pinolillo', kicker: 'Cacao y maíz · Bebidas', description: 'Bebidas de maíz y cacao que acompañan la vida cotidiana y las celebraciones del occidente nicaragüense.', ...pic(`${L}leon-volcanes.webp`), tag: 'Cocina tradicional' },
      { title: 'Cosa de horno', kicker: 'Hornitos y recetas familiares', description: 'Preparación horneada de maíz asociada a las tradiciones artesanales y familiares de León y La Paz Centro.', ...pic(`${L}leon-arquitectura.webp`), tag: 'Cocina tradicional' },
    ],
  },
  {
    slug: 'cultura', title: 'Cultura', short: 'Cultura', eyebrow: '04 / IDENTIDAD VIVA',
    kicker: 'La ciudad que crea', intro: 'León se expresa en el arte de sus barrios, la música de sus calles y los saberes que se transmiten de mano en mano.',
    description: 'Explora la vida cultural leonesa, donde conviven el patrimonio arquitectónico, la memoria comunitaria, la poesía y los oficios.',
    quote: 'La identidad no es un recuerdo inmóvil. Es algo que se vive y se comparte.',
    hero: `${L}leon-arquitectura.webp`, secondary: `${L}leon-centro.webp`,
    palette: '#30463b', accent: '#e5cd9c', motif: 'COMUNIDAD · ARTE · PALABRA',
    source: 'Informe de Identidad Cultural · memorias de Sutiaba y León',
    entries: [
      { title: 'Sutiaba, comunidad viva', kicker: 'Raíces indígenas · Presente', description: 'Sutiaba conserva prácticas, memorias y formas de organización propias. Su cultura no pertenece solamente al pasado: sigue viva en su comunidad.', ...pic(`${L}leon-centro.webp`), tag: 'Documentado' },
      { title: 'La poesía en León', kicker: 'Rubén Darío y otras voces', description: 'La literatura ocupa un lugar especial en León, vinculada con autores como Rubén Darío, Alfonso Cortés y Salomón de la Selva.', ...pic(`${L}leon-atardecer.webp`), tag: 'Documentado' },
      { title: 'Coplas, música y tambor', kicker: 'Expresión popular · Calles', description: 'Los tambores y las coplas improvisadas forman parte de las representaciones populares, incluidas las comparsas de la Gigantona.', ...pic('https://www.infobae.com/resizer/v2/Z7MUDVXBPFEPNOG5QJAOOINFGA.jpg?auth=52d87f48c5de60b9f54bbd14e92bb38939b05dc7610fb3f62f396275a6f5c725&height=675&quality=85&smart=true&width=1200', `${L}leon-centro.webp`, 'Expresión popular · referencia de imagen'), tag: 'Tradición viva' },
      { title: 'Artesanía y saberes', kicker: 'Oficios · Talleres', description: 'La elaboración de gigantones, objetos tradicionales y alfombras de aserrín reúne conocimientos compartidos entre generaciones.', ...pic(`${L}leon-arquitectura.webp`), tag: 'Tradición viva' },
      { title: 'Museo de Leyendas', kicker: 'Patrimonio · Memoria', description: 'Fundado en 1993 por Carmen Toruño López, el museo conserva representaciones de personajes de la tradición popular leonesa.', ...pic(`${L}leon-centro.webp`), tag: 'Documentado' },
    ],
  },
  {
    slug: 'tradiciones', title: 'Tradiciones', short: 'Tradiciones', eyebrow: '05 / CELEBRAR LO NUESTRO',
    kicker: 'Historias que salen a la calle', intro: 'Entre tambores, colores, alfombras y altares, las tradiciones de León se sienten antes de poder explicarlas.',
    description: 'Festividades y costumbres que reúnen familias, barrios y comunidades, preservadas por quienes las celebran cada año.',
    quote: 'Cada celebración es una forma de decir: aquí seguimos, aquí recordamos.',
    hero: `${L}leon-atardecer.webp`, secondary: `${L}leon-centro.webp`,
    palette: '#3c4535', accent: '#ebc18b', motif: 'CALLES · FIESTAS · ENCUENTROS',
    source: 'Informe de Identidad Cultural · calendario de tradiciones',
    entries: [
      { title: 'La Gigantona y el Enano Cabezón', kicker: 'Noviembre–diciembre', description: 'Una figura danzante acompañada por un Enano Cabezón, tambores y coplas. Es uno de los símbolos populares más reconocibles de León.', ...pic('https://eldiarionica.com/wp-content/uploads/sites/2/2022/08/photo_5145553872570395361_w.jpg', `${L}leon-centro.webp`, 'La Gigantona · fotografía de referencia'), tag: 'Tradición viva' },
      { title: 'Alfombras pasionarias', kicker: 'Viernes Santo · Sutiaba', description: 'Artesanos cubren tramos de la calle con diseños hechos de aserrín teñido, flores y otros materiales durante la Semana Santa.', ...pic('https://www.steppestravel.com/us/app/uploads/2026/01/sawdust-murals-leon-nicaragua-1024x576.jpg', `${L}leon-arquitectura.webp`, 'Alfombra pasionaria · imagen de referencia'), tag: 'Tradición viva' },
      { title: 'La Purísima y la Gritería', kicker: '7 de diciembre · León', description: 'Altares, cantos y encuentros populares marcan una celebración nacida en 1857 en el barrio San Felipe de León.', ...pic(`${L}leon-centro.webp`), tag: 'Documentado' },
      { title: 'La Gritería Chiquita', kicker: 'Agosto · Virgen de la Asunción', description: 'Su origen se vincula con una promesa religiosa en 1947, durante una etapa de actividad del volcán Cerro Negro.', ...pic(`${L}leon-volcanes.webp`), tag: 'Tradición documentada' },
      { title: 'Carnaval de Mitos y Leyendas', kicker: 'Noviembre · Desfiles', description: 'Comparsas y personajes de leyendas recorren las calles, representando públicamente relatos transmitidos por las familias.', ...pic('https://www.infobae.com/resizer/v2/Z7MUDVXBPFEPNOG5QJAOOINFGA.jpg?auth=52d87f48c5de60b9f54bbd14e92bb38939b05dc7610fb3f62f396275a6f5c725&height=675&quality=85&smart=true&width=1200', `${L}leon-centro.webp`, 'Celebración popular · imagen contextual'), tag: 'Tradición viva' },
    ],
  },
  {
    slug: 'aves', title: 'Aves comunes de León', short: 'Aves de León', eyebrow: '06 / NATURALEZA CERCANA',
    kicker: 'Alas sobre el occidente', intro: 'Desde los árboles de nuestros barrios hasta los manglares de Juan Venado, León también se descubre mirando al cielo.',
    description: 'Una primera selección de especies que pueden observarse en el entorno urbano y en ecosistemas costeros del departamento. La presencia varía según hábitat y temporada.',
    quote: 'A veces la historia de un lugar también se escucha en el canto de sus aves.',
    hero: 'https://www.visitleon.info/uploads/1/2/0/4/120453990/reserva-natural-isla-juan-venado-visit-leon-nicaragua_orig.jpg', heroFallback: `${L}leon-volcanes.webp`, secondary: `${L}leon-volcanes.webp`,
    palette: '#24453c', accent: '#d9d6a8', motif: 'BARRIOS · MANGLARES · AVES',
    source: 'UNAN · estudio de avifauna · Reserva Natural Isla Juan Venado, Visit León',
    entries: [
      { title: 'Urraca copetona', kicker: 'Calocitta formosa · Bosques y jardines', description: 'Ave de cola larga y cresta llamativa, asociada a los ambientes abiertos y arbolados del Pacífico. Es fácil reconocerla por sus contrastes de azul y blanco.', ...pic(commons('Calocitta formasa (24069063223).jpg'), `${L}leon-volcanes.webp`, 'Urraca copetona · Dick Culbert / Wikimedia Commons · CC BY 2.0'), tag: 'Avifauna' },
      { title: 'Zanate grande', kicker: 'Quiscalus mexicanus · Zona urbana', description: 'De plumaje oscuro y vocalizaciones variadas, suele verse en espacios abiertos, parques y zonas habitadas del occidente.', ...pic(commons('Quiscalus mexicanus.jpg'), `${L}leon-centro.webp`, 'Fotografía de especie · Wikimedia Commons, si disponible'), tag: 'Avifauna' },
      { title: 'Garza blanca', kicker: 'Ardea alba · Humedales', description: 'Ave zancuda de plumaje blanco que frecuenta cuerpos de agua. Puede observarse en entornos como los esteros de Isla Juan Venado.', ...pic('https://www.visitleon.info/uploads/1/2/0/4/120453990/reserva-natural-isla-juan-venado-visit-leon-nicaragua_orig.jpg', `${L}leon-volcanes.webp`, 'Garza blanca · Reserva Isla Juan Venado · Visit León'), tag: 'Avifauna' },
      { title: 'Espátula rosada', kicker: 'Platalea ajaja · Humedales costeros', description: 'Ave acuática de tonos rosados y pico característico. Se incluye entre las aves reportadas en los hábitats de Isla Juan Venado.', ...pic(commons('Roseate spoonbill (Platalea ajaja).jpg'), `${L}leon-volcanes.webp`, 'Fotografía de especie · Wikimedia Commons, si disponible'), tag: 'Avifauna' },
      { title: 'Chocoyos', kicker: 'Pericos · Áreas arboladas', description: 'Los chocoyos son aves sociales que vuelan en grupos y se reconocen por sus voces. Diversos pericos se encuentran entre las aves registradas en la región.', ...pic(commons('Aratinga canicularis.jpg'), `${L}leon-centro.webp`, 'Imagen ilustrativa de perico · Wikimedia Commons, si disponible'), tag: 'Avifauna' },
    ],
  },
  {
    slug: 'leyendas', title: 'Leyendas', short: 'Leyendas', eyebrow: '07 / RELATOS AL ATARDECER',
    kicker: 'Lo que cuentan las calles', intro: 'Cuando cae la noche, las voces del pasado vuelven a recorrer León a través de relatos, misterios y memorias compartidas.',
    description: 'Descubre personajes de la tradición oral. Sus historias se presentan como relatos populares y no como sucesos históricamente comprobados.',
    quote: 'Las leyendas no necesitan ser hechos para formar parte de nuestra memoria.',
    hero: `${L}leon-centro.webp`, secondary: `${L}leon-atardecer.webp`,
    palette: '#243330', accent: '#cbb08b', motif: 'IMAGINARIO · RELATOS · MEMORIA',
    source: 'Informe de Identidad Cultural · tradición oral · Museo de Leyendas',
    entries: [
      { title: 'La Cegua', kicker: 'Aparición · Relato popular', description: 'Figura misteriosa que aparece en distintas versiones de la tradición oral nicaragüense. Su representación forma parte del imaginario popular exhibido en el Museo de Leyendas.', ...pic(`${L}leon-atardecer.webp`), tag: 'Tradición oral' },
      { title: 'El Padre sin Cabeza', kicker: 'Aparición · Calles antiguas', description: 'Relato conocido en varias regiones de Nicaragua que también participa en los desfiles y representaciones de las leyendas en León.', ...pic(`${L}leon-centro.webp`), tag: 'Tradición oral' },
      { title: 'La Chancha Bruja', kicker: 'Transformación · Relato popular', description: 'Una figura inquietante que aparece en los cuentos transmitidos por generaciones y en representaciones del Museo de Leyendas y Tradiciones.', ...pic(`${L}leon-volcanes.webp`), tag: 'Tradición oral' },
      { title: 'El Punche de Oro', kicker: 'Tesoro · Relato popular', description: 'Personaje legendario representado en el museo leonés, asociado a los relatos tradicionales y la imaginación comunitaria.', ...pic(`${L}leon-arquitectura.webp`), tag: 'Tradición oral' },
      { title: 'El cacique Adiact', kicker: 'Sutiaba · Memoria histórico-legendaria', description: 'En la tradición de Sutiaba es recordado como símbolo de resistencia. Su figura tiene interpretaciones orales y literarias; su historicidad concreta es discutida.', ...pic(`${L}leon-centro.webp`), tag: 'Tradición oral · versiones' },
    ],
  },
]

export const getTopic = (slug) => topics.find((t) => t.slug === slug)
