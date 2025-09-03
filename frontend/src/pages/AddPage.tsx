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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Gestion des tâches
      </h1>
      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
      >
        Retour
      </Link>
    </div>

    {/* Sélection de salle */}
    {rooms.length > 1 ? (
      <div className="mb-6">
        <label
          htmlFor="room-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Sélectionner une salle
        </label>
        <select
          id="room-select"
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Sélectionnez une salle</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.room_name}
            </option>
          ))}
        </select>

        {selectedRoomId && (
          <div className="mt-6">
            <CreateTask roomId={selectedRoomId} />
          </div>
        )}
      </div>
    ) : (
      <CreateTask roomId={rooms[0]?._id || ''} />
    )}
  </div>
</div>

  );
};

export default AddTask;
