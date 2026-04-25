import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/toast-provider'
import { LandingPage } from '@/components/landing-page'
import { AccessForm } from '@/components/access-form'
import { HubShell } from '@/components/hub-shell'
import { SessionGuard } from '@/components/session-guard'
import { ChapterGuide } from '@/components/chapter-guide'
import { JournalPage } from '@/components/journal-page'
import { AudioLibrary } from '@/components/audio-library'
import { ReaderLibrary } from '@/components/reader-library'
import { AudioPlayerPage } from '@/components/audio-player-page'
import { ReaderPage } from '@/components/reader-page'
import { chapters } from '@/content/chapters'

function ListenChapterWrapper() {
  const { chapter } = useParams<{ chapter: string }>()
  const chapterNumber = Number.parseInt(chapter || '', 10)

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > chapters.length) {
    return <Navigate to="/hub/listen" replace />
  }

  return <AudioPlayerPage chapterIndex={chapterNumber - 1} />
}

function ReadChapterWrapper() {
  const { chapter } = useParams<{ chapter: string }>()
  const chapterNumber = Number.parseInt(chapter || '', 10)

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > chapters.length) {
    return <Navigate to="/hub/read" replace />
  }

  return <ReaderPage chapterIndex={chapterNumber - 1} />
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/access" element={<AccessForm />} />
            
            <Route path="/hub" element={<SessionGuard><HubShell /></SessionGuard>} />
            <Route path="/hub/guide" element={<SessionGuard><ChapterGuide /></SessionGuard>} />
            <Route path="/hub/journal" element={<SessionGuard><JournalPage /></SessionGuard>} />
            <Route path="/hub/listen" element={<SessionGuard><AudioLibrary /></SessionGuard>} />
            <Route path="/hub/read" element={<SessionGuard><ReaderLibrary /></SessionGuard>} />
            
            <Route path="/hub/listen/:chapter" element={<SessionGuard><ListenChapterWrapper /></SessionGuard>} />
            <Route path="/hub/read/:chapter" element={<SessionGuard><ReadChapterWrapper /></SessionGuard>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
