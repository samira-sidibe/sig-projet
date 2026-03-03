const pool = require('../config/db');

/**
 * Service de gestion des positions GPS
 * Utilise PostGIS pour les opérations géospatiales
 */

/** Enregistrer une nouvelle position */
const addPosition = async (vehicle_id, latitude, longitude, speed = 0) => {
  const result = await pool.query(
    `INSERT INTO positions (vehicle_id, location, speed)
     VALUES ($1, ST_SetSRID(ST_MakePoint($3, $2), 4326), $4)
     RETURNING id, vehicle_id, speed, recorded_at,
     ST_Y(location::geometry) as latitude,
     ST_X(location::geometry) as longitude`,
    [vehicle_id, latitude, longitude, speed]
  );
  return result.rows[0];
};

/** Récupérer la dernière position d'un véhicule */
const getLastPosition = async (vehicle_id) => {
  const result = await pool.query(
    `SELECT id, vehicle_id, speed, recorded_at,
     ST_Y(location::geometry) as latitude,
     ST_X(location::geometry) as longitude
     FROM positions
     WHERE vehicle_id = $1
     ORDER BY recorded_at DESC
     LIMIT 1`,
    [vehicle_id]
  );
  return result.rows[0];
};

/** Récupérer l'historique des positions d'un véhicule */
const getPositionHistory = async (vehicle_id) => {
  const result = await pool.query(
    `SELECT id, vehicle_id, speed, recorded_at,
     ST_Y(location::geometry) as latitude,
     ST_X(location::geometry) as longitude
     FROM positions
     WHERE vehicle_id = $1
     ORDER BY recorded_at ASC`,
    [vehicle_id]
  );
  return result.rows;
};

/** Récupérer les dernières positions de tous les véhicules */
const getAllLastPositions = async () => {
  const result = await pool.query(
    `SELECT DISTINCT ON (p.vehicle_id)
     p.id, p.vehicle_id, p.speed, p.recorded_at,
     ST_Y(p.location::geometry) as latitude,
     ST_X(p.location::geometry) as longitude,
     v.name, v.plate_number, v.type, v.status
     FROM positions p
     JOIN vehicles v ON p.vehicle_id = v.id
     ORDER BY p.vehicle_id, p.recorded_at DESC`
  );
  return result.rows;
};

/** Recherche des véhicules dans un rayon donné (en mètres) */
const getVehiclesInRadius = async (latitude, longitude, radius) => {
  const result = await pool.query(
    `SELECT DISTINCT ON (p.vehicle_id)
     p.vehicle_id, p.speed, p.recorded_at,
     ST_Y(p.location::geometry) as latitude,
     ST_X(p.location::geometry) as longitude,
     ST_Distance(p.location, ST_SetSRID(ST_MakePoint($2, $1), 4326)) as distance,
     v.name, v.plate_number, v.type, v.status
     FROM positions p
     JOIN vehicles v ON p.vehicle_id = v.id
     WHERE ST_DWithin(
       p.location,
       ST_SetSRID(ST_MakePoint($2, $1), 4326),
       $3
     )
     ORDER BY p.vehicle_id, p.recorded_at DESC`,
    [latitude, longitude, radius]
  );
  return result.rows;
};

/** Trouver le véhicule le plus proche */
const getNearestVehicle = async (latitude, longitude) => {
  const result = await pool.query(
    `SELECT DISTINCT ON (p.vehicle_id)
     p.vehicle_id, p.speed, p.recorded_at,
     ST_Y(p.location::geometry) as latitude,
     ST_X(p.location::geometry) as longitude,
     ST_Distance(p.location, ST_SetSRID(ST_MakePoint($2, $1), 4326)) as distance,
     v.name, v.plate_number, v.type, v.status
     FROM positions p
     JOIN vehicles v ON p.vehicle_id = v.id
     ORDER BY p.vehicle_id, p.recorded_at DESC, distance ASC
     LIMIT 1`,
    [latitude, longitude]
  );
  return result.rows[0];
};

module.exports = {
  addPosition,
  getLastPosition,
  getPositionHistory,
  getAllLastPositions,
  getVehiclesInRadius,
  getNearestVehicle
};