# Documentation Complète - Tasks API

![Fastify Logo](src/assets/fastify.png)

## 📋 Vue d'Ensemble du Projet

**Tasks API** est une application full-stack moderne de gestion de tâches qui combine une API RESTful robuste avec une interface utilisateur React intuitive. Le projet utilise des technologies de pointe pour offrir une expérience utilisateur fluide et sécurisée.

### 🎯 Objectifs du Projet

- Fournir une solution complète de gestion de tâches
- Permettre la collaboration entre utilisateurs
- Offrir une API sécurisée et performante
- Proposer une interface utilisateur moderne et responsive

---

## 🏗️ Architecture du Projet

### Structure Globale

```
Tasks_api/
├── backend/                 # API RESTful (Fastify + MongoDB)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── frontend/               # Interface utilisateur (React + TypeScript)
│   └── tasks/
│       ├── src/
│       │   ├── pages/
│       │   ├── ui/
│       │   ├── context/
│       │   └── App.tsx
│       └── package.json
└── README.md
```

### Stack Technique

#### Backend (API)

- **Framework**: Fastify (Node.js)
- **Base de données**: MongoDB
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Joi/Yup
- **Sécurité**: bcrypt pour le hachage des mots de passe

#### Frontend (Interface)

- **Framework**: React 18 avec TypeScript
- **Routage**: React Router DOM
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast
- **Gestion d'état**: Context API

---

## 🔧 Installation et Configuration

### Prérequis

- Node.js 22+ et npm
- MongoDB (local ou MongoDB Atlas)
- Git

### Installation Backend

1. **Cloner le repository**

   ```bash
   git clone https://github.com/elhalj/Tasks_api.git
   cd Tasks_api/backend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**

   ```bash
   cp .env.example .env
   ```

   Éditer le fichier `.env` :

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/tasks_db
   JWT_SECRET=votre_secret_jwt_très_sécurisé
   JWT_EXPIRES_IN=24h
   NODE_ENV=development
   ```

4. **Démarrer le serveur**

   ```bash
   # Mode développement
   npm run dev

   # Mode production
   npm start
   ```

### Installation Frontend

1. **Naviguer vers le dossier frontend**

   ```bash
   cd ../frontend/tasks
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Démarrer l'application**
   ```bash
   npm start
   ```

L'application sera accessible sur `http://localhost:3000` (frontend) et l'API sur `http://localhost:3000/api` (backend).

---

## 📚 Documentation API

### Base URL

```
http://localhost:3000/api
```

### Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer <token>
```

#### Endpoints d'Authentification

##### POST `/auth/v1/register/user`

Inscription d'un nouvel utilisateur

**Body (JSON):**

```json
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "userName": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### POST `/auth/v1/login/user`

Connexion utilisateur

**Body (JSON):**

```json
{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "userName": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Gestion des Tâches

#### GET `/v1/get/tasks`

Récupérer toutes les tâches de l'utilisateur connecté

**Headers:**

```
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Finaliser le rapport",
      "description": "Terminer le rapport mensuel",
      "completed": false,
      "status": "pending",
      "priority": "high",
      "createdAt": "2025-08-03T10:00:00.000Z",
      "updatedAt": "2025-08-03T10:00:00.000Z"
    }
  ]
}
```

#### GET `/v1/get/task/:id`

Récupérer une tâche spécifique

**Paramètres:**

- `id`: ID de la tâche

**Réponse (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Finaliser le rapport",
    "description": "Terminer le rapport mensuel",
    "completed": false,
    "status": "pending",
    "priority": "high",
    "createdAt": "2025-08-03T10:00:00.000Z",
    "updatedAt": "2025-08-03T10:00:00.000Z"
  }
}
```

#### POST `/v1/add/tasks`

Créer une nouvelle tâche

**Body (JSON):**

```json
{
  "title": "Nouvelle tâche",
  "description": "Description de la tâche",
  "completed": false,
  "status": "pending",
  "priority": "medium"
}
```

**Réponse (201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Nouvelle tâche",
    "description": "Description de la tâche",
    "completed": false,
    "status": "pending",
    "priority": "medium",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2025-08-03T11:00:00.000Z",
    "updatedAt": "2025-08-03T11:00:00.000Z"
  }
}
```

#### PUT `/v1/update/tasks/:id`

Mettre à jour une tâche

**Body (JSON):**

```json
{
  "title": "Tâche mise à jour",
  "description": "Description modifiée",
  "completed": true,
  "status": "done",
  "priority": "low"
}
```

**Réponse (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Tâche mise à jour",
    "description": "Description modifiée",
    "completed": true,
    "status": "done",
    "priority": "low",
    "updatedAt": "2025-08-03T12:00:00.000Z"
  }
}
```

