import { getSession } from './auth.js'

const CATALOGO_API_URL = import.meta.env.VITE_CATALOGO_API_URL

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

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
  if (!CATALOGO_API_URL) throw new Error('VITE_CATALOGO_API_URL no está configurada')

  const { signal, clear } = withTimeout(6000)
  try {
    const res = await fetch(`${CATALOGO_API_URL}${path}`, {
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

function mapCompanyService(row) {
  return {
    id: `svc-${row.id}`,
    title: row.title,
    company: row.companyName,
    category: row.categoryName,
    price: currencyFormatter.format(row.price),
    location: row.companyCity || 'Remoto',
    rating: null,
    tags: [row.categoryName],
  }
}

export async function fetchCompanyServices() {
  const data = await request('/api/company-services')
  return data.map(mapCompanyService)
}

export function fetchCategories() {
  return request('/api/categories')
}

export function fetchProfessionalServices() {
  return request('/api/professional-services')
}

export function fetchMyProfessionalServices() {
  return request('/api/professional-services/mine', { auth: true })
}

export function createProfessionalService(payload) {
  return request('/api/professional-services', { method: 'POST', body: payload, auth: true })
}

export function fetchMyCompanyServices() {
  return request('/api/company-services/mine', { auth: true })
}

export function createCompanyService(payload) {
  return request('/api/company-services', { method: 'POST', body: payload, auth: true })
}
