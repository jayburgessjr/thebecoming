import { Link, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
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
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const chapter = chapters[chapterIndex]
  const hasPrev = chapterIndex > 0
  const hasNext = chapterIndex < chapters.length - 1

  useEffect(() => {
    let active = true
    const loadAudio = async () => {
      setIsLoading(true)
      setHasError(false)
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        const response = await fetch(
          `${supabaseUrl}/functions/v1/audio/${chapterIndex + 1}`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          }
        )

        if (!response.ok) throw new Error(`Audio fetch failed: ${response.status}`)

        const blob = await response.blob()
        if (active) {
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
        }
      } catch (err) {
        console.error('Audio load error:', err)
        if (active) setHasError(true)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadAudio()
    return () => {
      active = false
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [chapterIndex])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      setIsLoading(true)
      audio.play().catch(() => { setIsLoading(false); setHasError(true) })
    }
  }, [isPlaying])

  const seekByRatio = useCallback((clientX: number, element: HTMLDivElement) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = element.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
  }, [duration])

  const seekMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    seekByRatio(e.clientX, e.currentTarget)
  }, [seekByRatio])

  const seekTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    seekByRatio(e.touches[0].clientX, e.currentTarget)
  }, [seekByRatio])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasNext) navigate(`/hub/listen/${chapterIndex + 2}`)
      if (e.key === 'ArrowLeft' && hasPrev) navigate(`/hub/listen/${chapterIndex}`)
      if (e.key === 'Escape') navigate('/hub/listen')
      if (e.key === ' ') { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [chapterIndex, hasPrev, hasNext, navigate, togglePlay])

  return (
    <div className="flex h-screen flex-col bg-background" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Book progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-border">
        <div
          className="h-full bg-primary-foreground transition-all duration-300"
          style={{ width: `${((chapterIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>

      {/* Nav bar */}
      <header className="shrink-0 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2 md:px-6">
          <Link
            to="/hub/listen"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent"
            aria-label="Close player"
          >
            ←
          </Link>
          <span className="text-xs tabular-nums text-muted-foreground">
            {chapterIndex + 1} <span className="opacity-50">/</span> {chapters.length}
          </span>
          <Link
            to="/hub/listen"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent"
            aria-label="Close player"
          >
            ✕
          </Link>
        </div>
      </header>

      {/* Player — fills remaining space, centered */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8">
        {/* Chapter info */}
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {chapter.num === 'Meditation' || chapter.num === 'Final Meditation' || chapter.num === 'Final'
              ? chapter.num
              : `Chapter ${chapter.num}`}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            {chapter.title}
          </h1>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          preload="none"
          onPlay={() => { setIsPlaying(true); setIsLoading(false) }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            if (hasNext) navigate(`/hub/listen/${chapterIndex + 2}`)
          }}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => { setHasError(true); setIsLoading(false); setIsPlaying(false) }}
        />

        {hasError ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">Unable to load audio. Please try again.</p>
            <button
              type="button"
              onClick={() => { setHasError(false); setAudioUrl(null) }}
              className="rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex w-full max-w-sm flex-col items-center gap-8 md:max-w-md">
            {/* Controls row: prev + play + next */}
            <div className="flex items-center gap-8">
              {/* Prev chapter */}
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => hasPrev && navigate(`/hub/listen/${chapterIndex}`)}
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent disabled:opacity-25"
                aria-label="Previous chapter"
              >
                ⏮
              </button>

              {/* Play / pause */}
              <button
                type="button"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlay}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card shadow-md transition-all hover:bg-accent hover:shadow-lg active:scale-95"
              >
                {isLoading ? (
                  <span className="audio-spinner" />
                ) : isPlaying ? (
                  <span className="text-2xl text-foreground">❚❚</span>
                ) : (
                  <span className="ml-1.5 text-2xl text-foreground">▶</span>
                )}
              </button>

              {/* Next chapter */}
              <button
                type="button"
                disabled={!hasNext}
                onClick={() => hasNext && navigate(`/hub/listen/${chapterIndex + 2}`)}
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent disabled:opacity-25"
                aria-label="Next chapter"
              >
                ⏭
              </button>
            </div>

            {/* Progress scrubber — large touch hit area */}
            <div className="w-full">
              <div
                className="seek-hit relative w-full cursor-pointer"
                onClick={seekMouse}
                onTouchStart={seekTouch}
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(currentTime)}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                tabIndex={0}
              >
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary-foreground transition-all"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Attribution */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Narrated by Jay Burgess</p>
              <p className="mt-1 hidden text-xs text-muted-foreground/50 md:block">
                Space to play · ← → to navigate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
