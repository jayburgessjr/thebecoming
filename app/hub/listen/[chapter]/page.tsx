import { notFound } from 'next/navigation'

import { AudioPlayerPage } from '@/components/audio-player-page'
import { SessionGuard } from '@/components/session-guard'
import { chapters } from '@/content/chapters'

export default async function ListenChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>
}) {
  const { chapter } = await params
  const chapterNumber = Number.parseInt(chapter, 10)

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > chapters.length) {
    notFound()
  }

  return (
    <SessionGuard>
      <AudioPlayerPage chapterIndex={chapterNumber - 1} />
    </SessionGuard>
  )
}
