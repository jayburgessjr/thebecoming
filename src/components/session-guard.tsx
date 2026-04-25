import { useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'

import { readAccessSession } from '@/lib/session'

export function SessionGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const allowed = Boolean(readAccessSession()?.firstName)
    setIsAllowed(allowed)
    if (!allowed) {
      navigate('/access', { replace: true })
    }
  }, [navigate])

  if (!isAllowed) {
    return <div className="min-h-screen bg-background" />
  }

  return <>{children}</>
}
