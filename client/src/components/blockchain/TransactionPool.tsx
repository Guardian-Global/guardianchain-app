import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Coins, Shield, Users, Zap, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'mint' | 'verify' | 'stake' | 'reward';
  fee: number;
  timestamp: number;
  status: 'pending' | 'mining' | 'confirmed';
  priority: 'low' | 'medium' | 'high';
}

interface TransactionPoolProps {
  onTransactionUpdate: (transactions: Transaction[]) => void;
}

export default function TransactionPool({ onTransactionUpdate }: TransactionPoolProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const transactionTypes = [
    { type: 'transfer' as const, name: 'GTT Transfer', icon: Send, color: 'blue' },
    { type: 'mint' as const, name: 'Token Mint', icon: Coins, color: 'yellow' },
    { type: 'verify' as const, name: 'Truth Verify', icon: Shield, color: 'green' },
    { type: 'stake' as const, name: 'Vault Stake', icon: Users, color: 'purple' },
    { type: 'reward' as const, name: 'Guardian Reward', icon: Zap, color: 'orange' }
  ];

  useEffect(() => {
    // Initialize with some sample transactions
    generateInitialTransactions();
  }, []);

  useEffect(() => {
    onTransactionUpdate(transactions);
  }, [transactions, onTransactionUpdate]);

  const generateInitialTransactions = () => {
    const initialTxs: Transaction[] = [
      {
        id: 'tx_001',
        from: '0x1234...5678',
        to: '0x9876...4321',
        amount: 100,
        type: 'transfer',
        fee: 0.5,
        timestamp: Date.now() - 30000,
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'tx_002', 
        from: 'Guardian Node',
        to: '0xabcd...efgh',
        amount: 50,
        type: 'mint',
        fee: 1.0,
        timestamp: Date.now() - 20000,
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'tx_003',
        from: '0x2468...1357',
        to: 'Truth Capsule #247',
        amount: 25,
        type: 'verify',
        fee: 0.75,
        timestamp: Date.now() - 10000,
        status: 'pending',
        priority: 'low'
      }
    ];
    setTransactions(initialTxs);
  };

  const generateRandomTransaction = (): Transaction => {
    const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const priorities: Transaction['priority'][] = ['low', 'medium', 'high'];
    
    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: `0x${Math.random().toString(16).substr(2, 8)}...`,
      to: txType.type === 'mint' ? `0x${Math.random().toString(16).substr(2, 8)}...` : 
          txType.type === 'verify' ? `Capsule #${Math.floor(Math.random() * 1000)}` :
          `0x${Math.random().toString(16).substr(2, 8)}...`,
      amount: Math.floor(Math.random() * 500) + 10,
      type: txType.type,
      fee: Math.round((Math.random() * 2 + 0.1) * 100) / 100,
      timestamp: Date.now(),
      status: 'pending',
      priority: priorities[Math.floor(Math.random() * priorities.length)]
    };
  };

  const addRandomTransaction = () => {
    const newTx = generateRandomTransaction();
    setTransactions(prev => [...prev, newTx]);
  };

  const generateBurst = async () => {
    setIsGenerating(true);
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newTx = generateRandomTransaction();
      setTransactions(prev => [...prev, newTx]);
    }
    setIsGenerating(false);
  };

  const clearPool = () => {
    setTransactions([]);
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === id ? { ...tx, status } : tx
      )
    );
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const getTransactionTypeInfo = (type: Transaction['type']) => {
    return transactionTypes.find(t => t.type === type) || transactionTypes[0];
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 border-yellow-500';
      case 'mining': return 'text-blue-400 border-blue-500';
      case 'confirmed': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getPriorityColor = (priority: Transaction['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.fee - a.fee; // Higher fee = higher priority
  });

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Transaction Mempool</h3>
          <p className="text-sm text-slate-400">
            {transactions.length} pending transactions • 
            Total fees: {transactions.reduce((sum, tx) => sum + tx.fee, 0).toFixed(2)} GTT
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={addRandomTransaction}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Tx
          </Button>
          <Button
            onClick={generateBurst}
            disabled={isGenerating}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="w-4 h-4 mr-1" />
            {isGenerating ? 'Generating...' : 'Burst'}
          </Button>
          <Button
            onClick={clearPool}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedTransactions.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No transactions in mempool</p>
            <p className="text-xs">Add some transactions to get started</p>
          </div>
        ) : (
          sortedTransactions.map((tx) => {
            const typeInfo = getTransactionTypeInfo(tx.type);
            const Icon = typeInfo.icon;
            
            return (
              <div
                key={tx.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  tx.status === 'mining' ? 'border-blue-500 bg-blue-900/10 animate-pulse' :
                  tx.status === 'confirmed' ? 'border-green-500 bg-green-900/10' :
                  'border-slate-600 bg-slate-900/50 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${typeInfo.color}-600`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{typeInfo.name}</span>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getStatusColor(tx.status)}`}
                        >
                          {tx.status}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getPriorityColor(tx.priority)}`}
                        >
                          {tx.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>From: {tx.from}</span>
                          <span className="font-mono">{tx.amount} GTT</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>To: {tx.to}</span>
                          <span className="font-mono">Fee: {tx.fee} GTT</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{((Date.now() - tx.timestamp) / 1000).toFixed(0)}s ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    {tx.status === 'pending' && (
                      <Button
                        onClick={() => updateTransactionStatus(tx.id, 'mining')}
                        size="sm"
                        variant="outline"
                        className="text-xs border-blue-500 text-blue-400 hover:bg-blue-900/20"
                      >
                        Mine
                      </Button>
                    )}
                    {tx.status === 'mining' && (
                      <Button
                        onClick={() => updateTransactionStatus(tx.id, 'confirmed')}
                        size="sm"
                        variant="outline"
                        className="text-xs border-green-500 text-green-400 hover:bg-green-900/20"
                      >
                        Confirm
                      </Button>
                    )}
                    <Button
                      onClick={() => removeTransaction(tx.id)}
                      size="sm"
                      variant="outline"
                      className="text-xs border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pool Statistics */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">
              {transactions.filter(tx => tx.status === 'pending').length}
            </div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-400">
              {transactions.filter(tx => tx.status === 'mining').length}
            </div>
            <div className="text-xs text-slate-400">Mining</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-400">
              {transactions.filter(tx => tx.status === 'confirmed').length}
            </div>
            <div className="text-xs text-slate-400">Confirmed</div>
          </div>
        </div>
      </div>
    </Card>
  );
}