"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon, base, polygonMumbai, baseGoerli } from "wagmi/chains";
import { injected, metaMask, walletConnect, coinbaseWallet } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Enhanced multi-chain configuration for GuardianChain using Wagmi v2
const chains = [
  polygon, // Primary: Polygon mainnet for GTT token
  base, // Secondary: Base for expanded DeFi integration
  ...(import.meta.env.DEV ? [polygonMumbai, baseGoerli] : [])
] as const;

// Enhanced wagmi configuration with multiple connectors and better error handling
const wagmiConfig = createConfig({
  chains,
  connectors: [
    metaMask({
      dappMetadata: {
        name: "GuardianChain",
        url: typeof window !== 'undefined' ? window.location.origin : "https://guardianchain.app",
      },
    }),
    coinbaseWallet({
      appName: "GuardianChain",
      appLogoUrl: "https://guardian.global/logo.png",
    }),
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || import.meta.env.VITE_REOWN_PROJECT_ID || "7b0a4e44b01e7e6b2e3f9ac2d5c8b1f3",
      metadata: {
        name: "GuardianChain",
        description: "Sovereign Web3 Truth Vault Platform",
        url: typeof window !== 'undefined' ? window.location.origin : "https://guardianchain.app",
        icons: ["https://guardian.global/logo.png"]
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [polygon.id]: http(import.meta.env.VITE_POLYGON_RPC || "https://polygon-rpc.com"),
    [base.id]: http(import.meta.env.VITE_BASE_RPC || "https://mainnet.base.org"),
    [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
    [baseGoerli.id]: http("https://goerli.base.org"),
  },
});

// Enhanced query client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = typeof queryKey[0] === "string" ? queryKey[0] : "/";
        const res = await fetch(url, {
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        return res.json();
      },
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Wallet context for enhanced state management
interface WalletContextType {
  isConnecting: boolean;
  connectionError: string | null;
  supportedChains: typeof chains;
}

const WalletContext = createContext<WalletContextType>({
  isConnecting: false,
  connectionError: null,
  supportedChains: chains,
});

export const useWalletContext = () => useContext(WalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Enhanced MetaMask detection and setup
    const setupWalletConnection = async () => {
      if (typeof window === "undefined") return;

      // Wait for ethereum provider injection
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkForProvider = () => {
        if (window.ethereum || attempts >= maxAttempts) {
          if (window.ethereum) {
            console.log("Web3 provider detected successfully");
            setConnectionError(null);
          } else {
            setConnectionError("No Web3 provider detected. Please install MetaMask.");
          }
          setIsConnecting(false);
          return;
        }
        
        attempts++;
        setTimeout(checkForProvider, 100);
      };

      setIsConnecting(true);
      checkForProvider();
    };

    setupWalletConnection();
  }, []);

  const contextValue: WalletContextType = {
    isConnecting,
    connectionError,
    supportedChains: chains,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </WalletContext.Provider>
  );
}