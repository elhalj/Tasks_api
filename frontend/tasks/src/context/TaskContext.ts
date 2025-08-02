import { createContext } from "react";

export interface Task {
    _id?: string;
    title: string;
    description: string;
    completed?: boolean;
    status?: string;
    priority?: string;
    progress?: number;
    updatedAt?: string | number | Date;
    author?: {
        _id: string;
        userName: string;
        email: string
    } | null;
}

export interface TaskProps {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    onlineUsers: Set<string>;
    stats: any;
    addTask: (title: string, description: string, completed?: boolean,status?: string, priority?: string, progress?:number) => Promise<void>;
    getTasks: () => Promise<void>;
    getTaskById: (id: string) => Promise<Task | null>;
    updateTask: (id: string, task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    viewTaskDetails: (taskId: string) => void;
    leaveTaskDetails : (taskId: string) => void;
}

export const TaskContext = createContext<TaskProps>({
    tasks: [],
    loading: true,
    error: null,
    onlineUsers: new Set(),
    stats: {},
    addTask: async () => {},
    getTasks: async () => {},
    getTaskById: async () => null,
    updateTask: async () => {},
    deleteTask: async () => {},
    viewTaskDetails: () => {},
    leaveTaskDetails: () => {}
});