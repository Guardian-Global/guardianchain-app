// Safe Web3 provider that handles MetaMask connection failures gracefully
export class SafeWeb3Provider {
  private static instance: SafeWeb3Provider;
  private isInitialized = false;
  private connectionState = "disconnected"; // 'disconnected' | 'connecting' | 'connected' | 'error'

  static getInstance(): SafeWeb3Provider {
    if (!SafeWeb3Provider.instance) {
      SafeWeb3Provider.instance = new SafeWeb3Provider();
    }
    return SafeWeb3Provider.instance;
  }

  // Check if MetaMask is available without triggering connection
  isMetaMaskAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined" &&
      window.ethereum.isMetaMask
    );
  }

  // Safe initialization that won't throw errors
  async safeInit(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!this.isMetaMaskAvailable()) {
        console.log("MetaMask not detected - continuing without Web3");
        this.connectionState = "error";
        this.isInitialized = true;
        return;
      }

      // Don't auto-connect, just set up listeners
      this.setupEventListeners();
      this.isInitialized = true;
      console.log("Web3 provider initialized safely");
    } catch (error) {
      console.warn("Web3 initialization failed:", error);
      this.connectionState = "error";
      this.isInitialized = true;
    }
  }

  // Optional manual connection (user-triggered only)
  async connectWallet(): Promise<{
    success: boolean;
    address?: string;
    error?: string;
  }> {
    if (!this.isMetaMaskAvailable()) {
      return {
        success: false,
        error:
          "MetaMask not installed. Please install MetaMask to connect your wallet.",
      };
    }

    this.connectionState = "connecting";

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        this.connectionState = "connected";
        return {
          success: true,
          address: accounts[0],
        };
      } else {
        this.connectionState = "disconnected";
        return {
          success: false,
          error: "No accounts found",
        };
      }
    } catch (error: any) {
      this.connectionState = "error";

      if (error.code === 4001) {
        return {
          success: false,
          error: "Connection rejected by user",
        };
      }

      return {
        success: false,
        error: error.message || "Failed to connect to MetaMask",
      };
    }
  }

  // Get current connection status without triggering connection
  getConnectionState(): string {
    return this.connectionState;
  }

  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Listen for account changes
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        this.connectionState = "disconnected";
      }
    });

    // Listen for network changes
    window.ethereum.on("chainChanged", () => {
      // Network changed, might need to reconnect
      console.log("Network changed");
    });
  }
}

export const safeWeb3Provider = SafeWeb3Provider.getInstance();
