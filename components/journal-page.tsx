'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useToast } from '@/components/toast-provider'
import { chapters } from '@/content/chapters'
import { readAccessSession, readJournalEntries, writeJournalEntries } from '@/lib/session'
import type { JournalEntry } from '@/lib/types'

function promptSet(chapterTitle: string) {
  return [
    `What in "${chapterTitle}" feels most alive in your life right now?`,
    `Where are you resisting the lesson of "${chapterTitle}" instead of living it?`,
    `What would change this week if you practiced "${chapterTitle}" more honestly?`,
  ]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function JournalPage() {
  const { showToast } = useToast()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const [chapterIndex, setChapterIndex] = useState(0)
  const [promptIndex, setPromptIndex] = useState(0)
  const [response, setResponse] = useState('')
  const [travelerName, setTravelerName] = useState('Traveler')

  useEffect(() => {
    const session = readAccessSession()
    const storedEntries = readJournalEntries().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    setTravelerName(session?.firstName ?? 'Traveler')
    setEntries(storedEntries)

    if (storedEntries[0]) {
      const firstEntry = storedEntries[0]
      setSelectedEntryId(firstEntry.id)
      setChapterIndex(firstEntry.chapterIndex)
      setPromptIndex(Math.max(0, promptSet(firstEntry.chapterTitle).indexOf(firstEntry.prompt)))
      setResponse(firstEntry.response)
    }
  }, [])

  const safeChapterIndex = Math.min(Math.max(0, chapterIndex), chapters.length - 1)
  const selectedChapter = chapters[safeChapterIndex] ?? chapters[0]
  const prompts = useMemo(() => promptSet(selectedChapter.title), [selectedChapter.title])
  const selectedPrompt = prompts[promptIndex] ?? prompts[0]
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) ?? null

  useEffect(() => {
    const entry = entries.find((e) => e.id === selectedEntryId)
    if (!entry) return

    const clampedIndex = Math.min(Math.max(0, entry.chapterIndex), chapters.length - 1)
    setChapterIndex(clampedIndex)
    setPromptIndex(Math.max(0, promptSet(entry.chapterTitle).indexOf(entry.prompt)))
    setResponse(entry.response)
    // Intentionally omitting `entries` from deps — we only want to repopulate
    // the form when the user *selects* a different entry, not on every save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntryId])

  const handleNewEntry = () => {
    setSelectedEntryId(null)
    setPromptIndex(0)
    setResponse('')
    showToast('New journal entry ready')
  }

  const handleSave = () => {
    const trimmedResponse = response.trim()

    if (!trimmedResponse) {
      showToast('Write a reflection before saving')
      return
    }

    const timestamp = new Date().toISOString()
    const nextEntry: JournalEntry = selectedEntry
      ? {
          ...selectedEntry,
          chapterIndex,
          chapterNum: selectedChapter.num,
          chapterTitle: selectedChapter.title,
          prompt: selectedPrompt,
          response: trimmedResponse,
          updatedAt: timestamp,
        }
      : {
          id: crypto.randomUUID(),
          chapterIndex,
          chapterNum: selectedChapter.num,
          chapterTitle: selectedChapter.title,
          prompt: selectedPrompt,
          response: trimmedResponse,
          createdAt: timestamp,
          updatedAt: timestamp,
        }

    const nextEntries = [nextEntry, ...entries.filter((entry) => entry.id !== nextEntry.id)].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    )

    setEntries(nextEntries)
    setSelectedEntryId(nextEntry.id)
    writeJournalEntries(nextEntries)
    showToast('Journal entry saved')
  }

  const handleDelete = () => {
    if (!selectedEntry) {
      setResponse('')
      return
    }

    const nextEntries = entries.filter((entry) => entry.id !== selectedEntry.id)
    setEntries(nextEntries)
    writeJournalEntries(nextEntries)
    setSelectedEntryId(null)
    setResponse('')
    setPromptIndex(0)
    showToast('Journal entry removed')
  }

  const latestEntry = entries[0]

  return (
    <main className="page-enter journal-page">
      <div className="hub-nav">
        <div className="hub-logo">
          The Way of <span>Becoming</span>
        </div>
        <div className="hub-user">
          <span className="hub-user-name">Reflection Journal</span>
          <div className="hub-user-dot">{travelerName.charAt(0).toUpperCase()}</div>
        </div>
      </div>

      <div className="journal-shell">
        <aside className="journal-sidebar">
          <div className="journal-panel">
            <div className="journal-panel-label">Private Space</div>
            <h1 className="journal-panel-title">
              Write,
              <br />
              <em>{travelerName}</em>
            </h1>
            <p className="journal-panel-copy">
              Reflect on any passage, save your thoughts locally, and return whenever the book asks
              something new of you.
            </p>
            <div className="journal-stats">
              <div className="journal-stat">
                <span className="journal-stat-num">{entries.length}</span>
                <span className="journal-stat-label">Entries</span>
              </div>
              <div className="journal-stat">
                <span className="journal-stat-num">{latestEntry ? formatDate(latestEntry.updatedAt) : '—'}</span>
                <span className="journal-stat-label">Last Saved</span>
              </div>
            </div>
            <div className="journal-sidebar-actions">
              <button className="btn btn-gold journal-action-btn" onClick={handleNewEntry} type="button">
                New Entry
              </button>
              <Link className="btn btn-outline journal-action-btn" href="/hub">
                Back to Hub
              </Link>
            </div>
          </div>

          <div className="journal-panel journal-entries-panel">
            <div className="journal-entries-head">
              <div className="journal-panel-label">Saved Reflections</div>
            </div>
            <div className="journal-entry-list">
              {entries.length === 0 ? (
                <div className="journal-empty-state">No saved reflections yet.</div>
              ) : (
                entries.map((entry) => (
                  <button
                    className={`journal-entry-item${entry.id === selectedEntryId ? ' active' : ''}`}
                    key={entry.id}
                    onClick={() => setSelectedEntryId(entry.id)}
                    type="button"
                  >
                    <span className="journal-entry-meta">
                      {entry.chapterNum} · {entry.chapterTitle}
                    </span>
                    <span className="journal-entry-prompt">{entry.prompt}</span>
                    <span className="journal-entry-date">{formatDate(entry.updatedAt)}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="journal-main">
          <div className="journal-panel journal-editor-panel">
            <div className="journal-form-grid">
              <div className="journal-field">
                <label htmlFor="journal-chapter">Chapter</label>
                <select
                  id="journal-chapter"
                  onChange={(event) => {
                    setSelectedEntryId(null)
                    setChapterIndex(Number(event.target.value))
                    setPromptIndex(0)
                  }}
                  value={chapterIndex}
                >
                  {chapters.map((chapter, index) => (
                    <option key={`${chapter.num}-${chapter.title}-${index}`} value={index}>
                      {chapter.num} · {chapter.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="journal-field">
                <label htmlFor="journal-prompt">Prompt</label>
                <select
                  id="journal-prompt"
                  onChange={(event) => {
                    setSelectedEntryId(null)
                    setPromptIndex(Number(event.target.value))
                  }}
                  value={promptIndex}
                >
                  {prompts.map((prompt, index) => (
                    <option key={prompt} value={index}>
                      Prompt {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="journal-prompt-card">
              <div className="journal-panel-label">Current Prompt</div>
              <p>{selectedPrompt}</p>
            </div>

            <div className="journal-field">
              <label htmlFor="journal-response">Reflection</label>
              <textarea
                id="journal-response"
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Write what the passage is revealing, resisting, or asking of you."
                value={response}
              />
            </div>

            <div className="journal-editor-actions">
              <button className="btn btn-gold journal-action-btn" onClick={handleSave} type="button">
                Save Reflection
              </button>
              <button className="btn btn-outline journal-action-btn" onClick={handleDelete} type="button">
                {selectedEntry ? 'Delete Entry' : 'Clear Draft'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
