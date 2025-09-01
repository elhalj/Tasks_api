import type { User } from "./user";

interface AttachementProp {
    filename: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
    uploadedBy: User;
}
export interface Task {
    _id?: string;
    title: string;
    description: string;
    completed?: boolean;
    status?: string;
    priority?: string;
    progress?: number;
    updatedAt?: string | number | Date;
    dueDate: string;
    startDate?: Date;
    estimatedHours?: number;
    timeSpent?: number;
    assignees?: {
        name: string;
        email: string
    }; // Using string[] to match the API expectations
    roomId?: string;
    labels?: string[];
    attachements?: AttachementProp;
    isPrivate?: boolean;
    watchers?: User[];
    comments?: Comment[];
    author?: {
        _id: string;
        userName: string;
        email: string
    } | null;
}