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
    getAllUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    user: [],
    currentUser: null,
    login: async () => {},
    register: async () => {},
    logout: () => { },
    getAllUser: async () => { },
    loading: false,
    error:""
});
