'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { chapters } from '@/content/chapters'
import { readAccessSession, readReaderProgress } from '@/lib/session'
import type { AccessSession, ReaderProgress } from '@/lib/types'
import { useToast } from '@/components/toast-provider'

const BOOK_PDF_PATH = '/the-way-of-becoming.pdf'

export function HubShell() {
  const { showToast } = useToast()
  const [session] = useState<AccessSession | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return readAccessSession()
  })
  const [progress] = useState<ReaderProgress>(() => {
    if (typeof window === 'undefined') {
      return {
        currentChapter: 0,
        totalChapters: chapters.length,
      }
    }
    return readReaderProgress(chapters.length)
  })

  const progressWidth = useMemo(() => {
    if (!progress.totalChapters) return '0%'
    return `${(progress.currentChapter / progress.totalChapters) * 100}%`
  }, [progress.currentChapter, progress.totalChapters])

  const handleDownload = () => {
    showToast('Preparing your download...')

    window.setTimeout(() => {
      const link = document.createElement('a')
      link.href = BOOK_PDF_PATH
      link.download = 'The-Way-of-Becoming-Jay-Burgess.pdf'
      // Must be in the DOM for Firefox to honour the download attribute
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast('Download started ✓')
    }, 800)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/access`

    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Sharing link copied to clipboard')
    } catch {
      showToast('Unable to copy the share link')
    }
  }

  return (
    <main className="page-enter fullscreen-page" id="page-hub">
      <div className="hub-nav">
        <div className="hub-logo">
          The Way of <span>Becoming</span>
        </div>
        <div className="hub-user">
          <span className="hub-user-name" id="hub-username">
            {session?.fullName ?? 'Welcome back'}
          </span>
          <div className="hub-user-dot" id="hub-initials">
            {session?.initials ?? '·'}
          </div>
        </div>
      </div>

      <div className="hub-stage">
        <div className="hub-welcome-calm">
          <div className="hub-welcome-text">
            <div className="hub-greeting">Your Access Portal</div>
            <h1 className="hub-welcome-title">
              Welcome,
              <br />
              <em id="hub-first-name">{session?.firstName ?? 'Traveler'}</em>
            </h1>
            <p className="hub-welcome-sub">Begin where you are. Nothing here asks you to rush.</p>
          </div>
          <div className="hub-progress hub-progress-calm">
            <div className="hub-progress-label">Reading Progress</div>
            <div className="hub-progress-bar">
              <div className="hub-progress-fill" id="progress-fill" style={{ width: progressWidth }} />
            </div>
            <div className="hub-progress-num" id="progress-num">
              {progress.currentChapter} / {progress.totalChapters} chapters
            </div>
          </div>
        </div>

        <div className="hub-main-grid">
          <div className="hub-cards-calm">
            <Link className="hub-card hub-card-featured hub-card-featured-calm" href="/hub/read">
              <div className="hub-card-accent" />
              <div className="featured-content">
                <div className="hub-card-icon">📖</div>
                <div className="hub-card-tag">Primary Experience</div>
                <h2 className="hub-card-title">
                  Open
                  <br />
                  <em>the Reader</em>
                </h2>
                <p className="hub-card-desc">
                  Enter through the chapter guide, pick a meditation, and read in a quieter
                  full-screen space that remembers where you left off.
                </p>
                <span className="hub-card-action">
                  Open Reader <span className="hub-card-action-arrow">→</span>
                </span>
              </div>
            </Link>

            <div
              className="hub-card hub-card-compact"
              onClick={handleDownload}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDownload() }}
              role="button"
              tabIndex={0}
            >
              <div className="hub-card-accent" />
              <div className="hub-card-icon">⬇</div>
              <div className="hub-card-tag">Take It With You</div>
              <h2 className="hub-card-title">
                Download
                <br />
                <em>the PDF</em>
              </h2>
              <p className="hub-card-desc">
                Keep the full book with you for offline reading, printing, or slower mornings away
                from the screen.
              </p>
              <button className="hub-card-action" type="button">
                Download Now <span className="hub-card-action-arrow">→</span>
              </button>
            </div>

            <Link className="hub-card hub-card-compact" href="/hub/listen">
              <div className="hub-card-accent" />
              <div className="hub-card-icon">🎧</div>
              <div className="hub-card-tag">Spoken Companion</div>
              <h2 className="hub-card-title">
                Listen
                <br />
                <em>&amp; Reflect</em>
              </h2>
              <p className="hub-card-desc">
                Move through the meditations by ear when reading is not the form the day is asking
                for.
              </p>
              <span className="hub-card-action">
                Listen Now <span className="hub-card-action-arrow">→</span>
              </span>
            </Link>
          </div>

          <div className="hub-side-stack">
            <div className="hub-note-card">
              <div className="hub-note-label">Today&apos;s Passage</div>
              <p className="hub-note-quote">
                &quot;The seed does not argue with the season. It waits through darkness, through
                stillness, through unseen growth.&quot;
              </p>
              <div className="hub-note-meta">Chapter 67</div>
            </div>

            <div className="hub-secondary-calm">
              <div className="hub-secondary-inner-calm">
                <Link className="hub-card-sm" href="/hub/guide">
                  <div className="hub-sm-icon">✦</div>
                  <div className="hub-sm-title">Chapter Guide</div>
                  <div className="hub-sm-desc">
                    Browse the full sequence and enter at the meditation that matches the moment.
                  </div>
                  <span className="hub-sm-link">Explore Guide →</span>
                </Link>

                <Link className="hub-card-sm" href="/hub/journal">
                  <div className="hub-sm-icon">✍</div>
                  <div className="hub-sm-title">Reflection Journal</div>
                  <div className="hub-sm-desc">
                    Keep private notes, prompts, and reflections alongside your reading.
                  </div>
                  <span className="hub-sm-link">Open Journal →</span>
                </Link>

                <div
                  className="hub-card-sm"
                  onClick={handleShare}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleShare() }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="hub-sm-icon">⟳</div>
                  <div className="hub-sm-title">Share the Book</div>
                  <div className="hub-sm-desc">
                    Copy the access link and offer the book to someone else who may need it.
                  </div>
                  <button className="hub-sm-link" type="button">
                    Copy Link →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hub-footer hub-footer-calm">
          <div className="hub-footer-copy">© 2025 Jay Burgess · Revuity Systems · All rights reserved</div>
          <div className="hub-footer-links">
            <Link className="hub-footer-link" href="/">
              Book Home
            </Link>
            <button
              className="hub-footer-link"
              onClick={() => showToast('Contact: jay@revuitysystems.com')}
              type="button"
            >
              Contact
            </button>
            <button className="hub-footer-link" type="button">
              Privacy
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
