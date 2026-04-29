'use client';

import { useState } from 'react';

const TABS = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'sos', icon: '🚨', label: 'SOS' },
  { id: 'shelters', icon: '🏠', label: 'Shelters' },
  { id: 'route', icon: '🛤️', label: 'Route' },
  { id: 'damage', icon: '📸', label: 'Report' },
  { id: 'ai', icon: '🤖', label: 'AI Guide' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <nav className="cc-sidebar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`cc-sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          title={tab.label}
        >
          <span className="cc-sidebar-icon">{tab.icon}</span>
          <span className="cc-sidebar-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
