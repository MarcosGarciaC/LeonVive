import { useEffect, useRef } from 'react'
import { ScenicImage } from './TopicShared.jsx'
import { CloseIcon } from './TopicIcons.jsx'

export function TopicDetails({
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
          <CloseIcon />
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
