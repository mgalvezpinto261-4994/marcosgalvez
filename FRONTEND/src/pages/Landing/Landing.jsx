import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRightCircle,
  Briefcase,
  Code2,
  Handshake,
  Hammer,
  Megaphone,
  MessagesSquare,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import JobCard from '../../components/JobCard.jsx'
import StarField from '../../components/StarField.jsx'
import GlassField from '../../components/GlassField.jsx'
import { fetchCompanyServices } from '../../lib/api.js'
import { mockOffers } from '../../data/mockOffers.js'
import { useSession } from '../../lib/useSession.js'

function publishServiceRoute(session) {
  if (!session) return '/registro'
  if (session.role === 'PROFESSIONAL') return '/profesional/publicar-servicio'
  if (session.role === 'COMPANY') return '/empresa/publicar-servicio'
  return '/servicios-profesionales'
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const CATEGORIES = [
  { icon: Megaphone, label: 'Diseño & Marketing', query: 'Design' },
  { icon: Code2, label: 'Desarrollo & Tecnología', query: 'Development' },
  { icon: Scale, label: 'Legal & Finanzas', query: 'Legal' },
  { icon: Hammer, label: 'Construcción & Hogar', query: 'Construction' },
  { icon: Wallet, label: 'Consultoría & Negocios', query: 'Consulting' },
  { icon: Briefcase, label: 'Administración & Soporte', query: 'Business' },
]

const STEPS = [
  {
    icon: Search,
    title: 'Busca o publica',
    body: 'Encuentra el servicio que necesitas o publica tu oferta en minutos, sin costos ocultos.',
  },
  {
    icon: MessagesSquare,
    title: 'Conecta y cotiza',
    body: 'Recibe cotizaciones directas o postula a oportunidades, hablando directo con la otra parte.',
  },
  {
    icon: ShieldCheck,
    title: 'Contrata con confianza',
    body: 'Cierra el trato con perfiles verificados y reseñas reales de la comunidad.',
  },
]

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Perfiles verificados',
    body: 'Cada profesional y empresa pasa por un proceso de verificación de identidad antes de publicar.',
  },
  {
    icon: Handshake,
    title: 'Cotizaciones directas',
    body: 'Negocia condiciones y precios directamente con quien va a realizar el trabajo, sin intermediarios.',
  },
  {
    icon: Sparkles,
    title: 'Reseñas reales',
    body: 'Reputación construida con reseñas verificadas de contrataciones completadas en la plataforma.',
  },
]

function HeroBackground({ pointerX, pointerY }) {
  const accentX = useTransform(pointerX, [-1, 1], [-30, 30])
  const accentY = useTransform(pointerY, [-1, 1], [-24, 24])
  const ctaX = useTransform(pointerX, [-1, 1], [24, -24])
  const ctaY = useTransform(pointerY, [-1, 1], [18, -18])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-(--color-bg-main)" />

      <div className="absolute inset-0 opacity-70">
        <StarField />
      </div>

      <motion.div
        style={{ x: accentX, y: accentY }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-(--color-accent) opacity-20 blur-[120px]"
      />
      <motion.div
        style={{ x: ctaX, y: ctaY }}
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.94, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full bg-(--color-cta) opacity-15 blur-[110px]"
      />
    </div>
  )
}

