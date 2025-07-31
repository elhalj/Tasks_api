import { useState, useCallback, useEffect } from "react";
import { AuthContext, type User } from "./AuthContext";
import instance from "../services/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        const saveUser = localStorage.getItem("user");
        if (saveUser) {
            try {
                setUser(JSON.parse(saveUser));
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token};`
        } else {
            delete instance.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await instance.post("/auth/login/user", { email, password });
            const { token, user } = response.data;
            
            
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user))
            setToken(token);
            localStorage.setItem("token", token);
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

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        window.location.href = "/"
    };

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
