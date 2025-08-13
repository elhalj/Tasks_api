import { useContext, useEffect } from "react"
import { AuthContext, RoomContext } from "../../context"
import { Link } from "react-router-dom";
import { useRoom } from "../../hook/useRoom";


const RoomUI = () => {
    const { room, getRoom } = useRoom();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getRoom();
    }, [getRoom]);

    if (user && room.length === 0) {
        return (
          <div className="flex items-center justify-center w-full h-screen">
            <div className="text-3xl text-center">
              Vous n'avez pas de room
            </div>
          </div>
        )
    }
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {room.map(r => (
        <div key={r._id} className="p-4 border-2 border-gray-300 rounded-md">
          <h3 className="text-2xl">{r.room_name}</h3>
          <p>{r.description}</p>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-lg font-bold">Membres :</span>
              <span className="ml-2">{(r.members || []).filter(member => member._id !== user?._id).length}</span>
                      <Link to={`/dashboard/room/${r._id}`}><button className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md">Voir</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomUI
