import React, { useState } from 'react';
import { Token } from '@/types/token';
import { TokenInfo } from './TokenInfo';
import { SecurityInfo } from './SecurityInfo';

interface TokenEventCardProps {
  token: Token;
}

export function TokenEventCard({ token }: TokenEventCardProps) {
  const [sections, setSections] = useState({
    main: false,
    security: true,
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <TokenInfo 
        token={token}
        isMinimized={sections.main}
        onToggle={() => toggleSection('main')}
      />
      <SecurityInfo
        token={token}
        isMinimized={sections.security}
        onToggle={() => toggleSection('security')}
      />
    </div>
  );
} 