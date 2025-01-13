'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Users, DollarSign, Activity, Info, Zap, ChevronDown, ChevronUp, Wallet, BarChart } from 'lucide-react';
import { Token } from '@/types/token';

interface TokenEventCardProps {
  token: Token;
}

const formatDate = (timestamp?: number) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
};

  const formatBoolean = (value: boolean | undefined) => {
    return value ? 'Yes' : 'No';
  };

  const formatPercentage = (value: number | undefined) => {
  return `${value || 0}%`;
};

const formatNumber = (value: string | number | undefined) => {
  if (value === undefined || value === '') return 'N/A';
  return value.toString();
};

const getSecurityClass = (token: Token): string => {
  if (token.isHoneypot || token.gpIsHoneypot) return 'status-danger';
  if (token.gpCannotSellAll || token.gpCannotBuy) return 'status-warning';
  return 'status-safe';
};

export const TokenEventCard: React.FC<TokenEventCardProps> = ({ token }) => {
  const [isMainMinimized, setIsMainMinimized] = useState(false);
  const [isHoneypotMinimized, setIsHoneypotMinimized] = useState(true);
  const [isGoPlusMinimized, setIsGoPlusMinimized] = useState(true);

  return (
    <div className="token-card">
      {/* Basic Information Section */}
      <div className="main-section">
        <div className="section-header">
          <div className="section-header-left">
            <Info className="w-6 h-6" />
            Token Information
          </div>
          <div className="header-widgets">
            <div className="header-widget">
              <span className="widget-label">TOKEN</span>
              <span className="widget-value">{token.symbol || 'N/A'}</span>
            </div>
            <div className="header-widget">
              <span className="widget-label">HOLDERS</span>
              <span className="widget-value">{token.gpHolderCount?.toLocaleString() || '0'}</span>
            </div>
            <div className="header-widget">
              <span className="widget-label">AGE</span>
              <span className="widget-value">{token.ageHours || 0}h</span>
            </div>
            <div className="header-widget">
              <span className="widget-label">LIQUIDITY</span>
              <span className="widget-value">${token.gpDexInfo?.[0]?.liquidity?.toLocaleString() || '0'}</span>
            </div>
          </div>
          <button className="minimize-button" onClick={() => setIsMainMinimized(!isMainMinimized)}>
            {isMainMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
        {!isMainMinimized && (
          <div className="token-grid">
            <div className="token-data-item">
              <span className="token-data-label">Name</span>
              <span className="token-data-value">{token.name || 'N/A'}</span>
            </div>
            <div className="token-data-item">
              <span className="token-data-label">Symbol</span>
              <span className="token-data-value">{token.symbol || 'N/A'}</span>
            </div>
            <div className="token-data-item col-span-full">
              <span className="token-data-label">Address</span>
              <span className="token-data-value truncate">{token.address}</span>
            </div>
            <div className="token-data-item">
              <span className="token-data-label">Creation Time</span>
              <span className="token-data-value">{formatDate(token.creationTime)}</span>
            </div>
            <div className="token-data-item">
              <span className="token-data-label">Age</span>
              <span className="token-data-value">{token.ageHours || 0}h</span>
            </div>
            <div className="token-data-item">
              <span className="token-data-label">Total Supply</span>
              <span className="token-data-value">{formatNumber(token.totalSupply)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Honeypot Analysis Section */}
      <div className="honeypot-container">
        <div className="section-header">
          <div className="section-header-left">
            <AlertTriangle className="w-6 h-6" />
            Honeypot Analysis
          </div>
          <button className="minimize-button" onClick={() => setIsHoneypotMinimized(!isHoneypotMinimized)}>
            {isHoneypotMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
        {!isHoneypotMinimized && (
          <>
            <div className="subsection">
              <h4 className="subsection-title">
                <Shield className="w-5 h-5" />
                Security Status
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Is Honeypot</span>
                  <span className="token-data-value">{formatBoolean(token.isHoneypot)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Simulation Success</span>
                  <span className="token-data-value">{formatBoolean(token.simulationSuccess)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Risk Level</span>
                  <span className="token-data-value">{token.riskLevel || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Risk Type</span>
                  <span className="token-data-value">{token.riskType || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Simulation Error</span>
                  <span className="token-data-value">{token.simulationError || 'None'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Failed Scans</span>
                  <span className="token-data-value">{token.honeypotFailures || 0}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <Wallet className="w-5 h-5" />
                Pair Information
              </h4>
              <div className="token-grid">
                <div className="token-data-item col-span-full">
                  <span className="token-data-label">Pair Address</span>
                  <span className="token-data-value truncate">{token.pairAddress || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Base Token</span>
                  <span className="token-data-value">{token.baseTokenSymbol || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Pair Age</span>
                  <span className="token-data-value">{token.pairAgeHours || 0}h</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Token0 Reserve</span>
                  <span className="token-data-value">{formatNumber(token.reservesToken0)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Token1 Reserve</span>
                  <span className="token-data-value">{formatNumber(token.reservesToken1)}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <Activity className="w-5 h-5" />
                Transaction Analysis
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Buy Gas</span>
                  <span className="token-data-value">{token.buyGas || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Sell Gas</span>
                  <span className="token-data-value">{token.sellGas || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Buy Tax</span>
                  <span className="token-data-value">{formatPercentage(token.buyTax)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Sell Tax</span>
                  <span className="token-data-value">{formatPercentage(token.sellTax)}</span>
                </div>
              </div>
            </div>

            {token.honeypotReason && (
              <div className="subsection">
                <h4 className="subsection-title">
                  <AlertTriangle className="w-5 h-5" />
                  Detection Details
                </h4>
                <div className="token-grid">
                  <div className="token-data-item col-span-full">
                    <span className="token-data-label">Honeypot Reason</span>
                    <span className="token-data-value">{token.honeypotReason}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* GoPlus Analysis Section */}
      <div className="goplus-container">
        <div className="section-header">
          <div className="section-header-left">
            <Shield className="w-6 h-6" />
            GoPlus Security Analysis
          </div>
          <button className="minimize-button" onClick={() => setIsGoPlusMinimized(!isGoPlusMinimized)}>
            {isGoPlusMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
        {!isGoPlusMinimized && (
          <>
            <div className="subsection">
              <h4 className="subsection-title">
                <Lock className="w-5 h-5" />
                Contract Security
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Open Source</span>
                  <span className="token-data-value">{formatBoolean(token.gpIsOpenSource)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Proxy Contract</span>
                  <span className="token-data-value">{formatBoolean(token.gpIsProxy)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Mintable</span>
                  <span className="token-data-value">{formatBoolean(token.gpIsMintable)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">External Calls</span>
                  <span className="token-data-value">{formatBoolean(token.gpExternalCall)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Self Destruct</span>
                  <span className="token-data-value">{formatBoolean(token.gpSelfDestruct)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Hidden Owner</span>
                  <span className="token-data-value">{formatBoolean(token.gpHiddenOwner)}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <Users className="w-5 h-5" />
                Ownership & Holders
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Total Holders</span>
                  <span className="token-data-value">{token.gpHolderCount || 0}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">LP Holders</span>
                  <span className="token-data-value">{token.gpLpHolderCount || 0}</span>
                </div>
                <div className="token-data-item col-span-full">
                  <span className="token-data-label">Owner Address</span>
                  <span className="token-data-value truncate">{token.gpOwnerAddress || 'N/A'}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Owner Balance</span>
                  <span className="token-data-value">{formatNumber(token.gpOwnerBalance)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Owner Percent</span>
                  <span className="token-data-value">{formatPercentage(token.gpOwnerPercent)}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <DollarSign className="w-5 h-5" />
                Trading Controls
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Buy Tax</span>
                  <span className="token-data-value">{formatPercentage(token.gpBuyTax)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Sell Tax</span>
                  <span className="token-data-value">{formatPercentage(token.gpSellTax)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Transfer Tax</span>
                  <span className="token-data-value">{formatPercentage(token.gpTransferTax)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Cannot Buy</span>
                  <span className="token-data-value">{formatBoolean(token.gpCannotBuy)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Cannot Sell</span>
                  <span className="token-data-value">{formatBoolean(token.gpCannotSellAll)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Trading Cooldown</span>
                  <span className="token-data-value">{formatBoolean(token.gpTradingCooldown)}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <Zap className="w-5 h-5" />
                Additional Security Checks
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Anti-Whale</span>
                  <span className="token-data-value">{formatBoolean(token.gpIsAntiWhale)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Slippage Modifiable</span>
                  <span className="token-data-value">{formatBoolean(token.gpSlippageModifiable)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Transfer Pausable</span>
                  <span className="token-data-value">{formatBoolean(token.gpTransferPausable)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Blacklisted</span>
                  <span className="token-data-value">{formatBoolean(token.gpIsBlacklisted)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Whitelisted</span>
                  <span className="token-data-value">{formatBoolean(token.gpIsWhitelisted)}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <BarChart className="w-5 h-5" />
                Holder Statistics
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">Top Holder Count</span>
                  <span className="token-data-value">{token.gpTopHolderCount || 0}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">Top Holder Share</span>
                  <span className="token-data-value">{formatPercentage(token.gpTopHolderShare)}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">LP Top Holder Count</span>
                  <span className="token-data-value">{token.gpLpTopHolderCount || 0}</span>
                </div>
                <div className="token-data-item">
                  <span className="token-data-label">LP Top Holder Share</span>
                  <span className="token-data-value">{formatPercentage(token.gpLpTopHolderShare)}</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h4 className="subsection-title">
                <DollarSign className="w-5 h-5" />
                DEX Information
              </h4>
              <div className="token-grid">
                <div className="token-data-item">
                  <span className="token-data-label">DEX</span>
                  <span className="token-data-value">{token.dex || 'N/A'}</span>
                </div>
                <div className="token-data-item col-span-full">
                  <span className="token-data-label">Router</span>
                  <span className="token-data-value truncate">{token.router || 'N/A'}</span>
                </div>
                <div className="token-data-item col-span-full">
                  <span className="token-data-label">Factory</span>
                  <span className="token-data-value truncate">{token.factory || 'N/A'}</span>
                </div>
                {token.gpDexInfo?.map((dex, index) => (
                  <div key={index} className="token-data-item">
                    <span className="token-data-label">{dex.name} Liquidity</span>
                    <span className="token-data-value">${dex.liquidity || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="token-status-container">
        <span className={`token-status ${getSecurityClass(token)}`}>
          {token.isHoneypot ? 'HONEYPOT DETECTED' : token.gpCannotSellAll ? 'CANNOT SELL' : 'SAFE'}
        </span>
      </div>
    </div>
  );
};

export const TokenEventsList: React.FC<TokenEventsListProps> = ({ tokens }) => {
  return (
    <div className="token-list">
      {tokens.map((token, index) => (
        <React.Fragment key={token.address}>
          <TokenEventCard token={token} />
          {index < tokens.length - 1 && <div className="token-spacer" />}
        </React.Fragment>
      ))}
    </div>
  );
}; 