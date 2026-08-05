import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, AlertCircle, Star, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchMyQuotations } from '../../lib/ofertas.js'
import { createReview } from '../../lib/resenias.js'
import { useSession } from '../../lib/useSession.js'

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  ACTIVE: 'Aceptada',
  INACTIVE: 'Rechazada',
}

function ReviewForm({ professionalId }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createReview(professionalId, { rating, comment })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'No se pudo enviar la reseña')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-(--color-accent)/40 bg-(--color-accent)/10 px-4 py-3 text-sm text-(--color-accent)">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>Reseña enviada, ¡gracias!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 border-t border-(--color-border) pt-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="cursor-pointer"
            aria-label={`${value} estrellas`}
          >
            <Star
              size={22}
              className={value <= rating ? 'fill-(--color-cta) text-(--color-cta)' : 'text-(--color-text-muted)'}
            />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntale a otros clientes tu experiencia (opcional)"
        className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
      />
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer self-start rounded-full bg-(--color-cta) px-5 py-2 text-sm font-semibold text-white transition hover:shadow-[0_0_16px_rgba(229,62,62,0.5)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Dejar reseña'}
      </button>
    </form>
  )
}

export default function MyQuotations() {
  const session = useSession()
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewingId, setReviewingId] = useState(null)

  useEffect(() => {
    if (session?.role !== 'CUSTOMER') return
    fetchMyQuotations()
      .then(setQuotations)
      .catch((err) => setError(err.message || 'No se pudieron cargar tus cotizaciones'))
      .finally(() => setLoading(false))
  }, [session])

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'CUSTOMER') {
    return <Navigate to="/servicios-profesionales" replace />
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-(--color-text-main)">Mis cotizaciones</h1>
          <p className="mt-2 text-(--color-text-muted)">Servicios que has cotizado con profesionales.</p>
        </div>

        {loading && <p className="text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && quotations.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-12 text-center">
            <FileText size={32} className="text-(--color-text-muted)" />
            <p className="text-(--color-text-muted)">Todavía no has cotizado ningún servicio.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {quotations.map((q) => (
            <motion.article
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-(--color-text-main)">{q.serviceTitle}</h3>
                <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-(--color-accent)">
                  {STATUS_LABELS[q.status] || q.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-(--color-text-muted)">{q.message}</p>

              {q.status === 'ACTIVE' && reviewingId !== q.id && (
                <button
                  type="button"
                  onClick={() => setReviewingId(q.id)}
                  className="mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-(--color-accent) hover:opacity-80"
                >
                  <Star size={14} /> Dejar reseña
                </button>
              )}

              {q.status === 'ACTIVE' && reviewingId === q.id && <ReviewForm professionalId={q.professionalId} />}
            </motion.article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
