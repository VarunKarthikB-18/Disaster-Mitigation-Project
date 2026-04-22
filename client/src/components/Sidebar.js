'use client';

import { useState } from 'react';
import SOSForm from './SOSForm';
import ShelterFinder from './ShelterFinder';
import EvacuationRoute from './EvacuationRoute';
import DamageReportForm from './DamageReportForm';
import AIAssistant from './AIAssistant';
import { useApp } from '@/context/AppContext';

const TABS = [
  { id: 'sos', icon: '🚨', label: 'SOS' },
  { id: 'shelters', icon: '🏠', label: 'Shelters' },
  { id: 'route', icon: '🛤️', label: 'Route' },
  { id: 'damage', icon: '📸', label: 'Report' },
  { id: 'ai', icon: '🤖', label: 'AI Guide' },
  { id: 'alerts', icon: '📢', label: 'Alerts' },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('sos');

  const renderContent = () => {
    switch (activeTab) {
      case 'sos': return <SOSForm />;
      case 'shelters': return <ShelterFinder />;
      case 'route': return <EvacuationRoute />;
      case 'damage': return <DamageReportForm />;
      case 'ai': return <AIAssistant />;
      case 'alerts': return <AlertsTab />;
      default: return null;
    }
  };

  return (
    <div className="sidebar-wrapper">
      <nav className="sidebar-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span>{tab.icon}</span>
            <span className="sidebar-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      <aside className="sidebar-panel">
        {renderContent()}
      </aside>
    </div>
  );
}

function AlertsTab() {
  const { state } = useApp();

  return (
    <div>
      <h3 className="section-title" style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Active Overrides</h3>
      <p className="section-desc" style={{ marginBottom: '24px' }}>Real-time emergency overrides and dispatches.</p>

      {state.alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <p>No active overrides at this time.</p>
        </div>
      ) : (
        state.alerts.map((alert, i) => (
          <div key={alert._id || i} className="card" style={{
            borderLeftWidth: '3px',
            borderLeftColor: alert.severity === 'critical' ? 'var(--accent-red)' :
              alert.severity === 'warning' ? 'var(--accent-orange)' : 'var(--accent-blue)',
          }}>
            <div className="card-header">
              <span className="card-title">{alert.title}</span>
              <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {alert.message}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
