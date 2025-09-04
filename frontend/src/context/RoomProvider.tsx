import {  useState, useEffect, useCallback } from "react";
// import { AuthContext } from "./AuthContext";
import type { Room } from "../types/room";
import instance from "../services/api";
import type { User } from "../types/user";
import { RoomContext } from "./RoomContext";
import toast from "react-hot-toast";


interface RoomProviderProps {
  children: React.ReactNode;
}

type ApiError = Error & {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};

export const RoomProvider = ({ children }: RoomProviderProps) => {
//   const { user } = useContext(AuthContext);
  const [room, setRoom] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string | null>(null);

  const getRoom = useCallback(async () => {
    try {
      setLoading(true);
      setErrors(null);

      const res = await instance.get("/room/get/rooms");

      const { adminRooms = [], memberRooms = [] } = res.data;
      setRoom([...adminRooms, ...memberRooms]);
    } catch (error: any) {
      // Error handling
      setErrors(error)
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      await getRoom();
    };

    fetchRooms();
  }, [getRoom]);

  const createRoom = async (
    room_name: string,
    description: string,
    members: User[]
  ) => {
    try {
      setLoading(true);
      const res = await instance.post("/room/add/rooms", {
        room_name,
        description,
        members,
      });

      if (res.data.room) {
        setRoom((prev) => [...prev, res.data.room]);
        setErrors(null);
        return res.data.room;
      }

      throw new Error("Failed to create room: Invalid response from server");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to create room";
      setErrors(`Error: ${errorMessage}`);
      console.error("Error creating room:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (roomId: string, memberId: string) => {
    try {
      setLoading(true);
      const response = await instance.post(`/room/add/${roomId}/${memberId}`);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to add member");
      }

      if (response.data.room) {
        setRoom((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId ? response.data.room : room
          )
        );
        setErrors(null);
        return response.data;
      }

      throw new Error("No room data returned from server");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Erreur lors de l'ajout du membre";
      setErrors(`Error: ${errorMessage}`);
      console.error("Error adding member:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteMemberToRoom = async (roomId: string, memberId: string) => {
    try {
      setLoading(true);
      const res = await instance.delete(
        `/room/delete/${roomId}/members/${memberId}`
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to remove member");
      }

      // Update the room by removing the member from the members array
      setRoom((prevRooms) =>
        prevRooms.map((room) => {
          if (room._id === roomId) {
            return {
              ...room,
              members: (room.members || []).filter(member => member._id !== memberId)
            };
          }
          return room;
        })
      );

      setErrors(null);
      return res.data.message;
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to remove member";
      setErrors(`Error: ${errorMessage}`);
      console.error("Error removing member:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRoomInformation = async (
    roomId: string,
    roomUpdates: Partial<Room>
  ) => {
    try {
      setLoading(true);
      const res = await instance.put(
        `/room/update/room/${roomId}`,
        roomUpdates
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to update room");
      }

      if (res.data.room) {
        setRoom((prev) =>
          prev.map((r) => (r._id === roomId ? res.data.room : r))
        );
        setErrors(null);
        return res.data.room;
      }

      throw new Error("Failed to update room: Invalid response from server");
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to update room";
      setErrors(`Error: ${errorMessage}`);
      console.error("Error updating room:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      setLoading(true);
      const res = await instance.delete(`/room/delete/rooms/${roomId}`);

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to delete room");
      }

      setRoom((prev) => prev.filter((r) => r._id !== roomId));
      setErrors(null);
      toast.success("Supprimé")
      return res.data.message;
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to delete room";
      setErrors(`Error: ${errorMessage}`);
      toast.error(errorMessage)
      console.error("Error deleting room:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

 // Render error message if there's an error
  // if (errors) {
  //   return (
  //     <div className="h-screen flex flex-col justify-center items-center">
  //       <div className="bg-red-400 p-4 rounded-lg flex flex-col justify-center items-center">
  //         <p className="text-8xl text-white uppercase">404</p>
  //       <p className="text-4xl text-white">Error: {errors}</p>{" "}
  //       <div className="bg-blue-300 p-2 rounded-lg">
  //         <button type="button" className="text-white" onClick={() => window.location.reload()}>Reessayer</button>
  //       </div>
  //       </div>
  //     </div>
  //   );
  // }
 

  const contextValue = {
    room,
    loading,
    errors,
    getRoom,
    createRoom,
    addMember,
    deleteMemberToRoom,
    updateRoomInformation,
    deleteRoom,
  };

 
  return (
    <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
  );
};
