'use client';

import { useState } from 'react';
import { createSOS } from '@/lib/api';
import { useApp } from '@/context/AppContext';

export default function SOSForm() {
  const { dispatch } = useApp();
  const [type, setType] = useState('medical');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState('form'); 
  const [error, setError] = useState('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }
    setLocLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
        dispatch({
          type: 'SET_USER_LOCATION',
          payload: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
      },
      () => {
        // Fallback to Delhi center for demo if they deny completely
        setLocation({ lat: 28.6139, lng: 77.2090 });
        setLocLoading(false);
        dispatch({
          type: 'SET_USER_LOCATION',
          payload: { lat: 28.6139, lng: 77.2090 },
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) { setError('Please select an emergency type'); return; }
    if (!description.trim()) { setError('Please describe your emergency'); return; }
    if (!location) { setError('Please share your location first'); return; }

    setError('');
    setPhase('sending');

    try {
      await createSOS({
        type,
        description,
        latitude: location.lat,
        longitude: location.lng,
      });
      setTimeout(() => {
        setPhase('success');
        setTimeout(() => {
          setPhase('form');
          setType('medical');
          setDescription('');
        }, 4000);
      }, 2500);
    } catch (err) {
      setError(err.message);
      setPhase('form');
    }
  };

  if (phase === 'sending') {
    return (
      <div className="sos-sending-overlay" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
        <div className="spinner spinner-lg"></div>
        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>Executing Protocol...</div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="success-anim" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent:'center'}}>
        <div style={{ fontSize: '48px', color: 'var(--accent-green)'}}>✓</div>
        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Dispatch Authorized</p>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Teams en route to coordinates.
        </span>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Emergency Dispatch</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Fill the operational requirements below to request immediate extraction or materials.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Strict Formatting Dropdown */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Incident Category</label>
          <select 
            className="form-select" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ fontWeight: '600' }}
          >
            <option value="medical">Medical / Bio-Hazard</option>
            <option value="rescue">Structural Rescue / Extraction</option>
            <option value="food">Material / Ration Shortage</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Operational Details</label>
          <textarea
            className="form-textarea"
            placeholder="Report headcounts, specific damages, and required logistical support."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Location Engine Tool */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase' }}>GPS Telemetry Tracking</label>
          {location ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="dot green"></span>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold' }}>
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              </div>
              <button type="button" className="btn btn-secondary" onClick={getLocation} style={{ padding: '6px 12px', fontSize: '11px' }}>RE-LOCK</button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={getLocation}
              disabled={locLoading}
              style={{ justifyContent: 'center' }}
            >
              {locLoading ? 'ACQUIRING SIGNAL...' : 'AUTHORIZE GPS LOCK'}
            </button>
          )}
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '12px', borderRadius: '4px', fontWeight: 'bold' }}>
            ERROR: {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={submitting || !description.trim() || !location}
          style={{ padding: '16px', background: 'var(--text-bright)', borderRadius: 'var(--radius-sm)' }}
        >
          AUTHORIZE DISPATCH
        </button>
      </form>
    </div>
  );
}
