import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldCheck, AlertCircle, Ban, CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import { fetchAllUsers, updateUserStatus } from '../../lib/admin.js'
import { useSession } from '../../lib/useSession.js'
import { AdminNav } from './AdminNav.jsx'

const dateFormatter = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })

function UserRow({ user, onStatusChange }) {
  const [updating, setUpdating] = useState(false)

  async function toggleStatus() {
    setUpdating(true)
    try {
      const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
      const updated = await updateUserStatus(user.id, newStatus)
      onStatusChange(updated)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <tr className="border-b border-(--color-border) last:border-0">
      <td className="py-3 pr-4 text-sm text-(--color-text-main)">{user.email}</td>
      <td className="py-3 pr-4 text-sm text-(--color-text-muted)">{user.role}</td>
      <td className="py-3 pr-4 text-sm text-(--color-text-muted)">{dateFormatter.format(new Date(user.createdAt))}</td>
      <td className="py-3 pr-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.status === 'ACTIVE'
              ? 'bg-(--color-accent)/10 text-(--color-accent)'
              : 'bg-(--color-cta)/10 text-(--color-cta)'
          }`}
        >
          {user.status === 'ACTIVE' ? 'Activo' : 'Suspendido'}
        </span>
      </td>
      <td className="py-3">
        {user.role !== 'ADMIN' && (
          <button
            type="button"
            disabled={updating}
            onClick={toggleStatus}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
              user.status === 'ACTIVE'
                ? 'bg-(--color-cta)/10 text-(--color-cta) hover:bg-(--color-cta)/20'
                : 'bg-(--color-accent)/10 text-(--color-accent) hover:bg-(--color-accent)/20'
            }`}
          >
            {user.status === 'ACTIVE' ? (
              <>
                <Ban size={14} /> Suspender
              </>
            ) : (
              <>
                <CheckCircle2 size={14} /> Reactivar
              </>
            )}
          </button>
        )}
      </td>
    </tr>
  )
}

export default function AdminUsers() {
  const session = useSession()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.role !== 'ADMIN') return
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message || 'No se pudieron cargar los usuarios'))
      .finally(() => setLoading(false))
  }, [session])

  function handleStatusChange(updated) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session && session.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-dvh bg-(--color-bg-main)">
      <Navbar />
      <main className="mx-auto max-w-(--breakpoint-xl) px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={28} className="text-(--color-accent)" />
          <h1 className="text-3xl font-bold text-(--color-text-main)">Usuarios</h1>
        </div>

        <AdminNav />

        {loading && <p className="mt-6 text-(--color-text-muted)">Cargando...</p>}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-(--color-cta)/40 bg-(--color-cta)/10 px-4 py-3 text-sm text-(--color-cta)">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-6">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-(--color-border) text-xs uppercase text-(--color-text-muted)">
                  <th className="pb-3 pr-4 font-semibold">Email</th>
                  <th className="pb-3 pr-4 font-semibold">Rol</th>
                  <th className="pb-3 pr-4 font-semibold">Registrado</th>
                  <th className="pb-3 pr-4 font-semibold">Estado</th>
                  <th className="pb-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow key={user.id} user={user} onStatusChange={handleStatusChange} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
