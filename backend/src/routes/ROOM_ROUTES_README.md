# Room Management Routes - Algorithm Documentation

## Overview
This document outlines the algorithms and pseudocode for the room management routes in the Fastify backend. The routes handle room creation, management, and member administration.

## Table of Contents
1. [Get All User's Rooms](#1-get-all-users-rooms)
2. [Create New Room](#2-create-new-room)
3. [Add Member to Room](#3-add-member-to-room)
4. [Remove Member from Room](#4-remove-member-from-room)
5. [Update Room Information](#5-update-room-information)
6. [Delete Room](#6-delete-room)
7. [Transfer Room Ownership](#7-transfer-room-ownership)
8. [Toggle Room Active Status](#8-toggle-room-active-status)

---

## 1. Get All User's Rooms
**Endpoint:** `GET /rooms`

### Algorithm
1. Authenticate user
2. Find all rooms where user is either admin or member
3. Populate member and admin details
4. Return rooms array

### Pseudocode
```javascript
function getAllUserRooms(request, reply) {
    try {
        userId = request.user._id
        rooms = Room.find({
            $or: [
                { admin: userId },
                { members: userId }
            ]
        })
        .populate('admin', 'name email')
        .populate('members', 'name email')
        
        return { success: true, rooms }
    } catch (error) {
        handleError(error, reply)
    }
}
```

## 2. Create New Room
**Endpoint:** `POST /rooms`

### Algorithm
1. Validate request body (name, description)
2. Create new room with user as admin
3. Add user to members array
4. Save room
5. Return created room

### Pseudocode
```javascript
function createRoom(request, reply) {
    try {
        const { name, description } = request.body
        const userId = request.user._id
        
        const room = new Room({
            name,
            description,
            admin: userId,
            members: [userId]
        })
        
        await room.save()
        return { success: true, room }
    } catch (error) {
        handleError(error, reply)
    }
}
```

## 3. Add Member to Room
**Endpoint:** `POST /rooms/:roomId/members`

### Algorithm
1. Validate room and user IDs
2. Verify requesting user is room admin
3. Check if user is already a member
4. Check room member limit
5. Add user to members array
6. Return success message

## 4. Remove Member from Room
**Endpoint:** `DELETE /rooms/:roomId/members/:userId`

### Algorithm
1. Validate room and user IDs
2. Verify requesting user is room admin
3. Prevent self-removal if user is admin
4. Remove user from members array
5. Return success message

## 5. Update Room Information
**Endpoint:** `PUT /rooms/:roomId`

### Algorithm
1. Validate room ID and request body
2. Verify user is room admin
3. Update room fields
4. Return updated room

## 6. Delete Room
**Endpoint:** `DELETE /rooms/:roomId`

### Algorithm
1. Validate room ID
2. Verify user is room admin
3. Delete room and associated tasks/comments
4. Return success message

## 7. Transfer Room Ownership
**Endpoint:** `POST /rooms/:roomId/transfer-ownership`

### Algorithm
1. Validate room and new admin IDs
2. Verify current user is room admin
3. Verify new admin is a room member
4. Update room admin
5. Return success message

## 8. Toggle Room Active Status
**Endpoint:** `PATCH /rooms/:roomId/toggle-active`

### Algorithm
1. Validate room ID
2. Verify user is room admin
3. Toggle isActive status
4. Return updated room

---

## Error Handling
All routes use a centralized error handler that:
1. Logs the error
2. Returns appropriate HTTP status codes
3. Provides user-friendly error messages
4. Handles validation and duplicate key errors specially

## Security Considerations
- All routes require authentication
- Admin-only operations are protected
- Input validation is performed on all endpoints
- Transaction management for critical operations

## Dependencies
- Fastify for routing
- Mongoose for MongoDB operations
- JWT for authentication
