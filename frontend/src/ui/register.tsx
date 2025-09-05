import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { ApiError } from "../types/apiError";
import { useAuth } from "../hook";

interface RegisterForm {
  userName: string;
  email: string;
  password: string;
}

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (userName: string, email: string, password: string) => {
    if (
      !userName ||
      typeof userName !== "string" ||
      userName.trim().length === 0
    ) {
      setError("Entrer un identfiant valide");
      return false;
    }
    if (userName.trim().length <= 3) {
      setError("Identifiant doit depasser au moins trois characteres");
      return false;
    }

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.trim().length === 0
    ) {
      setError("Vous devez rentrer un email valide");
      return false;
    }

    if (!password || password.trim().length === 0) {
      setError("Rentrer un mot de passe valide");
      return false;
    }

    if (password.length <= 5) {
      setError("Mot de passe doit depasser au moins 6 charactères");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm(formData.userName, formData.email, formData.password)) {
        setLoading(false);
        return;
      }

      await register(formData.userName, formData.email, formData.password);
      toast.success("Enregistré avec succès");
      navigate("/login");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        "Failed to Register";
      setError(`Error: ${errorMessage}`);
      toast.error("Erreur, Reessayez");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-5 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl px-8 pt-8 pb-10 border border-slate-200/60"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Créez votre compte ✨
        </h2>

        {/* Message erreur */}
        {error && (
          <div className="p-3 border border-red-400 bg-red-100/80 text-red-600 rounded-lg text-sm font-medium shadow-inner">
            {error}
          </div>
        )}

        {/* Username */}
        <label className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 mb-1">
            Nom d'utilisateur
          </span>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="Entrez votre nom"
            className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 mb-1">
            Adresse e-mail
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="exemple@email.com"
            className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
        </label>

        {/* Password */}
        <label className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 mb-1">
            Mot de passe
          </span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
        </label>

        {/* Lien connexion */}
        <p className="text-sm text-gray-500 text-center">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-500 hover:underline"
          >
            Se connecter
          </Link>
        </p>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enregistrement...
            </>
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
