import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { BottomNav } from '@/components/bottom-nav'
import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
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
  const [showEntries, setShowEntries] = useState(false)

  useEffect(() => {
    const session = readAccessSession()
    const storedEntries = readJournalEntries().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    setTravelerName(session?.firstName ?? 'Traveler')
    setEntries(storedEntries)
    if (storedEntries[0]) {
      const first = storedEntries[0]
      setSelectedEntryId(first.id)
      setChapterIndex(first.chapterIndex)
      setPromptIndex(Math.max(0, promptSet(first.chapterTitle).indexOf(first.prompt)))
      setResponse(first.response)
    }
  }, [])

  const safeChapterIndex = Math.min(Math.max(0, chapterIndex), chapters.length - 1)
  const selectedChapter = chapters[safeChapterIndex] ?? chapters[0]
  const prompts = useMemo(() => promptSet(selectedChapter.title), [selectedChapter.title])
  const selectedPrompt = prompts[promptIndex] ?? prompts[0]
  const selectedEntry = entries.find((e) => e.id === selectedEntryId) ?? null

  useEffect(() => {
    const entry = entries.find((e) => e.id === selectedEntryId)
    if (!entry) return
    const clampedIndex = Math.min(Math.max(0, entry.chapterIndex), chapters.length - 1)
    setChapterIndex(clampedIndex)
    setPromptIndex(Math.max(0, promptSet(entry.chapterTitle).indexOf(entry.prompt)))
    setResponse(entry.response)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntryId])

  const handleNewEntry = () => {
    setSelectedEntryId(null)
    setPromptIndex(0)
    setResponse('')
    setShowEntries(false)
    showToast('New journal entry ready')
  }

  const handleSave = () => {
    const trimmed = response.trim()
    if (!trimmed) { showToast('Write a reflection before saving'); return }
    const timestamp = new Date().toISOString()
    const nextEntry: JournalEntry = selectedEntry
      ? { ...selectedEntry, chapterIndex, chapterNum: selectedChapter.num, chapterTitle: selectedChapter.title, prompt: selectedPrompt, response: trimmed, updatedAt: timestamp }
      : { id: crypto.randomUUID(), chapterIndex, chapterNum: selectedChapter.num, chapterTitle: selectedChapter.title, prompt: selectedPrompt, response: trimmed, createdAt: timestamp, updatedAt: timestamp }
    const next = [nextEntry, ...entries.filter((e) => e.id !== nextEntry.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    setEntries(next)
    setSelectedEntryId(nextEntry.id)
    writeJournalEntries(next)
    showToast('Journal entry saved')
  }

  const handleDelete = () => {
    if (!selectedEntry) { setResponse(''); return }
    const next = entries.filter((e) => e.id !== selectedEntry.id)
    setEntries(next)
    writeJournalEntries(next)
    setSelectedEntryId(null)
    setResponse('')
    setPromptIndex(0)
    showToast('Journal entry removed')
  }

  const latestEntry = entries[0]

  return (
    <div className="min-h-screen bg-background nav-offset">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <span className="font-display text-sm font-semibold text-foreground">Reflection Journal</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Entries toggle — mobile only */}
            <button
              type="button"
              onClick={() => setShowEntries(!showEntries)}
              className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-accent md:hidden"
            >
              {showEntries ? '← Write' : `Entries (${entries.length})`}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {travelerName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

          {/* Sidebar — shown via toggle on mobile, always on desktop */}
          <aside className={`flex flex-col gap-4 ${showEntries ? 'block' : 'hidden'} lg:flex`}>
            {/* Info panel */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Private Space</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
                  Write, <em className="font-normal italic text-primary-foreground">{travelerName}</em>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Reflect on any passage and save your thoughts locally.
                </p>

                <div className="mt-4 flex gap-6 border-t border-border pt-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-foreground">{entries.length}</p>
                    <p className="text-xs text-muted-foreground">Entries</p>
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {latestEntry ? formatDate(latestEntry.updatedAt) : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Saved</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={handleNewEntry}>New Entry</Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/hub">← Hub</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saved entries list */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saved Reflections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {entries.length === 0 ? (
                  <p className="px-5 pb-5 text-xs text-muted-foreground">No saved reflections yet.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {entries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => { setSelectedEntryId(entry.id); setShowEntries(false) }}
                        className={`min-h-[4rem] w-full px-5 py-4 text-left transition-colors hover:bg-accent/40 active:bg-accent/60 ${
                          entry.id === selectedEntryId ? 'bg-accent/60' : ''
                        }`}
                      >
                        <p className="text-xs font-medium text-muted-foreground">
                          {entry.chapterNum} · {entry.chapterTitle}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-foreground">{entry.prompt}</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">{formatDate(entry.updatedAt)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Main editor — always shown on mobile (unless entries open), always on desktop */}
          <main className={`${showEntries ? 'hidden' : 'block'} lg:block`}>
            <Card>
              <CardContent className="p-4 md:p-8">
                {/* Chapter + prompt selectors */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="journal-chapter">Chapter</Label>
                    <select
                      id="journal-chapter"
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={chapterIndex}
                      onChange={(e) => { setSelectedEntryId(null); setChapterIndex(Number(e.target.value)); setPromptIndex(0) }}
                    >
                      {chapters.map((ch, idx) => (
                        <option key={`${ch.num}-${ch.title}-${idx}`} value={idx}>
                          {ch.num} · {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="journal-prompt">Prompt</Label>
                    <select
                      id="journal-prompt"
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={promptIndex}
                      onChange={(e) => { setSelectedEntryId(null); setPromptIndex(Number(e.target.value)) }}
                    >
                      {prompts.map((p, idx) => (
                        <option key={p} value={idx}>Prompt {idx + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prompt card */}
                <Card className="mt-5 border-primary/30 bg-primary/10">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Current Prompt</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">{selectedPrompt}</p>
                  </CardContent>
                </Card>

                {/* Reflection textarea */}
                <div className="mt-5 flex flex-col gap-1.5">
                  <Label htmlFor="journal-response">Reflection</Label>
                  <textarea
                    id="journal-response"
                    rows={8}
                    className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Write what the passage is revealing, resisting, or asking of you."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <Button onClick={handleSave} className="min-h-[3rem] flex-1">Save Reflection</Button>
                  <Button variant="outline" onClick={handleDelete} className="min-h-[3rem]">
                    {selectedEntry ? 'Delete' : 'Clear'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
