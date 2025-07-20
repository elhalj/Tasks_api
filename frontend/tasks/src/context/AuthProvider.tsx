import { useState, useCallback } from "react";
import { AuthContext, type User } from "./AuthContext";
import instance from "../services/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await instance.post("/auth/login/user", { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem("token", token);
            setToken(token);
            setUser(user);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }, []);

    const register = useCallback(async (userName: string, email: string, password: string) => {
        try {
            const response = await instance.post("/auth/register/user", { 
                userName, 
                email, 
                password 
            });
            const { /*token,*/ user } = response.data;
            
            // localStorage.setItem("token", token);
            // setToken(token);
            setUser(user);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }, []);

    // Set up axios interceptor for token
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
