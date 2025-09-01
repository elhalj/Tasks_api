import io, { Socket } from 'socket.io-client';
import type { Task } from '../types/task';
import type { User } from '../types/user';

// Événements de base de la socket
export interface SocketEvents {
    connect: () => void;
    disconnect: () => void;
    connect_error: (error: Error) => void;
    connected: (data: { message: string }) => void;
}

// Événements liés aux tâches
export interface SocketTaskEvents {
    // Événement déclenché lorsqu'une tâche est créée
    taskCreated: (data: { 
      task: Task;                // La tâche créée
      message: string;           // Message de notification
      type: string;              // Type d'événement
      authorId?: string;         // ID de l'auteur (optionnel)
    }) => void;
    
    // Événement déclenché lorsqu'une tâche est mise à jour
    taskUpdated: (data: {
      task: Task;                // La tâche mise à jour
      previousTask: Task;        // État précédent de la tâche
      message: string;           // Message de notification
      type: string;              // Type d'événement
      change: {                  // Détails des changements
        status: boolean;         // Si le statut a changé
        priority: boolean;       // Si la priorité a changé
      };
    }) => void;
    
    // Événement déclenché lorsqu'une tâche est supprimée
    taskDeleted: (data: { 
      taskId: string;            // ID de la tâche supprimée
      taskTitle: string;         // Titre de la tâche
      deletedBy: string;         // ID de l'utilisateur qui a supprimé
      message: string;           // Message de notification
    }) => void;
    
    // Événement déclenché lorsqu'une tâche est consultée
    taskViewed: (data: { 
      taskId: string;            // ID de la tâche consultée
      viewedBy: string;          // ID de l'utilisateur qui a consulté
      taskTitle: string;         // Titre de la tâche
      message: string;           // Message de notification
    }) => void;
    
    // Événement pour la création d'une tâche personnelle
    personalTaskCreated: (data: { 
      task: Task;                // La tâche créée
      message: string;           // Message de notification
      type: string;              // Type d'événement
    }) => void;
}

// Statistiques
export interface Stat {
    users: User[];
    tasks: Task[];
}

// Événements liés aux statistiques
export interface SocketStatEvents {
    // Événement de mise à jour des statistiques
    statUpdated: (data: { 
      userId: string;            // ID de l'utilisateur concerné
      stats: any;                // Nouvelles statistiques
    }) => void;
}

// Événements liés au statut des utilisateurs
export interface SocketUserStatusEvents {
    // Événement de changement de statut d'un utilisateur
    userStatusChanged: (data: { 
      userId: string;            // ID de l'utilisateur
      status: 'online' | 'offline'; // Nouveau statut
    }) => void;
}

// Événements liés aux salles de tâches
export interface SocketTaskRoomEvents {
    // Mise à jour d'une salle de tâche
    taskRoomUpdate: (data: { 
      taskId: string;            // ID de la tâche
      task: Task;                // Données mises à jour
      updatedBy: string;         // ID de l'utilisateur qui a mis à jour
      timestamp: Date;           // Horodatage de la mise à jour
    }) => void;
    
    // Suppression d'une salle de tâche
    taskRoomDeleted: (data: { 
      taskId: string;            // ID de la tâche supprimée
    }) => void;
}

// Méthodes liées aux salles de tâches
export interface SocketTaskRoomMethods {
    // Rejoindre une salle de tâche
    joinTaskRoom: (taskId: string) => void;
    
    // Quitter une salle de tâche
    leaveTaskRoom: (taskId: string) => void;
}

// Interface du service de socket
export interface SocketServiceInterface {
    // Se connecter au serveur
    connect: (token: string, userId: string) => Socket;
    
    // Se déconnecter
    disconnect: () => void;
    
    // Supprimer tous les écouteurs
    removeAllListeners: () => void;
    
    // Méthodes d'écoute des événements
    onTaskCreated: (callback: SocketTaskEvents['taskCreated']) => void;
    onTaskUpdated: (callback: SocketTaskEvents['taskUpdated']) => void;
    onTaskDeleted: (callback: SocketTaskEvents['taskDeleted']) => void;
    onTaskViewed: (callback: SocketTaskEvents['taskViewed']) => void;
    onPersonalTaskCreated: (callback: SocketTaskEvents['personalTaskCreated']) => void;
    onStatUpdate: (callback: SocketStatEvents['statUpdated']) => void;
    onUserStatusChanged: (callback: SocketUserStatusEvents['userStatusChanged']) => void;
    
    // Méthodes de gestion des salles
    joinTaskRoom: SocketTaskRoomMethods['joinTaskRoom'];
    leaveTaskRoom: SocketTaskRoomMethods['leaveTaskRoom'];
    onTaskRoomUpdated: (callback: SocketTaskRoomEvents['taskRoomUpdate']) => void;
    onTaskRoomDeleted: (callback: SocketTaskRoomEvents['taskRoomDeleted']) => void;
}

class SocketService implements SocketServiceInterface {
    private socket: Socket | null;
    private isConnected: boolean;
    private socket_url: string;

    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.socket_url = import.meta.env.VITE_SOCKET_URL
    }

    connect(token: string, userId: string): Socket {
        if (this.socket) {
            this.disconnect();
        }
        this.socket = io(this.socket_url, {
            auth: {
                token: token,
                userId: userId
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on("connect", () => {
            console.log('✅ Connecté au serveur Socket.IO');
            this.isConnected = true;
        })

        //Rejoindre la room personnel
        this.socket.emit("userOnline")

        //Ecouter la confirmation de connexion
        this.socket.on("connected", (data) => {
            console.log("Connexion confirmé", data.message)
        })

        this.socket.on("disconnect", () => {
            console.log("Déconnecté au sever");
            this.isConnected = false;
        })

        this.socket.on("connect_error", (error) => {
            console.error("Erreur de connection", error);
        })

        return this.socket
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false
        }
    }

    removeAllListeners() {
        this.socket?.removeAllListeners();
    }

    onTaskCreated(callback: SocketTaskEvents['taskCreated']) {
        this.socket?.on("taskCreated", callback)
    }

    onTaskUpdated(callback: SocketTaskEvents['taskUpdated']) {
        this.socket?.on("taskUpdated", callback)
    }

    onTaskDeleted(callback: SocketTaskEvents['taskDeleted']) {
        if (!this.socket) return;
        this.socket.on("taskDeleted", callback);
    }

    onTaskViewed(callback: SocketTaskEvents['taskViewed']) {
        if (!this.socket) return;
        this.socket.on("taskViewed", callback);
    }

    onPersonalTaskCreated(callback: SocketTaskEvents['personalTaskCreated']) {
        this.socket?.on("personalTaskCreated", callback)
    }

    onStatUpdate(callback: SocketStatEvents['statUpdated']) {
        this.socket?.on("statUpdated", callback)
    }

    onUserStatusChanged(callback: SocketUserStatusEvents['userStatusChanged']) {
        this.socket?.on("userStatusChanged", callback)
    }

    joinTaskRoom(taskId: string) {
        this.socket?.emit("joinTaskRoom", taskId)
    }

    leaveTaskRoom(taskId: string) {
        this.socket?.emit("leaveTaskRoom", taskId)
    }

    onTaskRoomUpdated(callback: SocketTaskRoomEvents['taskRoomUpdate']) {
        this.socket?.on("taskRoomUpdate", callback)
    }

    onTaskRoomDeleted(callback: SocketTaskRoomEvents['taskRoomDeleted']) {
        this.socket?.on("taskRoomDeleted", callback)
    }
}

export default new SocketService();