import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import { redis } from './redis.js';

const app = express();
const server = http.Server(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

const ONLINE_USERS_KEY = "online_users";

export async function getReceiversSocketId(userId){
    return await redis.hget(ONLINE_USERS_KEY, userId);
}


io.on("connection", async(socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) {
        await redis.hset(ONLINE_USERS_KEY, userId, socket.id);
    }

    const onlineUsers = await redis.hkeys(ONLINE_USERS_KEY);

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", onlineUsers);

    socket.on("join_group", (groupId) => {
        socket.join(groupId);

        console.log(`User ${userId} joined group ${groupId}`);
    });

    socket.on("leave_group", (groupId) => {
        socket.leave(groupId);

        console.log(`User ${userId} left the group ${groupId}`);
    })

    // Start a voice call
    socket.on("call_user", async ({ receiverId, offer }) => {
        try {
            if (!userId || !receiverId || !offer || userId === receiverId) return;

            const receiverSocketId = await getReceiversSocketId(receiverId);

            if (!receiverSocketId) {
                socket.emit("call_unavailable", { message: "User is offline" });
                return;
            }

            io.to(receiverSocketId).emit("incoming_call", {
                callerId: userId,
                offer,
            });
        } catch (error) {
            console.log("Call error", error);
            socket.emit("call_error", { message: "Unable to make call" });
        }
    });

    // Accept a voice call
    socket.on("accept_call", async ({ callerId, answer }) => {
        try {
            if (!userId || !callerId || !answer) return;

            const callerSocketId = await getReceiversSocketId(callerId);

            if (!callerSocketId) {
                socket.emit("call_unavailable", {
                    message: "Caller is no longer connected",
                });
                return;
            }

            io.to(callerSocketId).emit("call_accepted", {
                receiverId: userId,
                answer,
            });
        } catch (error) {
            console.log("Accept call error", error);
        }
    });

    // Forward ICE candidates
    socket.on("ice_candidate", async ({ targetUserId, candidate }) => {
        try {
            if (!userId || !targetUserId || !candidate) return;

            const targetSocketId = await getReceiversSocketId(targetUserId);

            if (targetSocketId) {
                io.to(targetSocketId).emit("ice_candidate", {
                    senderId: userId,
                    candidate,
                });
            }
        } catch (error) {
            console.log("ICE signaling error", error);
        }
    });

    // End a voice call
    socket.on("end_call", async ({ targetUserId }) => {
        try {
            if (!userId || !targetUserId) return;

            const targetSocketId = await getReceiversSocketId(targetUserId);

            if (targetSocketId) {
                io.to(targetSocketId).emit("call_ended", {
                    senderId: userId,
                });
            }
        } catch (error) {
            console.log("End call error", error);
        }
    });

    socket.on("disconnect", async() => {
        console.log("A user disconnected", socket.id);

        if(userId){
            const currentActiveSocketId = await redis.hget(ONLINE_USERS_KEY, userId);

            if(currentActiveSocketId === socket.id){
                await redis.hdel(ONLINE_USERS_KEY, userId);
            }
        }
        const updatedOnlineUsers = await redis.hkeys(ONLINE_USERS_KEY);
        io.emit("getOnlineUsers", updatedOnlineUsers);
    })
})

export {io, app, server};