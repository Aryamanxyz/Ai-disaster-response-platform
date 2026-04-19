import { useAuth } from '../../context/AuthContext';
import { useDisaster } from '../../context/DisasterContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { alerts } = useDisaster();
  const navigate = useNavigate();

  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🚨</span>
          <span style={styles.logoText}>DisasterAI</span>
        </div>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot}></span>
          <span style={styles.liveText}>LIVE</span>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.alertBox} onClick={() => navigate('/alerts')}>
          <span style={styles.bellIcon}>🔔</span>
          {unreadAlerts > 0 && (
            <span style={styles.alertCount}>{unreadAlerts}</span>
          )}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userDetails}>
            <span style={styles.userName}>{user?.name}</span>
            <span style={styles.userRole}>{user?.role}</span>
          </div>
        </div>

        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoIcon: {
    fontSize: '22px'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    padding: '4px 10px',
    borderRadius: '20px'
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
    animation: 'pulse 2s infinite'
  },
  liveText: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#22c55e',
    letterSpacing: '1px'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  alertBox: {
    position: 'relative',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 101,
    pointerEvents: 'auto'
  },
  bellIcon: {
    fontSize: '16px'
  },
  alertCount: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'rgba(255, 255, 255, 0.08)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '14px'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    color: '#f1f5f9',
    fontSize: '13px',
    fontWeight: '600'
  },
  userRole: {
    color: '#64748b',
    fontSize: '11px',
    textTransform: 'capitalize'
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '7px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Navbar;