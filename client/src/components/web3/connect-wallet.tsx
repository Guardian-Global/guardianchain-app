import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { NETWORK_NAMES, isSupportedNetwork } from "@/lib/web3-config";
import {
  Wallet,
  LogOut,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface ConnectWalletProps {
  onConnect?: (address: string, chainId: number) => void;
  onDisconnect?: () => void;
  showNetworkInfo?: boolean;
}

export default function ConnectWallet({
  onConnect,
  onDisconnect,
  showNetworkInfo = true,
}: ConnectWalletProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true);
      await connect({ connector });

      if (address && chainId) {
        onConnect?.(address, chainId);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${
            NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] ||
            "Unknown Network"
          }`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleSwitchNetwork = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
      toast({
        title: "Network Switched",
        description: `Switched to ${
          NETWORK_NAMES[targetChainId as keyof typeof NETWORK_NAMES]
        }`,
      });
    } catch (error: any) {
      toast({
        title: "Network Switch Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const currentNetworkName = chainId
    ? NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES]
    : "Unknown";
  const isUnsupportedNetwork = chainId ? !isSupportedNetwork(chainId) : false;

  if (isConnected && address) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Address */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Address:</span>
            <code className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">
              {formatAddress(address)}
            </code>
          </div>

          {/* Network Info */}
          {showNetworkInfo && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Network:</span>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    isUnsupportedNetwork ? "bg-red-600" : "bg-green-600"
                  }
                >
                  {currentNetworkName}
                </Badge>
                {isUnsupportedNetwork && (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                )}
              </div>
            </div>
          )}

          {/* Network Warning */}
          {isUnsupportedNetwork && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="h-4 w-4" />
                Unsupported Network
              </div>
              <p className="text-xs text-red-300 mt-1">
                Please switch to Ethereum, Polygon, or their testnets to use
                GuardianChain features.
              </p>
            </div>
          )}

          {/* Quick Network Switches */}
          {!isUnsupportedNetwork && (
            <div className="flex gap-2 flex-wrap">
              {Object.entries(NETWORK_NAMES).map(([id, name]) => {
                const networkId = parseInt(id);
                const isCurrent = chainId === networkId;
                return (
                  <Button
                    key={id}
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    onClick={() => !isCurrent && handleSwitchNetwork(networkId)}
                    disabled={isCurrent}
                    className="text-xs"
                  >
                    {name}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(`https://etherscan.io/address/${address}`, "_blank")
              }
              className="flex-1"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View on Explorer
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              className="flex-1"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wallet className="h-4 w-4 text-blue-400" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-400">
          Connect your wallet to claim GTT yield rewards and interact with the
          TruthVault.
        </p>

        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={isPending || isConnecting}
              className="w-full justify-start"
              variant="outline"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : `Connect ${connector.name}`}
            </Button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          <p>Supported networks: Ethereum, Polygon, and their testnets</p>
          <p>Make sure you have some ETH or MATIC for gas fees</p>
        </div>
      </CardContent>
    </Card>
  );
}
