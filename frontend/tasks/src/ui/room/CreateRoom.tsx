import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context";
import { useRoom } from "../../hook/useRoom";
import type { User } from "../../types/user";
import Loader from "../../components/Loader";

interface RoomFormData {
  room_name: string;
  description: string;
  members: User[];
}

const CreateRoom = () => {
  const { user, getAllUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    room_name: "",
    description: "",
    members: [],
  });
  const [errors, setErrors] = useState("");
  const { createRoom } = useRoom();
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        await getAllUser();
        if (Array.isArray(user)) {
          setAvailableUsers(user);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrors("Failed to load users");
      } finally {
        setLoading(false)
      }
    };
    fetchUsers();
    
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleUserSelection = useCallback((selectedUser: User) => {
    setFormData(prev => {
      const isAlreadySelected = prev.members.some(member => member._id === selectedUser._id);
      
      return {
        ...prev,
        members: isAlreadySelected
          ? prev.members.filter(member => member._id !== selectedUser._id)
          : [...prev.members, selectedUser]
      };
    });
  },[])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    try {
      if (!formData.room_name.trim()) {
        throw new Error("Room name is required");
      }

      await createRoom(
        formData.room_name,
        formData.description,
        formData.members
      );
      
      // Reset form on success
      setFormData({ room_name: "", description: "", members: [] });
    } catch (error: any) {
      setErrors(error.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  },[formData, createRoom]);

  if (loading) {
    return <Loader/>
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Link to="/dashboard">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          Retour au dashboard
        </button>
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Créer une salle</h1>
      
      {errors && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nom de la salle *
          </label>
          <input
            type="text"
            name="room_name"
            value={formData.room_name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Entrez le nom de la salle"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Décrivez le but de cette salle"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Membres *
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2">
            {loading && (<Loader/>)}
            {availableUsers.length > 0 ? (
              availableUsers.map((user) => (
                <div 
                  key={user._id} 
                  className={`p-2 mb-2 rounded cursor-pointer ${formData.members.some(m => m._id === user._id) 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'hover:bg-gray-100'}`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="font-medium">{user.userName}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 p-2">Aucun utilisateur disponible</div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading || !formData.room_name.trim()}
            className={`px-6 py-2 rounded-md text-white font-medium ${loading || !formData.room_name.trim() 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Création en cours...' : 'Créer la salle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
