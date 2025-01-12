'use client';

import React from 'react';
import { Token } from '@/types/token';
import { Shield, Users, Wallet, AlertTriangle, CheckCircle, XCircle, Lock, Activity, DollarSign } from 'lucide-react';

interface TokenEventCardProps {
  token: Token;
}

export const TokenEventCard: React.FC<TokenEventCardProps> = ({ token }) => {
  const getSecurityStatus = () => {
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
    
    if (isDangerous) return { status: 'danger', icon: <XCircle />, text: 'Dangerous' };
    if (hasWarnings) return { status: 'warning', icon: <AlertTriangle />, text: 'Warning' };
    return { status: 'safe', icon: <CheckCircle />, text: 'Safe' };
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const securityStatus = getSecurityStatus();

  return (
    <div>
      {/* Basic Info Section */}
      <div className="token-section">
        <div className="token-section-title">
          <Wallet />
          Token Information
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Name</div>
            <div className="token-data-value">{token.name || 'Unknown'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Symbol</div>
            <div className="token-data-value">{token.symbol || 'Unknown'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Address</div>
            <div className="token-data-value truncate">{token.address || 'Unknown'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Age</div>
            <div className="token-data-value">{token.ageHours || 0}h</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Creation Time</div>
            <div className="token-data-value">{formatTimestamp(token.creationTime)}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Security Status</div>
            <div className={`token-status status-${securityStatus.status}`}>
              {securityStatus.icon}
              {securityStatus.text}
            </div>
          </div>
        </div>
      </div>

      {/* Contract Info Section */}
      <div className="token-section">
        <div className="token-section-title">
          <Lock />
          Contract Information
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Open Source</div>
            <div className="token-data-value">{token.gpIsOpenSource ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Proxy Contract</div>
            <div className="token-data-value">{token.gpIsProxy ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Mintable</div>
            <div className="token-data-value">{token.gpIsMintable ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">External Calls</div>
            <div className="token-data-value">{token.gpExternalCall ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Can Self-Destruct</div>
            <div className="token-data-value">{token.gpSelfDestruct ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Hidden Owner</div>
            <div className="token-data-value">{token.gpHiddenOwner ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Trading Info Section */}
      <div className="token-section">
        <div className="token-section-title">
          <Activity />
          Trading Information
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Buy Tax</div>
            <div className="token-data-value">{token.gpBuyTax || 0}%</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Sell Tax</div>
            <div className="token-data-value">{token.gpSellTax || 0}%</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Can Buy</div>
            <div className="token-data-value">{token.gpCannotBuy ? 'No' : 'Yes'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Can Sell All</div>
            <div className="token-data-value">{token.gpCannotSellAll ? 'No' : 'Yes'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Trading Cooldown</div>
            <div className="token-data-value">{token.gpTradingCooldown ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Transfer Pausable</div>
            <div className="token-data-value">{token.gpTransferPausable ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Ownership Section */}
      <div className="token-section">
        <div className="token-section-title">
          <Users />
          Ownership & Holders
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Total Holders</div>
            <div className="token-data-value">{token.gpHolderCount || 0}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">LP Holders</div>
            <div className="token-data-value">{token.gpLpHolderCount || 0}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Owner Address</div>
            <div className="token-data-value truncate">{token.gpOwnerAddress || 'N/A'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Owner Balance</div>
            <div className="token-data-value">{token.gpOwnerBalance || 0}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Owner Percent</div>
            <div className="token-data-value">{token.gpOwnerPercent || 0}%</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Can Take Back Ownership</div>
            <div className="token-data-value">{token.gpCanTakeBackOwnership ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Liquidity Section */}
      <div className="token-section">
        <div className="token-section-title">
          <DollarSign />
          Liquidity Information
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Total Liquidity</div>
            <div className="token-data-value">${token.liq30 || 0}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">LP Total Supply</div>
            <div className="token-data-value">{token.gpLpTotalSupply || 0}</div>
          </div>
          {token.gpDexInfo?.map((dex, index) => (
            <div key={index} className="token-data-item">
              <div className="token-data-label">{dex.name} Liquidity</div>
              <div className="token-data-value">${dex.liquidity || 0}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Honeypot Section */}
      <div className="token-section">
        <div className="token-section-title">
          <AlertTriangle />
          Honeypot Analysis
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Is Honeypot</div>
            <div className="token-data-value">{token.isHoneypot ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Same Creator</div>
            <div className="token-data-value">{token.gpHoneypotWithSameCreator ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Blacklisted</div>
            <div className="token-data-value">{token.gpIsBlacklisted ? 'Yes' : 'No'}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Whitelisted</div>
            <div className="token-data-value">{token.gpIsWhitelisted ? 'Yes' : 'No'}</div>
          </div>
          {token.honeypotReason && (
            <div className="token-data-item col-span-full">
              <div className="token-data-label">Honeypot Reason</div>
              <div className="token-data-value">{token.honeypotReason}</div>
            </div>
          )}
        </div>
      </div>

      {/* API Info Section */}
      <div className="token-section">
        <div className="token-section-title">
          <Activity />
          API Information
        </div>
        <div className="token-grid">
          <div className="token-data-item">
            <div className="token-data-label">Total Scans</div>
            <div className="token-data-value">{token.totalScans || 0}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Failed Scans</div>
            <div className="token-data-value">{token.honeypotFailures || 0}</div>
          </div>
          <div className="token-data-item">
            <div className="token-data-label">Last Scan</div>
            <div className="token-data-value">{formatTimestamp(token.scanTimestamp)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 