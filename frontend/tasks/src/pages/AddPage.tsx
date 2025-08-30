import { useState } from 'react';
import { useRoom } from "../hook/useRoom";
import CreateTask from "../ui/CreateTask";
import { Link } from "react-router-dom";

const AddTask = () => {
  const { room: rooms } = useRoom();
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  
  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Aucune salle sélectionnée</p>
          <Link
            to="/rooms" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Créer une salle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg p-8 shadow-md w-auto">
        <Link
          to="/dashboard"
          className="text-start mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Retour au dashboard
        </Link>
        {rooms.length > 1 ? (
          <div className="mb-4">
            <label htmlFor="room-select" className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner une salle
            </label>
            <select
              id="room-select"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              required
            >
              <option value="">Sélectionnez une salle</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.room_name}
                </option>
              ))}
            </select>
            {selectedRoomId && <CreateTask roomId={selectedRoomId} />}
          </div>
        ) : (
          <CreateTask roomId={rooms[0]?._id || ''} />
        )}
      </div>
    </div>
  );
};

export default AddTask;
