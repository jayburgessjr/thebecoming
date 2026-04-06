'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import { chapters } from '@/content/chapters'
import { readReaderProgress } from '@/lib/session'

export function ReaderLibrary() {
  const progress = useMemo(() => readReaderProgress(chapters.length), [])

  return (
    <main className="reader-page">
      <div className="reader-progress-bar">
        <div
          className="reader-progress-inner"
          style={{ width: `${(progress.currentChapter / chapters.length) * 100}%` }}
        />
      </div>
      <div className="reader-nav">
        <div className="reader-title">The Way of Becoming — Jay Burgess</div>
        <div className="reader-controls">
          <div className="reader-chapter-nav">
            <span>{chapters.length} entries</span>
          </div>
          <Link className="reader-close" href="/hub">
            ✕ Close
          </Link>
        </div>
      </div>
      <div className="reader-body reader-library-body">
        <div className="reader-content reader-library-content">
          <div className="reader-chapter-label">Chapter Guide</div>
          <div className="reader-chapter-title">All Passages</div>
          <p className="reader-library-copy">
            Open any chapter, meditation, or closing passage from the full PDF-backed book.
          </p>
          <div className="reader-library-list">
            {chapters.map((chapter, index) => {
              const isCurrent = progress.currentChapter === index + 1

              return (
                <Link
                  className={`reader-library-link${isCurrent ? ' current' : ''}`}
                  href={`/hub/read/${index + 1}`}
                  key={`${chapter.num}-${chapter.title}-${index}`}
                >
                  <div className="reader-library-meta">
                    <span className="reader-library-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="reader-library-num">{chapter.num}</span>
                  </div>
                  <div className="reader-library-text">
                    <span className="reader-library-title">{chapter.title}</span>
                    <span className="reader-library-arrow">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
