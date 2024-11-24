export const handleSocketError = (socket, error) => {
    console.error('Socket error:', error);
    socket.emit('error', {
      message: error.message || 'Socket operation failed',
      timestamp: new Date()
    });
  };