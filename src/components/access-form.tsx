import { Link, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'

import { supabase } from '@/lib/supabase'

import { useToast } from '@/components/toast-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { writeAccessSession } from '@/lib/session'

const perks = [
  { icon: '📖', title: 'Read Online', desc: 'Beautiful chapter-by-chapter experience' },
  { icon: '🎧', title: 'Listen Along', desc: 'Full audio narration by Jay Burgess' },
  { icon: '⬇', title: 'Download PDF', desc: 'Keep a copy with you, forever' },
]

export function AccessForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedFirstName = firstName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFirstName) {
      showToast('Please enter your name')
      return
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      showToast('Please enter a valid email')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: functionError } = await supabase.functions.invoke('subscribe', {
        body: { firstName: trimmedFirstName, lastName: '', email: trimmedEmail },
      })

      if (functionError) {
        throw new Error(functionError.message ?? 'Unable to open the book right now.')
      }

      if (!data?.ok) {
        throw new Error(data?.error ?? 'Unable to open the book right now.')
      }

      writeAccessSession({
        firstName: trimmedFirstName,
        fullName: trimmedFirstName,
        initials: trimmedFirstName.charAt(0).toUpperCase(),
        email: trimmedEmail,
      })

      showToast(`Welcome, ${trimmedFirstName}. The way is open.`)
      navigate('/hub')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to open the book right now.'
      showToast(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestAccess = () => {
    writeAccessSession({
      firstName: 'Traveler',
      fullName: 'Traveler',
      initials: 'T',
    })
    navigate('/hub')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-6">
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link to="/">← Back</Link>
          </Button>
          <span className="ml-4 font-display text-sm font-semibold text-foreground">
            The Way of Becoming
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
        {/* Left — info (shown after form on mobile) */}
        <div className="order-2 flex flex-col justify-center gap-8 lg:order-1">
          {/* Mini book card */}
          <div className="inline-flex max-w-[200px] flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg">
              ∞
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jay Burgess</p>
              <p className="font-display text-sm font-semibold leading-tight">
                The Way<br />of Becoming
              </p>
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              A calmer<br />
              <em className="font-normal italic text-primary-foreground">way in.</em>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Enter your details for calm, immediate access to the full book — read online, download
              the PDF, and return whenever the words meet you again.
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-col gap-4">
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-start gap-3">
                <div className="mt-0.5 text-lg">{perk.icon}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{perk.title}</p>
                  <p className="text-sm text-muted-foreground">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form card (shown first on mobile) */}
        <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-start">
          <Card className="w-full max-w-md shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Free Access
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">
                  Begin with<br />
                  <em className="font-normal italic text-primary-foreground">stillness.</em>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No payment. No rush. Just your name and email.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="input-name">First Name</Label>
                  <Input
                    id="input-name"
                    type="text"
                    placeholder="What shall I call you?"
                    autoComplete="off"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="input-email">Email Address</Label>
                  <Input
                    id="input-email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 min-h-[3rem] w-full rounded-3xl font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Opening…' : 'Open the Book →'}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Occasional emails from Jay. Unsubscribe any time. Never shared.
                </p>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full text-muted-foreground"
                onClick={handleGuestAccess}
                type="button"
              >
                Skip and browse as guest
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
