import Tasks from "../ui/Tasks"
import { useContext, useState } from "react"
import Stats from "../ui/Stats"
import UtilsBar from "../ui/UtilsBar"
import Room from "./Room"
import { AuthContext } from "../context"


const Main = () => {
  const [viewMode, setViewMode] = useState("grid")
  const { user } = useContext(AuthContext)
  
  if (!user) {
    window.location.href = "/login"
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Barre d'outils */}
          <UtilsBar viewMode={viewMode} setViewMode={setViewMode} />
          {/* Taches */}
      <Tasks viewMode={viewMode} />
          {/* Satts */}
          <Stats/>
      {/* Rooms */}
      <Room/>
    </div>
  )
}

export default Main
