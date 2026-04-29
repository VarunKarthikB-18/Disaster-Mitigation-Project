'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import AlertBanner from '@/components/AlertBanner';

import SOSForm from '@/components/SOSForm';
import ShelterFinder from '@/components/ShelterFinder';
import EvacuationRoute from '@/components/EvacuationRoute';
import DamageReportForm from '@/components/DamageReportForm';
import AIAssistant from '@/components/AIAssistant';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="cc-map-wrapper" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)'
    }}>
      <div className="spinner spinner-lg" style={{ borderTopColor: 'var(--accent-blue)' }}></div>
    </div>
  ),
});

function DashboardContent() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const activeShelters = state.shelters.length;
  const fullShelters = state.shelters.filter(s => s.capacity && s.currentOccupancy >= s.capacity).length;

  // Dynamic Calculations
  const totalSOS = state.sosRequests.length;
  const resolvedSOS = state.sosRequests.filter(s => s.status === 'resolved').length;
  const responseRate = totalSOS > 0 ? Math.round((resolvedSOS / totalSOS) * 100) : 100;
  const responseOffset = 314 - (314 * responseRate / 100);

  const totalHospitals = state.hospitals.length;
  const healthyHospitals = state.hospitals.filter(h => h.capacity - h.currentOccupancy > 10).length;
  const totalSys = totalHospitals + activeShelters;
  const healthySys = healthyHospitals + (activeShelters - fullShelters);
  const sysHealth = totalSys > 0 ? Math.round((healthySys / totalSys) * 100) : 100;
  const sysOffset = 339 - (339 * sysHealth / 100);

  const medicalSOS = state.sosRequests.filter(s => s.type === 'medical').length;
  const foodSOS = state.sosRequests.filter(s => s.type === 'food').length;
  const rescueSOS = state.sosRequests.filter(s => s.type === 'rescue').length;
  const maxSOS = Math.max(medicalSOS, foodSOS, rescueSOS, 1);

  const renderLeftPanel = () => {
    switch (activeTab) {
      case 'sos': return <div className="cc-widget"><SOSForm /></div>;
      case 'shelters': return <div className="cc-widget"><ShelterFinder /></div>;
      case 'route': return <div className="cc-widget"><EvacuationRoute /></div>;
      case 'damage': return <div className="cc-widget"><DamageReportForm /></div>;
      case 'ai': return <div className="cc-widget"><AIAssistant /></div>;
      default:
        return (
          <>
            {/* Active Incidents */}
            <div className="cc-widget">
              <div className="cc-widget-header">
                <span className="cc-widget-title">ACTIVE INCIDENTS</span>
                <span className="cc-widget-menu">...</span>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {state.disasters.length === 0 && state.sosRequests.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No active incidents at this time.</p>
                ) : (
                  <>
                    {state.disasters.map(d => (
                      <div key={d._id} className="cc-incident-item">
                        <div className="cc-incident-time">{new Date(d.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="cc-incident-bar" style={{ background: d.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)' }}></div>
                        <div className="cc-incident-desc" style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '4px', flex: 1 }}>{d.type} - {d.name || 'Unknown Region'}</div>
                      </div>
                    ))}
                    {state.sosRequests.filter(s => s.status === 'pending').map(s => (
                      <div key={s._id} className="cc-incident-item">
                        <div className="cc-incident-time">{new Date(s.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="cc-incident-bar" style={{ background: 'var(--accent-orange)' }}></div>
                        <div className="cc-incident-desc" style={{ background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '4px', flex: 1 }}>SOS: {s.type} - Pending</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Response Overview */}
            <div className="cc-widget">
              <div className="cc-widget-header">
                <span className="cc-widget-title">SOS RESOLUTION</span>
                <span className="cc-widget-menu">...</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-muted)' }}>{resolvedSOS}</span>
                <div className="cc-chart-container">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="16" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent-blue)" strokeWidth="16" strokeDasharray="314" strokeDashoffset={responseOffset} strokeLinecap="round" transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="cc-donut-text">
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-bright)' }}>{responseRate}%</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>Resolved</span>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>{totalSOS}</span>
              </div>
            </div>

            {/* System Status */}
            <div className="cc-widget">
              <div className="cc-widget-header">
                <span className="cc-widget-title">SYSTEM HEALTH</span>
                <span className="cc-widget-menu">...</span>
              </div>
              <div className="cc-chart-container">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#e2e8f0" strokeWidth="18" />
                  <circle cx="70" cy="70" r="54" fill="none" stroke={sysHealth < 50 ? 'var(--accent-red)' : sysHealth < 80 ? 'var(--accent-amber)' : 'var(--accent-green)'} strokeWidth="18" strokeDasharray="339" strokeDashoffset={sysOffset} strokeLinecap="round" transform="rotate(-90 70 70)" />
                </svg>
                <div className="cc-donut-text">
                  <span className="cc-donut-val" style={{ color: sysHealth < 50 ? 'var(--accent-red)' : 'inherit'}}>{sysHealth}%</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="cc-dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
        {/* Top Header */}
        <header style={{ 
          height: '60px', 
          background: 'white', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100
        }}>
          <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.5px' }}>
            RESILIENCE CITY: DISASTER RESPONSE PLATFORM
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <span>COMMAND CENTER</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span>{new Date().getUTCHours()}:{new Date().getUTCMinutes().toString().padStart(2, '0')} UTC</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-dot" style={{ width: '8px', height: '8px', boxShadow: 'none' }}></span> LIVE
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
            <span>Status: <strong style={{color: 'var(--accent-green)'}}>Online</strong></span>
            <span>|</span>
            <span>Notifications (<span style={{color: 'var(--accent-red)'}}>{state.alerts.length}</span>)</span>
            <span>|</span>
            <Link href="/" style={{ fontWeight: 600 }}>Home</Link>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="cc-main-grid">
          
          {/* LEFT PANEL */}
          <div className="cc-panel">
            {renderLeftPanel()}
          </div>

          {/* CENTER PANEL */}
          <div className="cc-center-col">
            <div className="cc-map-wrapper">
              <div className="cc-map-overlay-card">
                <div className="cc-overlay-stat" style={{ minWidth: '180px' }}>
                  <h4>CITY STATUS: {state.disasters.length > 0 ? 'CRITICAL' : 'SAFE'}</h4>
                  <p>Emergency <span style={{color: 'var(--text-muted)'}}>|</span> Status: <span style={{color: state.disasters.length > 0 ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 600}}>{state.disasters.length > 0 ? 'Active' : 'Normal'}</span></p>
                </div>
                <div className="cc-overlay-stat">
                  <p>Active Disasters</p>
                  <span className="val">{state.disasters.length}</span>
                </div>
                <div className="cc-overlay-stat">
                  <p>Pending SOS</p>
                  <span className="val">{state.sosRequests.filter(s => s.status === 'pending').length}</span>
                </div>
              </div>
              
              {/* Actual Map Component */}
              <MapView />
              
            </div>

            <div className="cc-bottom-row">
              <div className="cc-widget">
                <div className="cc-widget-header">
                  <span className="cc-widget-title">EVACUATION STATUS</span>
                  <span className="cc-widget-menu">...</span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                    <span>Shelter Readiness</span>
                    <span>{activeShelters > 0 ? Math.round(((activeShelters - fullShelters) / activeShelters) * 100) : 0}%</span>
                  </div>
                  <div className="cc-resource-bar-bg" style={{ height: '8px' }}>
                    <div className="cc-resource-bar-fill" style={{ width: `${activeShelters > 0 ? Math.round(((activeShelters - fullShelters) / activeShelters) * 100) : 0}%`, background: 'var(--accent-green)' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Shelters:</span>
                  <span>{activeShelters} Active / <span style={{ color: fullShelters > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{fullShelters} Full</span></span>
                </div>
              </div>

              <div className="cc-widget">
                <div className="cc-widget-header">
                  <span className="cc-widget-title">CRITICAL INFRASTRUCTURE</span>
                  <span className="cc-widget-menu">...</span>
                </div>
                {state.hospitals.slice(0, 3).map(h => (
                  <div key={h._id} className="cc-infra-row">
                    <span className="cc-infra-name">{h.name}</span>
                    <span className="cc-infra-status" style={{ color: h.capacity - h.currentOccupancy > 10 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      {h.capacity - h.currentOccupancy > 10 ? 'OK' : 'DEGRADED'}
                    </span>
                  </div>
                ))}
                {state.hospitals.length === 0 && (
                  <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>No infrastructure data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="cc-panel">
            <div className="cc-widget">
              <div className="cc-widget-header">
                <span className="cc-widget-title">ALERTS FEED</span>
                <span className="cc-widget-menu">...</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Real-time events</p>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {state.alerts.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No recent alerts.</p>
                ) : (
                  state.alerts.map(a => (
                    <div key={a._id} className="cc-feed-item" style={{ borderLeftColor: a.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                      <div className="cc-feed-time">{new Date(a.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className="cc-feed-text">{a.title}</div>
                      <div className="cc-feed-meta">{a.severity}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="cc-widget">
              <div className="cc-widget-header">
                <span className="cc-widget-title">SHELTER CAPACITY</span>
                <span className="cc-widget-menu">...</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Top 10 Shelters Occupancy</p>
              
              <div className="cc-weather-chart">
                {state.shelters.slice(0, 10).map((s, i) => {
                  const pct = s.capacity > 0 ? Math.min((s.currentOccupancy / s.capacity) * 100, 100) : 0;
                  return (
                    <div key={s._id || i} className={`cc-weather-bar ${pct > 90 ? 'active' : ''}`} style={{ height: `${pct}%`, background: pct > 90 ? 'var(--accent-red)' : pct > 50 ? 'var(--accent-amber)' : 'var(--accent-blue)' }} title={`${s.name}: ${s.currentOccupancy}/${s.capacity}`}></div>
                  );
                })}
                {state.shelters.length === 0 && (
                   <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No shelters available.</p>
                )}
              </div>
            </div>

            <div className="cc-widget">
              <div className="cc-widget-header">
                <span className="cc-widget-title">SOS ANALYTICS</span>
                <span className="cc-widget-menu">...</span>
              </div>
              
              <div className="cc-resource-row">
                <div className="cc-resource-header"><span>Medical</span><span>{medicalSOS}</span></div>
                <div className="cc-resource-bar-bg"><div className="cc-resource-bar-fill" style={{width: `${(medicalSOS/maxSOS)*100}%`, background: 'var(--accent-red)'}}></div></div>
              </div>
              <div className="cc-resource-row">
                <div className="cc-resource-header"><span>Food/Water</span><span>{foodSOS}</span></div>
                <div className="cc-resource-bar-bg"><div className="cc-resource-bar-fill" style={{width: `${(foodSOS/maxSOS)*100}%`, background: 'var(--accent-orange)'}}></div></div>
              </div>
              <div className="cc-resource-row">
                <div className="cc-resource-header"><span>Rescue</span><span>{rescueSOS}</span></div>
                <div className="cc-resource-bar-bg"><div className="cc-resource-bar-fill" style={{width: `${(rescueSOS/maxSOS)*100}%`, background: 'var(--accent-amber)'}}></div></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AlertBanner />
    </div>
  );
}

export default function Home() {
  return <DashboardContent />;
}
