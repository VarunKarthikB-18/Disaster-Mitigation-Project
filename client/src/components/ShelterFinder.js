'use client';

import { useState } from 'react';
import { fetchRecommendedShelters } from '@/lib/api';
import { useApp } from '@/context/AppContext';

export default function ShelterFinder() {
  const { state, dispatch } = useApp();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const findNearby = async () => {
    setLoading(true);
    try {
      let lat, lng;
      if (state.userLocation) {
        lat = state.userLocation.lat;
        lng = state.userLocation.lng;
      } else {
        // Try geolocation, fallback to Mumbai center
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          dispatch({ type: 'SET_USER_LOCATION', payload: { lat, lng } });
        } catch {
          lat = 19.076;
          lng = 72.877;
          dispatch({ type: 'SET_USER_LOCATION', payload: { lat, lng } });
        }
      }

      const data = await fetchRecommendedShelters(lat, lng);
      setShelters(data);
      setSearched(true);
    } catch (err) {
      console.error('Failed to find shelters:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectShelter = (shelter) => {
    dispatch({ type: 'SET_SELECTED_SHELTER', payload: shelter });
  };

  const getCapacityClass = (shelter) => {
    const pct = (shelter.currentOccupancy / shelter.capacity) * 100;
    if (pct > 80) return 'high';
    if (pct > 50) return 'medium';
    return 'low';
  };

  return (
    <div>
      <h3 className="section-title">🏠 Find Nearby Shelters</h3>
      <p className="section-desc">Locate safe shelters near you, sorted by distance and filtered for capacity.</p>

      <button
        className="btn btn-success btn-full"
        onClick={findNearby}
        disabled={loading}
        style={{ marginBottom: '16px' }}
      >
        {loading ? (
          <><span className="spinner"></span> Searching...</>
        ) : (
          '🔍 Find Nearby Shelters'
        )}
      </button>

      {searched && shelters.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏚️</div>
          <p>No safe shelters found nearby. All shelters may be at capacity or inside disaster zones.</p>
        </div>
      )}

      {shelters.map((shelter, i) => {
        const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        const isSelected = state.selectedShelter?._id === shelter._id;

        return (
          <div
            key={shelter._id || i}
            className={`shelter-item ${isSelected ? 'selected' : ''}`}
            onClick={() => selectShelter(shelter)}
          >
            <div className="shelter-item-header">
              <span className="shelter-name">{shelter.name}</span>
              <span className="shelter-distance">{shelter.distance} km</span>
            </div>

            <div className="capacity-bar">
              <div
                className={`capacity-bar-fill ${getCapacityClass(shelter)}`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>

            <div className="shelter-meta">
              <span>{shelter.currentOccupancy}/{shelter.capacity} occupied</span>
              <span style={{ color: 'var(--accent-green)' }}>
                {shelter.availableCapacity || shelter.capacity - shelter.currentOccupancy} spots available
              </span>
            </div>

            {shelter.amenities && shelter.amenities.length > 0 && (
              <div className="shelter-amenities">
                {shelter.amenities.map((a, j) => (
                  <span key={j} className="badge badge-amenity">{a}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
