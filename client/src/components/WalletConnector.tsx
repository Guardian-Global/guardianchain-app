import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { walletManager, type WalletInfo } from "@/lib/wallet";

const WalletConnector: React.FC = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected
    const existingWallet = walletManager.getWalletInfo();
    if (existingWallet) {
      setWalletInfo(existingWallet);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const wallet = await walletManager.connectMetaMask();
      setWalletInfo(wallet);
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletManager.disconnect();
    setWalletInfo(null);
  };

  const copyAddress = async () => {
    if (walletInfo?.address) {
      await navigator.clipboard.writeText(walletInfo.address);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNetworkName = (chainId: number): string => {
    const networks: { [key: number]: string } = {
      1: "Ethereum",
      137: "Polygon",
      80001: "Mumbai",
      31337: "Hardhat",
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  const getNetworkColor = (chainId: number): string => {
    const colors: { [key: number]: string } = {
      1: "bg-blue-600",
      137: "bg-purple-600",
      80001: "bg-orange-600",
      31337: "bg-gray-600",
    };
    return colors[chainId] || "bg-gray-600";
  };

  if (!walletInfo) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-blue-400" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">
              Connect your Web3 wallet to access premium GUARDIANCHAIN features
            </p>

            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isConnecting ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Connecting...
                </div>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect MetaMask
                </>
              )}
            </Button>

            {typeof window !== "undefined" &&
              typeof window.ethereum === "undefined" && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                    <div>
                      <div className="text-yellow-400 font-semibold">
                        MetaMask Required
                      </div>
                      <div className="text-slate-300 text-sm">
                        Install MetaMask to connect your wallet
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() =>
                      window.open("https://metamask.io/download/", "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Install MetaMask
                  </Button>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-green-400" />
            Wallet Connected
          </div>
          <Badge className="bg-green-600">Connected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Address</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 px-2"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
            <div className="text-white font-mono text-sm">
              {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-xs mb-1">Network</div>
              <Badge className={getNetworkColor(walletInfo.chainId)}>
                {getNetworkName(walletInfo.chainId)}
              </Badge>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-slate-400 text-xs mb-1">Balance</div>
              <div className="text-white font-semibold text-sm">
                {walletInfo.balance} ETH
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                window.open(
                  `https://etherscan.io/address/${walletInfo.address}`,
                  "_blank",
                )
              }
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Explorer
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              className="flex-1"
            >
              Disconnect
            </Button>
          </div>

          <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-green-400 mr-2" />
              <div>
                <div className="text-green-400 font-semibold text-sm">
                  Enterprise Access
                </div>
                <div className="text-slate-300 text-xs">
                  Wallet connected - premium features unlocked
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnector;
