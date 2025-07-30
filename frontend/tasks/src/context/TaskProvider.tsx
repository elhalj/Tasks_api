import { useCallback, useContext, useEffect, useState } from "react";
import { TaskContext, type Task } from "./TaskContext";
import { AuthContext } from "./AuthContext";
import instance from "../services/api";
import toast from "react-hot-toast";
import socketServices from "../services/socketServices";

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({});

  // Get all tasks
  const getTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await instance.get("/get/tasks");
      setTasks(res.data.tasks);
      setError(null);
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
      // toast.success("Supprimé avec asuccès")
      setError(null);
    } catch (error) {
      const errorMessage = "Failed to delete task";
      setError(errorMessage);
      console.error(errorMessage, error);
      throw error;
    }
  }, []);

  //Fonction pour rejoindre une room de tasks
  const viewTaskDetails = useCallback((taskId: string) => {
    socketServices.joinTaskRoom(taskId)

    //Ecouter les mise à jours de cette task
    socketServices.onTaskRoomUpdated(data => {
      if (data.taskId === taskId) {
        console.log("Mise à jour de la tache en cours")
      }
    })
  }, []);

  const leaveTaskDetails = useCallback((taskId: string) => {
    socketServices.leaveTaskRoom(taskId)
  },[])

  useEffect(() => {
    //Connection Socket.ID
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user");

    if (token && userId) {
      socketServices.connect(token, userId);
    }

    //Ecouteur d'évenement
    socketServices.onTaskCreated((notification) => {
      console.log("nouvelle tache", notification);

      // Ne pas ajouter la tâche si l'auteur est l'utilisateur actuel, car elle est déjà ajoutée via la réponse de l'API
      if (notification.authorId !== userId) {
        setTasks(prev => [notification.task, ...prev])
      }

      //Afficher les notifications
      toast(notification.message, {
        icon: "🆕"
      })
    })

    socketServices.onTaskUpdated((notification) => {
      console.log("Tache mise à jour", notification);

      setTasks(prev => prev.map(task => task._id === notification.task._id ? notification.task : task));

      // Afficher la notification de mise à jour
      toast(notification.message, {
        icon: '📝',
      });
    })

    socketServices.onTaskDeleted((notification) => {
      console.log("Tache supprimé", notification);

      setTasks(prev => prev.filter(task => task._id !== notification.taskId))

      toast(notification.message, {
        icon: "🗑️"
      })
    })

    socketServices.onPersonalTaskCreated((notification) => {
      toast.success(notification.message)
    })

    socketServices.onStatUpdate((notification) => {
      if (notification.userId === userId) {
        setStats(notification.stats)
      }
    })

    socketServices.onTaskViewed((notification) => {
      toast(notification.message, {
        icon: '👀',
      });
    });

    socketServices.onUserStatusChanged((data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (data.status === "online") {
          newSet.add(data.userId)
        } else {
          newSet.delete(data.userId)
        }
        return newSet
      })
    })

    //Netoyage
    return () => {
      socketServices.removeAllListeners();
    }
  }, [user?._id]); // Use optional chaining in case user is null



  // Context value
  const contextValue = {
    tasks,
    loading,
    error,
    onlineUsers,
    stats,
    addTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    viewTaskDetails,
    leaveTaskDetails
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
