import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        🚗 SIG Fleet Tracker
      </div>
      <div style={styles.links}>
        <Link style={styles.link} to="/dashboard">🗺️ Carte</Link>
        <Link style={styles.link} to="/vehicles">🚙 Véhicules</Link>
      </div>
      <div style={styles.user}>
        <span style={styles.username}>👤 {user?.username}</span>
        <button style={styles.button} onClick={handleLogout}>
          Déconnexion
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
    backgroundColor: '#1a73e8',
    padding: '0 24px',
    height: '60px',
    color: 'white',
  },
  brand: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '14px',
  },
  button: {
    backgroundColor: 'white',
    color: '#1a73e8',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Navbar;