'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchSOS, updateSOS, fetchAlerts, createAlert, fetchDisasters, fetchShelters } from '@/lib/api';
import { getSocket } from '@/lib/socket';

export default function AdminDashboard() {
  const [sosRequests, setSosRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [alertTitle, setAlertTitle] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [alertSending, setAlertSending] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [sos, al, dis, sh] = await Promise.all([
        fetchSOS(), fetchAlerts(), fetchDisasters(), fetchShelters()
      ]);
      setSosRequests(sos);
      setAlerts(al);
      setDisasters(dis);
      setShelters(sh);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const socket = getSocket();
    socket.on('newSOS', (sos) => setSosRequests(prev => [sos, ...prev]));
    socket.on('sosUpdate', (sos) => setSosRequests(prev => prev.map(s => s._id === sos._id ? sos : s)));
    socket.on('newAlert', (alert) => setAlerts(prev => [alert, ...prev]));
    return () => { socket.off('newSOS'); socket.off('sosUpdate'); socket.off('newAlert'); };
  }, [loadData]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const updated = await updateSOS(id, { status });
      setSosRequests(prev => prev.map(s => s._id === id ? updated : s));
    } catch (err) { console.error('Failed to update:', err); }
  };

  const handleAssignResource = async (id, resource) => {
    try {
      const updated = await updateSOS(id, { assignedResource: resource, status: 'assigned' });
      setSosRequests(prev => prev.map(s => s._id === id ? updated : s));
    } catch (err) { console.error('Failed to assign:', err); }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMsg.trim()) return;
    setAlertSending(true);
    try {
      await createAlert({ title: alertTitle, message: alertMsg, severity: alertSeverity });
      setAlertTitle(''); setAlertMsg(''); setAlertSeverity('info');
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 3000);
    } catch (err) { console.error('Failed to broadcast:', err); }
    finally { setAlertSending(false); }
  };

  const pendingSOS = sosRequests.filter(s => s.status === 'pending').length;
  const assignedSOS = sosRequests.filter(s => s.status === 'assigned').length;
  const resolvedSOS = sosRequests.filter(s => s.status === 'resolved').length;
  const activeShelters = shelters.filter(s => !s.isHospital);
  const totalShelterCapacity = activeShelters.reduce((a, s) => a + (s.capacity - s.currentOccupancy), 0);
  const totalPeople = activeShelters.reduce((a, s) => a + s.currentOccupancy, 0);

  const timeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  if (loading) {
    return (
      <div className="admin-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-container">
          <div className="spinner spinner-lg" style={{ borderTopColor: 'var(--accent-blue)' }}></div>
          <span>Initializing Command Center...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <span style={{ fontSize: '56px' }}>⚠️</span>
        <h2 style={{ color: 'var(--text-bright)', fontSize: '22px', fontWeight: 800 }}>Command Center Offline</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Backend server not responding. Start the server first.</p>
        <code style={{ padding: '10px 20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', color: 'var(--accent-cyan)', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
          cd server && node server.js
        </code>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="header-bar">
        <div className="header-brand">
          <div className="header-brand-icon">🛡️</div>
          <div>
            <h1>DisasterShield</h1>
            <span>Command Center</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-full)',
            fontSize: '11px', color: 'var(--accent-green-bright)', fontWeight: '700',
          }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-green)' }}></span>
            SYSTEM ONLINE
          </div>
          <div className="header-nav">
            <Link href="/" className="header-nav-btn">🗺️ Dashboard</Link>
            <Link href="/admin" className="header-nav-btn active">⚙️ Command Center</Link>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="admin-grid">
        <div className="stat-card" style={{ borderBottom: '3px solid var(--accent-red)' }}>
          <div className="stat-card-icon">🚨</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-red-bright)' }}>{pendingSOS}</div>
          <div className="stat-card-label">Pending SOS</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Awaiting response team
          </div>
        </div>
        <div className="stat-card" style={{ borderBottom: '3px solid var(--accent-blue)' }}>
          <div className="stat-card-icon">⚡</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-blue-bright)' }}>{assignedSOS}</div>
          <div className="stat-card-label">In Progress</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Teams deployed
          </div>
        </div>
        <div className="stat-card" style={{ borderBottom: '3px solid var(--accent-green)' }}>
          <div className="stat-card-icon">✅</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-green-bright)' }}>{resolvedSOS}</div>
          <div className="stat-card-label">Resolved</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Successfully rescued
          </div>
        </div>
        <div className="stat-card" style={{ borderBottom: '3px solid var(--accent-cyan)' }}>
          <div className="stat-card-icon">🏠</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{totalShelterCapacity}</div>
          <div className="stat-card-label">Available Spots</div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            {totalPeople} currently sheltered
          </div>
        </div>
      </div>

      {/* Two-column layout for alert + quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Alert Broadcaster */}
        <div className="admin-section">
          <h2 className="admin-section-title">📡 Broadcast Emergency Alert</h2>
          {alertSuccess && (
            <div style={{
              padding: '12px 16px', marginBottom: '14px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-md)', color: 'var(--accent-green-bright)',
              fontSize: '13px', fontWeight: '700', animation: 'bannerSlide 0.3s ease',
            }}>
              ✅ Alert broadcasted to all connected users!
            </div>
          )}
          <form className="broadcast-form" onSubmit={handleBroadcast}>
            <div className="row">
              <div className="form-group">
                <label className="form-label" htmlFor="alert-title">Alert Title</label>
                <input id="alert-title" className="form-input" placeholder="e.g., 🔴 Evacuation Order" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="alert-severity">Severity Level</label>
                <select id="alert-severity" className="form-select" value={alertSeverity} onChange={(e) => setAlertSeverity(e.target.value)}>
                  <option value="info">ℹ️ Information</option>
                  <option value="warning">⚠️ Warning</option>
                  <option value="critical">🔴 Critical — Immediate Action</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="alert-msg">Broadcast Message</label>
              <textarea id="alert-msg" className="form-textarea" placeholder="Detailed alert message for all connected users..." value={alertMsg} onChange={(e) => setAlertMsg(e.target.value)} rows={3} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={alertSending || !alertTitle.trim() || !alertMsg.trim()} style={{ alignSelf: 'flex-start' }}>
              {alertSending ? <><span className="spinner"></span> Broadcasting...</> : '📡 Push Alert to All Users'}
            </button>
          </form>
        </div>

        {/* Disaster Zones Quick View */}
        <div className="admin-section">
          <h2 className="admin-section-title">🌍 Active Threat Zones</h2>
          {disasters.map((d) => (
            <div key={d._id} className="card" style={{ borderLeftWidth: '4px', borderLeftColor: d.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-orange)' }}>
              <div className="card-header">
                <span className="card-title" style={{ fontSize: '13px' }}>
                  {d.type === 'flood' ? '🌊' : d.type === 'earthquake' ? '🌍' : d.type === 'fire' ? '🔥' : '🌀'} {d.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`badge ${d.severity === 'critical' ? 'badge-critical' : 'badge-warning'}`}>{d.severity}</span>
                <span className="badge badge-info">{d.type}</span>
              </div>
              {d.description && (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>{d.description}</p>
              )}
            </div>
          ))}

          {/* Shelter capacity overview */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Shelter Capacity Overview
            </div>
            {activeShelters.slice(0, 4).map((s) => {
              const pct = Math.round((s.currentOccupancy / s.capacity) * 100);
              const barColor = pct > 80 ? 'var(--accent-red)' : pct > 50 ? 'var(--accent-amber)' : 'var(--accent-green)';
              return (
                <div key={s._id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{s.name}</span>
                    <span style={{ color: barColor, fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>{pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SOS Requests Table */}
      <div className="admin-section">
        <h2 className="admin-section-title">
          🚨 Emergency Requests
          <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
            {sosRequests.length} total
          </span>
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Type</th>
                <th>Description</th>
                <th>Coordinates</th>
                <th>Status</th>
                <th>Assigned Team</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sosRequests.map((sos, idx) => {
                const [lng, lat] = sos.location.coordinates;
                const priorityColor = sos.status === 'pending' ? 'var(--accent-red)' : sos.status === 'assigned' ? 'var(--accent-blue)' : 'var(--accent-green)';
                return (
                  <tr key={sos._id}>
                    <td>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: priorityColor,
                        boxShadow: `0 0 8px ${priorityColor}`,
                      }} />
                    </td>
                    <td>
                      <span className={`badge badge-${sos.type}`}>
                        {sos.type === 'medical' ? '🏥' : sos.type === 'food' ? '🍽️' : '🚁'} {sos.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: '280px', fontSize: '12px', lineHeight: '1.5' }}>{sos.description}</td>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                        {lat.toFixed(4)}°N<br />{lng.toFixed(4)}°E
                      </span>
                    </td>
                    <td><span className={`badge badge-${sos.status}`}>{sos.status}</span></td>
                    <td>
                      {sos.status === 'pending' ? (
                        <select className="form-select" style={{ padding: '6px 10px', fontSize: '11px', minWidth: '150px' }} defaultValue="" onChange={(e) => { if (e.target.value) handleAssignResource(sos._id, e.target.value); }}>
                          <option value="">Assign team...</option>
                          <option value="NDRF Team Alpha">NDRF Team Alpha</option>
                          <option value="NDRF Team Bravo">NDRF Team Bravo</option>
                          <option value="NDRF Team Charlie">NDRF Team Charlie</option>
                          <option value="Fire Brigade Unit 3">Fire Brigade Unit 3</option>
                          <option value="Fire Brigade Unit 7">Fire Brigade Unit 7</option>
                          <option value="Medical Team A">Medical Rapid Response</option>
                          <option value="Red Cross Unit">Red Cross Unit</option>
                          <option value="IAF Helicopter Unit">IAF Helicopter Unit</option>
                        </select>
                      ) : (
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{sos.assignedResource || '—'}</span>
                      )}
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>
                      {timeAgo(sos.createdAt)}
                    </td>
                    <td>
                      <div className="td-actions">
                        {sos.status === 'pending' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(sos._id, 'assigned')}>
                            ⚡ Deploy
                          </button>
                        )}
                        {sos.status === 'assigned' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(sos._id, 'resolved')}>
                            ✅ Resolve
                          </button>
                        )}
                        {sos.status === 'resolved' && (
                          <span style={{ fontSize: '11px', color: 'var(--accent-green-bright)', fontWeight: '700' }}>✅ Complete</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
