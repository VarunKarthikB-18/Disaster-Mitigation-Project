'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createHospitalIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="hospital-marker-icon">🏥</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

export default function HospitalMarkers({ hospitals }) {
  if (!hospitals || hospitals.length === 0) return null;

  return (
    <>
      {hospitals.map((hospital, index) => {
        const [lng, lat] = hospital.location.coordinates;

        return (
          <Marker
            key={hospital._id || index}
            position={[lat, lng]}
            icon={createHospitalIcon()}
          >
            <Popup>
              <div>
                <h4>🏥 {hospital.name}</h4>
                <p><strong>Type:</strong> Hospital / Emergency</p>
                <p><strong>Capacity:</strong> {hospital.currentOccupancy}/{hospital.capacity}</p>
                {hospital.contact && <p><strong>Emergency:</strong> {hospital.contact}</p>}
                {hospital.amenities && (
                  <p style={{ marginTop: '4px' }}>
                    {hospital.amenities.map((a, i) => (
                      <span key={i} style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        margin: '2px',
                        fontSize: '10px',
                        background: 'rgba(56,189,248,0.1)',
                        borderRadius: '4px',
                        color: '#38bdf8',
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
