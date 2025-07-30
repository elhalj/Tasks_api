import io, { Socket } from 'socket.io-client';
import type { Task, User } from '../context';

export interface SocketEvents {
    connect: () => void;
    disconnect: () => void;
    connect_error: (error: Error) => void;
    connected: (data: { message: string }) => void;
}

export interface Notification<T = Record<string, any>> {
    message: string;
    data: T;
    [key: string]: any;
}

export interface SocketTaskEvents {
    taskCreated: (notification: Notification<{ task: Task, message: string, type:string, authorId?: string }>) => void;
    taskUpdated: (notification: Notification<{ task: Task, previousTask: Task, message: string, change: {status: boolean, priority: boolean} }>) => void;
    taskDeleted: (notification: Notification<{ taskId: string, taskTitle: string, deletedBy: string }>) => void;
    taskViewed: (notification: Notification<{ taskId: string, viewedBy: string, taskTitle: string }>) => void;
    personalTaskCreated: (notification: Notification<{task: Task, message: string, type: string}>) => void;
}

export interface Stat {
    users: User[];
    tasks: Task[];
}

export interface SocketStatEvents {
    statUpdated: (notification: Notification<{ userId: string, stats: any }>) => void;
}

export interface SocketUserStatusEvents {
    userStatusChanged: (data: { userId: string, status: 'online' | 'offline' }) => void;
}

export interface SocketTaskRoomEvents {
    taskRoomUpdate: (data: { taskId: string, task: Task, updatedBy: string, timestamp: Date }) => void;
    taskRoomDeleted: (taskId: string) => void;
}

export interface SocketTaskRoomMethods {
    joinTaskRoom: (taskId: string) => void;
    leaveTaskRoom: (taskId: string) => void;
}

export interface SocketServiceInterface {
    connect: (token: string, userId: string) => Socket;
    disconnect: () => void;
    removeAllListeners: () => void;
    onTaskCreated: (callback: SocketTaskEvents['taskCreated']) => void;
    onTaskUpdated: (callback: SocketTaskEvents['taskUpdated']) => void;
    onTaskDeleted: (callback: SocketTaskEvents['taskDeleted']) => void;
    onTaskViewed: (callback: SocketTaskEvents['taskViewed']) => void;
    onPersonalTaskCreated: (callback: SocketTaskEvents['personalTaskCreated']) => void;
    onStatUpdate: (callback: SocketStatEvents['statUpdated']) => void;
    onUserStatusChanged: (callback: SocketUserStatusEvents['userStatusChanged']) => void;
    joinTaskRoom: SocketTaskRoomMethods['joinTaskRoom'];
    leaveTaskRoom: SocketTaskRoomMethods['leaveTaskRoom'];
    onTaskRoomUpdated: (callback: SocketTaskRoomEvents['taskRoomUpdate']) => void;
    onTaskRoomDeleted: (callback: SocketTaskRoomEvents['taskRoomDeleted']) => void;
}

class SocketService implements SocketServiceInterface {
    private socket: Socket | null;
    private isConnected: boolean;

    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect(token: string, userId: string): Socket {
        if (this.socket) {
            this.disconnect();
        }

        this.socket = io('http://localhost:3000', {
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