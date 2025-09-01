import type { Task } from "./task";
import type { User } from "./user";

export interface Room {
    _id?: string;
    room_name: string;
    description: string;
    members?: User[];
    tasks?: Task[];
    admin: User;
    comments?: Comment[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string
}