import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Headphones, Home, Map, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/hub', icon: Home, label: 'Home', exact: true },
  { href: '/hub/read', icon: BookOpen, label: 'Read', exact: true },
  { href: '/hub/listen', icon: Headphones, label: 'Listen', exact: true },
  { href: '/hub/guide', icon: Map, label: 'Guide', exact: true },
  { href: '/hub/journal', icon: PenLine, label: 'Journal', exact: true },
]

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch justify-around">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 transition-colors active:scale-95',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-[1.375rem] w-[1.375rem]" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
