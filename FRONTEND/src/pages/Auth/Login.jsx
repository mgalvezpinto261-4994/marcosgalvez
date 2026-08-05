import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import logo from '../../assets/img/logo-light.png'
import { login } from '../../lib/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-(--color-bg-main) px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-8 shadow-(--shadow-card)"
      >
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Link to="/">
            <img src={logo} alt="B2BMatch" className="h-12 w-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-(--color-text-main)">Inicia sesión</h1>
            <p className="mt-1 text-sm text-(--color-text-muted)">
              Accede a tu cuenta de B2BMatch
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-(--color-text-main)">Email</span>
            <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3">
              <Mail size={18} className="shrink-0 text-(--color-text-muted)" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@empresa.cl"
                className="w-full bg-transparent text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-(--color-text-main)">Contraseña</span>
            <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3">
              <Lock size={18} className="shrink-0 text-(--color-text-muted)" />
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
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
            <LogIn size={18} />
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-muted)">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-(--color-accent) hover:opacity-80">
            Regístrate
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
