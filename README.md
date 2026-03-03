# 🚗 SIG Fleet Tracker — Système de Suivi de Flotte avec Géolocalisation

## 📋 Description

Application web complète permettant de gérer et visualiser en temps réel la position de véhicules sur une carte interactive. Développée dans le cadre du projet SIG - EIT3.

## 🛠️ Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | React + Vite + React Leaflet |
| Backend | Node.js + Express |
| Base de données | PostgreSQL 15 + PostGIS 3.4 |
| Authentification | JWT (JSON Web Token) |
| Carte | OpenStreetMap via Leaflet |

## 📁 Structure du projet

```
sig-projet/
├── backend/
│   ├── src/
│   │   ├── config/         # Connexion base de données
│   │   ├── controllers/    # Logique des routes
│   │   ├── routes/         # Définition des endpoints
│   │   ├── services/       # Logique métier et PostGIS
│   │   └── middlewares/    # Authentification JWT
│   ├── .env                # Variables d'environnement
│   ├── server.js           # Point d'entrée du serveur
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants réutilisables (Navbar, MapView)
│   │   ├── pages/          # Pages (Login, Dashboard, Vehicles)
│   │   ├── services/       # Appels API (axios)
│   │   └── context/        # Contexte d'authentification
│   └── package.json
└── README.md
```

## ⚙️ Prérequis

- Node.js v18+
- PostgreSQL 15
- PostGIS 3.4
- npm v9+

## 🚀 Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/sig-projet.git
cd sig-projet
```

### 2. Configurer la base de données

```bash
psql -U postgres
```

```sql
CREATE DATABASE sig_fleet;
\c sig_fleet
CREATE EXTENSION postgis;
```

Puis exécuter le fichier d'export SQL :

```bash
psql -U postgres -d sig_fleet -f database/sig_fleet.sql
```

### 3. Configurer le backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sig_fleet
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=sig_fleet_secret_key_2024
JWT_EXPIRES_IN=24h
```

Lancer le backend :

```bash
npm run dev
```

### 4. Configurer le frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Accéder à l'application

```
http://localhost:5173
```

Identifiants par défaut :
- **Username** : admin
- **Password** : admin123

## 🌐 API Endpoints

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | Connexion utilisateur |

### Véhicules
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/vehicles | Liste des véhicules |
| GET | /api/vehicles/:id | Détail d'un véhicule |
| POST | /api/vehicles | Créer un véhicule |
| PUT | /api/vehicles/:id | Modifier un véhicule |
| DELETE | /api/vehicles/:id | Supprimer un véhicule |

### Positions GPS
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/positions | Enregistrer une position |
| GET | /api/positions/all/last | Dernières positions de tous les véhicules |
| GET | /api/positions/:id/last | Dernière position d'un véhicule |
| GET | /api/positions/:id/history | Historique des positions |
| GET | /api/positions/search/radius | Véhicules dans un rayon (m) |
| GET | /api/positions/search/nearest | Véhicule le plus proche |

## 🗄️ Base de données

### Tables

- **users** : Utilisateurs de l'application
- **vehicles** : Véhicules de la flotte
- **positions** : Positions GPS (type GEOGRAPHY PostGIS)

### Index

- `idx_positions_location` : Index spatial GIST pour les recherches géographiques
- `idx_positions_vehicle_id` : Index sur vehicle_id
- `idx_positions_recorded_at` : Index sur la date d'enregistrement

### Fonctionnalités PostGIS utilisées

- `ST_MakePoint` : Création de points géographiques
- `ST_SetSRID` : Définition du système de référence (WGS84)
- `ST_Distance` : Calcul de distance entre deux points
- `ST_DWithin` : Recherche dans un rayon donné
- `GEOGRAPHY(POINT, 4326)` : Type de données géospatiales

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée avec JWT
- 🚗 CRUD complet des véhicules
- 📍 Enregistrement des positions GPS en temps réel
- 🗺️ Visualisation des véhicules sur carte interactive (OpenStreetMap)
- 📈 Historique des trajets avec polylines colorées
- 🔍 Recherche géographique par rayon
- 📡 Détection du véhicule le plus proche

## 👤 Auteur

SIDIBE Samira — 3ème année — EIT3
```