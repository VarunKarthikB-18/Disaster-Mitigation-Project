'use client';

import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createEndpointIcon(emoji) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 28px; height: 28px; 
      background: rgba(10,14,26,0.9); 
      border: 2px solid #38bdf8; 
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; 
      font-size: 14px;
      box-shadow: 0 0 12px rgba(56,189,248,0.4);
    ">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function RoutePolyline({ route }) {
  if (!route || !route.path || route.path.length === 0) return null;

  const positions = route.path.map(p => [p.lat, p.lng]);
  const start = positions[0];
  const end = positions[positions.length - 1];

  return (
    <>
      {/* Route shadow for depth */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#000000',
          weight: 8,
          opacity: 0.3,
        }}
      />

      {/* Main route line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#38bdf8',
          weight: 4,
          opacity: 0.9,
          dashArray: '12, 8',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Route glow */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#38bdf8',
          weight: 10,
          opacity: 0.15,
        }}
      />

      {/* Start marker */}
      <Marker position={start} icon={createEndpointIcon('📍')}>
        <Popup><div><h4>📍 Start Location</h4><p>Your current position</p></div></Popup>
      </Marker>

      {/* End marker */}
      <Marker position={end} icon={createEndpointIcon('🏠')}>
        <Popup>
          <div>
            <h4>🏠 Destination Shelter</h4>
            <p>Distance: {route.distance} km</p>
          </div>
        </Popup>
      </Marker>
    </>
  );
}
