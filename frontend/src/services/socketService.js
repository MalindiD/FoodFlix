import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5003';

/**
 * Connect to socket for real-time order updates
 */
export const connectToOrderSocket = (orderId) => {
  const socket = io(SOCKET_URL);
  
  socket.on('connect', () => {
    console.log('Socket connected for order tracking');
    
    // Join room for this specific order
    socket.emit('joinOrderRoom', orderId);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  
  return socket;
};
