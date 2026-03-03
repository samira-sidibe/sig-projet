const express = require('express');
const router = express.Router();
const positionController = require('../controllers/position.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * Routes de gestion des positions GPS
 */

// POST /api/positions - Enregistrer une position
router.post('/', verifyToken, positionController.addPosition);

// GET /api/positions/all/last - Dernières positions de tous les véhicules
router.get('/all/last', verifyToken, positionController.getAllLastPositions);

// GET /api/positions/search/radius - Véhicules dans un rayon
router.get('/search/radius', verifyToken, positionController.getVehiclesInRadius);

// GET /api/positions/search/nearest - Véhicule le plus proche
router.get('/search/nearest', verifyToken, positionController.getNearestVehicle);

// GET /api/positions/:vehicle_id/last - Dernière position d'un véhicule
router.get('/:vehicle_id/last', verifyToken, positionController.getLastPosition);

// GET /api/positions/:vehicle_id/history - Historique d'un véhicule
router.get('/:vehicle_id/history', verifyToken, positionController.getPositionHistory);

module.exports = router;