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
}

interface FilterState {
  minHolders: number;
  minLiquidity: number;
  hideHoneypots: boolean;
  showOnlyHoneypots: boolean;
  hideDanger: boolean;
  hideWarning: boolean;
  showOnlySafe: boolean;
  searchQuery: string;
  sortBy: 'creationTime' | 'holders' | 'liquidity' | 'safetyScore' | 'age' | 'records';
  sortDirection: 'asc' | 'desc';
  maxRecords: number;
  gradientColor1: string;
  gradientColor2: string;
  bgGradientColor1: string;
  bgGradientColor2: string;
  hideStagnantHolders: boolean;
  hideStagnantLiquidity: boolean;
  stagnantRecordCount: number;
}

export const TokenEventsList: React.FC<TokenEventsListProps> = ({ tokens, onColorsChange, isFilterSection = false }) => {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minHolders: 0,
    minLiquidity: 0,
    hideHoneypots: false,
    showOnlyHoneypots: false,
    hideDanger: false,
    hideWarning: false,
    showOnlySafe: false,
    searchQuery: '',
    sortBy: 'age',
    sortDirection: 'asc',
    maxRecords: 50,
    gradientColor1: '#9333ea',
    gradientColor2: '#ec4899',
    bgGradientColor1: '#111827',
    bgGradientColor2: '#374151',
    hideStagnantHolders: false,
    hideStagnantLiquidity: false,
    stagnantRecordCount: 10
  });

  // Add temporary state for draft changes
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);

  // Update the handleFilterChange to modify draft state instead
  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setDraftFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Add save changes handler
  const handleSaveChanges = useCallback(() => {
    setFilters(draftFilters);
    // Propagate color changes to parent
    onColorsChange({
      gradientColor1: draftFilters.gradientColor1,
      gradientColor2: draftFilters.gradientColor2,
      bgGradientColor1: draftFilters.bgGradientColor1,
      bgGradientColor2: draftFilters.bgGradientColor2
    });
  }, [draftFilters, onColorsChange]);

  // Reset changes handler
  const handleResetChanges = useCallback(() => {
    setDraftFilters(filters);
  }, [filters]);

  // Debounced color change handler
  const debouncedColorChange = useCallback(
    debounce((key: keyof FilterState, value: string) => {
      setDraftFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }, 100),
    []
  );

  // Immediate update for the input value, debounced update for the state
  const handleColorChange = useCallback((key: keyof FilterState, value: string) => {
    const input = document.querySelector(`input[data-color-input="${key}"]`) as HTMLInputElement;
    if (input) input.value = value;
    debouncedColorChange(key, value);
  }, [debouncedColorChange]);

  // Memoize the filter function
  const filterTokens = useCallback((tokensToFilter: Token[]) => {
    if (!tokensToFilter || !Array.isArray(tokensToFilter)) {
      return [];
    }

    return tokensToFilter.filter(token => {
      const holderCount = token.gpHolderCount || 0;
      const liquidity = token.liq30 || 0;
      const isHoneypot = token.isHoneypot || false;
      const isDangerousBlacklist = token.gpIsBlacklisted && !token.gpIsAntiWhale;
      const isDangerous = isHoneypot || isDangerousBlacklist;
      const hasWarnings = !isDangerous && (
        !token.gpIsOpenSource ||
        token.gpIsProxy ||
        token.gpIsMintable ||
        token.gpExternalCall ||
        token.gpCannotBuy ||
        token.gpCannotSellAll ||
        token.gpTradingCooldown ||
        token.gpTransferPausable ||
        token.gpHiddenOwner ||
        token.gpCanTakeBackOwnership ||
        token.gpOwnerChangeBalance ||
        ((token.gpBuyTax ?? 0) > 10) ||
        ((token.gpSellTax ?? 0) > 10) ||
        (token.gpIsAntiWhale && token.gpAntiWhaleModifiable) ||
        token.gpSlippageModifiable
      );
      const isSafe = !isDangerous && !hasWarnings;

      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const nameMatch = token.name?.toLowerCase().includes(searchLower);
        const symbolMatch = token.symbol?.toLowerCase().includes(searchLower);
        if (!nameMatch && !symbolMatch) return false;
      }

      // Basic filters
      if (holderCount < filters.minHolders) return false;
      if (liquidity < filters.minLiquidity) return false;
      
      // Honeypot filters
      if (filters.hideHoneypots && isHoneypot) return false;
      if (filters.showOnlyHoneypots && !isHoneypot) return false;

      // Security level filters
      if (filters.hideDanger && isDangerous) return false;
      if (filters.hideWarning && hasWarnings) return false;
      if (filters.showOnlySafe && !isSafe) return false;

      // Stagnant token filters
      if (filters.hideStagnantHolders || filters.hideStagnantLiquidity) {
        const recordCount = token.totalScans || 0;
        if (recordCount >= filters.stagnantRecordCount) {
          // Check if holders are stagnant
          if (filters.hideStagnantHolders && !token.holdersChanged) {
            return false;
          }
          // Check if liquidity is stagnant
          if (filters.hideStagnantLiquidity && !token.liquidityChanged) {
            return false;
          }
        }
      }

      return true;
    }).slice(0, filters.maxRecords);
  }, [filters]);

  // Add sorting function
  const sortTokens = useCallback((tokensToSort: Token[]) => {
    return [...tokensToSort].sort((a, b) => {
      const direction = filters.sortDirection === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'records':
          return direction * ((a.totalScans || 0) - (b.totalScans || 0));
        case 'age':
          return direction * ((a.ageHours || 0) - (b.ageHours || 0));
        case 'creationTime':
          const timeA = a.creationTime || 0;
          const timeB = b.creationTime || 0;
          return direction * (timeA - timeB);
        case 'holders':
          return direction * ((a.gpHolderCount || 0) - (b.gpHolderCount || 0));
        case 'liquidity':
          return direction * ((a.liq30 || 0) - (b.liq30 || 0));
        case 'safetyScore':
          const scoreA = a.isHoneypot ? 0 : (a.safetyScore || 0);
          const scoreB = b.isHoneypot ? 0 : (b.safetyScore || 0);
          return direction * (scoreA - scoreB);
        default:
          return 0;
      }
    });
  }, [filters.sortBy, filters.sortDirection]);

  // Update the useEffect to include sorting
  useEffect(() => {
    const filtered = filterTokens(tokens);
    const sorted = sortTokens(filtered);
    setFilteredTokens(sorted);
  }, [tokens, filterTokens, sortTokens]);

  if (!tokens || !Array.isArray(tokens)) {
    return <div className="text-center text-red-500">No tokens data available</div>;
  }

  if (tokens.length === 0) {
    return <div className="text-center text-gray-500">No tokens found</div>;
  }

  return (
    <>
      {isFilterSection ? (
        <div className="filters-content">
          {/* Search Box */}
          <div className="filter-group">
            <input
              type="text"
              value={draftFilters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              placeholder="Search tokens..."
              className="filter-input"
            />
          </div>

          {/* Sort Controls */}
          <div className="filter-group">
            <select
              value={draftFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="age">Sort by Age</option>
              <option value="holders">Sort by Holders</option>
              <option value="liquidity">Sort by Liquidity</option>
              <option value="safetyScore">Sort by Safety</option>
            </select>

            <select
              value={draftFilters.sortDirection}
              onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
              className="filter-select"
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>

          {/* Security Filters */}
          <div className="filter-checkbox-group">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={draftFilters.hideDanger}
                onChange={(e) => handleFilterChange('hideDanger', e.target.checked)}
                className="filter-checkbox"
              />
              Hide Dangerous
            </label>
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={draftFilters.hideWarning}
                onChange={(e) => handleFilterChange('hideWarning', e.target.checked)}
                className="filter-checkbox"
              />
              Hide Warnings
            </label>
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={draftFilters.showOnlySafe}
                onChange={(e) => handleFilterChange('showOnlySafe', e.target.checked)}
                className="filter-checkbox"
              />
              Only Safe
            </label>
          </div>

          {/* Save/Reset */}
          <div className="filter-group ml-auto">
            <button
              onClick={handleSaveChanges}
              className="filter-input bg-purple-600 hover:bg-purple-700 cursor-pointer"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetChanges}
              className="filter-input bg-gray-600 hover:bg-gray-700 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        // Render token card
        <div>
          {tokens.map((token) => (
            <TokenEventCard key={token.address} token={token} />
          ))}
        </div>
      )}
    </>
  );
}; 