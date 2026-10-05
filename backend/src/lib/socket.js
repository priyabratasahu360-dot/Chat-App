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