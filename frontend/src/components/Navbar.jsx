import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🚗</span>
        <span style={styles.brandText}>SIG Fleet CI</span>
      </div>

      {/* Links */}
      <div style={styles.links}>
        <Link to="/dashboard" style={{
          ...styles.link,
          backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent',
          fontWeight: isActive('/dashboard') ? '600' : 'normal',
        }}>
          🗺️ Carte
        </Link>
        <Link to="/vehicles" style={{
          ...styles.link,
          backgroundColor: isActive('/vehicles') ? 'rgba(255,255,255,0.2)' : 'transparent',
          fontWeight: isActive('/vehicles') ? '600' : 'normal',
        }}>
          🚙 Véhicules
        </Link>
        <Link to="/positions" style={{
          ...styles.link,
          backgroundColor: isActive('/positions') ? 'rgba(255,255,255,0.2)' : 'transparent',
          fontWeight: isActive('/positions') ? '600' : 'normal',
        }}>
          📡 Positions
        </Link>
      </div>

      {/* User */}
      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.username}>{user?.username}</div>
            <div style={styles.role}>{user?.role}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Déconnexion
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
    background: 'linear-gradient(135deg, #7b2ff7 0%, #4a0080 100%)',
    padding: '0 24px',
    height: '64px',
    color: 'white',
    boxShadow: '0 2px 12px rgba(123,47,247,0.4)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandIcon: { fontSize: '24px' },
  brandText: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  username: { fontSize: '14px', fontWeight: '600' },
  role: {
    fontSize: '11px',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
};

export default Navbar;