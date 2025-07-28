import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletState {
  address: string | null;
  balance: string | null;
  network: string | null;
  isConnected: boolean;
}

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    network: null,
    isConnected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          await updateWalletState(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const updateWalletState = async (address: string) => {
    try {
      const ethereum = (window as any).ethereum;
      const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      const network = await ethereum.request({
        method: "eth_chainId",
      });

      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(
        4
      );

      setWallet({
        address,
        balance: balanceInEth,
        network: getNetworkName(network),
        isConnected: true,
      });
    } catch (error) {
      console.error("Error updating wallet state:", error);
    }
  };

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      "0x1": "Ethereum",
      "0x89": "Polygon",
      "0xa4b1": "Arbitrum",
      "0xaa36a7": "Sepolia",
      "0x13881": "Mumbai",
    };
    return networks[chainId] || "Unknown Network";
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        await updateWalletState(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(
            0,
            6
          )}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: null,
      network: null,
      isConnected: false,
    });
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openInExplorer = () => {
    if (wallet.address) {
      const baseUrl =
        wallet.network === "Polygon"
          ? "https://polygonscan.com/address/"
          : "https://etherscan.io/address/";
      window.open(`${baseUrl}${wallet.address}`, "_blank");
    }
  };

  if (!wallet.isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="gradient-primary hover:from-primary/90 hover:to-secondary/90"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-600 hover:border-slate-400"
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </span>
          <span className="sm:hidden">Wallet</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <div className="px-3 py-2">
          <div className="text-sm font-medium">Connected Wallet</div>
          <div className="text-xs text-slate-400 mt-1">
            {wallet.network} • {wallet.balance} ETH
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openInExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="cursor-pointer text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WalletConnect;
