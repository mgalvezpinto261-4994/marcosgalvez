import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchMyCompanyProfile, updateMyCompanyProfile } from '../../lib/perfiles.js'
import { useSession } from '../../lib/useSession.js'

export default function CompanyProfile() {
  const session = useSession()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (session?.role !== 'COMPANY') return
    fetchMyCompanyProfile()
      .then(setForm)
      .catch((err) => setError(err.message || 'No se pudo cargar tu perfil'))
      .finally(() => setLoading(false))
  }, [session])

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'COMPANY') {
    return <Navigate to="/" replace />
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const updated = await updateMyCompanyProfile({
        companyName: form.companyName,
        industry: form.industry,
        website: form.website,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country: form.country,
        companyDescription: form.companyDescription,
        logoUrl: form.logoUrl,
      })
      setForm(updated)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'No se pudo guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col px-5 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-accent)/10 text-(--color-accent)">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-(--color-text-main)">Perfil de tu empresa</h1>
              <p className="text-sm text-(--color-text-muted)">Esta información la ven tus clientes potenciales</p>
            </div>
          </div>

          {loading && <p className="text-(--color-text-muted)">Cargando...</p>}

          {form && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-(--color-text-main)">Nombre de la empresa</span>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={form.companyName || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">RUT / Tax ID</span>
                  <input
                    type="text"
                    value={form.taxId || ''}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-muted) outline-none opacity-60"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Rubro</span>
                  <input
                    type="text"
                    name="industry"
                    value={form.industry || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-(--color-text-main)">Descripción</span>
                <textarea
                  name="companyDescription"
                  rows={3}
                  value={form.companyDescription || ''}
                  onChange={handleChange}
                  placeholder="Cuéntale a tus clientes qué hace tu empresa"
                  className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Sitio web</span>
                  <input
                    type="text"
                    name="website"
                    value={form.website || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Email de contacto</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Teléfono</span>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Ciudad</span>
                  <input
                    type="text"
                    name="city"
                    value={form.city || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none"
                  />
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-(--color-accent)/40 bg-(--color-accent)/10 px-4 py-3 text-sm text-(--color-accent)">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Perfil actualizado correctamente.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-2 cursor-pointer rounded-full bg-(--color-cta) py-3 text-sm font-semibold text-white shadow-[0_0_12px_rgba(229,62,62,0.3)] transition hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
