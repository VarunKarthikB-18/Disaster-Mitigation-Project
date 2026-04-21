export default function HeroLandingPage() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hero-container">
      {/* Abstract Background Elements */}
      <div className="hero-bg-accent left"></div>
      <div className="hero-bg-accent right"></div>

      <header className="hero-header">
        <div className="hero-brand" onClick={scrollToTop}>
          <div className="hero-brand-icon">🛡️</div>
          <span className="hero-brand-text">DisasterShield</span>
        </div>
        <nav className="hero-nav">
          <a href="#features">Features</a>
          <a href="#technology">Technology</a>
          <a href="/auth?role=citizen" style={{ background: 'var(--bg-primary)', padding: '8px 16px', borderRadius: 'var(--radius-full)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)'}}>Login</a>
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
            <p>Calculates the safest evacuation paths instantly based on real-time damage analysis to the municipal roadway network utilizing advanced Dijkstra graph algorithms.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚁</div>
            <h3>SOS Triaging</h3>
            <p>Direct integration with NDRF and municipal rapid response teams to dispatch precise medical, structural, and aeronautical rescue operations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Guidance</h3>
            <p>Embedded offline-first AI processing capabilities providing immediate safety protocols and survival guidance under zero-connectivity.</p>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="hero-technology" id="technology">
          <div className="tech-text">
            <h3>Powered by Enterprise Infrastructure</h3>
            <p>DisasterShield operates on a robust, lightweight, and incredibly fast stack capable of maintaining uptime during municipal internet throttling and extreme traffic spikes.</p>
            <div className="tech-grid">
              <div className="tech-item"><span>⚡</span> Next.js 14 App Router</div>
              <div className="tech-item"><span>🔋</span> In-Memory MongoDB Engine</div>
              <div className="tech-item"><span>📡</span> WebSocket Event Streams</div>
              <div className="tech-item"><span>🗺️</span> OpenStreet Leaflet Nodes</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)', background: 'var(--grad-primary)'}}>
            <pre style={{ color: 'white', fontSize: '13px', lineHeight: '1.6', opacity: '0.9', overflow: 'hidden' }}>
              <code>
{`async function calculateEvacuationRoute() {
  const safetyMetric = await evaluateZone(location);
  const roadNetwork = await graph.buildEdges();
  
  // Dijkstra shortest path with danger weighting
  const optimalVector = algo.dijkstra(
    roadNetwork,
    user.coords, 
    shelter.coords,
    safetyMetric
  );
  
  return Socket.emit('ROUTE_READY', optimalVector);
}`}
              </code>
            </pre>
          </div>
        </div>
      </main>

      <footer className="hero-footer">
        <p>&copy; {new Date().getFullYear()} DisasterShield Intelligence Platform. Open-source crisis management.</p>
      </footer>
    </div>
  );
}
