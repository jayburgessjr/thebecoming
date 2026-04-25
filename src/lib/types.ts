export type Chapter = {
  num: string
  title: string
  body: string
}

export type AccessSession = {
  firstName: string
  fullName: string
  initials: string
  email?: string
}

export type ReaderProgress = {
  currentChapter: number
  totalChapters: number
}

export type JournalEntry = {
  id: string
  chapterIndex: number
  chapterNum: string
  chapterTitle: string
  prompt: string
  response: string
  createdAt: string
  updatedAt: string
}
