import React, { useContext, useState } from 'react'
import { AuthContext } from '../context';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginForm {
    email: string;
    password: string
}

const Login = () => {
    const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' })
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password)
            toast.success("Connecté avec succès")
            navigate('/dashboard')
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            } else {
                console.error("Une erreur est survenue lors de l'enregistrement")
            }
            toast.error("Erreur de connexion")
        } finally {
            setLoading(false);
        }
    }

  return (
      <div className="flex flex-col justify-center">
          <button type='button' className="text-center mb-2 bg-indigo-400/50 backdrop-blur-lg backdrop-filter  border border-blue-100 rounded-md hover:bg-indigo-300 cursor-pointer">
              <Link to="/" className="text-white hover:underline">Retourner sur la page d'accueil</Link>
          </button>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
              </label>
              <input 
                      type="email" 
                      name="email" 
                  id="email" 
                  aria-label='email'
                      value={formData.email} 
                      onChange={handleChange} 
                      className="p-2 rounded-md border border-slate-300 w-full"
                  />
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                  Password *
              </label>
              <input 
                      type="password" 
                      name='password' 
                      id='password' 
                      aria-label="Password"
                      value={formData.password} 
                      onChange={handleChange} 
                      className="p-2 rounded-md border border-slate-300 w-full"
              />
              <p className='mt-4 text-gray-400'>Vous n'avez pas de compte ? <Link to='/register' className='underline text-blue-300'>Creer un compte</Link></p>
              
              <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded-md mt-4">
                  {loading ? 'Connexion en cours' : 'Login'}
              </button>
      </form>
    </div>
  )
}

export default Login
