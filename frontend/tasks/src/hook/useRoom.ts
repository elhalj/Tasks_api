// Create a new file called useRoom.ts
import { useContext } from 'react';
import { RoomContext } from '../context';
import type { Room } from '../types/room';
import type { User } from '../types/user';

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context as { 
        room: Room[]; 
        getRoom: () => Promise<void>;
        loading: boolean;
        createRoom: (room_name: string, description: string, members: User[]) => Promise<void>;
        addMember: (roomId: string, memberId: string) => Promise<void>;
        deleteMemberToRoom: (roomId: string, memberId: string) => Promise<void>;
        updateRoomInformation: (roomId: string, room: Room) => Promise<void>;
        deleteRoom: (roomId: string) => Promise<void>;
    };
};