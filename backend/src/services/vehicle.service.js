const pool = require('../config/db');

/**
 * Service de gestion des véhicules
 */

/** Récupérer tous les véhicules */
const getAllVehicles = async () => {
  const result = await pool.query(
    'SELECT * FROM vehicles ORDER BY created_at DESC'
  );
  return result.rows;
};

/** Récupérer un véhicule par ID */
const getVehicleById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM vehicles WHERE id = $1', 
    [id]
  );
  if (result.rows.length === 0) throw new Error('Véhicule introuvable');
  return result.rows[0];
};

/** Créer un véhicule */
const createVehicle = async ({ name, plate_number, type }) => {
  const result = await pool.query(
    `INSERT INTO vehicles (name, plate_number, type) 
     VALUES ($1, $2, $3) RETURNING *`,
    [name, plate_number, type]
  );
  return result.rows[0];
};

/** Mettre à jour un véhicule */
const updateVehicle = async (id, { name, plate_number, type, status }) => {
  const result = await pool.query(
    `UPDATE vehicles 
     SET name = $1, plate_number = $2, type = $3, status = $4 
     WHERE id = $5 RETURNING *`,
    [name, plate_number, type, status, id]
  );
  if (result.rows.length === 0) throw new Error('Véhicule introuvable');
  return result.rows[0];
};

/** Supprimer un véhicule */
const deleteVehicle = async (id) => {
  const result = await pool.query(
    'DELETE FROM vehicles WHERE id = $1 RETURNING *', 
    [id]
  );
  if (result.rows.length === 0) throw new Error('Véhicule introuvable');
  return result.rows[0];
};

module.exports = { 
  getAllVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
};