import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, AlertCircle, Briefcase } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchAllJobOffers } from '../../lib/admin.js'
import { useSession } from '../../lib/useSession.js'
import { AdminNav } from './AdminNav.jsx'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export default function Offers() {
  const session = useSession()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'ADMIN') return
    fetchAllJobOffers()
      .then(setOffers)
      .catch((err) => setError(err.message || 'No se pudieron cargar las ofertas'))
      .finally(() => setLoading(false))
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
          <h1 className="text-3xl font-bold text-(--color-text-main)">Todas las ofertas</h1>
        </div>

        <AdminNav />

        {loading && <p className="mt-6 text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-12 text-center">
            <Briefcase size={32} className="text-(--color-text-muted)" />
            <p className="text-(--color-text-muted)">Todavía no se ha publicado ninguna oferta.</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--color-accent)">{offer.companyName}</p>
                  <h3 className="mt-1 font-bold text-(--color-text-main)">{offer.title}</h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    offer.status === 'ACTIVE'
                      ? 'bg-(--color-accent)/10 text-(--color-accent)'
                      : 'bg-(--color-bg-input) text-(--color-text-muted)'
                  }`}
                >
                  {offer.status === 'ACTIVE' ? 'Activa' : 'Cerrada'}
                </span>
              </div>
              <p className="mt-2 text-sm text-(--color-text-muted)">
                {currencyFormatter.format(offer.budget)} · {offer.applicationCount} postulación
                {offer.applicationCount === 1 ? '' : 'es'}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
