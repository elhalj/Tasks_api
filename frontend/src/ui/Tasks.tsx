import React, { useContext, useEffect } from "react";
import { AuthContext, TaskContext } from "../context";
import { Link } from "react-router-dom";
import { CheckCircle2, MoreHorizontal, Plus } from "lucide-react";
import getPriorityColor from "../utils/getPriorities";
import { getStatusIcon } from "../utils/getStatusIcon";
import Loader from "../components/Loader";

const Tasks = ({ viewMode }: { viewMode: string }) => {
  const { tasks, getTasks, deleteTask, loading } = useContext(TaskContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  if (loading) return <Loader />;

  if (currentUser && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-12">
        <CheckCircle2 className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">Aucune tâche</h3>
        <p className="text-gray-400 mb-6">
          Créez votre première tâche pour commencer !
        </p>
        <Link to="/dashboard/tasks/create">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Créer une tâche
          </button>
        </Link>
      </div>
    );
  }

  const TasksList = React.memo(() => (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
      }
    >
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl group cursor-pointer"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2 flex-wrap">
              {getStatusIcon(task.status)}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
              <span className="bg-gray-300/40 text-slate-700 px-2 py-1 rounded-lg text-xs">
                Échéance: {new Date(task.dueDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-700 hover:text-white transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
              {}
            </button>
          </div>

          {/* Title & description */}
          <h3 className="text-lg font-bold text-gray-600 mb-2 line-clamp-2">
            Titre: {task.title}
          </h3>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {task.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progression</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-between items-center text-sm text-gray-400 flex-wrap gap-2">
            <span className="text-xs text-gray-400">
              Dernière mise à jour:{" "}
              {task.updatedAt
                ? new Date(task.updatedAt).toLocaleDateString("fr-FR")
                : "Non définie"}
            </span>
            <div className="flex flex-wrap gap-2">
              <Link to={`/dashboard/tasks/${task._id}/edit`}>
                <button className="px-3 py-1 bg-blue-500/70 text-white rounded-md hover:bg-blue-600 transition-all text-sm">
                  Modifier
                </button>
              </Link>
              <button
                type="button"
                className="px-3 py-1 bg-red-500/70 text-white rounded-md hover:bg-red-600 transition-all text-sm"
                onClick={() => task._id && deleteTask(task._id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ));

  return <TasksList />;
};

export default Tasks;
