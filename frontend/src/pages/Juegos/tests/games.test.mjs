// Pruebas del área de Juegos. Ejecutar desde frontend:  node --test src/pages/Juegos/tests/games.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { SAVE_KEY, readSave, zoneState, bestLevel, minigameOpen, minigameLevels, summary } from "../logic/progress.js";

const store = (value) => ({ getItem: (k) => (k === SAVE_KEY ? JSON.stringify(value) : null) });
const games = [
  { id: "memoria", character: "explorador" },
  { id: "sopa", character: "dario" },
  { id: "ajedrez", character: "gigantona" },
  { id: "rompecabezas", character: "margarita" },
  { id: "laberinto", character: "cadejo" },
];

/* ---------- Progreso leído desde el juego ---------- */
test("sin partida guardada: solo León Viejo abierto y nada ganado", () => {
  const save = readSave({ getItem: () => null });
  assert.equal(save, null);
  assert.equal(zoneState(save, "leonviejo"), "abierta");
  assert.equal(zoneState(save, "metapa"), "cerrada");
  assert.equal(zoneState(save, "griteria"), "cerrada");
  assert.equal(minigameOpen(save, games[0]), false);
  assert.deepEqual(summary(save, games), { played: false, ecos: 0, zones: 0, totalZones: 6, characters: 1, wins: 0, totalWins: 15, griteria: false });
});

test("guardado dañado o de otro tipo no rompe la página", () => {
  assert.equal(readSave({ getItem: () => "{no es json" }), null);
  assert.equal(readSave(store([1, 2])), null);
  const s = readSave(store({ ecos: "mucho", zonas: "x", personajes: 5, minijuegos: [] }));
  assert.equal(s.ecos, 0);
  assert.deepEqual(s.zonas, []);
  assert.deepEqual(s.personajes, ["explorador"]);
});

test("las zonas se abren en orden y la Gritería al terminar Poneloya", () => {
  const s = readSave(store({ zonas: ["leonviejo", "metapa"], mejorNivel: { sutiaba: 23 } }));
  assert.equal(zoneState(s, "leonviejo"), "hecha");
  assert.equal(zoneState(s, "sutiaba"), "abierta");
  assert.equal(zoneState(s, "centro"), "cerrada");
  assert.equal(bestLevel(s, "sutiaba"), 23);
  const fin = readSave(store({ zonas: ["leonviejo", "metapa", "sutiaba", "centro", "callereal", "poneloya"] }));
  assert.equal(zoneState(fin, "griteria"), "abierta");
});

test("el Álbum sigue abierto aunque se repita el tutorial (corrección)", () => {
  // tutorialHecho vuelve a false al pulsar «Verlo otra vez» en Ajustes
  assert.equal(minigameOpen(readSave(store({ tutorialHecho: false, albumAbierto: true })), games[0]), true);
  assert.equal(minigameOpen(readSave(store({ tutorialHecho: false, zonas: ["leonviejo"] })), games[0]), true);
  assert.equal(minigameOpen(readSave(store({ tutorialHecho: false })), games[0]), false);
});

test("Medio se abre al ganar Fácil y Difícil al ganar Medio", () => {
  const s = readSave(store({ personajes: ["explorador", "dario"], minijuegos: { sopa: { f: { gan: 2, mejor: 500 } } } }));
  assert.deepEqual(minigameLevels(s, games[1]), ["ganada", "abierta", "cerrada"]);
  assert.deepEqual(minigameLevels(s, games[2]), ["cerrada", "cerrada", "cerrada"]);
  assert.equal(summary(s, games).wins, 1);
  assert.equal(summary(s, games).characters, 2);
});

/* ---------- Ajedrez de la Gigantona (motor del juego) ---------- */
const ajedrezPath = fileURLToPath(new URL("../../../../public/juego/js/minijuegos/ajedrez.js", import.meta.url));
const ctx = { EL: { MJ: {}, R: Math.random } };
vm.runInNewContext(readFileSync(ajedrezPath, "utf8"), ctx);
const A = ctx.EL.MJ.ajedrez._test;
const perft = (st, d) => (d === 0 ? 1 : A.legales(st).reduce((n, m) => n + perft(A.hacer(st, m), d - 1), 0));
const vacio = (piezas, t = "w") => {
  const b = Array(64).fill(null);
  for (const [i, p] of Object.entries(piezas)) b[i] = p;
  return { b, t, cas: { K: false, Q: false, k: false, q: false }, ep: -1, medio: 0, plies: 0 };
};

test("ajedrez: el número de jugadas legales coincide con las reglas oficiales (perft)", () => {
  const st = A.inicial();
  assert.equal(perft(st, 1), 20);
  assert.equal(perft(st, 2), 400);
  assert.equal(perft(st, 3), 8902);
});

test("ajedrez: tablas por material insuficiente (corrección)", () => {
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k" }).b), true); // rey contra rey
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k", 10: "B" }).b), true); // rey y alfil contra rey
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k", 10: "n" }).b), true); // rey y caballo contra rey
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k", 0: "B", 9: "b" }).b), true); // alfiles del mismo color
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k", 0: "B", 1: "b" }).b), false); // alfiles de distinto color
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k", 10: "N", 11: "N" }).b), false);
  assert.equal(A.sinMaterial(vacio({ 60: "K", 4: "k", 52: "P" }).b), false);
  assert.equal(A.sinMaterial(A.inicial().b), false);
});

test("ajedrez: la misma posición repetida da la misma clave (repetición triple)", () => {
  let st = A.inicial();
  const claves = [A.clave(st)];
  const jugar = (de, a) => {
    const m = A.legales(st).find((q) => q.de === de && q.a === a);
    assert.ok(m, `jugada ${de}→${a}`);
    st = A.hacer(st, m);
    claves.push(A.clave(st));
  };
  for (let i = 0; i < 2; i++) { jugar(62, 45); jugar(6, 21); jugar(45, 62); jugar(21, 6); } // caballos van y vuelven
  assert.equal(claves.filter((k) => k === claves[0]).length, 3);
  assert.notEqual(A.clave(A.hacer(A.inicial(), A.legales(A.inicial()).find((m) => m.de === 52 && m.a === 36))), claves[0]);
});
