import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllLastPositions, getPositionHistory, getNearestVehicle } from '../services/api';

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView = () => {
  const [positions, setPositions] = useState([]);
  const [histories, setHistories] = useState({});
  const [searchLat, setSearchLat] = useState('5.3600');
  const [searchLng, setSearchLng] = useState('-4.0083');
  const [nearestResult, setNearestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPositions = async () => {
    try {
      const res = await getAllLastPositions();
      setPositions(res.data);
      const hist = {};
      for (const pos of res.data) {
        const histRes = await getPositionHistory(pos.vehicle_id);
        hist[pos.vehicle_id] = histRes.data.map((p) => [p.latitude, p.longitude]);
      }
      setHistories(hist);
    } catch (err) {
      console.error('Erreur chargement positions:', err);
    }
  };

  useEffect(() => {
    loadPositions();
    const interval = setInterval(loadPositions, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNearestSearch = async () => {
    setLoading(true);
    try {
      const res = await getNearestVehicle(
        parseFloat(searchLat),
        parseFloat(searchLng)
      );
      setNearestResult(res.data);
    } catch (err) {
      console.error('Erreur recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNearestResult(null);
  };

  const colors = ['#7b2ff7', '#e74c3c', '#2ecc71', '#f39c12', '#3498db'];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 124px)' }}>

      {/* Panel de recherche */}
      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>📍 Véhicule le plus proche</h3>
        <p style={styles.panelSubtitle}>
          Entrez une position pour trouver le véhicule le plus proche
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Latitude</label>
          <input
            style={styles.input}
            type="number"
            step="0.0001"
            value={searchLat}
            onChange={(e) => setSearchLat(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Longitude</label>
          <input
            style={styles.input}
            type="number"
            step="0.0001"
            value={searchLng}
            onChange={(e) => setSearchLng(e.target.value)}
          />
        </div>

        <button
          style={styles.searchBtn}
          onClick={handleNearestSearch}
          disabled={loading}
        >
          {loading ? '⏳ Recherche...' : '🔍 Trouver le plus proche'}
        </button>

        {nearestResult && (
          <button style={styles.resetBtn} onClick={handleReset}>
            ✖ Réinitialiser
          </button>
        )}

        {/* Résultat */}
        {nearestResult && (
          <div style={styles.resultBox}>
            <div style={styles.resultHeader}>🏆 Véhicule le plus proche</div>
            <div style={styles.resultCard}>
              <div style={styles.resultName}>{nearestResult.name}</div>
              <div style={styles.resultInfo}>🪪 {nearestResult.plate_number}</div>
              <div style={styles.resultInfo}>🚗 {nearestResult.type}</div>
              <div style={styles.resultInfo}>
                📏 {(nearestResult.distance / 1000).toFixed(2)} km
              </div>
              <div style={styles.resultInfo}>⚡ {nearestResult.speed} km/h</div>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: nearestResult.status === 'active' ? '#e8f5e9' : '#fdecea',
                color: nearestResult.status === 'active' ? '#2e7d32' : '#c62828',
              }}>
                {nearestResult.status === 'active' ? '● Actif' : '● Inactif'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Carte */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[7.5399, -5.5471]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {positions.map((pos, i) => (
            <div key={pos.vehicle_id}>
              <Marker position={[pos.latitude, pos.longitude]}>
                <Popup>
                  <strong>{pos.name}</strong><br />
                  🪪 {pos.plate_number}<br />
                  🚗 {pos.type}<br />
                  ⚡ {pos.speed} km/h<br />
                  ● {pos.status}
                </Popup>
              </Marker>
              {histories[pos.vehicle_id] && histories[pos.vehicle_id].length > 1 && (
                <Polyline
                  positions={histories[pos.vehicle_id]}
                  color={colors[i % colors.length]}
                  weight={3}
                />
              )}
            </div>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

const styles = {
  panel: {
    width: '300px',
    backgroundColor: 'white',
    padding: '20px',
    overflowY: 'auto',
    boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
    zIndex: 1000,
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  panelSubtitle: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  field: { marginBottom: '12px' },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    fontSize: '13px',
    boxSizing: 'border-box',
  },
  searchBtn: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #7b2ff7 0%, #4a0080 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '8px',
  },
  resetBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    marginBottom: '12px',
  },
  resultBox: { marginTop: '16px' },
  resultHeader: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#7b2ff7',
    marginBottom: '8px',
  },
  resultCard: {
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #7b2ff7',
    backgroundColor: '#f9f0ff',
  },
  resultName: {
    fontWeight: '700',
    color: '#1a1a2e',
    fontSize: '15px',
    marginBottom: '8px',
  },
  resultInfo: {
    fontSize: '13px',
    color: '#555',
    marginBottom: '4px',
  },
  statusBadge: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
};

export default MapView;