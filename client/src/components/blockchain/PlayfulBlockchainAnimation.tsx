import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, RotateCcw, Zap, Shield, Users, Coins, Gamepad2, BookOpen, Plus } from 'lucide-react';
import InteractiveBlock from './InteractiveBlock';
import TransactionPool from './TransactionPool';

interface Block {
  id: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;
  nonce: number;
  isBeingMined: boolean;
  isMined: boolean;
  position: { x: number; y: number };
  color: string;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'GTT_MINT' | 'CAPSULE_VERIFY' | 'GUARDIAN_REWARD' | 'VAULT_COMPOUND';
  status: 'pending' | 'mining' | 'confirmed';
  position: { x: number; y: number };
}

interface Miner {
  id: string;
  name: string;
  hashRate: number;
  position: { x: number; y: number };
  isActive: boolean;
  currentBlock?: number;
}

export default function PlayfulBlockchainAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [miners, setMiners] = useState<Miner[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(4);
  const [totalHashrate, setTotalHashrate] = useState(0);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [stats, setStats] = useState({
    blocksGenerated: 0,
    transactionsProcessed: 0,
    totalGTTMinted: 0,
    averageBlockTime: 12
  });
  const [mode, setMode] = useState<'auto' | 'interactive'>('auto');
  const [interactiveBlocks, setInteractiveBlocks] = useState<any[]>([]);
  const [poolTransactions, setPoolTransactions] = useState<any[]>([]);

  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize blockchain network
  useEffect(() => {
    initializeNetwork();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializeNetwork = () => {
    // Create genesis block
    const genesisBlock: Block = {
      id: 0,
      hash: '0000f7a4c1e5d8b9...',
      previousHash: '0000000000000000...',
      timestamp: Date.now(),
      data: 'GUARDIANCHAIN Genesis Block',
      nonce: 42424,
      isBeingMined: false,
      isMined: true,
      position: { x: 100, y: 200 },
      color: '#10b981'
    };

    // Initialize miners
    const initialMiners: Miner[] = [
      { id: 'guardian1', name: 'Guardian Node Alpha', hashRate: 150, position: { x: 200, y: 50 }, isActive: true },
      { id: 'guardian2', name: 'Guardian Node Beta', hashRate: 120, position: { x: 400, y: 50 }, isActive: true },
      { id: 'guardian3', name: 'Guardian Node Gamma', hashRate: 180, position: { x: 600, y: 50 }, isActive: true },
      { id: 'community1', name: 'Community Validator', hashRate: 80, position: { x: 800, y: 50 }, isActive: true }
    ];

    setBlocks([genesisBlock]);
    setMiners(initialMiners);
    setTotalHashrate(initialMiners.reduce((sum, miner) => sum + miner.hashRate, 0));

    // Create initial transactions
    generateInitialTransactions();
  };

  const generateInitialTransactions = () => {
    const transactionTypes = [
      { type: 'GTT_MINT' as const, data: 'Mint 1000 GTT for truth verification' },
      { type: 'CAPSULE_VERIFY' as const, data: 'Verify truth capsule #247' },
      { type: 'GUARDIAN_REWARD' as const, data: 'Guardian Pass holder reward' },
      { type: 'VAULT_COMPOUND' as const, data: 'Auto-compound vault rewards' }
    ];

    const newTransactions: Transaction[] = Array.from({ length: 5 }, (_, i) => {
      const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      return {
        id: `tx_${Date.now()}_${i}`,
        from: `0x${Math.random().toString(16).substr(2, 8)}...`,
        to: `0x${Math.random().toString(16).substr(2, 8)}...`,
        amount: Math.floor(Math.random() * 1000) + 50,
        type: txType.type,
        status: 'pending',
        position: { x: 50 + i * 150, y: 350 }
      };
    });

    setTransactions(newTransactions);
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        updateBlockchain();
        animateTransactions();
        updateMinerActivity();
        drawConnections();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying, blocks, transactions, miners]);

  const updateBlockchain = () => {
    // Simulate block mining
    if (Math.random() < 0.02) { // 2% chance per frame
      mineNewBlock();
    }

    // Update network difficulty
    if (stats.blocksGenerated > 0 && stats.blocksGenerated % 5 === 0) {
      adjustDifficulty();
    }
  };

  const mineNewBlock = () => {
    setBlocks(prevBlocks => {
      const lastBlock = prevBlocks[prevBlocks.length - 1];
      const pendingTxs = transactions.filter(tx => tx.status === 'pending').slice(0, 3);
      
      if (pendingTxs.length === 0) return prevBlocks;

      const newBlock: Block = {
        id: lastBlock.id + 1,
        hash: `0000${Math.random().toString(16).substr(2, 12)}...`,
        previousHash: lastBlock.hash,
        timestamp: Date.now(),
        data: `Block ${lastBlock.id + 1}: ${pendingTxs.length} transactions`,
        nonce: Math.floor(Math.random() * 1000000),
        isBeingMined: true,
        isMined: false,
        position: { x: lastBlock.position.x + 200, y: 200 },
        color: '#f59e0b'
      };

      // Mark transactions as mining
      setTransactions(prevTxs => 
        prevTxs.map(tx => 
          pendingTxs.some(ptx => ptx.id === tx.id) 
            ? { ...tx, status: 'mining' as const }
            : tx
        )
      );

      // Complete mining after animation
      setTimeout(() => {
        setBlocks(currentBlocks => 
          currentBlocks.map(block => 
            block.id === newBlock.id 
              ? { ...block, isBeingMined: false, isMined: true, color: '#10b981' }
              : block
          )
        );

        setTransactions(prevTxs => 
          prevTxs.map(tx => 
            pendingTxs.some(ptx => ptx.id === tx.id)
              ? { ...tx, status: 'confirmed' as const }
              : tx
          )
        );

        setStats(prevStats => ({
          ...prevStats,
          blocksGenerated: prevStats.blocksGenerated + 1,
          transactionsProcessed: prevStats.transactionsProcessed + pendingTxs.length,
          totalGTTMinted: prevStats.totalGTTMinted + pendingTxs.reduce((sum, tx) => sum + tx.amount, 0)
        }));

        // Generate new transactions
        setTimeout(() => {
          generateNewTransactions(2);
        }, 1000);

      }, 3000);

      return [...prevBlocks, newBlock];
    });
  };

  const generateNewTransactions = (count: number) => {
    const transactionTypes = [
      { type: 'GTT_MINT' as const, prefix: 'GTT' },
      { type: 'CAPSULE_VERIFY' as const, prefix: 'VRF' },
      { type: 'GUARDIAN_REWARD' as const, prefix: 'GRD' },
      { type: 'VAULT_COMPOUND' as const, prefix: 'VLT' }
    ];

    const newTxs: Transaction[] = Array.from({ length: count }, (_, i) => {
      const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      return {
        id: `${txType.prefix}_${Date.now()}_${i}`,
        from: `0x${Math.random().toString(16).substr(2, 8)}...`,
        to: `0x${Math.random().toString(16).substr(2, 8)}...`,
        amount: Math.floor(Math.random() * 1000) + 50,
        type: txType.type,
        status: 'pending',
        position: { x: 50 + Math.random() * 700, y: 350 }
      };
    });

    setTransactions(prev => [...prev, ...newTxs]);
  };

  const animateTransactions = () => {
    // Move transactions toward miners when being processed
    setTransactions(prevTxs => 
      prevTxs.map(tx => {
        if (tx.status === 'mining') {
          const targetMiner = miners.find(m => m.isActive);
          if (targetMiner) {
            const dx = targetMiner.position.x - tx.position.x;
            const dy = targetMiner.position.y - tx.position.y;
            return {
              ...tx,
              position: {
                x: tx.position.x + dx * 0.05,
                y: tx.position.y + dy * 0.05
              }
            };
          }
        }
        return tx;
      })
    );
  };

  const updateMinerActivity = () => {
    setMiners(prevMiners => 
      prevMiners.map(miner => ({
        ...miner,
        isActive: Math.random() > 0.1, // 90% uptime
        hashRate: miner.hashRate + (Math.random() - 0.5) * 10 // Fluctuating hashrate
      }))
    );
  };

  const adjustDifficulty = () => {
    const avgBlockTime = stats.averageBlockTime;
    if (avgBlockTime < 10) {
      setCurrentDifficulty(prev => Math.min(prev + 1, 8));
    } else if (avgBlockTime > 15) {
      setCurrentDifficulty(prev => Math.max(prev - 1, 2));
    }
  };

  const drawConnections = () => {
    // This would handle canvas drawing for connections between blocks
    // Implementation would use canvas API to draw animated lines
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setStats({
      blocksGenerated: 0,
      transactionsProcessed: 0,
      totalGTTMinted: 0,
      averageBlockTime: 12
    });
    setInteractiveBlocks([]);
    setPoolTransactions([]);
    initializeNetwork();
  };

  const handleBlockMined = (blockData: any) => {
    setStats(prev => ({
      ...prev,
      blocksGenerated: prev.blocksGenerated + 1,
      transactionsProcessed: prev.transactionsProcessed + poolTransactions.filter(tx => tx.status === 'pending').length,
      totalGTTMinted: prev.totalGTTMinted + 1000
    }));
  };

  const addInteractiveBlock = () => {
    const newBlock = {
      id: interactiveBlocks.length,
      previousHash: interactiveBlocks.length > 0 ? 
        interactiveBlocks[interactiveBlocks.length - 1].hash : 
        '0000000000000000...',
      isActive: interactiveBlocks.length === 0 // Only first block is active initially
    };
    setInteractiveBlocks(prev => [...prev, newBlock]);
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'GTT_MINT': return '#f59e0b';
      case 'CAPSULE_VERIFY': return '#8b5cf6';
      case 'GUARDIAN_REWARD': return '#10b981';
      case 'VAULT_COMPOUND': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'GTT_MINT': return <Coins className="w-3 h-3" />;
      case 'CAPSULE_VERIFY': return <Shield className="w-3 h-3" />;
      case 'GUARDIAN_REWARD': return <Zap className="w-3 h-3" />;
      case 'VAULT_COMPOUND': return <Users className="w-3 h-3" />;
      default: return <Coins className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-4">
            GUARDIANCHAIN Blockchain Playground
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Interactive visualization of blockchain concepts through the GUARDIANCHAIN protocol
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={() => setMode('auto')}
            variant={mode === 'auto' ? 'default' : 'outline'}
            className={mode === 'auto' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-white hover:bg-slate-800'}
          >
            <Play className="w-4 h-4 mr-2" />
            Auto Mode
          </Button>
          <Button
            onClick={() => setMode('interactive')}
            variant={mode === 'interactive' ? 'default' : 'outline'}
            className={mode === 'interactive' ? 'bg-green-600 hover:bg-green-700' : 'border-slate-600 text-white hover:bg-slate-800'}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Interactive Mode
          </Button>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Start'} Network
          </Button>
          <Button onClick={resetAnimation} variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={() => generateNewTransactions(3)} variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            <Zap className="w-4 h-4 mr-2" />
            Add Transactions
          </Button>
          {mode === 'interactive' && (
            <Button onClick={addInteractiveBlock} variant="outline" className="border-green-600 text-green-400 hover:bg-green-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          )}
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-2xl font-bold text-green-400">{stats.blocksGenerated}</div>
            <div className="text-sm text-slate-400">Blocks Mined</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.transactionsProcessed}</div>
            <div className="text-sm text-slate-400">Transactions</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.totalGTTMinted.toLocaleString()}</div>
            <div className="text-sm text-slate-400">GTT Minted</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-2xl font-bold text-purple-400">{totalHashrate.toFixed(0)} TH/s</div>
            <div className="text-sm text-slate-400">Network Hashrate</div>
          </Card>
        </div>

        {/* Main Animation Area */}
        {mode === 'auto' ? (
          <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
            <div className="relative h-96 overflow-hidden bg-slate-900 rounded-lg border border-slate-700">
            {/* Miners */}
            <div className="absolute top-4 left-4 right-4">
              <div className="flex justify-between">
                {miners.map(miner => (
                  <div key={miner.id} className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      miner.isActive ? 'bg-green-600 animate-pulse' : 'bg-gray-600'
                    }`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-400">{miner.name}</div>
                    <div className="text-xs text-green-400">{miner.hashRate.toFixed(0)} TH/s</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocks */}
            <div className="absolute top-32 left-4 right-4">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {blocks.map((block, index) => (
                  <div key={block.id} className="flex-shrink-0">
                    <div className={`w-32 h-24 rounded-lg border-2 p-3 ${
                      block.isBeingMined 
                        ? 'border-yellow-500 bg-yellow-900/20 animate-pulse' 
                        : block.isMined 
                          ? 'border-green-500 bg-green-900/20' 
                          : 'border-gray-500 bg-gray-900/20'
                    }`}>
                      <div className="text-xs font-mono text-white">Block #{block.id}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {block.hash.substring(0, 12)}...
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Nonce: {block.nonce}
                      </div>
                      {block.isBeingMined && (
                        <div className="text-xs text-yellow-400 mt-1">Mining...</div>
                      )}
                    </div>
                    {index < blocks.length - 1 && (
                      <div className="w-8 h-1 bg-slate-600 mt-12 ml-32"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-sm text-slate-400 mb-2">Transaction Pool</div>
              <div className="flex flex-wrap gap-2">
                {transactions.map(tx => (
                  <div key={tx.id} className={`px-3 py-2 rounded-lg border text-xs ${
                    tx.status === 'pending' ? 'border-gray-500 bg-gray-900/50' :
                    tx.status === 'mining' ? 'border-yellow-500 bg-yellow-900/20 animate-pulse' :
                    'border-green-500 bg-green-900/20'
                  }`}>
                    <div className="flex items-center gap-1 mb-1">
                      <div style={{ color: getTransactionColor(tx.type) }}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <span className="text-white">{tx.type.replace('_', ' ')}</span>
                    </div>
                    <div className="text-slate-400">{tx.amount} GTT</div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${
                        tx.status === 'pending' ? 'border-gray-500 text-gray-400' :
                        tx.status === 'mining' ? 'border-yellow-500 text-yellow-400' :
                        'border-green-500 text-green-400'
                      }`}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        ) : (
          // Interactive Mode
          <div className="space-y-6 mb-8">
            {/* Transaction Pool */}
            <TransactionPool onTransactionUpdate={setPoolTransactions} />
            
            {/* Interactive Blocks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Interactive Block Mining</h3>
                <p className="text-sm text-slate-400">
                  Mine blocks step-by-step to understand the process
                </p>
              </div>
              
              {interactiveBlocks.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h4 className="text-lg font-semibold text-white mb-2">Start Your Blockchain</h4>
                  <p className="text-slate-400 mb-4">
                    Add your first block to begin understanding how blockchain mining works
                  </p>
                  <Button onClick={addInteractiveBlock} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Genesis Block
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {interactiveBlocks.map((block, index) => (
                    <InteractiveBlock
                      key={block.id}
                      blockId={block.id}
                      previousHash={block.previousHash}
                      onBlockMined={handleBlockMined}
                      isActive={block.isActive || index === interactiveBlocks.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Educational Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <strong>Transactions:</strong> Users create truth capsules, mint GTT tokens, and interact with the GUARDIANCHAIN protocol
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <strong>Mining:</strong> Guardian nodes validate transactions and compete to create new blocks
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <strong>Consensus:</strong> The network agrees on the longest valid chain of blocks
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <strong>Rewards:</strong> Miners earn GTT tokens for securing the network
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Network Parameters</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Difficulty:</span>
                <span className="text-white font-mono">{currentDifficulty}/8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Block Time:</span>
                <span className="text-white font-mono">{stats.averageBlockTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Miners:</span>
                <span className="text-white font-mono">{miners.filter(m => m.isActive).length}/{miners.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network Health:</span>
                <span className="text-green-400 font-mono">{networkHealth}%</span>
              </div>
              <Separator className="bg-slate-700" />
              <div className="flex justify-between">
                <span className="text-slate-400">Total Value Locked:</span>
                <span className="text-green-400 font-mono">${(stats.totalGTTMinted * 0.025).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}