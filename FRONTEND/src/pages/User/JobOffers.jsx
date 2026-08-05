import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchActiveOffers, applyToOffer } from '../../lib/ofertas.js'
import { useSession } from '../../lib/useSession.js'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

function ApplyForm({ offerId }) {
  const [proposal, setProposal] = useState('')
  const [expectedPrice, setExpectedPrice] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await applyToOffer(offerId, {
        proposal,
        expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'No se pudo enviar la postulación')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-(--color-accent)/40 bg-(--color-accent)/10 px-4 py-3 text-sm text-(--color-accent)">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>Postulación enviada correctamente.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 border-t border-(--color-border) pt-4">
      <textarea
        required
        rows={3}
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        placeholder="Cuéntale a la empresa por qué eres el indicado para este trabajo..."
        className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
      />
      <input
        type="number"
        min="0"
        value={expectedPrice}
        onChange={(e) => setExpectedPrice(e.target.value)}
        placeholder="Precio esperado (opcional, CLP)"
        className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
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
        className="cursor-pointer self-start rounded-full bg-(--color-cta) px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Enviar postulación'}
      </button>
    </form>
  )
}

function JobOfferCard({ offer, session, index }) {
  const [applying, setApplying] = useState(false)
  const canApply = session?.role === 'PROFESSIONAL'

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-accent)">{offer.companyName}</p>
          <h3 className="mt-1 text-lg font-bold text-(--color-text-main)">{offer.title}</h3>
        </div>
        <Briefcase size={20} className="shrink-0 text-(--color-text-muted)" />
      </div>

      <p className="mt-3 text-sm text-(--color-text-muted)">{offer.description}</p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-(--color-text-muted)">
        <span className="flex items-center gap-1.5">
          <DollarSign size={16} />
          {currencyFormatter.format(offer.budget)}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={16} />
          Hasta el {dateFormatter.format(new Date(offer.deadline))}
        </span>
      </div>

      {canApply && !applying && (
        <button
          type="button"
          onClick={() => setApplying(true)}
          className="mt-4 cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-cta) active:scale-95"
        >
          Postular
        </button>
      )}

      {canApply && applying && <ApplyForm offerId={offer.id} />}

      {!session && (
        <p className="mt-4 text-sm text-(--color-text-muted)">
          <Link to="/login" className="font-semibold text-(--color-accent) hover:opacity-80">
            Inicia sesión
          </Link>{' '}
          como profesional para postular.
        </p>
      )}
    </motion.article>
  )
}

export default function JobOffers() {
  const session = useSession()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchActiveOffers()
      .then(setOffers)
      .catch((err) => setError(err.message || 'No se pudieron cargar las ofertas'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text-main)">Ofertas de trabajo</h1>
            <p className="mt-2 text-(--color-text-muted)">
              Proyectos publicados por empresas, listos para recibir postulaciones de profesionales.
            </p>
          </div>
          {session?.role === 'COMPANY' && (
            <Link
              to="/empresa/nueva-oferta"
              className="cursor-pointer rounded-full bg-(--color-cta) px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95"
            >
              Publicar una oferta
            </Link>
          )}
        </div>

        {loading && <p className="text-(--color-text-muted)">Cargando ofertas...</p>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && offers.length === 0 && (
          <p className="text-(--color-text-muted)">Todavía no hay ofertas activas publicadas.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {offers.map((offer, index) => (
            <JobOfferCard key={offer.id} offer={offer} session={session} index={index} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
