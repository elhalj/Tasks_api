import Tasks from "../ui/Tasks"
import { useState } from "react"
import Stats from "../ui/Stats"
import UtilsBar from "../ui/UtilsBar"


const Main = () => {
    const [viewMode, setViewMode] = useState("grid")
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Barre d'outils */}
          <UtilsBar viewMode={viewMode} setViewMode={setViewMode} />
          {/* Taches */}
          <Tasks viewMode={viewMode} />
          {/* Satts */}
          <Stats/>
    </div>
  )
}

export default Main
