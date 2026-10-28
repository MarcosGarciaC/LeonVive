import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { celebrations, curiosities, people, places, story } from '../../data'
import './Dashboard.css'

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
function nextTraditionMonth() {
  const now = new Date()
  for (let offset = 0; offset <= 12; offset++) {
    const candidate = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    const month = candidate.getMonth()
    if (
      celebrations.some(
        (event) =>
          (event.month === month ||
            (event.id === 'gigantona' && month === 10)) &&
          (offset > 0 || event.day == null || event.day >= now.getDate()),
      )
    ) {
      return { month, year: candidate.getFullYear() }
    }
  }
  return { month: now.getMonth(), year: now.getFullYear() }
}
const books = [
  {
    title: 'Azul...',
    year: 1888,
    url: 'https://es.wikisource.org/wiki/Azul...',
  },
  {
    title: 'Prosas profanas',
    year: 1896,
    url: 'https://es.wikisource.org/wiki/Prosas_profanas',
  },
  {
    title: 'Cantos de vida y esperanza',
    year: 1905,
    url: 'https://es.wikisource.org/wiki/Cantos_de_vida_y_esperanza',
  },
]
function Icon({ name, size = 20, className = '' }) {
  const shapes = {
    arrow: (
      <>
        <path d="M4.5 12h15m-6-6 6 6-6 6" />
      </>
    ),
    diagonal: (
      <>
        <path d="M5 19 19 5M7 5h12v12" />
      </>
    ),
    left: (
      <>
        <path d="m14.5 5-7 7 7 7" />
      </>
    ),
    right: (
      <>
        <path d="m9.5 5 7 7-7 7" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </>
    ),
    close: (
      <>
        <path d="M5 5 19 19M19 5 5 19" />
      </>
    ),
    menu: (
      <>
        <path d="M3 7h18M3 12h18M3 17h18" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4 21c.3-4.7 3-7 8-7s7.7 2.3 8 7" />
      </>
    ),
    book: (
      <>
        <path d="M12 6C8.5 3.5 6 3.5 2 5v14c4-1.5 6.5-1.5 10 1 3.5-2.5 6-2.5 10-1V5c-4-1.5-6.5-1.5-10 1Zm0 0v14" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-2 4-4 2 2-4 4-2Z" />
      </>
    ),
    bookmark: (
      <>
        <path d="M5 4h14v17l-7-4-7 4V4Z" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="1" />
        <path d="M7 3v4m10-4v4M3 10h18" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 5 0c1.4 2-2 3.1-2 5M12 18h.01" />
      </>
    ),
    check: (
      <>
        <path d="m4 12 5 5L20 6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 0 0 18M12 3a15 15 0 0 1 0 18" />
      </>
    ),
    game: (
      <>
        <path d="M7 8h10c2 0 3.1 1.4 3.6 4l.7 4.6c.3 2-1.7 3-3.3 1.7L15 16H9l-3 2.3c-1.6 1.3-3.6.3-3.3-1.7l.7-4.6C3.9 9.4 5 8 7 8Z" />
        <path d="M8 11v5m-2.5-2.5h5M16.8 11.5h.01M18.5 14h.01" />
      </>
    ),
  }
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name] || shapes.arrow}
    </svg>
  )
}
function Photo({ src, fallback, alt, ...props }) {
  const [broken, setBroken] = useState(false)
  return (
    <img
      src={broken ? fallback : src}
      alt={alt}
      onError={() => setBroken(true)}
      {...props}
    />
  )
}
function stored(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}
const questions = [
  {
    question: '¿En qué año fue fundada la primera ciudad de León?',
    options: ['1816', '1524', '1610'],
    answer: 1,
    detail: 'León Viejo fue fundada en 1524.',
  },
  {
    question: '¿Qué poeta vivió su niñez en León?',
    options: ['Rubén Darío', 'Pablo Neruda', 'José Martí'],
    answer: 0,
    detail:
      'Rubén Darío creció en León y allí se encuentra el Museo-Archivo que lleva su nombre.',
  },
  {
    question: '¿Qué celebración leonesa se realiza el 7 de diciembre?',
    options: [
      'La Gritería Chiquita',
      'La Purísima',
      'Las alfombras pasionarias',
    ],
    answer: 1,
    detail:
      'La Gritería del 7 de diciembre nació en el barrio San Felipe de León.',
  },
]

