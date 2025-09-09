import { useState } from "react"
import type { Preference, Profile, User } from "../../types"
import { useAuth } from "../../hook"
import Errors from "../../components/Error"

interface ProfileProps {
  currentUser: User | null | undefined
}

const Profiles = ({ currentUser }: ProfileProps) => {
    const { updatePreferences, updateProfile } = useAuth()
    
    // useState pour gérer l'affichage des onglets de profil et de préférence
    const [showProfile, setShowProfile] = useState(true) // Indique si l'onglet Profil est actif
    const [showPreference, setShowPreference] = useState(false) // Indique si l'onglet Préférence est actif
    const [showPreferenceInput, setShowPreferenceInput] = useState(false) // Indique si les champs de préférence sont visibles
    const [showProfileInput, setShowProfileInput] = useState(false) // Indique si les champs de profil sont visibles
const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const [preference, setPreference] = useState<Preference>({ 
        notification: {
            email: false, 
            push: false, 
            taskUpdates: false, 
            mention: false
        },
        language: "fr", 
        theme: "light" 
    })

    const [profileI, setProfileI] = useState<Profile>({ firstName: "", lastName: "", bio: "", phone: "" })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement >) => {
        const { name, value, type, checked } = e.target;
        if (name in (preference.notification || {})) {
            setPreference(prev => ({
                ...prev,
                notification: {
                    ...prev.notification,
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
                preference.notification?.email || false,
                preference.notification?.push || false,
                preference.notification?.taskUpdates || false,
                preference.notification?.mention || false,
                preference.language || 'fr',
                preference.theme || 'light',
                currentUser._id
            );
            
            // Fermer le formulaire après une mise à jour réussie
            setShowPreferenceInput(false);
        } catch (error) {
            // L'erreur est déjà gérée dans updatePreferences
            console.error("Erreur lors de la mise à jour des préférences:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validation des champs obligatoires
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
                profileI.firstName.trim(),
                profileI.lastName.trim(),
                profileI.bio?.trim() || "",
                profileI.phone?.trim() || "",
                currentUser._id
            );
            
            // Fermer le formulaire après une mise à jour réussie
            setShowProfileInput(false);
        } catch (error) {
            // L'erreur est déjà gérée dans updateProfile
            console.error("Erreur lors de la mise à jour du profil:", error);
        } finally {
            setLoading(false);
        }
    }

    if (showPreferenceInput) {
        return (
            <div className="flex flex-col items-center">
                <form
                    onSubmit={handleSubmitPreference}
                    className="flex flex-col gap-4 max-w-md mx-auto"
                >
                    {error && <Errors error={error} />}
                    <label className="flex items-center">
                        Email*:
                        <input
                            type="checkbox"
                            checked={preference.notification?.email || false}
                            name="email"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        Push*:
                        <input
                            type="checkbox"
                            checked={preference.notification?.push || false}
                            name="push"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        TaskUpdates*:
                        <input
                            type="checkbox"
                            checked={preference.notification?.taskUpdates || false}
                            name="taskUpdates"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex items-center">
                        Mention*:
                        <input
                            type="checkbox"
                            checked={preference.notification?.mention || false}
                            name="mention"
                            onChange={handleInputChange}
                            className="ml-2"
                        />
                    </label>
                    <label className="flex flex-col">
                        Language:
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        {loading ? "Enregistrement" : "Enregistrer"}
                    </button>
                </form>
            </div>
        )
    }

    if (showProfileInput) {
        return (<div>
            <form onSubmit={handleSubmitProfile} className="flex flex-col gap-2">
                {error && <Errors error={ error} />}
                <label className="flex flex-col gap-1">
                    First Name: <input type="text" value={profileI?.firstName || ""} name="firstName" onChange={handleTextAreaChange} className="border border-gray-300 rounded-md p-1" />
                </label>
                <label className="flex flex-col gap-1">
                    Last Name: <input type="text" value={profileI?.lastName || ""} name="lastName" onChange={handleTextAreaChange} className="border border-gray-300 rounded-md p-1" />
                </label>
                <label className="flex flex-col gap-1">
                    Bio: <textarea value={profileI?.bio || ""} name="bio" onChange={handleTextAreaChange} className="border border-gray-300 rounded-md p-1 resize-none" />
                </label>
                <label className="flex flex-col gap-1">
                    Phone: <input type="text" value={profileI?.phone || ""} name="phone" onChange={handleTextAreaChange} className="border border-gray-300 rounded-md p-1" />
                </label>
                <button type="submit" disabled={loading} className="bg-blue-400 p-2 rounded-md">{ loading ? "Enregistrment" : "Enregistrer"}</button>
            </form>
        </div>)
    }

  return (
    <>
          <div className="flex gap-1">
              <div className="flex flex-col gap-2 p-1 h-screen border-r-2 shadow-emerald-300">
                  <button type="button" className="bg-blue-400 p-2 rounded-md" onClick={() => setShowProfile(!showProfile)}>Profile</button>
                  <button type="button" className="bg-blue-400 p-2 rounded-md" onClick={() => setShowPreference(!showPreference)}>Préference</button>
              </div>
              <div className="mt-6 p-2">
                  {showProfile && (<div className={`${showPreference ? "hidden": "flex"}`}>
                      {currentUser && <div className="flex flex-col gap-4">
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">{currentUser["profile"]?.firstName}</p>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">{currentUser["profile"]?.lastName}</p>
                          <article className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">{currentUser["profile"]?.bio}</article>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">{currentUser["profile"]?.phone}</p>
                          <button type="button"  className="bg-blue-400 p-2 rounded-md" onClick={() => setShowPreferenceInput(!showPreferenceInput)}>Modifier</button>
                      </div>}
                  </div>)}

                  {showPreference && (
                    <div className={`${showProfile ? 'hidden' : 'flex'}`}>
                      {currentUser?.preference && (
                        <div className="flex flex-col gap-4">
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">
                            Email Notifications: {currentUser.preference.notification?.email ? 'Oui' : 'Non'}
                          </p>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">
                            Push Notifications: {currentUser.preference.notification?.push ? 'Oui' : 'Non'}
                          </p>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">
                            Task Updates: {currentUser.preference.notification?.taskUpdates ? 'Oui' : 'Non'}
                          </p>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">
                            Mentions: {currentUser.preference.notification?.mention ? 'Oui' : 'Non'}
                          </p>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">
                            Language: {currentUser.preference.language || 'Not set'}
                          </p>
                          <p className="bg-slate-100 backdrop-blur-sm p-1 rounded-md mt-2">
                            Theme: {currentUser.preference.theme || 'system'}
                                  </p>
                          <button type="button"  className="bg-blue-400 p-2 rounded-md" onClick={() => setShowProfileInput(!showProfileInput)}>Modifier</button>
                                  
                        </div>
                      )}
                    </div>
                  )}
              </div>
      </div>
    </>
  )
}

export default Profiles
