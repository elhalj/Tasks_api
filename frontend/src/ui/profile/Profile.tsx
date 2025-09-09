import { useState, useEffect } from "react"
import type { Preference, Profile, User } from "../../types"
import { useAuth } from "../../hook"
import Errors from "../../components/Error"

interface ProfileProps {
  currentUser: User | null | undefined
}

const Profiles = ({ currentUser }: ProfileProps) => {
    const { updatePreferences, updateProfile } = useAuth()
    
    // useState pour gérer l'affichage des onglets de profil et de préférence
    const [activeTab, setActiveTab] = useState<'profile' | 'preference'>('profile')
    const [showPreferenceInput, setShowPreferenceInput] = useState(false)
    const [showProfileInput, setShowProfileInput] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [preference, setPreference] = useState<Preference>({ 
        notifications: {
            email: false, 
            push: false, 
            taskUpdates: false, 
            mention: false
        },
        language: "fr", 
        theme: "light" 
    })

    const [profileI, setProfileI] = useState<Profile>({ 
        userName: "",
        firstName: "", 
        lastName: "", 
        bio: "", 
        phone: "" 
    })

    // Initialiser les valeurs avec les données de l'utilisateur actuel
    useEffect(() => {
        if (currentUser) {
            // Initialiser les préférences
            if (currentUser.preference) {
                setPreference({
                    notifications: {
                        email: currentUser.preference.notifications?.email || false,
                        push: currentUser.preference.notifications?.push || false,
                        taskUpdates: currentUser.preference.notifications?.taskUpdates || false,
                        mention: currentUser.preference.notifications?.mention || false
                    },
                    language: currentUser.preference.language || "fr",
                    theme: currentUser.preference.theme || "light"
                })
            }
            
            // Initialiser le profil
            if (currentUser.profile) {
                setProfileI({
                    userName: currentUser.profile.userName || currentUser.userName || "",
                    firstName: currentUser.profile.firstName || "",
                    lastName: currentUser.profile.lastName || "",
                    bio: currentUser.profile.bio || "",
                    phone: currentUser.profile.phone || ""
                })
            }
        }
    }, [currentUser])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (name in (preference.notifications || {})) {
            setPreference(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [name]: checked
                }
            }));
        } else {
            setPreference(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setPreference(prev => ({...prev, [name]: value}))
    }

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfileI(prev => ({...prev, [name]: value}))
    }

    const handleSubmitPreference = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser?._id) {
            setError("Erreur: Impossible d'identifier l'utilisateur");
            return;
        }
        
        try {
            setLoading(true);
            setError("");
            
            await updatePreferences(
                preference.notifications?.email || false,
                preference.notifications?.push || false,
                preference.notifications?.taskUpdates || false,
                preference.notifications?.mention || false,
                preference.language || 'fr',
                preference.theme || 'light',
                currentUser._id
            );
            
            setShowPreferenceInput(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des préférences:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!profileI.firstName?.trim() || !profileI.lastName?.trim()) {
            setError("Le prénom et le nom sont obligatoires");
            return;
        }
        
        if (!currentUser?._id) {
            setError("Erreur: Impossible d'identifier l'utilisateur");
            return;
        }
        
        try {
            setLoading(true);
            setError("");
            
            await updateProfile(
                profileI.userName.trim() || currentUser.userName,
                profileI.firstName.trim(),
                profileI.lastName.trim(),
                profileI.bio?.trim() || "",
                profileI.phone?.trim() || "",
                currentUser._id
            );
            
            setShowProfileInput(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
        } finally {
            setLoading(false);
        }
    }

    // Affichage du formulaire de préférences
    if (showPreferenceInput) {
        return (
            <div className="flex flex-col items-center">
                <div className="mb-4">
                    <button 
                        onClick={() => setShowPreferenceInput(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                    >
                        Retour
                    </button>
                </div>
                <form
                    onSubmit={handleSubmitPreference}
                    className="flex flex-col gap-4 max-w-md mx-auto"
                >
                    {error && <Errors error={error} />}
                    <label className="flex items-center">
                        Email:
                        <input
                            type="checkbox"
                            checked={preference.notifications?.email || false}
                            name="email"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        Push:
                        <input
                            type="checkbox"
                            checked={preference.notifications?.push || false}
                            name="push"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        Mises à jour des tâches:
                        <input
                            type="checkbox"
                            checked={preference.notifications?.taskUpdates || false}
                            name="taskUpdates"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        Mentions:
                        <input
                            type="checkbox"
                            checked={preference.notifications?.mention || false}
                            name="mention"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex flex-col">
                        Langue:
                        <select
                            name="language"
                            value={preference.language}
                            onChange={handleSelectChange}
                            className="block w-full p-2 border border-gray-300 rounded-md mt-1"
                        >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </label>
                    <label className="flex flex-col">
                        Thème:
                        <select
                            name="theme"
                            value={preference.theme}
                            onChange={handleSelectChange}
                            className="block w-full p-2 border border-gray-300 rounded-md mt-1"
                        >
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                            <option value="system">Système</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </form>
            </div>
        )
    }

    // Affichage du formulaire de profil
    if (showProfileInput) {
        return (
            <div>
                <div className="mb-4">
                    <button 
                        onClick={() => setShowProfileInput(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                    >
                        Retour
                    </button>
                </div>
                    {error && <Errors error={error} />}
                <form onSubmit={handleSubmitProfile} className="flex flex-col gap-2 max-w-md">
                    <label className="flex flex-col gap-1">
                        Nom d'utilisateur *: 
                        <input 
                            type="text" 
                            value={profileI?.userName || ""} 
                            name="userName" 
                            onChange={handleTextAreaChange} 
                            className="border border-gray-300 rounded-md p-1"
                            required 
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        Prénom *: 
                        <input 
                            type="text" 
                            value={profileI?.firstName || ""} 
                            name="firstName" 
                            onChange={handleTextAreaChange} 
                            className="border border-gray-300 rounded-md p-1"
                            required 
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        Nom *: 
                        <input 
                            type="text" 
                            value={profileI?.lastName || ""} 
                            name="lastName" 
                            onChange={handleTextAreaChange} 
                            className="border border-gray-300 rounded-md p-1"
                            required 
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        Bio: 
                        <textarea 
                            value={profileI?.bio || ""} 
                            name="bio" 
                            onChange={handleTextAreaChange} 
                            className="border border-gray-300 rounded-md p-1 resize-none"
                            rows={3}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        Téléphone: 
                        <input 
                            type="tel" 
                            value={profileI?.phone || ""} 
                            name="phone" 
                            onChange={handleTextAreaChange} 
                            className="border border-gray-300 rounded-md p-1" 
                        />
                    </label>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-blue-400 p-2 rounded-md disabled:opacity-50"
                    >
                        {loading ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </form>
            </div>
        )
    }

    // Affichage principal avec les onglets
    return (
        <div className="flex gap-4">
            {/* Navigation des onglets */}
            <div className="flex flex-col gap-2 p-4 h-fit border-r-2 shadow-sm">
                <button 
                    type="button" 
                    className={`p-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}`} 
                    onClick={() => setActiveTab('profile')}
                >
                    Profil
                </button>
                <button 
                    type="button" 
                    className={`p-2 rounded-md ${activeTab === 'preference' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white'}`} 
                    onClick={() => setActiveTab('preference')}
                >
                    Préférences
                </button>
            </div>

            {/* Contenu des onglets */}
            <div className="flex-1 p-4">
                {activeTab === 'profile' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold mb-4">Informations du Profil</h2>
                        {currentUser?.profile ? (
                            <div className="space-y-3">
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Prénom:</span> {currentUser.profile.firstName || 'Non renseigné'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Nom:</span> {currentUser.profile.lastName || 'Non renseigné'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Bio:</span> {currentUser.profile.bio || 'Non renseignée'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Téléphone:</span> {currentUser.profile.phone || 'Non renseigné'}
                                </div>
                                <button 
                                    type="button"  
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors" 
                                    onClick={() => setShowProfileInput(true)}
                                >
                                    Modifier le profil
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <p className="mb-4">Aucune information de profil disponible</p>
                                <button 
                                    type="button"  
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors" 
                                    onClick={() => setShowProfileInput(true)}
                                >
                                    Créer un profil
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'preference' && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold mb-4">Préférences</h2>
                        {currentUser?.preference ? (
                            <div className="space-y-3">
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Notifications Email:</span> {currentUser.preference.notifications?.email ? 'Activées' : 'Désactivées'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Notifications Push:</span> {currentUser.preference.notifications?.push ? 'Activées' : 'Désactivées'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Mises à jour des tâches:</span> {currentUser.preference.notifications?.taskUpdates ? 'Activées' : 'Désactivées'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Mentions:</span> {currentUser.preference.notifications?.mention ? 'Activées' : 'Désactivées'}
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Langue:</span> {
                                        currentUser.preference.language === 'fr' ? 'Français' :
                                        currentUser.preference.language === 'en' ? 'English' :
                                        currentUser.preference.language === 'es' ? 'Español' :
                                        'Non définie'
                                    }
                                </div>
                                <div className="bg-slate-100 p-3 rounded-md">
                                    <span className="font-semibold">Thème:</span> {
                                        currentUser.preference.theme === 'light' ? 'Clair' :
                                        currentUser.preference.theme === 'dark' ? 'Sombre' :
                                        currentUser.preference.theme === 'system' ? 'Système' :
                                        'Non défini'
                                    }
                                </div>
                                <button 
                                    type="button"  
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors" 
                                    onClick={() => setShowPreferenceInput(true)}
                                >
                                    Modifier les préférences
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <p className="mb-4">Aucune préférence définie</p>
                                <button 
                                    type="button"  
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors" 
                                    onClick={() => setShowPreferenceInput(true)}
                                    style={{ display: 'block' }}
                                >
                                    Configurer les préférences
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profiles