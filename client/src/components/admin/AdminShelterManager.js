'use client';

import { useState } from 'react';

export default function AdminShelterManager({ shelters, setShelters }) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, 
          capacity: Number(capacity),
          latitude: Number(latitude),
          longitude: Number(longitude),
        })
      });
      if (res.ok) {
        const json = await res.json();
        setShelters(prev => [json, ...prev]);
        setFormOpen(false);
        setName(''); setCapacity(''); setLatitude(''); setLongitude('');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const activeShelters = shelters.filter(s => !s.isHospital);

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="admin-section-title">🏠 Relief Camps & Shelters</h2>
        {!formOpen && (
          <button className="btn btn-sm btn-primary" onClick={() => setFormOpen(true)}>+ Add Shelter</button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          <h4>Register New Shelter</h4>
          <div className="row" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label">Camp Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Total Capacity</label>
              <input type="number" className="form-input" value={capacity} onChange={e => setCapacity(e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input type="number" step="0.0001" className="form-input" value={latitude} onChange={e => setLatitude(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input type="number" step="0.0001" className="form-input" value={longitude} onChange={e => setLongitude(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-sm btn-primary" disabled={loading}>Save Shelter</button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Capacity Overview */}
      <div style={{ marginTop: '16px' }}>
        {activeShelters.slice(0, 5).map((s) => {
          const pct = Math.round((s.currentOccupancy / s.capacity) * 100);
          const barColor = pct > 80 ? 'var(--accent-red)' : pct > 50 ? 'var(--accent-amber)' : 'var(--accent-green)';
          return (
            <div key={s._id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{s.name}</span>
                <span style={{ color: barColor, fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>{s.currentOccupancy}/{s.capacity}</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
