import { useAuth } from "../hook"
import Profiles from "../ui/profile/Profile"
import Loader from "../components/Loader"
import Errors from "../components/Error"

const ProfilePage = () => {
  const { currentUser, loading, error } = useAuth()
  
  if (loading && !currentUser) {
    return (
      <div className="space-y-4 p-4">
        <Loader/>
      </div>
    )
  }

  if (error) {
    return <Errors error={ error} />
  }
  
  return (
    <div className="container mx-auto p-4">
      {currentUser ? (
        <Profiles currentUser={currentUser} />
      ) : (
        <div className="text-center p-8">
          <p>Veuillez vous connecter pour accéder à votre profil</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
