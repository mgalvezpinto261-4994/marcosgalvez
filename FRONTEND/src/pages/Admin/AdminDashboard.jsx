import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Building2, Briefcase, AlertCircle, ShieldCheck } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchAllUsers, fetchAllCompanies, fetchAllJobOffers } from '../../lib/admin.js'
import { useSession } from '../../lib/useSession.js'
import { AdminNav } from './AdminNav.jsx'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-accent)/10 text-(--color-accent)">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-(--color-text-main)">{value}</p>
        <p className="text-sm text-(--color-text-muted)">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const session = useSession()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'ADMIN') return
    Promise.all([fetchAllUsers(), fetchAllCompanies(), fetchAllJobOffers()])
      .then(([users, companies, offers]) => {
        setStats({
          totalUsers: users.length,
          byRole: users.reduce((acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1
            return acc
          }, {}),
          totalCompanies: companies.length,
          totalOffers: offers.length,
          activeOffers: offers.filter((o) => o.status === 'ACTIVE').length,
        })
      })
      .catch((err) => setError(err.message || 'No se pudieron cargar las estadísticas'))
  }, [session])

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={28} className="text-(--color-accent)" />
          <h1 className="text-3xl font-bold text-(--color-text-main)">Panel de administración</h1>
        </div>

        <AdminNav />

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!stats && !error && <p className="mt-6 text-(--color-text-muted)">Cargando estadísticas...</p>}

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid gap-5 sm:grid-cols-3"
          >
            <StatCard icon={Users} label="Usuarios totales" value={stats.totalUsers} />
            <StatCard icon={Building2} label="Empresas registradas" value={stats.totalCompanies} />
            <StatCard icon={Briefcase} label={`Ofertas activas de ${stats.totalOffers}`} value={stats.activeOffers} />
          </motion.div>
        )}

        {stats && (
          <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6">
            <h2 className="mb-3 font-semibold text-(--color-text-main)">Usuarios por rol</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.byRole).map(([role, count]) => (
                <span
                  key={role}
                  className="rounded-full bg-(--color-bg-input) px-4 py-2 text-sm text-(--color-text-muted)"
                >
                  {role}: <span className="font-semibold text-(--color-text-main)">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/admin/usuarios"
            className="rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-accent)"
          >
            Gestionar usuarios
          </Link>
          <Link
            to="/admin/empresas"
            className="rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-accent)"
          >
            Ver empresas
          </Link>
          <Link
            to="/admin/ofertas"
            className="rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-accent)"
          >
            Ver todas las ofertas
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
