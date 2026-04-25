import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { BottomNav } from '@/components/bottom-nav'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { chapters } from '@/content/chapters'
import { readReaderProgress } from '@/lib/session'

type FilterType = 'all' | 'chapters' | 'meditations'

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getExcerpt(body: string, maxChars = 100): string {
  const text = stripHtml(body)
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s\S*$/, '') + '…'
}

export function ChapterGuide() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentChapter] = useState(() => {
    if (typeof window === 'undefined') return 0
    return readReaderProgress(chapters.length).currentChapter
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return chapters
      .map((ch, index) => ({ ...ch, index }))
      .filter((ch) => {
        if (filter === 'chapters' && ch.num === 'Meditation') return false
        if (filter === 'meditations' && ch.num !== 'Meditation') return false
        if (!q) return true
        return (
          ch.title.toLowerCase().includes(q) ||
          ch.num.toLowerCase().includes(q) ||
          stripHtml(ch.body).toLowerCase().includes(q)
        )
      })
  }, [search, filter])

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'chapters', label: 'Chapters' },
    { value: 'meditations', label: 'Meditations' },
  ]

  return (
    <div className="min-h-screen bg-background nav-offset">
      {/* Sticky header + controls */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
          {/* Title row */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                Chapter <em className="font-normal italic text-primary-foreground">Guide</em>
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {chapters.length} entries
              </p>
            </div>
            <Link
              to="/hub"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent"
            >
              ✕
            </Link>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">⌕</span>
              <Input
                className="pl-8"
                placeholder="Search by title, theme, or text…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch('')}
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={`min-h-[2.5rem] rounded-md px-4 py-2 text-xs transition-colors ${
                    filter === opt.value
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground active:bg-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="text-4xl text-muted-foreground/40">◌</span>
            <p className="text-sm text-muted-foreground">No entries match &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ch) => {
              const isMeditation = ch.num === 'Meditation'
              const isRead = ch.index < currentChapter
              const isCurrent = ch.index === currentChapter

              return (
                <button
                  key={`${ch.num}-${ch.index}`}
                  type="button"
                  className="group text-left active:scale-[0.98] transition-transform"
                  onClick={() => navigate(`/hub/read/${ch.index + 1}`)}
                >
                  <Card className={`h-full border-border/70 transition-shadow hover:shadow-md active:shadow-none ${isCurrent ? 'ring-2 ring-primary' : ''}`}>
                    <CardContent className="flex flex-col gap-3 p-4 md:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {isMeditation ? '✦ Meditation' : ch.num}
                        </span>
                        <div className="flex gap-1.5">
                          {isRead && <Badge variant="success" className="text-[10px]">Read ✓</Badge>}
                          {isCurrent && <Badge className="text-[10px]">Current</Badge>}
                        </div>
                      </div>
                      <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                        {ch.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {getExcerpt(ch.body)}
                      </p>
                      <span className="mt-auto text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
                        Open →
                      </span>
                    </CardContent>
                  </Card>
                </button>
              )
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Showing {filtered.length} of {chapters.length} entries
        </p>
      </main>

      <BottomNav />
    </div>
  )
}
