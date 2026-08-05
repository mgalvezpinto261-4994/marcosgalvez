import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, AlertCircle, Building2 } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchAllCompanies } from '../../lib/admin.js'
import { useSession } from '../../lib/useSession.js'
import { AdminNav } from './AdminNav.jsx'

export default function Companies() {
  const session = useSession()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'ADMIN') return
    fetchAllCompanies()
      .then(setCompanies)
      .catch((err) => setError(err.message || 'No se pudieron cargar las empresas'))
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
          <h1 className="text-3xl font-bold text-(--color-text-main)">Empresas</h1>
        </div>

        <AdminNav />

        {loading && <p className="mt-6 text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && companies.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-12 text-center">
            <Building2 size={32} className="text-(--color-text-muted)" />
            <p className="text-(--color-text-muted)">Todavía no hay empresas registradas.</p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {companies.map((company) => (
            <div key={company.id} className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6">
              <h3 className="font-bold text-(--color-text-main)">{company.companyName}</h3>
              <p className="mt-1 text-sm text-(--color-text-muted)">RUT: {company.taxId}</p>
              {company.industry && <p className="mt-1 text-sm text-(--color-text-muted)">{company.industry}</p>}
              {company.city && <p className="mt-1 text-sm text-(--color-text-muted)">{company.city}</p>}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
