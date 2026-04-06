import { ReaderLibrary } from '@/components/reader-library'
import { SessionGuard } from '@/components/session-guard'

export default function ReadPage() {
  return (
    <SessionGuard>
      <ReaderLibrary />
    </SessionGuard>
  )
}
