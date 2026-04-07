'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { readAccessSession } from '@/lib/session'

export function SessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAllowed] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return Boolean(readAccessSession()?.firstName)
  })

  useEffect(() => {
    if (!isAllowed) {
      router.replace('/access')
    }
  }, [isAllowed, router])

  if (!isAllowed) {
    return <div style={{ background: '#16130f', minHeight: '100vh' }} />
  }

  return <>{children}</>
}
