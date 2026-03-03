const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * Routes de gestion des véhicules
 * Toutes les routes sont protégées par le middleware verifyToken
 */

// GET /api/vehicles
router.get('/', verifyToken, vehicleController.getAllVehicles);

// GET /api/vehicles/:id
router.get('/:id', verifyToken, vehicleController.getVehicleById);

// POST /api/vehicles
router.post('/', verifyToken, vehicleController.createVehicle);

// PUT /api/vehicles/:id
router.put('/:id', verifyToken, vehicleController.updateVehicle);

// DELETE /api/vehicles/:id
router.delete('/:id', verifyToken, vehicleController.deleteVehicle);

module.exports = router;