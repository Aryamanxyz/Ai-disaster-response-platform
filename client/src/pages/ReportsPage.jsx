import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useDisaster } from '../context/DisasterContext';

const ReportsPage = () => {
  const { incidents, resources, alerts } = useDisaster();

  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter(i => i.status === 'active').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
  const criticalIncidents = incidents.filter(i => i.severity >= 8).length;
  const totalAffected = incidents.reduce((sum, i) => sum + (i.affectedPeople || 0), 0);

  const totalResources = resources.length;
  const availableResources = resources.filter(r => r.status === 'available').length;
  const deployedResources = resources.filter(r => r.status === 'deployed').length;

  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical').length;

  const incidentsByType = incidents.reduce((acc, inc) => {
    acc[inc.type] = (acc[inc.type] || 0) + 1;
    return acc;
  }, {});

  const incidentsByState = incidents.reduce((acc, inc) => {
    const state = inc.location?.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const avgSeverity = incidents.length > 0
    ? (incidents.reduce((sum, i) => sum + i.severity, 0) / incidents.length).toFixed(1)
    : 0;

  return (
    <div style={styles.container}>
      <Navbar />
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Reports & Analytics</h1>
          <p style={styles.subtitle}>Project ka poora overview</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>🚨 Incidents Overview</h3>
            <div style={styles.statItems}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Total</span>
                <span style={{ ...styles.statValue, color: '#f1f5f9' }}>{totalIncidents}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Active</span>
                <span style={{ ...styles.statValue, color: '#ef4444' }}>{activeIncidents}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Resolved</span>
                <span style={{ ...styles.statValue, color: '#22c55e' }}>{resolvedIncidents}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Critical</span>
                <span style={{ ...styles.statValue, color: '#a855f7' }}>{criticalIncidents}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Avg Severity</span>
                <span style={{ ...styles.statValue, color: '#f59e0b' }}>{avgSeverity}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Total Affected</span>
                <span style={{ ...styles.statValue, color: '#3b82f6' }}>{totalAffected.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>🏕️ Resources Overview</h3>
            <div style={styles.statItems}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Total</span>
                <span style={{ ...styles.statValue, color: '#f1f5f9' }}>{totalResources}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Available</span>
                <span style={{ ...styles.statValue, color: '#22c55e' }}>{availableResources}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Deployed</span>
                <span style={{ ...styles.statValue, color: '#3b82f6' }}>{deployedResources}</span>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>🔔 Alerts Overview</h3>
            <div style={styles.statItems}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Total</span>
                <span style={{ ...styles.statValue, color: '#f1f5f9' }}>{totalAlerts}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Critical</span>
                <span style={{ ...styles.statValue, color: '#ef4444' }}>{criticalAlerts}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📈 Incidents by Type</h3>
            {Object.keys(incidentsByType).length === 0 ? (
              <p style={styles.empty}>Koi data nahi</p>
            ) : (
              Object.entries(incidentsByType).map(([type, count]) => (
                <div key={type} style={styles.barItem}>
                  <span style={styles.barLabel}>{type}</span>
                  <div style={styles.barContainer}>
                    <div style={{
                      ...styles.bar,
                      width: `${(count / totalIncidents) * 100}%`,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    }} />
                  </div>
                  <span style={styles.barCount}>{count}</span>
                </div>
              ))
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🗺️ Incidents by State</h3>
            {Object.keys(incidentsByState).length === 0 ? (
              <p style={styles.empty}>Koi data nahi</p>
            ) : (
              Object.entries(incidentsByState).map(([state, count]) => (
                <div key={state} style={styles.barItem}>
                  <span style={styles.barLabel}>{state}</span>
                  <div style={styles.barContainer}>
                    <div style={{
                      ...styles.bar,
                      width: `${(count / totalIncidents) * 100}%`,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)'
                    }} />
                  </div>
                  <span style={styles.barCount}>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 All Incidents Detail</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Title', 'Type', 'Severity', 'Status', 'Location', 'Affected', 'Date'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#475569' }}>
                    Koi incident nahi hai
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc._id} style={styles.tr}>
                    <td style={styles.td}>{inc.title}</td>
                    <td style={styles.td}>{inc.type}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: inc.severity >= 8 ? '#ef4444' : inc.severity >= 5 ? '#f59e0b' : '#22c55e'
                      }}>
                        {inc.severity}/10
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: inc.status === 'active' ? '#1d4ed8' : '#475569'
                      }}>
                        {inc.status}
                      </span>
                    </td>
                    <td style={styles.td}>{inc.location?.city}, {inc.location?.state}</td>
                    <td style={styles.td}>{inc.affectedPeople?.toLocaleString()}</td>
                    <td style={styles.td}>{new Date(inc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' },
  statTitle: { fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' },
  statItems: { display: 'flex', flexDirection: 'column', gap: '12px' },
  statItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: '#94a3b8', fontSize: '13px' },
  statValue: { fontSize: '20px', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155', marginBottom: '16px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' },
  empty: { color: '#475569', textAlign: 'center', padding: '20px' },
  barItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  barLabel: { color: '#94a3b8', fontSize: '13px', width: '100px', textTransform: 'capitalize' },
  barContainer: { flex: 1, background: '#0f172a', borderRadius: '4px', height: '8px' },
  bar: { height: '8px', borderRadius: '4px', transition: 'width 0.3s ease' },
  barCount: { color: '#f1f5f9', fontSize: '13px', fontWeight: '600', width: '24px', textAlign: 'right' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: '#94a3b8', fontSize: '12px', fontWeight: '600', padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #334155', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #1e293b' },
  td: { color: '#f1f5f9', fontSize: '13px', padding: '12px', verticalAlign: 'middle' },
  badge: { color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }
};

export default ReportsPage;