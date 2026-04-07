import Link from 'next/link'

export function LandingPage() {
  return (
    <main className="page-enter fullscreen-page" id="page-landing">
      <nav className="land-nav">
        <div className="land-nav-logo">The Way of Becoming</div>
        <Link className="land-nav-cta" href="/access">
          Get Free Access →
        </Link>
      </nav>

      <div className="land-hero land-hero-calm">
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
            <Link className="btn btn-outline" href="/hub/read">
              Chapter Guide
            </Link>
          </div>
        </div>

        <div className="land-book-side">
          <div className="book-stage">
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
          <div className="land-quiet-card">
            <div className="land-quiet-label">A Quiet Opening</div>
            <p className="land-quiet-quote">
              &quot;You are not a problem to be solved. You are a song to be sung differently each
              day.&quot;
            </p>
            <div className="land-quiet-meta">Chapter 58 · The Endless Becoming</div>
          </div>
        </div>
      </div>
    </main>
  )
}
