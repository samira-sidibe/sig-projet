const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Service d'authentification
 */

/**
 * Connecte un utilisateur
 * @param {string} username
 * @param {string} password
 * @returns {object} token + user
 */
const login = async (username, password) => {
  // Chercher l'utilisateur en base
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1', 
    [username]
  );

  if (result.rows.length === 0) {
    throw new Error('Utilisateur introuvable');
  }

  const user = result.rows[0];

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Mot de passe incorrect');
  }

  // Générer le token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };
};

module.exports = { login };