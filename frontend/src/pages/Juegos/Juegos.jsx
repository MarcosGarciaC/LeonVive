import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { GAME_URL, characterCount, difficulties, minigames, zones } from "./data/gamesData";
import { bestLevel, minigameLevels, minigameOpen, readSave, summary, zoneState } from "./logic/progress";
import portada from "./assets/juego/portada.webp";
import griteriaAncha from "./assets/juego/griteria-ancha.webp";
import "./Juegos.css";

const ZONE_LABEL = { hecha: "Completada", abierta: "Disponible", cerrada: "Bloqueada" };
const LEVEL_LABEL = { ganada: "ganado", abierta: "disponible", cerrada: "bloqueado" };
const pad = (n) => String(n).padStart(2, "0");

// El progreso vive en el juego; se vuelve a leer al regresar a esta pestaña.
function useGameSave() {
  const [save, setSave] = useState(() => readSave());
  useEffect(() => {
    const refresh = () => setSave(readSave());
    const onVisible = () => document.visibilityState === "visible" && refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return save;
}

// Aparición suave al hacer scroll, como en el resto de la web.
function useReveal(rootRef) {
  useEffect(() => {
    const items = rootRef.current?.querySelectorAll(".eg-reveal") ?? [];
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/* El menú es el mismo de la página principal (Navbar). Sus secciones viven en el inicio,
   así que primero se va a «/» y, cuando el inicio ya está en pantalla, se usa su propio control. */
const DASHBOARD_TARGETS = {
  descubre: () => document.getElementById("descubre"),
  lugares: () => document.getElementById("lugares"),
  calendario: () => document.getElementById("calendario"),
  poesia: () => document.getElementById("poesia"),
  "mi-espacio": () => document.querySelector(".header .header-profile"),
  biblioteca: () => [...document.querySelectorAll(".footer button")].find((b) => b.textContent.trim() === "Biblioteca"),
  buscar: () => document.querySelector('.header [aria-label="Buscar en Ecos de León"]'),
};
function openOnDashboard(id, tries = 30) {
  // Mientras esta página siga en pantalla, su propio menú también existe: se espera a que se vaya.
  const target = document.querySelector(".eg-app") ? null : DASHBOARD_TARGETS[id]?.();
  if (target) {
    if (target.tagName === "BUTTON") target.click();
    else target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (tries > 0) setTimeout(() => openOnDashboard(id, tries - 1), 60);
}

function Hero({ played }) {
  return (
    <section className="eg-hero" aria-labelledby="eg-titulo">
      <div className="eg-hero-bg" style={{ backgroundImage: `url(${portada})` }} aria-hidden="true" />
      <div className="eg-hero-tint" aria-hidden="true" />
      <div className="eg-hero-inner">
        <div className="eg-hero-small">
          APRENDE JUGANDO <span className="eg-hero-divider" /> LEÓN, NICARAGUA
        </div>
        <div className="eg-hero-symbol" aria-hidden="true">
          ✧ <span>✥</span> ✧
        </div>
        <h1 id="eg-titulo">
          La historia <em>también se juega</em>
        </h1>
        <p>
          Un temblor del Momotombo esparció los ecos de la ciudad. Recupéralos en seis zonas, junto a
          personajes de nuestra historia y tradición, y celébralo en la Gritería.
        </p>
        <div className="eg-hero-actions">
          <a className="eg-btn-light" href={GAME_URL}>
            {played ? "Continuar la aventura" : "Jugar ahora"} <span aria-hidden="true">↗</span>
          </a>
          <a className="eg-link eg-link-light" href="#recorrido">
            Ver el recorrido <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="eg-hero-bottom">
        <span>6 ZONAS · 5 MINIJUEGOS · 1 FIESTA</span>
        <a href="#avance">
          DESLIZA PARA EXPLORAR <span className="eg-scroll-line" />
        </a>
        <span>Se abre a pantalla completa</span>
      </div>
    </section>
  );
}

function Progress({ data }) {
  const items = [
    { value: data.ecos, label: "Ecos guardados", text: "Se guardan al sonar la campana de cada zona." },
    { value: `${data.zones}/${data.totalZones}`, label: "Zonas completadas", text: "Cada zona tiene 50 niveles seguidos." },
    { value: `${data.characters}/${characterCount}`, label: "Personajes en tu equipo", text: "Se unen al terminar cada zona." },
    { value: `${data.wins}/${data.totalWins}`, label: "Retos de minijuegos", text: "Tres dificultades por minijuego." },
  ];
  return (
    <section className="eg-progress" id="avance" aria-labelledby="eg-avance">
      <div className="eg-head eg-head-center eg-reveal">
        <span className="eg-label">01 / TU AVANCE</span>
        <h2 id="eg-avance">
          {data.played ? (
            <>
              Así va tu <em>aventura.</em>
            </>
          ) : (
            <>
              Tu aventura <em>empieza en León Viejo.</em>
            </>
          )}
        </h2>
        <p>
          {data.played
            ? data.griteria
              ? "¡Ya celebraste la Gritería! Puedes volver a jugar cualquier zona para mejorar tu marca."
              : "Tu progreso se guarda en este navegador. Vuelve cuando quieras y sigue donde te quedaste."
            : "Todavía no has jugado en este navegador. El tutorial te enseña a moverte, saltar y reunir ecos."}
        </p>
      </div>
      <div className="eg-progress-grid">
        {items.map((item, i) => (
          <article className="eg-stat eg-reveal" key={item.label}>
            <span>{pad(i + 1)}</span>
            <strong>{item.value}</strong>
            <h3>{item.label}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Zones({ save }) {
  return (
    <section id="recorrido" className="eg-zones-section" aria-labelledby="eg-recorrido">
      <div className="eg-head eg-reveal">
        <div>
          <span className="eg-label">02 / EL RECORRIDO</span>
          <h2 id="eg-recorrido">
            Seis zonas
            <br />
            <em>y una fiesta.</em>
          </h2>
        </div>
        <p>
          Al terminar cada zona suena la campana, se guardan tus ecos y se une un personaje nuevo, con su
          propia habilidad.
        </p>
      </div>
      <ol className="eg-zones">
        {zones.map((zone, i) => {
          const state = zoneState(save, zone.id),
            best = bestLevel(save, zone.id);
          return (
            <li key={zone.id} className={`eg-zone is-${state} eg-reveal`}>
              <div className="eg-zone-tile">
                <img className="eg-pixel" src={zone.image} alt="" loading="lazy" />
                <div className="eg-zone-shade" aria-hidden="true" />
                <div className="eg-zone-top">
                  <span>{zone.final ? "FINAL" : `${pad(i + 1)} / 06`}</span>
                  <span className="eg-state">
                    {state === "cerrada" ? "🔒 " : state === "hecha" ? "✔ " : ""}
                    {ZONE_LABEL[state]}
                  </span>
                </div>
                <div className="eg-zone-bottom">
                  <span className="eg-eyebrow">{zone.sub}</span>
                  <h3>{zone.name}</h3>
                  <span className="eg-zone-pj">{zone.character}</span>
                </div>
              </div>
              <div className="eg-zone-text">
                <p className="eg-mechanic">{zone.mechanic}</p>
                <p>{zone.fact}</p>
                <p className="eg-source">Fuente: {zone.source}</p>
                {state === "cerrada" && (
                  <p className="eg-note">{zone.final ? "Se abre al completar las 6 zonas." : `Se abre al terminar ${zones[i - 1].name}.`}</p>
                )}
                {state === "abierta" && best > 0 && !zone.final && (
                  <p className="eg-note">Llegaste al nivel {best} de 50.</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Minigames({ save }) {
  return (
    <section id="minijuegos" className="eg-minigames" aria-labelledby="eg-minijuegos">
      <div className="eg-orbit eg-orbit-a" aria-hidden="true" />
      <div className="eg-head eg-reveal">
        <div>
          <span className="eg-label eg-label-light">03 / MINIJUEGOS</span>
          <h2 id="eg-minijuegos">
            Un reto
            <br />
            <em>por personaje.</em>
          </h2>
        </div>
        <p>
          Se abren cuando su personaje se une a la aventura. Medio se abre al ganar Fácil, y Difícil al
          ganar Medio. Están en el menú «Minijuegos» del juego.
        </p>
      </div>
      <div className="eg-cards">
        {minigames.map((game, i) => {
          const open = minigameOpen(save, game),
            levels = minigameLevels(save, game);
          return (
            <article key={game.id} className={`eg-card eg-reveal ${open ? "" : "is-locked"}`}>
              <div className="eg-card-art">
                <img src={game.image} alt="" loading="lazy" />
                <span className="eg-card-num">{pad(i + 1)}</span>
              </div>
              <div className="eg-card-copy">
                <span className="eg-eyebrow">{game.type}</span>
                <h3>{game.name}</h3>
                <ul className="eg-levels" aria-label="Dificultades">
                  {difficulties.map((d, k) => (
                    <li key={d.key} className={`is-${levels[k]}`}>
                      <span aria-hidden="true">{levels[k] === "ganada" ? "✔" : levels[k] === "cerrada" ? "🔒" : "○"}</span>
                      {d.label} <small>{game.levels[k]}</small>
                      <span className="eg-sr"> ({LEVEL_LABEL[levels[k]]})</span>
                    </li>
                  ))}
                </ul>
                {!open && <p className="eg-note">{game.unlock}.</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HowTo() {
  const blocks = [
    {
      title: "En computadora",
      body: (
        <>
          Flechas o <kbd>A</kbd> <kbd>D</kbd> para moverte, <kbd>Espacio</kbd> o <kbd>↑</kbd> para
          saltar, <kbd>X</kbd> para la habilidad ★ y <kbd>Esc</kbd> para pausar.
        </>
      ),
    },
    { title: "En el teléfono", body: "Gira el teléfono en horizontal. Aparecen botones en pantalla para moverte, saltar y usar la habilidad." },
    { title: "Las reglas", body: "Tienes 3 vidas. Cada nivel termina en un farol, donde reapareces. Solo la campana del nivel 50 guarda la zona y sus ecos." },
    { title: "El vestuario", body: "Con los ecos compras trajes para cada personaje: sombreros, coronas, capuchas y más." },
  ];
  return (
    <section className="eg-howto" aria-labelledby="eg-como">
      <div className="eg-head eg-head-center eg-reveal">
        <span className="eg-label">04 / ANTES DE EMPEZAR</span>
        <h2 id="eg-como">
          Cómo <em>se juega.</em>
        </h2>
      </div>
      <div className="eg-howto-grid">
        {blocks.map((b, i) => (
          <article className="eg-reveal" key={b.title}>
            <span>{pad(i + 1)}</span>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Closing({ played }) {
  return (
    <section className="eg-closing" aria-labelledby="eg-cierre">
      <div className="eg-closing-bg" style={{ backgroundImage: `url(${griteriaAncha})` }} aria-hidden="true" />
      <div className="eg-closing-shade" aria-hidden="true" />
      <div className="eg-closing-inner eg-reveal">
        <span className="eg-label eg-label-light">7 DE DICIEMBRE · LA GRITERÍA</span>
        <h2 id="eg-cierre">
          ¿Quién causa
          <br />
          <em>tanta alegría?</em>
        </h2>
        <p>Recupera todos los ecos y celebra con todos los personajes frente al altar de la Purísima.</p>
        <a className="eg-btn-light" href={GAME_URL}>
          {played ? "Continuar la aventura" : "Empezar la aventura"} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export default function Juegos() {
  const { "*": path = "" } = useParams();
  const navigateTo = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);
  const save = useGameSave();
  const data = summary(save, minigames);
  useReveal(rootRef);

  // Rutas antiguas como /juegos/minijuegos llevan a su sección de esta misma página.
  useEffect(() => {
    const target = path.startsWith("minijuegos") ? document.getElementById("minijuegos") : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [path]);

  function go(id) {
    setMenuOpen(false);
    if (id === "juegos") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (id === "temas") {
      navigateTo("/temas");
      return;
    }
    navigateTo("/");
    if (id === "inicio") window.scrollTo(0, 0);
    else openOnDashboard(id);
  }

  return (
    <div className="eg-app" ref={rootRef}>
      <a className="eg-skip" href="#juegos-contenido">
        Saltar al contenido
      </a>
      <Navbar
        onNavigate={go}
        onSearch={() => go("buscar")}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
      <main id="juegos-contenido">
        <Hero played={data.played} />
        <Progress data={data} />
        <Zones save={save} />
        <Minigames save={save} />
        <HowTo />
        <Closing played={data.played} />
      </main>
      <footer className="eg-footer">
        <Link to="/" className="eg-footer-logo" aria-label="Ecos de León, ir al inicio">
          <img src="/images/logo-ecos-blanco.png" alt="Ecos de León" />
        </Link>
        <p>La historia que resuena en cada calle.</p>
        <p className="eg-footer-note">
          La historia del juego es ficticia; los datos culturales provienen de las fichas verificadas de Ecos
          de León y las leyendas se presentan como tradición oral. El progreso se guarda solo en este
          navegador; para borrarlo, abre Ajustes dentro del juego.
        </p>
        <div className="eg-footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/temas">Explorar temas</Link>
          <a href={GAME_URL}>Abrir el juego</a>
        </div>
      </footer>
    </div>
  );
}
