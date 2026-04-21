'use client';

import { useState } from 'react';
import { createSOS } from '@/lib/api';
import { useApp } from '@/context/AppContext';

export default function SOSForm() {
  const { dispatch } = useApp();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState('form'); // form | sending | success
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
        // Fallback to Delhi center for demo
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
      // Show sending animation for 2.5s then success
      setTimeout(() => {
        setPhase('success');
        setTimeout(() => {
          setPhase('form');
          setType('');
          setDescription('');
        }, 4000);
      }, 2500);
    } catch (err) {
      setError(err.message);
      setPhase('form');
    }
  };

  // === SENDING PHASE — Full-screen radar animation ===
  if (phase === 'sending') {
    return (
      <div className="sos-sending-overlay">
        <div className="sos-sending-radar">
          <div className="radar-ring"></div>
          <div className="radar-ring"></div>
          <div className="radar-ring"></div>
          <div className="radar-core"></div>
        </div>
        <div className="sos-sending-text">Transmitting SOS Signal...</div>
        <div className="sos-sending-sub">Connecting to nearest emergency responders</div>
      </div>
    );
  }

  // === SUCCESS PHASE ===
  if (phase === 'success') {
    return (
      <div className="success-anim">
        <div className="check-circle">✓</div>
        <p>SOS Signal Received!</p>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
          Emergency responders have been notified.<br />
          Help is being dispatched to your location.
        </span>
        <div style={{
          marginTop: '12px', padding: '10px 20px',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px', color: 'var(--accent-green-bright)',
          fontWeight: '600',
        }}>
          📍 Location locked • 🕐 ETA calculating...
        </div>
      </div>
    );
  }

  // === FORM PHASE ===
  return (
    <div>
      <h3 className="section-title">🚨 Emergency SOS</h3>
      <p className="section-desc">Send an emergency distress signal. Your location will be shared with first responders.</p>

      {/* Urgency Banner */}
      <div className="sos-urgency-banner">
        <div className="pulse-dot"></div>
        <p>This will alert all emergency teams in your area. Use only for genuine emergencies.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Emergency Type */}
        <label className="form-label">Emergency Type</label>
        <div className="sos-type-selector">
          <button
            type="button"
            className={`sos-type-btn ${type === 'medical' ? 'active medical' : ''}`}
            onClick={() => setType('medical')}
          >
            <span className="type-icon">🏥</span>
            <span className="type-label">Medical</span>
          </button>
          <button
            type="button"
            className={`sos-type-btn ${type === 'food' ? 'active food' : ''}`}
            onClick={() => setType('food')}
          >
            <span className="type-icon">🍽️</span>
            <span className="type-label">Supplies</span>
          </button>
          <button
            type="button"
            className={`sos-type-btn ${type === 'rescue' ? 'active rescue' : ''}`}
            onClick={() => setType('rescue')}
          >
            <span className="type-icon">🚁</span>
            <span className="type-label">Rescue</span>
          </button>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="sos-desc">Situation Details</label>
          <textarea
            id="sos-desc"
            className="form-textarea"
            placeholder="Describe the emergency — number of people, injuries, immediate dangers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">GPS Coordinates</label>
          {location ? (
            <div className="location-display">
              <span>📍</span>
              <span className="coords">
                {location.lat.toFixed(6)}°N, {location.lng.toFixed(6)}°E
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={getLocation}
                style={{ marginLeft: 'auto' }}
              >
                ↻ Refresh
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-full"
              onClick={getLocation}
              disabled={locLoading}
              style={{ padding: '14px' }}
            >
              {locLoading ? (
                <><span className="spinner"></span> Acquiring GPS Signal...</>
              ) : (
                '📡 Acquire GPS Location'
              )}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-red-bright)',
            fontSize: '12px', fontWeight: '600',
            marginBottom: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-danger btn-full"
          disabled={submitting || !type || !description.trim() || !location}
          style={{ padding: '14px', fontSize: '14px', fontWeight: '800', letterSpacing: '0.5px' }}
        >
          🚨 TRANSMIT SOS SIGNAL
        </button>
      </form>
    </div>
  );
}
