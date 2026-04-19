import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useDisaster } from '../context/DisasterContext';
import api from '../api/axiosInstance';

const ResourcesPage = () => {
  const { resources, incidents, fetchResources } = useDisaster();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'ambulance',
    quantity: 1,
    location: { city: '', state: '' },
    contactPerson: { name: '', phone: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData({ ...formData, location: { ...formData.location, [name]: value } });
    } else if (name === 'contactName') {
      setFormData({ ...formData, contactPerson: { ...formData.contactPerson, name: value } });
    } else if (name === 'contactPhone') {
      setFormData({ ...formData, contactPerson: { ...formData.contactPerson, phone: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/resources', formData);
      await fetchResources();
      setShowForm(false);
      setFormData({
        name: '',
        type: 'ambulance',
        quantity: 1,
        location: { city: '', state: '' },
        contactPerson: { name: '', phone: '' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating resource');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async (resourceId, incidentId) => {
    try {
      await api.post('/resources/allocate', { resourceId, incidentId });
      await fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Allocation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This resource will be deleted!')) return;
    try {
      await api.delete(`/resources/${id}`);
      await fetchResources();
    } catch (err) {
      console.log('Delete error:', err.message);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'available') return '#22c55e';
    if (status === 'deployed') return '#3b82f6';
    if (status === 'maintenance') return '#f59e0b';
    return '#ef4444';
  };

  const getStatusBg = (status) => {
    if (status === 'available') return 'rgba(34,197,94,0.1)';
    if (status === 'deployed') return 'rgba(59,130,246,0.1)';
    if (status === 'maintenance') return 'rgba(245,158,11,0.1)';
    return 'rgba(239,68,68,0.1)';
  };

  const getTypeIcon = (type) => {
    const icons = {
      ambulance: '🚑',
      fire_truck: '🚒',
      rescue_team: '👷',
      helicopter: '🚁',
      medical_supply: '💊',
      food: '🍱',
      shelter: '🏕️',
      other: '📦'
    };
    return icons[type] || '📦';
  };

  const availableCount = resources.filter(r => r.status === 'available').length;
  const deployedCount = resources.filter(r => r.status === 'deployed').length;

  return (
    <div style={styles.container}>
      <Navbar />
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🏕️ Resources</h1>
            <p style={styles.subtitle}>{resources.length} total resources</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={showForm ? styles.cancelBtn : styles.addBtn}>
            {showForm ? '✕ Cancel' : '+ New Resource'}
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statChip}>
            <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '18px' }}>{availableCount}</span>
            <span style={{ color: '#475569', fontSize: '12px' }}>Available</span>
          </div>
          <div style={styles.statChip}>
            <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '18px' }}>{deployedCount}</span>
            <span style={{ color: '#475569', fontSize: '12px' }}>Deployed</span>
          </div>
          <div style={styles.statChip}>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '18px' }}>{resources.length - availableCount - deployedCount}</span>
            <span style={{ color: '#475569', fontSize: '12px' }}>Maintenance</span>
          </div>
        </div>

        {showForm && (
          <div style={styles.form}>
            <h2 style={styles.formTitle}>📦 Add New Resource</h2>
            {error && <div style={styles.error}>⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Resource Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="Resource name" required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} style={styles.input}>
                    <option value="ambulance">🚑 Ambulance</option>
                    <option value="fire_truck">🚒 Fire Truck</option>
                    <option value="rescue_team">👷 Rescue Team</option>
                    <option value="helicopter">🚁 Helicopter</option>
                    <option value="medical_supply">💊 Medical Supply</option>
                    <option value="food">🍱 Food</option>
                    <option value="shelter">🏕️ Shelter</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} style={styles.input} min="1" />
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
                  <label style={styles.label}>Contact Person</label>
                  <input name="contactName" value={formData.contactPerson.name} onChange={handleChange} style={styles.input} placeholder="Contact name" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contact Phone</label>
                  <input name="contactPhone" value={formData.contactPerson.phone} onChange={handleChange} style={styles.input} placeholder="Phone number" />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? '⟳ Adding...' : '✓ Add Resource'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.grid}>
          {resources.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>📦</p>
              <p style={{ color: '#475569', fontSize: '14px' }}>No resources added — Add a new resource</p>
            </div>
          ) : (
            resources.map((resource) => (
              <div key={resource._id} style={styles.resourceCard}>
                <div style={{
                  ...styles.cardTopStrip,
                  background: `linear-gradient(90deg, ${getStatusColor(resource.status)}20, transparent)`
                }} />

                <div style={styles.cardHeader}>
                  <div style={styles.typeIconBox}>
                    <span style={{ fontSize: '26px' }}>{getTypeIcon(resource.type)}</span>
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.resourceName}>{resource.name}</h3>
                    <p style={styles.resourceMeta}>{resource.type.replace('_', ' ')}</p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    color: getStatusColor(resource.status),
                    background: getStatusBg(resource.status),
                    border: `1px solid ${getStatusColor(resource.status)}30`
                  }}>
                    {resource.status}
                  </span>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>📦</span>
                    <span style={styles.detailText}>Qty: <strong style={{ color: '#f1f5f9' }}>{resource.quantity}</strong></span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>📍</span>
                    <span style={styles.detailText}>{resource.location.city}, {resource.location.state}</span>
                  </div>
                  {resource.contactPerson?.name && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailIcon}>👤</span>
                      <span style={styles.detailText}>{resource.contactPerson.name} · {resource.contactPerson.phone}</span>
                    </div>
                  )}
                </div>

                {resource.status === 'available' && incidents.length > 0 && (
                  <div style={styles.allocateSection}>
                    <select
                      style={styles.allocateSelect}
                      onChange={(e) => {
                        if (e.target.value) handleAllocate(resource._id, e.target.value);
                      }}
                      defaultValue=""
                    >
                      <option value="">⚡ Allocate to incident</option>
                      {incidents
                        .filter(i => i.status === 'active')
                        .map(incident => (
                          <option key={incident._id} value={incident._id}>
                            {incident.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <button onClick={() => handleDelete(resource._id)} style={styles.deleteBtn}>
                  🗑️ Delete Resource
                </button>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.5px' },
  subtitle: { color: '#475569', fontSize: '13px', marginTop: '4px' },
  addBtn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '24px' },
  statChip: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '12px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' },
  form: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' },
  error: { background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  inputGroup: { marginBottom: '0' },
  label: { display: 'block', color: '#475569', fontSize: '12px', marginBottom: '6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '13px', boxSizing: 'border-box', outline: 'none' },
  submitBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '11px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  resourceCard: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' },
  cardTopStrip: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  typeIconBox: { width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardInfo: { flex: 1 },
  resourceName: { fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '2px' },
  resourceMeta: { color: '#475569', fontSize: '12px', textTransform: 'capitalize' },
  statusBadge: { padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap', textTransform: 'capitalize' },
  cardDetails: { borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  detailIcon: { fontSize: '13px' },
  detailText: { color: '#475569', fontSize: '12px' },
  allocateSection: { marginBottom: '10px' },
  allocateSelect: { width: '100%', padding: '8px 12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', outline: 'none' },
  deleteBtn: { width: '100%', marginTop: '4px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', gridColumn: '1 / -1' }
};

export default ResourcesPage;