import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft,
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  allocation: number;
  logo?: string;
}

export function WalletPortfolio() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock portfolio data - in production, connect to real wallet APIs
  const portfolio: Asset[] = [
    {
      symbol: 'GTT',
      name: 'GuardianChain Token',
      balance: 12847.50,
      value: 25695.00,
      change24h: 8.7,
      allocation: 65.2,
      logo: '🛡️'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 3.247,
      value: 7842.30,
      change24h: -2.1,
      allocation: 19.9,
      logo: '⟠'
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      balance: 2847.80,
      value: 3421.36,
      change24h: 5.3,
      allocation: 8.7,
      logo: '🔷'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 2000.00,
      value: 2000.00,
      change24h: 0.0,
      allocation: 5.1,
      logo: '💲'
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      balance: 89.4,
      value: 1341.60,
      change24h: 12.4,
      allocation: 3.4,
      logo: '🔗'
    }
  ];

  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange24h = portfolio.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
  const totalChangePercent = (totalChange24h / totalValue) * 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const copyAddress = (symbol: string) => {
    // Mock wallet address
    const address = `0x${Math.random().toString(16).substr(2, 40)}`;
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-400" />
              Wallet Portfolio
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white mb-2">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center justify-center text-lg ${
              totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalChangePercent >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {totalChangePercent >= 0 ? '+' : ''}
              {totalChangePercent.toFixed(2)}% (24h)
            </div>
          </div>

          <div className="space-y-4">
            {portfolio.map((asset) => (
              <div key={asset.symbol} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{asset.logo}</div>
                    <div>
                      <div className="font-medium text-white">{asset.symbol}</div>
                      <div className="text-sm text-slate-400">{asset.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-white">
                      ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-sm flex items-center ${
                      asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.change24h >= 0 ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3 mr-1" />
                      )}
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-slate-400">Balance: </span>
                    <span className="text-white">{asset.balance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Allocation: </span>
                    <span className="text-white">{asset.allocation.toFixed(1)}%</span>
                  </div>
                </div>
                
                <Progress value={asset.allocation} className="h-2 mb-3" />
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => copyAddress(asset.symbol)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Address
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Explorer
                  </Button>
                  {asset.symbol === 'GTT' && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Trade
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Actions */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-green-600 hover:bg-green-700 flex flex-col items-center py-6">
              <ArrowUpRight className="w-6 h-6 mb-2" />
              <span>Buy GTT</span>
            </Button>
            
            <Button className="bg-red-600 hover:bg-red-700 flex flex-col items-center py-6">
              <ArrowDownLeft className="w-6 h-6 mb-2" />
              <span>Sell GTT</span>
            </Button>
            
            <Button className="bg-blue-600 hover:bg-blue-700 flex flex-col items-center py-6">
              <RefreshCw className="w-6 h-6 mb-2" />
              <span>Swap</span>
            </Button>
            
            <Button className="bg-purple-600 hover:bg-purple-700 flex flex-col items-center py-6">
              <Wallet className="w-6 h-6 mb-2" />
              <span>Connect</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">+23.7%</div>
              <div className="text-sm text-slate-400">7-Day Return</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">+187.3%</div>
              <div className="text-sm text-slate-400">30-Day Return</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">+1,247%</div>
              <div className="text-sm text-slate-400">All-Time Return</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">GTT</div>
              <div className="text-sm text-slate-400">Best Performer</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}