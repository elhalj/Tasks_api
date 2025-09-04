import Tasks from "../ui/Tasks";
import { useContext, useState } from "react";
import Stats from "../ui/Stats";
import UtilsBar from "../ui/UtilsBar";
import Room from "./Room";
import { AuthContext, TaskContext } from "../context";

const Main = () => {
  const [viewMode, setViewMode] = useState("grid");
  const { tasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  if (!user) {
    window.location.href = "/login";
  }
  return (
    <div className="min-h-screen bg-white flex justify-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white   space-y-8">
        {/* Barre d'outils */}
        <div >
          <UtilsBar viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Tâches */}
        <div>
          <Tasks viewMode={viewMode} />
        </div>

        {/* Rooms */}
        <div>
          <Room />
        </div>

        {/* Stats */}
        <div>
          <Stats tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Main;
