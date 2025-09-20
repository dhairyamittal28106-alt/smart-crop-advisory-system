// components/ui/weather.tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchWeatherAlerts } from '../../lib/weather';

export default function WeatherAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await fetchWeatherAlerts(31.1471, 75.3412); // Example: Ludhiana, Punjab
      setAlerts(data);
    };
    loadAlerts();
  }, []);

  return (
    <div className="alert-container">
      <h2>Active Alerts</h2>
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div key={index} className="alert-card">
            <h3>{typeof alert === 'string' ? alert : alert.event || 'Weather Condition'}</h3>
            <p>{typeof alert === 'string' ? '' : alert.description || 'No description'}</p>
          </div>
        ))
      ) : (
        <p>No active alerts.</p>
      )}
    </div>
  );
}