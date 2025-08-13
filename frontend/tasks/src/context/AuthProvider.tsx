import { useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import instance from "../services/api";
import type { User } from "../types/user";
// import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User[]>([]);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(false);
    // const navigate = useNavigate();

    // Essaye de récupérer l'utilisateur stocké en local
    useEffect(() => {
        const saveUser = localStorage.getItem("user");
        if (saveUser) {
            try {
                // Essaye de parser l'utilisateur stocké en local
                const parsedUser = JSON.parse(saveUser);
                setUser(Array.isArray(parsedUser) ? parsedUser : [parsedUser]);
            } catch (error) {
                console.error(
                    "Erreur lors de la lecture de l'utilisateur stocké en local:",
                    error
                );
                // Si l'utilisateur stocké en local est corrompu, on le supprime
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        try {
            // Si un token est disponible, on l'ajoute en entête par défaut pour les requêtes
            if (token) {
                instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                // Si pas de token, on supprime l'entête par défaut
                delete instance.defaults.headers.common['Authorization'];
                // On vérifie si on est déjà sur la page de login pour éviter la boucle
                // if (window.location.pathname !== '/login') {
                //     window.location.href = "/login";
                // }
            }
        } catch (error) {
            console.error("Erreur lors de la mise en place de l'entête de requête:", error);
            if (window.location.pathname !== '/login') {
                window.location.href = "/login";
            }
        }
    }, [token]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await instance.post("/auth/login/user", { email, password });
            const { token, user } = response.data;
            
            
setUser([user]);
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
setUser([user]);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser([]);
        window.location.href = "/"
    };

    const getAllUser = async () => {
        try {
            setLoading(true);
            const res = await instance.get("/auth/getAll/user");
setUser(Array.isArray(res.data) ? res.data : [res.data])
        } catch (error: any) {
            console.error(error.message);
            throw error;
        }
    }

    // Set up axios interceptor for token
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    
    }


    return (
        <AuthContext.Provider value={{ user, login, register, logout, getAllUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
