import { type NextRequest, NextResponse } from 'next/server'

import { chapters } from '@/content/chapters'

function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ chapter: string }> }
) {
  const { chapter: chapterParam } = await params
  const chapterIndex = parseInt(chapterParam, 10) - 1

  if (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= chapters.length) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? '182YJYGB0Qji4K7DTulT'

  if (!apiKey) {
    return NextResponse.json({ error: 'Audio service not configured' }, { status: 500 })
  }

  const chapter = chapters[chapterIndex]
  const bodyText = stripHtml(chapter.body)
  const fullText = `Chapter ${chapter.num}. ${chapter.title}.\n\n${bodyText}`

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: fullText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  )

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Audio generation failed' },
      { status: response.status }
    )
  }

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
