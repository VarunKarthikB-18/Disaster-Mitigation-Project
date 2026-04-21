'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { fetchDisasters, fetchShelters, fetchSOS, fetchAlerts } from '@/lib/api';
import { getSocket } from '@/lib/socket';

const AppContext = createContext(null);

const initialState = {
  auth: { isAuthenticated: false, role: null }, // 'citizen' or 'admin'
  disasters: [],
  shelters: [],
  hospitals: [],
  sosRequests: [],
  alerts: [],
  selectedRoute: null,
  userLocation: null,
  selectedShelter: null,
  loading: true,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_AUTH':
      return { ...state, auth: action.payload };
    case 'SET_DISASTERS':
      return { ...state, disasters: action.payload };
    case 'SET_SHELTERS': {
      const shelters = action.payload.filter(s => !s.isHospital);
      const hospitals = action.payload.filter(s => s.isHospital);
      return { ...state, shelters, hospitals };
    }
    case 'SET_SOS_REQUESTS':
      return { ...state, sosRequests: action.payload };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'ADD_SOS':
      return { ...state, sosRequests: [action.payload, ...state.sosRequests] };
    case 'UPDATE_SOS':
      return {
        ...state,
        sosRequests: state.sosRequests.map(s =>
          s._id === action.payload._id ? action.payload : s
        ),
      };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(a => a._id !== action.payload),
      };
    case 'SET_ROUTE':
      return { ...state, selectedRoute: action.payload };
    case 'CLEAR_ROUTE':
      return { ...state, selectedRoute: null };
    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.payload };
    case 'SET_SELECTED_SHELTER':
      return { ...state, selectedShelter: action.payload };
    case 'DATA_LOADED':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [disasters, shelters, sosRequests, alerts] = await Promise.all([
        fetchDisasters(),
        fetchShelters(),
        fetchSOS(),
        fetchAlerts(),
      ]);
      dispatch({ type: 'SET_DISASTERS', payload: disasters });
      dispatch({ type: 'SET_SHELTERS', payload: shelters });
      dispatch({ type: 'SET_SOS_REQUESTS', payload: sosRequests });
      dispatch({ type: 'SET_ALERTS', payload: alerts });
      dispatch({ type: 'DATA_LOADED' });
    } catch (err) {
      console.error('Failed to load data:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Socket.IO setup
  useEffect(() => {
    const socket = getSocket();

    socket.on('newSOS', (sos) => {
      dispatch({ type: 'ADD_SOS', payload: sos });
    });

    socket.on('sosUpdate', (sos) => {
      dispatch({ type: 'UPDATE_SOS', payload: sos });
    });

    socket.on('newAlert', (alert) => {
      dispatch({ type: 'ADD_ALERT', payload: alert });
    });

    return () => {
      socket.off('newSOS');
      socket.off('sosUpdate');
      socket.off('newAlert');
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, loadData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
