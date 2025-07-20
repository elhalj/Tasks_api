import { createContext } from "react";

export interface User {
    _id?: string;
    userName: string;
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    register: async () => {},
    logout: () => {}
});
