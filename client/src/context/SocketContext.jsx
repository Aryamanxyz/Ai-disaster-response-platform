import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token, user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    
    if (socketRef.current) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      if (user) {
        newSocket.emit('user:join', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);