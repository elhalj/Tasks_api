import { useContext } from "react"
import { AuthContext } from "../context"
import type { User } from "../types";


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw Error("useAuth must be use in AuthPRovider")
    }

    return context as {
        user: User[];
            currentUser: User | null;
            loading: boolean;
            error: string;
            login: (email: string, password: string) => Promise<void>;
            register: (userName: string, email: string, password: string) => Promise<void>;
            logout: () => void;
        getAllUser: () => Promise<void>;
        updatePreferences: (email: boolean, push: boolean, taskUpdates: boolean, mention: boolean, language: string, theme: string, profileId: string) => Promise<void>;
        updateProfile: (firstName: string, lastName: string, bio: string, phone: string, profileId: string) => Promise<void>
    }
}