import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTopic, topics } from '../../topicsData'
import './Topics.css'

const arrow = (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12h16m-7-7 7 7-7 7" />
  </svg>
)

const diagonal = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M5 19 19 5M8 5h11v11" />
  </svg>
)

const closeIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M5 5 19 19M19 5 5 19" />
  </svg>
)

function useReveal(dep) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (items) =>
        items.forEach((item) => {
          if (item.isIntersecting) {
            item.target.classList.add('topic-visible')
            observer.unobserve(item.target)
          }
        }),
      { threshold: 0.09, rootMargin: '0px 0px -36px 0px' },
    )
    const elements = document.querySelectorAll('.topic-reveal')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [dep])
}

function ScenicImage({ image, fallback, alt, ...props }) {
  const [brokenUrl, setBrokenUrl] = useState(null)

  return (
    <img
      src={
        brokenUrl === image
          ? fallback || '/images/leon-centro.webp'
          : image
      }
      alt={alt}
      onError={() => setBrokenUrl(image)}
      {...props}
    />
  )
}

function TopicNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="topic-nav">
        <Link
          to="/"
          className="topic-nav-logo"
          aria-label="Ecos de León, ir al inicio"
        >
          <img src="/images/logo-ecos-blanco.png" alt="Ecos de León" />
        </Link>
        <nav aria-label="Navegación de temas" className="topic-nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/temas">Explorar temas</Link>
          <Link to="/temas/historia">Historia</Link>
          <Link to="/temas/tradiciones">Tradiciones</Link>
        </nav>
        <div className="topic-nav-actions">
          <span>LEÓN · NICARAGUA</span>
          <button
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="topic-menu-button"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              closeIcon
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 7h18M3 13h18M3 19h18" />
              </svg>
            )}
          </button>
        </div>
      </header>
      {open && (
        <nav
          className="topic-mobile-nav"
          aria-label="Navegación móvil de temas"
          onClick={() => setOpen(false)}
        >
          <Link to="/">Inicio {arrow}</Link>
          <Link to="/temas">Todos los temas {arrow}</Link>
          {topics.map((topic) => (
            <Link to={`/temas/${topic.slug}`} key={topic.slug}>
              {topic.title} {arrow}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}

function Footer() {
  return (
    <footer className="topic-footer">
      <Link to="/" className="topic-footer-logo">
        <img src="/images/logo-ecos-blanco.png" alt="Ecos de León" />
      </Link>
      <p>La historia que resuena en cada calle.</p>
      <span>LEÓN, NICARAGUA · PATRIMONIO VIVO</span>
      <Link to="/temas">Volver al catálogo {arrow}</Link>
    </footer>
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
        <span className="topic-circle-arrow">{diagonal}</span>
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
              Descubrir los temas {arrow}
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
          <Link to="/">Volver al inicio {diagonal}</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function TopicDetails({
  topic,
  entry,
  onClose,
  onNext,
  onPrev,
  saved,
  onSave,
  read,
  onRead,
}) {
  const detailRef = useRef(null)

  useEffect(() => {
    detailRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const idx = topic.entries.indexOf(entry)

  return (
    <div
      className="topic-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="presentation"
    >
      <section
        className="topic-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha: ${entry.title}`}
        tabIndex={-1}
        ref={detailRef}
      >
        <button
          className="topic-modal-close"
          aria-label="Cerrar ficha"
          onClick={onClose}
        >
          {closeIcon}
        </button>
        <div className="topic-modal-photo">
          <ScenicImage
            image={entry.image}
            fallback={entry.fallback}
            alt={entry.credit}
          />
          <span>{entry.credit}</span>
        </div>
        <div className="topic-modal-copy">
          <span className="topic-label">
            {topic.title.toUpperCase()} / FICHA{' '}
            {String(idx + 1).padStart(2, '0')}
          </span>
          <h2>{entry.title}</h2>
          <span className="topic-detail-kicker">{entry.kicker}</span>
          <p>{entry.description}</p>
          <span className="topic-source-tag">{entry.tag}</span>
          <p className="topic-detail-source">
            Origen de la información: {topic.source}. Las fotografías son
            imágenes de referencia cuando así se indica.
          </p>
          <div className="topic-modal-actions">
            <button onClick={() => onSave(entry.title)}>
              {saved ? '♥ Guardado' : '♡ Guardar ficha'}
            </button>
            <button onClick={() => onRead(entry.title)}>
              {read ? '✓ Ya leída' : 'Marcar como leída'}
            </button>
          </div>
          <div className="topic-modal-pager">
            <button onClick={onPrev} aria-label="Ficha anterior">
              ← Anterior
            </button>
            <span>
              {String(idx + 1).padStart(2, '0')} /{' '}
              {String(topic.entries.length).padStart(2, '0')}
            </span>
            <button onClick={onNext} aria-label="Siguiente ficha">
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export function TopicPage() {
  const { tema } = useParams()
  const topic = getTopic(tema)
  const navigate = useNavigate()
  const [chosen, setChosen] = useState(null)
  const [saved, setSaved] = useState(() =>
    readLocal('ecos:temas:guardadas'),
  )
  const [read, setRead] = useState(() => readLocal('ecos:temas:leidas'))

  useReveal(tema)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tema])

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
          <Link to="/temas">Ver todos los temas {arrow}</Link>
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
      style={{
        '--topic-deep': topic.palette,
        '--topic-accent': topic.accent,
      }}
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
                Comenzar recorrido <span>{arrow}</span>
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
              <span className="topic-action-orb">{diagonal}</span>
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
                    <span className="topic-round-next">{diagonal}</span>
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
            <span className="topic-circle-arrow">{diagonal}</span>
          </Link>
        </section>
      </main>
      <Footer />
      {selected && (
        <TopicDetails
          key={`${tema}-${chosen}`}
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
