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
        getRoom: () => void;
        createRoom: (room_name: string, description: string, members: User[]) => Promise<void>;
        addMember: (roomId: string, memberId: string) => Promise<void>;
        // Add other methods from your context here
    };
};