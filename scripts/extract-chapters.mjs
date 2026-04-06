import fs from 'node:fs/promises'

import { PDFParse } from 'pdf-parse'

const inputPath = process.argv[2] ?? 'The Way of Becoming by Jay Burgess (1).pdf'
const outputPath = process.argv[3] ?? 'content/chapters.ts'

function parseHeading(heading) {
  const numberedMatch = heading.match(/^(\d+)\.\s+(.+)$/)

  if (numberedMatch) {
    return {
      num: numberedMatch[1],
      title: numberedMatch[2],
    }
  }

  if (heading === 'Introduction') {
    return {
      num: 'Introduction',
      title: 'Introduction',
    }
  }

  if (heading.startsWith('Meditation on ')) {
    return {
      num: 'Meditation',
      title: heading.slice('Meditation on '.length),
    }
  }

  if (heading.startsWith('Final Meditation: ')) {
    return {
      num: 'Final Meditation',
      title: heading.slice('Final Meditation: '.length),
    }
  }

  if (heading === 'Final Breath-Line') {
    return {
      num: 'Final',
      title: 'Breath-Line',
    }
  }

  return {
    num: heading,
    title: heading,
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function normalizeLine(line) {
  return line
    .replaceAll('themore profoundr wisdom', 'the more profound wisdom')
    .replaceAll('themore profoundr', 'the more profound')
    .replaceAll('The world is born again.', 'the world is born again.')
}

function lowercaseWrappedLead(line) {
  return line.replace(
    /^(You|The|A|An|And|But|Or|To|It|Of|In|On|At|For|With|Without|Because|That)\b/,
    (match) => match.toLowerCase(),
  )
}

function shouldJoinWrapped(current, next) {
  const trimmed = current.trim()

  if (!trimmed) return false
  if (/[,;:]$/.test(trimmed)) return true
  if (/—$/.test(trimmed)) return true
  if (/[.!?]"?$/.test(trimmed)) return false
  if (/,$/.test(trimmed)) return true
  if (/^[a-z(]/.test(next)) return true
  if (/^(You|The|A|An|And|But|Or|To|It|Of|In|On|At|For|With|Without|Because|That)\b/.test(next)) {
    return true
  }
  if (trimmed.split(/\s+/).length >= 8) return true

  return false
}

function mergeWrappedLines(lines) {
  const merged = []
  let current = ''

  const flush = () => {
    const trimmed = current.trim()
    if (trimmed) {
      merged.push(trimmed)
    }
    current = ''
  }

  for (const rawLine of lines) {
    const line = normalizeLine(rawLine)

    if (!current) {
      current = line
      continue
    }

    if (shouldJoinWrapped(current, line)) {
      const nextLine = /[,;:]$/.test(current.trim()) ? lowercaseWrappedLead(line) : line
      current = `${current} ${nextLine}`
      continue
    }

    flush()
    current = line
  }

  flush()

  return merged
}

function isStandaloneLine(line) {
  const words = line.split(/\s+/).filter(Boolean)

  if (line.endsWith(':') || line.endsWith('—')) return true
  if (line.startsWith('"') || line.startsWith("'")) return true
  if (words.length <= 3) return true
  if (line.length <= 28) return true

  return false
}

function unitsToParagraphs(lines) {
  const paragraphs = []
  let current = []

  const flush = () => {
    if (current.length) {
      paragraphs.push(current.join(' '))
      current = []
    }
  }

  for (const line of lines) {
    const previous = current[current.length - 1]
    const nextWouldOverflow = current.join(' ').length + line.length > 240

    if (!current.length) {
      current.push(line)
      if (isStandaloneLine(line) && !line.endsWith(':') && !line.endsWith('—')) {
        flush()
      }
      continue
    }

    if (previous.endsWith(':') || previous.endsWith('—')) {
      current.push(lowercaseWrappedLead(line))
      flush()
      continue
    }

    if (isStandaloneLine(line)) {
      if (current.length >= 2 || nextWouldOverflow) {
        flush()
        current.push(line)
      } else {
        current.push(line)
      }

      if (!line.endsWith(':') && !line.endsWith('—')) {
        flush()
      }
      continue
    }

    current.push(line)

    if (current.length >= 3 || nextWouldOverflow) {
      flush()
    }
  }

  flush()

  return paragraphs
}

function linesToHtml(lines) {
  const mergedLines = mergeWrappedLines(lines)
  const paragraphs = unitsToParagraphs(mergedLines)

  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')
}

async function main() {
  const data = await fs.readFile(inputPath)
  const parser = new PDFParse({ data })
  const result = await parser.getText({ parsePageInfo: true })
  await parser.destroy()

  const chapters = result.pages
    .slice(1)
    .map((page) => page.text.split('\n').map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      const [heading, ...bodyLines] = lines
      const meta = parseHeading(heading)

      return {
        num: meta.num,
        title: meta.title,
        body: linesToHtml(bodyLines),
      }
    })

  const output = `import type { Chapter } from '@/lib/types'\n\nexport const chapters: Chapter[] = ${JSON.stringify(
    chapters,
    null,
    2,
  )}\n`

  await fs.writeFile(outputPath, output)
  console.log(`Wrote ${chapters.length} chapters to ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
