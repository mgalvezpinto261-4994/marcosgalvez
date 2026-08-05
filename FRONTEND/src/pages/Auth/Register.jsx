import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, Building2, Briefcase, AlertCircle } from 'lucide-react'
import logo from '../../assets/img/logo-light.png'
import { register } from '../../lib/auth.js'

const ROLES = [
  { value: 'CUSTOMER', label: 'Cliente', icon: User, hint: 'Busco contratar servicios' },
  { value: 'PROFESSIONAL', label: 'Profesional', icon: Briefcase, hint: 'Ofrezco servicios independientes' },
  { value: 'COMPANY', label: 'Empresa', icon: Building2, hint: 'Represento a una empresa' },
]

const INITIAL_FORM = {
  email: '',
  password: '',
  role: 'CUSTOMER',
  firstName: '',
  lastName: '',
  phone: '',
  companyName: '',
  taxId: '',
  industry: '',
}

function inputClass() {
  return 'w-full bg-transparent text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)'
}

function fieldWrapperClass() {
  return 'flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3'
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro')
    } finally {
      setLoading(false)
    }
  }

  const isCompany = form.role === 'COMPANY'

  return (
    <main className="flex min-h-dvh items-center justify-center bg-(--color-bg-main) px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-8 shadow-(--shadow-card)"
      >
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Link to="/">
            <img src={logo} alt="B2BMatch" className="h-12 w-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-(--color-text-main)">Crea tu cuenta</h1>
            <p className="mt-1 text-sm text-(--color-text-muted)">
              Conecta tu negocio con clientes y profesionales
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                className={`cursor-pointer rounded-xl border px-3 py-3 text-center transition ${
                  form.role === value
                    ? 'border-(--color-cta) bg-(--color-cta)/10 text-(--color-text-main)'
                    : 'border-(--color-border) bg-(--color-bg-input) text-(--color-text-muted) hover:border-(--color-accent)/60'
                }`}
              >
                <Icon size={20} className="mx-auto mb-1" />
                <span className="block text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>

          {isCompany ? (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-(--color-text-main)">Nombre de la empresa</span>
                <div className={fieldWrapperClass()}>
                  <Building2 size={18} className="shrink-0 text-(--color-text-muted)" />
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Andes Design Studio"
                    className={inputClass()}
                  />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">RUT / Tax ID</span>
                  <div className={fieldWrapperClass()}>
                    <input
                      type="text"
                      name="taxId"
                      required
                      value={form.taxId}
                      onChange={handleChange}
                      placeholder="76.111.222-3"
                      className={inputClass()}
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Rubro</span>
                  <div className={fieldWrapperClass()}>
                    <input
                      type="text"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      placeholder="Diseño gráfico"
                      className={inputClass()}
                    />
                  </div>
                </label>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-(--color-text-main)">Nombre</span>
                <div className={fieldWrapperClass()}>
                  <User size={18} className="shrink-0 text-(--color-text-muted)" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Juan"
                    className={inputClass()}
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-(--color-text-main)">Apellido</span>
                <div className={fieldWrapperClass()}>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Pérez"
                    className={inputClass()}
                  />
                </div>
              </label>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-(--color-text-main)">Email</span>
            <div className={fieldWrapperClass()}>
              <Mail size={18} className="shrink-0 text-(--color-text-muted)" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@empresa.cl"
                className={inputClass()}
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-(--color-text-main)">Contraseña</span>
            <div className={fieldWrapperClass()}>
              <Lock size={18} className="shrink-0 text-(--color-text-muted)" />
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                className={inputClass()}
              />
            </div>
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-(--color-cta) py-3 text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={18} />
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-muted)">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-(--color-accent) hover:opacity-80">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
