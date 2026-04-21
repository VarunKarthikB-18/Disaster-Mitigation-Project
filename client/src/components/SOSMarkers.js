'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createSOSIcon(type) {
  return L.divIcon({
    className: '',
    html: `
      <div class="sos-marker ${type}">
        <div class="sos-marker-pulse"></div>
        <div class="sos-marker-inner"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

const TYPE_LABELS = {
  medical: '🏥 Medical Emergency',
  food: '🍽️ Food/Water Needed',
  rescue: '🚨 Rescue Required',
};

const STATUS_COLORS = {
  pending: '#ffb300',
  assigned: '#38bdf8',
  resolved: '#00e676',
};

export default function SOSMarkers({ requests }) {
  if (!requests || requests.length === 0) return null;

  return (
    <>
      {requests.filter(r => r.status !== 'resolved').map((sos, index) => {
        const [lng, lat] = sos.location.coordinates;

        return (
          <Marker
            key={sos._id || index}
            position={[lat, lng]}
            icon={createSOSIcon(sos.type)}
          >
            <Popup>
              <div>
                <h4>{TYPE_LABELS[sos.type] || 'SOS'}</h4>
                <p>{sos.description}</p>
                <p>
                  <strong>Status: </strong>
                  <span style={{ color: STATUS_COLORS[sos.status], fontWeight: 700 }}>
                    {sos.status.toUpperCase()}
                  </span>
                </p>
                {sos.assignedResource && (
                  <p><strong>Assigned:</strong> {sos.assignedResource}</p>
                )}
                <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                  {new Date(sos.createdAt).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
