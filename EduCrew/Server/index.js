import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import groupRoutes from './routes/group.route.js';
import taskRoutes from './routes/task.route.js';
import { initializeSocket } from './socket/socketHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { corsOptions, mongoOptions } from './config/options.js';

dotenv.config();

import events from 'events';
events.EventEmitter.defaultMaxListeners = 20; // Adjust the number as needed

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;


// Socket.IO initialization
const io = new Server(server, {
  cors: corsOptions
});

// Initialize socket handlers
initializeSocket(io);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO, mongoOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);

// Static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});