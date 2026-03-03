import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAllLastPositions } from '../services/api';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [countdown, setCountdown] = useState(10);

  const loadPositions = async () => {
    try {
      const res = await getAllLastPositions();
      setPositions(res.data);
      setLastUpdate(new Date());
      setCountdown(10);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
    const interval = setInterval(loadPositions, 10000);
    return () => clearInterval(interval);
  }, []);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getSpeedColor = (speed) => {
    if (speed === 0) return { bg: '#f5f5f5', color: '#999' };
    if (speed < 50) return { bg: '#e8f5e9', color: '#2e7d32' };
    if (speed < 90) return { bg: '#fff3e0', color: '#e65100' };
    return { bg: '#fdecea', color: '#c62828' };
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>📡 Positions en temps réel</h2>
            <p style={styles.subtitle}>
              Mise à jour toutes les 10 secondes
              {lastUpdate && ` • Dernière mise à jour : ${lastUpdate.toLocaleTimeString()}`}
            </p>
          </div>
          <div style={styles.countdown}>
            <div style={styles.countdownCircle}>
              <span style={styles.countdownNumber}>{countdown}</span>
            </div>
            <span style={styles.countdownLabel}>Prochain rafraîchissement</span>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🚗</span>
            <span style={styles.statValue}>{positions.length}</span>
            <span style={styles.statLabel}>Véhicules actifs</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>⚡</span>
            <span style={styles.statValue}>
              {positions.length > 0
                ? Math.round(positions.reduce((a, b) => a + b.speed, 0) / positions.length)
                : 0} km/h
            </span>
            <span style={styles.statLabel}>Vitesse moyenne</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🏎️</span>
            <span style={styles.statValue}>
              {positions.length > 0
                ? Math.max(...positions.map(p => p.speed))
                : 0} km/h
            </span>
            <span style={styles.statLabel}>Vitesse max</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🛑</span>
            <span style={styles.statValue}>
              {positions.filter(p => p.speed === 0).length}
            </span>
            <span style={styles.statLabel}>Véhicules à l'arrêt</span>
          </div>
        </div>

        {/* Tableau */}
        <div style={styles.card}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingText}>⏳ Chargement des positions...</div>
            </div>
          ) : positions.length === 0 ? (
            <div style={styles.empty}>Aucune position enregistrée</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Véhicule</th>
                  <th style={styles.th}>Plaque</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Latitude</th>
                  <th style={styles.th}>Longitude</th>
                  <th style={styles.th}>Vitesse</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Dernière position</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, i) => {
                  const speedStyle = getSpeedColor(pos.speed);
                  return (
                    <tr key={pos.vehicle_id} style={{
                      ...styles.tr,
                      backgroundColor: i % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                      <td style={styles.td}>{i + 1}</td>
                      <td style={{ ...styles.td, fontWeight: '600', color: '#1a1a2e' }}>
                        {pos.name}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.plate}>{pos.plate_number}</span>
                      </td>
                      <td style={styles.td}>{pos.type || '-'}</td>
                      <td style={styles.td}>
                        <span style={styles.coord}>{parseFloat(pos.latitude).toFixed(4)}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.coord}>{parseFloat(pos.longitude).toFixed(4)}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.speedBadge,
                          backgroundColor: speedStyle.bg,
                          color: speedStyle.color,
                        }}>
                          {pos.speed} km/h
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: pos.status === 'active' ? '#e8f5e9' : '#fdecea',
                          color: pos.status === 'active' ? '#2e7d32' : '#c62828',
                        }}>
                          {pos.status === 'active' ? '● Actif' : '● Inactif'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.time}>
                          {new Date(pos.recorded_at).toLocaleString('fr-FR')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', width: '100%', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' },
  subtitle: { color: '#666', fontSize: '13px' },
  countdown: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  countdownCircle: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#7b2ff7', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  countdownNumber: { color: 'white', fontWeight: 'bold', fontSize: '22px' },
  countdownLabel: { fontSize: '11px', color: '#666' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  statCard: { flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '22px', fontWeight: 'bold', color: '#7b2ff7' },
  statLabel: { fontSize: '12px', color: '#666' },
  card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f3e5ff' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#4a0080', borderBottom: '2px solid #e0e0e0' },
  tr: { borderBottom: '1px solid #f0f0f0', transition: 'background-color 0.2s' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#444' },
  plate: { backgroundColor: '#f3e5ff', color: '#4a0080', padding: '3px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '12px' },
  coord: { fontFamily: 'monospace', fontSize: '12px', color: '#555' },
  speedBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  time: { fontSize: '12px', color: '#888' },
  loadingContainer: { padding: '40px', textAlign: 'center' },
  loadingText: { color: '#666', fontSize: '16px' },
  empty: { padding: '40px', textAlign: 'center', color: '#999' },
};

export default Positions;