function Hero() {
  const sectionRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 60, damping: 20 })
  const pointerY = useSpring(rawY, { stiffness: 60, damping: 20 })
  const navigate = useNavigate()
  const session = useSession()
  const [searchTerm, setSearchTerm] = useState('')

  const handlePointerMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    const term = searchTerm.trim()
    navigate(term ? `/servicios-profesionales?q=${encodeURIComponent(term)}` : '/servicios-profesionales')
  }

  return (
    <section ref={sectionRef} onPointerMove={handlePointerMove} className="relative min-h-[720px] pb-24">
      <HeroBackground pointerX={pointerX} pointerY={pointerY} />

      <div className="relative z-10 mx-auto max-w-(--breakpoint-xl) px-5 pb-16 pt-[clamp(40px,8vw,72px)] sm:px-8">
        <div className="mx-auto max-w-[660px] text-center">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[clamp(1.75rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight"
          >
            Encuentra al profesional ideal{' '}
            <Search className="relative top-[-2px] mx-1 inline-block text-(--color-accent)" size={26} />{' '}
            o publica tu próxima oportunidad{' '}
            <Briefcase className="relative top-[-2px] ml-1.5 inline-block text-(--color-cta)" size={26} />
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[560px] text-[clamp(0.9rem,2.5vw,1.1rem)] leading-relaxed text-(--color-text-muted)"
          >
            El marketplace donde profesionales y empresas se conectan: publica servicios,
            recibe cotizaciones y contrata talento verificado en un solo lugar.
          </motion.p>

          <motion.form
            onSubmit={handleSearchSubmit}
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-10 flex max-w-[520px] flex-col gap-3 sm:flex-row"
          >
            <label className="flex flex-1 items-center gap-3 rounded-full border border-(--color-border) bg-(--color-bg-card) px-5 py-3.5 shadow-(--shadow-card) transition focus-within:border-(--color-accent)">
              <Search size={20} className="shrink-0 text-(--color-text-muted)" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar un servicio o profesional..."
                className="w-full bg-transparent text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
              />
            </label>

            <motion.button
              type="button"
              onClick={() => navigate(publishServiceRoute(session))}
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.96 }}
              className="flex min-w-[190px] cursor-pointer items-center justify-between gap-4 rounded-full bg-(--color-cta) px-6 py-3.5 text-[clamp(0.9rem,2vw,1rem)] font-semibold text-white shadow-[0_4px_24px_rgba(229,62,62,0.28)]"
            >
              Publicar servicio
              <ArrowRightCircle size={20} />
            </motion.button>
          </motion.form>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-(--color-text-muted)"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-(--color-accent)" /> Perfiles verificados
            </span>
            <span className="flex items-center gap-2">
              <Handshake size={16} className="text-(--color-accent)" /> Cotizaciones directas
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const navigate = useNavigate()

  return (
    <section id="servicios" className="mx-auto max-w-(--breakpoint-xl) px-5 py-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-tight">
          Explora por categoría
        </h2>
        <p className="mt-3 text-(--color-text-muted)">
          Cientos de profesionales y empresas listas para trabajar contigo.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map(({ icon: Icon, label, query }, i) => (
          <motion.button
            key={label}
            type="button"
            onClick={() => navigate(`/servicios-profesionales?q=${encodeURIComponent(query)}`)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-bg-card) px-4 py-6 text-center shadow-(--shadow-card) transition hover:border-(--color-accent)"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-accent)/15 text-(--color-accent)">
              <Icon size={20} />
            </span>
            <span className="text-sm font-semibold text-(--color-text-main)">{label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-(--color-bg-card)/40 py-20">
      <div className="mx-auto max-w-(--breakpoint-xl) px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-tight">
            Cómo funciona
          </h2>
          <p className="mt-3 text-(--color-text-muted)">
            De la búsqueda al trato cerrado, en tres pasos simples.
          </p>
        </motion.div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-(--color-border) sm:block" />

          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-(--color-border) bg-(--color-bg-main) text-sm font-bold text-(--color-accent)">
                {i + 1}
              </span>
              <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-(--color-accent)/15 text-(--color-accent)">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-(--color-text-main)">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-(--color-text-muted)">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedListings() {
  const [offers, setOffers] = useState(mockOffers)
  const [source, setSource] = useState('mock')

  useEffect(() => {
    let cancelled = false

    fetchCompanyServices()
      .then((data) => {
        if (cancelled || data.length === 0) return
        setOffers(data)
        setSource('api')
      })
      .catch((err) => {
        console.warn('[FeaturedListings] no se pudo cargar el catálogo real, usando datos de ejemplo:', err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="destacados" className="py-20" data-source={source}>
      <div className="mx-auto max-w-(--breakpoint-xl) px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-tight">
            Servicios destacados
          </h2>
          <p className="mt-3 text-(--color-text-muted)">
            Una muestra de lo que profesionales y empresas ya están ofreciendo.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <JobCard offer={offer} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section id="confianza" className="mx-auto max-w-(--breakpoint-xl) px-5 py-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl text-center"
      >
        <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-tight">
          Contratar con confianza
        </h2>
        <p className="mt-3 text-(--color-text-muted)">
          Construimos B2BMatch para que cada conexión sea segura y transparente.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {TRUST_ITEMS.map(({ icon: Icon, title, body }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-8 shadow-(--shadow-card)"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-cta)/15 text-(--color-cta)">
              <Icon size={22} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-(--color-text-main)">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">{body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  const navigate = useNavigate()
  const session = useSession()

  return (
    <section className="px-5 pb-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-6 overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-bg-card) px-8 py-16 text-center shadow-(--shadow-card)"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-(--color-accent) opacity-20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-(--color-cta) opacity-15 blur-[100px]" />

        <h2 className="relative text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold tracking-tight">
          ¿Listo para hacer crecer tu negocio?
        </h2>
        <p className="relative max-w-lg text-(--color-text-muted)">
          Únete a B2BMatch hoy: publica lo que ofreces o encuentra al profesional que
          necesitas en minutos.
        </p>
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={() => navigate(publishServiceRoute(session))}
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-(--color-cta) px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(229,62,62,0.28)]"
          >
            Publicar un servicio
            <ArrowRightCircle size={18} />
          </motion.button>
          <button
            type="button"
            onClick={() => navigate('/servicios-profesionales')}
            className="cursor-pointer rounded-full border border-(--color-border) bg-(--color-bg-input) px-7 py-3.5 text-sm font-semibold text-(--color-text-main) transition hover:border-(--color-accent)"
          >
            Explorar servicios
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default function Landing() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const target = document.querySelector(location.hash)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash])

  return (
    <div className="min-h-screen bg-(--color-bg-main) text-(--color-text-main)">
      <GlassField />
      <Navbar />
      <Hero />
      <Categories />
      <HowItWorks />
      <FeaturedListings />
      <Trust />
      <FinalCta />
      <Footer />
    </div>
  )
}
