import Message from '../models/message.model.js';
import { handleSocketError } from '../utils/errorUtils.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_group', (groupId) => {
      try {
        socket.join(groupId);
        console.log(`User ${socket.id} joined group ${groupId}`);
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on('leave_group', (groupId) => {
      try {
        socket.leave(groupId);
        console.log(`User ${socket.id} left group ${groupId}`);
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on('send_message', async (messageData) => {
      try {
        const { groupId, userId, content } = messageData;
        
        // Validate input
        if (!groupId || !userId || !content) {
          throw new Error('Missing required message data');
        }

        const message = new Message({
          groupId,
          sender: userId,
          content,
          timestamp: new Date()
        });
        
        await message.save();

        io.to(groupId).emit('receive_message', {
          ...messageData,
          _id: message._id,
          timestamp: message.timestamp
        });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on('typing', (data) => {
      try {
        const { groupId, userId, username } = data;
        
        if (!groupId || !userId || !username) {
          throw new Error('Missing typing event data');
        }

        socket.to(groupId).emit('user_typing', { userId, username });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on('stop_typing', (data) => {
      try {
        const { groupId, userId } = data;
        
        if (!groupId || !userId) {
          throw new Error('Missing stop typing event data');
        }

        socket.to(groupId).emit('user_stop_typing', { userId });
      } catch (error) {
        handleSocketError(socket, error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};