import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Link, Shield, Coins } from "lucide-react";

interface Block {
  id: number;
  hash: string;
  previousHash: string;
  data: string;
  timestamp: number;
  nonce: number;
  isValid: boolean;
  isMining: boolean;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'capsule' | 'verification' | 'reward';
  status: 'pending' | 'confirmed' | 'mined';
}

const BlockchainVisualization: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [miningProgress, setMiningProgress] = useState(0);

  // Initialize genesis block
  useEffect(() => {
    const genesisBlock: Block = {
      id: 0,
      hash: "000004f5e8b2c3d1a7e9f2b8c6d4a5e7f9b1c3d5e7f9b2c4d6a8e0f2b4c6d8",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      data: "Genesis Block - GUARDIANCHAIN Origin",
      timestamp: Date.now() - 86400000,
      nonce: 12345,
      isValid: true,
      isMining: false
    };
    setBlocks([genesisBlock]);
  }, []);

  // Generate sample transactions
  const generateTransaction = (): Transaction => {
    const types: Transaction['type'][] = ['capsule', 'verification', 'reward'];
    const addresses = [
      '0x1a2b3c4d5e6f7890',
      '0x9876543210abcdef',
      '0xfedcba0987654321',
      '0x1234567890abcdef'
    ];
    
    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from: addresses[Math.floor(Math.random() * addresses.length)],
      to: addresses[Math.floor(Math.random() * addresses.length)],
      amount: Math.floor(Math.random() * 1000) + 10,
      type: types[Math.floor(Math.random() * types.length)],
      status: 'pending'
    };
  };

  // Simple hash function for demonstration
  const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
    return `0000${hashStr}`.slice(-64).padStart(64, '0');
  };

  // Mine a new block
  const mineBlock = async () => {
    if (blocks.length === 0) return;
    
    const newTransaction = generateTransaction();
    setTransactions(prev => [...prev, newTransaction]);
    
    // Simulate mining process
    const newBlock: Block = {
      id: blocks.length,
      hash: "",
      previousHash: blocks[blocks.length - 1].hash,
      data: `Block #${blocks.length} - ${newTransaction.type.toUpperCase()} Transaction`,
      timestamp: Date.now(),
      nonce: 0,
      isValid: false,
      isMining: true
    };

    setBlocks(prev => [...prev, newBlock]);
    setMiningProgress(0);

    // Simulate proof-of-work mining with progress
    for (let nonce = 0; nonce < 1000; nonce += 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const blockData = `${newBlock.id}${newBlock.previousHash}${newBlock.data}${newBlock.timestamp}${nonce}`;
      const hash = simpleHash(blockData);
      
      setMiningProgress((nonce / 1000) * 100);
      
      // Check if hash meets difficulty (starts with zeros)
      if (hash.startsWith('0000')) {
        const minedBlock: Block = {
          ...newBlock,
          hash,
          nonce,
          isValid: true,
          isMining: false
        };

        setBlocks(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = minedBlock;
          return updated;
        });

        // Update transaction status
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'mined' }
              : tx
          )
        );
        
        setMiningProgress(100);
        break;
      }
    }
  };

  // Auto-mine blocks
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(async () => {
      await mineBlock();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating, blocks]);

  // Block validation animation
  const validateChain = () => {
    setBlocks(prev => prev.map((block, index) => {
      if (index === 0) return { ...block, isValid: true }; // Genesis block
      
      const previousBlock = prev[index - 1];
      const isValid = block.previousHash === previousBlock.hash;
      
      return { ...block, isValid };
    }));
  };

  const resetBlockchain = () => {
    setIsAnimating(false);
    setBlocks(blocks.slice(0, 1)); // Keep only genesis block
    setTransactions([]);
    setMiningProgress(0);
    setCurrentBlockIndex(0);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'capsule': return <Shield className="w-4 h-4" />;
      case 'verification': return <Link className="w-4 h-4" />;
      case 'reward': return <Coins className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'capsule': return 'bg-purple-500';
      case 'verification': return 'bg-blue-500';
      case 'reward': return 'bg-green-500';
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Link className="w-6 h-6 mr-2 text-blue-400" />
              GUARDIANCHAIN Blockchain Visualization
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsAnimating(!isAnimating)}
                size="sm"
                className={`${isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isAnimating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isAnimating ? 'Pause' : 'Start'} Mining
              </Button>
              <Button
                onClick={validateChain}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Validate Chain
              </Button>
              <Button
                onClick={resetBlockchain}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mining Progress */}
          {miningProgress > 0 && miningProgress < 100 && (
            <div className="mb-6 bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Mining Block #{blocks.length - 1}...</span>
                <span className="text-slate-300 text-sm">{miningProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${miningProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Blockchain Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blockchain Blocks */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Blockchain Blocks</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {blocks.map((block, index) => (
                  <div key={block.id} className="relative">
                    <Card className={`${
                      block.isMining 
                        ? 'bg-yellow-900/20 border-yellow-600 animate-pulse' 
                        : block.isValid 
                          ? 'bg-green-900/20 border-green-600' 
                          : 'bg-red-900/20 border-red-600'
                    } transition-all duration-500`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              block.isMining 
                                ? 'bg-yellow-500 animate-pulse' 
                                : block.isValid 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500'
                            }`} />
                            <span className="text-white font-semibold">
                              Block #{block.id}
                            </span>
                          </div>
                          <Badge className={
                            block.isMining 
                              ? 'bg-yellow-600' 
                              : block.isValid 
                                ? 'bg-green-600' 
                                : 'bg-red-600'
                          }>
                            {block.isMining ? 'Mining' : block.isValid ? 'Valid' : 'Invalid'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-slate-300">
                          <div>Hash: <span className="font-mono text-xs">{block.hash || 'Mining...'}</span></div>
                          <div>Previous: <span className="font-mono text-xs">{block.previousHash.slice(0, 16)}...</span></div>
                          <div>Data: {block.data}</div>
                          <div>Nonce: {block.nonce}</div>
                          <div>Time: {new Date(block.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Connection Line */}
                    {index < blocks.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="w-0.5 h-4 bg-slate-600"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Pool */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Pool</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.slice(-10).reverse().map((tx) => (
                  <Card key={tx.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`p-1 rounded ${getTransactionColor(tx.type)} mr-2`}>
                            {getTransactionIcon(tx.type)}
                          </div>
                          <span className="text-white text-sm font-medium">
                            {tx.type.toUpperCase()}
                          </span>
                        </div>
                        <Badge className={
                          tx.status === 'mined' 
                            ? 'bg-green-600' 
                            : tx.status === 'confirmed' 
                              ? 'bg-blue-600' 
                              : 'bg-yellow-600'
                        }>
                          {tx.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-slate-400">
                        <div>From: {tx.from.slice(0, 10)}...</div>
                        <div>To: {tx.to.slice(0, 10)}...</div>
                        <div>Amount: {tx.amount} GTT</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {transactions.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    No transactions yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{blocks.length}</div>
              <div className="text-sm text-slate-400">Total Blocks</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{transactions.length}</div>
              <div className="text-sm text-slate-400">Transactions</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">
                {blocks.filter(b => b.isValid).length}
              </div>
              <div className="text-sm text-slate-400">Valid Blocks</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {transactions.filter(tx => tx.status === 'mined').length}
              </div>
              <div className="text-sm text-slate-400">Mined Txs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainVisualization;