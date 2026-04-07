'use client'

import Link from 'next/link'

import { chapters } from '@/content/chapters'

export function AudioLibrary() {
  return (
    <main className="reader-page">
      <div className="reader-progress-bar">
        <div className="reader-progress-inner" style={{ width: '0%' }} />
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
          <div className="reader-chapter-label">Audio Library</div>
          <div className="reader-chapter-title">All Passages</div>
          <p className="reader-library-copy">
            Every chapter and meditation read aloud by Jay Burgess. Press play on any passage.
          </p>
          <div className="reader-library-list">
            {chapters.map((chapter, index) => (
              <Link
                className="reader-library-link"
                href={`/hub/listen/${index + 1}`}
                key={`${chapter.num}-${chapter.title}-${index}`}
              >
                <div className="reader-library-meta">
                  <span className="reader-library-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="reader-library-num">{chapter.num}</span>
                </div>
                <div className="reader-library-text">
                  <span className="reader-library-title">{chapter.title}</span>
                  <span className="reader-library-arrow audio-library-play">▶</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
