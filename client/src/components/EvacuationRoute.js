'use client';

import { useState } from 'react';
import { getEvacuationRoute } from '@/lib/api';
import { useApp } from '@/context/AppContext';

export default function EvacuationRoute() {
  const { state, dispatch } = useApp();
  const [selectedShelterId, setSelectedShelterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allShelters = state.shelters || [];

  const handleGetRoute = async () => {
    if (!selectedShelterId) {
      setError('Please select a destination shelter');
      return;
    }

    const shelter = allShelters.find(s => s._id === selectedShelterId);
    if (!shelter) {
      setError('Shelter not found');
      return;
    }

    let startLat, startLng;
    if (state.userLocation) {
      startLat = state.userLocation.lat;
      startLng = state.userLocation.lng;
    } else {
      // Try geolocation, fallback to Mumbai center
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        startLat = pos.coords.latitude;
        startLng = pos.coords.longitude;
        dispatch({ type: 'SET_USER_LOCATION', payload: { lat: startLat, lng: startLng } });
      } catch {
        startLat = 19.076;
        startLng = 72.877;
        dispatch({ type: 'SET_USER_LOCATION', payload: { lat: startLat, lng: startLng } });
      }
    }

    const [endLng, endLat] = shelter.location.coordinates;

    setLoading(true);
    setError('');
    try {
      const route = await getEvacuationRoute(startLat, startLng, endLat, endLng);
      dispatch({ type: 'SET_ROUTE', payload: route });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    dispatch({ type: 'CLEAR_ROUTE' });
    setSelectedShelterId('');
  };

  return (
    <div>
      <h3 className="section-title">🛤️ Evacuation Route</h3>
      <p className="section-desc">
        Get the safest route to a shelter, avoiding disaster zones and blocked roads.
      </p>

      {/* Route Result */}
      {state.selectedRoute && (
        <div className="route-info">
          {state.selectedRoute.reachable ? (
            <>
              <div className="route-info-row">
                <span className="route-info-label">Status</span>
                <span className="route-info-value" style={{ color: 'var(--accent-green)' }}>
                  ✅ Route Found
                </span>
              </div>
              <div className="route-info-row">
                <span className="route-info-label">Distance</span>
                <span className="route-info-value">{state.selectedRoute.distance} km</span>
              </div>
              <div className="route-info-row">
                <span className="route-info-label">Est. Time</span>
                <span className="route-info-value">
                  ~{Math.ceil(state.selectedRoute.distance / 30 * 60)} min
                </span>
              </div>
              <div className="route-info-row">
                <span className="route-info-label">Waypoints</span>
                <span className="route-info-value">{state.selectedRoute.path.length}</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <p style={{ color: 'var(--accent-red)', fontWeight: 600, marginTop: '8px' }}>
                No safe route available
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {state.selectedRoute.message || 'All paths are blocked by disaster zones.'}
              </p>
            </div>
          )}
          <button
            className="btn btn-ghost btn-full btn-sm"
            onClick={clearRoute}
            style={{ marginTop: '12px' }}
          >
            ✕ Clear Route
          </button>
        </div>
      )}

      {/* Shelter Selection */}
      <div className="form-group">
        <label className="form-label" htmlFor="dest-shelter">Destination Shelter</label>
        <select
          id="dest-shelter"
          className="form-select"
          value={selectedShelterId}
          onChange={(e) => setSelectedShelterId(e.target.value)}
        >
          <option value="">Select a shelter...</option>
          {allShelters.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.capacity - s.currentOccupancy} spots)
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(255,59,59,0.1)',
          border: '1px solid rgba(255,59,59,0.3)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-red)',
          fontSize: '12px',
          marginBottom: '12px',
        }}>
          {error}
        </div>
      )}

      {/* Get Route Button */}
      <button
        className="btn btn-primary btn-full"
        onClick={handleGetRoute}
        disabled={loading || !selectedShelterId}
      >
        {loading ? (
          <><span className="spinner"></span> Calculating route...</>
        ) : (
          '🛤️ Get Safe Route'
        )}
      </button>
    </div>
  );
}
