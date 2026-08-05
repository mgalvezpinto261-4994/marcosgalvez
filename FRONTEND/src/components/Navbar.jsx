import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import logo from '../assets/img/logo-light.png'
import { logout } from '../lib/auth.js'
import { useSession } from '../lib/useSession.js'
import NotificationBell from './NotificationBell.jsx'

const NAV_LINKS = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Destacados', href: '/#destacados' },
  { label: 'Confianza', href: '/#confianza' },
  { label: 'Ofertas de trabajo', href: '/ofertas' },
  { label: 'Servicios profesionales', href: '/servicios-profesionales' },
]

function NavLink({ link, className, onClick }) {
  return (
    <Link to={link.href} onClick={onClick} className={className}>
      {link.label}
    </Link>
  )
}

function dashboardLinksFor(session) {
  if (session?.role === 'COMPANY') {
    return [
      { to: '/empresa/mis-ofertas', label: 'Mis ofertas' },
      { to: '/empresa/mi-perfil', label: 'Mi perfil' },
    ]
  }
  if (session?.role === 'PROFESSIONAL') {
    return [
      { to: '/profesional/mis-servicios', label: 'Mis servicios' },
      { to: '/mi-perfil', label: 'Mi perfil' },
    ]
  }
  if (session?.role === 'CUSTOMER') {
    return [
      { to: '/mis-cotizaciones', label: 'Mis cotizaciones' },
      { to: '/mi-perfil', label: 'Mi perfil' },
    ]
  }
  if (session?.role === 'ADMIN') {
    return [{ to: '/admin', label: 'Panel de administración' }]
  }
  return []
}

function Logo() {
  return (
    <a href="/" className="flex items-center">
      <img src={logo} alt="B2BMatch — Conecta tu negocio" className="h-11 w-auto sm:h-14" />
    </a>
  )
}

function CtaButtons({ className = '', onNavigate, session, onLogout }) {
  if (session) {
    const dashboardLinks = dashboardLinksFor(session)
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="text-sm font-medium text-(--color-text-main)">
          Hola, {session.displayName?.split(' ')[0] || session.email}
        </span>
        {dashboardLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className="text-sm font-medium text-(--color-accent) hover:opacity-80"
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            onLogout()
            onNavigate?.()
          }}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-cta) active:scale-95"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link
        to="/registro"
        onClick={onNavigate}
        className="cursor-pointer rounded-full bg-(--color-cta) px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95"
      >
        Publicar un servicio
      </Link>
      <Link
        to="/login"
        onClick={onNavigate}
        className="cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-cta) active:scale-95"
      >
        Iniciar sesión
      </Link>
    </div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const session = useSession()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--bg-navbar) backdrop-blur-md">
      <nav className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavLink
                link={link}
                className="text-sm font-medium text-(--color-text-muted) transition-opacity hover:text-(--color-text-main) hover:opacity-80"
              />
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {session && <NotificationBell />}
          <CtaButtons session={session} onLogout={handleLogout} />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer text-(--color-text-main) md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(10,37,64,0.5)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 flex h-dvh flex-col bg-(--color-bg-card) shadow-[-12px_0_48px_rgba(10,37,64,0.35)] md:hidden"
              style={{ width: 'min(88vw, 360px)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center justify-between px-6 py-5">
                <Logo />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-(--color-text-main)"
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="mx-6 h-px bg-(--color-border)" />

              <ul className="flex flex-col gap-1 px-4 py-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.18 + i * 0.07, duration: 0.4 }}
                  >
                    <NavLink
                      link={link}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[1.1rem] text-(--color-text-main) transition hover:bg-black/10"
                    />
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3 px-6 py-6">
                {session ? (
                  <>
                    <p className="text-center text-sm text-(--color-text-muted)">
                      Hola, {session.displayName?.split(' ')[0] || session.email}
                    </p>
                    {dashboardLinksFor(session).map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className="rounded-full border border-(--color-border) bg-(--color-bg-input) py-3.5 text-center text-[0.95rem] font-semibold text-(--color-accent)"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) py-3.5 text-[0.95rem] font-semibold text-(--color-text-main)"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/registro"
                      onClick={() => setIsOpen(false)}
                      className="cursor-pointer rounded-full bg-(--color-cta) py-3.5 text-center text-[0.95rem] font-semibold text-white"
                    >
                      Publicar un servicio
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) py-3.5 text-center text-[0.95rem] font-semibold text-(--color-text-main)"
                    >
                      Iniciar sesión
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
