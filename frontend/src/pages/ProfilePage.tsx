import { useAuth } from "../hook"
import Profiles from "../ui/profile/Profile"
import Loader from "../components/Loader"
import Errors from "../components/Error"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import type { User } from "../types/user"

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { currentUser, getAllUser, user, loading, error } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [profileUser, setProfileUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      if (user.length === 0) {
        try {
          await getAllUser()
        } catch (error) {
          setErrorMsg("Failed to fetch user data")
          console.error(error)
          setIsLoading(false)
        }
      }
    }
    loadUser()
  }, [getAllUser, user.length])

  useEffect(() => {
    if (id) {
      if (id === currentUser?._id) {
        // Si l'ID correspond à l'utilisateur connecté
        setProfileUser(currentUser)
        setErrorMsg(null)
        setIsLoading(false)
      } else if (user.length > 0) {
        // Chercher l'utilisateur dans la liste
        const foundUser = user.find(u => u._id === id)
        if (foundUser) {
          setProfileUser(foundUser)
          setErrorMsg(null)
        } else {
          setProfileUser(null)
          setErrorMsg("User not found")
        }
        setIsLoading(false)
      }
    } else {
      // Si pas d'ID, afficher le profil de l'utilisateur connecté
      setProfileUser(currentUser)
      setIsLoading(false)
    }
  }, [id, user, currentUser])

  // Déterminer si c'est le propre profil de l'utilisateur
  const isOwnProfile = !id || id === currentUser?._id

  if (loading || isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Loader/>
      </div>
    )
  }

  if (error) {
    return <Errors error={error} />
  }

  if (errorMsg) {
    return <Errors error={errorMsg} />
  }

  if (!currentUser && !profileUser) {
    return (
      <div className="text-center p-8">
        <p>Please sign in to access profiles</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {profileUser ? (
        <div>
          {/* Titre indiquant le type de profil */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold">
              {isOwnProfile ? "Mon Profil" : `Profil de ${profileUser.userName}`}
            </h1>
            {!isOwnProfile && (
              <p className="text-gray-600 mt-2">
                Vous consultez le profil de {profileUser.userName}
              </p>
            )}
          </div>
          
          <Profiles 
            currentUser={profileUser} 
          />
        </div>
      ) : (
        <div className="text-center p-8">
          <p>Profile not found</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage