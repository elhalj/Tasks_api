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
    dueDate: new Date().toISOString().split('T')[0],
    estimatedHours: 1,
    completed: false,
    status: "pending",
    priority: "low",
    progress: 0
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (myTask) {
      setTask({
        title: myTask.title,
        description: myTask.description,
        dueDate: myTask.dueDate.split('T')[0],
        estimatedHours: myTask.estimatedHours || 1,
        completed: myTask.completed || false,
        status: myTask.status || "pending",
        priority: myTask.priority || "low",
        progress: myTask.progress || 0
      });
    }
  }, [myTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setTask((prev) => ({ ...prev, [name]: checked }));
    } else {
      setTask((prev) => ({ ...prev, [name]: value }));
    }
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
    if (!id) {
      console.error("Task ID is not defined");
      return;
    }
    
    setLoading(true);
    try {
      await updateTask(id, task);
      // Optionally add a success message or redirect
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!myTask) {
    return <div className="p-4">Tâche non trouvée</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="text-blue-500 hover:underline bg-blue-100 px-3 py-1 rounded-md text-sm font-medium"
        >
          ← Retour au tableau de bord
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Modifier la tâche</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <label className="flex flex-col">
          <span className="text-lg font-bold">Titre</span>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleInputChange}
            placeholder="Entrez un titre"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        
        <label className="flex flex-col">
          <span className="text-lg font-bold">Description</span>
          <textarea
            name="description"
            value={task.description}
            onChange={handleTextAreaChange}
            placeholder="Entrez une description"
            className="p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-lg font-bold">Date de fin</span>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          
          <label className="flex flex-col">
            <span className="text-lg font-bold">Estimation (h)</span>
            <input
              type="number"
              name="estimatedHours"
              value={task.estimatedHours}
              onChange={handleInputChange}
              min="0.5"
              step="0.5"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          
          <label className="flex flex-col">
            <span className="text-lg font-bold">Statut</span>
            <select
              name="status"
              value={task.status}
              onChange={handleSelectChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusTable.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          
          <label className="flex flex-col">
            <span className="text-lg font-bold">Priorité</span>
            <select
              name="priority"
              value={task.priority}
              onChange={handleSelectChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityTable.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
            <span className="text-lg font-bold">Terminée</span>
            <input
              type="checkbox"
              name="completed"
              checked={task.completed}
              onChange={handleInputChange}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex flex-col">
            <span className="text-lg font-bold">Progression ({task.progress}%)</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={task.progress}
                onChange={handleInputChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-12 text-center">{task.progress}%</span>
            </div>
          </label>
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Link
            to="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
      </div>
  );
};

export default UpdateTask;
