import { AudioLibrary } from '@/components/audio-library'
import { SessionGuard } from '@/components/session-guard'

export default function ListenPage() {
  return (
    <SessionGuard>
      <AudioLibrary />
    </SessionGuard>
  )
}
