import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../services/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ name: '', plate_number: '', type: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch (err) {
      setError('Erreur chargement véhicules');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateVehicle(editing.id, { ...form, status: editing.status });
        setSuccess('Véhicule modifié avec succès !');
        setEditing(null);
      } else {
        await createVehicle(form);
        setSuccess('Véhicule ajouté avec succès !');
      }
      setForm({ name: '', plate_number: '', type: '' });
      setError('');
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (v) => {
    setEditing(v);
    setForm({ name: v.name, plate_number: v.plate_number, type: v.type });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce véhicule ?')) return;
    try {
      await deleteVehicle(id);
      setSuccess('Véhicule supprimé !');
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur suppression');
    }
  };

  const typeColors = {
    camion: { bg: '#e3f2fd', color: '#1565c0' },
    voiture: { bg: '#e8f5e9', color: '#2e7d32' },
    moto: { bg: '#fff3e0', color: '#e65100' },
    bus: { bg: '#f3e5f5', color: '#6a1b9a' },
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🚙 Gestion des véhicules</h2>
            <p style={styles.subtitle}>{vehicles.length} véhicule(s) enregistré(s)</p>
          </div>
        </div>

        {/* Alerts */}
        {error && <div style={styles.error}>⚠️ {error}</div>}
        {success && <div style={styles.successMsg}>✅ {success}</div>}

        <div style={styles.grid}>
          {/* Formulaire */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              {editing ? '✏️ Modifier le véhicule' : '➕ Ajouter un véhicule'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Nom du véhicule</label>
                <input
                  style={styles.input}
                  placeholder="Ex: Camion Abidjan 01"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Numéro de plaque</label>
                <input
                  style={styles.input}
                  placeholder="Ex: AB-123-CI"
                  value={form.plate_number}
                  onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Type de véhicule</label>
                <select
                  style={styles.input}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="camion">🚛 Camion</option>
                  <option value="voiture">🚗 Voiture</option>
                  <option value="moto">🏍️ Moto</option>
                  <option value="bus">🚌 Bus</option>
                </select>
              </div>
              <div style={styles.formButtons}>
                <button style={styles.btnPrimary} type="submit">
                  {editing ? '✏️ Modifier' : '➕ Ajouter'}
                </button>
                {editing && (
                  <button
                    style={styles.btnSecondary}
                    type="button"
                    onClick={() => {
                      setEditing(null);
                      setForm({ name: '', plate_number: '', type: '' });
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Liste */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Liste des véhicules</h3>
            {vehicles.length === 0 ? (
              <div style={styles.empty}>Aucun véhicule enregistré</div>
            ) : (
              <div style={styles.vehicleList}>
                {vehicles.map((v) => (
                  <div key={v.id} style={styles.vehicleCard}>
                    <div style={styles.vehicleInfo}>
                      <div style={styles.vehicleName}>{v.name}</div>
                      <div style={styles.vehiclePlate}>🪪 {v.plate_number}</div>
                      <div style={styles.vehicleTags}>
                        {v.type && (
                          <span style={{
                            ...styles.tag,
                            backgroundColor: typeColors[v.type]?.bg || '#f5f5f5',
                            color: typeColors[v.type]?.color || '#333',
                          }}>
                            {v.type}
                          </span>
                        )}
                        <span style={{
                          ...styles.tag,
                          backgroundColor: v.status === 'active' ? '#e8f5e9' : '#fdecea',
                          color: v.status === 'active' ? '#2e7d32' : '#c62828',
                        }}>
                          {v.status === 'active' ? '● Actif' : '● Inactif'}
                        </span>
                      </div>
                    </div>
                    <div style={styles.vehicleActions}>
                      <button style={styles.btnEdit} onClick={() => handleEdit(v)}>✏️</button>
                      <button style={styles.btnDelete} onClick={() => handleDelete(v.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', width: '100%', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', color: '#1a1a2e', marginBottom: '4px' },
  subtitle: { color: '#666', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '20px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontWeight: '500', fontSize: '13px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  formButtons: { display: 'flex', gap: '10px', marginTop: '8px' },
  btnPrimary: { flex: 1, padding: '11px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  btnSecondary: { flex: 1, padding: '11px', backgroundColor: '#f5f5f5', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  vehicleList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  vehicleCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: '1.5px solid #f0f0f0', backgroundColor: '#fafafa' },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontWeight: '600', color: '#1a1a2e', fontSize: '15px', marginBottom: '4px' },
  vehiclePlate: { color: '#666', fontSize: '13px', marginBottom: '8px' },
  vehicleTags: { display: 'flex', gap: '8px' },
  tag: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  vehicleActions: { display: 'flex', gap: '8px' },
  btnEdit: { background: '#e3f2fd', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontSize: '16px' },
  btnDelete: { background: '#fdecea', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontSize: '16px' },
  error: { backgroundColor: '#fdecea', color: '#d32f2f', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  successMsg: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  empty: { textAlign: 'center', color: '#999', padding: '40px', fontSize: '14px' },
};

export default Vehicles;