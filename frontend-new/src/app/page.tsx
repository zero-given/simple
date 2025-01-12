'use client';

import React, { useState, useEffect } from 'react';
import { SocketProvider, useSocket } from '@/contexts/SocketContext';
import LiveStatusBar from '@/components/LiveStatusBar';
import { TokenEventsList } from '@/components/TokenEventsList';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { Token } from '@/types/token';
import './styles.css';

function TokenExplorerContent() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [colors, setColors] = useState({
    gradientColor1: '#9333ea',
    gradientColor2: '#ec4899',
    bgGradientColor1: '#111827',
    bgGradientColor2: '#374151',
  });

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('token_update', (updatedToken: Token) => {
      setTokens(prevTokens => {
        const tokenIndex = prevTokens.findIndex(t => t.address === updatedToken.address);
        if (tokenIndex === -1) {
          return [updatedToken, ...prevTokens];
        } else {
          const newTokens = [...prevTokens];
          newTokens[tokenIndex] = {
            ...newTokens[tokenIndex],
            ...updatedToken,
            holdersChanged: newTokens[tokenIndex].gpHolderCount !== updatedToken.gpHolderCount,
            liquidityChanged: newTokens[tokenIndex].liq30 !== updatedToken.liq30,
          };
          return newTokens;
        }
      });
    });

    socket.on('token_remove', (tokenAddress: string) => {
      setTokens(prevTokens => prevTokens.filter(t => t.address !== tokenAddress));
    });

    socket.on('token_list', (tokenList: Token[]) => {
      setTokens(tokenList);
    });

    socket.emit('get_tokens');

    return () => {
      socket.off('token_update');
      socket.off('token_remove');
      socket.off('token_list');
    };
  }, [socket]);

  return (
    <div className="token-explorer">
      {/* Header Container */}
      <div className="header-container">
        <h1 className="page-title">Token Explorer</h1>
        <LiveStatusBar />
      </div>
      
      {/* Filters Bar */}
      <div className="filters-bar">
        <TokenEventsList 
          tokens={tokens} 
          onColorsChange={setColors}
          isFilterSection={true}
        />
      </div>

      {/* Tokens Container */}
      <div className="tokens-container">
        <div className="token-list">
          {tokens.map((token) => (
            <div key={token.address} className="token-card">
              <div className="token-card-content">
                <TokenEventsList 
                  tokens={[token]} 
                  onColorsChange={setColors}
                  isFilterSection={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}

export default function TokenExplorer() {
  return (
    <SocketProvider>
      <TokenExplorerContent />
    </SocketProvider>
  );
} 