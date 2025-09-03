import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const AddMember = ({ roomId }: { roomId: string }) => {
  const { user, getAllUser, loading: authLoading } = useContext(AuthContext);
  const { addMember } = useRoom();
  const [errors, setErrors] = useState("");
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      // Chargement des utilisateurs seulement si le tableau est vide
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
      setErrors("Erreur lors de l'ajout du membre");
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
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-2xl">
      <h3 className="text-xl font-bold mb-5 text-slate-100 tracking-wide flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-400"
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
        Add Member
      </h3>

      {errors && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm shadow-inner">
          {errors}
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {user && user.length > 0 ? (
          user.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:from-slate-800/60 hover:to-slate-900/60 transition-all duration-200 border border-slate-700/30 group"
            >
              {/* Avatar + Infos */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-105 transition-transform duration-200">
                  {u.userName?.charAt(0).toUpperCase() ||
                    u.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <p className="font-medium text-slate-100 text-sm">
                    {u.userName}
                  </p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
              </div>

              {/* Bouton Add */}
              <button
                type="button"
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={addingMemberId === u._id}
                onClick={() => u._id && handleAddMember(u._id)}
              >
                {addingMemberId === u._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
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
                    Add
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
