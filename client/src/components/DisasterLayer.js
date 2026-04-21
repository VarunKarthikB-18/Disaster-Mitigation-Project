'use client';

import { Polygon, Popup } from 'react-leaflet';

const SEVERITY_COLORS = {
  critical: { color: '#ff3b3b', fillColor: '#ff3b3b', fillOpacity: 0.2, weight: 2 },
  high: { color: '#ff9800', fillColor: '#ff9800', fillOpacity: 0.15, weight: 2 },
};

const DISASTER_ICONS = {
  flood: '🌊',
  earthquake: '🌍',
  cyclone: '🌀',
  fire: '🔥',
  landslide: '⛰️',
};

export default function DisasterLayer({ disasters }) {
  if (!disasters || disasters.length === 0) return null;

  return (
    <>
      {disasters.map((disaster, index) => {
        const style = SEVERITY_COLORS[disaster.severity] || SEVERITY_COLORS.high;
        // polygon is stored as [[lat, lng], ...]
        const positions = disaster.polygon.map(([lat, lng]) => [lat, lng]);

        return (
          <Polygon
            key={disaster._id || index}
            positions={positions}
            pathOptions={{
              ...style,
              dashArray: disaster.severity === 'critical' ? '8, 4' : undefined,
            }}
          >
            <Popup>
              <div>
                <h4>{DISASTER_ICONS[disaster.type]} {disaster.name}</h4>
                <p><strong>Type:</strong> {disaster.type}</p>
                <p><strong>Severity:</strong> <span style={{ color: style.color, fontWeight: 700 }}>{disaster.severity.toUpperCase()}</span></p>
                {disaster.description && <p>{disaster.description}</p>}
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
}
