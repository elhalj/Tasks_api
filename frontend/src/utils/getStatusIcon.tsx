
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../types/task';

export const getStatusIcon = (status: Task["status"]) => {
  switch(status) {
    case 'done': 
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'in_progress': 
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'pending': 
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default: 
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};