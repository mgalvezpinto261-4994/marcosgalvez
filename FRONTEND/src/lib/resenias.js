import { getSession } from './auth.js'

const RESENIAS_API_URL = import.meta.env.VITE_RESENIAS_API_URL

function withTimeout(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

function authHeaders() {
  const session = getSession()
  return session ? { Authorization: `Bearer ${session.token}` } : {}
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  if (!RESENIAS_API_URL) throw new Error('VITE_RESENIAS_API_URL no está configurada')

  const { signal, clear } = withTimeout(6000)
  try {
    const res = await fetch(`${RESENIAS_API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? authHeaders() : {}),
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

export function fetchReviewsForProfessional(professionalId) {
  return request(`/api/professionals/${professionalId}/reviews`)
}

export function createReview(professionalId, payload) {
  return request(`/api/professionals/${professionalId}/reviews`, { method: 'POST', body: payload, auth: true })
}
