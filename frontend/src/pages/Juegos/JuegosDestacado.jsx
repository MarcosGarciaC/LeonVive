// Sección «07 / Aprende jugando» para la página principal (Dashboard).
// Vive en la carpeta de Juegos para que el Dashboard solo necesite importarla y colocarla.
// Usa las clases comunes del Dashboard: section-label, label-light, button-outline-light, underlined-link y reveal.
import { useState } from "react";
import { Link } from "react-router-dom";
import { GAME_URL, minigames, zones } from "./data/gamesData";
import { readSave, summary } from "./logic/progress";
import portada from "./assets/juego/portada.webp";
import "./JuegosDestacado.css";

export default function JuegosDestacado() {
  const [data] = useState(() => summary(readSave(), minigames));
  const regions = zones.filter((z) => !z.final);

  return (
    <section className="jd-section" id="aprende-jugando" aria-labelledby="jd-title">
      <div className="jd-inner">
        <div className="jd-copy reveal">
          <span className="section-label label-light">07 / APRENDE JUGANDO</span>
          <h2 id="jd-title">
            La historia
            <br />
            <em>también se juega.</em>
          </h2>
          <p>
            Recorre León Viejo, Metapa, Sutiaba, el Centro, la Calle Real y Poneloya junto a Rubén
            Darío niño, la Gigantona, Margarita, el Cadejo y el Punche de Oro. Recupera los ecos de la
            ciudad y celébralo en la Gritería.
          </p>
          <dl className="jd-stats">
            <div>
              <dt>{regions.length}</dt>
              <dd>zonas para recorrer</dd>
            </div>
            <div>
              <dt>{minigames.length}</dt>
              <dd>minijuegos</dd>
            </div>
            <div>
              <dt>{data.played ? `${data.zones}/${data.totalZones}` : "3"}</dt>
              <dd>{data.played ? "zonas completadas" : "niveles de dificultad"}</dd>
            </div>
          </dl>
          <div className="jd-actions">
            <a className="button-outline-light" href={GAME_URL}>
              {data.played ? "Continuar la aventura" : "Jugar ahora"} <span aria-hidden="true">↗</span>
            </a>
            <Link className="underlined-link link-light" to="/juegos">
              Conoce los juegos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <a className="jd-visual reveal" href={GAME_URL} aria-label="Abrir el juego Ecos de León">
          <img src={portada} alt="Los personajes del juego frente a las ruinas de León Viejo y el volcán Momotombo" loading="lazy" />
          <ul className="jd-zones" aria-label="Zonas del juego">
            {zones.map((z) => (
              <li key={z.id}>{z.name}</li>
            ))}
          </ul>
        </a>
      </div>
    </section>
  );
}
