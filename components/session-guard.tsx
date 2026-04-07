'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { readAccessSession } from '@/lib/session'

export function SessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const allowed = Boolean(readAccessSession()?.firstName)
    setIsAllowed(allowed)
    if (!allowed) {
      router.replace('/access')
    }
  }, [router])

  if (!isAllowed) {
    return <div style={{ background: '#16130f', minHeight: '100vh' }} />
  }

  return <>{children}</>
}
