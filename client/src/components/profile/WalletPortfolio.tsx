import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Send, 
  Download,
  Copy,
  ExternalLink,
  Coins,
  DollarSign
} from 'lucide-react';

interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  allocation: number;
  chainId: number;
  chainName: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake';
  asset: string;
  amount: number;
  usdValue: number;
  hash: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export default function WalletPortfolio() {
  const [selectedChain, setSelectedChain] = useState<number>(0); // 0 = All chains

  const walletAssets: WalletAsset[] = [
    {
      symbol: 'GTT',
      name: 'GuardianChain Token',
      balance: 12847.50,
      usdValue: 26209.10,
      change24h: 5.2,
      allocation: 68.5,
      chainId: 137,
      chainName: 'Polygon'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 2.847,
      usdValue: 8451.23,
      change24h: -2.1,
      allocation: 22.1,
      chainId: 1,
      chainName: 'Ethereum'
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      balance: 1250.00,
      usdValue: 1125.00,
      change24h: 3.8,
      allocation: 2.9,
      chainId: 137,
      chainName: 'Polygon'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 2500.00,
      usdValue: 2500.00,
      change24h: 0.0,
      allocation: 6.5,
      chainId: 137,
      chainName: 'Polygon'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'receive',
      asset: 'GTT',
      amount: 127.5,
      usdValue: 260.25,
      hash: '0xabc...def',
      timestamp: '2024-12-19T10:30:00Z',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'swap',
      asset: 'ETH → GTT',
      amount: 0.5,
      usdValue: 1485.50,
      hash: '0x123...456',
      timestamp: '2024-12-18T15:45:00Z',
      status: 'confirmed'
    },
    {
      id: '3',
      type: 'send',
      asset: 'USDC',
      amount: 500.00,
      usdValue: 500.00,
      hash: '0x789...abc',
      timestamp: '2024-12-17T09:20:00Z',
      status: 'confirmed'
    },
    {
      id: '4',
      type: 'stake',
      asset: 'GTT',
      amount: 1000.00,
      usdValue: 2040.00,
      hash: '0xdef...789',
      timestamp: '2024-12-16T14:15:00Z',
      status: 'confirmed'
    }
  ];

  const totalUsdValue = walletAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalChange24h = walletAssets.reduce((sum, asset) => sum + (asset.usdValue * asset.change24h / 100), 0);
  const totalChangePercent = (totalChange24h / totalUsdValue) * 100;

  const filteredAssets = selectedChain === 0 
    ? walletAssets 
    : walletAssets.filter(asset => asset.chainId === selectedChain);

  const getTransactionIcon = (type: string) => {
    const icons = {
      send: Send,
      receive: Download,
      swap: RefreshCw,
      stake: Coins
    };
    return icons[type as keyof typeof icons] || DollarSign;
  };

  const getTransactionColor = (type: string) => {
    const colors = {
      send: 'text-red-400',
      receive: 'text-green-400',
      swap: 'text-blue-400',
      stake: 'text-purple-400'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio Value</span>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-white">
                  ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center space-x-2 ${totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalChangePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {totalChangePercent >= 0 ? '+' : ''}${totalChange24h.toFixed(2)} ({totalChangePercent.toFixed(1)}%) 24h
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Assets: </span>
                  <span className="text-white">{walletAssets.length}</span>
                </div>
                
                <div>
                  <span className="text-slate-400">Chains: </span>
                  <span className="text-white">2</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Receive
              </Button>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Swap
              </Button>
              
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                <Coins className="w-4 h-4 mr-2" />
                Stake
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chain Filter */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400">Filter by chain:</span>
            
            <div className="flex space-x-2">
              <Button
                variant={selectedChain === 0 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChain(0)}
              >
                All Chains
              </Button>
              
              <Button
                variant={selectedChain === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChain(1)}
              >
                Ethereum
              </Button>
              
              <Button
                variant={selectedChain === 137 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChain(137)}
              >
                Polygon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <div key={`${asset.symbol}-${asset.chainId}`} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{asset.symbol.slice(0, 2)}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-white">{asset.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <span>{asset.balance.toLocaleString()} {asset.symbol}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {asset.chainName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-medium text-white">
                      ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`flex items-center justify-end space-x-1 text-sm ${
                      asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Portfolio Allocation</span>
                    <span className="text-white">{asset.allocation.toFixed(1)}%</span>
                  </div>
                  <Progress value={asset.allocation} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const TransactionIcon = getTransactionIcon(transaction.type);
              const transactionColor = getTransactionColor(transaction.type);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-slate-600 ${transactionColor}`}>
                      <TransactionIcon className="w-4 h-4" />
                    </div>
                    
                    <div>
                      <div className="font-medium text-white capitalize">{transaction.type}</div>
                      <div className="text-sm text-slate-400">{transaction.asset}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-white">
                      {transaction.type === 'send' ? '-' : '+'}{transaction.amount.toLocaleString()} {transaction.asset.split(' ')[0]}
                    </div>
                    <div className="text-sm text-slate-400">
                      ${transaction.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={`${
                      transaction.status === 'confirmed' ? 'bg-green-500' : 
                      transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {transaction.status}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.hash)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://polygonscan.com/tx/${transaction.hash}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}