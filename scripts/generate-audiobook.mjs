/**
 * generate-audiobook.mjs
 *
 * Generates a full audiobook MP3 for The Way of Becoming.
 * Calls ElevenLabs for each chapter, saves individual MP3s, then
 * concatenates them into a single file using ffmpeg.
 *
 * Prerequisites:
 *   - ffmpeg installed: brew install ffmpeg
 *   - .env.local with ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID
 *
 * Usage:
 *   node scripts/generate-audiobook.mjs
 *
 * Output:
 *   audiobook/chapters/01-introduction.mp3  (one per chapter)
 *   audiobook/the-way-of-becoming.mp3       (full concatenated audiobook)
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// ── Load env ────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) throw new Error('Missing .env.local')
  const raw = fs.readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of raw.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  }
  return env
}

// ── Strip HTML ───────────────────────────────────────────────────────────────
function stripHtml(html) {
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

// ── Split text into chunks under ElevenLabs limit (4500 chars safe) ─────────
function splitIntoChunks(text, maxChars = 4500) {
  if (text.length <= maxChars) return [text]
  const chunks = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let current = ''
  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > maxChars && current) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? current + ' ' + sentence : sentence
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

// ── Call ElevenLabs TTS ──────────────────────────────────────────────────────
async function generateAudio(text, apiKey, voiceId) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  )
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`ElevenLabs error ${response.status}: ${err}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// ── Sleep helper for rate limiting ───────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv()
  const apiKey = env.ELEVENLABS_API_KEY
  const voiceId = env.ELEVENLABS_VOICE_ID || '182YJYGB0Qji4K7DTulT'

  if (!apiKey) throw new Error('ELEVENLABS_API_KEY missing from .env.local')

  // Load chapters via dynamic import (they're TS — use compiled JSON instead)
  // We'll read chapters from a JSON export or parse the TS file directly
  const chaptersPath = path.join(ROOT, 'src', 'content', 'chapters.ts')
  const raw = fs.readFileSync(chaptersPath, 'utf8')
  // Extract the array literal from the TS file
  const match = raw.match(/export const chapters[^=]+=\s*(\[[\s\S]*\]);?\s*$/)
  if (!match) throw new Error('Could not parse chapters.ts')
  const chapters = JSON.parse(match[1].replace(/,\s*\]/, ']'))

  // Set up output dirs
  const outDir = path.join(ROOT, 'audiobook')
  const chaptersDir = path.join(outDir, 'chapters')
  fs.mkdirSync(chaptersDir, { recursive: true })

  console.log(`\n📖 The Way of Becoming — Audiobook Generator`)
  console.log(`   ${chapters.length} chapters · Voice: ${voiceId}\n`)

  const generatedFiles = []
  let skipped = 0

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i]
    const label = `${String(i + 1).padStart(2, '0')}-${chapter.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
    const outFile = path.join(chaptersDir, `${label}.mp3`)

    if (fs.existsSync(outFile)) {
      console.log(`  ✓ [${i + 1}/${chapters.length}] ${chapter.title} (cached)`)
      generatedFiles.push(outFile)
      skipped++
      continue
    }

    const bodyText = stripHtml(chapter.body)
    const fullText = `Chapter ${chapter.num}. ${chapter.title}.\n\n${bodyText}`
    const chunks = splitIntoChunks(fullText)

    console.log(`  ⟳ [${i + 1}/${chapters.length}] ${chapter.title} (${chunks.length} chunk${chunks.length > 1 ? 's' : ''}, ${fullText.length} chars)`)

    const buffers = []
    for (let c = 0; c < chunks.length; c++) {
      if (chunks.length > 1) process.stdout.write(`      chunk ${c + 1}/${chunks.length}...`)
      try {
        const buf = await generateAudio(chunks[c], apiKey, voiceId)
        buffers.push(buf)
        if (chunks.length > 1) console.log(' ✓')
        await sleep(500) // be gentle with the API between chunks
      } catch (err) {
        if (chunks.length > 1) console.log(' ✗')
        throw err
      }
    }

    const combined = Buffer.concat(buffers)
    fs.writeFileSync(outFile, combined)
    generatedFiles.push(outFile)

    // Rate limiting — 1s between chapters
    if (i < chapters.length - 1) await sleep(1000)
  }

  console.log(`\n  ${generatedFiles.length - skipped} generated, ${skipped} cached\n`)

  // Concatenate with ffmpeg
  const listFile = path.join(outDir, 'filelist.txt')
  const finalFile = path.join(outDir, 'the-way-of-becoming.mp3')

  fs.writeFileSync(
    listFile,
    generatedFiles.map((f) => `file '${f}'`).join('\n')
  )

  console.log(`🔗 Concatenating ${generatedFiles.length} files...`)
  try {
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${finalFile}"`,
      { stdio: 'inherit' }
    )
    fs.unlinkSync(listFile)
    const sizeMb = (fs.statSync(finalFile).size / 1024 / 1024).toFixed(1)
    console.log(`\n✅ Done! ${finalFile} (${sizeMb} MB)\n`)
  } catch {
    console.error('\n❌ ffmpeg failed. Install it with: brew install ffmpeg')
    console.log(`   Individual chapter files are in: ${chaptersDir}\n`)
  }
}

main().catch((err) => {
  console.error('\n❌', err.message)
  process.exit(1)
})
