import { Link } from 'react-router-dom'
import { useMemo } from 'react'

import { BottomNav } from '@/components/bottom-nav'
import { chapters } from '@/content/chapters'
import { readReaderProgress } from '@/lib/session'

export function ReaderLibrary() {
  const progress = useMemo(() => readReaderProgress(chapters.length), [])

  return (
    <div className="flex min-h-screen flex-col bg-background nav-offset">
      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-border">
        <div
          className="h-full bg-primary-foreground transition-all duration-300"
          style={{ width: `${(progress.currentChapter / chapters.length) * 100}%` }}
        />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 md:px-6">
          <span className="font-display text-sm font-semibold text-foreground">
            Reader Library
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{chapters.length} entries</span>
            <Link
              to="/hub"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              ✕
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Chapter Guide
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            All Passages
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Open any chapter, meditation, or closing passage. Tap to begin reading.
          </p>
        </div>

        <div className="divide-y divide-border">
          {chapters.map((chapter, index) => {
            const isCurrent = progress.currentChapter === index + 1
            const isRead = index + 1 < progress.currentChapter

            return (
              <Link
                key={`${chapter.num}-${chapter.title}-${index}`}
                to={`/hub/read/${index + 1}`}
                className="group flex min-h-[3.5rem] items-center gap-4 py-4 transition-colors active:bg-accent/40 hover:bg-accent/30"
              >
                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="w-20 shrink-0 text-xs text-muted-foreground">{chapter.num}</span>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {chapter.title}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {isRead && <span className="text-xs text-muted-foreground">✓</span>}
                  {isCurrent && (
                    <span className="rounded-full bg-primary/30 px-2 py-0.5 text-xs text-primary-foreground">
                      Current
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
