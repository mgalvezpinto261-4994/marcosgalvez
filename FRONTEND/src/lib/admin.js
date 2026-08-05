import { getSession } from './auth.js'

const USUARIOS_API_URL = import.meta.env.VITE_USUARIOS_API_URL
const PERFILES_API_URL = import.meta.env.VITE_PERFILES_API_URL
const OFERTAS_API_URL = import.meta.env.VITE_OFERTAS_API_URL

function withTimeout(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

function authHeaders() {
  const session = getSession()
  return session ? { Authorization: `Bearer ${session.token}` } : {}
}

async function request(baseUrl, path, { method = 'GET', body } = {}) {
  if (!baseUrl) throw new Error('Falta configurar la URL del microservicio')

  const { signal, clear } = withTimeout(6000)
  try {
    const res = await fetch(`${baseUrl}${path}`, {
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

export function fetchAllUsers() {
  return request(USUARIOS_API_URL, '/api/admin/users')
}

export function updateUserStatus(userId, status) {
  return request(USUARIOS_API_URL, `/api/admin/users/${userId}/status`, { method: 'PUT', body: { status } })
}

export function fetchAllCompanies() {
  return request(PERFILES_API_URL, '/api/admin/company-profiles')
}

export function fetchAllJobOffers() {
  return request(OFERTAS_API_URL, '/api/admin/job-offers')
}
