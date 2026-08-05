import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, AlertCircle } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchMyApplications } from '../../lib/ofertas.js'
import { useSession } from '../../lib/useSession.js'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  REJECTED: 'Rechazada',
  WITHDRAWN: 'Retirada',
}

export default function Applications() {
  const session = useSession()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'PROFESSIONAL') return
    fetchMyApplications()
      .then(setApplications)
      .catch((err) => setError(err.message || 'No se pudieron cargar tus postulaciones'))
      .finally(() => setLoading(false))
  }, [session])

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'PROFESSIONAL') {
    return <Navigate to="/ofertas" replace />
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-(--color-text-main)">Mis postulaciones</h1>
          <p className="mt-2 text-(--color-text-muted)">Ofertas de trabajo a las que has postulado.</p>
        </div>

        {loading && <p className="text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && applications.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-12 text-center">
            <FileText size={32} className="text-(--color-text-muted)" />
            <p className="text-(--color-text-muted)">Todavía no has postulado a ninguna oferta.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <motion.article
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-(--color-accent)">
                  {STATUS_LABELS[app.status] || app.status}
                </span>
                {app.expectedPrice != null && (
                  <span className="text-sm text-(--color-text-muted)">{currencyFormatter.format(app.expectedPrice)}</span>
                )}
              </div>
              <p className="mt-3 text-sm text-(--color-text-muted)">{app.proposal}</p>
            </motion.article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
