import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Cpu, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle, 
  Hash,
  TrendingUp,
  Globe,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";

interface BlockData {
  id: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  isValid: boolean;
}

interface Transaction {
  id: string;
  type: 'capsule' | 'verification' | 'reward';
  from: string;
  to: string;
  amount?: number;
  data: string;
  timestamp: number;
}

export default function BlockchainDemo() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isMinig, setIsMining] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [hashPower, setHashPower] = useState(1250);
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Initialize genesis block
  useEffect(() => {
    const genesisBlock: BlockData = {
      id: 0,
      hash: "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      previousHash: "0",
      timestamp: Date.now() - 86400000, // 1 day ago
      transactions: [{
        id: "genesis",
        type: 'capsule',
        from: "genesis",
        to: "0x742d35Cc6C7aC23DDe3c9D4b651C42773Ee8fF6a",
        data: "GUARDIANCHAIN Genesis Block - The Truth Begins Here",
        timestamp: Date.now() - 86400000
      }],
      nonce: 2083236893,
      isValid: true
    };

    setBlocks([genesisBlock]);
    generatePendingTransactions();
  }, []);

  const generatePendingTransactions = () => {
    const transactions: Transaction[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'capsule',
        from: "0x742d35Cc6C7aC23DDe3c9D4b651C42773Ee8fF6a",
        to: "TruthVault",
        data: "Climate Change Evidence Capsule",
        timestamp: Date.now()
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'verification',
        from: "0x8ba1f109551bD432803012645Hac136c71c9dd",
        to: "0x742d35Cc6C7aC23DDe3c9D4b651C42773Ee8fF6a",
        data: "Truth verification for capsule #TC-001",
        timestamp: Date.now()
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'reward',
        from: "TruthVault",
        to: "0x742d35Cc6C7aC23DDe3c9D4b651C42773Ee8fF6a",
        amount: 50,
        data: "GTT reward for verified truth capsule",
        timestamp: Date.now()
      }
    ];

    setPendingTransactions(transactions);
  };

  const mineNewBlock = async () => {
    if (pendingTransactions.length === 0) return;

    setIsMining(true);
    
    // Simulate mining process
    await new Promise(resolve => setTimeout(resolve, 3000));

    const previousBlock = blocks[blocks.length - 1];
    const newBlock: BlockData = {
      id: blocks.length,
      hash: "0x" + Math.random().toString(16).substr(2, 64),
      previousHash: previousBlock.hash,
      timestamp: Date.now(),
      transactions: [...pendingTransactions],
      nonce: Math.floor(Math.random() * 1000000000),
      isValid: true
    };

    setBlocks(prev => [...prev, newBlock]);
    setTotalTransactions(prev => prev + pendingTransactions.length);
    setPendingTransactions([]);
    setIsMining(false);
    
    // Generate new pending transactions
    setTimeout(() => generatePendingTransactions(), 2000);
  };

  const validateChain = () => {
    let isValid = true;
    const updatedBlocks = blocks.map((block, index) => {
      if (index > 0) {
        const previousBlock = blocks[index - 1];
        const isBlockValid = block.previousHash === previousBlock.hash;
        if (!isBlockValid) isValid = false;
        return { ...block, isValid: isBlockValid };
      }
      return block;
    });
    
    setBlocks(updatedBlocks);
    return isValid;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            GUARDIANCHAIN Blockchain Demo
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience real-time blockchain operations for truth verification, capsule creation, and GTT token rewards
          </p>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{blocks.length}</div>
                  <div className="text-sm text-muted-foreground">Total Blocks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Cpu className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{hashPower}</div>
                  <div className="text-sm text-muted-foreground">Hash Rate (TH/s)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12s</div>
                  <div className="text-sm text-muted-foreground">Block Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mining Controls */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Mining Operations
            </CardTitle>
            <CardDescription>
              Mine new blocks and validate the GUARDIANCHAIN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">Pending Transactions: {pendingTransactions.length}</div>
                <div className="text-sm text-muted-foreground">
                  Ready to mine into next block
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={mineNewBlock}
                  disabled={isMinig || pendingTransactions.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isMinig ? (
                    <>
                      <Cpu className="h-4 w-4 mr-2 animate-spin" />
                      Mining...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Mine Block
                    </>
                  )}
                </Button>
                <Button 
                  onClick={validateChain}
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Validate Chain
                </Button>
              </div>
            </div>

            {isMinig && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Mining in progress...</span>
                </div>
                <div className="text-sm text-slate-400">
                  Calculating proof of work, validating transactions, and securing the network
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Transactions */}
        {pendingTransactions.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Transaction Pool
              </CardTitle>
              <CardDescription>
                Transactions waiting to be mined into the next block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTransactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={tx.type === 'capsule' ? 'default' : tx.type === 'verification' ? 'secondary' : 'outline'}>
                        {tx.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="font-mono text-xs text-slate-400 mb-1">
                        From: {tx.from.slice(0, 10)}... → To: {tx.to.slice(0, 10)}...
                      </div>
                      <div>{tx.data}</div>
                      {tx.amount && (
                        <div className="text-green-400 font-medium">
                          Amount: {tx.amount} GTT
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blockchain Visualization */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Blockchain Explorer
            </CardTitle>
            <CardDescription>
              Live view of the GUARDIANCHAIN blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blocks.slice().reverse().map((block, index) => (
                <div key={block.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={block.isValid ? "default" : "destructive"}>
                        Block #{block.id}
                      </Badge>
                      {block.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <span className="text-sm text-slate-400">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Block Hash</div>
                      <div className="font-mono text-xs">{block.hash}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Previous Hash</div>
                      <div className="font-mono text-xs">{block.previousHash}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>{block.transactions.length} transactions</span>
                    <span className="text-slate-400">Nonce: {block.nonce}</span>
                  </div>

                  {block.transactions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <div className="text-sm text-slate-400 mb-2">Transactions:</div>
                      <div className="space-y-2">
                        {block.transactions.map((tx) => (
                          <div key={tx.id} className="text-xs p-2 bg-slate-600/50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs">
                                {tx.type}
                              </Badge>
                              {tx.amount && (
                                <span className="text-green-400">{tx.amount} GTT</span>
                              )}
                            </div>
                            <div className="text-slate-300">{tx.data}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Value Proposition */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Enterprise Blockchain Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-800/30 rounded-lg">
              <Globe className="h-8 w-8 mx-auto mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Global Verification</h3>
              <p className="text-sm text-slate-400">
                Immutable truth verification accessible worldwide with 99.9% uptime
              </p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-3 text-green-400" />
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-slate-400">
                Bank-grade cryptographic security protecting intellectual property
              </p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-purple-400" />
              <h3 className="font-semibold mb-2">$10M+ Annual Savings</h3>
              <p className="text-sm text-slate-400">
                Eliminate fraud, disputes, and verification costs for enterprises
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}