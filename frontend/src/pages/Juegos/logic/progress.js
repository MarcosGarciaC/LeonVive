// Lee el progreso que guarda el juego (public/juego) en este navegador.
// Solo lectura: el juego es el único que escribe. Para borrar el progreso se usa Ajustes dentro del juego.
// Las reglas de desbloqueo copian las del juego (js/pantallas.js, EL.progreso).

export const SAVE_KEY = "ecosdeleon_v1"; // clave del juego en su versión final

const ZONE_ORDER = ["leonviejo", "metapa", "sutiaba", "centro", "callereal", "poneloya"];
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

// Devuelve un guardado normalizado, o null si nunca se jugó o el dato está dañado.
export function readSave(storage = globalThis.localStorage) {
  let raw;
  try {
    raw = JSON.parse(storage?.getItem(SAVE_KEY) ?? "null");
  } catch {
    return null;
  }
  if (!isObject(raw)) return null;
  return {
    ecos: Number.isFinite(raw.ecos) ? Math.max(0, Math.floor(raw.ecos)) : 0,
    zonas: list(raw.zonas),
    personajes: list(raw.personajes).length ? list(raw.personajes) : ["explorador"],
    minijuegos: isObject(raw.minijuegos) ? raw.minijuegos : {},
    griteria: raw.griteria === true,
    tutorialHecho: raw.tutorialHecho === true,
    albumAbierto: raw.albumAbierto === true,
    mejorNivel: isObject(raw.mejorNivel) ? raw.mejorNivel : {},
  };
}

const empty = () => readSave({ getItem: () => "{}" });

// Estado de una zona: "hecha" | "abierta" | "cerrada".
export function zoneState(save, zoneId) {
  const s = save || empty();
  if (zoneId === "griteria") return s.griteria ? "hecha" : ZONE_ORDER.every((z) => s.zonas.includes(z)) ? "abierta" : "cerrada"; // se abre al completar las 6 zonas
  if (s.zonas.includes(zoneId)) return "hecha";
  const i = ZONE_ORDER.indexOf(zoneId);
  if (i === 0) return "abierta";
  return i > 0 && s.zonas.includes(ZONE_ORDER[i - 1]) ? "abierta" : "cerrada";
}

// Mejor nivel alcanzado en una zona (0 si no se ha jugado).
export function bestLevel(save, zoneId) {
  const n = save?.mejorNivel?.[zoneId];
  return Number.isFinite(n) ? Math.min(50, Math.max(0, Math.floor(n))) : 0;
}

export function minigameOpen(save, game) {
  const s = save || empty();
  if (game.id === "memoria") return s.albumAbierto || s.tutorialHecho || s.zonas.includes("leonviejo");
  return s.personajes.includes(game.character);
}

// Estado por dificultad: "ganada" | "abierta" | "cerrada". Medio se abre al ganar Fácil y Difícil al ganar Medio.
export function minigameLevels(save, game) {
  const open = minigameOpen(save, game);
  const data = isObject(save?.minijuegos?.[game.id]) ? save.minijuegos[game.id] : {};
  const won = (k) => Boolean(data[k]?.gan);
  return ["f", "m", "d"].map((k, i) => {
    if (won(k)) return "ganada";
    if (!open) return "cerrada";
    if (i === 0 || won(["f", "m"][i - 1])) return "abierta";
    return "cerrada";
  });
}

export function summary(save, games) {
  const s = save || empty();
  return {
    played: Boolean(save),
    ecos: s.ecos,
    zones: ZONE_ORDER.filter((z) => s.zonas.includes(z)).length,
    totalZones: ZONE_ORDER.length,
    characters: new Set(s.personajes).size,
    wins: games.reduce((n, g) => n + minigameLevels(save, g).filter((v) => v === "ganada").length, 0),
    totalWins: games.length * 3,
    griteria: s.griteria,
  };
}
