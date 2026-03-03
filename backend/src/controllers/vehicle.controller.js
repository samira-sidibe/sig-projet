const vehicleService = require('../services/vehicle.service');

/**
 * Contrôleur de gestion des véhicules
 */

/** GET /api/vehicles */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/vehicles/:id */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/** POST /api/vehicles */
const createVehicle = async (req, res) => {
  try {
    const { name, plate_number, type } = req.body;
    if (!name || !plate_number) {
      return res.status(400).json({ error: 'name et plate_number sont requis' });
    }
    const vehicle = await vehicleService.createVehicle({ name, plate_number, type });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** PUT /api/vehicles/:id */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/** DELETE /api/vehicles/:id */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({ message: 'Véhicule supprimé', vehicle });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { 
  getAllVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
};