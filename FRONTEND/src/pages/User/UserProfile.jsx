import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, AlertCircle, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import {
  fetchMyProfessionalProfile,
  updateMyProfessionalProfile,
  fetchMyCustomerProfile,
  updateMyCustomerProfile,
} from '../../lib/perfiles.js'
import { useSession } from '../../lib/useSession.js'

function inputClass() {
  return 'w-full rounded-xl border border-(--color-border) bg-(--color-bg-input) px-4 py-3 text-sm text-(--color-text-main) outline-none placeholder:text-(--color-text-muted)'
}

export default function UserProfile() {
  const session = useSession()
  const isProfessional = session?.role === 'PROFESSIONAL'
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!session || (session.role !== 'PROFESSIONAL' && session.role !== 'CUSTOMER')) return
    const fetcher = isProfessional ? fetchMyProfessionalProfile : fetchMyCustomerProfile
    fetcher()
      .then(setForm)
      .catch((err) => setError(err.message || 'No se pudo cargar tu perfil'))
      .finally(() => setLoading(false))
  }, [session, isProfessional])

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'PROFESSIONAL' && session.role !== 'CUSTOMER') {
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
      let updated;
      if (isProfessional) {
        updated = await updateMyProfessionalProfile({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          biography: form.biography,
          experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
          portfolioUrl: form.portfolioUrl,
          linkedinUrl: form.linkedinUrl,
          githubUrl: form.githubUrl,
          city: form.city,
          country: form.country,
        })
      } else {
        updated = await updateMyCustomerProfile({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
        })
      }
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
              <User size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-(--color-text-main)">Tu perfil</h1>
              <p className="text-sm text-(--color-text-muted)">
                {isProfessional ? 'Así te ven los clientes que buscan tus servicios' : 'Tu información personal'}
              </p>
            </div>
          </div>

          {loading && <p className="text-(--color-text-muted)">Cargando...</p>}

          {form && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Nombre</span>
                  <input type="text" name="firstName" required value={form.firstName || ''} onChange={handleChange} className={inputClass()} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Apellido</span>
                  <input type="text" name="lastName" required value={form.lastName || ''} onChange={handleChange} className={inputClass()} />
                </label>
              </div>

              {isProfessional && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Biografía</span>
                  <textarea
                    name="biography"
                    rows={3}
                    value={form.biography || ''}
                    onChange={handleChange}
                    placeholder="Cuéntale a tus clientes sobre tu experiencia"
                    className={`${inputClass()} resize-none`}
                  />
                </label>
              )}

              {isProfessional && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-(--color-text-main)">Años de experiencia</span>
                    <input type="number" min="0" name="experienceYears" value={form.experienceYears ?? ''} onChange={handleChange} className={inputClass()} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-(--color-text-main)">Tarifa por hora (CLP)</span>
                    <input type="number" min="0" name="hourlyRate" value={form.hourlyRate ?? ''} onChange={handleChange} className={inputClass()} />
                  </label>
                </div>
              )}

              {isProfessional && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-(--color-text-main)">Portafolio</span>
                    <input type="text" name="portfolioUrl" value={form.portfolioUrl || ''} onChange={handleChange} placeholder="https://..." className={inputClass()} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-(--color-text-main)">LinkedIn</span>
                    <input type="text" name="linkedinUrl" value={form.linkedinUrl || ''} onChange={handleChange} placeholder="https://..." className={inputClass()} />
                  </label>
                </div>
              )}

              {!isProfessional && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Dirección</span>
                  <input type="text" name="address" value={form.address || ''} onChange={handleChange} className={inputClass()} />
                </label>
              )}

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Teléfono</span>
                  <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} className={inputClass()} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-(--color-text-main)">Ciudad</span>
                  <input type="text" name="city" value={form.city || ''} onChange={handleChange} className={inputClass()} />
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
