'use client';

import { useState, useEffect, useCallback } from 'react';
import { TokenEventsList } from '@/components/TokenEventsList';
import LiveStatusBar from '@/components/LiveStatusBar';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { UIColorTweaks, ColorProvider } from '@/components/UIColorTweaks';
import { useSocket, SocketProvider } from '@/contexts/SocketContext';
import { Token } from '@/types/token';
import './styles.css';
import { DebugInfoBar } from '../components/DebugInfoBar';

interface SortOptions {
  sortBy: 'creationTime' | 'holders' | 'liquidity' | 'safetyScore' | 'age' | 'records';
  sortDirection: 'asc' | 'desc';
}

function TokenExplorerContent() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: 'age',
    sortDirection: 'desc'
  });
  const [filteredAndSortedTokens, setFilteredAndSortedTokens] = useState<Token[]>([]);
  const { socket } = useSocket();

  const sortTokens = useCallback((tokensToSort: Token[]) => {
    return [...tokensToSort].sort((a, b) => {
      const direction = sortOptions.sortDirection === 'asc' ? 1 : -1;
      
      switch (sortOptions.sortBy) {
        case 'holders': {
          const holdersA = Number(a.gpHolderCount) || 0;
          const holdersB = Number(b.gpHolderCount) || 0;
          return direction * (holdersA - holdersB);
        }
        case 'age': {
          const ageA = a.ageHours || 0;
          const ageB = b.ageHours || 0;
          return direction * (ageA - ageB);
        }
        case 'liquidity': {
          const liquidityA = Number(a.gpDexInfo?.[0]?.liquidity) || 0;
          const liquidityB = Number(b.gpDexInfo?.[0]?.liquidity) || 0;
          return direction * (liquidityA - liquidityB);
        }
        case 'safetyScore': {
          const getScore = (token: Token) => {
            let score = 0;
            if (token.isHoneypot || token.gpIsHoneypot) score += 100;
            if (token.gpCannotSellAll) score += 50;
            if (token.gpCannotBuy) score += 40;
            if (!token.gpIsOpenSource) score += 20;
            return score;
          };
          return direction * (getScore(a) - getScore(b));
        }
        default:
          return 0;
      }
    });
  }, [sortOptions]);

  // Update sorted tokens whenever the original tokens or sort options change
  useEffect(() => {
    const sorted = sortTokens(tokens);
    setFilteredAndSortedTokens(sorted);
  }, [tokens, sortOptions, sortTokens]);

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

  const handleSortChange = (newSortOptions: Partial<SortOptions>) => {
    setSortOptions(prev => ({
      ...prev,
      ...newSortOptions
    }));
  };

  return (
    <ColorProvider>
      <div className="token-explorer">
        <div className="header-container">
          <h1 className="page-title">Token Explorer</h1>
          <LiveStatusBar />
        </div>

        <DebugInfoBar />

        <UIColorTweaks />

        <div className="filters-bar">
          <TokenEventsList 
            tokens={filteredAndSortedTokens}
            isFilterSection={true}
            onColorsChange={() => {}}
            onSortChange={handleSortChange}
            sortOptions={sortOptions}
          />
        </div>

        <div className="tokens-container">
          <TokenEventsList 
            tokens={filteredAndSortedTokens}
            isFilterSection={false}
            onColorsChange={() => {}}
            onSortChange={handleSortChange}
            sortOptions={sortOptions}
          />
        </div>

        <PerformanceMonitor />
      </div>
    </ColorProvider>
  );
}

export default function Home() {
  return (
    <SocketProvider>
      <TokenExplorerContent />
    </SocketProvider>
  );
} 