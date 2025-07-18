import { useAccount, useChainId } from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { NETWORK_NAMES, isSupportedNetwork } from '@/lib/web3-config';

export default function NetworkIndicator() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">Not Connected</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isSupported = isSupportedNetwork(chainId);
  const networkName = NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] || 'Unknown Network';

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {isSupported ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          )}
          <span className="text-white text-sm font-medium">Network:</span>
          <Badge 
            variant={isSupported ? "default" : "destructive"}
            className={isSupported ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}
          >
            {networkName} ({chainId})
          </Badge>
        </div>
        {!isSupported && (
          <div className="mt-2 text-xs text-yellow-400">
            Switch to Hardhat Local (31337), Sepolia, Polygon, or Polygon Amoy for full functionality
          </div>
        )}
      </CardContent>
    </Card>
  );
}