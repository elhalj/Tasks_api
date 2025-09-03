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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 space-y-8">
        {/* Barre d'outils */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg">
          <UtilsBar viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Tâches */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg">
          <Tasks viewMode={viewMode} />
        </div>

        {/* Rooms */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg">
          <Room />
        </div>

        {/* Stats */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-lg">
          <Stats tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Main;
