const USUARIOS_API_URL = import.meta.env.VITE_USUARIOS_API_URL
const SESSION_KEY = 'b2bmatch.session'

function withTimeout(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

async function postAuth(path, payload) {
  if (!USUARIOS_API_URL) throw new Error('VITE_USUARIOS_API_URL no está configurada')

  const { signal, clear } = withTimeout(6000)
  try {
    const res = await fetch(`${USUARIOS_API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

export function register(payload) {
  return postAuth('/api/auth/register', payload).then(saveSession)
}

export function login(payload) {
  return postAuth('/api/auth/login', payload).then(saveSession)
}

function saveSession(authResponse) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(authResponse))
  window.dispatchEvent(new Event('b2bmatch-session-change'))
  return authResponse
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('b2bmatch-session-change'))
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
