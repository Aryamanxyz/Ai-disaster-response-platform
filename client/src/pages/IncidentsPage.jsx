import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useDisaster } from '../context/DisasterContext';
import api from '../api/axiosInstance';

const IncidentsPage = () => {
  const { incidents, fetchIncidents } = useDisaster();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    type: 'flood',
    severity: 5,
    description: '',
    affectedPeople: 0,
    location: { city: '', state: '', coordinates: { lat: '', lng: '' } }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData({ ...formData, location: { ...formData.location, [name]: value } });
    } else if (name === 'lat' || name === 'lng') {
      setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, [name]: value } } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/incidents', formData);
      await fetchIncidents();
      setShowForm(false);
      setFormData({
        title: '',
        type: 'flood',
        severity: 5,
        description: '',
        affectedPeople: 0,
        location: { city: '', state: '', coordinates: { lat: '', lng: '' } }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating incident');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This incident will be deleted!')) return;
    try {
      await api.delete(`/incidents/${id}`);
      await fetchIncidents();
    } catch (err) {
      console.log('Delete error:', err.message);
    }
  };

  const handleAnalyze = async (incidentId) => {
    setAnalyzing(incidentId);
    try {
      const res = await api.get(`/ai/analyze/${incidentId}`);
      setAnalysisResults(prev => ({ ...prev, [incidentId]: res.data }));
    } catch (err) {
      console.log('Analysis error:', err.message);
    } finally {
      setAnalyzing(null);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 8) return '#ef4444';
    if (severity >= 5) return '#f59e0b';
    return '#22c55e';
  };

  const getSeverityBg = (severity) => {
    if (severity >= 8) return 'rgba(239,68,68,0.15)';
    if (severity >= 5) return 'rgba(245,158,11,0.15)';
    return 'rgba(34,197,94,0.15)';
  };

  const getRiskColor = (risk) => {
    if (risk === 'critical') return '#ef4444';
    if (risk === 'high') return '#f59e0b';
    if (risk === 'medium') return '#3b82f6';
    return '#22c55e';
  };

  const getTypeIcon = (type) => {
    const icons = { flood: '🌊', earthquake: '🌍', fire: '🔥', cyclone: '🌀', landslide: '⛰️', drought: '☀️', other: '⚠️' };
    return icons[type] || '⚠️';
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🚨 Incidents</h1>
            <p style={styles.subtitle}>{incidents.length} total incidents reported</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={showForm ? styles.cancelBtn : styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ New Incident'}
          </button>
        </div>

        {showForm && (
          <div style={styles.form}>
            <h2 style={styles.formTitle}>📋 New Incident Report</h2>
            {error && <div style={styles.error}>⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} style={styles.input} placeholder="Incident title" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} style={styles.input}>
                    <option value="flood">🌊 Flood</option>
                    <option value="earthquake">🌍 Earthquake</option>
                    <option value="fire">🔥 Fire</option>
                    <option value="cyclone">🌀 Cyclone</option>
                    <option value="landslide">⛰️ Landslide</option>
                    <option value="drought">☀️ Drought</option>
                    <option value="other">⚠️ Other</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Severity (1-10): <span style={{ color: getSeverityColor(formData.severity), fontWeight: '700' }}>{formData.severity}</span></label>
                  <input type="range" name="severity" min="1" max="10" value={formData.severity} onChange={handleChange} style={{ width: '100%', accentColor: getSeverityColor(formData.severity) }} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Affected People</label>
                  <input type="number" name="affectedPeople" value={formData.affectedPeople} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>City</label>
                  <input name="city" value={formData.location.city} onChange={handleChange} style={styles.input} placeholder="City" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>State</label>
                  <input name="state" value={formData.location.state} onChange={handleChange} style={styles.input} placeholder="State" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Latitude</label>
                  <input name="lat" value={formData.location.coordinates.lat} onChange={handleChange} style={styles.input} placeholder="28.6692" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Longitude</label>
                  <input name="lng" value={formData.location.coordinates.lng} onChange={handleChange} style={styles.input} placeholder="77.4538" />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...styles.input, height: '80px', resize: 'vertical' }} placeholder="Describe the incident..." />
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? '⟳ Creating...' : '✓ Create Incident'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.list}>
          {incidents.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>✅</p>
              <p style={{ color: '#475569', fontSize: '14px' }}>No incidents reported — Create a new incident</p>
            </div>
          ) : (
            incidents.map((incident) => (
              <div key={incident._id} style={styles.incidentCard}>
                <div style={{
                  ...styles.severityStrip,
                  background: `linear-gradient(180deg, ${getSeverityColor(incident.severity)}, transparent)`
                }} />

                <div style={styles.cardTop}>
                  <div style={styles.cardLeft}>
                    <div style={styles.typeIconBox}>
                      <span style={{ fontSize: '24px' }}>{getTypeIcon(incident.type)}</span>
                    </div>
                    <div>
                      <h3 style={styles.incidentTitle}>{incident.title}</h3>
                      <p style={styles.incidentMeta}>
                        📍 {incident.location.city}, {incident.location.state} &nbsp;·&nbsp;
                        👥 {incident.affectedPeople?.toLocaleString()} affected &nbsp;·&nbsp;
                        🕒 {new Date(incident.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div style={styles.badges}>
                    <span style={{
                      ...styles.badge,
                      background: getSeverityBg(incident.severity),
                      color: getSeverityColor(incident.severity),
                      border: `1px solid ${getSeverityColor(incident.severity)}40`
                    }}>
                      ⚡ {incident.severity}/10
                    </span>
                    <span style={{
                      ...styles.badge,
                      background: incident.status === 'active' ? 'rgba(59,130,246,0.15)' : 'rgba(71,85,105,0.15)',
                      color: incident.status === 'active' ? '#3b82f6' : '#64748b',
                      border: `1px solid ${incident.status === 'active' ? '#3b82f640' : '#47556940'}`
                    }}>
                      {incident.status}
                    </span>
                    <span style={{
                      ...styles.badge,
                      background: 'rgba(255,255,255,0.05)',
                      color: '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textTransform: 'capitalize'
                    }}>
                      {incident.type}
                    </span>
                    <button
                      onClick={() => handleAnalyze(incident._id)}
                      style={{ ...styles.analyzeBtn, opacity: analyzing === incident._id ? 0.7 : 1 }}
                      disabled={analyzing === incident._id}
                    >
                      {analyzing === incident._id ? '⟳ Analyzing...' : '🔍 Analyze'}
                    </button>
                    <button onClick={() => handleDelete(incident._id)} style={styles.deleteBtn}>
                      🗑️
                    </button>
                  </div>
                </div>

                {incident.description && (
                  <p style={styles.description}>{incident.description}</p>
                )}

                {analysisResults[incident._id] && (
                  <div style={styles.analysisContainer}>
                    <div style={styles.analysisBox}>
                      <h4 style={styles.analysisTitle}>🤖 Groq AI Analysis</h4>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Risk Level</span>
                        <span style={{ color: getRiskColor(analysisResults[incident._id].analysis?.riskLevel), fontWeight: '600', textTransform: 'capitalize', fontSize: '13px' }}>
                          {analysisResults[incident._id].analysis?.riskLevel}
                        </span>
                      </div>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Severity</span>
                        <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{analysisResults[incident._id].analysis?.severity}/10</span>
                      </div>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Duration</span>
                        <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{analysisResults[incident._id].analysis?.estimatedDuration}</span>
                      </div>
                      <p style={{ color: '#475569', fontSize: '11px', marginTop: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommendations</p>
                      {analysisResults[incident._id].analysis?.recommendations?.map((rec, i) => (
                        <p key={i} style={styles.recItem}>→ {rec}</p>
                      ))}
                    </div>

                    <div style={styles.analysisBox}>
                      <h4 style={styles.analysisTitle}>🧠 ML Prediction</h4>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Risk Level</span>
                        <span style={{ color: getRiskColor(analysisResults[incident._id].mlPrediction?.risk_level), fontWeight: '600', textTransform: 'capitalize', fontSize: '13px' }}>
                          {analysisResults[incident._id].mlPrediction?.risk_level}
                        </span>
                      </div>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Predicted Severity</span>
                        <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{analysisResults[incident._id].mlPrediction?.predicted_severity}/10</span>
                      </div>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Disaster Type</span>
                        <span style={{ color: '#f1f5f9', fontSize: '13px', textTransform: 'capitalize' }}>{analysisResults[incident._id].mlPrediction?.disaster_type}</span>
                      </div>
                      <div style={styles.analysisRow}>
                        <span style={styles.analysisLabel}>Affected People</span>
                        <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{analysisResults[incident._id].mlPrediction?.affected_people?.toLocaleString()}</span>
                      </div>
                      <p style={{ color: '#475569', fontSize: '11px', marginTop: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Immediate Actions</p>
                      {analysisResults[incident._id].analysis?.immediateActions?.map((action, i) => (
                        <p key={i} style={styles.recItem}>→ {action}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
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
  addBtn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  form: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' },
  error: { background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  inputGroup: { marginBottom: '0' },
  label: { display: 'block', color: '#475569', fontSize: '12px', marginBottom: '6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '13px', boxSizing: 'border-box', outline: 'none' },
  submitBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '11px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  incidentCard: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' },
  severityStrip: { position: 'absolute', top: 0, left: 0, width: '3px', height: '100%' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  typeIconBox: { width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  incidentTitle: { fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '4px' },
  incidentMeta: { color: '#475569', fontSize: '12px' },
  badges: { display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' },
  badge: { padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '500' },
  analyzeBtn: { background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' },
  deleteBtn: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' },
  description: { color: '#475569', fontSize: '13px', marginTop: '10px', paddingLeft: '58px', lineHeight: '1.5' },
  empty: { textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' },
  analysisContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' },
  analysisBox: { padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' },
  analysisTitle: { color: '#f1f5f9', fontSize: '13px', fontWeight: '600', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  analysisRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  analysisLabel: { color: '#475569', fontSize: '12px' },
  recItem: { color: '#64748b', fontSize: '12px', marginBottom: '4px', lineHeight: '1.4' }
};

export default IncidentsPage;