import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useDisaster } from '../context/DisasterContext';
import { useEffect } from 'react';

const AlertsPage = () => {
  const { alerts, markAllAsRead } = useDisaster();

  useEffect(() => {
    markAllAsRead();
  },[]);

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#ef4444';
    if (severity === 'high') return '#f59e0b';
    if (severity === 'medium') return '#3b82f6';
    return '#22c55e';
  };

  const getTypeIcon = (type) => {
    const icons = {
      flood: '🌊',
      earthquake: '🌍',
      cyclone: '🌀',
      fire: '🔥',
      landslide: '⛰️',
      drought: '☀️'
    };
    return icons[type] || '🚨';
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔔 Alerts</h1>
          <p style={styles.subtitle}>{alerts.length} total alerts</p>
        </div>

        {alerts.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>🎉 Koi active alert nahi hai!</p>
          </div>
        ) : (
          <div style={styles.alertsList}>
            {alerts.map((alert, index) => (
              <div key={alert._id || index} style={styles.alertCard}>
                <div style={styles.alertLeft}>
                  <span style={styles.alertIcon}>
                    {getTypeIcon(alert.type)}
                  </span>
                  <div>
                    <h3 style={styles.alertTitle}>{alert.title || alert.message}</h3>
                    <p style={styles.alertMeta}>
                      {alert.location?.city && `📍 ${alert.location.city}, ${alert.location.state}`}
                    </p>
                    <p style={styles.alertTime}>
                      🕐 🕐 {alert.createdAt ? new Date(alert.createdAt).toLocaleString('en-IN') : 'Date unavailable'}
                    </p>
                  </div>
                </div>
                <div style={styles.alertRight}>
                  <span style={{
                    ...styles.severityBadge,
                    background: getSeverityColor(alert.severity || alert.riskLevel)
                  }}>
                    {alert.severity || alert.riskLevel || 'medium'}
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    background: alert.isRead ? '#475569' : '#1d4ed8'
                  }}>
                    {alert.isRead ? 'Read' : 'New'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#0f172a' },
  main: { marginLeft: '240px', marginTop: '64px', padding: '24px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' },
  subtitle: { color: '#94a3b8', fontSize: '14px', marginTop: '4px' },
  empty: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' },
  emptyText: { color: '#94a3b8', fontSize: '18px' },
  alertsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  alertCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  alertLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  alertIcon: { fontSize: '32px' },
  alertTitle: { color: '#f1f5f9', fontSize: '15px', fontWeight: '600', marginBottom: '4px' },
  alertMeta: { color: '#94a3b8', fontSize: '12px', marginBottom: '2px' },
  alertTime: { color: '#475569', fontSize: '11px' },
  alertRight: { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' },
  severityBadge: { color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize' },
  statusBadge: { color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }
};

export default AlertsPage;