import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    phone: '',
    location: { state: '', city: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'state' || e.target.name === 'city') {
      setFormData({ ...formData, location: { ...formData.location, [e.target.name]: e.target.value } });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🚨 DisasterAI</h1>
          <p style={styles.subtitle}>Emergency Response Platform</p>
        </div>

        <h2 style={styles.formTitle}>Register</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Apna naam daalo"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Email daalo"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Password daalo"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="viewer">Viewer</option>
              <option value="responder">Responder</option>
              <option value="coordinator">Coordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                name="state"
                value={formData.location.state}
                onChange={handleChange}
                style={styles.input}
                placeholder="State"
              />
            </div>
            <div style={{ width: '12px' }} />
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleChange}
                style={styles.input}
                placeholder="City"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="Phone number"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Pehle se account hai?{' '}
          <Link to="/login" style={styles.linkText}>Login karo</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '20px'
  },
  card: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #334155'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#f1f5f9'
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: '6px',
    fontSize: '14px'
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '20px'
  },
  error: {
    background: '#450a0a',
    color: '#fca5a5',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px',
    cursor: 'pointer'
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#94a3b8',
    fontSize: '14px'
  },
  linkText: {
    color: '#3b82f6',
    fontWeight: '600'
  }
};

export default RegisterPage;