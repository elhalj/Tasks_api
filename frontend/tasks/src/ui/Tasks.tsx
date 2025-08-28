
import React, { useContext, useEffect } from "react";
import { AuthContext, TaskContext } from "../context";
import { Link } from "react-router-dom";
import { CheckCircle2, MoreHorizontal, Plus } from "lucide-react";
import getPriorityColor from "../utils/getPriorities";
import { getStatusIcon } from "../utils/getStatusIcon";
import Loader from "../components/Loader";

const Tasks = ({ viewMode }: {viewMode: string}) => {
  const { tasks, getTasks, deleteTask, loading } = useContext(TaskContext);
  const { currentUser } = useContext(AuthContext);

  // Load tasks on component mount
  useEffect(() => {
    getTasks();
  }, [getTasks]);


  if (loading) {
   return <Loader/>
 }

  if (currentUser && tasks.length === 0) {
    return <div className="text-center text-lg">Vous n'avez pas de taches</div>;
  }

  const TasksList = React.memo(() => (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
              <button type="button" className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all">
                <MoreHorizontal className="w-4 h-4" /> {}
              </button>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {task.title}
            </h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>
                Dernière mise à jour: {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString("fr-FR") : "Non définie"}
              </span>
              <div className="flex space-x-2">
                {task._id && (
                  <div className='flex gap-2'>
                    <Link to={`/dashboard/tasks/${task._id}/edit`}>
                      <p className="text-white p-2 bg-blue-400 rounded-md hover:text-blue-300 transition-colors">
                        Modifier
                      </p>
                    </Link>
                    <button
                      type='button'
                      className='bg-red-400 text-white p-2 rounded-md hover:text-red-300 transition-colors'
                      onClick={async () => {
                        if (task._id) {
                          await deleteTask(task._id);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 col-span-full">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucune tâche</h3>
          <p className="text-gray-400 mb-6">Créez votre première tâche pour commencer !</p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5 inline mr-2" />
            Créer une tâche
          </button>
        </div>
      )}
    </div>
  ))
  return (
    <TasksList/>
  );
};

export default Tasks;
