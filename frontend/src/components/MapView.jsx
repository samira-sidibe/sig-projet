import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllLastPositions, getPositionHistory } from '../services/api';

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

  // Charger les dernières positions
  const loadPositions = async () => {
    try {
      const res = await getAllLastPositions();
      setPositions(res.data);

      // Charger l'historique de chaque véhicule
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
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(loadPositions, 10000);
    return () => clearInterval(interval);
  }, []);

  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];

  return (
    <div style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {positions.map((pos, i) => (
          <div key={pos.vehicle_id}>
            {/* Marqueur véhicule */}
            <Marker position={[pos.latitude, pos.longitude]}>
              <Popup>
                <strong>{pos.name}</strong><br />
                Plaque : {pos.plate_number}<br />
                Type : {pos.type}<br />
                Vitesse : {pos.speed} km/h<br />
                Statut : {pos.status}
              </Popup>
            </Marker>

            {/* Historique du trajet */}
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
  );
};

export default MapView;