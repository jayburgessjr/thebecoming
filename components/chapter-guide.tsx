'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { chapters } from '@/content/chapters'
import { readReaderProgress } from '@/lib/session'

type FilterType = 'all' | 'chapters' | 'meditations'

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getExcerpt(body: string, maxChars = 90): string {
  const text = stripHtml(body)
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s\S*$/, '') + '…'
}

export function ChapterGuide() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentChapter] = useState(() => {
    if (typeof window === 'undefined') {
      return 0
    }
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

  return (
    <main className="guide-page page-enter">
      <div className="guide-header">
        <div className="guide-breadcrumb">
          <Link className="guide-breadcrumb-link" href="/hub">
            Hub
          </Link>
          <span className="guide-breadcrumb-sep">·</span>
          <span>Chapter Guide</span>
        </div>
        <h1 className="guide-title">
          Chapter <em>Guide</em>
        </h1>
        <p className="guide-subtitle">
          {chapters.length} entries — search, explore, and jump directly to any passage.
        </p>

        <div className="guide-controls">
          <div className="guide-search-wrap">
            <span className="guide-search-icon">⌕</span>
            <input
              className="guide-search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, theme, or text…"
              type="text"
              value={search}
            />
            {search && (
              <button
                className="guide-search-clear"
                onClick={() => setSearch('')}
                type="button"
              >
                ×
              </button>
            )}
          </div>

          <div className="guide-filters">
            {(['all', 'chapters', 'meditations'] as FilterType[]).map((f) => (
              <button
                className={`guide-filter-btn${filter === f ? ' active' : ''}`}
                key={f}
                onClick={() => setFilter(f)}
                type="button"
              >
                {f === 'all' ? 'All' : f === 'chapters' ? 'Chapters' : 'Meditations'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="guide-body">
        {filtered.length === 0 ? (
          <div className="guide-empty">
            <div className="guide-empty-icon">◌</div>
            <p>No entries match &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="guide-grid">
            {filtered.map((ch) => {
              const isMeditation = ch.num === 'Meditation'
              const isRead = ch.index < currentChapter
              const isCurrent = ch.index === currentChapter

              return (
                <button
                  className={`guide-card${isMeditation ? ' guide-card--meditation' : ''}${isCurrent ? ' guide-card--current' : ''}`}
                  key={`${ch.num}-${ch.index}`}
                  onClick={() => router.push(`/hub/read/${ch.index + 1}`)}
                  type="button"
                >
                  <div className="guide-card-top">
                    <span className="guide-card-num">
                      {isMeditation ? '✦' : ch.num}
                    </span>
                    {isRead && <span className="guide-card-read">Read ✓</span>}
                    {isCurrent && <span className="guide-card-current-badge">Current</span>}
                  </div>
                  <div className="guide-card-title">{ch.title}</div>
                  <div className="guide-card-excerpt">{getExcerpt(ch.body)}</div>
                </button>
              )
            })}
          </div>
        )}

        <div className="guide-count">
          Showing {filtered.length} of {chapters.length} entries
        </div>
      </div>
    </main>
  )
}
