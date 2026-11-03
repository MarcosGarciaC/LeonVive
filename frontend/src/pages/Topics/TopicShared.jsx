import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { topics } from '../../topicsData'
import { ArrowIcon, CloseIcon } from './TopicIcons.jsx'

export function ScenicImage({ image, fallback, alt, ...props }) {
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

export function TopicNav() {
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
              <CloseIcon />
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
          <Link to="/">
            Inicio <ArrowIcon />
          </Link>
          <Link to="/temas">
            Todos los temas <ArrowIcon />
          </Link>
          {topics.map((topic) => (
            <Link to={`/temas/${topic.slug}`} key={topic.slug}>
              {topic.title} <ArrowIcon />
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}

export function Footer() {
  return (
    <footer className="topic-footer">
      <Link to="/" className="topic-footer-logo">
        <img src="/images/logo-ecos-blanco.png" alt="Ecos de León" />
      </Link>
      <p>La historia que resuena en cada calle.</p>
      <span>LEÓN, NICARAGUA · PATRIMONIO VIVO</span>
      <Link to="/temas">
        Volver al catálogo <ArrowIcon />
      </Link>
    </footer>
  )
}
