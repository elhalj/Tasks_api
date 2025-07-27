import { useCallback, useState } from "react";
import { TaskContext, type Task } from "./TaskContext";
import instance from "../services/api";
import toast from "react-hot-toast";

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all tasks
  const getTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await instance.get("/get/tasks");
      setTasks(res.data);
      setError(null);
      return res.data
    } catch (error) {
      setError("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new task
  const addTask = useCallback(async (title: string, description: string, completed: boolean = false) => {
    try {
      const res = await instance.post("/add/tasks", { title, description, completed });
      setTasks(prevTasks => [...prevTasks, res.data]);
      setError(null);
      return res.data;
    } catch (error) {
      const errorMessage = "Failed to add task";
      setError(errorMessage);
      console.error(errorMessage, error);
      throw error;
    }
  }, []);

  // Update an existing task
  const updateTask = useCallback(async (id: string, task: Task) => {
    try {
      const res = await instance.put(`/update/tasks/${id}`, task);
      setTasks(prevTasks => 
        prevTasks.map(t => (t._id === id ? res.data : t))
      );
      setError(null);
      return res.data;
    } catch (error) {
      const errorMessage = "Failed to update task";
      setError(errorMessage);
      console.error(errorMessage, error);
      throw error;
    }
  }, []);

  // Get a single task by ID
  const getTaskById = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const res = await instance.get(`/get/tasks/${id}`);
      return res.data;
    } catch (error) {
      const errorMessage = `Failed to fetch task with id ${id}`;
      setError(errorMessage);
      console.error(errorMessage, error);
      return null;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      await instance.delete(`/delete/task/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      toast.success("Supprimé avec asuccès")
      setError(null);
    } catch (error) {
      const errorMessage = "Failed to delete task";
      setError(errorMessage);
      console.error(errorMessage, error);
      throw error;
    }
  }, []);



  // Context value
  const contextValue = {
    tasks,
    addTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
  };

  // Render loading state if needed
  // if (loading) {
  //   return <div>Loading tasks...</div>;
  // }

  // Render error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};
