# Modèles de Données - Documentation

Ce document décrit les modèles de données de l'application et leurs relations.

## Modèles Principaux

### 1. Utilisateur (User)
Représente un utilisateur de l'application.

**Champs principaux :**
- `username` : Identifiant unique de l'utilisateur
- `email` : Adresse email (unique)
- `password` : Mot de passe haché
- `role` : Rôle de l'utilisateur (user/admin)
- `profile` : Informations personnelles (nom, prénom, avatar, etc.)
- `preferences` : Préférences utilisateur (notifications, thème, langue)
- `status` : Statut du compte (actif/inactif/suspendu)

**Relations :**
- Appartient à plusieurs `Room`
- Peut avoir plusieurs `Task` assignées
- Peut avoir plusieurs `Notification`s

### 2. Salle (Room)
Espace de travail collaboratif.

**Champs principaux :**
- `room_name` : Nom de la salle
- `description` : Description de la salle
- `admin` : Administrateur de la salle (référence à User)
- `isActive` : Statut d'activation

**Relations :**
- Contient plusieurs `User`
- Contient plusieurs `Task`
- Contient plusieurs `Comment`

### 3. Tâche (Task)
Tâche ou élément de travail.

**Champs principaux :**
- `title` : Titre de la tâche
- `description` : Description détaillée
- `status` : État de la tâche (todo/in_progress/in_review/done/canceled)
- `priority` : Priorité (low/medium/high/critical)
- `dueDate` : Date d'échéance
- `startDate` : Date de début
- `estimatedHours` : Temps estimé
- `timeSpent` : Temps passé

**Relations :**
- Appartient à un `User` (reporter)
- Peut avoir plusieurs `User` assignés (assignees)
- Appartient à une `Room`
- Peut avoir plusieurs `Comment`s

### 4. Commentaire (Comment)
Commentaire sur une tâche ou une salle.

**Champs principaux :**
- `content` : Contenu du commentaire
- `author` : Auteur (référence à User)
- `isEdited` : Indique si le commentaire a été modifié
- `likes` : Liste des utilisateurs ayant aimé

**Relations :**
- Appartient à un `User` (auteur)
- Peut appartenir à une `Task` ou une `Room`
- Peut avoir des réponses imbriquées

### 5. Notification (Notification)
Notification système pour les utilisateurs.

**Champs principaux :**
- `type` : Type de notification (TASK_ASSIGNED, COMMENT_ADDED, etc.)
- `title` : Titre de la notification
- `message` : Message détaillé
- `isRead` : État de lecture
- `relatedDocument` : Document lié (Task, Room, Comment, User)

**Relations :**
- Destinée à un ou plusieurs `User` (recipients)
- Émise par un `User` (sender)

## Relations entre les Modèles

```
User 1---* Room (membre)
User 1---* Room (admin)
User 1---* Task (reporter)
User *---* Task (assignees)
User 1---* Comment
User *---* Comment (likes)
User 1---* Notification (recipient)
Room 1---* Task
Room 1---* Comment
Task 1---* Comment
```

## Bonnes Pratiques

1. **Validation** : Tous les modèles incluent une validation des données
2. **Indexation** : Les champs fréquemment interrogés sont indexés
3. **Sécurité** : Les mots de passe sont hachés avant sauvegarde
4. **Performance** : Les relations sont correctement référencées pour des requêtes optimisées
5. **Évolutivité** : La structure permet d'ajouter facilement de nouveaux champs
