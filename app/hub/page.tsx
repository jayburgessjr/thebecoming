import { HubShell } from '@/components/hub-shell'
import { SessionGuard } from '@/components/session-guard'

export default function HubPage() {
  return (
    <SessionGuard>
      <HubShell />
    </SessionGuard>
  )
}
