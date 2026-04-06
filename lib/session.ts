import type { AccessSession, JournalEntry, ReaderProgress } from '@/lib/types'

export const ACCESS_SESSION_KEY = 'the-way-of-becoming-session'
export const READER_PROGRESS_KEY = 'the-way-of-becoming-progress'
export const JOURNAL_ENTRIES_KEY = 'the-way-of-becoming-journal-entries'

function canUseBrowserStorage() {
  return typeof window !== 'undefined'
}

export function readAccessSession(): AccessSession | null {
  if (!canUseBrowserStorage()) return null

  const raw = window.sessionStorage.getItem(ACCESS_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AccessSession
  } catch {
    return null
  }
}

export function writeAccessSession(session: AccessSession) {
  if (!canUseBrowserStorage()) return
  window.sessionStorage.setItem(ACCESS_SESSION_KEY, JSON.stringify(session))
}

export function clearAccessSession() {
  if (!canUseBrowserStorage()) return
  window.sessionStorage.removeItem(ACCESS_SESSION_KEY)
}

export function readReaderProgress(totalChapters: number): ReaderProgress {
  if (!canUseBrowserStorage()) {
    return { currentChapter: 0, totalChapters }
  }

  const raw = window.sessionStorage.getItem(READER_PROGRESS_KEY)
  if (!raw) {
    return { currentChapter: 0, totalChapters }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ReaderProgress>
    const currentChapter = Number.isFinite(parsed.currentChapter)
      ? Math.max(0, Math.min(parsed.currentChapter as number, totalChapters))
      : 0

    return {
      currentChapter,
      totalChapters,
    }
  } catch {
    return { currentChapter: 0, totalChapters }
  }
}

export function writeReaderProgress(progress: ReaderProgress) {
  if (!canUseBrowserStorage()) return
  window.sessionStorage.setItem(READER_PROGRESS_KEY, JSON.stringify(progress))
}

export function readJournalEntries(): JournalEntry[] {
  if (!canUseBrowserStorage()) return []

  const raw = window.localStorage.getItem(JOURNAL_ENTRIES_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as JournalEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeJournalEntries(entries: JournalEntry[]) {
  if (!canUseBrowserStorage()) return
  window.localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries))
}
