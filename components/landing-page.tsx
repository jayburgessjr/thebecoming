import Link from 'next/link'

export function LandingPage() {
  return (
    <main className="page-enter" id="page-landing">
      <nav className="land-nav">
        <div className="land-nav-logo">The Way of Becoming</div>
        <Link className="land-nav-cta" href="/access">
          Get Free Access →
        </Link>
      </nav>

      <div className="land-hero">
        <div className="land-text">
          <div className="land-eyebrow">A Book of Meditations</div>
          <h1 className="land-title">
            The Way
            <br />
            of
            <em>Becoming</em>
          </h1>
          <p className="land-tagline">
            &quot;Becoming is not a path you walk.
            <br />
            It is the path that walks you.&quot;
          </p>

          <div className="land-stats">
            <div className="stat-item">
              <div className="stat-num">81</div>
              <div className="stat-label">Meditations</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">Free</div>
              <div className="stat-label">Full Access</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">∞</div>
              <div className="stat-label">Return Visits</div>
            </div>
          </div>

          <div className="land-cta-row">
            <Link className="btn btn-gold" href="/access">
              Read Free →
            </Link>
            <a className="btn btn-outline" href="#quote-section">
              Explore First
            </a>
          </div>
        </div>

        <div className="land-book-side">
          <div className="book-stage">
            <div className="float-word">stillness</div>
            <div className="float-word">becoming</div>
            <div className="float-word">surrender</div>
            <div className="book-obj">
              <div className="book-face">
                <div className="book-top-rule">
                  <span>Jay Burgess</span>
                </div>
                <div className="book-center">
                  <div className="book-circle-mark">
                    <span>∞</span>
                  </div>
                  <h2 className="book-face-title">
                    The Way
                    <br />
                    of <em>Becoming</em>
                  </h2>
                </div>
                <div className="book-bottom-rule" />
              </div>
            </div>
            <div className="book-shadow-el" />
          </div>
        </div>
      </div>

      <div className="chapter-strip" id="chapter-strip">
        <div className="strip-item">
          <div className="strip-num">1</div>
          <div className="strip-name">Beginning</div>
          <div className="strip-sub">Stillness before motion</div>
        </div>
        <div className="strip-item">
          <div className="strip-num">5</div>
          <div className="strip-name">Silence</div>
          <div className="strip-sub">Wisdom&apos;s fertile soil</div>
        </div>
        <div className="strip-item">
          <div className="strip-num">14</div>
          <div className="strip-name">Trust</div>
          <div className="strip-sub">Unfolding as you must</div>
        </div>
        <div className="strip-item">
          <div className="strip-num">32</div>
          <div className="strip-name">Machines</div>
          <div className="strip-sub">You are soil, not software</div>
        </div>
        <div className="strip-item">
          <div className="strip-num">50</div>
          <div className="strip-name">Mastery</div>
          <div className="strip-sub">Surrender as art</div>
        </div>
      </div>

      <div className="quote-band" id="quote-section">
        <p className="big-quote">
          &quot;You are not a problem to be solved.
          <br />
          You are a song to be sung
          <br />
          differently each day.&quot;
        </p>
        <p className="quote-attr">— Chapter 58: The Endless Becoming</p>

        <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center' }}>
          <Link
            className="btn btn-gold"
            href="/access"
            style={{ fontSize: '0.75rem', padding: '1.1rem 3rem' }}
          >
            Unlock Full Access — Free
          </Link>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll to explore</span>
        <div className="scroll-line" />
      </div>
    </main>
  )
}
