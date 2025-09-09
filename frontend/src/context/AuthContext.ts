import { createContext } from "react";
import type { User } from "../types/user";

export interface AuthContextType {
    user: User[];
    currentUser: User | null;
    loading: boolean;
    error: string;
    login: (email: string, password: string) => Promise<void>;
    register: (userName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    getAllUser: () => Promise<void>;
    getUserById: (id: string) => Promise<User>; // Nouvelle fonction
    updatePreferences: (email: boolean, push: boolean, taskUpdates: boolean, mention: boolean, language: string, theme: string, profileId: string) => Promise<void>;
    updateProfile: (userName: string, firstName: string, lastName: string, bio: string, phone: string, profileId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: [],
    currentUser: null,
    login: async () => {},
    register: async () => {},
    logout: () => { },
    getAllUser: async () => { },
    getUserById: async () => ({} as User), // Valeur par défaut
    updatePreferences: async () => { },
    updateProfile: async () => {},
    loading: false,
    error: ""
});