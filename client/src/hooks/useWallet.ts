import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { useEffect, useState } from "react";
import { polygon, base } from "wagmi/chains";
import { useWalletContext } from "@/components/providers/WalletProvider";

export interface WalletState {
  address?: string;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  connector?: any;
  chainId?: number;
  chainName?: string;
  isCorrectChain: boolean;
  error?: Error;
}

export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToPolygon: () => Promise<void>;
  switchToBase: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

export const useWallet = (): WalletState & WalletActions => {
  const { address, isConnected, isConnecting, isReconnecting, connector } = useAccount();
  const { connect, connectors, error: connectError, isPending: isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { connectionError } = useWalletContext();
  
  const [error, setError] = useState<Error | undefined>();

  // Determine if user is on a supported chain (Polygon or Base)
  const isCorrectChain = chainId === polygon.id || chainId === base.id;

  // Enhanced connection function
  const handleConnect = async () => {
    try {
      setError(undefined);
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to connect your wallet");
      }

      // Try MetaMask first, fallback to injected
      const metaMaskConnector = connectors.find(c => c.name === "MetaMask");
      const connector = metaMaskConnector || connectors[0];
      
      if (!connector) {
        throw new Error("No wallet connector available");
      }

      await connect({ connector });
      
      // Auto-switch to Polygon after connection
      if (switchChain && chainId !== polygon.id) {
        setTimeout(() => {
          switchChain({ chainId: polygon.id });
        }, 1000);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError(err as Error);
    }
  };

  // Enhanced disconnect function
  const handleDisconnect = () => {
    try {
      setError(undefined);
      disconnect();
    } catch (err) {
      console.error("Wallet disconnect failed:", err);
      setError(err as Error);
    }
  };

  // Network switching functions
  const switchToPolygon = async () => {
    if (!switchChain) return;
    try {
      await switchChain({ chainId: polygon.id });
    } catch (err) {
      console.error("Failed to switch to Polygon:", err);
      setError(err as Error);
    }
  };

  const switchToBase = async () => {
    if (!switchChain) return;
    try {
      await switchChain({ chainId: base.id });
    } catch (err) {
      console.error("Failed to switch to Base:", err);
      setError(err as Error);
    }
  };

  const handleSwitchNetwork = async (targetChainId: number) => {
    if (!switchChain) return;
    try {
      await switchChain({ chainId: targetChainId });
    } catch (err) {
      console.error(`Failed to switch to chain ${targetChainId}:`, err);
      setError(err as Error);
    }
  };

  // Update error state from connect errors
  useEffect(() => {
    if (connectError) {
      setError(connectError);
    }
  }, [connectError]);

  // Update error state from connection errors
  useEffect(() => {
    if (connectionError) {
      setError(new Error(connectionError));
    }
  }, [connectionError]);

  return {
    // State
    address,
    isConnected,
    isConnecting: isConnecting || isLoading || isSwitching,
    isReconnecting,
    connector,
    chainId,
    chainName: chainId === polygon.id ? "Polygon" : chainId === base.id ? "Base" : "Unknown",
    isCorrectChain,
    error,
    
    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchToPolygon,
    switchToBase,
    switchNetwork: handleSwitchNetwork,
  };
};

// Hook for GTT token balance (Polygon-specific)
export const useGTTBalance = () => {
  const { address, isConnected, chainId } = useWallet();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address || chainId !== polygon.id) {
      setBalance("0");
      return;
    }

    const fetchGTTBalance = async () => {
      setIsLoading(true);
      try {
        // Replace with actual GTT contract address
        const GTT_CONTRACT_ADDRESS = import.meta.env.VITE_GTT_CONTRACT_ADDRESS;
        
        if (!GTT_CONTRACT_ADDRESS) {
          console.warn("GTT contract address not configured");
          return;
        }

        // Implement actual ERC-20 balance fetching here
        // This is a placeholder implementation
        const response = await fetch(`/api/token/balance/${address}`);
        const data = await response.json();
        setBalance(data.balance || "0");
      } catch (error) {
        console.error("Failed to fetch GTT balance:", error);
        setBalance("0");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGTTBalance();
  }, [address, isConnected, chainId]);

  return { balance, isLoading };
};

// Hook for wallet connection status with retry logic
export const useWalletConnection = () => {
  const wallet = useWallet();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const retryConnection = async () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      await wallet.connect();
    }
  };

  const resetRetry = () => {
    setRetryCount(0);
  };

  return {
    ...wallet,
    retryCount,
    maxRetries,
    canRetry: retryCount < maxRetries,
    retryConnection,
    resetRetry,
  };
};