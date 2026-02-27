import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';

const __dirname = path.resolve();

import { connectDb } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { app, server } from './lib/socket.js';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDb();
});