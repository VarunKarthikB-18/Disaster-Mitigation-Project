const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// SOS APIs
export const createSOS = (data) =>
  request('/sos', { method: 'POST', body: JSON.stringify(data) });

export const fetchSOS = (status) =>
  request(`/sos${status ? `?status=${status}` : ''}`);

export const updateSOS = (id, data) =>
  request(`/sos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// Shelter APIs
export const fetchShelters = () => request('/shelters');

export const fetchRecommendedShelters = (lat, lng) =>
  request(`/shelters?recommend=true&lat=${lat}&lng=${lng}`);

export const createShelter = (data) =>
  request('/shelters', { method: 'POST', body: JSON.stringify(data) });

// Disaster APIs
export const fetchDisasters = () => request('/disasters');

export const createDisaster = (data) =>
  request('/disasters', { method: 'POST', body: JSON.stringify(data) });

// Alert APIs
export const fetchAlerts = () => request('/alerts');

export const createAlert = (data) =>
  request('/alerts', { method: 'POST', body: JSON.stringify(data) });

// Routing API
export const getEvacuationRoute = (startLat, startLng, endLat, endLng) =>
  request('/route', {
    method: 'POST',
    body: JSON.stringify({ startLat, startLng, endLat, endLng }),
  });

// Health check
export const checkHealth = () => request('/health');
