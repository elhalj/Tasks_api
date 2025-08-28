import { useContext, useState } from "react";
import { TaskContext } from "../context";

interface TaskProps {
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  estimatedHours: number;
  status: string;
  priority: string;
  progress: number
}

const statusTable = ["pending", "in_progress", "done", "canceled"];
const priorityTable = ["low", "medium", "high", "critical"];

const CreateTask = () => {
  const { addTask } = useContext(TaskContext);
  const [myTask, setMyTask] = useState<TaskProps>({
    title: "",
    description: "",
    dueDate: "2025-08-15",
    estimatedHours: 14,
    completed: false,
    status: "pending",
    priority: "low",
    progress:0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setMyTask((prev) => ({ ...prev, [name]: checked }));
    } else {
      setMyTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMyTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMyTask((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (title: string, description: string, dueDate: string) => {
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      setErrors("Vous devez rentrer au moins 3 caractères au titre");
      return false;
    }
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      setErrors("Veuillez renseigner une description");
      return false;
    }
    if (!dueDate || typeof dueDate !== "string" || isNaN(Date.parse(dueDate))) {
      setErrors("Veuillez renseigner une date de fin valide");
      return false;
    }
    // if (!estimatedHours || typeof estimatedHours !== "number") {
    //   setErrors("Veuillez renseigner une estimation de temps valide");
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm(myTask.title, myTask.description, myTask.dueDate)) {
      setLoading(false)
      return
    }
    try {
      
      await addTask(myTask.title, myTask.description,myTask.dueDate, myTask.estimatedHours, myTask.completed, myTask.status, myTask.priority, myTask.progress);
      // toast.success("Ajouté avec succès");
      setMyTask({ title: "", description: "",dueDate:"2025-08-15", estimatedHours:14, completed: false , status:"", priority:"", progress:0});
    } catch (error: any) {
      console.error(error);
      setErrors(error.toString())
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <label className="flex flex-col">
          <span className="text-lg font-bold">Titre</span>
          <input
            type="text"
            value={myTask.title}
            onChange={handleInputChange}
            name="title"
            placeholder="Entrez un titre"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-lg font-bold">Description</span>
          <textarea
            value={myTask.description}
            onChange={handleTextAreaChange}
            name="description"
            placeholder="Entrez une description"
            className="p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-lg font-bold">Date de fin</span>
          <input
            type="date"
            value={myTask.dueDate}
            onChange={handleInputChange}
            name="dueDate"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-lg font-bold">Estimation (h)</span>
          <input
            type="number"
            value={myTask.estimatedHours}
            onChange={handleInputChange}
            name="estimatedHours"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex gap-1 items-center">
          <span className="text-lg font-bold">Completed</span>
          <input
            type="checkbox"
            checked={myTask.completed}
            onChange={handleInputChange}
            name="completed"
            className="mr-2 h-6 w-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <div className="flex gap-2">
        <label className="flex flex-col">
          <span className="text-lg font-bold">Status</span>
          <select
            value={myTask.status}
            onChange={handleSelectChange}
            name="status"
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
            value={myTask.priority}
            onChange={handleSelectChange}
            name="priority"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorityTable.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-lg font-bold">Progress</span>
          <input
            type="number"
            value={myTask.progress}
            onChange={handleInputChange}
            name="progress"
            min={0}
            max={100}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </label>
        </div>
        {errors && (<p className="bg-red-400 text-white p-2 rounded-lg">{ errors}</p>)}
        <button
          type="submit"
          disabled={loading || new Date(myTask.dueDate) <= new Date()}
          className={` text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading || new Date(myTask.dueDate) <= new Date() ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`}
        >
          {loading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>
    </>
  );
};

export default CreateTask;
