import { notFound } from 'next/navigation'

import { ReaderPage } from '@/components/reader-page'
import { SessionGuard } from '@/components/session-guard'
import { chapters } from '@/content/chapters'

export default function ChapterPage({
  params,
}: {
  params: { chapter: string }
}) {
  const chapterNumber = Number.parseInt(params.chapter, 10)

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > chapters.length) {
    notFound()
  }

  return (
    <SessionGuard>
      <ReaderPage chapterIndex={chapterNumber - 1} />
    </SessionGuard>
  )
}
