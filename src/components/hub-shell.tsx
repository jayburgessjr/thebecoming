import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { BottomNav } from '@/components/bottom-nav'
import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { chapters } from '@/content/chapters'
import { readAccessSession, readReaderProgress } from '@/lib/session'
import type { AccessSession, ReaderProgress } from '@/lib/types'

const BOOK_PDF_PATH = '/the-way-of-becoming.pdf'

// Replace with your Stripe Payment Link once created at dashboard.stripe.com/payment-links
const STRIPE_TIP_URL = 'https://buy.stripe.com/28EdRa2q93rR2rQ3kSbfO00'

const mainActions = [
  {
    href: '/hub/read',
    icon: '📖',
    tag: 'Primary Experience',
    title: 'Open the Reader',
    desc: 'Enter through the chapter guide, pick a meditation, and read in a full-screen space that remembers where you left off.',
    action: 'Open Reader →',
    featured: true,
  },
  {
    href: '/hub/listen',
    icon: '🎧',
    tag: 'Spoken Companion',
    title: 'Listen & Reflect',
    desc: 'Move through the meditations by ear when reading is not the form the day is asking for.',
    action: 'Listen Now →',
    featured: false,
  },
]

const secondaryActions = [
  {
    href: '/hub/guide',
    icon: '✦',
    title: 'Chapter Guide',
    desc: 'Browse the full sequence and enter at the meditation that matches the moment.',
  },
  {
    href: '/hub/journal',
    icon: '✍',
    title: 'Reflection Journal',
    desc: 'Keep private notes, prompts, and reflections alongside your reading.',
  },
]

export function HubShell() {
  const { showToast } = useToast()
  const [session] = useState<AccessSession | null>(() => {
    if (typeof window === 'undefined') return null
    return readAccessSession()
  })
  const [progress] = useState<ReaderProgress>(() => {
    if (typeof window === 'undefined') return { currentChapter: 0, totalChapters: chapters.length }
    return readReaderProgress(chapters.length)
  })

  const progressPercent = useMemo(() => {
    if (!progress.totalChapters) return 0
    return Math.round((progress.currentChapter / progress.totalChapters) * 100)
  }, [progress.currentChapter, progress.totalChapters])

  const handleDownload = () => {
    showToast('Preparing your download...')
    window.setTimeout(() => {
      const link = document.createElement('a')
      link.href = BOOK_PDF_PATH
      link.download = 'The-Way-of-Becoming-Jay-Burgess.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast('Download started ✓')
    }, 800)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/access`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'The Way of Becoming', url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        showToast('Sharing link copied to clipboard')
      }
    } catch {
      showToast('Unable to share')
    }
  }

  return (
    <div className="min-h-screen bg-background nav-offset">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-sm font-semibold text-foreground">
            The Way of Becoming
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="hidden text-sm text-muted-foreground sm:block">{session?.fullName ?? 'Welcome back'}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {session?.initials ?? '·'}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Welcome + progress */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Your Access Portal
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Welcome, <em className="font-normal italic text-primary-foreground">{session?.firstName ?? 'Traveler'}</em>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Begin where you are. Nothing here asks you to rush.
          </p>

          {/* Progress — inline on mobile */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary-foreground transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {progress.currentChapter}/{progress.totalChapters}
            </span>
            <span className="text-xs font-medium text-foreground">{progressPercent}%</span>
          </div>
        </div>

        {/* Today's passage */}
        <Card className="mb-6 border-primary/30 bg-primary/10">
          <CardContent className="p-4 md:p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground">
              Today&apos;s Passage
            </p>
            <blockquote className="mt-2 text-sm italic leading-relaxed text-foreground/80">
              &ldquo;The seed does not argue with the season. It waits through darkness, through
              stillness, through unseen growth.&rdquo;
            </blockquote>
            <p className="mt-2 text-xs text-muted-foreground">Chapter 67</p>
          </CardContent>
        </Card>

        {/* Main action cards */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mainActions.map((action) => (
            <Link key={action.href} to={action.href} className="group active:scale-[0.98] transition-transform">
              <Card className="h-full border-border/70 transition-shadow active:shadow-none hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{action.icon}</span>
                    {action.featured ? (
                      <span className="rounded-full border border-primary/40 bg-primary/20 px-2 py-0.5 text-xs text-primary-foreground">
                        {action.tag}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{action.tag}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {action.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{action.desc}</p>
                  </div>
                  <span className="mt-auto text-sm font-medium text-foreground">
                    {action.action}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Secondary grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Download PDF */}
          <Card
            className="cursor-pointer border-border/70 transition-shadow active:shadow-none hover:shadow-md active:scale-[0.98] transition-transform"
            onClick={handleDownload}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDownload() }}
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <span className="text-2xl">⬇</span>
              <div>
                <h3 className="font-display font-semibold text-foreground">Download PDF</h3>
                <p className="mt-1 text-xs text-muted-foreground">Keep the full book offline, forever.</p>
              </div>
              <span className="text-xs font-medium text-foreground">Download Now →</span>
            </CardContent>
          </Card>

          {secondaryActions.map((action) => (
            <Link key={action.href} to={action.href} className="group active:scale-[0.98] transition-transform">
              <Card className="h-full border-border/70 transition-shadow active:shadow-none hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-5">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{action.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <span className="text-xs font-medium text-foreground">Explore →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Support the work */}
        <a
          href={STRIPE_TIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 block"
        >
          <Card className="border-border/50 bg-muted/30 transition-shadow hover:shadow-md active:scale-[0.99] transition-transform">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <span className="text-2xl">☕</span>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Support the work</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    If this book has been worth something to you, offer what feels right.
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-foreground group-hover:underline">
                Give →
              </span>
            </CardContent>
          </Card>
        </a>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2025 Jay Burgess · Revuity Systems</p>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-foreground">Book Home</Link>
            <button type="button" onClick={() => showToast('Contact: jay@revuitysystems.com')} className="hover:text-foreground">Contact</button>
            <button type="button" onClick={handleShare} className="hover:text-foreground">Share</button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
