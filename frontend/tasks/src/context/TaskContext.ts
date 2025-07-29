import { createContext } from "react";

export interface Task {
    _id?: string;
    title: string;
    description: string;
    completed?: boolean;
    author?: {
        _id: string;
        userName: string;
        email: string
    } | null;
}

export interface TaskProps {
    tasks: Task[];
    addTask: (title: string, description: string, completed?: boolean) => Promise<void>;
    getTasks: () => Promise<void>;
    getTaskById: (id: string) => Promise<Task | null>;
    updateTask: (id: string, task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

export const TaskContext = createContext<TaskProps>({
    tasks: [],
    addTask: async () => { },
    getTasks: async () => { },
    getTaskById: async () => null,
    updateTask: async () => { },
    deleteTask: async () => { }
});