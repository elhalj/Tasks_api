import { useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import instance from "../services/api";
import type { User } from "../types/user";
import toast from "react-hot-toast";


type ApiError = Error & {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Séparation entre l'utilisateur connecté et tous les utilisateurs
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User[]>([]); // Tous les utilisateurs pour AddMember
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("")

  // Essaye de récupérer l'utilisateur connecté stocké en local
  useEffect(() => {
    const saveUser = localStorage.getItem("user");
    if (saveUser) {
      try {
        const parsedUser = JSON.parse(saveUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error(
          "Erreur lors de la lecture de l'utilisateur stocké en local:",
          error
        );
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete instance.defaults.headers.common["Authorization"];
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise en place de l'entête de requête:",
        error
      );
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await instance.post("/auth/login/user", {
        email,
        password,
      });
      const { token, user } = response.data;

      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed login";
      setError(`Error: ${errorMessage}`);
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (userName: string, email: string, password: string) => {
      try {
        setLoading(true);
        const response = await instance.post("/auth/register/user", {
          userName,
          email,
          password,
        });
        const { user } = response.data;
        setCurrentUser(user);
        // Note: Pas de token automatique après registration selon votre logique
      } catch (error) {
         const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed register";
      setError(`Error: ${errorMessage}`);
        console.error("Registration failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    setUser([]); // Reset tous les utilisateurs aussi
    window.location.href = "/login";
  }, []);

  const getAllUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await instance.get("/auth/user");
      
      console.log("API Response:", res.data); // Debug
      
      // L'API retourne directement un array d'utilisateurs
      if (Array.isArray(res.data)) {
        setUser(res.data);
      } else {
        console.error("API ne retourne pas un array:", res.data);
        setUser([]);
      }
    } catch (error) {
       const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to get User";
      setError(`Error: ${errorMessage}`);
      console.error("Erreur getAllUser:", error);
      setUser([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (preference: User["preference"], profileId: string) => { 
    try {
      setLoading(true)
      const response = await instance.put(`/auth/update/preference/${profileId}`, {
        preference
      })

      const { res } = response.data
      setCurrentUser(res)
    } catch (error) {
      const apiError = error as ApiError
      const messageError = apiError.response?.data?.message || apiError.response?.data?.error || "Erreur de modification"
      setError(`Erreur: ${messageError}`)
      toast.error(messageError)
    }finally{
      setLoading(false)
    }
  }, [])
  
  const updateProfile = useCallback(async (profile: User["profile"], profileId: string) => {
    try {
      setLoading(true)
      const response = await instance.put(`/auth/profile/${profileId}`, {
        profile
      })

      const res = await response.data
      setCurrentUser(res)
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.response?.data?.message || apiError.response?.data?.error || "Erreur de modification"
      setError(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  },[])

  return (
    <AuthContext.Provider
      value={{ 
        user, // Array de tous les utilisateurs
        currentUser, // Utilisateur connecté
        login, 
        register, 
        logout, 
        getAllUser, 
        updatePreferences,
        updateProfile,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};