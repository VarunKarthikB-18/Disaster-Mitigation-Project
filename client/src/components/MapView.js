'use client';

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useApp } from '@/context/AppContext';
import DisasterLayer from './DisasterLayer';
import ShelterMarkers from './ShelterMarkers';
import HospitalMarkers from './HospitalMarkers';
import SOSMarkers from './SOSMarkers';
import RoutePolyline from './RoutePolyline';

// Mumbai Center
const DEFAULT_CENTER = [19.0760, 72.8777];
const DEFAULT_ZOOM = 12;

// Light, professional maps
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org">OSM</a>, &copy; <a href="https://carto.com">CARTO</a>';

export default function MapView() {
  const { state } = useApp();

  return (
    <div className="map-container" id="map-container">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
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
