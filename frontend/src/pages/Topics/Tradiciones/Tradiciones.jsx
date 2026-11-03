import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTopic, topics } from '../../../topicsData'
import { Footer, ScenicImage, TopicNav } from '../TopicShared.jsx'
import { ArrowIcon, DiagonalIcon } from '../TopicIcons.jsx'
import { TopicDetails } from '../TopicDetails.jsx'
import { useReveal } from '../useReveal.js'
import './Tradiciones.css'

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export default function TradicionesPage() {
  const slug = 'tradiciones'
  const topic = getTopic(slug)
  const navigate = useNavigate()
  const [chosen, setChosen] = useState(null)
  const [saved, setSaved] = useState(() =>
    readLocal('ecos:temas:guardadas'),
  )
  const [read, setRead] = useState(() => readLocal('ecos:temas:leidas'))

  useReveal(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    localStorage.setItem('ecos:temas:guardadas', JSON.stringify(saved))
  }, [saved])

  useEffect(() => {
    localStorage.setItem('ecos:temas:leidas', JSON.stringify(read))
  }, [read])

  useEffect(() => {
    if (topic) document.title = `${topic.title} | Ecos de León`
    return () => {
      document.title = 'Ecos de León'
    }
  }, [topic])

  if (!topic) {
    return (
      <div className="topic-root topic-not-found">
        <TopicNav />
        <main>
          <span className="topic-label">404 / NO ENCONTRADO</span>
          <h1>Este tema aún no existe.</h1>
          <Link to="/temas">
            Ver todos los temas <ArrowIcon />
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const idx = topics.indexOf(topic)
  const next = topics[(idx + 1) % topics.length]
  const selected = chosen === null ? null : topic.entries[chosen]
  const openDetail = (index) => {
    setChosen(index)
  }
  const save = (title) => {
    const key = `${topic.slug}:${title}`
    setSaved((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }
  const markRead = (title) => {
    const key = `${topic.slug}:${title}`
    setRead((prev) => (prev.includes(key) ? prev : [...prev, key]))
  }
  const nextEntry = () => setChosen((prev) => (prev + 1) % topic.entries.length)
  const prevEntry = () =>
    setChosen((prev) => (prev - 1 + topic.entries.length) % topic.entries.length)

  return (
    <div
      className={`topic-root topic-page theme-${topic.slug}`}
    >
      <TopicNav />
      <main>
        <section className="topic-detail-hero">
          <ScenicImage
            className="topic-detail-hero-image"
            image={topic.hero}
            fallback={topic.heroFallback || topic.secondary}
            alt={`Imagen representativa: ${topic.title}`}
          />
          <div className="topic-detail-darken" />
          <div className="topic-detail-hero-inner">
            <Link to="/temas" className="topic-hero-back">
              ← TODOS LOS TEMAS
            </Link>
            <div className="topic-detail-heading">
              <span className="topic-label">{topic.eyebrow}</span>
              <h1>{topic.title}</h1>
              <p>{topic.intro}</p>
              <a href="#introduccion" className="topic-hero-explore">
                Comenzar recorrido <span><ArrowIcon /></span>
              </a>
            </div>
          </div>
          <span className="topic-hero-counter">
            {String(idx + 1).padStart(2, '0')} <i>/</i> 07
          </span>
          <span className="topic-hero-vertical">ECOS DE LEÓN · EXPLORA</span>
        </section>
        <section className="topic-about" id="introduccion">
          <div className="topic-about-left topic-reveal">
            <span className="topic-label">UN POCO MÁS DE ESTE TEMA</span>
            <h2>
              {topic.kicker}
              <span className="topic-about-stop">.</span>
            </h2>
          </div>
          <div className="topic-about-right topic-reveal">
            <p>{topic.description}</p>
            <div className="topic-about-count">
              <strong>{String(topic.entries.length).padStart(2, '0')}</strong>
              <span>FICHAS PARA DESCUBRIR</span>
              <span className="topic-about-divider" />
              <span>CONTENIDO CULTURAL</span>
            </div>
          </div>
        </section>
        <section className="topic-featured">
          <div className="topic-featured-image topic-reveal">
            <ScenicImage
              image={topic.entries[0].image}
              fallback={topic.entries[0].fallback}
              loading="lazy"
              alt={topic.entries[0].credit}
            />
            <span className="topic-feature-label">
              01 / {topic.entries.length} · DESTACADO
            </span>
          </div>
          <div className="topic-featured-copy topic-reveal">
            <span className="topic-label">UNA HISTORIA PARA EMPEZAR</span>
            <span className="topic-feature-mini">
              {topic.entries[0].kicker}
            </span>
            <h2>{topic.entries[0].title}</h2>
            <p>{topic.entries[0].description}</p>
            <button
              onClick={() => openDetail(0)}
              className="topic-text-action"
            >
              Descubrir esta historia
              <span className="topic-action-orb"><DiagonalIcon /></span>
            </button>
          </div>
        </section>
        <section className="topic-gallery-section" id="fichas">
          <div className="topic-gallery-heading topic-reveal">
            <div>
              <span className="topic-label">UN RECORRIDO A TU RITMO</span>
              <h2>
                Explora cada <em>historia.</em>
              </h2>
            </div>
            <p>
              Selecciona una ficha y descubre más. Guarda tus favoritas para
              continuar después.
            </p>
          </div>
          <div className="topic-gallery-list">
            {topic.entries.slice(1).map((entry, index) => (
              <button
                key={entry.title}
                className="topic-gallery-item topic-reveal"
                onClick={() => openDetail(index + 1)}
              >
                <div className="topic-gallery-image">
                  <ScenicImage
                    image={entry.image}
                    fallback={entry.fallback}
                    loading="lazy"
                    alt={entry.credit}
                  />
                </div>
                <div className="topic-gallery-words">
                  <span>
                    0{index + 2} / {entry.kicker}
                  </span>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <div className="topic-gallery-meta">
                    <small>{entry.tag}</small>
                    <span className="topic-round-next"><DiagonalIcon /></span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="topic-photo-story" aria-label="Galería fotográfica">
          <div className="topic-photo-story-title topic-reveal">
            <span className="topic-label">GALERÍA DE REFERENCIA</span>
            <h2>
              Miradas de <em>{topic.short}.</em>
            </h2>
          </div>
          <div className="topic-photo-strip">
            <figure className="topic-reveal">
              <ScenicImage
                image={topic.entries[0].image}
                fallback={topic.entries[0].fallback}
                loading="lazy"
                alt={topic.entries[0].credit}
              />
              <figcaption>{topic.entries[0].title}</figcaption>
            </figure>
            <figure className="topic-reveal">
              <ScenicImage
                image={topic.entries[2].image}
                fallback={topic.entries[2].fallback}
                loading="lazy"
                alt={topic.entries[2].credit}
              />
              <figcaption>{topic.entries[2].title}</figcaption>
            </figure>
            <figure className="topic-reveal">
              <ScenicImage
                image={topic.entries[4].image}
                fallback={topic.entries[4].fallback}
                loading="lazy"
                alt={topic.entries[4].credit}
              />
              <figcaption>{topic.entries[4].title}</figcaption>
            </figure>
          </div>
          <p className="topic-photo-note">
            Las imágenes sirven como referencias visuales; algunas son
            contextuales y no retratan literalmente el objeto de la ficha.
          </p>
        </section>
        <section className="topic-quote">
          <span className="topic-label">LA MEMORIA DE LEÓN</span>
          <blockquote>“{topic.quote}”</blockquote>
          <span className="topic-quote-detail">
            ECOS DE LEÓN · REFLEXIÓN EDITORIAL
          </span>
        </section>
        <section className="topic-next">
          <div>
            <span className="topic-label">CONTINÚA DESCUBRIENDO</span>
            <h2>
              Y ahora, <em>¿qué sigue?</em>
            </h2>
            <p>Siempre hay una nueva manera de conocer León.</p>
          </div>
          <Link to={`/temas/${next.slug}`} className="topic-next-link">
            <ScenicImage
              image={next.hero}
              fallback={next.heroFallback || next.secondary}
              alt={`Ir a ${next.title}`}
              loading="lazy"
            />
            <span>
              <small>
                SIGUIENTE TEMA ·{' '}
                {String(((idx + 1) % topics.length) + 1).padStart(2, '0')}
              </small>
              <strong>{next.title}</strong>
            </span>
            <span className="topic-circle-arrow"><DiagonalIcon /></span>
          </Link>
        </section>
      </main>
      <Footer />
      {selected && (
        <TopicDetails
          key={`${slug}-${chosen}`}
          topic={topic}
          entry={selected}
          onClose={() => setChosen(null)}
          onNext={nextEntry}
          onPrev={prevEntry}
          saved={saved.includes(`${topic.slug}:${selected.title}`)}
          read={read.includes(`${topic.slug}:${selected.title}`)}
          onSave={save}
          onRead={markRead}
        />
      )}
      <button
        className="topic-fixed-contents"
        onClick={() => navigate('/temas')}
        aria-label="Volver al catálogo de temas"
      >
        ← <span>TEMAS</span>
      </button>
    </div>
  )
}
