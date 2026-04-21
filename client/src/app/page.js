export default function HeroLandingPage() {
  return (
    <div className="hero-container">
      {/* Abstract Background Elements */}
      <div className="hero-bg-accent left"></div>
      <div className="hero-bg-accent right"></div>

      <header className="hero-header">
        <div className="hero-brand">
          <div className="hero-brand-icon">🛡️</div>
          <span className="hero-brand-text">DisasterShield</span>
        </div>
        <nav className="hero-nav">
          <a href="#features">Features</a>
          <a href="#technology">Technology</a>
        </nav>
      </header>

      <main className="hero-main">
        <div className="hero-content">
          <div className="hero-badge">Next-Generation Systems</div>
          <h1 className="hero-title">
            Evacuation Intelligence &<br/>
            <span>Crisis Coordination</span> Platform
          </h1>
          <p className="hero-subtitle">
            Empowering communities and authorities with real-time disaster mapping, dynamic evacuation routing, and synchronized emergency response operations.
          </p>
          
          <div className="hero-actions">
            <a href="/auth?role=citizen" className="hero-btn primary">
              <span className="icon">🏃</span>
              <div className="btn-text">
                <strong>Access Citizen Portal</strong>
                <span>Find shelters & routes</span>
              </div>
            </a>
            
            <a href="/auth?role=admin" className="hero-btn secondary">
              <span className="icon">⚙️</span>
              <div className="btn-text">
                <strong>Authority Login</strong>
                <span>Manage crisis zones</span>
              </div>
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="hero-features" id="features">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Dynamic Routing</h3>
            <p>Calculates the safest evacuation paths instantly based on real-time damage analysis to the municipal roadway network.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚁</div>
            <h3>SOS Triaging</h3>
            <p>Direct integration with NDRF and municipal teams to dispatch precise medical, structural, and aeronautical operations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Guidance</h3>
            <p>Embedded offline-first AI processing capabilities providing immediate safety protocols under zero-connectivity.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
