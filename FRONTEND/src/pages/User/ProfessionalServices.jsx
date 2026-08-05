import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, AlertCircle, CheckCircle2, Search, X } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchProfessionalServices } from '../../lib/api.js'
import { requestQuotation } from '../../lib/ofertas.js'
import { useSession } from '../../lib/useSession.js'

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

function QuotationForm({ serviceId }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestQuotation(serviceId, { message })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'No se pudo enviar la cotización')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-(--color-accent)/40 bg-(--color-accent)/10 px-4 py-3 text-sm text-(--color-accent)">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>Cotización enviada correctamente.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 border-t border-(--color-border) pt-4">
      <textarea
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Cuéntale al profesional qué necesitas..."
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
        className="cursor-pointer self-start rounded-full bg-(--color-cta) px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Enviar cotización'}
      </button>
    </form>
  )
}

function ServiceCard({ service, session, index }) {
  const [quoting, setQuoting] = useState(false)
  const canQuote = session?.role === 'CUSTOMER'

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
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-accent)">{service.professionalName}</p>
          <h3 className="mt-1 text-lg font-bold text-(--color-text-main)">{service.title}</h3>
        </div>
        <Sparkles size={20} className="shrink-0 text-(--color-text-muted)" />
      </div>

      <p className="mt-3 text-sm text-(--color-text-muted)">{service.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-(--color-text-muted)">
        <span className="font-semibold text-(--color-text-main)">{currencyFormatter.format(service.price)}</span>
        <span className="rounded-full bg-(--color-bg-input) px-2.5 py-0.5 text-xs">{service.categoryName}</span>
        {service.professionalCity && (
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            {service.professionalCity}
          </span>
        )}
      </div>

      {canQuote && !quoting && (
        <button
          type="button"
          onClick={() => setQuoting(true)}
          className="mt-4 cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) px-5 py-2.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-cta) active:scale-95"
        >
          Cotizar
        </button>
      )}

      {canQuote && quoting && <QuotationForm serviceId={service.id} />}

      {!session && (
        <p className="mt-4 text-sm text-(--color-text-muted)">
          <Link to="/login" className="font-semibold text-(--color-accent) hover:opacity-80">
            Inicia sesión
          </Link>{' '}
          como cliente para cotizar.
        </p>
      )}
    </motion.article>
  )
}

export default function ProfessionalServices() {
  const session = useSession()
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')

  const appliedQuery = searchParams.get('q') || ''

  useEffect(() => {
    fetchProfessionalServices()
      .then(setServices)
      .catch((err) => setError(err.message || 'No se pudieron cargar los servicios'))
      .finally(() => setLoading(false))
  }, [])

  const filteredServices = useMemo(() => {
    const term = appliedQuery.trim().toLowerCase()
    if (!term) return services
    return services.filter((service) =>
      [service.title, service.description, service.categoryName, service.professionalName]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term)),
    )
  }, [services, appliedQuery])

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() })
    } else {
      setSearchParams({})
    }
  }

  function clearSearch() {
    setInputValue('')
    setSearchParams({})
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text-main)">Servicios de profesionales</h1>
            <p className="mt-2 text-(--color-text-muted)">
              Servicios independientes publicados por profesionales verificados.
            </p>
          </div>
          {session?.role === 'PROFESSIONAL' && (
            <Link
              to="/profesional/publicar-servicio"
              className="cursor-pointer rounded-full bg-(--color-cta) px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95"
            >
              Publicar un servicio
            </Link>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-10 flex max-w-lg gap-2">
          <label className="flex flex-1 items-center gap-3 rounded-full border border-(--color-border) bg-(--color-bg-card) px-5 py-3 shadow-(--shadow-card) transition focus-within:border-(--color-accent)">
            <Search size={18} className="shrink-0 text-(--color-text-muted)" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscar por título, categoría o profesional..."
              className="w-full bg-transparent text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
            />
            {inputValue && (
              <button type="button" onClick={clearSearch} className="cursor-pointer text-(--color-text-muted) hover:text-(--color-text-main)">
                <X size={16} />
              </button>
            )}
          </label>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-(--color-cta) px-5 py-3 text-sm font-semibold text-white transition hover:shadow-[0_0_16px_rgba(229,62,62,0.5)] active:scale-95"
          >
            Buscar
          </button>
        </form>

        {loading && <p className="text-(--color-text-muted)">Cargando servicios...</p>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!loading && !error && services.length === 0 && (
          <p className="text-(--color-text-muted)">Todavía no hay servicios profesionales publicados.</p>
        )}
        {!loading && !error && services.length > 0 && filteredServices.length === 0 && (
          <p className="text-(--color-text-muted)">
            No encontramos servicios para "{appliedQuery}". Prueba con otro término de búsqueda.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} session={session} index={index} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
