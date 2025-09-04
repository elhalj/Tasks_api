import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context";
import { Link } from "react-router-dom";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";

const RoomUI = () => {
  const { room, getRoom, deleteRoom, loading } = useRoom();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getRoom();
  }, [getRoom]);

  if (loading) {
    return <Loader />;
  }

  if (user && room.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-3xl text-center text-slate-400">Vous n'avez pas de room</div>
      </div>
    );
  }

  const handleDeleteRoom = (id: string | undefined) => {
    if (id) {
      deleteRoom(id);
    }
  };

  const RoomRow = React.memo(() =>
    room.map((r, index) => {
      const currentUser = user[0];
      return (
        <div
          key={r._id}
          className="p-2 rounded-2xl shadow-xl bg-slate-200 hover:border-slate-600/50 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Room {index + 1}
            </h1>
            <div className="flex gap-2">
              <Link to={`/dashboard/room/${r._id}`}>
              <button
                type="button"
                className="px-4 py-1.5 bg-blue-300 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer"
              >
                Voir
              </button>
            </Link>
            <button
              type="button"
              className="px-4 py-1.5 bg-red-300 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer"
              onClick={() => handleDeleteRoom(r._id)}
            >
              Supprimer
            </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xl font-bold text-slate-600 mb-1">{r.room_name}</h3>
            {r.description && (
              <p className="text-slate-500 text-sm mb-3">{r.description}</p>
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
};

export default RoomUI;
