import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { ApiError } from "../types/apiError";
import { useAuth } from "../hook";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (email: string, password: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer un email valide");
      return false;
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      setError("Veuillez renseigner un mot de passe valide");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateForm(formData.email, formData.password)) {
        setLoading(false);
        return;
      }
      await login(formData.email, formData.password);
      toast.success("Connecté avec succès");
      navigate("/dashboard");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        "Connexion Error";
      setError(`Erreur ${errorMessage}`);
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Bouton retour */}
      <button
        type="button"
        className="mb-6 px-4 py-2 flex items-center gap-2 bg-indigo-500/80 backdrop-blur-lg border border-indigo-300/30 rounded-lg text-white shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-300"
      >
        <Link to="/" className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retourner à l'accueil
        </Link>
      </button>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl px-8 pt-8 pb-10 border border-slate-200/60"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Connexion 🔐
        </h2>

        {/* Message erreur */}
        {error && (
          <div className="mb-4 p-3 border border-red-400 bg-red-100/80 text-red-600 rounded-lg text-sm font-medium shadow-inner">
            {error}
          </div>
        )}

        {/* Email */}
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          name="email"
          id="email"
          aria-label="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@email.com"
          className="p-3 rounded-lg border border-slate-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />

        {/* Password */}
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-semibold mb-2 mt-4"
        >
          Mot de passe *
        </label>
        <input
          type="password"
          name="password"
          id="password"
          aria-label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="p-3 rounded-lg border border-slate-300 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />

        {/* Lien inscription */}
        <p className="mt-4 text-gray-500 text-sm text-center">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-500 hover:underline"
          >
            Créez-en un
          </Link>
        </p>

        {/* Bouton submit */}
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 w-full rounded-lg mt-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Connexion en cours...
            </>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
