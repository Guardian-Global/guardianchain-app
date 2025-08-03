import { polygon, base, polygonMumbai, baseGoerli } from "wagmi/chains";

// Enhanced multi-chain configuration for GuardianChain
export const supportedChains = [
  polygon, // Primary: Polygon mainnet for GTT token
  base, // Secondary: Base for expanded DeFi integration and low-cost minting
  ...(import.meta.env.DEV ? [polygonMumbai, baseGoerli] : [])
] as const;

// Chain-specific configuration
export const chainConfig = {
  [polygon.id]: {
    name: "Polygon",
    displayName: "Polygon",
    isMainnet: true,
    gttContract: import.meta.env.VITE_GTT_POLYGON_ADDRESS,
    capsuleContract: import.meta.env.VITE_CAPSULE_POLYGON_ADDRESS,
    yieldVault: import.meta.env.VITE_YIELD_VAULT_POLYGON,
    explorer: "https://polygonscan.com",
    rpcUrl: import.meta.env.VITE_POLYGON_RPC || "https://polygon-rpc.com",
    features: {
      capsuleMinting: true,
      yieldFarming: true,
      governanceVoting: true,
      legacyVaults: true,
      fastUnlocks: false,
      coinbaseIntegration: false,
    },
    costs: {
      gasLevel: "medium",
      mintingCost: "higher",
      description: "Mature ecosystem with established DAO",
    }
  },
  [base.id]: {
    name: "Base",
    displayName: "Base",
    isMainnet: true,
    gttContract: import.meta.env.VITE_GTT_BASE_ADDRESS,
    capsuleContract: import.meta.env.VITE_CAPSULE_BASE_ADDRESS,
    yieldVault: import.meta.env.VITE_YIELD_VAULT_BASE,
    explorer: "https://basescan.org",
    rpcUrl: import.meta.env.VITE_BASE_RPC || "https://mainnet.base.org",
    features: {
      capsuleMinting: true,
      yieldFarming: true,
      governanceVoting: false, // Migrating to Base
      fastUnlocks: true,
      coinbaseIntegration: true,
    },
    costs: {
      gasLevel: "low",
      mintingCost: "lower",
      description: "Ultra-low gas, instant settlement, Coinbase-backed",
    }
  },
  [polygonMumbai.id]: {
    name: "Polygon Mumbai",
    displayName: "Mumbai Testnet",
    isMainnet: false,
    gttContract: import.meta.env.VITE_GTT_MUMBAI_ADDRESS,
    capsuleContract: import.meta.env.VITE_CAPSULE_MUMBAI_ADDRESS,
    yieldVault: import.meta.env.VITE_YIELD_VAULT_MUMBAI,
    explorer: "https://mumbai.polygonscan.com",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    features: {
      capsuleMinting: true,
      yieldFarming: true,
      governanceVoting: true,
      fastUnlocks: false,
      coinbaseIntegration: false,
    },
    costs: {
      gasLevel: "free",
      mintingCost: "free",
      description: "Polygon testnet for development",
    }
  },
  [baseGoerli.id]: {
    name: "Base Goerli",
    displayName: "Base Goerli Testnet",
    isMainnet: false,
    gttContract: import.meta.env.VITE_GTT_BASE_GOERLI_ADDRESS,
    capsuleContract: import.meta.env.VITE_CAPSULE_BASE_GOERLI_ADDRESS,
    yieldVault: import.meta.env.VITE_YIELD_VAULT_BASE_GOERLI,
    explorer: "https://goerli.basescan.org",
    rpcUrl: "https://goerli.base.org",
    features: {
      capsuleMinting: true,
      yieldFarming: true,
      fastUnlocks: true,
      coinbaseIntegration: false,
      governanceVoting: false,
    },
    costs: {
      gasLevel: "free",
      mintingCost: "free",
      description: "Base testnet for development",
    }
  },
} as const;

// Helper functions
export const getChainConfig = (chainId: number) => {
  return chainConfig[chainId as keyof typeof chainConfig];
};

export const isMainnetChain = (chainId: number) => {
  const config = getChainConfig(chainId);
  return config?.isMainnet || false;
};

export const getChainExplorer = (chainId: number) => {
  const config = getChainConfig(chainId);
  return config?.explorer || "";
};

export const getChainRpcUrl = (chainId: number) => {
  const config = getChainConfig(chainId);
  return config?.rpcUrl || "";
};

export const supportsFeature = (chainId: number, feature: string) => {
  const config = getChainConfig(chainId);
  return config?.features?.[feature as keyof typeof config.features] || false;
};

// Default chain preferences
export const defaultChain = polygon;
export const preferredMintingChain = base; // Cheaper gas for capsule minting
export const governanceChain = polygon; // Mature DAO on Polygon

export type SupportedChain = typeof supportedChains[number];
export type ChainId = SupportedChain["id"];