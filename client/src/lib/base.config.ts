/**
 * Base Network Configuration for GuardianChain
 * Optimized for Coinbase ecosystem integration and low-cost capsule minting
 */

import { base, baseGoerli } from "wagmi/chains";

export const baseConfig = {
  // Network Settings
  mainnet: {
    chain: base,
    rpcUrl: import.meta.env.VITE_BASE_RPC || "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    chainId: 8453,
    name: "Base",
    displayName: "Base",
    isMainnet: true,
  },
  testnet: {
    chain: baseGoerli,
    rpcUrl: "https://goerli.base.org",
    explorerUrl: "https://goerli.basescan.org",
    chainId: 84531,
    name: "Base Goerli",
    displayName: "Base Goerli",
    isMainnet: false,
  },

  // Contract Addresses (Base Mainnet)
  contracts: {
    gttToken: import.meta.env.VITE_GTT_BASE_ADDRESS || "",
    capsuleNFT: import.meta.env.VITE_CAPSULE_BASE_ADDRESS || "",
    yieldVault: import.meta.env.VITE_YIELD_VAULT_BASE || "",
    airdropContract: import.meta.env.VITE_AIRDROP_BASE_ADDRESS || "",
  },

  // Testnet Contract Addresses
  testnetContracts: {
    gttToken: import.meta.env.VITE_GTT_BASE_GOERLI_ADDRESS || "",
    capsuleNFT: import.meta.env.VITE_CAPSULE_BASE_GOERLI_ADDRESS || "",
    yieldVault: import.meta.env.VITE_YIELD_VAULT_BASE_GOERLI || "",
  },

  // Base-Specific Features
  features: {
    enabled: import.meta.env.VITE_BASE_ENABLED === "true",
    coinbaseIntegration: import.meta.env.VITE_BASE_COINBASE_INTEGRATION === "true",
    fastUnlocks: import.meta.env.VITE_BASE_FAST_UNLOCKS === "true",
    lowCostMinting: true,
    instantSettlement: true,
    regulatoryAlignment: true,
    mobileOptimized: true,
  },

  // Economic Settings
  economics: {
    // Base has significantly lower gas costs
    averageGasPrice: "0.001", // ~$0.001 USD
    capsuleMintCost: "0.01", // ~$0.01 USD
    yieldUnlockCost: "0.005", // ~$0.005 USD
    
    // GTT Distribution on Base
    airdrop: {
      totalAllocation: "250000", // 250K GTT
      eligibilityPeriod: 30, // days
      minimumCapsules: 1,
      bonusForCoinbaseUsers: "1.5", // 50% bonus
    },

    // Yield Mechanics
    yieldRates: {
      baseCapsuleYield: "0.12", // 12% base yield
      griefScoreMultiplier: "1.5", // Up to 50% bonus
      fastUnlockBonus: "0.05", // 5% bonus for fast unlocks
    },

    // Fee Structure
    fees: {
      capsuleMinting: "0.0001", // ETH
      yieldClaim: "0.0001", // ETH
      transfer: "0.00005", // ETH
    },
  },

  // Integration Settings
  integrations: {
    coinbase: {
      enabled: true,
      walletSupport: true,
      fiatOnRamp: true,
      apiKey: import.meta.env.VITE_COINBASE_API_KEY || "",
    },
    
    wallet: {
      preferredConnector: "coinbaseWallet",
      fallbackConnectors: ["metaMask", "walletConnect"],
      mobileDeepLinks: true,
    },

    dex: {
      uniswapV3: true,
      baseswap: true,
      aerodrome: true,
    },
  },

  // UI/UX Optimizations for Base
  ui: {
    theme: {
      primaryColor: "#0052FF", // Coinbase blue
      accentColor: "#1652F0",
      gradients: {
        primary: "linear-gradient(135deg, #0052FF 0%, #1652F0 100%)",
        capsule: "linear-gradient(135deg, #0052FF 0%, #00D4AA 100%)",
      },
    },

    notifications: {
      fastConfirmations: true,
      mobileOptimized: true,
      coinbaseWalletPrompts: true,
    },

    performance: {
      preloadCapsules: true,
      optimisticUpdates: true,
      backgroundSync: true,
    },
  },

  // Analytics and Tracking
  analytics: {
    trackBaseSpecificEvents: true,
    coinbaseUserIdentification: true,
    gasOptimizationMetrics: true,
    yieldPerformanceTracking: true,
  },

  // Development Settings
  development: {
    testnetEnabled: import.meta.env.DEV,
    debugLogging: import.meta.env.DEV,
    mockContracts: import.meta.env.VITE_MOCK_CONTRACTS === "true",
    
    // Mock addresses for development
    mockAddresses: {
      gttToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      capsuleNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      yieldVault: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    },
  },

  // Compliance and Security
  compliance: {
    kycRequired: false, // Base doesn't require KYC for basic features
    amlScreening: import.meta.env.PROD,
    regulatoryReporting: import.meta.env.PROD,
    privacyCompliant: true,
  },

  // Marketing and Campaigns
  campaigns: {
    baseAirdrop: {
      enabled: true,
      startDate: "2025-08-03",
      endDate: "2025-09-03",
      eligibilityUrl: "https://guardian.global/base-airdrop",
    },
    
    coinbasePartnership: {
      enabled: true,
      promotionalBonuses: true,
      exclusiveFeatures: ["fastUnlocks", "reducedFees"],
    },
  },
};

// Helper functions
export const getBaseContract = (contractName: keyof typeof baseConfig.contracts) => {
  const isTestnet = import.meta.env.DEV;
  if (isTestnet) {
    return baseConfig.testnetContracts[contractName as keyof typeof baseConfig.testnetContracts];
  }
  return baseConfig.contracts[contractName];
};

export const getBaseRpcUrl = () => {
  const isTestnet = import.meta.env.DEV;
  return isTestnet ? baseConfig.testnet.rpcUrl : baseConfig.mainnet.rpcUrl;
};

export const getBaseExplorerUrl = () => {
  const isTestnet = import.meta.env.DEV;
  return isTestnet ? baseConfig.testnet.explorerUrl : baseConfig.mainnet.explorerUrl;
};

export const isBaseEnabled = () => {
  return baseConfig.features.enabled;
};

export const isCoinbaseIntegrationEnabled = () => {
  return baseConfig.features.coinbaseIntegration && baseConfig.integrations.coinbase.enabled;
};

export const getBaseChainId = () => {
  const isTestnet = import.meta.env.DEV;
  return isTestnet ? baseConfig.testnet.chainId : baseConfig.mainnet.chainId;
};

export default baseConfig;