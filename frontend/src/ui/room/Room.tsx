import React, { useContext, useEffect} from "react";
import { AuthContext } from "../../context";
import { Link } from "react-router-dom";
import { useRoom } from "../../hook/useRoom";
import Loader from "../../components/Loader";

const RoomUI = () => {
  const { room, getRoom, loading} = useRoom();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getRoom();
  }, [getRoom]);

  if (loading) {
    return <Loader/>
  }

  if (user && room.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-3xl text-center">Vous n'avez pas de room</div>
      </div>
    );
  }

  const RoomRow = React.memo(() =>
    room.map((r) => {
      // Get the first user in the array or undefined if empty
      const currentUser = user[0];
      return (
        <div
          key={r._id}
          className="text-white p-4 border-2 border-gray-300 rounded-md bg-gradient-to-br from-white/20 to-indigo-300/50 opacity-80 backdrop-blur-lg"
        >
          <h1 className="uppercase text-slate-300 bg-gray-50/10  p-2 rounded-lg">Room: {room.findIndex((room) => room._id === r._id) + 1}</h1>
          <h3 className="text-2xl">Titre: {r.room_name}</h3>
          {/* <p>{r.description}</p> */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-lg font-bold">Membres :</span>
              <span className="ml-2">
                {
                  (r.members || []).filter(
                    (member) => member._id !== currentUser?._id
                  ).length
                }
              </span>
              <Link to={`/dashboard/room/${r._id}`}>
                <button
                  type="button"
                  className="ml-4 px-4 py-1 bg-blue-500/50 hover:bg-blue-700/50 text-white font-bold rounded-md"
                >
                  Voir
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    })
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <RoomRow />
    </div>
  );
};

export default RoomUI;
