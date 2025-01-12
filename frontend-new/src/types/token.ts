export interface Token {
  // Basic token info
  address: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: string;
  creationTime?: number;
  ageHours?: number;
  
  // Pair info
  pairAddress?: string;
  pairCreationTime?: number;
  pairAgeHours?: number;
  baseToken?: string;
  baseTokenSymbol?: string;
  baseTokenDecimals?: number;
  reservesToken0?: string;
  reservesToken1?: string;
  creationTx?: string;
  
  // Honeypot analysis
  isHoneypot?: boolean;
  honeypotReason?: string;
  simulationSuccess?: boolean;
  simulationError?: string;
  honeypotFailures?: number;
  riskLevel?: string;
  riskType?: string;
  
  // Contract info
  contractVerified?: boolean;
  gpIsOpenSource?: boolean;
  gpIsProxy?: boolean;
  gpIsMintable?: boolean;
  gpExternalCall?: boolean;
  isOpenSource?: boolean;
  isProxy?: boolean;
  isMintable?: boolean;
  canBeMinted?: boolean;
  hasProxyCalls?: boolean;
  
  // Tax and gas info
  gpBuyTax?: number;
  gpSellTax?: number;
  gpTransferTax?: number;
  gpEstimatedGas?: number;
  gpBuyGas?: number;
  gpSellGas?: number;
  buyTax?: number;
  sellTax?: number;
  transferTax?: number;
  buyGas?: number;
  sellGas?: number;
  
  // Ownership info
  gpOwnershipRenounced?: boolean;
  gpHiddenOwner?: boolean;
  gpCanTakeBackOwnership?: boolean;
  gpOwnerChangeBalance?: boolean;
  gpIsBlacklisted?: boolean;
  gpOwnerAddress?: string;
  gpOwnerBalance?: string;
  gpOwnerPercent?: number;
  gpCreatorBalance?: string;
  gpCreatorPercent?: number;
  
  // Security info
  gpCannotBuy?: boolean;
  gpCannotSellAll?: boolean;
  gpTradingCooldown?: boolean;
  gpTransferPausable?: boolean;
  gpIsAntiWhale?: boolean;
  gpAntiWhaleModifiable?: boolean;
  gpSlippageModifiable?: boolean;
  gpPersonalSlippageModifiable?: boolean;
  gpIsWhitelisted?: boolean;
  gpSelfDestruct?: boolean;
  gpHoneypotWithSameCreator?: boolean;
  safetyScore?: number;
  
  // Holders and LP info
  gpHolderCount?: number;
  gpTopHolderCount?: number;
  gpTopHolderShare?: number;
  gpLpHolderCount?: number;
  gpLpTopHolderCount?: number;
  gpLpTopHolderShare?: number;
  gpLpTotalSupply?: string;
  liq30?: number;
  holdersChanged?: boolean;
  liquidityChanged?: boolean;
  
  // DEX info
  dex?: string;
  router?: string;
  factory?: string;
  gpDexInfo?: Array<{
    name: string;
    liquidity: string;
    liquidity_type?: string;
    pair?: string;
  }>;
  
  // Additional metadata
  chain?: string;
  chainId?: number;
  deployer?: string;
  implementation?: string;
  totalScans?: number;
  
  // Liquidity history
  liquidityHistory?: Array<{
    timestamp: number;
    value: number;
  }>;
  
  // Scan info
  lastScan?: number;
  lastUpdate?: number;
  scanCount?: number;
  scanTimestamp?: string;
} 