function Dashboard({ NavbarComponent }) {
  const navigateTo = useNavigate()
  const [visited, setVisited] = useState(() => stored('ecos:lecturas', []))
  const [savedPlaces, setSavedPlaces] = useState(() =>
    stored('ecos:guardados', []),
  )
  const [currentStory, setCurrentStory] = useState(() =>
    stored('ecos:ultima', 'origen'),
  )
  const [modal, setModal] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePlace, setActivePlace] = useState(0)
  const [date, setDate] = useState(nextTraditionMonth)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const progress = Math.round(
    (visited.filter((x) => story.some((s) => s.id === x)).length /
      story.length) *
      100,
  )
  const latestStory = story.find((s) => s.id === currentStory) || story[0]
  const eventList = celebrations.filter(
    (x) =>
      x.month === date.month || (x.id === 'gigantona' && date.month === 10),
  )
  const selected = eventList.find((x) => x.id === selectedEvent) || eventList[0]
  const firstWeekday = (new Date(date.year, date.month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(date.year, date.month + 1, 0).getDate()
  const calendarDays = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, n) => n + 1),
  ]
  const allSearch = useMemo(
    () => [
      ...places.map((x) => ({
        title: x.title,
        description: x.description,
        id: x.id,
        type: 'place',
        category: 'Lugar',
      })),
      ...story.map((x) => ({
        title: x.title,
        description: x.description,
        id: x.id,
        type: 'story',
        category: 'Historia',
      })),
      ...people.map((x) => ({
        title: x.name,
        description: x.description,
        id: x.name,
        type: 'person',
        category: 'Personaje',
      })),
      ...celebrations.map((x) => ({
        title: x.title,
        description: x.description,
        id: x.id,
        type: 'event',
        category: 'Tradición',
      })),
    ],
    [],
  )
  const searchResults = allSearch
    .filter((x) =>
      `${x.title} ${x.description} ${x.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
    )
    .slice(0, 8)

  useEffect(() => {
    localStorage.setItem('ecos:lecturas', JSON.stringify(visited))
  }, [visited])
  useEffect(() => {
    localStorage.setItem('ecos:guardados', JSON.stringify(savedPlaces))
  }, [savedPlaces])
  useEffect(() => {
    localStorage.setItem('ecos:ultima', JSON.stringify(currentStory))
  }, [currentStory])
  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') {
        setModal(null)
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -25px 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  function openStory(id) {
    setCurrentStory(id)
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setModal({ type: 'story', id })
  }
  function navigate(id) {
    setMenuOpen(false)
    setModal(null)
    if (id === 'temas') {
      navigateTo('/temas')
      return
    }
    if (['biblioteca', 'juegos', 'mi-espacio', 'rutas', 'help'].includes(id)) {
      setModal({ type: id })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  function nextMonth(diff) {
    const next = new Date(date.year, date.month + diff, 1)
    const month = next.getMonth(),
      year = next.getFullYear()
    setDate({ month, year })
    const event = celebrations.find(
      (x) => x.month === month || (x.id === 'gigantona' && month === 10),
    )
    setSelectedEvent(event?.id || null)
  }
  function chooseSearch(item) {
    setSearchOpen(false)
    setSearch('')
    if (item.type === 'story') openStory(item.id)
    else setModal({ type: item.type, id: item.id })
  }
  function toggleFavorite(id) {
    setSavedPlaces((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }
  function answerQuiz(n) {
    if (quizAnswer !== null) return
    setQuizAnswer(n)
    if (n === questions[quizIndex].answer) setScore((s) => s + 1)
  }
  function nextQuiz() {
    if (quizIndex === questions.length - 1) {
      setQuizDone(true)
    } else {
      setQuizIndex((x) => x + 1)
      setQuizAnswer(null)
    }
  }
  function resetQuiz() {
    setQuizIndex(0)
    setQuizAnswer(null)
    setScore(0)
    setQuizDone(false)
  }

  return (
    <div className="site" id="inicio">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <NavbarComponent
        onNavigate={navigate}
        onSearch={() => setSearchOpen(true)}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />

      <main id="contenido">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-background" aria-hidden="true" />
          <div className="hero-tint" />
          <div className="hero-inner">
            <div className="hero-small">
              LEÓN, NICARAGUA <span className="hero-small-divider" /> PATRIMONIO
              QUE SE VIVE
            </div>
            <div className="hero-symbol" aria-hidden="true">
              ✧ <span>✥</span> ✧
            </div>
            <h1 id="hero-title">
              Ecos de <em>León</em>
            </h1>
            <p>La historia que resuena en cada calle.</p>
            <button
              className="button-outline-light hero-cta"
              onClick={() => navigate('descubre')}
            >
              Comienza a descubrir <Icon name="diagonal" size={18} />
            </button>
          </div>
          <div className="hero-bottom">
            <span>12° 26′ N &nbsp;·&nbsp; 86° 53′ O</span>
            <button onClick={() => navigate('descubre')}>
              DESLIZA PARA EXPLORAR <span className="scroll-line" />
            </button>
            <span>01 — 07</span>
          </div>
          <div className="hero-photo-note">
            Composición artística inspirada en León
          </div>
        </section>

        <section className="manifesto section-green" id="descubre">
          <div className="manifesto-orbit orbit-a" aria-hidden="true" />
          <div className="manifesto-orbit orbit-b" aria-hidden="true" />
          <div className="manifesto-content reveal">
            <span className="section-label label-light">
              UN LUGAR PARA RECORDAR Y DESCUBRIR
            </span>
            <div className="ornament ornament-light" aria-hidden="true">
              ✣ &nbsp; ✣ &nbsp; ✣
            </div>
            <h2>
              Una ciudad.
              <br />
              <em>Infinitas historias.</em>
            </h2>
            <p>
              En el occidente de Nicaragua existe una ciudad donde los versos,
              las tradiciones y la memoria de su gente siguen vivos. Te damos la
              bienvenida a León: un lugar para explorar con calma, aprender y
              volver a sentir.
            </p>
          </div>
          <div className="manifesto-stats reveal">
            <div>
              <strong>1524</strong>
              <span>ORIGEN DE LEÓN VIEJO</span>
            </div>
            <i />
            <div>
              <strong>02</strong>
              <span>SITIOS PATRIMONIO MUNDIAL</span>
            </div>
            <i />
            <div>
              <strong>+500</strong>
              <span>AÑOS DE HISTORIA</span>
            </div>
          </div>
        </section>

        <section className="editorial" id="historia">
          <div className="editorial-copy reveal">
            <div className="section-label">01 / NUESTRA ESENCIA</div>
            <div className="small-ornament" aria-hidden="true">
              ✥
            </div>
            <h2>
              Hay lugares que se visitan.
              <br />
              <em>León se lleva dentro.</em>
            </h2>
            <p>
              León reúne el legado de una antigua ciudad colonial, la riqueza
              del pueblo indígena de Sutiaba, el pensamiento universitario y la
              poesía que dio voz a toda una nación.
            </p>
            <p>
              Desde los templos blancos hasta los paisajes volcánicos, cada
              calle invita a descubrir algo nuevo.
            </p>
            <button
              className="underlined-link"
              onClick={() => openStory('origen')}
            >
              Conoce nuestra historia <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="editorial-visual">
            <img
              src="/images/leon-centro.webp"
              alt="Composición artística de la arquitectura colonial de León"
              loading="lazy"
            />
            <span>LA CIUDAD DE LAS CAMPANAS Y LOS POETAS</span>
          </div>
        </section>

        <section className="journey-section" id="recorrido">
          <div className="journey-main reveal">
            <div className="section-label">02 / TU RECORRIDO PERSONAL</div>
            <h2>
              Tu historia en
              <br />
              <em>León continúa.</em>
            </h2>
            <p>
              Un espacio para explorar a tu ritmo. Cada lugar, cada historia y
              cada descubrimiento es parte de tu propio recorrido cultural.
            </p>
            <div className="journey-panel">
              <div className="journey-icon">
                <Icon name="book" size={27} />
              </div>
              <div className="journey-detail">
                <span className="small-caps">
                  {visited.length
                    ? 'SIGUE DONDE TE QUEDASTE'
                    : 'TU PRIMERA HISTORIA'}
                </span>
                <h3>{latestStory.title}</h3>
                <div className="progress-details">
                  <span>Progreso de lecturas</span>
                  <span>{progress}%</span>
                </div>
                <div className="progress-track">
                  <div style={{ width: `${progress}%` }} />
                </div>
              </div>
              <button
                className="journey-go"
                aria-label={`Continuar: ${latestStory.title}`}
                onClick={() => openStory(latestStory.id)}
              >
                <Icon name="arrow" size={23} />
              </button>
            </div>
          </div>
          <div className="journey-aside reveal">
            <div className="aside-title">EN TU MUNDO CULTURAL</div>
            <div className="journey-stat">
              <strong>
                {visited
                  .filter((x) => story.some((s) => s.id === x))
                  .length.toString()
                  .padStart(2, '0')}
              </strong>
              <span>HISTORIAS LEÍDAS</span>
            </div>
            <div className="journey-stat">
              <strong>{savedPlaces.length.toString().padStart(2, '0')}</strong>
              <span>LUGARES GUARDADOS</span>
            </div>
            <div className="journey-stat">
              <strong>06</strong>
              <span>TRADICIONES POR CONOCER</span>
            </div>
            <button
              className="underlined-link"
              onClick={() => navigate('mi-espacio')}
            >
              Ver mi espacio <Icon name="arrow" size={18} />
            </button>
          </div>
        </section>

        <section className="places-section" id="lugares">
          <div className="places-top reveal">
            <span className="section-label">03 / RINCONES CON ALMA</span>
            <h2>
              Descubre lo
              <br />
              <em>extraordinario.</em>
            </h2>
            <p>
              Camina entre siglos de historia, naturaleza imponente y
              tradiciones que siguen llenando de vida las calles de León.
            </p>
          </div>
          <div className="feature-carousel">
            <div className="feature-picture" key={places[activePlace].id}>
              <Photo
                src={places[activePlace].image}
                fallback={places[activePlace].fallback}
                alt={places[activePlace].imageAlt || places[activePlace].title}
                loading="lazy"
              />
              <div className="feature-shade" />
              <div className="feature-overlay">
                <span>
                  {String(activePlace + 1).padStart(2, '0')} /{' '}
                  {String(places.length).padStart(2, '0')}
                </span>
                <h3>{places[activePlace].title}</h3>
                <p>{places[activePlace].subtitle}</p>
                <button
                  onClick={() =>
                    setModal({ type: 'place', id: places[activePlace].id })
                  }
                >
                  Conoce este lugar <Icon name="diagonal" size={17} />
                </button>
              </div>
            </div>
            <div className="feature-side">
              <span className="small-caps">ELIGE TU PRÓXIMA HISTORIA</span>
              <div className="feature-list">
                {places.map((p, i) => (
                  <button
                    key={p.id}
                    className={i === activePlace ? 'active' : ''}
                    onClick={() => setActivePlace(i)}
                  >
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <strong>{p.title}</strong>
                    <Icon name="diagonal" size={17} />
                  </button>
                ))}
              </div>
              <div className="feature-controls">
                <button
                  aria-label="Lugar anterior"
                  onClick={() =>
                    setActivePlace(
                      (i) => (i - 1 + places.length) % places.length,
                    )
                  }
                >
                  <Icon name="left" />
                </button>
                <button
                  aria-label="Siguiente lugar"
                  onClick={() => setActivePlace((i) => (i + 1) % places.length)}
                >
                  <Icon name="right" />
                </button>
                <button
                  className="feature-all"
                  onClick={() => navigate('rutas')}
                >
                  Todas las rutas <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="poetry-section" id="poesia">
          <div className="poetry-side" aria-hidden="true">
            LITERATURA & MEMORIA
          </div>
          <div className="poetry-content reveal">
            <span className="section-label label-light">
              04 / EL LEGADO DE LAS PALABRAS
            </span>
            <div className="ornament ornament-light" aria-hidden="true">
              ❦
            </div>
            <blockquote>
              “Juventud, divino tesoro,
              <br />
              ¡ya te vas para no volver!”
            </blockquote>
            <div className="poet-underline" />
            <h3>RUBÉN DARÍO</h3>
            <p>
              Fragmento de <em>Canción de otoño en primavera</em>. El gran poeta
              del modernismo vivió su niñez en León, ciudad donde también
              descansan sus restos.
            </p>
            <button
              className="underlined-link link-light"
              onClick={() => openStory('ruben')}
            >
              Descubre su historia <Icon name="arrow" size={18} />
            </button>
          </div>
        </section>

        <section className="facts-section">
          <div className="facts-header reveal">
            <span className="section-label">05 / DETALLES QUE SORPRENDEN</span>
            <h2>
              León, en pequeñas
              <br />
              <em>grandes historias.</em>
            </h2>
          </div>
          <div className="facts-grid">
            {curiosities.map((fact, index) => (
              <article className="fact reveal" key={fact.number}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{fact.number}</strong>
                  <h3>{fact.title}</h3>
                  <p>{fact.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="calendar-section" id="calendario">
          <div className="calendar-head reveal">
            <div>
              <span className="section-label">
                06 / TRADICIONES QUE PERMANECEN
              </span>
              <h2>
                La vida se celebra
                <br />
                <em>en cada encuentro.</em>
              </h2>
            </div>
            <p>
              El calendario de León está hecho de música, arte, memoria y
              devoción. Descubre las expresiones culturales que reúnen a sus
              comunidades.
            </p>
          </div>
          <div className="calendar-layout reveal">
            <div className="cal-panel">
              <div className="calendar-month">
                <h3>
                  {MONTHS[date.month]} <span>{date.year}</span>
                </h3>
                <div>
                  <button
                    aria-label="Mes anterior"
                    onClick={() => nextMonth(-1)}
                  >
                    <Icon name="left" size={19} />
                  </button>
                  <button
                    aria-label="Mes siguiente"
                    onClick={() => nextMonth(1)}
                  >
                    <Icon name="right" size={19} />
                  </button>
                </div>
              </div>
              <div className="days-grid">
                {WEEKDAYS.map((day, i) => (
                  <span className="week-name" key={day + i}>
                    {day}
                  </span>
                ))}
                {calendarDays.map((day, index) => {
                  const event = day
                    ? eventList.find((e) => e.day === day)
                    : null
                  return (
                    <button
                      key={index}
                      className={`day ${day ? '' : 'empty'} ${event ? 'event-day' : ''}`}
                      disabled={!day}
                      aria-label={
                        event
                          ? `${day} de ${MONTHS[date.month]}: ${event.title}`
                          : day
                            ? `${day} de ${MONTHS[date.month]}`
                            : ''
                      }
                      onClick={() => event && setSelectedEvent(event.id)}
                    >
                      {day || ''}
                    </button>
                  )
                })}
              </div>
              <div className="calendar-legend">
                <i /> Día con tradición{' '}
                <span>
                  Las fechas sin día confirmado aparecen a la derecha.
                </span>
              </div>
            </div>
            <div className="calendar-events">
              <div className="small-caps">EN ESTE MES</div>
              {eventList.length ? (
                eventList.map((e) => (
                  <button
                    key={e.id}
                    className={`event-row ${selected?.id === e.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEvent(e.id)}
                  >
                    <span className="event-date">
                      {e.day ? String(e.day).padStart(2, '0') : '✦'}
                    </span>
                    <span className="event-text">
                      <strong>{e.title}</strong>
                      <small>
                        {e.dateLabel} · {e.location}
                      </small>
                    </span>
                    <Icon name="diagonal" size={18} />
                  </button>
                ))
              ) : (
                <p className="no-events">
                  No hay celebraciones registradas para este mes en los
                  informes. Explora otros meses del calendario.
                </p>
              )}
              {selected && (
                <div className="event-detail">
                  <span className="small-caps">TRADICIÓN DESTACADA</span>
                  <p>{selected.description}</p>
                  <button
                    className="underlined-link"
                    onClick={() => setModal({ type: 'event', id: selected.id })}
                  >
                    Conoce esta tradición <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-image" />
          <div className="closing-shade" />
          <div className="closing-inner reveal">
            <span className="section-label label-light">
              NUESTRA HISTORIA SIGUE ESCRIBIÉNDOSE
            </span>
            <h2>
              Lo que descubrimos
              <br />
              <em>también nos pertenece.</em>
            </h2>
            <p>
              Un viaje por los recuerdos que nos unen y los lugares que nos
              hacen sentir en casa.
            </p>
            <button
              className="button-outline-light"
              onClick={() => navigate('biblioteca')}
            >
              Explorar la biblioteca <Icon name="diagonal" size={18} />
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <img src="/images/logo-ecos-blanco.png" alt="Ecos de León" />
            <p>La historia que resuena en cada calle.</p>
          </div>
          <div className="footer-links">
            <div>
              <span>EXPLORA</span>
              <button onClick={() => navigate('historia')}>
                Nuestra historia
              </button>
              <button onClick={() => navigate('lugares')}>
                Lugares de León
              </button>
              <button onClick={() => navigate('calendario')}>
                Tradiciones
              </button>
            </div>
            <div>
              <span>DESCUBRE MÁS</span>
              <button onClick={() => navigate('biblioteca')}>Biblioteca</button>
              <button onClick={() => navigate('juegos')}>
                Aprende jugando
              </button>
              <button onClick={() => navigate('help')}>Ayuda</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} ECOS DE LEÓN · PROYECTO CULTURAL
            EDUCATIVO
          </span>
          <button onClick={() => setModal({ type: 'credits' })}>
            FUENTES Y CRÉDITOS
          </button>
          <span>HECHO PARA RECORDAR NUESTRO ORIGEN ✣</span>
        </div>
      </footer>

      {searchOpen && (
        <div
          className="search-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false)
          }}
        >
          <div
            className="search-box"
            role="dialog"
            aria-modal="true"
            aria-label="Buscar"
          >
            <div className="search-top">
              <span>ENCUENTRA UNA HISTORIA</span>
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="search-input">
              <Icon name="search" size={26} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar lugares, personajes, tradiciones..."
              />
            </div>
            <div className="search-list">
              {searchResults.length ? (
                searchResults.map((item) => (
                  <button
                    key={item.type + item.id}
                    onClick={() => chooseSearch(item)}
                  >
                    <span>{item.category}</span>
                    <strong>{item.title}</strong>
                    <Icon name="arrow" size={17} />
                  </button>
                ))
              ) : (
                <p>No se encontraron resultados para esa búsqueda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="modal"
          >
            <button
              className="modal-close"
              onClick={() => setModal(null)}
              aria-label="Cerrar ventana"
            >
              <Icon name="close" size={22} />
            </button>
            {modal.type === 'place' &&
              (() => {
                const place = places.find((p) => p.id === modal.id)
                return (
                  place && (
                    <>
                      <div className="modal-photo">
                        <Photo
                          src={place.image}
                          fallback={place.fallback}
                          alt={place.imageAlt || place.title}
                        />
                      </div>
                      <span className="small-caps">
                        {place.category} · {place.area}
                      </span>
                      <h2 id="dialog-title">{place.title}</h2>
                      <p>{place.description}</p>
                      <p className="modal-metadata">
                        <Icon name="check" size={16} />
                        {place.source} · Según el informe cultural
                      </p>
                      <div className="modal-buttons">
                        <button
                          onClick={() => toggleFavorite(place.id)}
                          className="filled-action"
                        >
                          <Icon name="bookmark" size={17} />
                          {savedPlaces.includes(place.id)
                            ? 'Quitar de mis lugares'
                            : 'Guardar este lugar'}
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.map)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="outline-action"
                        >
                          Ver en mapas <Icon name="diagonal" size={16} />
                        </a>
                      </div>
                    </>
                  )
                )
              })()}
            {modal.type === 'event' &&
              (() => {
                const event = celebrations.find((e) => e.id === modal.id)
                return (
                  event && (
                    <>
                      <span className="small-caps">
                        TRADICIONES · {event.type}
                      </span>
                      <h2 id="dialog-title">{event.title}</h2>
                      <p className="modal-metadata">
                        <Icon name="calendar" size={17} />
                        {event.dateLabel} · {event.location}
                      </p>
                      <p>{event.description}</p>
                      <p className="modal-caption">
                        Las fechas variables y por confirmar se distinguen de
                        las fechas tradicionales fijas.
                      </p>
                    </>
                  )
                )
              })()}
            {modal.type === 'story' &&
              (() => {
                const item = story.find((s) => s.id === modal.id)
                const index = story.findIndex((s) => s.id === modal.id)
                return (
                  item && (
                    <>
                      <span className="small-caps">
                        RINCÓN CULTURAL · {item.label}
                      </span>
                      <h2 id="dialog-title">{item.title}</h2>
                      <p>{item.description}</p>
                      <p>
                        {item.id === 'origen'
                          ? 'León fue fundada en 1524 junto al lago Xolotlán, frente al volcán Momotombo. Tras el terremoto de 1610, la ciudad se trasladó junto a Sutiaba. Hoy conserva una extraordinaria herencia colonial, universitaria y cultural.'
                          : item.id === 'sutiaba-historia'
                            ? 'Sutiaba es una comunidad indígena viva que conserva memoria colectiva, saberes artesanales, tradiciones y formas de organización propias. Sus expresiones culturales se transmiten entre generaciones.'
                            : item.id === 'ruben'
                              ? 'Rubén Darío creció en León desde sus primeros días. La casa de su niñez alberga hoy el Museo-Archivo Rubén Darío, y su tumba se encuentra en la Catedral. Su obra transformó la poesía en lengua española.'
                              : 'La Gigantona, las alfombras pasionarias, la Gritería Chiquita y La Purísima son tradiciones vivas que forman parte del calendario cultural leonés.'}
                      </p>
                      <p className="modal-metadata">
                        <Icon name="check" size={16} />
                        Información documentada en el informe de identidad
                      </p>
                      <button
                        className="filled-action"
                        onClick={() =>
                          openStory(story[(index + 1) % story.length].id)
                        }
                      >
                        Siguiente historia <Icon name="arrow" size={18} />
                      </button>
                    </>
                  )
                )
              })()}
            {modal.type === 'person' &&
              (() => {
                const p = people.find((x) => x.name === modal.id)
                return (
                  p && (
                    <>
                      <span className="small-caps">
                        PERSONAJES · {p.category}
                      </span>
                      <h2 id="dialog-title">{p.name}</h2>
                      <p>{p.description}</p>
                      <p className="modal-metadata">
                        <Icon name="check" size={16} />
                        Síntesis del informe de identidad cultural
                      </p>
                    </>
                  )
                )
              })()}
            {modal.type === 'rutas' && (
              <>
                <span className="small-caps">RECORRIDOS CULTURALES</span>
                <h2 id="dialog-title">Tu próximo descubrimiento</h2>
                <p>
                  Selecciona un lugar para conocer su historia y encontrar su
                  ubicación.
                </p>
                <div className="modal-list">
                  {places.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setModal({ type: 'place', id: p.id })}
                    >
                      <span>
                        <strong>{p.title}</strong>
                        <small>{p.area}</small>
                      </span>
                      <Icon name="arrow" />
                    </button>
                  ))}
                </div>
              </>
            )}
            {modal.type === 'mi-espacio' && (
              <>
                <span className="small-caps">
                  TU PERFIL DE EXPLORACIÓN · INVITADO
                </span>
                <h2 id="dialog-title">El viaje es tuyo.</h2>
                <p>
                  Tu progreso se guarda localmente en este navegador. Puedes
                  explorar sin crear una cuenta.
                </p>
                <div className="modal-stats">
                  <div>
                    <strong>{progress}%</strong>
                    <small>Recorrido leído</small>
                  </div>
                  <div>
                    <strong>
                      {
                        visited.filter((x) => story.some((s) => s.id === x))
                          .length
                      }
                    </strong>
                    <small>Historias abiertas</small>
                  </div>
                  <div>
                    <strong>{savedPlaces.length}</strong>
                    <small>Lugares guardados</small>
                  </div>
                </div>
                <h3>Mis lugares favoritos</h3>
                <div className="modal-list">
                  {savedPlaces.length ? (
                    places
                      .filter((p) => savedPlaces.includes(p.id))
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setModal({ type: 'place', id: p.id })}
                        >
                          {p.title}
                          <Icon name="arrow" size={18} />
                        </button>
                      ))
                  ) : (
                    <p>
                      Aún no has guardado lugares. Puedes hacerlo al explorar
                      sus fichas.
                    </p>
                  )}
                </div>
                <button
                  className="text-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        '¿Borrar el progreso y los lugares guardados en este navegador?',
                      )
                    ) {
                      setVisited([])
                      setSavedPlaces([])
                      setCurrentStory('origen')
                    }
                  }}
                >
                  Borrar mi progreso local
                </button>
              </>
            )}
            {modal.type === 'biblioteca' && (
              <>
                <span className="small-caps">BIBLIOTECA PATRIMONIAL</span>
                <h2 id="dialog-title">Palabras que permanecen.</h2>
                <p>
                  Algunas de las obras de Rubén Darío que puedes consultar en
                  dominio público.
                </p>
                <div className="modal-list">
                  {books.map((b) => (
                    <a
                      key={b.title}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        <strong>{b.title}</strong>
                        <small>Rubén Darío · {b.year} · Dominio público</small>
                      </span>
                      <Icon name="diagonal" size={18} />
                    </a>
                  ))}
                </div>
                <p className="modal-caption">
                  La biblioteca descargable y el guardado sin conexión se
                  integrarán en próximas fases.
                </p>
              </>
            )}
            {modal.type === 'juegos' && (
              <>
                <span className="small-caps">
                  UNA FORMA DE APRENDER JUGANDO
                </span>
                <h2 id="dialog-title">¿Cuánto sabes de León?</h2>
                {!quizDone ? (
                  <>
                    <p className="quiz-caption">
                      PREGUNTA {quizIndex + 1} DE {questions.length} · {score}{' '}
                      ACIERTOS
                    </p>
                    <h3>{questions[quizIndex].question}</h3>
                    <div className="quiz-answers">
                      {questions[quizIndex].options.map((opt, i) => (
                        <button
                          key={i}
                          className={
                            quizAnswer !== null
                              ? i === questions[quizIndex].answer
                                ? 'correct'
                                : i === quizAnswer
                                  ? 'wrong'
                                  : ''
                              : ''
                          }
                          disabled={quizAnswer !== null}
                          onClick={() => answerQuiz(i)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && (
                      <>
                        <p className="quiz-feedback">
                          {questions[quizIndex].detail}
                        </p>
                        <button className="filled-action" onClick={nextQuiz}>
                          {quizIndex === questions.length - 1
                            ? 'Ver resultado'
                            : 'Siguiente pregunta'}{' '}
                          <Icon name="arrow" size={18} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h3>
                      ¡Terminaste! {score}/{questions.length} respuestas
                      correctas.
                    </h3>
                    <p>
                      Tu curiosidad ayuda a mantener viva la historia de León.
                    </p>
                    <button className="filled-action" onClick={resetQuiz}>
                      Jugar nuevamente <Icon name="arrow" size={18} />
                    </button>
                  </>
                )}
              </>
            )}
            {modal.type === 'help' && (
              <>
                <span className="small-caps">AYUDA / CÓMO EXPLORAR</span>
                <h2 id="dialog-title">Bienvenido a Ecos de León.</h2>
                <p>
                  Desplázate para conocer historias, lugares, tradiciones y
                  personajes. Puedes guardar tus lugares favoritos y continuar
                  tus lecturas desde «Mi espacio».
                </p>
                <p>
                  Utiliza la lupa para buscar contenidos, cambia de mes en el
                  calendario o practica con nuestra trivia.
                </p>
                <p className="modal-caption">
                  Este prototipo guarda el progreso solo en el navegador y aún
                  no ofrece autenticación ni funcionamiento PWA sin conexión.
                </p>
              </>
            )}
            {modal.type === 'credits' && (
              <>
                <span className="small-caps">CRÉDITOS Y TRANSPARENCIA</span>
                <h2 id="dialog-title">Nuestra fuente: la memoria de León.</h2>
                <p>
                  La propuesta visual y los contenidos se basan en los
                  documentos entregados: «Ecos de León: Propuesta de Identidad
                  Cultural» y «Ecos de León: Informe de la Propuesta de la
                  Plataforma Web».
                </p>
                <p>
                  La imagen de portada y las imágenes locales de arquitectura
                  son composiciones artísticas digitales inspiradas en León; no
                  son fotografías documentales. Algunas fichas de lugares usan
                  imágenes alojadas en Wikimedia Commons y ofrecen una
                  ilustración alternativa si no están disponibles.
                </p>
                <p className="modal-caption">
                  Referencia estética: Guacalito de la Isla. Diseño original
                  adaptado a Ecos de León, sin reutilizar su logotipo ni sus
                  recursos de marca.
                </p>
              </>
            )}
          </div>
        </div>
      )}
      <button
        className="help-floating"
        aria-label="Ayuda para usar el sitio"
        onClick={() => navigate('help')}
      >
        <Icon name="help" size={22} />
      </button>
    </div>
  )
}
export default Dashboard
