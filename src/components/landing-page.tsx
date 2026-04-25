import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Headphones,
  NotebookPen,
  Quote,
  Sparkles,
} from 'lucide-react'

import { Background } from '@/components/background'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { value: '81', label: 'Meditations to enter anywhere' },
  { value: 'Free', label: 'No paywall at the threshold' },
  { value: 'Audio', label: 'Read aloud chapter by chapter' },
]

const entryways = [
  {
    icon: BookOpen,
    title: 'Read Online',
    description:
      'Move through the book in a calm, full-screen reader built for slow attention rather than skimming.',
  },
  {
    icon: Headphones,
    title: 'Listen Along',
    description:
      'Let each meditation be spoken back to you when the page is not the form your day can hold.',
  },
  {
    icon: NotebookPen,
    title: 'Journal the Echo',
    description:
      'Stay with what a chapter stirs. Guided prompts create a private place to answer it in your own words.',
  },
]

const moments = [
  {
    label: 'For restless mornings',
    title: 'Open at any chapter and let the book choose the pace.',
  },
  {
    label: 'For walks and long drives',
    title: 'Carry the meditations in audio when silence needs a companion.',
  },
  {
    label: 'For evenings that ask reflection',
    title: 'Write with the text instead of moving past it.',
  },
]

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      <Background variant="top" className="relative overflow-hidden border border-border/60 bg-transparent">
        <div className="landing-grid pointer-events-none absolute inset-x-0 top-0 h-[36rem]" />
        <div className="landing-orb absolute left-[-7rem] top-32 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="landing-orb-delayed absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-[oklch(0.9_0.05_54/.45)] blur-3xl" />

        <section className="mx-auto max-w-6xl px-5 pb-14 pt-20 sm:px-6 lg:pb-18 lg:pt-38">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-16">
            <div className="landing-reveal relative z-10 flex flex-col gap-6 sm:gap-8" style={{ animationDelay: '0.08s' }}>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                A digital reading sanctuary
              </div>

              <div className="space-y-4 sm:space-y-5">
                <p className="max-w-xl text-sm uppercase tracking-[0.32em] text-muted-foreground">
                  A book of meditations by Jay Burgess
                </p>
                <h1 className="max-w-3xl font-display text-[2.6rem] font-semibold leading-[0.92] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[6rem]">
                  A quieter
                  <span className="landing-shimmer block bg-gradient-to-r from-foreground via-primary-foreground to-foreground bg-clip-text text-transparent">
                    way inward
                  </span>
                  to becoming.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  A book of meditations for the moments when you need language that steadies rather than shouts. Read by page, listen by voice, or stay long enough to write back.
                </p>
              </div>

              <blockquote className="max-w-xl rounded-[2rem] border border-primary/30 bg-background/65 p-5 shadow-[0_20px_60px_rgba(82,52,23,0.08)] backdrop-blur-sm sm:p-6">
                <Quote className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                <p className="mt-3 font-display text-xl leading-tight text-foreground sm:mt-4 sm:text-3xl">
                  Becoming is not a finish line. It is a way of returning to yourself with more honesty.
                </p>
              </blockquote>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild size="xl" className="min-h-[3.25rem] w-full rounded-full px-7 font-semibold shadow-[0_16px_40px_rgba(171,116,51,0.22)] sm:w-auto">
                  <Link to="/access">
                    Enter the Book
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="min-h-[3.25rem] w-full rounded-full border-border/80 bg-background/70 px-7 backdrop-blur-sm sm:w-auto">
                  <Link to="/hub/guide">Browse the 81 meditations</Link>
                </Button>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="landing-reveal rounded-[1.75rem] border border-border/60 bg-background/72 p-5 shadow-sm backdrop-blur-sm"
                    style={{ animationDelay: `${0.18 + index * 0.1}s` }}
                  >
                    <p className="font-display text-3xl font-semibold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="landing-reveal relative z-10 pt-2 lg:pt-10" style={{ animationDelay: '0.16s' }}>
              <div className="relative mx-auto max-w-[33rem]">
                <div className="absolute inset-0 scale-[1.03] rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-2xl" />
                <Card className="relative overflow-hidden rounded-[2.5rem] border-border/60 bg-[linear-gradient(160deg,rgba(255,252,244,0.88),rgba(249,238,219,0.68))] shadow-[0_30px_90px_rgba(79,51,28,0.14)]">
                  <CardContent className="p-0">
                    <div className="border-b border-border/60 px-7 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                            Opening sequence
                          </p>
                          <h2 className="mt-2 font-display text-4xl font-semibold text-foreground">
                            The Way of Becoming
                          </h2>
                        </div>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/35 bg-background/70 font-display text-3xl text-primary-foreground">
                          ∞
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 p-7">
                      {moments.map((moment, index) => (
                        <div
                          key={moment.label}
                          className="rounded-[1.6rem] border border-border/60 bg-background/70 p-5"
                        >
                          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
                            {String(index + 1).padStart(2, '0')} · {moment.label}
                          </p>
                          <p className="mt-2 text-base leading-7 text-foreground">{moment.title}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="landing-orb-delayed absolute -left-6 bottom-16 hidden w-48 rounded-[2rem] border border-border/60 bg-background/80 p-5 shadow-xl backdrop-blur-sm md:block">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Featured chapter</p>
                  <p className="mt-2 font-display text-2xl leading-none text-foreground">58</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The Endless Becoming
                  </p>
                </div>

                <div className="landing-orb absolute -right-5 top-10 w-56 rounded-[2rem] border border-primary/30 bg-primary/12 p-5 shadow-lg backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Listen mode</p>
                  <p className="mt-2 font-display text-3xl leading-none text-foreground">Narrated in full</p>
                  <p className="mt-3 text-sm leading-6 text-foreground/80">
                    Every meditation can meet the reader by voice as well as by page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Three ways in</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-5xl sm:leading-none">
                Built for reading, listening, and staying with what lands.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Choose the form that meets this moment. The book stays open in more than one way, so you do not have to arrive with the right kind of attention.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {entryways.map((entry, index) => {
              const Icon = entry.icon

              return (
                <Card
                  key={entry.title}
                  className="landing-reveal rounded-[2rem] border-border/60 bg-background/70 shadow-[0_20px_50px_rgba(79,51,28,0.08)] backdrop-blur-sm"
                  style={{ animationDelay: `${0.22 + index * 0.12}s` }}
                >
                  <CardContent className="p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/18 text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-3xl font-semibold text-foreground">
                      {entry.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {entry.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </Background>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Card className="rounded-[2.25rem] border-border/60 bg-[linear-gradient(160deg,rgba(251,247,238,0.95),rgba(246,233,209,0.8))] shadow-[0_24px_70px_rgba(79,51,28,0.1)]">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">A place to return</p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-foreground sm:text-5xl sm:leading-none">
                Come back in the form you need.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                Some days ask for a chapter on the page. Some ask for a voice in your headphones. Some ask for a quiet prompt and a blank field. The book is built to meet all three.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              'Enter any chapter without needing to follow a fixed sequence.',
              'Listen when stillness is easier to hear than to read.',
              'Keep private reflections close to the text that stirred them.',
              'Move gently between guide, reader, audio, and journal.',
            ].map((point) => (
              <Card key={point} className="rounded-[2rem] border-border/60 bg-background/72 backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-base leading-7 text-foreground">{point}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Background variant="bottom" className="mt-2.5 overflow-hidden">
        <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Ready to enter</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Begin wherever the page meets you.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Enter at any chapter. Return by voice or by page. Let the words meet you in the shape this day can hold.
          </p>
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild size="xl" className="min-h-[3.25rem] w-full rounded-full px-8 font-semibold sm:w-auto">
              <Link to="/access">
                Open the book for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="min-h-[3.25rem] w-full rounded-full bg-background/70 px-8 sm:w-auto">
              <Link to="/hub/guide">Browse Chapters</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Already read it?{' '}
            <a
              href="https://buy.stripe.com/28EdRa2q93rR2rQ3kSbfO00"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Support the work →
            </a>
          </p>
        </section>
      </Background>

      <Footer />
    </div>
  )
}
