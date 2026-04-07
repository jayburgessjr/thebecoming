'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { chapters } from '@/content/chapters'

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayerPage({ chapterIndex }: { chapterIndex: number }) {
  return <AudioPlayerPageContent chapterIndex={chapterIndex} key={chapterIndex} />
}

function AudioPlayerPageContent({ chapterIndex }: { chapterIndex: number }) {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)

  const chapter = chapters[chapterIndex]
  const hasPrev = chapterIndex > 0
  const hasNext = chapterIndex < chapters.length - 1

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      setIsLoading(true)
      audio.play().catch(() => {
        setIsLoading(false)
        setHasError(true)
      })
    }
  }, [isPlaying])

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current
      if (!audio || !duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      audio.currentTime = ratio * duration
    },
    [duration]
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasNext) router.push(`/hub/listen/${chapterIndex + 2}`)
      if (e.key === 'ArrowLeft' && hasPrev) router.push(`/hub/listen/${chapterIndex}`)
      if (e.key === 'Escape') router.push('/hub/listen')
      if (e.key === ' ') { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [chapterIndex, hasPrev, hasNext, router, togglePlay])

  return (
    <main className="reader-page">
      <div className="reader-progress-bar">
        <div
          className="reader-progress-inner"
          style={{ width: `${((chapterIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>

      <div className="reader-nav">
        <div className="reader-title">The Way of Becoming — Jay Burgess</div>
        <div className="reader-controls">
          <div className="reader-chapter-nav">
            <button
              className="reader-btn"
              disabled={!hasPrev}
              onClick={() => hasPrev && router.push(`/hub/listen/${chapterIndex}`)}
              type="button"
            >
              ←
            </button>
            <span>{chapterIndex + 1} / {chapters.length}</span>
            <button
              className="reader-btn"
              disabled={!hasNext}
              onClick={() => hasNext && router.push(`/hub/listen/${chapterIndex + 2}`)}
              type="button"
            >
              →
            </button>
          </div>
          <Link className="reader-close" href="/hub/listen">
            ✕ Close
          </Link>
        </div>
      </div>

      <div className="reader-body">
        <div className="reader-content audio-content">
          <div className="reader-chapter-label">Chapter {chapter.num}</div>
          <div className="reader-chapter-title">{chapter.title}</div>

          {/* Hidden native audio element */}
          <audio
            ref={audioRef}
            src={`/api/audio/${chapterIndex + 1}`}
            onPlay={() => { setIsPlaying(true); setIsLoading(false) }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false)
              if (hasNext) router.push(`/hub/listen/${chapterIndex + 2}`)
            }}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onError={() => { setHasError(true); setIsLoading(false); setIsPlaying(false) }}
            preload="none"
          />

          {/* Audio Player UI */}
          <div className="audio-player">
            <div className="audio-player-ornament">
              <span className="audio-player-ornament-line" />
              <span className="audio-player-ornament-glyph">♪</span>
              <span className="audio-player-ornament-line" />
            </div>

            {hasError ? (
              <div className="audio-error">
                Unable to generate audio. Please try again later.
              </div>
            ) : (
              <>
                <button
                  className={`audio-play-btn${isLoading ? ' audio-play-btn--loading' : ''}`}
                  onClick={togglePlay}
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isLoading ? (
                    <span className="audio-spinner" />
                  ) : isPlaying ? (
                    <span className="audio-icon">❚❚</span>
                  ) : (
                    <span className="audio-icon audio-icon--play">▶</span>
                  )}
                </button>

                <div className="audio-progress-wrap">
                  <div
                    className="audio-progress-track"
                    onClick={seek}
                    role="slider"
                    aria-label="Seek"
                    aria-valuenow={Math.round(currentTime)}
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration)}
                    tabIndex={0}
                  >
                    <div
                      className="audio-progress-fill"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                    <div
                      className="audio-progress-thumb"
                      style={{ left: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                  </div>
                  <div className="audio-time">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="audio-narrator">Narrated by Jay Burgess</div>
                <div className="audio-hint">Space to play · ← → to navigate</div>
              </>
            )}
          </div>

          <div className="reader-footer-nav">
            <button
              className="btn btn-outline reader-footer-btn"
              disabled={!hasPrev}
              onClick={() => hasPrev && router.push(`/hub/listen/${chapterIndex}`)}
              type="button"
            >
              ← Back
            </button>
            <button
              className="btn btn-gold reader-footer-btn"
              disabled={!hasNext}
              onClick={() => hasNext && router.push(`/hub/listen/${chapterIndex + 2}`)}
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
              <Link className="reader-page-footer-link" href="/hub/listen">
                Audio Library
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
