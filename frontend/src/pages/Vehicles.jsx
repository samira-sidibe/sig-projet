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
        setEditing(null);
      } else {
        await createVehicle(form);
      }
      setForm({ name: '', plate_number: '', type: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (v) => {
    setEditing(v);
    setForm({ name: v.name, plate_number: v.plate_number, type: v.type });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce véhicule ?')) return;
    try {
      await deleteVehicle(id);
      load();
    } catch (err) {
      setError('Erreur suppression');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>🚙 Gestion des véhicules</h2>

        {error && <div style={styles.error}>{error}</div>}

        {/* Formulaire */}
        <div style={styles.card}>
          <h3>{editing ? '✏️ Modifier' : '➕ Ajouter'} un véhicule</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Plaque (ex: AB-123-CD)"
              value={form.plate_number}
              onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Type (camion, voiture...)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <div style={styles.formButtons}>
              <button style={styles.btnPrimary} type="submit">
                {editing ? 'Modifier' : 'Ajouter'}
              </button>
              {editing && (
                <button
                  style={styles.btnSecondary}
                  type="button"
                  onClick={() => { setEditing(null); setForm({ name: '', plate_number: '', type: '' }); }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste des véhicules */}
        <div style={styles.card}>
          <h3>📋 Liste des véhicules</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Plaque</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} style={styles.tr}>
                  <td style={styles.td}>{v.id}</td>
                  <td style={styles.td}>{v.name}</td>
                  <td style={styles.td}>{v.plate_number}</td>
                  <td style={styles.td}>{v.type}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: v.status === 'active' ? '#e8f5e9' : '#fdecea',
                      color: v.status === 'active' ? '#2e7d32' : '#c62828',
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnEdit} onClick={() => handleEdit(v)}>✏️</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(v.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 60px)' },
  title: { marginBottom: '24px', color: '#333' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  form: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '180px' },
  formButtons: { display: 'flex', gap: '8px' },
  btnPrimary: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  btnSecondary: { padding: '10px 20px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee', color: '#555' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  btnEdit: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '8px' },
  btnDelete: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  error: { backgroundColor: '#fdecea', color: '#d32f2f', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
};

export default Vehicles;