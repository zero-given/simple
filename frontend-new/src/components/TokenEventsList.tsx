'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TokenEventCard } from './TokenEventCard';
import { Token } from '../types/token';
import { Palette } from 'lucide-react';

// Add debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface TokenEventsListProps {
  tokens: Token[];
  onColorsChange: (colors: {
    gradientColor1: string;
    gradientColor2: string;
    bgGradientColor1: string;
    bgGradientColor2: string;
  }) => void;
  isFilterSection?: boolean;
  sortOptions: {
    sortBy: 'creationTime' | 'holders' | 'liquidity' | 'safetyScore' | 'age' | 'records';
    sortDirection: 'asc' | 'desc';
  };
  onSortChange: (newSortOptions: Partial<typeof sortOptions>) => void;
}

export const TokenEventsList: React.FC<TokenEventsListProps> = ({ 
  tokens, 
  onColorsChange, 
  isFilterSection = false,
  sortOptions,
  onSortChange
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [cardWidth, setCardWidth] = useState(100);

  useEffect(() => {
    document.documentElement.style.setProperty('--token-card-width', `${cardWidth}%`);
  }, [cardWidth]);

  if (!tokens || !Array.isArray(tokens)) {
    return <div className="text-center text-red-500">No tokens data available</div>;
  }

  if (tokens.length === 0) {
    return <div className="text-center text-gray-500">No tokens found</div>;
  }

  return (
    <>
      {isFilterSection ? (
        <div className="filters-section rounded-xl bg-gradient-to-r from-blue-400/30 to-blue-500/30 p-4">
          <div className="filters-content bg-white rounded-xl shadow-lg p-4">
            {/* Width Control Slider */}
            <div className="width-control-container">
              <span className="width-control-label">Card Width</span>
              <input
                type="range"
                min="50"
                max="100"
                value={cardWidth}
                onChange={(e) => setCardWidth(Number(e.target.value))}
                className="width-control-slider"
              />
              <span className="width-control-value">{cardWidth}%</span>
            </div>

            {/* Sort Controls */}
            <div className="filter-group">
              <select
                value={sortOptions.sortBy}
                onChange={(e) => onSortChange({ sortBy: e.target.value as typeof sortOptions.sortBy })}
                className="filter-select"
              >
                <option value="holders">Sort by Holders</option>
                <option value="age">Sort by Age</option>
                <option value="liquidity">Sort by Liquidity</option>
                <option value="safetyScore">Sort by Safety</option>
              </select>

              <select
                value={sortOptions.sortDirection}
                onChange={(e) => onSortChange({ sortDirection: e.target.value as 'asc' | 'desc' })}
                className="filter-select"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
              </select>
            </div>

            {/* Debug Info Section */}
            <div className="debug-info-section">
              <div className="debug-info-stat">
                <span className="debug-info-label">Tokens:</span>
                <span className="debug-info-value">{tokens.length}</span>
              </div>
              <div className="debug-info-stat">
                <span className="debug-info-label">Sort:</span>
                <span className="debug-info-value">{sortOptions.sortBy} ({sortOptions.sortDirection})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="token-list">
          {tokens.map((token) => (
            <TokenEventCard key={token.address} token={token} />
          ))}
        </div>
      )}
    </>
  );
}; 