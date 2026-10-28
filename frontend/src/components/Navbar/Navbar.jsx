import './Navbar.css'

const sections = [
  { id: 'inicio', text: 'Inicio' },
  { id: 'temas', text: 'Temas' },
  { id: 'descubre', text: 'Descubrir León' },
  { id: 'lugares', text: 'Lugares' },
  { id: 'calendario', text: 'Tradiciones' },
  { id: 'poesia', text: 'Literatura' },
]

const extraSections = [
  { id: 'biblioteca', text: 'Biblioteca' },
  { id: 'juegos', text: 'Juegos' },
  { id: 'mi-espacio', text: 'Mi espacio' },
]

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <path d="M4.5 12h15m-6-6 6 6-6 6" />,
    diagonal: <path d="M5 19 19 5M7 5h12v12" />,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    close: <path d="M5 5 19 19M19 5 5 19" />,
    menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  }

  return (
    <svg
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
      {paths[name]}
    </svg>
  )
}

function Navbar({ onNavigate, onSearch, menuOpen, onToggleMenu }) {
  return (
    <>
      <header className="header">
        <button
          className="brand brand-light"
          onClick={() => onNavigate('inicio')}
          aria-label="Ir al inicio de Ecos de León"
        >
          <img src="/images/logo-ecos-blanco.png" alt="Ecos de León" />
        </button>
        <nav className="desktop-nav" aria-label="Menú principal">
          {sections.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.text}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <button
            aria-label="Buscar en Ecos de León"
            className="icon-button"
            onClick={onSearch}
          >
            <Icon name="search" size={22} />
          </button>
          <button className="header-profile" onClick={() => onNavigate('mi-espacio')}>
            Mi espacio <Icon name="diagonal" size={15} />
          </button>
          <button
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="mobile-toggle"
            onClick={onToggleMenu}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={27} />
          </button>
        </div>
      </header>
      {menuOpen && (
        <nav className="mobile-navigation" aria-label="Navegación móvil">
          {[...sections, ...extraSections].map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.text} <Icon name="arrow" size={18} />
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

export default Navbar
