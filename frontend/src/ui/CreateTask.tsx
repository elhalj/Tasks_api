import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context";
import { useRoom } from "../hook/useRoom";

interface TaskProps {
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  estimatedHours: number;
  status: string;
  priority: string;
  progress: number;
  roomId?: string
}
interface CreateTaskProps {
  roomId?: string;
}

const statusTable = ["pending", "in_progress", "done", "canceled"];
const priorityTable = ["low", "medium", "high", "critical"];

const CreateTask = ({ roomId }: CreateTaskProps) => {
  const { addTask } = useContext(TaskContext);
  const { room, getRoom } = useRoom()
  useEffect(() => {
    getRoom()
  },[getRoom])
  const [myTask, setMyTask] = useState<TaskProps>(() => ({
    title: "",
    description: "",
    dueDate: "2025-08-15",
    estimatedHours: 14,
    completed: false,
    status: "pending",
    priority: "low",
    progress: 0,
    roomId: roomId || ""
  }));

  // Mise à jour de roomId si la prop change
  useEffect(() => {
    if (roomId) {
      setMyTask(prev => ({
        ...prev,
        roomId: roomId
      }));
    }
  }, [roomId]);
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

  const handleRoomChange = (roomId: string) => {
    setMyTask(prev => ({
      ...prev,
      roomId: prev.roomId === roomId ? undefined : roomId
    }));
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
      setLoading(false);
      return;
    }
    try {
      await addTask(
        myTask.title,
        myTask.description,
        myTask.dueDate,
        myTask.estimatedHours,
        roomId,  // roomId est maintenant le 5ème paramètre
        myTask.completed,
        myTask.status,
        myTask.priority,
        myTask.progress
      );
      setMyTask({ 
        title: "", 
        description: "",
        dueDate: "2025-08-15", 
        estimatedHours: 14, 
        completed: false, 
        status: "pending", 
        priority: "low", 
        progress: 0 
      });
    } catch (error: any) {
      console.error(error);
      setErrors(error.toString())
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <form
  onSubmit={handleSubmit}
  className="flex flex-col gap-6 w-full max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg"
>
  <h2 className="text-2xl font-bold text-gray-800 text-center">
    Ajouter une tâche
  </h2>

  {/* Champ Titre */}
  <label className="flex flex-col gap-2">
    <span className="text-base font-medium text-gray-700">Titre</span>
    <input
      type="text"
      value={myTask.title}
      onChange={handleInputChange}
      name="title"
      placeholder="Entrez un titre"
      className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>

  {/* Champ Description */}
  <label className="flex flex-col gap-2">
    <span className="text-base font-medium text-gray-700">Description</span>
    <textarea
      value={myTask.description}
      onChange={handleTextAreaChange}
      name="description"
      placeholder="Entrez une description"
      rows={3}
      className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>

  {/* Date */}
  <label className="flex flex-col gap-2">
    <span className="text-base font-medium text-gray-700">Date de fin</span>
    <input
      type="date"
      value={myTask.dueDate}
      onChange={handleInputChange}
      name="dueDate"
      className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>

  {/* Estimation */}
  <label className="flex flex-col gap-2">
    <span className="text-base font-medium text-gray-700">Estimation (h)</span>
    <input
      type="number"
      value={myTask.estimatedHours}
      onChange={handleInputChange}
      name="estimatedHours"
      className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>

  {/* Completed */}
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={myTask.completed}
      onChange={handleInputChange}
      name="completed"
      className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-base font-medium text-gray-700">Terminé</span>
  </label>

  {/* Status / Priorité / Progress */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-gray-700">Status</span>
      <select
        value={myTask.status}
        onChange={handleSelectChange}
        name="status"
        className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statusTable.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>

    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-gray-700">Priorité</span>
      <select
        value={myTask.priority}
        onChange={handleSelectChange}
        name="priority"
        className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {priorityTable.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    </label>

    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-gray-700">Progress</span>
      <input
        type="number"
        value={myTask.progress}
        onChange={handleInputChange}
        name="progress"
        min={0}
        max={100}
        className="p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  </div>

  {/* Rooms */}
  <label className="flex flex-col gap-2">
    <span className="text-base font-medium text-gray-700">Rooms</span>
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
      {room.map((r) => (
        <div
          key={r._id}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
        >
          <input
            type="checkbox"
            checked={myTask.roomId === r._id}
            onChange={() => r._id && handleRoomChange(r._id)}
            className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{r.room_name}</span>
        </div>
      ))}
    </div>
  </label>

  {/* Errors */}
  {errors && (
    <p className="bg-red-500 text-white text-sm p-3 rounded-lg shadow">
      {errors}
    </p>
  )}

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading || new Date(myTask.dueDate) <= new Date()}
    className={`w-full text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      loading || new Date(myTask.dueDate) <= new Date()
        ? "bg-blue-300 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {loading ? "Ajout en cours..." : "Ajouter la tâche"}
  </button>
</form>

    </>
  );
};

export default CreateTask;
