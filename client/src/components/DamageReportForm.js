'use client';

import { useState } from 'react';

export default function DamageReportForm() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('form'); // form | loading | success

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        // Fallback Delhi
        setLocation({ lat: 28.6139, lng: 77.2090 });
        setLocLoading(false);
      }
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !location) return;

    setStatus('loading');
    try {
      const res = await fetch('http://localhost:5001/api/damage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          latitude: location.lat,
          longitude: location.lng,
          imageBase64: image,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('form');
          setDescription('');
          setImage(null);
          setLocation(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('form');
    }
  };

  if (status === 'success') {
    return (
      <div className="success-anim">
        <div className="check-circle">✓</div>
        <p>Damage Report Submitted</p>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
          Thank you. Authorities have been alerted to the infrastructure damage.
        </span>
      </div>
    );
  }

  return (
    <div>
      <h3 className="section-title">📸 Report Damage</h3>
      <p className="section-desc">Upload photos of blocked roads, collapsed structures, or floods to help authorities map hazards.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Photo Evidence</label>
          <div style={{
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            background: image ? `url(${image}) center/cover` : 'transparent',
          }}>
            {!image && (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📷</span>
                Click to attach photo
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Bridge collapsed, road fully under water..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location Data</label>
          {location ? (
            <div className="location-display">
              <span>📍 GPS Locked</span>
              <span className="coords">{location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</span>
            </div>
          ) : (
            <button type="button" className="btn btn-ghost btn-full" onClick={getLocation} disabled={locLoading}>
              {locLoading ? <span className="spinner"></span> : '📡 Acquire Location'}
            </button>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={!description || !location || status === 'loading'}>
          {status === 'loading' ? 'Uploading...' : '📤 Submit Report'}
        </button>
      </form>
    </div>
  );
}
