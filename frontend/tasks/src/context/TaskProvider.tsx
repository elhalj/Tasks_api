import { useCallback, useContext, useEffect, useState } from "react";
import { TaskContext, type Task } from "./TaskContext";
import { AuthContext } from "./AuthContext";
import instance from "../services/api";
import toast, { CheckmarkIcon } from "react-hot-toast";
import socketServices, { 
  type SocketTaskEvents,
  type SocketStatEvents,
  type SocketUserStatusEvents
} from "../services/socketServices";

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
  const addTask = useCallback(async (title: string, description: string, completed: boolean = false, status: string = "pending", priority: string = "low", progress: number = 0) => {
    try {
      const res = await instance.post("/add/tasks", { title, description, completed, status, priority, progress });
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
      toast.success("Tâche mise à jour avec succès");
      return res.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Échec de la mise à jour de la tâche";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Update task error:", error);
      throw error;
    }
  }, []);

  // Get a single task by ID
  const getTaskById = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const res = await instance.get(`/get/task/${id}`);
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
      setError(null);
      toast.success("Tâche supprimée avec succès");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Échec de la suppression de la tâche";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Delete task error:", error);
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
    const saveUser = localStorage.getItem("user");

    if (token && saveUser && user) {
      try {
        const userData = JSON.parse(saveUser);
        socketServices.connect(token , userData._id || user._id)
      } catch (error) {
        console.error("Erreur pour parser les données user", error);
        return;
      }
    }

    // Gestionnaire pour la création d'une tâche
    const handleCreateTask: SocketTaskEvents['taskCreated'] = (data) => {
      try {
        console.log("Nouvelle tâche reçue", data);

        // Ne pas ajouter la tâche si l'auteur est l'utilisateur actuel
        // car elle est déjà ajoutée via la réponse de l'API
        const currentUserId = user?._id;
        if (data.authorId !== currentUserId) {
          setTasks(prev => [data.task, ...prev]);
        }

        // Afficher la notification
        if (data.message) {
          toast(data.message, {
            icon: <CheckmarkIcon />,
          });
        }
      } catch (error) {
        console.error("Erreur pour ajouter une tâche", error);
      }
    }
    // Gestionnaire pour la mise à jour d'une tâche
    const handleUpdateTask: SocketTaskEvents['taskUpdated'] = (data) => {
      try {
        console.log("Tâche mise à jour", data);

        if (!data || !data.task) {
          console.error("Données de tâche manquantes dans la notification", data);
          return;
        }

        setTasks(prev => prev.map(task => task._id === data.task._id ? data.task : task));

        // Afficher la notification de mise à jour
        if (data.message) {
          toast(data.message, {
            icon: data.change?.status ? '🔄' : data.change?.priority ? '⚠️' : '📝',
          });
        }
      } catch (error) {
        console.error("Erreur pour mettre à jour une tâche", error);
      }
    }
    // Gestionnaire pour la suppression d'une tâche
    const handleDeleteTask: SocketTaskEvents['taskDeleted'] = (data) => {
      try {
        console.log("Tâche supprimée", data);

        setTasks(prev => prev.filter(task => task._id !== data.taskId));

        if (data.message) {
          toast(data.message, {
            icon: "🗑️"
          });
        }
      } catch (error) {
        console.error("Erreur pour supprimer une tâche", error);
      }
    }

    // Gestionnaire pour la création d'une tâche personnelle
    const handlePersonalCreateTask: SocketTaskEvents['personalTaskCreated'] = (data) => {
      try {
        console.log("Tâche personnelle reçue", data);
        
        if (data.message) {
          toast.success(data.message);
        }
        
        if (data.task) {
          setTasks(prev => [data.task, ...prev]);
        }
      } catch (error) {
        console.error("Erreur pour ajouter une tâche personnelle", error);
      }
    }
    const handleStatUpdate: SocketStatEvents['statUpdated'] = (data) => {
      try {
        if (data.userId === saveUser) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Erreur pour mettre à jour les stats", error);
      }
    }

    const handleTaskView: SocketTaskEvents['taskViewed'] = (notification) => {
      try {
        toast(notification.message, {
        icon: '👀',
        });
      } catch (error) {
        console.error("Erreur pour afficher une notification de vue de tâche", error);
      }
    }

    const handleUserStatusChange: SocketUserStatusEvents["userStatusChanged"] = (data) => {
      try {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (data.status === "online") {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      } catch (error) {
        console.error("Erreur pour mettre à jour les utilisateurs en ligne", error);
      }
    }
    socketServices.onTaskCreated(handleCreateTask)
    socketServices.onTaskUpdated(handleUpdateTask)
    socketServices.onTaskDeleted(handleDeleteTask)
    socketServices.onPersonalTaskCreated(handlePersonalCreateTask)
    socketServices.onStatUpdate(handleStatUpdate)
    socketServices.onTaskViewed(handleTaskView);
    socketServices.onUserStatusChanged(handleUserStatusChange)

    //Netoyage
    return () => {
      socketServices.removeAllListeners();
    }
  }, [user]); // Use optional chaining in case user is null



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
