'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useToast } from '@/components/toast-provider'
import { chapters } from '@/content/chapters'
import { writeReaderProgress } from '@/lib/session'

export function ReaderPage({ chapterIndex }: { chapterIndex: number }) {
  const router = useRouter()
  const { showToast } = useToast()
  const bodyRef = useRef<HTMLDivElement>(null)
  const hasPrevious = chapterIndex > 0
  const hasNext = chapterIndex < chapters.length - 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    writeReaderProgress({
      currentChapter: chapterIndex + 1,
      totalChapters: chapters.length,
    })
  }, [chapterIndex])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        if (chapterIndex < chapters.length - 1) {
          router.push(`/hub/read/${chapterIndex + 2}`)
        } else {
          showToast('You have reached the end. Begin again.')
        }
      }

      if (event.key === 'ArrowLeft') {
        if (chapterIndex > 0) {
          router.push(`/hub/read/${chapterIndex}`)
        }
      }

      if (event.key === 'Escape') {
        router.push('/hub/read')
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [chapterIndex, router, showToast])

  const chapter = chapters[chapterIndex]

  return (
    <main className="reader-page">
      <div className="reader-progress-bar">
        <div
          className="reader-progress-inner"
          id="reader-progress"
          style={{ width: `${((chapterIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>
      <div className="reader-nav">
        <div className="reader-title">The Way of Becoming — Jay Burgess</div>
        <div className="reader-controls">
          <div className="reader-chapter-nav">
            <button
              className="reader-btn"
              disabled={!hasPrevious}
              onClick={() => {
                if (hasPrevious) {
                  router.push(`/hub/read/${chapterIndex}`)
                }
              }}
              type="button"
            >
              ←
            </button>
            <span id="chapter-indicator">
              {chapterIndex + 1} / {chapters.length}
            </span>
            <button
              className="reader-btn"
              disabled={!hasNext}
              onClick={() => {
                if (hasNext) {
                  router.push(`/hub/read/${chapterIndex + 2}`)
                } else {
                  showToast('You have reached the end. Begin again.')
                }
              }}
              type="button"
            >
              →
            </button>
          </div>
          <Link className="reader-close" href="/hub/read">
            ✕ Close
          </Link>
        </div>
      </div>
      <div className="reader-body" id="reader-body" ref={bodyRef}>
        <div className="reader-content" id="reader-content">
          <div className="reader-chapter-label">Chapter {chapter.num}</div>
          <div className="reader-chapter-title">{chapter.title}</div>
          <div className="reader-text" dangerouslySetInnerHTML={{ __html: chapter.body }} />
          <div className="reader-footer-nav">
            <button
              className="btn btn-outline reader-footer-btn"
              disabled={!hasPrevious}
              onClick={() => {
                if (hasPrevious) {
                  router.push(`/hub/read/${chapterIndex}`)
                }
              }}
              type="button"
            >
              ← Back
            </button>
            <button
              className="btn btn-gold reader-footer-btn"
              disabled={!hasNext}
              onClick={() => {
                if (hasNext) {
                  router.push(`/hub/read/${chapterIndex + 2}`)
                } else {
                  showToast('You have reached the end. Begin again.')
                }
              }}
              type="button"
            >
              Next →
            </button>
          </div>
          <div className="reader-page-footer">
            <div className="reader-page-footer-copy">
              © 2025 Jay Burgess · Revuity Systems · All rights reserved
            </div>
            <div className="reader-page-footer-links">
              <Link className="reader-page-footer-link" href="/hub/read">
                Chapter Guide
              </Link>
              <Link className="reader-page-footer-link" href="/hub">
                Access Hub
              </Link>
              <Link className="reader-page-footer-link" href="/">
                Book Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
