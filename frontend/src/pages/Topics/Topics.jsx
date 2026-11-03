import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import HistoriaPage from './Historia/Historia.jsx'
import PersonajesPage from './Personajes/Personajes.jsx'
import GastronomiaPage from './Gastronomia/Gastronomia.jsx'
import CulturaPage from './Cultura/Cultura.jsx'
import TradicionesPage from './Tradiciones/Tradiciones.jsx'
import AvesPage from './Aves/Aves.jsx'
import LeyendasPage from './Leyendas/Leyendas.jsx'
import { Footer, ScenicImage, TopicNav } from './TopicShared.jsx'
import { ArrowIcon, DiagonalIcon } from './TopicIcons.jsx'
import { useReveal } from './useReveal.js'
import { topics } from '../../topicsData'
import './Topics.css'

export function TopicsRoutes() {
  return (
    <Routes>
      <Route index element={<TopicsHub />} />
      <Route path="historia" element={<HistoriaPage />} />
      <Route path="personajes" element={<PersonajesPage />} />
      <Route path="gastronomia" element={<GastronomiaPage />} />
      <Route path="cultura" element={<CulturaPage />} />
      <Route path="tradiciones" element={<TradicionesPage />} />
      <Route path="aves" element={<AvesPage />} />
      <Route path="leyendas" element={<LeyendasPage />} />
      <Route path="*" element={<Navigate to="/temas" replace />} />
    </Routes>
  )
}

function CollectionTile({ topic, index }) {
  return (
    <Link
      className={`topic-collection-card topic-reveal topic-index-${index}`}
      to={`/temas/${topic.slug}`}
      style={{ '--card-accent': topic.accent }}
    >
      <div className="topic-collection-image">
        <ScenicImage
          image={topic.hero}
          fallback={topic.heroFallback}
          alt={`Imagen de referencia: ${topic.title}`}
          loading="lazy"
        />
      </div>
      <div className="topic-collection-shade" />
      <div className="topic-collection-top">
        <span>{String(index + 1).padStart(2, '0')} / 07</span>
        <span>{topic.entries.length} FICHAS</span>
      </div>
      <div className="topic-collection-bottom">
        <div>
          <span className="topic-eyebrow">{topic.kicker}</span>
          <h3>{topic.title}</h3>
        </div>
        <span className="topic-circle-arrow">
          <DiagonalIcon />
        </span>
      </div>
    </Link>
  )
}

export function TopicsHub() {
  const [search, setSearch] = useState('')
  useReveal(search)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Explorar temas | Ecos de León'
    return () => {
      document.title = 'Ecos de León'
    }
  }, [])

  const list = topics.filter((topic) =>
    `${topic.title} ${topic.intro} ${topic.description}`
      .toLocaleLowerCase('es')
      .includes(search.trim().toLocaleLowerCase('es')),
  )

  return (
    <div className="topic-root">
      <TopicNav />
      <main>
        <section className="topic-hub-hero">
          <ScenicImage
            className="topic-hub-hero-img"
            image="/images/leon-atardecer.webp"
            alt="León al atardecer"
          />
          <div className="topic-hub-veil" />
          <div className="topic-hub-hero-content">
            <span className="topic-label">
              ECOS DE LEÓN / UNA CIUDAD PARA DESCUBRIR
            </span>
            <h1>
              Hay mil formas
              <br />
              de <em>vivir León.</em>
            </h1>
            <p>
              Recorre su historia, sus voces, sus sabores y las tradiciones que
              hacen de León un lugar inolvidable.
            </p>
            <a className="topic-hub-hero-cta" href="#coleccion">
              Descubrir los temas <ArrowIcon />
            </a>
          </div>
          <span className="topic-vertical">
            UN RECORRIDO POR LO QUE SOMOS
          </span>
          <span className="topic-scroll-hint">
            DESLIZA PARA DESCUBRIR <span>↓</span>
          </span>
        </section>
        <section className="topic-hub-intro">
          <div className="topic-hub-intro-left topic-reveal">
            <span className="topic-label">UN ARCHIVO VIVO</span>
            <h2>
              La esencia de León,
              <br />
              <em>capítulo a capítulo.</em>
            </h2>
          </div>
          <div className="topic-hub-intro-right topic-reveal">
            <p>
              Este espacio reúne pequeñas historias que construyen una
              identidad inmensa. Elige lo que despierte tu curiosidad y
              adéntrate en el patrimonio de nuestro departamento.
            </p>
            <div className="topic-count-line">
              <strong>07</strong>
              <span>TEMAS PARA EXPLORAR</span>
              <strong>35</strong>
              <span>FICHAS CULTURALES</span>
            </div>
          </div>
        </section>
        <section className="topic-collection" id="coleccion">
          <div className="topic-collection-heading topic-reveal">
            <div>
              <span className="topic-label">ELIGE TU PROPIO RECORRIDO</span>
              <h2>
                Universos por <em>descubrir.</em>
              </h2>
            </div>
            <label className="topic-filter-label">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar un tema..."
                aria-label="Buscar un tema"
              />
            </label>
          </div>
          <div className="topic-collection-grid">
            {list.map((topic) => (
              <CollectionTile
                key={topic.slug}
                topic={topic}
                index={topics.indexOf(topic)}
              />
            ))}
          </div>
          {list.length === 0 && (
            <p className="topic-no-results">
              No encontramos un tema con ese nombre. Prueba otra palabra.
            </p>
          )}
        </section>
        <section className="topic-hub-final">
          <span className="topic-label">CULTURA, HISTORIA Y MEMORIA</span>
          <p>
            Las historias que cuidamos hoy,{' '}
            <em>nos acompañarán mañana.</em>
          </p>
          <Link to="/">
            Volver al inicio <DiagonalIcon />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
