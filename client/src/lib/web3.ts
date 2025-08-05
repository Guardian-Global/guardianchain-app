import { ethers } from "ethers";
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK } from "./contracts";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletConnection {
  success: boolean;
  account?: string;
  error?: string;
}

export const isMetaMaskInstalled = (): boolean => {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
};

export const connectWallet = async (): Promise<WalletConnection> => {
  // Check if we're in a browser extension-accessible context
  if (typeof window === "undefined") {
    return {
      success: false,
      error: "Not running in a browser environment.",
    };
  }

  // Check if we're in an iframe (Replit preview)
  try {
    if (window.parent !== window) {
      return {
        success: false,
        error: "MetaMask not accessible in preview mode. Please open the app in a new tab to connect your wallet.",
      };
    }
  } catch (e) {
    // Cross-origin iframe
    return {
      success: false,
      error: "Please open the app in a new browser tab to access MetaMask.",
    };
  }

  if (!isMetaMaskInstalled()) {
    return {
      success: false,
      error: "MetaMask is not installed. Please install MetaMask browser extension and try again.",
    };
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      return {
        success: false,
        error: "No accounts found. Please connect your wallet.",
      };
    }

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const currentNetwork = SUPPORTED_NETWORKS.find(
      (network: any) => network.chainId === chainId,
    );

    if (!currentNetwork) {
      // Try to switch to the default network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: DEFAULT_NETWORK.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Network not added to MetaMask, add it
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [DEFAULT_NETWORK],
            });
          } catch (addError) {
            return {
              success: false,
              error: "Failed to add network to MetaMask.",
            };
          }
        } else {
          return {
            success: false,
            error: "Failed to switch to the correct network.",
          };
        }
      }
    }

    return {
      success: true,
      account: accounts[0],
    };
  } catch (error: any) {
    if (error.code === 4001) {
      return {
        success: false,
        error: "Connection rejected by user.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to connect wallet.",
    };
  }
};

export const disconnectWallet = async (): Promise<void> => {
  // MetaMask doesn't have a programmatic disconnect method
  // We just clear our local state
  if (typeof window !== "undefined") {
    // Clear any cached connection data
    localStorage.removeItem("wallet-connected");
  }
};

export const getAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting account:", error);
    return null;
  }
};

export const getBalance = async (address: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
};

export const getNetwork = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const network = SUPPORTED_NETWORKS.find(
      (net: any) => net.chainId === chainId,
    );
    return network?.chainName || "Unknown Network";
  } catch (error) {
    console.error("Error getting network:", error);
    throw error;
  }
};

export const switchNetwork = async (chainId: string): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Network not added, try to add it
      const network = SUPPORTED_NETWORKS.find(
        (net: any) => net.chainId === chainId,
      );
      if (network) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
          return true;
        } catch (addError) {
          console.error("Error adding network:", addError);
          return false;
        }
      }
    }
    console.error("Error switching network:", error);
    return false;
  }
};

// Event listeners for wallet events
export const setupWalletEventListeners = (
  onAccountChange: (accounts: string[]) => void,
  onChainChange: (chainId: string) => void,
  onConnect: (connectInfo: { chainId: string }) => void,
  onDisconnect: (error: { code: number; message: string }) => void,
) => {
  if (!isMetaMaskInstalled()) {
    return;
  }

  window.ethereum.on("accountsChanged", onAccountChange);
  window.ethereum.on("chainChanged", onChainChange);
  window.ethereum.on("connect", onConnect);
  window.ethereum.on("disconnect", onDisconnect);
};

export const removeWalletEventListeners = () => {
  if (!isMetaMaskInstalled()) {
    return;
  }

  window.ethereum.removeAllListeners("accountsChanged");
  window.ethereum.removeAllListeners("chainChanged");
  window.ethereum.removeAllListeners("connect");
  window.ethereum.removeAllListeners("disconnect");
};
