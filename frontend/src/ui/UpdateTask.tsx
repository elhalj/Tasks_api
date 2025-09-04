import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskContext } from "../context";

interface TaskProps {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  estimatedHours: number;
  status: string;
  priority: string;
  progress: number;
}

const statusTable = ["pending", "in_progress", "done", "canceled"];
const priorityTable = ["low", "medium", "high", "critical"];

const UpdateTask = () => {
  const { tasks, updateTask } = useContext(TaskContext);
  const { id } = useParams<{ id: string }>();
  const myTask = tasks.find((t) => t._id === id);

  const [task, setTask] = useState<TaskProps>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    estimatedHours: 1,
    completed: false,
    status: "pending",
    priority: "low",
    progress: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (myTask) {
      setTask({
        title: myTask.title,
        description: myTask.description,
        dueDate: myTask.dueDate.split("T")[0],
        estimatedHours: myTask.estimatedHours || 1,
        completed: myTask.completed || false,
        status: myTask.status || "pending",
        priority: myTask.priority || "low",
        progress: myTask.progress || 0,
      });
    }
  }, [myTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await updateTask(id, task);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setLoading(false);
    }
  };

  if (!myTask) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-lg font-medium">
        Tâche non trouvée
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Retour */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="inline-block text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          ← Retour au tableau de bord
        </Link>
      </div>

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Modifier la tâche
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Titre */}
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">Titre</span>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleInputChange}
            placeholder="Entrez un titre"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
            required
          />
        </label>

        {/* Description */}
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">
            Description
          </span>
          <textarea
            name="description"
            value={task.description}
            onChange={handleTextAreaChange}
            placeholder="Entrez une description"
            className="p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 min-h-[120px]"
          />
        </label>

        {/* Grille inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </span>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Estimation (h)
            </span>
            <input
              type="number"
              name="estimatedHours"
              value={task.estimatedHours}
              onChange={handleInputChange}
              min="0.5"
              step="0.5"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Statut
            </span>
            <select
              name="status"
              value={task.status}
              onChange={handleSelectChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
            >
              {statusTable.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">
              Priorité
            </span>
            <select
              name="priority"
              value={task.priority}
              onChange={handleSelectChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
            >
              {priorityTable.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Checkbox et progression */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              name="completed"
              checked={task.completed}
              onChange={handleInputChange}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Terminée</span>
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">
              Progression ({task.progress}%)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={task.progress}
                onChange={handleInputChange}
                className="flex-1 h-2 bg-gray-300 rounded-lg accent-blue-600 cursor-pointer"
              />
              <span className="w-12 text-center text-gray-700 font-medium">
                {task.progress}%
              </span>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6 flex-wrap">
          <Link
            to="/dashboard"
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTask;
