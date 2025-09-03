import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context";
import { useRoom } from "../../hook/useRoom";
import type { User } from "../../types/user";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

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
        setLoading(true);
        await getAllUser();
        if (Array.isArray(user)) {
          setAvailableUsers(user);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrors("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // const intervalId = setInterval(fetchUsers, 9000);

    // return () => clearInterval(intervalId);
  }, []);

  //   useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const users = await getAllUser();
  //       if (Array.isArray(users)) {
  //         setAvailableUsers(users);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       setErrors("Failed to load users");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers(); // première exécution immédiate
  //   const intervalId = setInterval(fetchUsers, 9000);

  //   return () => clearInterval(intervalId);
  // }, [getAllUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleUserSelection = useCallback((selectedUser: User) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.members.some(
        (member) => member._id === selectedUser._id
      );

      return {
        ...prev,
        members: isAlreadySelected
          ? prev.members.filter((member) => member._id !== selectedUser._id)
          : [...prev.members, selectedUser],
      };
    });
  }, []);

  const validateForm = (room_name: string, description: string) => {
    if (
      !room_name ||
      typeof room_name !== "string" ||
      room_name.trim().length === 0
    ) {
      setErrors("Nom de room requis");
      return false;
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      setErrors("Description requis");
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (!validateForm(formData.room_name, formData.description)) {
          setLoading(false);
          return;
        }
        await createRoom(
          formData.room_name,
          formData.description,
          formData.members
        );

        toast.success("Créé avec succès");
        // Reset form on success
        setFormData({ room_name: "", description: "", members: [] });
        setErrors("");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrors(error.message);
        } else {
          setErrors("Failed to create room");
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, createRoom]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Créer une salle
        </h1>
        <Link to="/dashboard">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
          >
            Retour
          </button>
        </Link>
      </div>

      {/* Message d'erreur */}
      {errors && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {errors}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la salle */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nom de la salle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="room_name"
            value={formData.room_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Entrez le nom de la salle"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Décrivez le but de cette salle"
          />
        </div>

        {/* Membres */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">
            Membres <span className="text-red-500">*</span>
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-2 shadow-inner">
            {loading && <Loader />}
            {availableUsers.length > 0 ? (
              availableUsers.map((user) => {
                const isSelected = formData.members.some(
                  (m) => m._id === user._id
                );
                return (
                  <div
                    key={user._id}
                    className={`p-3 rounded-lg cursor-pointer flex flex-col transition-colors duration-200 ${
                      isSelected
                        ? "bg-blue-100 border border-blue-300"
                        : "hover:bg-gray-100 border border-transparent"
                    }`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <span className="font-semibold text-gray-800">
                      {user.userName}
                    </span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 p-2 text-sm">
                Aucun utilisateur disponible
              </div>
            )}
          </div>
        </div>

        {/* Bouton de validation */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              loading ||
              !formData.room_name.trim() ||
              !formData.description.trim()
            }
            className={`px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-colors duration-200 ${
              loading ||
              !formData.room_name.trim() ||
              !formData.description.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Création en cours..." : "Créer la salle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
