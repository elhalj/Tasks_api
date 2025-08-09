# Documentation des Routes API

Ce document décrit les différentes routes disponibles dans l'API de gestion des salles et des tâches.

## Table des matières
- [Routes des Salles](#routes-des-salles)
- [Routes des Tâches](#routes-des-tâches)
- [Routes des Commentaires](#routes-des-commentaires)
- [Codes d'erreur](#codes-derreur)

## Routes des Salles

### `GET /rooms`
Récupère toutes les salles de l'utilisateur connecté.
- **Authentification requise** : Oui
- **Paramètres** : Aucun
- **Réponse** : Liste des salles avec détails des membres

### `GET /rooms/:roomId`
Récupère les détails d'une salle spécifique.
- **Authentification requise** : Oui
- **Paramètres** : 
  - `roomId` (URL) : ID de la salle
- **Réponse** : Détails complets de la salle

### `POST /rooms`
Crée une nouvelle salle.
- **Authentification requise** : Oui
- **Body** :
  ```json
  {
    "room_name": "string",
    "description": "string",
    "members": ["userId1", "userId2"]
  }
  ```
- **Réponse** : Détails de la salle créée

### `PUT /rooms/:roomId`
Met à jour les informations d'une salle existante.
- **Authentification requise** : Oui (Admin uniquement)
- **Paramètres** :
  - `roomId` (URL) : ID de la salle
- **Body** :
  ```json
  {
    "room_name": "string",
    "description": "string",
    "isActive": boolean
  }
  ```
- **Réponse** : Salle mise à jour

### `POST /rooms/:roomId/members`
Ajoute un membre à une salle.
- **Authentification requise** : Oui (Admin uniquement)
- **Paramètres** :
  - `roomId` (URL) : ID de la salle
- **Body** :
  ```json
  {
    "userId": "string"
  }
  ```
- **Réponse** : Salle mise à jour avec le nouveau membre

### `DELETE /rooms/:roomId/members/:userId`
Retire un membre d'une salle.
- **Authentification requise** : Oui (Admin ou auto-retrait)
- **Paramètres** :
  - `roomId` (URL) : ID de la salle
  - `userId` (URL) : ID du membre à retirer
- **Réponse** : Confirmation du retrait

### `POST /rooms/:roomId/transfer-ownership`
Transfère la propriété d'une salle à un autre membre.
- **Authentification requise** : Oui (Admin actuel uniquement)
- **Paramètres** :
  - `roomId` (URL) : ID de la salle
- **Body** :
  ```json
  {
    "newAdminId": "string"
  }
  ```
- **Réponse** : Salle avec le nouvel administrateur

### `PATCH /rooms/:roomId/status`
Active ou désactive une salle.
- **Authentification requise** : Oui (Admin uniquement)
- **Paramètres** :
  - `roomId` (URL) : ID de la salle
- **Body** :
  ```json
  {
    "isActive": boolean
  }
  ```
- **Réponse** : Statut mis à jour de la salle

### `DELETE /rooms/:roomId`
Supprime logiquement une salle.
- **Authentification requise** : Oui (Admin uniquement)
- **Paramètres** :
  - `roomId` (URL) : ID de la salle
- **Réponse** : Confirmation de suppression

## Routes des Tâches

### `GET /tasks`
Récupère toutes les tâches de l'utilisateur.
- **Authentification requise** : Oui
- **Paramètres de requête** :
  - `status` (optionnel) : Filtre par statut
  - `roomId` (optionnel) : Filtre par salle
- **Réponse** : Liste des tâches

### `POST /tasks`
Crée une nouvelle tâche.
- **Authentification requise** : Oui
- **Body** :
  ```json
  {
    "title": "string",
    "description": "string",
    "dueDate": "date",
    "priority": "low|medium|high",
    "roomId": "string"
  }
  ```
- **Réponse** : Tâche créée

## Routes des Commentaires

### `GET /comments`
Récupère les commentaires d'une tâche ou d'une salle.
- **Authentification requise** : Oui
- **Paramètres de requête** :
  - `taskId` (optionnel) : ID de la tâche
  - `roomId` (optionnel) : ID de la salle
- **Réponse** : Liste des commentaires

### `POST /comments`
Ajoute un commentaire.
- **Authentification requise** : Oui
- **Body** :
  ```json
  {
    "content": "string",
    "taskId": "string",
    "roomId": "string",
    "parentId": "string"
  }
  ```
- **Réponse** : Commentaire créé

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 409 | Conflit (ex: doublon) |
| 500 | Erreur serveur |

## Sécurité
- Toutes les routes (sauf /auth) nécessitent un token JWT valide
- Les tokens doivent être inclus dans le header `Authorization: Bearer <token>`
- Les opérations sensibles (suppression, modification) sont restreintes aux administrateurs
