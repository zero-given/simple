import React from 'react';
import { Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { Token } from '@/types/token';
import { formatBoolean, getSecurityStatus } from './utils';

interface SecurityInfoProps {
  token: Token;
  isMinimized: boolean;
  onToggle: () => void;
}

export function SecurityInfo({ token, isMinimized, onToggle }: SecurityInfoProps) {
  const securityStatus = getSecurityStatus(token.isHoneypot, token.gpCannotSellAll);

  return (
    <Card variant="default" className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 text-[var(--color-status-${securityStatus.status})]`} />
          <Text variant="h3">Security Analysis</Text>
        </div>
        <div className="flex items-center gap-4">
          <Text 
            color={securityStatus.status as any} 
            className="px-3 py-1 rounded-full bg-[var(--color-surface)]"
          >
            {securityStatus.message}
          </Text>
          <button onClick={onToggle} className="p-2 hover:bg-[var(--color-surface)]">
            {isMinimized ? 'Show More' : 'Show Less'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="label" color="secondary">Is Honeypot</Text>
            <Text color={token.isHoneypot ? 'error' : 'success'}>
              {formatBoolean(token.isHoneypot)}
            </Text>
          </div>
          <div>
            <Text variant="label" color="secondary">Can Sell All</Text>
            <Text color={token.gpCannotSellAll ? 'error' : 'success'}>
              {formatBoolean(!token.gpCannotSellAll)}
            </Text>
          </div>
          <div>
            <Text variant="label" color="secondary">Can Buy</Text>
            <Text color={token.gpCannotBuy ? 'error' : 'success'}>
              {formatBoolean(!token.gpCannotBuy)}
            </Text>
          </div>
          <div>
            <Text variant="label" color="secondary">Trading Enabled</Text>
            <Text>{formatBoolean(token.tradingEnabled)}</Text>
          </div>
          {token.securityNotes && (
            <div className="col-span-2">
              <Text variant="label" color="secondary">Security Notes</Text>
              <Text color="secondary" className="whitespace-pre-wrap">
                {token.securityNotes}
              </Text>
            </div>
          )}
        </div>
      )}
    </Card>
  );
} 