import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGTTBalance, getGTTContractInfo } from "@/lib/gtt";
import { Coins, RefreshCw, TrendingUp } from "lucide-react";

interface GTTBalanceWidgetProps {
  walletAddress?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function GTTBalanceWidget({
  walletAddress = "0x1234567890123456789012345678901234567890",
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: GTTBalanceWidgetProps) {
  const [balance, setBalance] = useState<string>("0");
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [balanceResult, contractResult] = await Promise.all([
        getGTTBalance(walletAddress),
        getGTTContractInfo(),
      ]);

      setBalance(balanceResult);
      setContractInfo(contractResult);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("❌ Failed to fetch GTT data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [walletAddress, autoRefresh, refreshInterval]);

  const formatBalance = (bal: string): string => {
    const num = parseFloat(bal);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Coins className="h-5 w-5 text-green-400" />
            GTT Balance
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {formatBalance(balance)} GTT
          </div>
          <div className="text-sm text-slate-400">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>

        {/* Contract Info */}
        {contractInfo && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400">Network</div>
              <Badge
                variant="outline"
                className="text-purple-400 border-purple-400"
              >
                {contractInfo.network || "Polygon"}
              </Badge>
            </div>
            <div>
              <div className="text-slate-400">Status</div>
              <Badge
                variant="outline"
                className={
                  contractInfo.status === "connected"
                    ? "text-green-400 border-green-400"
                    : "text-yellow-400 border-yellow-400"
                }
              >
                {contractInfo.status || "Development"}
              </Badge>
            </div>
          </div>
        )}

        {/* Total Supply */}
        {contractInfo && (
          <div className="pt-2 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Supply</span>
              <span className="text-white flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                {formatBalance(contractInfo.totalSupply || "1000000000")} GTT
              </span>
            </div>
          </div>
        )}

        {/* Last Update */}
        {lastUpdate && (
          <div className="text-xs text-slate-500 text-center">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
