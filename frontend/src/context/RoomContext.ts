import { createContext } from "react";
import { type Room } from "../types/room"
import type { User } from "../types/user";

interface RoomContextType {
    room: Room[];
    getRoom: () => Promise<void>;
    createRoom: (room_name: string, description: string, members: User[]) => Promise<void>;
    addMember: (roomId: string, memberId: string) => Promise<void>;
    deleteMemberToRoom: (roomId: string, memberId: string) => Promise<void>;
    updateRoomInformation: (roomId: string, room: Room) => Promise<void>;
    deleteRoom: (roomId: string) => Promise<void>
    // transfertRoomToMember: (roomId: string, ownerShipId: string) => Promise<void>;
    // toggleRoomStatus: (roomId: string, status: boolean) => Promise<void>;
}

export const RoomContext = createContext<RoomContextType>({
    room: [],
    getRoom: async () => { },
    createRoom: async () => { },
    addMember: async () => { },
    deleteMemberToRoom: async () => { },
    updateRoomInformation: async () => { },
    deleteRoom: async () => { },
    // transfertRoomToMember: async () => { },
    // toggleRoomStatus: async () => {}
})