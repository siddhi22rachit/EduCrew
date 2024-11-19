import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import groupRoutes from './routes/group.route.js';
import taskRoutes from './routes/task.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Message from './models/message.model.js'; // You'll need to create this

dotenv.config();

import events from 'events';
events.EventEmitter.defaultMaxListeners = 20; // Adjust the number as needed

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server instance
const server = createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());





// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a study group room
  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Leave a study group room
  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
    console.log(`User ${socket.id} left group ${groupId}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (messageData) => {
    try {
      // Save message to database
      const message = new Message({
        groupId: messageData.groupId,
        sender: messageData.userId,
        content: messageData.content,
        timestamp: new Date()
      });
      await message.save();

      // Broadcast message to group members
      io.to(messageData.groupId).emit('receive_message', {
        ...messageData,
        _id: message._id,
        timestamp: message.timestamp
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing status
  socket.on('typing', (data) => {
    socket.to(data.groupId).emit('user_typing', {
      userId: data.userId,
      username: data.username
    });
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    socket.to(data.groupId).emit('user_stop_typing', {
      userId: data.userId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve Frontend (Static Files)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-All Route for React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server (using 'server' instead of 'app')
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


