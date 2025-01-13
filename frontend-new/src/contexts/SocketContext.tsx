'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Token } from '../types/token';

interface ServerToClientEvents {
  PONG: (data: { time: number }) => void;
  token_update: (token: Token) => void;
  token_remove: (tokenAddress: string) => void;
  token_list: (tokens: Token[]) => void;
}

interface ClientToServerEvents {
  PING: () => void;
  get_tokens: () => void;
}

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  lastMessageTime: string;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  lastMessageTime: 'Never'
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState('Never');

  useEffect(() => {
    const socketInstance = io('http://localhost:3003', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socketInstance.on('PONG', (data) => {
      setLastMessageTime(new Date().toLocaleTimeString());
      console.log('PONG received:', data);
    });

    socketInstance.on('token_update', (token) => {
      setLastMessageTime(new Date().toLocaleTimeString());
      console.log('Token update received:', token);
    });

    setSocket(socketInstance);

    // Start PING interval
    const pingInterval = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit('PING');
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, lastMessageTime }}>
      {children}
    </SocketContext.Provider>
  );
}; 