import React from 'react';
import { Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { Token } from '@/types/token';
import { formatDate, formatNumber } from './utils';

interface TokenInfoProps {
  token: Token;
  isMinimized: boolean;
  onToggle: () => void;
}

export function TokenInfo({ token, isMinimized, onToggle }: TokenInfoProps) {
  return (
    <Card variant="default" className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[var(--color-primary)]" />
          <Text variant="h3">Token Information</Text>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-[var(--color-surface)]">
          {isMinimized ? 'Show More' : 'Show Less'}
        </button>
      </div>

      <div className={`grid gap-4 ${isMinimized ? 'hidden' : 'grid-cols-2'}`}>
        <div>
          <Text variant="label" color="secondary">Name</Text>
          <Text>{token.name || 'N/A'}</Text>
        </div>
        <div>
          <Text variant="label" color="secondary">Symbol</Text>
          <Text>{token.symbol || 'N/A'}</Text>
        </div>
        <div>
          <Text variant="label" color="secondary">Created At</Text>
          <Text>{formatDate(token.createdAt)}</Text>
        </div>
        <div>
          <Text variant="label" color="secondary">Total Supply</Text>
          <Text>{formatNumber(token.totalSupply)}</Text>
        </div>
        <div>
          <Text variant="label" color="secondary">Contract Address</Text>
          <Text className="break-all">{token.address}</Text>
        </div>
      </div>
    </Card>
  );
} 