const jwt = require('jsonwebtoken');

/**
 * Middleware de vérification du token JWT
 * Protège les routes qui nécessitent une authentification
 */
const verifyToken = (req, res, next) => {
  try {
    // Récupérer le token dans le header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token expiré ou invalide' });
  }
};

module.exports = { verifyToken };