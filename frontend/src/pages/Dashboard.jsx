import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import { getVehicles, getAllLastPositions } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalPositions: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [vehiclesRes, positionsRes] = await Promise.all([
          getVehicles(),
          getAllLastPositions(),
        ]);
        setStats({
          totalVehicles: vehiclesRes.data.length,
          activeVehicles: vehiclesRes.data.filter(v => v.status === 'active').length,
          totalPositions: positionsRes.data.length,
        });
      } catch (err) {
        console.error('Erreur chargement stats:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar />

      {/* Barre de statistiques */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚗</div>
          <div>
            <div style={styles.statValue}>{stats.totalVehicles}</div>
            <div style={styles.statLabel}>Total véhicules</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <div style={styles.statValue}>{stats.activeVehicles}</div>
            <div style={styles.statLabel}>Véhicules actifs</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📍</div>
          <div>
            <div style={styles.statValue}>{stats.totalPositions}</div>
            <div style={styles.statLabel}>Positions enregistrées</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔄</div>
          <div>
            <div style={styles.statValue}>10s</div>
            <div style={styles.statLabel}>Rafraîchissement auto</div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <MapView />
    </div>
  );
};

const styles = {
  statsBar: {
    display: 'flex',
    gap: '16px',
    padding: '16px 24px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8f9ff',
    padding: '12px 20px',
    borderRadius: '10px',
    flex: 1,
    border: '1px solid #e8eaf6',
  },
  statIcon: {
    fontSize: '28px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
};

export default Dashboard;