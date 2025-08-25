import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRoom } from "../hook/useRoom";
import type { Room } from "../types/room";
import Loader from "../components/Loader";
import { BookmarkXIcon } from "lucide-react";
import AddMember from "../ui/room/AddMember";

const RoomId = () => {
  const { id } = useParams<{ id: string }>();
  const { room, getRoom } = useRoom();
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

  if (isLoading) {
    return <Loader/>;
  }

  if (error || !currentRoom) {
    return (
      <div className="flex h-screen justify-center items-center">
        {error || "Room not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row">
        <div className="border-r border-r-white w-80 mr-2 p-2 h-svh">
          <div className="bg-blue-300 rounded-2xl p-1 flex gap-1">
            <BookmarkXIcon/> 
            <Link to='/dashboard'>Dashboard</Link>
          </div>
          <h1 className="text-2xl font-bold mb-2">{currentRoom.room_name}</h1>
          <p className="text-gray-600 mb-4">{currentRoom.description}</p>
          <AddMember roomId={currentRoom._id!} />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          {currentRoom.tasks && currentRoom.tasks.length > 0 ? (
            <div className="space-y-4">
              {currentRoom.tasks.map((task) => (
                <div key={task._id} className="p-4 border rounded-lg shadow">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks in this room yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomId;