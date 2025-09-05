import { useContext } from "react";
import { TaskContext } from "../context";
import type { Task } from "../types";

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw Error("useTask must be user in TaskProvider");
  }

  return context as {
      tasks: Task[];
      loading: boolean;
    addTask: (
      title: string,
      description: string,
      dueDate: string,
      estimatedHours: number,
      // assignees: string[],
      roomId?: string,
      completed?: boolean,
      status?: string,
      priority?: string,
      progress?: number
    ) => Promise<void>;
    getTasks: () => Promise<void>;
    getTaskById: (id: string) => Promise<Task | null>;
    updateTask: (id: string, task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    viewTaskDetails: (taskId: string) => void;
    leaveTaskDetails: (taskId: string) => void;
  };
};
