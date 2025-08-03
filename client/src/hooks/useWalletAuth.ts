import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface WalletAuthState {
  isWalletConnected: boolean;
  isWalletAuthenticated: boolean;
  isConnecting: boolean;
  isAuthenticating: boolean;
  walletAddress?: string;
  error?: string;
}

export interface WalletAuthActions {
  connectAndAuthenticate: () => Promise<void>;
  authenticateWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

/**
 * Enhanced wallet authentication hook that combines wallet connection
 * with GuardianChain user authentication
 */
export const useWalletAuth = (): WalletAuthState & WalletAuthActions => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { user, linkWallet, isLinkingWallet } = useAuth();
  const { toast } = useToast();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string>();

  // Check if wallet is authenticated (linked to current user)
  const isWalletAuthenticated = Boolean(
    user?.walletAddress && 
    address && 
    user.walletAddress.toLowerCase() === address.toLowerCase()
  );

  /**
   * Generate authentication message for wallet signing
   */
  const generateAuthMessage = (walletAddress: string, nonce: string): string => {
    return `Welcome to GuardianChain!

Please sign this message to verify your wallet ownership.

Wallet: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This action will not incur any gas fees.`;
  };

  /**
   * Authenticate wallet by signing a message and linking to user account
   */
  const authenticateWallet = async (): Promise<void> => {
    if (!address || !isConnected) {
      throw new Error("Wallet not connected");
    }

    setIsAuthenticating(true);
    setError(undefined);

    try {
      // Generate nonce for security
      const nonce = Math.random().toString(36).substring(2, 15);
      const message = generateAuthMessage(address, nonce);

      // Request wallet signature
      const signature = await signMessageAsync({ message });

      // Verify signature and link wallet to user account
      const response = await fetch("/api/auth/verify-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          walletAddress: address,
          message,
          signature,
          nonce,
        }),
      });

      if (!response.ok) {
        throw new Error("Wallet verification failed");
      }

      // Link wallet to current user
      await linkWallet(address);

      toast({
        title: "Wallet Connected",
        description: `Successfully connected ${address.slice(0, 8)}...${address.slice(-6)}`,
      });

    } catch (error: any) {
      const errorMessage = error.message || "Failed to authenticate wallet";
      setError(errorMessage);
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Connect wallet and authenticate in one step
   */
  const connectAndAuthenticate = async (): Promise<void> => {
    setIsConnecting(true);
    setError(undefined);

    try {
      // If wallet not connected, user needs to connect first
      if (!isConnected) {
        toast({
          title: "Connect Wallet",
          description: "Please connect your wallet first, then authenticate",
        });
        return;
      }

      // Authenticate the connected wallet
      await authenticateWallet();
    } catch (error: any) {
      console.error("Connect and authenticate failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnect wallet and clear authentication
   */
  const disconnectWallet = (): void => {
    setError(undefined);
    setIsConnecting(false);
    setIsAuthenticating(false);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Enhanced session alignment - ensure authenticated user matches wallet address
  useEffect(() => {
    if (isConnected && address && user && !isWalletAuthenticated && !isAuthenticating) {
      // Auto-link wallet if user is authenticated but wallet isn't linked
      const autoLink = async () => {
        try {
          console.log("🔍 Session alignment check:", { 
            userAddress: user.walletAddress, 
            connectedAddress: address,
            isAuthenticated: !!user 
          });
          
          // Ensure session user matches wallet address
          if (user.walletAddress && user.walletAddress.toLowerCase() !== address.toLowerCase()) {
            console.warn("⚠️ Session/wallet mismatch detected, forcing re-authentication");
            // Force logout to prevent session confusion
            window.location.href = "/api/auth/signout";
            return;
          }
          
          await authenticateWallet();
        } catch (error) {
          console.warn("Auto wallet authentication failed:", error);
        }
      };

      autoLink();
    }
  }, [isConnected, address, user, isWalletAuthenticated]);

  // Clear error when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setError(undefined);
    }
  }, [isConnected]);

  return {
    // State
    isWalletConnected: isConnected,
    isWalletAuthenticated,
    isConnecting: isConnecting || isLinkingWallet,
    isAuthenticating,
    walletAddress: address,
    error,
    
    // Actions
    connectAndAuthenticate,
    authenticateWallet,
    disconnectWallet,
  };
};

/**
 * Hook for checking GTT token balance with enhanced chain support
 */
export const useEnhancedGTTBalance = () => {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setBalances({});
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        // Fetch GTT balances from multiple chains
        const response = await fetch(`/api/token/balances/${address}`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances || {});
        }
      } catch (error) {
        console.error("Failed to fetch GTT balances:", error);
        setBalances({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  return {
    balances,
    isLoading,
    totalBalance: Object.values(balances).reduce((sum, balance) => sum + parseFloat(balance || "0"), 0),
    polygonBalance: balances[137] || "0",
    baseBalance: balances[8453] || "0",
    ethereumBalance: balances[1] || "0",
  };
};