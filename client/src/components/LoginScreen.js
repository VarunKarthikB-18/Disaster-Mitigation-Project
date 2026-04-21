'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function LoginScreen({ requiredRole }) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState(requiredRole || 'citizen'); // 'citizen' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Authentication Delay
    setTimeout(() => {
      setLoading(false);
      dispatch({
        type: 'SET_AUTH',
        payload: { isAuthenticated: true, role: activeTab },
      });
      // Admin dashboard handles redirect implicitly if mounted in app/admin/page.js
    }, 1000);
  };

  if (state.auth.isAuthenticated && (!requiredRole || state.auth.role === requiredRole)) {
    return null; // Don't render if already authenticated appropriately
  }

  return (
    <div className="login-overlay" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
    }}>
      <div className="login-card card" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="header-brand-icon" style={{ margin: '0 auto 16px', width: '56px', height: '56px', fontSize: '28px' }}>🛡️</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, white, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DisasterShield
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
            Secure Authentication Portal
          </p>
        </div>

        {!requiredRole && (
          <div className="sidebar-tabs" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '24px' }}>
            <button
              type="button"
              className={`sidebar-tab ${activeTab === 'citizen' ? 'active' : ''}`}
              onClick={() => setActiveTab('citizen')}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <span className="tab-icon">👤</span>
              Citizen
            </button>
            <button
              type="button"
              className={`sidebar-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              <span className="tab-icon">⚙️</span>
              Authority
            </button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {activeTab === 'admin' ? (
            <>
              <div className="form-group">
                <label className="form-label">Authority Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@ndma.gov.in" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Secure Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '24px' }}>
                {loading ? <span className="spinner"></span> : '🔐 Authorize Access'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Mobile Number (Optional)</label>
                <input type="tel" className="form-input" placeholder="+91 98765 43210" />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px', lineHeight: '1.6' }}>
                You can proceed anonymously for immediate emergency assistance. Your location will be required for routing.
              </p>
              <button type="submit" className="btn btn-success btn-full" disabled={loading}>
                {loading ? <span className="spinner"></span> : '🚨 Quick Access'}
              </button>
            </>
          )}
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', opacity: 0.5 }}>
          Authorized Personnel Only. Monitored System.
        </div>
      </div>
    </div>
  );
}
