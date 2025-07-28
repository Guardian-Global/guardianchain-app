import { toast } from "@/hooks/use-toast";

export interface WalletInfo {
  address: string;
  chainId: number;
  balance?: string;
}

export class WalletManager {
  private static instance: WalletManager;
  private walletInfo: WalletInfo | null = null;

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  async connectMetaMask(): Promise<WalletInfo | null> {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet",
          variant: "destructive",
        });
        return null;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        toast({
          title: "Connection Rejected",
          description: "Please approve the connection in MetaMask",
          variant: "destructive",
        });
        return null;
      }

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      // Get balance
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      this.walletInfo = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: this.formatBalance(balance),
      };

      // Set up event listeners
      this.setupEventListeners();

      toast({
        title: "Wallet Connected",
        description: `Connected to ${this.walletInfo.address.slice(
          0,
          6
        )}...${this.walletInfo.address.slice(-4)}`,
      });

      return this.walletInfo;
    } catch (error: any) {
      console.error("MetaMask connection error:", error);

      if (error.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "You rejected the connection request",
          variant: "destructive",
        });
      } else if (error.code === -32002) {
        toast({
          title: "Already Connecting",
          description:
            "Please check MetaMask - connection request is already pending",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect to MetaMask",
          variant: "destructive",
        });
      }

      return null;
    }
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        return await this.addNetwork(chainId);
      }
      console.error("Network switch error:", error);
      return false;
    }
  }

  async addNetwork(chainId: number): Promise<boolean> {
    const networks = {
      1: {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://eth-mainnet.public.blastapi.io"],
        blockExplorerUrls: ["https://etherscan.io"],
      },
      137: {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"],
      },
      80001: {
        chainId: "0x13881",
        chainName: "Polygon Mumbai",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com"],
      },
    };

    const network = networks[chainId as keyof typeof networks];
    if (!network) {
      toast({
        title: "Unsupported Network",
        description: `Network ${chainId} is not supported`,
        variant: "destructive",
      });
      return false;
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [network],
      });
      return true;
    } catch (error) {
      console.error("Add network error:", error);
      return false;
    }
  }

  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Account change handler
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.walletInfo = { ...this.walletInfo!, address: accounts[0] };
        toast({
          title: "Account Changed",
          description: `Switched to ${accounts[0].slice(
            0,
            6
          )}...${accounts[0].slice(-4)}`,
        });
      }
    });

    // Chain change handler
    window.ethereum.on("chainChanged", (chainId: string) => {
      this.walletInfo = { ...this.walletInfo!, chainId: parseInt(chainId, 16) };
      toast({
        title: "Network Changed",
        description: `Switched to network ${parseInt(chainId, 16)}`,
      });
    });
  }

  private formatBalance(balance: string): string {
    const eth = parseInt(balance, 16) / Math.pow(10, 18);
    return eth.toFixed(4);
  }

  disconnect(): void {
    this.walletInfo = null;
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }

  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  isConnected(): boolean {
    return this.walletInfo !== null;
  }

  async signMessage(message: string): Promise<string | null> {
    if (!this.walletInfo) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return null;
    }

    try {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, this.walletInfo.address],
      });
      return signature;
    } catch (error) {
      console.error("Sign message error:", error);
      toast({
        title: "Signature Failed",
        description: "Failed to sign message",
        variant: "destructive",
      });
      return null;
    }
  }
}

// Global wallet manager instance
export const walletManager = WalletManager.getInstance();

// Window ethereum type declaration
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        handler: (...args: any[]) => void
      ) => void;
      isMetaMask?: boolean;
    };
  }
}
