'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { chapters } from '@/content/chapters'
import { readAccessSession, readReaderProgress } from '@/lib/session'
import type { AccessSession, ReaderProgress } from '@/lib/types'
import { useToast } from '@/components/toast-provider'

const BOOK_PDF_PATH = '/the-way-of-becoming.pdf'

export function HubShell() {
  const { showToast } = useToast()
  const [session, setSession] = useState<AccessSession | null>(null)
  const [progress, setProgress] = useState<ReaderProgress>({
    currentChapter: 0,
    totalChapters: chapters.length,
  })

  useEffect(() => {
    setSession(readAccessSession())
    setProgress(readReaderProgress(chapters.length))
  }, [])

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
    <main className="page-enter" id="page-hub">
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

      <div className="hub-welcome">
        <div className="hub-welcome-text">
          <div className="hub-greeting">Your Access Portal</div>
          <h1 className="hub-welcome-title">
            Welcome,
            <br />
            <em id="hub-first-name">{session?.firstName ?? 'Traveler'}</em>
          </h1>
          <p className="hub-welcome-sub">The river does not rush. Begin where you are.</p>
        </div>
        <div className="hub-progress">
          <div className="hub-progress-label">Reading Progress</div>
          <div className="hub-progress-bar">
            <div className="hub-progress-fill" id="progress-fill" style={{ width: progressWidth }} />
          </div>
          <div className="hub-progress-num" id="progress-num">
            {progress.currentChapter} / {progress.totalChapters} chapters
          </div>
        </div>
      </div>

      <div className="hub-cards">
        <Link className="hub-card hub-card-featured" href="/hub/read">
          <div className="hub-card-accent" />
          <div className="featured-content">
            <div className="hub-card-icon">📖</div>
            <div className="hub-card-tag">Primary Experience</div>
            <h2 className="hub-card-title">
              Read
              <br />
              <em>Online</em>
            </h2>
            <p className="hub-card-desc">
              The full book in a distraction-free reading environment. Navigate chapter by
              chapter, set your pace, and return exactly where you left off.
            </p>
            <span className="hub-card-action">
              Open Reader <span className="hub-card-action-arrow">→</span>
            </span>
          </div>
          <div className="featured-preview">
            <p>
              Becoming is not a path you walk.
              <br />
              It is the path that walks you.
            </p>
            <p>
              We are taught to chase goals, to carve out identities, to grasp at the future with
              frantic hands.
            </p>
            <p>
              But becoming is not something we achieve.
              <br />
              It is something we allow.
            </p>
          </div>
        </Link>

        <div
          className="hub-card"
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
            A beautifully formatted PDF of the complete book. Save it to your device, print it, or
            read offline on any device at any time.
          </p>
          <button className="hub-card-action" type="button">
            Download Now <span className="hub-card-action-arrow">→</span>
          </button>
        </div>

        <div
          className="hub-card"
          onClick={() => showToast('Audio version coming soon')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') showToast('Audio version coming soon') }}
          role="button"
          tabIndex={0}
        >
          <div className="hub-card-accent" />
          <div className="hub-card-icon">🎧</div>
          <div className="hub-card-tag">Coming Soon</div>
          <h2 className="hub-card-title">
            Listen
            <br />
            <em>&amp; Reflect</em>
          </h2>
          <p className="hub-card-desc">
            The audiobook narrated by Jay Burgess. Meditations read aloud — ideal for morning
            walks, quiet evenings, and moments of stillness.
          </p>
          <button className="hub-card-action" type="button">
            Notify Me <span className="hub-card-action-arrow">→</span>
          </button>
        </div>
      </div>

      <div className="hub-secondary">
        <div className="hub-secondary-inner">
          <div
            className="hub-card-sm"
            onClick={() => showToast('Chapter guide downloaded')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') showToast('Chapter guide downloaded') }}
            role="button"
            tabIndex={0}
          >
            <div className="hub-sm-icon">✦</div>
            <div className="hub-sm-title">Chapter Guide</div>
            <div className="hub-sm-desc">
              A one-page map of all 81 chapters with themes and intentions — perfect for returning
              to specific passages.
            </div>
            <button className="hub-sm-link" type="button">
              Download PDF →
            </button>
          </div>

          <Link className="hub-card-sm" href="/hub/journal">
            <div className="hub-sm-icon">✍</div>
            <div className="hub-sm-title">Reflection Journal</div>
            <div className="hub-sm-desc">
              An interactive journal with chapter-linked prompts. Write alongside your reading and
              save reflections privately in your browser.
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
              Give someone you care about free access. Copy your personal share link and pass it
              forward.
            </div>
            <button className="hub-sm-link" type="button">
              Copy Link →
            </button>
          </div>
        </div>
      </div>

      <div className="hub-meditation">
        <div className="meditation-label">Today&apos;s Passage</div>
        <div className="meditation-line" />
        <div className="meditation-text">
          &quot;The seed does not argue with the season. It does not shout at the earth. It waits
          through darkness, through stillness, through unseen growth. You, too, are growing in
          unseen ways.&quot;
        </div>
        <div className="meditation-line" />
        <div className="meditation-chapter">Chapter 67</div>
      </div>

      <div className="hub-footer">
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
    </main>
  )
}
