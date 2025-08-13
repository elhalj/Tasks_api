// Create a new file called useRoom.ts
import { useContext } from 'react';
import { RoomContext } from '../context';
import type { Room } from '../types/room';

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context as { 
        room: Room[]; 
        getRoom: () => void;
        // Add other methods from your context here
    };
};