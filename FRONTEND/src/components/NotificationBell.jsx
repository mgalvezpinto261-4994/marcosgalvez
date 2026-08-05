import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { fetchMyNotifications, fetchUnreadCount, markNotificationAsRead } from '../lib/notificaciones.js'

const dateFormatter = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchUnreadCount()
      .then((data) => setUnreadCount(data.count))
      .catch(() => {})

    const interval = setInterval(() => {
      fetchUnreadCount()
        .then((data) => setUnreadCount(data.count))
        .catch(() => {})
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleOpen() {
    const next = !open
    setOpen(next)
    if (next) {
      fetchMyNotifications()
        .then(setNotifications)
        .catch(() => setNotifications([]))
    }
  }

  async function handleNotificationClick(notification) {
    if (notification.isRead) return
    try {
      await markNotificationAsRead(notification.id)
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // ignorar — no bloquear la UI si falla marcar como leída
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex cursor-pointer items-center justify-center rounded-full p-2 text-(--color-text-main) transition hover:bg-(--color-bg-input)"
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-cta) text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-(--color-border) bg-(--color-bg-card) p-2 shadow-(--shadow-card)"
          >
            <p className="px-3 py-2 text-sm font-semibold text-(--color-text-main)">Notificaciones</p>
            <div className="max-h-80 overflow-y-auto">
              {notifications === null && (
                <p className="px-3 py-4 text-sm text-(--color-text-muted)">Cargando...</p>
              )}
              {notifications && notifications.length === 0 && (
                <p className="px-3 py-4 text-sm text-(--color-text-muted)">No tienes notificaciones todavía.</p>
              )}
              {notifications &&
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`block w-full cursor-pointer rounded-xl px-3 py-2.5 text-left transition hover:bg-(--color-bg-input) ${
                      notification.isRead ? '' : 'bg-(--color-accent)/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-(--color-text-main)">{notification.title}</span>
                      {!notification.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-(--color-cta)" />}
                    </div>
                    {notification.message && (
                      <p className="mt-0.5 text-xs text-(--color-text-muted)">{notification.message}</p>
                    )}
                    <p className="mt-1 text-[11px] text-(--color-text-muted)">
                      {dateFormatter.format(new Date(notification.createdAt))}
                    </p>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
