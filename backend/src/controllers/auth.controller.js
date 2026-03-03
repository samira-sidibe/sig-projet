const authService = require('../services/auth.service');

/**
 * Contrôleur d'authentification
 */

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation des champs
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username et password sont requis' 
      });
    }

    const data = await authService.login(username, password);

    res.status(200).json({
      message: 'Connexion réussie',
      ...data
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { login };