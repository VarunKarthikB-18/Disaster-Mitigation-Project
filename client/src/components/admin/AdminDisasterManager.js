'use client';

import { useState } from 'react';

export default function AdminDisasterManager({ disasters, setDisasters }) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('flood');
  const [severity, setSeverity] = useState('high');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated Polygon for demo purposes (A box around Delhi Center)
    const mockPolygon = [
      [28.61, 77.20], [28.62, 77.20], [28.62, 77.21], [28.61, 77.21], [28.61, 77.20]
    ];

    try {
      const res = await fetch('http://localhost:5001/api/disasters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, type, severity,
          polygon: mockPolygon,
          center: { lat: 28.615, lng: 77.205 }
        })
      });
      if (res.ok) {
        const json = await res.json();
        setDisasters(prev => [json, ...prev]);
        setFormOpen(false);
        setName('');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="admin-section-title">🌍 Active Threat Zones</h2>
        {!formOpen && (
          <button className="btn btn-sm btn-primary" onClick={() => setFormOpen(true)}>+ Add Zone</button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <h4>New Disaster Zone</h4>
          <div className="row" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label">Zone Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="flood">Flood</option>
                <option value="earthquake">Earthquake</option>
                <option value="fire">Fire</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Severity Level</label>
            <select className="form-select" value={severity} onChange={e => setSeverity(e.target.value)}>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-sm btn-primary" disabled={loading}>Save Zone</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>* Polygon will be mocked in this demo.</p>
        </form>
      )}

      {disasters.map((d) => (
        <div key={d._id} className="card" style={{ borderLeftWidth: '4px', borderLeftColor: d.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-orange)' }}>
          <div className="card-header">
            <span className="card-title" style={{ fontSize: '13px' }}>
              {d.type === 'flood' ? '🌊' : d.type === 'earthquake' ? '🌍' : '🔥'} {d.name}
            </span>
            <span className="badge badge-info">{d.severity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
