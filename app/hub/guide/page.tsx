import { ChapterGuide } from '@/components/chapter-guide'
import { SessionGuard } from '@/components/session-guard'

export default function GuidePage() {
  return (
    <SessionGuard>
      <ChapterGuide />
    </SessionGuard>
  )
}
