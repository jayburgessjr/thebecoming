import { JournalPage } from '@/components/journal-page'
import { SessionGuard } from '@/components/session-guard'

export default function HubJournalPage() {
  return (
    <SessionGuard>
      <JournalPage />
    </SessionGuard>
  )
}
