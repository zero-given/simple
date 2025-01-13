'use client';

import React from 'react';
import { Shield, AlertTriangle, Lock, Users, DollarSign, Activity, Info, Zap, ChevronDown, ChevronUp, Wallet, BarChart } from 'lucide-react';
import { Token } from '@/types/token';
import { useMinimize } from '@/contexts/MinimizeContext';

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
  const {
    isMainMinimized,
    isPairMinimized,
    isContractMinimized,
    isTaxGasMinimized,
    isOwnershipMinimized,
    isSecurityMinimized,
    isHoldersLPMinimized,
    isDEXMinimized,
    isScanMinimized,
    isLiquidityHistoryMinimized,
    toggleSection
  } = useMinimize();

  return (
    <div className="token-card">
      <div className="token-card-left">
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
            <button className="minimize-button" onClick={() => toggleSection('isMainMinimized')}>
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
              <div className="token-data-item">
                <span className="token-data-label">Decimals</span>
                <span className="token-data-value">{token.decimals || 'N/A'}</span>
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
              <div className="token-data-item">
                <span className="token-data-label">Chain</span>
                <span className="token-data-value">{token.chain || 'N/A'}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Chain ID</span>
                <span className="token-data-value">{token.chainId || 'N/A'}</span>
              </div>
              <div className="token-data-item col-span-full">
                <span className="token-data-label">Deployer</span>
                <span className="token-data-value truncate">{token.deployer || 'N/A'}</span>
              </div>
              <div className="token-data-item col-span-full">
                <span className="token-data-label">Implementation</span>
                <span className="token-data-value truncate">{token.implementation || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Pair Information Section */}
        <div className="pair-info-section">
          <div className="section-header">
            <div className="section-header-left">
              <Wallet className="w-6 h-6" />
              Pair Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isPairMinimized')}>
              {isPairMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isPairMinimized && (
            <div className="token-grid">
              <div className="token-data-item col-span-full">
                <span className="token-data-label">Pair Address</span>
                <span className="token-data-value truncate">{token.pairAddress || 'N/A'}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Pair Creation Time</span>
                <span className="token-data-value">{formatDate(token.pairCreationTime)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Pair Age</span>
                <span className="token-data-value">{token.pairAgeHours || 0}h</span>
              </div>
              <div className="token-data-item col-span-full">
                <span className="token-data-label">Base Token</span>
                <span className="token-data-value truncate">{token.baseToken || 'N/A'}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Base Token Symbol</span>
                <span className="token-data-value">{token.baseTokenSymbol || 'N/A'}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Base Token Decimals</span>
                <span className="token-data-value">{token.baseTokenDecimals || 'N/A'}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Token0 Reserve</span>
                <span className="token-data-value">{formatNumber(token.reservesToken0)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Token1 Reserve</span>
                <span className="token-data-value">{formatNumber(token.reservesToken1)}</span>
              </div>
              <div className="token-data-item col-span-full">
                <span className="token-data-label">Creation Transaction</span>
                <span className="token-data-value truncate">{token.creationTx || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Contract Information Section */}
        <div className="contract-info-section">
          <div className="section-header">
            <div className="section-header-left">
              <Lock className="w-6 h-6" />
              Contract Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isContractMinimized')}>
              {isContractMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isContractMinimized && (
            <div className="token-grid">
              <div className="token-data-item">
                <span className="token-data-label">Contract Verified</span>
                <span className="token-data-value">{formatBoolean(token.contractVerified)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Open Source (GP)</span>
                <span className="token-data-value">{formatBoolean(token.gpIsOpenSource)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Proxy (GP)</span>
                <span className="token-data-value">{formatBoolean(token.gpIsProxy)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Mintable (GP)</span>
                <span className="token-data-value">{formatBoolean(token.gpIsMintable)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">External Calls (GP)</span>
                <span className="token-data-value">{formatBoolean(token.gpExternalCall)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Open Source</span>
                <span className="token-data-value">{formatBoolean(token.isOpenSource)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Proxy</span>
                <span className="token-data-value">{formatBoolean(token.isProxy)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Mintable</span>
                <span className="token-data-value">{formatBoolean(token.isMintable)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Can Be Minted</span>
                <span className="token-data-value">{formatBoolean(token.canBeMinted)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Has Proxy Calls</span>
                <span className="token-data-value">{formatBoolean(token.hasProxyCalls)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tax and Gas Information Section */}
        <div className="tax-gas-section">
          <div className="section-header">
            <div className="section-header-left">
              <DollarSign className="w-6 h-6" />
              Tax and Gas Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isTaxGasMinimized')}>
              {isTaxGasMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isTaxGasMinimized && (
            <div className="token-grid">
              <div className="token-data-item">
                <span className="token-data-label">Buy Tax (GP)</span>
                <span className="token-data-value">{formatPercentage(token.gpBuyTax)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Sell Tax (GP)</span>
                <span className="token-data-value">{formatPercentage(token.gpSellTax)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Transfer Tax (GP)</span>
                <span className="token-data-value">{formatPercentage(token.gpTransferTax)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Estimated Gas (GP)</span>
                <span className="token-data-value">{formatNumber(token.gpEstimatedGas)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Buy Gas (GP)</span>
                <span className="token-data-value">{formatNumber(token.gpBuyGas)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Sell Gas (GP)</span>
                <span className="token-data-value">{formatNumber(token.gpSellGas)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Buy Tax</span>
                <span className="token-data-value">{formatPercentage(token.buyTax)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Sell Tax</span>
                <span className="token-data-value">{formatPercentage(token.sellTax)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Transfer Tax</span>
                <span className="token-data-value">{formatPercentage(token.transferTax)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Buy Gas</span>
                <span className="token-data-value">{formatNumber(token.buyGas)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Sell Gas</span>
                <span className="token-data-value">{formatNumber(token.sellGas)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ownership Information Section */}
        <div className="ownership-section">
          <div className="section-header">
            <div className="section-header-left">
              <Users className="w-6 h-6" />
              Ownership Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isOwnershipMinimized')}>
              {isOwnershipMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isOwnershipMinimized && (
            <div className="token-grid">
              <div className="token-data-item">
                <span className="token-data-label">Ownership Renounced</span>
                <span className="token-data-value">{formatBoolean(token.gpOwnershipRenounced)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Hidden Owner</span>
                <span className="token-data-value">{formatBoolean(token.gpHiddenOwner)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Can Take Back Ownership</span>
                <span className="token-data-value">{formatBoolean(token.gpCanTakeBackOwnership)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Owner Change Balance</span>
                <span className="token-data-value">{formatBoolean(token.gpOwnerChangeBalance)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Blacklisted</span>
                <span className="token-data-value">{formatBoolean(token.gpIsBlacklisted)}</span>
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
              <div className="token-data-item">
                <span className="token-data-label">Creator Balance</span>
                <span className="token-data-value">{formatNumber(token.gpCreatorBalance)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Creator Percent</span>
                <span className="token-data-value">{formatPercentage(token.gpCreatorPercent)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Information Section */}
        <div className="security-section">
          <div className="section-header">
            <div className="section-header-left">
              <Shield className="w-6 h-6" />
              Security Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isSecurityMinimized')}>
              {isSecurityMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isSecurityMinimized && (
            <div className="token-grid">
              <div className="token-data-item">
                <span className="token-data-label">Cannot Buy</span>
                <span className="token-data-value">{formatBoolean(token.gpCannotBuy)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Cannot Sell All</span>
                <span className="token-data-value">{formatBoolean(token.gpCannotSellAll)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Trading Cooldown</span>
                <span className="token-data-value">{formatBoolean(token.gpTradingCooldown)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Transfer Pausable</span>
                <span className="token-data-value">{formatBoolean(token.gpTransferPausable)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Anti-Whale</span>
                <span className="token-data-value">{formatBoolean(token.gpIsAntiWhale)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Anti-Whale Modifiable</span>
                <span className="token-data-value">{formatBoolean(token.gpAntiWhaleModifiable)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Slippage Modifiable</span>
                <span className="token-data-value">{formatBoolean(token.gpSlippageModifiable)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Personal Slippage Modifiable</span>
                <span className="token-data-value">{formatBoolean(token.gpPersonalSlippageModifiable)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Whitelisted</span>
                <span className="token-data-value">{formatBoolean(token.gpIsWhitelisted)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Self Destruct</span>
                <span className="token-data-value">{formatBoolean(token.gpSelfDestruct)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Honeypot With Same Creator</span>
                <span className="token-data-value">{formatBoolean(token.gpHoneypotWithSameCreator)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Is Honeypot (GP)</span>
                <span className="token-data-value">{formatBoolean(token.gpIsHoneypot)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Safety Score</span>
                <span className="token-data-value">{token.safetyScore || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Holders and LP Information Section */}
        <div className="holders-lp-section">
          <div className="section-header">
            <div className="section-header-left">
              <Users className="w-6 h-6" />
              Holders and LP Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isHoldersLPMinimized')}>
              {isHoldersLPMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isHoldersLPMinimized && (
            <div className="token-grid">
              <div className="token-data-item">
                <span className="token-data-label">Holder Count</span>
                <span className="token-data-value">{token.gpHolderCount || 0}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Top Holder Count</span>
                <span className="token-data-value">{token.gpTopHolderCount || 0}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Top Holder Share</span>
                <span className="token-data-value">{formatPercentage(token.gpTopHolderShare)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">LP Holder Count</span>
                <span className="token-data-value">{token.gpLpHolderCount || 0}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">LP Top Holder Count</span>
                <span className="token-data-value">{token.gpLpTopHolderCount || 0}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">LP Top Holder Share</span>
                <span className="token-data-value">{formatPercentage(token.gpLpTopHolderShare)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">LP Total Supply</span>
                <span className="token-data-value">{formatNumber(token.gpLpTotalSupply)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">30-Day Liquidity</span>
                <span className="token-data-value">{formatNumber(token.liq30)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Holders Changed</span>
                <span className="token-data-value">{formatBoolean(token.holdersChanged)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Liquidity Changed</span>
                <span className="token-data-value">{formatBoolean(token.liquidityChanged)}</span>
              </div>
            </div>
          )}
        </div>

        {/* DEX Information Section */}
        <div className="dex-section">
          <div className="section-header">
            <div className="section-header-left">
              <BarChart className="w-6 h-6" />
              DEX Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isDEXMinimized')}>
              {isDEXMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isDEXMinimized && (
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
          )}
        </div>

        {/* Scan Information Section */}
        <div className="scan-section">
          <div className="section-header">
            <div className="section-header-left">
              <Activity className="w-6 h-6" />
              Scan Information
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isScanMinimized')}>
              {isScanMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isScanMinimized && (
            <div className="token-grid">
              <div className="token-data-item">
                <span className="token-data-label">Last Scan</span>
                <span className="token-data-value">{formatDate(token.lastScan)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Last Update</span>
                <span className="token-data-value">{formatDate(token.lastUpdate)}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Scan Count</span>
                <span className="token-data-value">{token.scanCount || 0}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Scan Timestamp</span>
                <span className="token-data-value">{token.scanTimestamp || 'N/A'}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Total Scans</span>
                <span className="token-data-value">{token.totalScans || 0}</span>
              </div>
              <div className="token-data-item">
                <span className="token-data-label">Transfer From Flag</span>
                <span className="token-data-value">{formatBoolean(token.transferFromFlag)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Liquidity History Section */}
        <div className="liquidity-history-section">
          <div className="section-header">
            <div className="section-header-left">
              <BarChart className="w-6 h-6" />
              Liquidity History
            </div>
            <button className="minimize-button" onClick={() => toggleSection('isLiquidityHistoryMinimized')}>
              {isLiquidityHistoryMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          {!isLiquidityHistoryMinimized && (
            <div className="token-grid">
              {token.liquidityHistory?.map((entry, index) => (
                <div key={index} className="token-data-item">
                  <span className="token-data-label">{formatDate(entry.timestamp)}</span>
                  <span className="token-data-value">${entry.value.toLocaleString()}</span>
                </div>
              ))}
              {(!token.liquidityHistory || token.liquidityHistory.length === 0) && (
                <div className="token-data-item">
                  <span className="token-data-value">No liquidity history available</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="token-card-right">
        {/* Right side content will be added later */}
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