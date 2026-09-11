'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: number
  message: string
  time: string
  variant?: 'default' | 'warning'
}

const demoNotifications: Notification[] = [
  {
    id: 1,
    message: 'Refill call completed — Margaret J.',
    time: '2 min ago',
  },
  {
    id: 2,
    message: 'Side effect report escalated — Robert P.',
    time: '15 min ago',
    variant: 'warning',
  },
  {
    id: 3,
    message: 'Daily call summary ready',
    time: '1 hour ago',
  },
  {
    id: 4,
    message: 'New patient added: Chen, K.',
    time: '2 hours ago',
  },
  {
    id: 5,
    message: 'Call quality score: 94%',
    time: '3 hours ago',
  },
]

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setOpen((prev) => !prev)
    if (!open) {
      setHasUnread(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleToggle}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#f0ece6]/70 hover:text-[#f0ece6] hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-white/10 bg-[#141c2e] shadow-xl z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold text-[#f0ece6]">
              Notifications
            </h3>
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {demoNotifications.map((notification) => (
              <li
                key={notification.id}
                className="px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <p
                  className={`text-sm leading-snug ${
                    notification.variant === 'warning'
                      ? 'text-amber-400'
                      : 'text-[#f0ece6]/90'
                  }`}
                >
                  {notification.message}
                </p>
                <span className="mt-1 block text-xs text-[#f0ece6]/40">
                  {notification.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
