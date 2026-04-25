import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

import { useToast } from '@/components/toast-provider'
import { chapters } from '@/content/chapters'
import { writeReaderProgress } from '@/lib/session'

export function ReaderPage({ chapterIndex }: { chapterIndex: number }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const bodyRef = useRef<HTMLDivElement>(null)
  const hasPrevious = chapterIndex > 0
  const hasNext = chapterIndex < chapters.length - 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    writeReaderProgress({ currentChapter: chapterIndex + 1, totalChapters: chapters.length })
  }, [chapterIndex])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        if (chapterIndex < chapters.length - 1) {
          navigate(`/hub/read/${chapterIndex + 2}`)
        } else {
          showToast('You have reached the end. Begin again.')
        }
      }
      if (event.key === 'ArrowLeft') {
        if (chapterIndex > 0) navigate(`/hub/read/${chapterIndex}`)
      }
      if (event.key === 'Escape') navigate('/hub/read')
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [chapterIndex, navigate, showToast])

  const chapter = chapters[chapterIndex]

  return (
    <div className="flex h-screen flex-col bg-background" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-border">
        <div
          className="h-full bg-primary-foreground transition-all duration-300"
          style={{ width: `${((chapterIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>

      {/* Nav */}
      <header className="shrink-0 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-1 md:px-6 md:py-2">
          {/* Prev */}
          <button
            type="button"
            disabled={!hasPrevious}
            onClick={() => hasPrevious && navigate(`/hub/read/${chapterIndex}`)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent disabled:opacity-30"
            aria-label="Previous chapter"
          >
            ←
          </button>

          {/* Counter + Close */}
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-muted-foreground">
              {chapterIndex + 1} <span className="opacity-50">/</span> {chapters.length}
            </span>
            <Link
              to="/hub/read"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent"
              aria-label="Close reader"
            >
              ✕
            </Link>
          </div>

          {/* Next */}
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => {
              if (hasNext) navigate(`/hub/read/${chapterIndex + 2}`)
              else showToast('You have reached the end. Begin again.')
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent disabled:opacity-30"
            aria-label="Next chapter"
          >
            →
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" ref={bodyRef}>
        <div className="mx-auto max-w-2xl px-5 py-12 md:px-6 md:py-14">
          {/* Chapter header */}
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {chapter.num === 'Meditation' || chapter.num === 'Final Meditation' || chapter.num === 'Final'
                ? chapter.num
                : `Chapter ${chapter.num}`}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
              {chapter.title}
            </h1>
          </div>

          {/* Chapter body */}
          <div
            className="reader-prose"
            dangerouslySetInnerHTML={{ __html: chapter.body }}
          />

          {/* Navigation footer — large touch targets */}
          <div className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8">
            <button
              type="button"
              disabled={!hasPrevious}
              onClick={() => hasPrevious && navigate(`/hub/read/${chapterIndex}`)}
              className="flex min-h-[3rem] flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent disabled:opacity-30"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => {
                if (hasNext) navigate(`/hub/read/${chapterIndex + 2}`)
                else showToast('You have reached the end. Begin again.')
              }}
              className="flex min-h-[3rem] flex-1 items-center justify-center rounded-xl bg-foreground px-4 text-sm text-background transition-colors hover:bg-foreground/90 active:bg-foreground/80 disabled:opacity-30"
            >
              Next →
            </button>
          </div>

          {/* Page footer */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© 2025 Jay Burgess · Revuity Systems</p>
            <div className="flex items-center gap-4">
              <Link to="/hub/read" className="hover:text-foreground">All Chapters</Link>
              <Link to="/hub" className="hover:text-foreground">Hub</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
