import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";

const AddMember = ({ roomId }: { roomId: string }) => {
  const { user, getAllUser, loading: authLoading } = useContext(AuthContext);
  const { addMember} = useRoom();
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
      setErrors("")
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
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">Add Member</h3>
      
      {errors && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-xl text-red-400 text-sm">
          {errors}
        </div>
      )}

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {user && user.length > 0 ? (
          user.map((u) => (
            <div 
              key={u._id} 
              className="flex justify-between items-center p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors duration-200 border border-slate-700/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {u.userName?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-slate-100 text-sm">{u.userName}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
              </div>
              
              <button
                type="button"
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={addingMemberId === u._id}
                onClick={() => u._id && handleAddMember(u._id)}
              >
                {addingMemberId === u._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">Aucun utilisateur disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;