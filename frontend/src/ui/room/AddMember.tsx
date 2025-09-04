import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

type ApiError = Error & {
  response?: {
    data?: {
      error?: string;
      message?: string
    }
  }
}
const AddMember = ({ roomId }: { roomId: string }) => {
  const { user, getAllUser, loading: authLoading } = useContext(AuthContext);
  const { addMember } = useRoom();
  const [errors, setErrors] = useState("");
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      if (user.length === 0 && !authLoading) {
        try {
          await getAllUser();
        } catch (error) {
          setErrors("Erreur lors du chargement des utilisateurs");
          console.error("Error fetching users:", error);
        }
      }
    };
    loadUsers();
  }, [user.length, getAllUser, authLoading]);

  const handleAddMember = async (userId: string) => {
    if (!userId) return;
    try {
      setAddingMemberId(userId);
      await addMember(roomId, userId);
      toast.success("Ajouté avec succès");
      setErrors("");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =  apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message || "Failed to create";
      setErrors(`Error: ${errorMessage}`);
      setTimeout(() => {setErrors("")},3000)
      
      console.error("Error adding member:", error);
    } finally {
      setAddingMemberId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-200 backdrop-blur-md rounded-2xl p-2">
      <h3 className="text-lg font-semibold mb-5 text-black flex items-center gap-2">
        <svg
          className="w-5 h-5 text-purple-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Ajouter un membre
      </h3>

      {errors && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-800/60 rounded-lg text-white text-sm shadow-inner">
          {errors}
        </div>
      )}

      <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {user && user.length > 0 ? (
          user.map((u) => (
            <div
              key={u._id}
              className="flex flex-col bg-slate-300 gap-2 p-1 rounded-xl  hover:bg-slate-800 transition-all duration-200 "
            >
              {/* Avatar + Infos */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {u.userName?.charAt(0).toUpperCase() ||
                    u.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <p className="font-medium text-slate-700 text-sm">{u.userName}</p>
                  <p className="text-xs text-slate-600">{u.email}</p>
                </div>
              </div>

              {/* Bouton Add */}
              <button
                type="button"
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={addingMemberId === u._id}
                onClick={() => u._id && handleAddMember(u._id)}
              >
                {addingMemberId === u._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ajout...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Ajouter
                  </>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-slate-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">
              Aucun utilisateur disponible
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;
