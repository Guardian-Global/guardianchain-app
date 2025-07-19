import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Send, 
  Download, 
  Shuffle, 
  BarChart3,
  PieChart,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface CapsuleInvestment {
  id: string;
  title: string;
  originalInvestment: number;
  purchaseDate: string;
  currentValue: number;
  projectedYield: number;
  lifetimeValue: number;
  status: 'active' | 'matured' | 'pending';
}

interface GTTPortfolioManagerProps {
  balance: number;
  yield: number;
  investments: CapsuleInvestment[];
}

export function GTTPortfolioManager({ balance, yield: totalYield, investments }: GTTPortfolioManagerProps) {
  const [activeAction, setActiveAction] = useState<'buy' | 'sell' | 'airdrop' | 'trade' | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const totalInvested = investments.reduce((sum, inv) => sum + inv.originalInvestment, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProjected = investments.reduce((sum, inv) => sum + inv.projectedYield, 0);
  const portfolioGain = totalCurrent - totalInvested;
  const portfolioGainPercent = totalInvested > 0 ? (portfolioGain / totalInvested) * 100 : 0;

  const recentTransactions = [
    { type: 'buy', amount: 500, capsule: 'Climate Data Verification', time: '2 hours ago' },
    { type: 'yield', amount: 127.5, capsule: 'Legal Documents', time: '1 day ago' },
    { type: 'airdrop', amount: 250, recipient: 'environmental_org', time: '3 days ago' },
    { type: 'trade', amount: 1000, pair: 'GTT/ETH', time: '1 week ago' }
  ];

  const handleAction = (action: 'buy' | 'sell' | 'airdrop' | 'trade') => {
    setActiveAction(action);
    setAmount('');
    setRecipient('');
  };

  const executeAction = () => {
    console.log(`Executing ${activeAction} with amount: ${amount}, recipient: ${recipient}`);
    // Here you would implement the actual transaction logic
    setActiveAction(null);
    setAmount('');
    setRecipient('');
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="w-5 h-5 mr-2 text-amber-400" />
            GTT Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{balance.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Available GTT</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{totalYield.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Yield</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{totalCurrent.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Current Value</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${portfolioGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioGain >= 0 ? '+' : ''}{portfolioGain.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">
                {portfolioGainPercent >= 0 ? '+' : ''}{portfolioGainPercent.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Button 
              onClick={() => handleAction('buy')}
              className="bg-green-600 hover:bg-green-700 flex flex-col items-center py-4"
            >
              <Download className="w-5 h-5 mb-1" />
              Buy GTT
            </Button>
            
            <Button 
              onClick={() => handleAction('sell')}
              className="bg-red-600 hover:bg-red-700 flex flex-col items-center py-4"
            >
              <Send className="w-5 h-5 mb-1" />
              Sell GTT
            </Button>
            
            <Button 
              onClick={() => handleAction('airdrop')}
              className="bg-blue-600 hover:bg-blue-700 flex flex-col items-center py-4"
            >
              <Zap className="w-5 h-5 mb-1" />
              Airdrop
            </Button>
            
            <Button 
              onClick={() => handleAction('trade')}
              className="bg-purple-600 hover:bg-purple-700 flex flex-col items-center py-4"
            >
              <Shuffle className="w-5 h-5 mb-1" />
              Trade
            </Button>
          </div>

          {/* Action Form */}
          {activeAction && (
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="font-medium mb-4 capitalize">{activeAction} GTT</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Amount (GTT)</label>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-slate-600 border-slate-500"
                  />
                </div>
                
                {(activeAction === 'airdrop' || activeAction === 'trade') && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      {activeAction === 'airdrop' ? 'Recipient Address' : 'Trading Pair'}
                    </label>
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={activeAction === 'airdrop' ? '0x...' : 'GTT/ETH'}
                      className="bg-slate-600 border-slate-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setActiveAction(null)}>
                  Cancel
                </Button>
                <Button onClick={executeAction} disabled={!amount}>
                  Execute {activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="investments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="investments">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Capsule Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{investment.title}</h4>
                        <p className="text-sm text-slate-400">
                          Purchased {new Date(investment.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Original Investment</div>
                        <div className="font-medium">{investment.originalInvestment} GTT</div>
                      </div>
                      
                      <div>
                        <div className="text-slate-400">Current Value</div>
                        <div className="font-medium text-green-400">{investment.currentValue} GTT</div>
                      </div>
                      
                      <div>
                        <div className="text-slate-400">Projected Yield</div>
                        <div className="font-medium text-blue-400">{investment.projectedYield} GTT</div>
                      </div>
                      
                      <div>
                        <div className="text-slate-400">Lifetime Value</div>
                        <div className="font-medium text-purple-400">{investment.lifetimeValue} GTT</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress to Projected Yield</span>
                        <span>{Math.round((investment.currentValue / investment.projectedYield) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((investment.currentValue / investment.projectedYield) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Increase Investment
                      </Button>
                      {investment.status === 'matured' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Claim Yield
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'buy' ? 'bg-green-600' :
                        tx.type === 'yield' ? 'bg-blue-600' :
                        tx.type === 'airdrop' ? 'bg-purple-600' : 'bg-amber-600'
                      }`}>
                        {tx.type === 'buy' && <Download className="w-4 h-4" />}
                        {tx.type === 'yield' && <TrendingUp className="w-4 h-4" />}
                        {tx.type === 'airdrop' && <Zap className="w-4 h-4" />}
                        {tx.type === 'trade' && <Shuffle className="w-4 h-4" />}
                      </div>
                      
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-slate-400">
                          {tx.type === 'trade' ? tx.pair : tx.capsule || tx.recipient}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-medium ${
                        tx.type === 'buy' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'buy' ? '-' : '+'}{tx.amount} GTT
                      </div>
                      <div className="text-sm text-slate-400">{tx.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total ROI</span>
                    <span className={`font-bold ${portfolioGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {portfolioGainPercent >= 0 ? '+' : ''}{portfolioGainPercent.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Best Performing</span>
                    <span className="text-green-400">Climate Data (+64.7%)</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Average Yield Rate</span>
                    <span className="text-blue-400">8.3% APY</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Risk Score</span>
                    <Badge variant="outline" className="text-green-400">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-amber-400" />
                  Asset Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Liquid GTT</span>
                    <span className="font-medium">{((balance / (balance + totalCurrent)) * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Active Investments</span>
                    <span className="font-medium">{((totalCurrent / (balance + totalCurrent)) * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Investment Breakdown:</div>
                    {investments.map((inv, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{inv.title.slice(0, 20)}...</span>
                        <span>{((inv.currentValue / totalCurrent) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}