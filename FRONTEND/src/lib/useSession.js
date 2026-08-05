import { useEffect, useState } from 'react'
import { getSession } from './auth.js'

export function useSession() {
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    const onChange = () => setSession(getSession())
    window.addEventListener('b2bmatch-session-change', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('b2bmatch-session-change', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  return session
}
