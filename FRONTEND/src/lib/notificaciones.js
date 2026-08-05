import { getSession } from './auth.js'

const NOTIFICACIONES_API_URL = import.meta.env.VITE_NOTIFICACIONES_API_URL

function withTimeout(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

function authHeaders() {
  const session = getSession()
  return session ? { Authorization: `Bearer ${session.token}` } : {}
}

async function request(path, { method = 'GET', body } = {}) {
  if (!NOTIFICACIONES_API_URL) throw new Error('VITE_NOTIFICACIONES_API_URL no está configurada')

  const { signal, clear } = withTimeout(5000)
  try {
    const res = await fetch(`${NOTIFICACIONES_API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const message = data.message || Object.values(data)[0] || `Error ${res.status}`
      throw new Error(message)
    }

    return data
  } finally {
    clear()
  }
}

export function fetchMyNotifications() {
  return request('/api/notifications/mine')
}

export function fetchUnreadCount() {
  return request('/api/notifications/unread-count')
}

export function markNotificationAsRead(id) {
  return request(`/api/notifications/${id}/read`, { method: 'PUT' })
}
