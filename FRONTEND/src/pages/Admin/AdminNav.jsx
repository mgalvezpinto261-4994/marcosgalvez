import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/empresas', label: 'Empresas' },
  { to: '/admin/ofertas', label: 'Ofertas' },
]

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-(--color-border) pb-4">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-(--color-cta) text-white'
                : 'bg-(--color-bg-input) text-(--color-text-muted) hover:text-(--color-text-main)'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
