import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoom } from "../hook/useRoom";
import type { Room } from "../types/room";
import Loader from "../components/Loader";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus,
  Settings,
  MoreVertical,
  Star,
  Activity
} from "lucide-react";
import AddMember from "../ui/room/AddMember";
import { AuthContext } from "../context";

const RoomId = () => {
  const { id } = useParams<{ id: string }>();
  const { room, getRoom } = useRoom();
  const {currentUser} = useContext(AuthContext)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effet pour charger les rooms une seule fois
  useEffect(() => {
    const loadRooms = async () => {
      if (room.length === 0) { // Ne charge que si pas encore chargé
        try {
          await getRoom();
        } catch (err) {
          setError("Failed to fetch room data");
          console.error(err);
          setIsLoading(false);
        }
      }
    };
    
    loadRooms();
  }, []); // Pas de dépendances pour éviter les re-appels

  // Effet séparé pour trouver la room courante quand les données changent
  useEffect(() => {
    if (id && room.length > 0) {
      const foundRoom = room.find((r: Room) => r._id === id);
      if (foundRoom) {
        setCurrentRoom(foundRoom);
        setError(null);
      } else {
        setError("Room not found");
      }
      setIsLoading(false);
    }
  }, [id, room]); // Se déclenche quand id ou room change

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50';
      case 'in-progress':
        return 'bg-blue-900/30 text-blue-400 border-blue-800/50';
      default:
        return 'bg-slate-800/50 text-slate-300 border-slate-700/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 border border-red-800/50 flex items-center justify-center">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Room not found</h2>
          <p className="text-slate-400 mb-4">{error || "The requested room could not be found."}</p>
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 text-slate-300 hover:text-slate-100 border border-slate-700/50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                {currentRoom.room_name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/50">
                <Settings className="w-5 h-5 text-slate-400 hover:text-slate-200" />{ }
              </button>
              <button className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/50">
                <MoreVertical className="w-5 h-5 text-slate-400 hover:text-slate-200" />{ }
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Room Info Card */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-100">{currentRoom.room_name}</h2>
                    <p className="text-sm text-slate-400 mt-1">{currentRoom.description}</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    Team Members
                  </h3>
                  <span className="text-sm text-slate-400">{currentRoom.members?.length || 0}</span>
                </div>
                <div className="space-y-3">
                  {currentRoom.members?.map((member) => (
                    <div key={member._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/30 transition-colors duration-200">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {member.userName?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 text-sm">{member.userName || member.email}</p>
                        <p className="text-xs text-slate-500">
                          {currentUser && member._id === currentUser._id ? "Admin" : "Team Member"}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-slate-500">No members yet</p>
                  )}
                </div>
                <div className="mt-4">
                  {/* Add member */}
                  <AddMember roomId={currentRoom._id!} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
                <h3 className="font-semibold text-slate-100 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Tasks</span>
                    <span className="font-semibold text-slate-100">{currentRoom.tasks?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completed</span>
                    <span className="font-semibold text-emerald-400">
                      {currentRoom.tasks?.filter(t => t.status === 'completed').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">In Progress</span>
                    <span className="font-semibold text-blue-400">
                      {currentRoom.tasks?.filter(t => t.status === 'in-progress').length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-blue-400" />
                Tasks
              </h2>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            {currentRoom.tasks && currentRoom.tasks.length > 0 ? (
              <div className="space-y-4">
                {currentRoom.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 cursor-pointer shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority || 'low')}`}></div>
                          <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors duration-200">
                            {task.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status || 'todo')} flex items-center gap-1`}>
                            {getStatusIcon(task.status || 'todo')}
                            {(task.status || 'todo').replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {task.assignees && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                              {task.assignees.name?.charAt(0).toUpperCase() || task.assignees.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm text-slate-400">{task.assignees.name || task.assignees.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <button className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200">
                          <Star className="w-4 h-4 text-slate-500 hover:text-yellow-400" />{ }
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-700/50 shadow-xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">No tasks yet</h3>
                <p className="text-slate-400 mb-6">Get started by creating your first task for this room.</p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg">
                  <Plus className="w-5 h-5" />
                  Create First Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomId;