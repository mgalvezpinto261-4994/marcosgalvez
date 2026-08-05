import { getSession } from './auth.js'

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

async function request(path, { method = 'GET', body, auth = false } = {}) {
  if (!OFERTAS_API_URL) throw new Error('VITE_OFERTAS_API_URL no está configurada')

  const { signal, clear } = withTimeout(6000)
  try {
    const res = await fetch(`${OFERTAS_API_URL}${path}`, {
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

export function fetchActiveOffers() {
  return request('/api/job-offers')
}

export function fetchMyOffers() {
  return request('/api/job-offers/mine', { auth: true })
}

export function createOffer(payload) {
  return request('/api/job-offers', { method: 'POST', body: payload, auth: true })
}

export function applyToOffer(jobOfferId, payload) {
  return request(`/api/job-offers/${jobOfferId}/applications`, { method: 'POST', body: payload, auth: true })
}

export function fetchApplicationsForOffer(jobOfferId) {
  return request(`/api/job-offers/${jobOfferId}/applications`, { auth: true })
}

export function fetchMyApplications() {
  return request('/api/applications/mine', { auth: true })
}

export function updateApplicationStatus(jobOfferId, applicationId, status) {
  return request(`/api/job-offers/${jobOfferId}/applications/${applicationId}/status`, {
    method: 'PUT',
    body: { status },
    auth: true,
  })
}

export function updateOffer(jobOfferId, payload) {
  return request(`/api/job-offers/${jobOfferId}`, { method: 'PUT', body: payload, auth: true })
}

export function closeOffer(jobOfferId) {
  return request(`/api/job-offers/${jobOfferId}/close`, { method: 'PUT', auth: true })
}

export function requestQuotation(serviceId, payload) {
  return request(`/api/services/${serviceId}/quotations`, { method: 'POST', body: payload, auth: true })
}

export function fetchQuotationsForService(serviceId) {
  return request(`/api/services/${serviceId}/quotations`, { auth: true })
}

export function fetchMyQuotations() {
  return request('/api/quotations/mine', { auth: true })
}

export function updateQuotationStatus(quotationId, status) {
  return request(`/api/quotations/${quotationId}/status`, { method: 'PUT', body: { status }, auth: true })
}
