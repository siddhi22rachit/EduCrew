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
import Message from './models/message.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/task', taskRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
    console.log(`User ${socket.id} left group ${groupId}`);
  });

  socket.on('send_message', async (messageData) => {
    try {
      const message = new Message({
        groupId: messageData.groupId,
        sender: messageData.userId,
        content: messageData.content,
        timestamp: new Date(),
      });
      await message.save();

      io.to(messageData.groupId).emit('receive_message', {
        ...messageData,
        _id: message._id,
        timestamp: message.timestamp,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.groupId).emit('user_typing', {
      userId: data.userId,
      username: data.username,
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.groupId).emit('user_stop_typing', {
      userId: data.userId,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
