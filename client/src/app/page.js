'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import AlertBanner from '@/components/AlertBanner';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="map-container" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)'
    }}>
      <div className="loading-container">
        <div className="spinner spinner-lg" style={{ borderTopColor: 'var(--accent-blue)' }}></div>
        <span>Loading Map...</span>
      </div>
    </div>
  ),
});

function DashboardContent() {
  const { state } = useApp();

  const pendingSOS = state.sosRequests.filter(s => s.status === 'pending').length;
  const activeDisasters = state.disasters.length;
  const activeShelters = state.shelters.length;
  const activeAlerts = state.alerts.length;

  if (state.loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', gap: '16px',
      }}>
        <div className="spinner spinner-lg" style={{ borderTopColor: 'var(--accent-blue)' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Connecting to Disaster Response Server...
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', gap: '16px', padding: '20px',
      }}>
        <span style={{ fontSize: '48px' }}>⚠️</span>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '20px' }}>Connection Failed</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
          Unable to connect to the backend server. Make sure the server is running on port 5000.
        </p>
        <code style={{
          padding: '8px 16px', background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-sm)', color: 'var(--accent-cyan)', fontSize: '13px'
        }}>
          cd server &amp;&amp; npm start
        </code>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="header-bar">
        <div className="header-brand">
          <div className="header-brand-icon">🛡️</div>
          <div>
            <h1>DisasterShield</h1>
            <span>Evacuation Intelligence</span>
          </div>
        </div>

        <div className="header-stats">
          <div className="header-stat">
            <span className="dot red"></span>
            <span>{activeDisasters} Active Zones</span>
          </div>
          <div className="header-stat">
            <span className="dot amber"></span>
            <span>{pendingSOS} Pending SOS</span>
          </div>
          <div className="header-stat">
            <span className="dot green"></span>
            <span>{activeShelters} Shelters</span>
          </div>
          <div className="header-stat">
            <span className="dot blue"></span>
            <span>{activeAlerts} Alerts</span>
          </div>
        </div>

        <div className="header-nav">
          <Link href="/" className="header-nav-btn active">
            🗺️ Dashboard
          </Link>
          <Link href="/admin" className="header-nav-btn">
            ⚙️ Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <Sidebar />
        <MapView />
      </div>

      {/* Alert Banners */}
      <AlertBanner />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
