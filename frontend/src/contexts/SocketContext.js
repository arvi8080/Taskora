import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);

        // Join user's room
        newSocket.emit('join-room', user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      // Expert location updates
      newSocket.on('expert-location-update', (data) => {
        console.log('Expert location update:', data);
        // Handle expert location update
      });

      // Emergency notifications
      newSocket.on('emergency-notification', (data) => {
        console.log('Emergency notification:', data);
        toast.error('Emergency alert received!', {
          duration: 10000,
          icon: '🚨',
        });
      });

      // Video call notifications
      newSocket.on('incoming-video-call', (data) => {
        console.log('Incoming video call:', data);
        toast.success(`Incoming video call from ${data.userName}`, {
          duration: 10000,
          action: {
            label: 'Answer',
            onClick: () => {
              // Handle video call acceptance
              window.location.href = `/video-call/${data.bookingId}`;
            },
          },
        });
      });

      newSocket.on('video-call-accepted', (data) => {
        console.log('Video call accepted:', data);
        toast.success('Video call accepted!');
      });

      // Tracking notifications
      newSocket.on('tracking-started', (data) => {
        console.log('Tracking started:', data);
        toast.success('Expert tracking started!');
      });

      newSocket.on('expert-arrived', (data) => {
        console.log('Expert arrived:', data);
        toast.success('Expert has arrived!');
      });

      socketRef.current = newSocket;

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  const emitEvent = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const onEvent = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const offEvent = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  const value = {
    socket: socketRef.current,
    isConnected,
    emitEvent,
    onEvent,
    offEvent,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};



