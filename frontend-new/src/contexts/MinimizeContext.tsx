import React, { createContext, useContext, useState } from 'react';

interface MinimizeContextType {
  isMainMinimized: boolean;
  isPairMinimized: boolean;
  isContractMinimized: boolean;
  isTaxGasMinimized: boolean;
  isOwnershipMinimized: boolean;
  isSecurityMinimized: boolean;
  isHoldersLPMinimized: boolean;
  isDEXMinimized: boolean;
  isScanMinimized: boolean;
  isLiquidityHistoryMinimized: boolean;
  toggleSection: (section: string) => void;
}

const MinimizeContext = createContext<MinimizeContextType | undefined>(undefined);

export function MinimizeProvider({ children }: { children: React.ReactNode }) {
  const [minimizeState, setMinimizeState] = useState({
    isMainMinimized: false,
    isPairMinimized: true,
    isContractMinimized: true,
    isTaxGasMinimized: true,
    isOwnershipMinimized: true,
    isSecurityMinimized: true,
    isHoldersLPMinimized: true,
    isDEXMinimized: true,
    isScanMinimized: true,
    isLiquidityHistoryMinimized: true,
  });

  const toggleSection = (section: string) => {
    setMinimizeState(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <MinimizeContext.Provider value={{ ...minimizeState, toggleSection }}>
      {children}
    </MinimizeContext.Provider>
  );
}

export function useMinimize() {
  const context = useContext(MinimizeContext);
  if (context === undefined) {
    throw new Error('useMinimize must be used within a MinimizeProvider');
  }
  return context;
} 