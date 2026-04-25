import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <div className={cn('absolute inset-x-0 top-0 z-50 flex justify-center pt-4', className)}>
      <nav className="flex w-[min(92%,720px)] items-center justify-between rounded-4xl border border-border/60 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md">
        {/* Logo */}
        <Link
          to="/"
          className="px-2 font-display text-sm font-semibold tracking-tight text-foreground"
        >
          The Way of Becoming
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {[
            { href: '/hub/read', label: 'Read' },
            { href: '/hub/listen', label: 'Listen' },
            { href: '/hub/guide', label: 'Guide' },
            { href: '/hub/journal', label: 'Journal' },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Button asChild size="sm" className="rounded-3xl text-xs font-semibold">
          <Link to="/access">Open Book →</Link>
        </Button>
      </nav>
    </div>
  )
}
