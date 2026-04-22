'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '@/context/AppContext';
import DisasterLayer from './DisasterLayer';
import ShelterMarkers from './ShelterMarkers';
import HospitalMarkers from './HospitalMarkers';
import SOSMarkers from './SOSMarkers';
import RoutePolyline from './RoutePolyline';

// Mumbai Center (Fallback if GPS fails)
const FALLBACK_CENTER = [19.0760, 72.8777];
const DEFAULT_ZOOM = 12;

// Light, professional maps
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org">OSM</a>, &copy; <a href="https://carto.com">CARTO</a>';

// Geolocation Controller Component
function LocationController() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const userPos = [latitude, longitude];
          setPosition(userPos);
          map.flyTo(userPos, 14, { animate: true, duration: 2 });
        },
        (err) => {
          console.warn('Geolocation denied or failed:', err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map]);

  if (!position) return null;

  // Render a minimal active radar beacon for the user
  const userIcon = new L.DivIcon({
    className: 'user-beacon',
    html: '<div style="width: 14px; height: 14px; background: var(--accent-blue); border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 5px rgba(15, 98, 254, 0.2);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return <Marker position={position} icon={userIcon} />;
}

export default function MapView() {
  const { state } = useApp();

  return (
    <div className="map-container" id="map-container">
      <MapContainer
        center={FALLBACK_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        <LocationController />
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <ZoomControl position="bottomright" />
        <DisasterLayer disasters={state.disasters} />
        <ShelterMarkers shelters={state.shelters} />
        <HospitalMarkers hospitals={state.hospitals} />
        <SOSMarkers requests={state.sosRequests} />
        {state.selectedRoute && <RoutePolyline route={state.selectedRoute} />}
      </MapContainer>
    </div>
  );
}
