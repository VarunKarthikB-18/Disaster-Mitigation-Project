'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '@/context/AppContext';

function createShelterIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="shelter-marker-icon">🏠</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

export default function ShelterMarkers({ shelters }) {
  const { dispatch } = useApp();

  if (!shelters || shelters.length === 0) return null;

  return (
    <>
      {shelters.map((shelter, index) => {
        const [lng, lat] = shelter.location.coordinates;
        const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
        const barColor = occupancyPercent > 80 ? '#ff3b3b' : occupancyPercent > 50 ? '#ffb300' : '#00e676';

        return (
          <Marker
            key={shelter._id || index}
            position={[lat, lng]}
            icon={createShelterIcon()}
            eventHandlers={{
              click: () => {
                dispatch({ type: 'SET_SELECTED_SHELTER', payload: shelter });
              },
            }}
          >
            <Popup>
              <div>
                <h4>🏠 {shelter.name}</h4>
                <p><strong>Capacity:</strong> {shelter.currentOccupancy}/{shelter.capacity}</p>
                <div style={{ width: '100%', height: '6px', background: '#1a2236', borderRadius: '3px', margin: '6px 0' }}>
                  <div style={{ width: `${occupancyPercent}%`, height: '100%', background: barColor, borderRadius: '3px', transition: 'width 0.5s' }} />
                </div>
                <p><strong>Available:</strong> {shelter.capacity - shelter.currentOccupancy} spots</p>
                {shelter.contact && <p><strong>Contact:</strong> {shelter.contact}</p>}
                {shelter.amenities && shelter.amenities.length > 0 && (
                  <p style={{ marginTop: '4px' }}>
                    {shelter.amenities.map((a, i) => (
                      <span key={i} style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        margin: '2px',
                        fontSize: '10px',
                        background: 'rgba(148,163,184,0.1)',
                        borderRadius: '4px',
                        color: '#94a3b8',
                      }}>{a}</span>
                    ))}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
