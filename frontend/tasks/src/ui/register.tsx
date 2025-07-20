
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RegisterForm {
    userName: string;
    email: string;
    password: string
}

const Register = () => {
    const { register } = useContext(AuthContext)
    const [formData, setFormData] = useState<RegisterForm>({ userName: '', email: '', password: '' })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            await register(formData.userName, formData.email, formData.password)
            toast.success('Enregistré avec succès')
            navigate('/')
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Registration failed:", error.message);
            } else {
                console.error("An unknown error occurred during registration");
            }
            toast.error("Erreur, Reessayez")
        } finally {
            setLoading(false)
        }

    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-slate-100 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <label className="flex flex-col">
                    <span className="text-sm font-medium">Nom d'utilisateur</span>
                    <input type="text" className="p-2 rounded-md border border-slate-300" name="userName" value={formData.userName} onChange={handleInputChange} />
                </label>
                <label className="flex flex-col">
                    <span className="text-sm font-medium">Adresse e-mail</span>
                    <input type="email" className="p-2 rounded-md border border-slate-300" name="email" value={formData.email} onChange={handleInputChange} />
                </label>
                <label className="flex flex-col">
                    <span className="text-sm font-medium">Mot de passe</span>
                    <input type="password" className="p-2 rounded-md border border-slate-300" name="password" value={formData.password} onChange={handleInputChange} />
                </label>
                <p className='mt-4 text-gray-400'>Vous avez dejà un compte ? <Link to='/' className='underline text-blue-300'>Se connecter</Link></p>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">{loading ? "Enregistrement en cours..." : "S'inscrire"}</button>
            </form>
        </div>
    )
}

export default Register
