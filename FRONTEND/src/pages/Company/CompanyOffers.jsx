import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, XCircle, Pencil, Lock } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import {
  fetchMyOffers,
  fetchApplicationsForOffer,
  updateApplicationStatus,
  closeOffer,
} from '../../lib/ofertas.js'
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

function ApplicationRow({ jobOfferId, application, onStatusChange }) {
  const [updating, setUpdating] = useState(false)

  async function handleDecision(status) {
    setUpdating(true)
    try {
      const updated = await updateApplicationStatus(jobOfferId, application.id, status)
      onStatusChange(updated)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <li className="rounded-xl bg-(--color-bg-input) p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-(--color-text-main)">{application.professionalName}</span>
        <div className="flex items-center gap-2">
          {application.expectedPrice != null && (
            <span className="text-sm text-(--color-text-muted)">{currencyFormatter.format(application.expectedPrice)}</span>
          )}
          <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-(--color-accent)">
            {STATUS_LABELS[application.status] || application.status}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-(--color-text-muted)">{application.proposal}</p>
      {application.status === 'PENDING' && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => handleDecision('ACCEPTED')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-(--color-accent)/10 px-4 py-2 text-xs font-semibold text-(--color-accent) transition hover:bg-(--color-accent)/20 disabled:opacity-60"
          >
            <CheckCircle2 size={14} /> Aceptar
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => handleDecision('REJECTED')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-(--color-cta)/10 px-4 py-2 text-xs font-semibold text-(--color-cta) transition hover:bg-(--color-cta)/20 disabled:opacity-60"
          >
            <XCircle size={14} /> Rechazar
          </button>
        </div>
      )}
    </li>
  )
}

function ApplicationsList({ jobOfferId }) {
  const [applications, setApplications] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApplicationsForOffer(jobOfferId)
      .then(setApplications)
      .catch((err) => setError(err.message || 'No se pudieron cargar las postulaciones'))
  }, [jobOfferId])

  function handleStatusChange(updated) {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  if (error) {
    return <p className="mt-4 text-sm text-(--color-cta)">{error}</p>
  }

  if (!applications) {
    return <p className="mt-4 text-sm text-(--color-text-muted)">Cargando postulaciones...</p>
  }

  if (applications.length === 0) {
    return <p className="mt-4 text-sm text-(--color-text-muted)">Todavía no hay postulaciones para esta oferta.</p>
  }

  return (
    <ul className="mt-4 flex flex-col gap-3 border-t border-(--color-border) pt-4">
      {applications.map((app) => (
        <ApplicationRow key={app.id} jobOfferId={jobOfferId} application={app} onStatusChange={handleStatusChange} />
      ))}
    </ul>
  )
}

function OfferRow({ offer, onClosed }) {
  const [expanded, setExpanded] = useState(false)
  const [closing, setClosing] = useState(false)

  async function handleClose() {
    setClosing(true)
    try {
      const updated = await closeOffer(offer.id)
      onClosed(updated)
    } finally {
      setClosing(false)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 cursor-pointer items-center justify-between gap-4 text-left"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-(--color-text-main)">{offer.title}</h3>
              {offer.status === 'INACTIVE' && (
                <span className="rounded-full bg-(--color-bg-input) px-2.5 py-0.5 text-xs font-semibold text-(--color-text-muted)">
                  Cerrada
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-(--color-text-muted)">
              {offer.applicationCount} postulación{offer.applicationCount === 1 ? '' : 'es'} · {currencyFormatter.format(offer.budget)}
            </p>
          </div>
          {expanded ? <ChevronUp size={20} className="text-(--color-text-muted)" /> : <ChevronDown size={20} className="text-(--color-text-muted)" />}
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          to={`/empresa/editar-oferta/${offer.id}`}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-bg-input) px-4 py-2 text-xs font-semibold text-(--color-text-main) transition hover:border-(--color-accent)"
        >
          <Pencil size={14} /> Editar
        </Link>
        {offer.status === 'ACTIVE' && (
          <button
            type="button"
            disabled={closing}
            onClick={handleClose}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-bg-input) px-4 py-2 text-xs font-semibold text-(--color-text-muted) transition hover:border-(--color-cta) disabled:opacity-60"
          >
            <Lock size={14} /> Cerrar oferta
          </button>
        )}
      </div>

      {expanded && <ApplicationsList jobOfferId={offer.id} />}
    </motion.article>
  )
}

export default function CompanyOffers() {
  const session = useSession()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'COMPANY') return
    fetchMyOffers()
      .then(setOffers)
      .catch((err) => setError(err.message || 'No se pudieron cargar tus ofertas'))
      .finally(() => setLoading(false))
  }, [session])

  function handleClosed(updated) {
    setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
  }

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'COMPANY') {
    return <Navigate to="/ofertas" replace />
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text-main)">Mis ofertas</h1>
            <p className="mt-2 text-(--color-text-muted)">Revisa las postulaciones que ha recibido cada oferta.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/empresa/publicar-servicio"
              className="cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-center text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-accent)"
            >
              Publicar un servicio
            </Link>
            <Link
              to="/empresa/nueva-oferta"
              className="cursor-pointer rounded-full bg-(--color-cta) px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95"
            >
              Publicar una oferta
            </Link>
          </div>
        </div>

        {loading && <p className="text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && offers.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-12 text-center">
            <Briefcase size={32} className="text-(--color-text-muted)" />
            <p className="text-(--color-text-muted)">Todavía no has publicado ninguna oferta.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {offers.map((offer) => (
            <OfferRow key={offer.id} offer={offer} onClosed={handleClosed} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
