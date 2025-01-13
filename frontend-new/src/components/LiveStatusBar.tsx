'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export default function LiveStatusBar() {
  const { isConnected, lastMessageTime } = useSocket();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[75%] mx-auto mb-6">
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`}>
                    {isConnected && (
                      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Time */}
              <div className="text-sm font-medium text-gray-300 bg-gray-700/50 px-3 py-1.5 rounded-lg border border-white/5">
                {currentTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 