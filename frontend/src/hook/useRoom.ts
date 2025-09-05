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

// Feature
// import { useQuery, useMutation } from 'tanstack-query/react';
// import { RoomContext } from '../context';
// import { getRoom, createRoom, addMember, deleteMemberToRoom, updateRoomInformation, deleteRoom } from '../services/roomServices';
// import type { Room } from '../types/room';
// import type { User } from '../types/user';

// export const useRoom = () => {
//     const context = useContext(RoomContext);
//     if (!context) {
//         throw new Error('useRoom must be used within a RoomProvider');
//     }

//     const getRoomQuery = useQuery('getRooms', getRoom);
//     const createRoomMutation = useMutation(createRoom);
//     const addMemberMutation = useMutation(addMember);
//     const deleteMemberToRoomMutation = useMutation(deleteMemberToRoom);
//     const updateRoomInformationMutation = useMutation(updateRoomInformation);
//     const deleteRoomMutation = useMutation(deleteRoom);

//     return {
//         ...context,
//         loading: getRoomQuery.isLoading,
//         getRoom: () => getRoomQuery.refetch(),
//         createRoom: (room_name: string, description: string, members: User[]) => createRoomMutation.mutate({ room_name, description, members }),
//         addMember: (roomId: string, memberId: string) => addMemberMutation.mutate({ roomId, memberId }),
//         deleteMemberToRoom: (roomId: string, memberId: string) => deleteMemberToRoomMutation.mutate({ roomId, memberId }),
//         updateRoomInformation: (roomId: string, room: Room) => updateRoomInformationMutation.mutate({ roomId, room }),
//         deleteRoom: (roomId: string) => deleteRoomMutation.mutate({ roomId }),
//     };
// };