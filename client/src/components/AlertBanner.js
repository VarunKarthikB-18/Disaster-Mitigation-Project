'use client';

import { useApp } from '@/context/AppContext';

export default function AlertBanner() {
  const { state, dispatch } = useApp();

  const activeAlerts = state.alerts.filter(a => a.isActive);
  if (activeAlerts.length === 0) return null;

  const dismiss = (id) => {
    dispatch({ type: 'DISMISS_ALERT', payload: id });
  };

  return (
    <div className="alert-banner-container">
      {activeAlerts.slice(0, 3).map((alert) => (
        <div key={alert._id} className={`alert-banner ${alert.severity}`}>
          <div className="alert-banner-content">
            <strong>{alert.title}</strong>
            <span style={{ marginLeft: '8px', opacity: 0.9 }}>{alert.message}</span>
          </div>
          <button
            className="alert-banner-dismiss"
            onClick={() => dismiss(alert._id)}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
