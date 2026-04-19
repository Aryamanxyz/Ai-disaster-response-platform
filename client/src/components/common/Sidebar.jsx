import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/incidents', icon: '🚨', label: 'Incidents' },
    { path: '/resources', icon: '🏕️', label: 'Resources' },
    { path: '/ai-assistant', icon: '🤖', label: 'AI Assistant' },
    { path: '/reports', icon: '📊', label: 'Reports' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.userCard}>
        <div style={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.menuItem,
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                borderColor: isActive ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
                color: isActive ? '#3b82f6' : '#64748b'
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
              {isActive && <span style={styles.activeDot}></span>}
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.footerCard}>
          <p style={styles.footerTitle}>AI Disaster Response</p>
          <p style={styles.footerVersion}>v1.0.0 — Beta</p>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'fixed',
    top: '64px',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    zIndex: 90
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '20px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '15px',
    flexShrink: 0
  },
  userName: {
    color: '#f1f5f9',
    fontSize: '13px',
    fontWeight: '600'
  },
  userRole: {
    color: '#64748b',
    fontSize: '11px',
    textTransform: 'capitalize',
    marginTop: '2px'
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    border: '1px solid transparent',
    transition: 'all 0.2s',
    textDecoration: 'none',
    position: 'relative'
  },
  icon: {
    fontSize: '16px'
  },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#3b82f6',
    marginLeft: 'auto',
    boxShadow: '0 0 6px #3b82f6'
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  footerCard: {
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  footerTitle: {
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600'
  },
  footerVersion: {
    color: '#334155',
    fontSize: '10px',
    marginTop: '2px'
  }
};

export default Sidebar;