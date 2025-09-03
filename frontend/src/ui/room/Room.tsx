import React, { useContext, useEffect} from "react";
import { AuthContext } from "../../context";
import { Link } from "react-router-dom";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";

const RoomUI = () => {
  const { room, getRoom, loading } = useRoom();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getRoom();
  }, [getRoom]);

  if (loading) {
    return <Loader />
  }

  if (user && room.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-3xl text-center">Vous n'avez pas de room</div>
      </div>
    );
  }

  const RoomRow = React.memo(() =>
    room.map((r, index) => {
      const currentUser = user[0];

      return (
        <div
          key={r._id}
          className="p-5 rounded-2xl shadow-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Room {index + 1}
            </h1>
            <Link to={`/dashboard/room/${r._id}`}>
              <button
                type="button"
                className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Voir
              </button>
            </Link>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{r.room_name}</h3>
            {r.description && (
              <p className="text-slate-300 text-sm mb-3">{r.description}</p>
            )}

            <div className="flex items-center text-sm text-slate-400">
              <span className="font-semibold">Membres :</span>
              <span className="ml-2">
                {(r.members || []).filter(
                  (member) => member._id !== currentUser?._id
                ).length}
              </span>
            </div>
          </div>
        </div>
      );
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <RoomRow />
    </div>
  );
}
export default RoomUI;
