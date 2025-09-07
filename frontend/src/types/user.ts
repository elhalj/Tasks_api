
import type { Room } from "./room";
import type { Task } from "./task";

export interface Profile {
    firstName: string;
    lastName: string;
    bio: string;
    phone: string;
}
interface NotificationProps {
    email?: boolean;
    push?: boolean;
    taskUpdates?: boolean;
    mention?: boolean
}
// Préference
type LanguageType = "fr" | "en" | "es";
type ThemeType = "light" | "dark" | "system";
export interface Preference {
    notification?: NotificationProps;
    language?: LanguageType;
    theme: ThemeType;
}
// Statistiques
type StatusType = "active" | "inactive" | "suspended";
interface StatsProp {
    tasksCreated?: number;
    tasksCompleted?: string;
    commentsPosted?: number
    lastActiveRooms?: {
        room: Room;
        lastVisited: Date
    }[]
}
export interface User {
    _id?: string;
    userName: string;
    email: string;
    password: string;
    role?: string;
    profile?: Profile;
    preference?: Preference
    status?: StatusType;
    lastActiveAt?: Date;
    emailVerified?: boolean;
    verificationToken: string;
    verificationTokenExpires: Date;
    rooms?: Room[] | [];
    collaborators?: User[];
    myTasks?: Task[] | [];
    notifications?: Notification[] | [];
    stats: StatsProp
}