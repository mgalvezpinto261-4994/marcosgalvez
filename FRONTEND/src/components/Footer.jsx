import { Link } from 'react-router-dom'
import logo from '../assets/img/logo-light.png'
import { useSession } from '../lib/useSession.js'

function publishServiceRoute(session) {
  if (!session) return '/registro'
  if (session.role === 'PROFESSIONAL') return '/profesional/publicar-servicio'
  if (session.role === 'COMPANY') return '/empresa/publicar-servicio'
  return '/servicios-profesionales'
}

function columnsFor(session) {
  return [
    {
      title: 'Plataforma',
      links: [
        { label: 'Buscar servicios', href: '/#servicios' },
        { label: 'Cómo funciona', href: '/#como-funciona' },
        { label: 'Servicios destacados', href: '/#destacados' },
        { label: 'Publicar un servicio', href: publishServiceRoute(session) },
      ],
    },
    {
      title: 'Empresas',
      links: [
        { label: 'Crear perfil de empresa', href: '/registro' },
        { label: 'Verificación', href: '/#confianza' },
        { label: 'Casos de éxito', href: '/#destacados' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Centro de ayuda', href: '#' },
        { label: 'Términos y condiciones', href: '#' },
        { label: 'Privacidad', href: '#' },
        { label: 'Contacto', href: '#' },
      ],
    },
  ]
}

function FooterLink({ href, children, className }) {
  if (href === '#') {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export default function Footer() {
  const session = useSession()
  const columns = columnsFor(session)
  return (
    <footer className="border-t border-(--color-border) bg-(--color-bg-card)">
      <div className="mx-auto grid max-w-(--breakpoint-xl) gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <img src={logo} alt="B2BMatch — Conecta tu negocio" className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-(--color-text-muted)">
            El marketplace donde profesionales y empresas se conectan para publicar y
            contratar servicios con confianza.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold text-(--color-text-main)">{col.title}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    className="text-sm text-(--color-text-muted) transition hover:text-(--color-accent)"
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-(--color-border) px-5 py-6 text-center text-xs text-(--color-text-muted) sm:px-8">
        © {new Date().getFullYear()} B2BMatch. Todos los derechos reservados.
      </div>
    </footer>
  )
}
