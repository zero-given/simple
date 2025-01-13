import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Activity, Server, MessageSquare, Heart, AlertCircle } from 'lucide-react';

export const DebugInfoBar: React.FC = () => {
  const { socket, isConnected, lastMessageTime } = useSocket();
  const [messageCount, setMessageCount] = useState(0);
  const [lastEvent, setLastEvent] = useState<string>('None');
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState({
    port: '3003',
    host: 'localhost',
    lastError: 'None',
    connectionAttempts: 0
  });

  useEffect(() => {
    if (!socket) return;

    // Track all events
    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      setMessageCount(prev => prev + 1);
      setLastEvent(`${eventName}: ${JSON.stringify(args).slice(0, 100)}...`);
    };

    // Track specific events
    socket.onAny(handleAnyEvent);
    
    socket.on('connect', () => {
      setDebugInfo(prev => ({
        ...prev,
        connectionAttempts: prev.connectionAttempts + 1,
        lastError: 'None'
      }));
    });

    socket.on('connect_error', (error) => {
      setDebugInfo(prev => ({
        ...prev,
        lastError: error.message
      }));
    });

    socket.on('PONG', () => {
      setHeartbeatCount(prev => prev + 1);
    });

    return () => {
      socket.offAny(handleAnyEvent);
      socket.off('connect');
      socket.off('connect_error');
      socket.off('PONG');
    };
  }, [socket]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="debug-info-bar">
      <div className="debug-info-title">
        Token Explorer
      </div>

      <div className="debug-info-center">
        <div className="debug-info-section">
          <Server className="debug-icon" />
          <span>Connection:</span>
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span>{`${debugInfo.host}:${debugInfo.port}`}</span>
          <span>Attempts: {debugInfo.connectionAttempts}</span>
        </div>

        <div className="debug-info-section">
          <MessageSquare className="debug-icon" />
          <span>Messages:</span>
          <span>Count: {messageCount}</span>
          <span>Last: {lastMessageTime}</span>
        </div>

        <div className="debug-info-section">
          <Heart className="debug-icon" />
          <span>Heartbeat:</span>
          <span>Count: {heartbeatCount}</span>
        </div>

        <div className="debug-info-section">
          <Activity className="debug-icon" />
          <span>Last Event:</span>
          <span className="last-event">{lastEvent}</span>
        </div>

        {debugInfo.lastError !== 'None' && (
          <div className="debug-info-section error">
            <AlertCircle className="debug-icon" />
            <span>Error:</span>
            <span className="error-message">{debugInfo.lastError}</span>
          </div>
        )}
      </div>

      <div className="debug-info-right">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <span>{currentTime}</span>
      </div>
    </div>
  );
}; 