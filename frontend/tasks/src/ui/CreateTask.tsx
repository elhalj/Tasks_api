import { useContext, useState } from "react";
import { TaskContext } from "../context";
import toast from "react-hot-toast";

interface TaskProps {
  title: string;
  description: string;
  completed: boolean;
}
const CreateTask = () => {
  const { addTask } = useContext(TaskContext);
  const [myTask, setMyTask] = useState<TaskProps>({
    title: "",
    description: "",
    completed: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setMyTask((prev) => ({ ...prev, [name]: checked }));
    } else {
      setMyTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMyTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTask(myTask.title, myTask.description, myTask.completed);
      toast.success("Ajouté avec succès");
      setMyTask({ title: "", description: "", completed: false });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Titre
          <input
            type="text"
            value={myTask.title}
            onChange={handleInputChange}
            name="title"
            className="border border-gray-300 rounded p-2"
          />
        </label>
        <label className="flex flex-col">
          Description
          <textarea
            value={myTask.description}
            onChange={handleTextAreaChange}
            name="description"
            className="border border-gray-300 rounded p-2"
          />
        </label>
        <label className="flex gap-1 items-center">
          Completed
          <input
            type="checkbox"
            checked={myTask.completed}
            onChange={handleInputChange}
            name="completed"
            className="mr-2 h-6 w-6"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>
    </>
  );
};

export default CreateTask;
