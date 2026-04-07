'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { useToast } from '@/components/toast-provider'
import { writeAccessSession } from '@/lib/session'

export function AccessForm() {
  const router = useRouter()
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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: trimmedFirstName,
          lastName: '',
          email: trimmedEmail,
        }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to open the book right now.')
      }

      writeAccessSession({
        firstName: trimmedFirstName,
        fullName: trimmedFirstName,
        initials: trimmedFirstName.charAt(0).toUpperCase(),
        email: trimmedEmail,
      })

      showToast(`Welcome, ${trimmedFirstName}. The way is open.`)
      router.push('/hub')
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

    router.push('/hub')
  }

  return (
    <main className="page-enter fullscreen-page" id="page-signup">
      <div className="signup-left">
        <button className="signup-left-back" onClick={() => router.push('/')}>
          ← Back
        </button>

        <div className="signup-book-mini">
          <h3>
            The Way
            <br />
            of <em>Becoming</em>
          </h3>
          <span>Jay Burgess</span>
        </div>

        <h2>
          A calmer <em>way
          <br />
          in.</em>
        </h2>
        <p>
          Enter your details for calm, immediate access to the full book. Read online, download
          the PDF, and return whenever the words meet you again.
        </p>

        <div className="access-perks">
          <div className="perk">
            <div className="perk-icon">📖</div>
            <div className="perk-text">
              <strong>Read Online</strong>
              Beautiful reading experience, chapter by chapter
            </div>
          </div>
          <div className="perk">
            <div className="perk-icon">⬇</div>
            <div className="perk-text">
              <strong>Download PDF</strong>
              Keep a copy for yourself, forever
            </div>
          </div>
          <div className="perk">
            <div className="perk-icon">✦</div>
            <div className="perk-text">
              <strong>Return Gently</strong>
              A quiet companion for returning, not rushing
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <form className="signup-form-wrap" onSubmit={handleSubmit}>
          <div className="form-eyebrow">Free Access</div>
          <h2 className="form-title">
            Begin
            <br />
            with <em>stillness.</em>
          </h2>
          <p className="form-sub">
            No payment. No rush. Just your name and email to open the book.
          </p>

          <div className="form-field">
            <label htmlFor="input-name">First Name</label>
            <input
              autoComplete="off"
              id="input-name"
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="What shall I call you?"
              type="text"
              value={firstName}
            />
          </div>
          <div className="form-field">
            <label htmlFor="input-email">Email Address</label>
            <input
              autoComplete="off"
              id="input-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              type="email"
              value={email}
            />
          </div>

          <div className="form-submit-row">
            <button className="btn btn-gold" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Opening…' : 'Open the Book →'}
            </button>
            <p className="form-note">
              By signing up you agree to receive occasional emails from Jay Burgess. Unsubscribe
              any time. Your data is never shared.
            </p>
          </div>

          <div className="form-divider">
            <span>or</span>
          </div>

          <button className="btn-ghost-sm" onClick={handleGuestAccess} type="button">
            Skip and browse as guest
          </button>
        </form>
      </div>
    </main>
  )
}
