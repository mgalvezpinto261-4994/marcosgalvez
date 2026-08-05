import { getSession } from './auth.js'

const PERFILES_API_URL = import.meta.env.VITE_PERFILES_API_URL

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
  if (!PERFILES_API_URL) throw new Error('VITE_PERFILES_API_URL no está configurada')

  const { signal, clear } = withTimeout(6000)
  try {
    const res = await fetch(`${PERFILES_API_URL}${path}`, {
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

export function fetchMyCompanyProfile() {
  return request('/api/company-profiles/me')
}

export function updateMyCompanyProfile(payload) {
  return request('/api/company-profiles/me', { method: 'PUT', body: payload })
}

export function fetchMyProfessionalProfile() {
  return request('/api/professional-profiles/me')
}

export function updateMyProfessionalProfile(payload) {
  return request('/api/professional-profiles/me', { method: 'PUT', body: payload })
}

export function fetchMyCustomerProfile() {
  return request('/api/customer-profiles/me')
}

export function updateMyCustomerProfile(payload) {
  return request('/api/customer-profiles/me', { method: 'PUT', body: payload })
}
