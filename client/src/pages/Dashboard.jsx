import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useDisaster } from '../context/DisasterContext';
import DisasterMap from '../components/map/DisasterMap';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { incidents, alerts, resources, loading } = useDisaster();
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await api.get('/news');
        setNews(res.data.articles || []);
      } catch (err) {
        console.log('News fetch error:', err.message);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = incidents.filter(i => i.status === 'active').length;
  const availableResources = resources.filter(r => r.status === 'available').length;
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const criticalIncidents = incidents.filter(i => i.severity >= 8).length;

  const statCards = [
    { label: 'Active Incidents', value: activeIncidents, icon: '🚨', color: '#ef4444', glow: 'rgba(239,68,68,0.3)', path: '/incidents' },
    { label: 'Available Resources', value: availableResources, icon: '🏕️', color: '#22c55e', glow: 'rgba(34,197,94,0.3)', path: '/resources' },
    { label: 'Unread Alerts', value: unreadAlerts, icon: '🔔', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', path: '/alerts' },
    { label: 'Critical Incidents', value: criticalIncidents, icon: '⚠️', color: '#a855f7', glow: 'rgba(168,85,247,0.3)', path: '/incidents' },
  ];

  return (
    <div style={styles.container}>
      <Navbar />
      <Sidebar />

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Real-time Disaster Response Overview</p>
          </div>
          <div style={styles.headerBadge}>
            <span style={styles.headerDot}></span>
            System Operational
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}>⟳</div>
            Loading...
          </div>
        ) : (
          <>
            <div style={styles.statsGrid}>
              {statCards.map((card, index) => (
                <Link key={index} to={card.path} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      ...styles.statCard,
                      transform: hoveredCard === index ? 'translateY(-6px)' : 'translateY(0)',
                      boxShadow: hoveredCard === index ? `0 20px 40px ${card.glow}` : '0 4px 20px rgba(0,0,0,0.3)',
                      border: hoveredCard === index ? `1px solid ${card.color}60` : '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={{
                      ...styles.statIconBox,
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}30`
                    }}>
                      <span style={styles.statIcon}>{card.icon}</span>
                    </div>
                    <div style={styles.statLeft}>
                      <p style={styles.statLabel}>{card.label}</p>
                      <p style={{ ...styles.statValue, color: card.color }}>{card.value}</p>
                    </div>
                    {hoveredCard === index && (
                      <div style={{ ...styles.cardGlow, background: `radial-gradient(circle at top right, ${card.color}15, transparent)` }} />
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>🗺️ Live Disaster Map</h2>
                <span style={styles.liveTag}>● LIVE</span>
              </div>
              <DisasterMap />
            </div>

            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>🚨 Recent Incidents</h2>
                  <Link to="/incidents" style={styles.viewAll}>View All →</Link>
                </div>
                {incidents.length === 0 ? (
                  <p style={styles.empty}>No incidents reported</p>
                ) : (
                  incidents.slice(0, 5).map((incident) => (
                    <div key={incident._id} style={styles.incidentItem}>
                      <div style={{
                        ...styles.severityBar,
                        background: incident.severity >= 8 ? '#ef4444' :
                          incident.severity >= 5 ? '#f59e0b' : '#22c55e'
                      }} />
                      <div style={styles.incidentLeft}>
                        <p style={styles.incidentTitle}>{incident.title}</p>
                        <p style={styles.incidentMeta}>
                          📍 {incident.location.city}, {incident.location.state}
                        </p>
                      </div>
                      <div style={styles.incidentRight}>
                        <span style={{
                          ...styles.severityBadge,
                          background: incident.severity >= 8 ? 'rgba(239,68,68,0.15)' :
                            incident.severity >= 5 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                          color: incident.severity >= 8 ? '#ef4444' :
                            incident.severity >= 5 ? '#f59e0b' : '#22c55e',
                          border: `1px solid ${incident.severity >= 8 ? '#ef444440' : incident.severity >= 5 ? '#f59e0b40' : '#22c55e40'}`
                        }}>
                          {incident.severity}/10
                        </span>
                        <span style={{
                          ...styles.statusBadge,
                          background: incident.status === 'active' ? 'rgba(29,78,216,0.15)' : 'rgba(71,85,105,0.15)',
                          color: incident.status === 'active' ? '#3b82f6' : '#64748b',
                          border: `1px solid ${incident.status === 'active' ? '#3b82f640' : '#47556940'}`
                        }}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>🔔 Recent Alerts</h2>
                  <Link to="/alerts" style={styles.viewAll}>View All →</Link>
                </div>
                {alerts.length === 0 ? (
                  <p style={styles.empty}>No alerts</p>
                ) : (
                  alerts.slice(0, 5).map((alert) => (
                    <div key={alert._id} style={styles.alertItem}>
                      <div style={{
                        ...styles.alertDot,
                        background: alert.type === 'critical' ? '#ef4444' :
                          alert.type === 'warning' ? '#f59e0b' : '#3b82f6',
                        boxShadow: `0 0 8px ${alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6'}`
                      }} />
                      <div>
                        <p style={styles.alertTitle}>{alert.title}</p>
                        <p style={styles.alertMeta}>{alert.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ ...styles.card, marginTop: '20px' }}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>📰 Live Disaster News</h2>
                <span style={styles.newsCount}>{news.length} articles</span>
              </div>
              {newsLoading ? (
                <p style={styles.empty}>Fetching latest news...</p>
              ) : news.length === 0 ? (
                <p style={styles.empty}>No disaster news at the moment</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {news.map((article, index) => (
                    <div key={index} style={styles.newsCard}>
                      <span style={{
                        ...styles.newsTypeBadge,
                        background: article.disasterType === 'flood' ? 'rgba(29,78,216,0.2)' :
                          article.disasterType === 'earthquake' ? 'rgba(220,38,38,0.2)' :
                          article.disasterType === 'cyclone' ? 'rgba(124,58,237,0.2)' : 'rgba(217,119,6,0.2)',
                        color: article.disasterType === 'flood' ? '#3b82f6' :
                          article.disasterType === 'earthquake' ? '#ef4444' :
                          article.disasterType === 'cyclone' ? '#8b5cf6' : '#f59e0b',
                        border: `1px solid ${article.disasterType === 'flood' ? '#3b82f640' : article.disasterType === 'earthquake' ? '#ef444440' : article.disasterType === 'cyclone' ? '#8b5cf640' : '#f59e0b40'}`
                      }}>
                        {article.disasterType}
                      </span>
                      <div style={{ flex: 1 }}>
                        <a href={article.url} target="_blank" rel="noreferrer" style={styles.newsTitle}>
                          {article.title}
                        </a>
                        <p style={styles.newsMeta}>
                          📰 {article.source} &nbsp;|&nbsp;
                          🕒 {new Date(article.publishedAt).toLocaleDateString('en-IN')}
                        </p>
                        <p style={styles.newsDesc}>{article.description?.slice(0, 120)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#020817' },
  main: { marginLeft: '240px', marginTop: '64px', padding: '28px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.5px' },
  subtitle: { color: '#475569', fontSize: '13px', marginTop: '4px' },
  headerBadge: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', padding: '6px 14px', borderRadius: '20px', color: '#22c55e', fontSize: '12px', fontWeight: '600' },
  headerDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' },
  loading: { color: '#475569', textAlign: 'center', padding: '60px', fontSize: '14px' },
  loadingSpinner: { fontSize: '24px', marginBottom: '8px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  statCard: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  statIconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statIcon: { fontSize: '22px' },
  statLeft: { flex: 1 },
  statLabel: { color: '#475569', fontSize: '12px', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '30px', fontWeight: '700', letterSpacing: '-1px' },
  cardGlow: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' },
  card: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '14px', fontWeight: '600', color: '#f1f5f9', letterSpacing: '0.2px' },
  liveTag: { color: '#22c55e', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  viewAll: { color: '#3b82f6', fontSize: '12px', textDecoration: 'none', fontWeight: '500' },
  newsCount: { color: '#475569', fontSize: '12px' },
  empty: { color: '#334155', textAlign: 'center', padding: '24px', fontSize: '13px' },
  incidentItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  severityBar: { width: '3px', height: '36px', borderRadius: '2px', flexShrink: 0 },
  incidentLeft: { flex: 1 },
  incidentTitle: { color: '#e2e8f0', fontSize: '13px', fontWeight: '500' },
  incidentMeta: { color: '#475569', fontSize: '11px', marginTop: '2px' },
  incidentRight: { display: 'flex', gap: '6px', alignItems: 'center' },
  severityBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' },
  statusBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '500' },
  alertItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  alertDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0 },
  alertTitle: { color: '#e2e8f0', fontSize: '13px', fontWeight: '500' },
  alertMeta: { color: '#475569', fontSize: '11px', marginTop: '2px' },
  newsCard: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' },
  newsTypeBadge: { padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap', marginTop: '2px' },
  newsTitle: { color: '#e2e8f0', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'block', marginBottom: '4px' },
  newsMeta: { color: '#334155', fontSize: '11px', marginBottom: '4px' },
  newsDesc: { color: '#475569', fontSize: '12px', lineHeight: '1.5' }
};

export default Dashboard;