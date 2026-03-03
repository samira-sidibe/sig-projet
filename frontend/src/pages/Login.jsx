import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Partie gauche */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>🚗</div>
          <h1 style={styles.leftTitle}>SIG Fleet Tracker</h1>
          <p style={styles.leftSubtitle}>
            Système de suivi de flotte avec géolocalisation en temps réel
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>📍 Suivi GPS en temps réel</div>
            <div style={styles.feature}>🗺️ Visualisation sur carte interactive</div>
            <div style={styles.feature}>📊 Historique des trajets</div>
            <div style={styles.feature}>🔍 Recherche géographique</div>
          </div>
        </div>
      </div>

      {/* Partie droite */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Connexion</h2>
          <p style={styles.subtitle}>Entrez vos identifiants pour accéder à la plateforme</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Nom d'utilisateur</label>
              <input
                style={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mot de passe</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} type="submit" disabled={loading}>
              {loading ? '⏳ Connexion en cours...' : 'Se connecter →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  leftContent: {
    color: 'white',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  leftTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  leftSubtitle: {
    fontSize: '18px',
    opacity: 0.85,
    marginBottom: '40px',
    lineHeight: '1.6',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  feature: {
    fontSize: '16px',
    opacity: 0.9,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '12px 20px',
    borderRadius: '8px',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '440px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '32px',
    fontSize: '14px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: '600',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px',
    transition: 'background-color 0.2s',
  },
  error: {
    backgroundColor: '#fdecea',
    color: '#d32f2f',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default Login;