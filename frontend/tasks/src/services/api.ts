import axios from 'axios';

// URL de base par défaut (pour la production)
const DEFAULT_API_URL = 'http://localhost:3000/api/v1';

// Utilise l'URL de l'environnement ou la valeur par défaut
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Timeout de 10 secondes
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default instance;