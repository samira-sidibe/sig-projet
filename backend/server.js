const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import de la connexion DB
const pool = require('./src/config/db');

// Import des routes
const authRoutes = require('./src/routes/auth.routes');
const vehicleRoutes = require('./src/routes/vehicle.routes');
const positionRoutes = require('./src/routes/position.routes');

const app = express();

// ============================================
// Middlewares globaux
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// Routes
// ============================================
app.get('/', (req, res) => {
  res.json({ message: '🚀 API SIG Fleet Tracker opérationnelle !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/positions', positionRoutes);

// ============================================
// Démarrage du serveur
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

module.exports = app;