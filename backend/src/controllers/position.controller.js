const positionService = require('../services/position.service');

/**
 * Contrôleur de gestion des positions GPS
 */

/** POST /api/positions */
const addPosition = async (req, res) => {
  try {
    const { vehicle_id, latitude, longitude, speed } = req.body;
    if (!vehicle_id || !latitude || !longitude) {
      return res.status(400).json({ error: 'vehicle_id, latitude et longitude sont requis' });
    }
    const position = await positionService.addPosition(vehicle_id, latitude, longitude, speed);
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/positions/all/last */
const getAllLastPositions = async (req, res) => {
  try {
    const positions = await positionService.getAllLastPositions();
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/positions/:vehicle_id/last */
const getLastPosition = async (req, res) => {
  try {
    const position = await positionService.getLastPosition(req.params.vehicle_id);
    if (!position) return res.status(404).json({ error: 'Aucune position trouvée' });
    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/positions/:vehicle_id/history */
const getPositionHistory = async (req, res) => {
  try {
    const history = await positionService.getPositionHistory(req.params.vehicle_id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/positions/search/radius */
const getVehiclesInRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'latitude, longitude et radius sont requis' });
    }
    const vehicles = await positionService.getVehiclesInRadius(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius)
    );
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/positions/search/nearest */
const getNearestVehicle = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude et longitude sont requis' });
    }
    const vehicle = await positionService.getNearestVehicle(
      parseFloat(latitude),
      parseFloat(longitude)
    );
    if (!vehicle) return res.status(404).json({ error: 'Aucun véhicule trouvé' });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPosition,
  getAllLastPositions,
  getLastPosition,
  getPositionHistory,
  getVehiclesInRadius,
  getNearestVehicle
};