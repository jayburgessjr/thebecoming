import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface BackgroundProps {
  children: ReactNode
  variant?: 'top' | 'bottom' | 'neutral'
  className?: string
}

export function Background({ children, variant = 'top', className }: BackgroundProps) {
  return (
    <div
      className={cn(
        'mx-2.5 mt-2.5 rounded-3xl lg:mx-4',
        variant === 'top' && 'bg-gradient-to-b from-primary/40 via-primary/10 to-background',
        variant === 'bottom' && 'bg-gradient-to-t from-primary/40 via-primary/10 to-background',
        variant === 'neutral' && 'bg-muted/40',
        className
      )}
    >
      {children}
    </div>
  )
}
