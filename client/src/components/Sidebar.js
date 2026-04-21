'use client';

import { useState } from 'react';
import SOSForm from './SOSForm';
import ShelterFinder from './ShelterFinder';
import EvacuationRoute from './EvacuationRoute';
import { useApp } from '@/context/AppContext';

const TABS = [
  { id: 'sos', icon: '🚨', label: 'SOS' },
  { id: 'shelters', icon: '🏠', label: 'Shelters' },
  { id: 'route', icon: '🛤️', label: 'Route' },
  { id: 'alerts', icon: '📢', label: 'Alerts' },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('sos');
  const { state } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'sos':
        return <SOSForm />;
      case 'shelters':
        return <ShelterFinder />;
      case 'route':
        return <EvacuationRoute />;
      case 'alerts':
        return <AlertsTab />;
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {renderContent()}
      </div>
    </aside>
  );
}

function AlertsTab() {
  const { state } = useApp();

  return (
    <div>
      <h3 className="section-title">📢 Active Alerts</h3>
      <p className="section-desc">Real-time emergency alerts and updates from authorities.</p>

      {state.alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <p>No active alerts at this time.</p>
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
