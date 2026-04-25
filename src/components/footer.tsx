import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© 2025 Jay Burgess · Revuity Systems</p>
        <div className="flex items-center gap-6">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/hub" className="transition-colors hover:text-foreground">
            Your Hub
          </Link>
          <Link to="/access" className="transition-colors hover:text-foreground">
            Get Access
          </Link>
          <a
            href="https://buy.stripe.com/28EdRa2q93rR2rQ3kSbfO00"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