#### DELETE `/v1/delete/task/:id`

Supprimer une tâche

**Réponse (200):**

```json
{
  "success": true,
  "message": "Tâche supprimée avec succès"
}
```

---

## 🎨 Interface Utilisateur (Frontend)

### Structure des Composants

#### Pages Principales

- **LoginPage** (`/`) - Connexion utilisateur
- **RegisterPage** (`/register`) - Inscription utilisateur
- **Dashboard** (`/dashboard`) - Tableau de bord principal
- **AddTask** (`/dashboard/add/task`) - Création de tâche
- **UpdatePage** (`/dashboard/tasks/:id/edit`) - Modification de tâche

#### Composants UI

- **Login** - Formulaire de connexion
- **Register** - Formulaire d'inscription
- **Tasks** - Liste des tâches
- **CreateTask** - Formulaire de création de tâche

### Gestion d'État

#### AuthContext

Gère l'authentification utilisateur :

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}
```

#### TaskContext

Gère les opérations sur les tâches :

```typescript
interface TaskContextType {
  tasks: Task[];
  getTasks: () => Promise<void>;
  addTask: (
    title: string,
    description: string,
    completed: boolean,
    status: string,
    priority: string
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}
```

### Modèles de Données

#### User

```typescript
interface User {
  id: string;
  userName: string;
  email: string;
}
```

#### Task

```typescript
interface Task {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  status: "pending" | "in_progress" | "done" | "canceled";
  priority: "low" | "medium" | "high" | "critical";
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🔒 Sécurité

### Authentification JWT

- **Génération** : Token JWT signé avec secret
- **Durée de vie** : Configurable (par défaut 24h)
- **Protection** : Middleware de vérification sur toutes les routes protégées

### Validation des Données

- **Frontend** : Validation TypeScript et React
- **Backend** : Validation des schémas avec middleware

### Sécurité des Mots de Passe

- **Hachage** : bcrypt avec salt rounds configurables
- **Stockage** : Jamais en plain text dans la base de données

---

## 🧪 Tests et Qualité

### Scripts Disponibles

#### Backend

```bash
npm run dev        # Démarrage en mode développement
npm start          # Démarrage en mode production
npm test           # Exécution des tests
npm run lint       # Vérification du code
```

#### Frontend

```bash
npm start          # Démarrage du serveur de développement
npm run build      # Build de production
npm test           # Exécution des tests
```

### Bonnes Pratiques

- **Code Style** : ESLint + Prettier
- **TypeScript** : Types stricts pour le frontend
- **Validation** : Validation des données côté client et serveur
- **Gestion d'erreurs** : Try/catch et middleware d'erreur

---

## 🚀 Déploiement

### Variables d'Environnement Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tasks_prod
JWT_SECRET=super_secret_production_key
JWT_EXPIRES_IN=24h
```

### Docker (Optionnel)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔮 Fonctionnalités Futures

### Prochaines Versions

1. **Notifications Push**

   - Alertes d'échéance
   - Notifications de collaboration

2. **Collaboration Avancée**

   - Partage de tâches
   - Commentaires et mentions
   - Historique des modifications

3. **Intégrations**

   - Calendrier (Google Calendar, Outlook)
   - Slack/Discord
   - Email (SMTP)

4. **Analytics**

   - Statistiques de productivité
   - Rapports personnalisés
   - Tableaux de bord d'équipe

5. **Mobile**
   - Application React Native
   - Synchronisation offline
   - Notifications push natives

---

## 📞 Support et Contribution

### Rapporter un Bug

1. Vérifier les issues existantes
2. Créer une nouvelle issue avec :
   - Description détaillée
   - Steps to reproduce
   - Environnement (OS, Node.js, etc.)

### Contribuer au Code

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Guidelines de Contribution

- Suivre les conventions de code existantes
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Respecter les principes SOLID

---

## 📄 Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

## 🙏 Remerciements

- **Fastify** - Framework web ultra-rapide
- **MongoDB** - Base de données NoSQL flexible
- **React** - Bibliothèque UI moderne
- **TypeScript** - JavaScript typé pour un développement robuste
- **Tailwind CSS** - Framework CSS utilitaire

---

**Développé avec ❤️ par [elhalj](https://github.com/elhalj)**

Pour plus d'informations, consultez le [repository GitHub](https://github.com/elhalj/Tasks_api) ou ouvrez une [issue](https://github.com/elhalj/Tasks_api/issues).
