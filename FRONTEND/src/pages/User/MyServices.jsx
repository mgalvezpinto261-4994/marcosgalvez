import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchMyProfessionalServices } from '../../lib/api.js'
import { fetchQuotationsForService, updateQuotationStatus } from '../../lib/ofertas.js'
import { useSession } from '../../lib/useSession.js'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  ACTIVE: 'Aceptada',
  INACTIVE: 'Rechazada',
}

function QuotationRow({ quotation, onStatusChange }) {
  const [updating, setUpdating] = useState(false)

  async function handleDecision(status) {
    setUpdating(true)
    try {
      const updated = await updateQuotationStatus(quotation.id, status)
      onStatusChange(updated)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <li className="rounded-xl bg-(--color-bg-input) p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-(--color-text-main)">{quotation.customerName}</span>
        <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-(--color-accent)">
          {STATUS_LABELS[quotation.status] || quotation.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-(--color-text-muted)">{quotation.message}</p>
      {quotation.status === 'PENDING' && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => handleDecision('ACTIVE')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-(--color-accent)/10 px-4 py-2 text-xs font-semibold text-(--color-accent) transition hover:bg-(--color-accent)/20 disabled:opacity-60"
          >
            <CheckCircle2 size={14} /> Aceptar
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => handleDecision('INACTIVE')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-(--color-cta)/10 px-4 py-2 text-xs font-semibold text-(--color-cta) transition hover:bg-(--color-cta)/20 disabled:opacity-60"
          >
            <XCircle size={14} /> Rechazar
          </button>
        </div>
      )}
    </li>
  )
}

function QuotationsList({ serviceId }) {
  const [quotations, setQuotations] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuotationsForService(serviceId)
      .then(setQuotations)
      .catch((err) => setError(err.message || 'No se pudieron cargar las cotizaciones'))
  }, [serviceId])

  function handleStatusChange(updated) {
    setQuotations((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
  }

  if (error) return <p className="mt-4 text-sm text-(--color-cta)">{error}</p>
  if (!quotations) return <p className="mt-4 text-sm text-(--color-text-muted)">Cargando cotizaciones...</p>
  if (quotations.length === 0) return <p className="mt-4 text-sm text-(--color-text-muted)">Todavía no hay cotizaciones para este servicio.</p>

  return (
    <ul className="mt-4 flex flex-col gap-3 border-t border-(--color-border) pt-4">
      {quotations.map((q) => (
        <QuotationRow key={q.id} quotation={q} onStatusChange={handleStatusChange} />
      ))}
    </ul>
  )
}

function ServiceRow({ service }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <div>
          <h3 className="text-lg font-bold text-(--color-text-main)">{service.title}</h3>
          <p className="mt-1 text-sm text-(--color-text-muted)">{currencyFormatter.format(service.price)}</p>
        </div>
        {expanded ? <ChevronUp size={20} className="text-(--color-text-muted)" /> : <ChevronDown size={20} className="text-(--color-text-muted)" />}
      </button>

      {expanded && <QuotationsList serviceId={service.id} />}
    </motion.article>
  )
}

export default function MyServices() {
  const session = useSession()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'PROFESSIONAL') return
    fetchMyProfessionalServices()
      .then(setServices)
      .catch((err) => setError(err.message || 'No se pudieron cargar tus servicios'))
      .finally(() => setLoading(false))
  }, [session])

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'PROFESSIONAL') {
    return <Navigate to="/servicios-profesionales" replace />
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text-main)">Mis servicios</h1>
            <p className="mt-2 text-(--color-text-muted)">Revisa las cotizaciones que ha recibido cada servicio.</p>
          </div>
          <Link
            to="/profesional/publicar-servicio"
            className="cursor-pointer rounded-full bg-(--color-cta) px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95"
          >
            Publicar un servicio
          </Link>
        </div>

        {loading && <p className="text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && services.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-12 text-center">
            <Sparkles size={32} className="text-(--color-text-muted)" />
            <p className="text-(--color-text-muted)">Todavía no has publicado ningún servicio.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
