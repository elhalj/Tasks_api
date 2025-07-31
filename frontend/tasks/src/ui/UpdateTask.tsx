import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskContext } from "../context";
import toast from "react-hot-toast";

// Types pour la tâche
interface TaskProps {
  _id?: string;
  title: string;
  description: string;
  completed?: boolean;
  status?: string;
  priority?: string;
}

// Composant pour mettre à jour une tâche
const UpdateTask = () => {
  const { tasks, updateTask } = useContext(TaskContext); // On récupère les tâches et la fonction pour les mettre à jour
  const { id } = useParams<{ id: string }>(); // On récupère l'ID de la tâche à mettre à jour
  const myTask = tasks.find((t) => t._id === id); // On cherche la tâche correspondante dans la liste des tâches

  // On définit l'état de la tâche à mettre à jour
  const [task, setTask] = useState<TaskProps>({
    title: myTask?.title || "",
    description: myTask?.description || "",
    completed: myTask?.completed || false,
    status: myTask?.status || "pending",
    priority: myTask?.priority || "low"
  });

  // On met à jour l'état de la tâche si elle change dans la liste des tâches
  useEffect(() => {
    if (myTask) {
      setTask(myTask);
    }
  }, [myTask]);

  // Fonction pour gérer les changements de valeur des champs
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "select-one"
        ? (e.target as HTMLSelectElement).value
        : value;

    setTask((prevTask) => ({
      ...prevTask,
      [name]: newValue,
    }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      console.error("ID de la tâche non défini");
      return;
    }
    try {
      await updateTask(id, task);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <p>
        <Link
          to="/dashboard"
          className="text-blue-500 hover:underline bg-blue-200 p-1 rounded-md"
        >
          Retourner au dashboard
        </Link>
      </p>
      {/* Formulaire pour mettre à jour la tâche */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded-md flex flex-col gap-4"
      >
        {/* Champ pour le titre */}
        <label className="flex flex-col">
          Titre:
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          />
        </label>
        {/* Champ pour la description */}
        <label className="flex flex-col">
          Description:
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          />
        </label>
        {/* Champ pour l'état de la tâche */}
        <label className="flex items-center">
          Complétée:
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
            className="ml-2"
          />
        </label>
        {/* Select pour le statut */}
        <label className="flex flex-col">
          Statut:
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
            <option value="canceled">canceled</option>
          </select>
        </label>
        {/* Select pour la priorité */}
        <label className="flex flex-col">
          Priorité:
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="critical">critical</option>
          </select>
        </label>
        {/* Bouton pour soumettre le formulaire */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Mettre à jour
        </button>
      </form>
    </>
  );
};

export default UpdateTask;
