import { createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, polygonAmoy } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { baseMainnet, baseTestnet } from "./base.config";

// Local Hardhat development chain
const hardhat = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Local", url: "http://localhost:8545" },
  },
} as const;

// Contract addresses from current deployments
export const CONTRACTS = {
  GTT_TOKEN: {
    [mainnet.id]: "0x0000000000000000000000000000000000000000", // Deploy GTT here
    [sepolia.id]: "0x0000000000000000000000000000000000000000", // Testnet GTT
    [polygon.id]: "0x0000000000000000000000000000000000000000", // Polygon GTT
    [polygonAmoy.id]: "0x0000000000000000000000000000000000000000", // Polygon testnet GTT
    [baseMainnet.id]: "0x0000000000000000000000000000000000000000", // Base mainnet GTT
    [baseTestnet.id]: "0x0000000000000000000000000000000000000000", // Base testnet GTT
    [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Local hardhat GTT
  },
  TRUTH_VAULT: {
    [mainnet.id]: "0x0000000000000000000000000000000000000000", // Deploy TruthVault here
    [sepolia.id]: "0x0000000000000000000000000000000000000000", // Testnet TruthVault
    [polygon.id]: "0x0000000000000000000000000000000000000000", // Polygon TruthVault
    [polygonAmoy.id]: "0x0000000000000000000000000000000000000000", // Polygon testnet TruthVault
    [baseMainnet.id]: "0x0000000000000000000000000000000000000000", // Base mainnet TruthVault
    [baseTestnet.id]: "0x0000000000000000000000000000000000000000", // Base testnet TruthVault
    [hardhat.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Local hardhat TruthVault
  },
} as const;

// ABI definitions for smart contracts
export const GTT_TOKEN_ABI = [
  {
    inputs: [
      { internalType: "address", name: "initialOwner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "remainingSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const TRUTH_VAULT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_gttToken", type: "address" },
      { internalType: "address", name: "_admin", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "capsuleId", type: "uint256" }],
    name: "claimYield",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "yieldAmount", type: "uint256" }],
    name: "calculateGTTReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "capsuleId", type: "uint256" }],
    name: "getCapsuleClaimInfo",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "totalEarned", type: "uint256" },
      { internalType: "uint256", name: "totalClaimed", type: "uint256" },
      { internalType: "uint256", name: "claimable", type: "uint256" },
      { internalType: "uint256", name: "nextClaimTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "capsules",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "bool", name: "isVerified", type: "bool" },
      { internalType: "bool", name: "isSealed", type: "bool" },
      { internalType: "uint256", name: "truthYield", type: "uint256" },
      { internalType: "uint256", name: "totalClaimed", type: "uint256" },
      { internalType: "uint256", name: "lastClaimTime", type: "uint256" },
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "string", name: "veritasSealUrl", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "capsuleId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "yieldAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gttAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "YieldClaimed",
    type: "event",
  },
] as const;

// Wagmi configuration with Base Network support
export const wagmiConfig = createConfig({
  chains: [hardhat, mainnet, sepolia, polygon, polygonAmoy, baseMainnet, baseTestnet],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: "GuardianChain",
      appLogoUrl: "https://guardianchain.app/logo.png",
    }),
    walletConnect({
      projectId:
        import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
        "guardianchain-protocol",
      metadata: {
        name: "GUARDIANCHAIN",
        description: "Immutable Truth Verification Protocol",
        url:
          typeof window !== "undefined"
            ? window.location.origin
            : "https://guardianchain.replit.app",
        icons: [
          `${
            typeof window !== "undefined"
              ? window.location.origin
              : "https://guardianchain.replit.app"
          }/favicon.ico`,
        ],
      },
      qrModalOptions: {
        themeMode: "dark",
        themeVariables: {
          "--wcm-z-index": "1000",
        },
      },
    }),
  ],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY || "demo"
      }`,
    ),
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY || "demo"
      }`,
    ),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY || "demo"
      }`,
    ),
    [polygonAmoy.id]: http(
      `https://polygon-amoy.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY || "demo"
      }`,
    ),
    [baseMainnet.id]: http("https://mainnet.base.org"),
    [baseTestnet.id]: http("https://sepolia.base.org"),
  },
});

// Helper function to get contract address for current chain
export function getContractAddress(
  contractName: keyof typeof CONTRACTS,
  chainId: number,
): string {
  const address =
    CONTRACTS[contractName][
      chainId as keyof (typeof CONTRACTS)[typeof contractName]
    ];
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    console.warn(
      `${contractName} not deployed on chain ${chainId}, using zero address`,
    );
    return "0x0000000000000000000000000000000000000000";
  }
  return address;
}

// Network display names
export const NETWORK_NAMES = {
  [hardhat.id]: "Hardhat Local",
  [mainnet.id]: "Ethereum",
  [sepolia.id]: "Sepolia Testnet",
  [polygon.id]: "Polygon",
  [polygonAmoy.id]: "Polygon Amoy Testnet",
  [baseMainnet.id]: "Base",
  [baseTestnet.id]: "Base Sepolia",
} as const;

// Support check for networks
export function isSupportedNetwork(chainId: number): boolean {
  return Object.keys(NETWORK_NAMES).includes(chainId.toString());
}
