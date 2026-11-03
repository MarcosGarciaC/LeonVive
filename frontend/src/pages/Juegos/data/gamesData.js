// Textos de la portada de Juegos.
// Copian los datos del juego (public/juego/js/datos.js). Si cambian allá, actualízalos aquí también.
import imgLeonViejo from "../assets/juego/leonviejo.webp";
import imgMetapa from "../assets/juego/metapa.webp";
import imgSutiaba from "../assets/juego/sutiaba.webp";
import imgCentro from "../assets/juego/centro.webp";
import imgCalleReal from "../assets/juego/callereal.webp";
import imgPoneloya from "../assets/juego/poneloya.webp";
import imgGriteria from "../assets/juego/griteria.webp";
import imgMemoria from "../assets/juego/mj-memoria.webp";
import imgSopa from "../assets/juego/mj-sopa.webp";
import imgAjedrez from "../assets/juego/mj-ajedrez.webp";
import imgRompecabezas from "../assets/juego/mj-rompecabezas.webp";
import imgLaberinto from "../assets/juego/mj-laberinto.webp";

// Dirección del juego (carpeta public/juego). Se abre como página propia, a pantalla completa.
export const GAME_URL = "/juego/index.html";

export const difficulties = [
  { key: "f", label: "Fácil" },
  { key: "m", label: "Medio" },
  { key: "d", label: "Difícil" },
];

export const zones = [
  {
    id: "leonviejo",
    name: "León Viejo",
    sub: "Tutorial",
    character: "Explorador",
    mechanic: "Moverse, saltar y reunir ecos",
    fact: "León Viejo fue fundada en 1524 a orillas del lago Xolotlán, frente al volcán Momotombo. Sus ruinas son Patrimonio de la Humanidad desde el año 2000.",
    source: "UNESCO, Ruinas de León Viejo",
    image: imgLeonViejo,
  },
  {
    id: "metapa",
    name: "Metapa",
    sub: "Hoy Ciudad Darío",
    character: "Rubén Darío niño",
    mechanic: "Plataformas de verso",
    fact: "Rubén Darío nació en Metapa (hoy Ciudad Darío, Matagalpa) el 18 de enero de 1867 y creció en León con su tía abuela Bernarda Sarmiento y el coronel Félix Ramírez.",
    source: "Biografía de Rubén Darío, Biblioteca Virtual Miguel de Cervantes",
    image: imgMetapa,
  },
  {
    id: "sutiaba",
    name: "Sutiaba",
    sub: "Barrio indígena",
    character: "Gigantona y Enano Cabezón",
    mechanic: "Salto alto y pasajes estrechos",
    fact: "Sutiaba es la comunidad indígena de León. La Gigantona y el Enano Cabezón bailan por las calles al son del tambor, sobre todo en diciembre.",
    source: "Ficha «Gigantona», informe de identidad de Ecos de León",
    image: imgSutiaba,
  },
  {
    id: "centro",
    name: "Centro histórico",
    sub: "La Catedral",
    character: "Margarita",
    mechanic: "Iluminar zonas oscuras",
    fact: "La Catedral de León (Basílica de la Asunción) es Patrimonio de la Humanidad desde 2011. Allí descansan los restos de Rubén Darío, fallecido en León en 1916.",
    source: "UNESCO, Catedral de León",
    image: imgCentro,
  },
  {
    id: "callereal",
    name: "Calle Real de noche",
    sub: "Leyendas",
    character: "El Cadejo",
    mechanic: "Velocidad, doble salto, tejas y barriles",
    fact: "Según la tradición oral, el Cadejo es un perro que acompaña y protege a quienes caminan de noche; el jinete fantasma recuerda la leyenda del coronel Arrechavala.",
    source: "Tradición oral leonesa",
    image: imgCalleReal,
  },
  {
    id: "poneloya",
    name: "Poneloya",
    sub: "Playa del Pacífico",
    character: "El Punche de Oro",
    mechanic: "Nado y movimiento lateral",
    fact: "Poneloya es una playa del Pacífico cercana a León. La leyenda del Punche de Oro, de la tradición de Sutiaba, habla de un cangrejo dorado que guarda un tesoro.",
    source: "Tradición oral de Sutiaba",
    image: imgPoneloya,
  },
  {
    id: "griteria",
    name: "La Gritería",
    sub: "7 de diciembre",
    character: "Todos los personajes",
    mechanic: "Final: celebrar frente al altar",
    fact: "La Gritería se celebra cada 7 de diciembre en honor a la Purísima Concepción. Se atribuye su inicio en León, en 1857, a monseñor Gordiano Carranza.",
    source: "Ficha «Gritería», informe de identidad de Ecos de León",
    image: imgGriteria,
    final: true,
  },
];

// personaje: identificador del personaje en el juego, el que abre el minijuego.
export const minigames = [
  {
    id: "memoria",
    name: "Álbum del Explorador",
    type: "Memoria de imágenes",
    character: "explorador",
    unlock: "Termina el tutorial de León Viejo",
    levels: ["6 parejas", "8 parejas", "12 parejas"],
    image: imgMemoria,
  },
  {
    id: "sopa",
    name: "Letras de Darío",
    type: "Sopa de letras · con lectura",
    character: "dario",
    unlock: "Termina León Viejo (se une Rubén Darío)",
    levels: ["6 palabras · 9×9", "9 palabras · 11×11", "13 palabras · 14×14"],
    image: imgSopa,
  },
  {
    id: "ajedrez",
    name: "Ajedrez de la Gigantona",
    type: "Ajedrez",
    character: "gigantona",
    unlock: "Termina Metapa (se unen la Gigantona y el Enano)",
    levels: ["Rival principiante", "Rival atento", "Rival experto"],
    image: imgAjedrez,
  },
  {
    id: "rompecabezas",
    name: "El cuento de Margarita",
    type: "Rompecabezas",
    character: "margarita",
    unlock: "Termina Sutiaba (se une Margarita)",
    levels: ["9 piezas", "16 piezas", "25 piezas"],
    image: imgRompecabezas,
  },
  {
    id: "laberinto",
    name: "Laberinto nocturno",
    type: "Carrera sin fin",
    character: "cadejo",
    unlock: "Termina el Centro (se une el Cadejo)",
    levels: ["Meta 300 m", "Meta 500 m", "Meta 700 m"],
    image: imgLaberinto,
  },
];

export const characterCount = 6; // Explorador, Darío, Gigantona y Enano, Margarita, Cadejo, Punche de Oro
