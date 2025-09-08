import { useAuth } from "../hook"
import Profile from "../ui/profile/Profile"
import { Skeleton } from "../components/ui/skeleton"
import { useToast } from "../components/ui/use-toast"

const ProfilePage = () => {
  const { currentUser, loading, error } = useAuth()
  const { toast } = useToast()
  
  if (loading && !currentUser) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error,
    })
  }
  
  return (
    <div className="container mx-auto p-4">
      {currentUser ? (
        <Profile currentUser={currentUser} />
      ) : (
        <div className="text-center p-8">
          <p>Veuillez vous connecter pour accéder à votre profil</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
