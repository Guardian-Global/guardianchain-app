import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/hooks/useWallet";
import { useWalletAuth, useEnhancedGTTBalance } from "@/hooks/useWalletAuth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Copy,
  TrendingUp,
  Network,
  DollarSign
} from "lucide-react";

interface EnhancedWalletConnectProps {
  showBalance?: boolean;
  showNetworkInfo?: boolean;
  compact?: boolean;
}

export default function EnhancedWalletConnect({ 
  showBalance = true, 
  showNetworkInfo = true,
  compact = false 
}: EnhancedWalletConnectProps) {
  const { user } = useAuth();
  const { 
    address, 
    isConnected, 
    chainName, 
    chainId, 
    isCorrectChain,
    connect: connectWallet, 
    disconnect, 
    switchToPolygon, 
    switchToBase 
  } = useWallet();
  
  const {
    isWalletAuthenticated,
    isConnecting,
    isAuthenticating,
    authenticateWallet,
    connectAndAuthenticate,
    error: authError
  } = useWalletAuth();

  const { balances, totalBalance, isLoading: balanceLoading } = useEnhancedGTTBalance();
  const { toast } = useToast();
  const [showFullAddress, setShowFullAddress] = useState(false);

  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const formatAddress = (addr: string) => {
    if (showFullAddress) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getStatusColor = () => {
    if (!isConnected) return "text-gray-500";
    if (isWalletAuthenticated) return "text-green-600";
    if (isConnected) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = () => {
    if (isConnecting || isAuthenticating) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!isConnected) return <Wallet className="w-4 h-4" />;
    if (isWalletAuthenticated) return <CheckCircle className="w-4 h-4" />;
    if (isConnected) return <AlertCircle className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (isAuthenticating) return "Authenticating...";
    if (!isConnected) return "Not Connected";
    if (isWalletAuthenticated) return "Authenticated";
    if (isConnected) return "Connected (Not Authenticated)";
    return "Disconnected";
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isConnected && isWalletAuthenticated ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              {formatAddress(address!)}
            </Badge>
            <Button variant="ghost" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            onClick={connectAndAuthenticate} 
            disabled={isConnecting || isAuthenticating}
            size="sm"
          >
            {isConnecting || isAuthenticating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Connect Wallet
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          Wallet Connection
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        {isConnected && address ? (
          <div className="space-y-3">
            {/* Wallet Address */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Address:</span>
                <code 
                  className="text-sm cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setShowFullAddress(!showFullAddress)}
                >
                  {formatAddress(address)}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open(`https://polygonscan.com/address/${address}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Network Information */}
            {showNetworkInfo && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={isCorrectChain ? "default" : "destructive"}>
                      <Network className="w-3 h-3 mr-1" />
                      {chainName}
                    </Badge>
                    {!isCorrectChain && (
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={switchToPolygon}>
                          Polygon
                        </Button>
                        <Button variant="outline" size="sm" onClick={switchToBase}>
                          Base
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm font-medium">Authentication:</span>
              <div className="flex items-center gap-2">
                {isWalletAuthenticated ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={authenticateWallet}
                    disabled={isAuthenticating || !user}
                  >
                    {isAuthenticating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Authenticate
                  </Button>
                )}
              </div>
            </div>

            {/* GTT Balances */}
            {showBalance && isWalletAuthenticated && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">GTT Token Balances</span>
                    {balanceLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(balances).map(([chainId, balance]) => {
                      const chain = chainId === "137" ? "Polygon" : chainId === "8453" ? "Base" : "Ethereum";
                      const icon = chainId === "137" ? "🔷" : chainId === "8453" ? "🔵" : "⚡";
                      
                      return (
                        <div key={chainId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center gap-2">
                            <span>{icon}</span>
                            <span className="text-sm">{chain}</span>
                          </div>
                          <span className="font-mono text-sm">{balance} GTT</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-medium">Total Balance:</span>
                    <span className="font-mono text-lg font-bold text-blue-600">
                      {totalBalance.toFixed(2)} GTT
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Error Display */}
            {authError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{authError}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={disconnect}
                className="flex-1"
              >
                Disconnect
              </Button>
              {!isWalletAuthenticated && user && (
                <Button 
                  onClick={authenticateWallet}
                  disabled={isAuthenticating}
                  className="flex-1"
                >
                  {isAuthenticating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Authenticate
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Not Connected */
          <div className="text-center space-y-4">
            <div className="p-6">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-2">
                No Wallet Connected
              </h3>
              <p className="text-sm text-gray-500">
                Connect your wallet to access multi-chain features
              </p>
            </div>
            
            <Button 
              onClick={connectAndAuthenticate} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              Connect Wallet
            </Button>
            
            <p className="text-xs text-gray-500">
              Supports MetaMask, Coinbase Wallet, and other Web3 wallets
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}