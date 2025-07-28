import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Shield,
  Clock,
  Hash,
  Link,
  Cpu,
  Database,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Block {
  id: number;
  hash: string;
  previousHash: string;
  nonce: number;
  timestamp: number;
  transactions: Transaction[];
  isValid: boolean;
  isMining: boolean;
  difficulty: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: "capsule_creation" | "verification" | "gtt_reward" | "transfer";
  status: "pending" | "confirmed" | "failed";
  data?: any;
}

const BlockchainVisualization: React.FC = () => {
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>(
    []
  );
  const [isRunning, setIsRunning] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [currentMiningBlock, setCurrentMiningBlock] = useState<Block | null>(
    null
  );
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    validBlocks: 0,
    hashRate: 0,
    difficulty: 4,
  });
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize genesis block
  useEffect(() => {
    const genesisBlock: Block = {
      id: 0,
      hash: "0x0000...",
      previousHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      nonce: 0,
      timestamp: Date.now(),
      transactions: [],
      isValid: true,
      isMining: false,
      difficulty: 4,
    };
    setBlockchain([genesisBlock]);
    setStats((prev) => ({ ...prev, totalBlocks: 1, validBlocks: 1 }));
  }, []);

  // Generate sample transactions
  const generateTransaction = (): Transaction => {
    const types: Transaction["type"][] = [
      "capsule_creation",
      "verification",
      "gtt_reward",
      "transfer",
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    const transactionData = {
      capsule_creation: {
        from: "Creator",
        to: "GUARDIANCHAIN",
        amount: 50,
        data: { title: "Truth Capsule", content_hash: "QmX..." },
      },
      verification: {
        from: "Verifier",
        to: "GUARDIANCHAIN",
        amount: 25,
        data: { capsule_id: "C123", vote: "verified" },
      },
      gtt_reward: {
        from: "GUARDIANCHAIN",
        to: "Creator",
        amount: 100,
        data: { reason: "capsule_verified", multiplier: 1.5 },
      },
      transfer: {
        from: "User A",
        to: "User B",
        amount: Math.floor(Math.random() * 500) + 10,
        data: {},
      },
    };

    const data = transactionData[type];

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      from: data.from,
      to: data.to,
      amount: data.amount,
      status: "pending",
      data: data.data,
    };
  };

  // Calculate hash (simplified)
  const calculateHash = (block: Partial<Block>): string => {
    const data = `${block.previousHash}${block.timestamp}${JSON.stringify(
      block.transactions
    )}${block.nonce}`;
    // Simplified hash simulation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hashString = Math.abs(hash).toString(16).padStart(8, "0");
    return `0x${"0".repeat(block.difficulty || 4)}${hashString}`;
  };

  // Mine block
  const mineBlock = async (block: Block): Promise<Block> => {
    return new Promise((resolve) => {
      let nonce = 0;
      const target = "0".repeat(block.difficulty);

      const mine = () => {
        nonce++;
        const hash = calculateHash({ ...block, nonce });

        if (hash.startsWith(`0x${target}`)) {
          const minedBlock = {
            ...block,
            nonce,
            hash,
            isMining: false,
            isValid: true,
          };
          resolve(minedBlock);
        } else {
          setMiningProgress((nonce % 1000) / 10);
          if (nonce % 100 === 0) {
            setTimeout(mine, 10);
          } else {
            mine();
          }
        }
      };

      mine();
    });
  };

  // Add new block
  const addBlock = async () => {
    if (pendingTransactions.length === 0) return;

    const lastBlock = blockchain[blockchain.length - 1];
    const newBlock: Block = {
      id: lastBlock.id + 1,
      hash: "",
      previousHash: lastBlock.hash,
      nonce: 0,
      timestamp: Date.now(),
      transactions: pendingTransactions.slice(0, 3), // Take up to 3 transactions
      isValid: false,
      isMining: true,
      difficulty: stats.difficulty,
    };

    setCurrentMiningBlock(newBlock);
    setMiningProgress(0);

    // Update transactions status
    const transactionsToProcess = pendingTransactions.slice(0, 3);
    transactionsToProcess.forEach((tx) => (tx.status = "confirmed"));

    // Mine the block
    const minedBlock = await mineBlock(newBlock);

    setBlockchain((prev) => [...prev, minedBlock]);
    setPendingTransactions((prev) => prev.slice(3));
    setCurrentMiningBlock(null);
    setMiningProgress(0);

    setStats((prev) => ({
      ...prev,
      totalBlocks: prev.totalBlocks + 1,
      validBlocks: prev.validBlocks + 1,
      totalTransactions: prev.totalTransactions + transactionsToProcess.length,
      hashRate: Math.floor(Math.random() * 1000) + 500,
    }));

    toast({
      title: "Block Mined",
      description: `Block #${minedBlock.id} successfully added to chain`,
    });
  };

  // Blockchain simulation loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Add new transaction
        if (Math.random() > 0.3) {
          setPendingTransactions((prev) => [...prev, generateTransaction()]);
        }

        // Mine block if enough transactions
        if (pendingTransactions.length >= 3 && !currentMiningBlock) {
          addBlock();
        }
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, pendingTransactions.length, currentMiningBlock]);

  const startSimulation = () => {
    setIsRunning(true);
    toast({
      title: "Blockchain Started",
      description: "Mining simulation is now running",
    });
  };

  const pauseSimulation = () => {
    setIsRunning(false);
    toast({
      title: "Blockchain Paused",
      description: "Mining simulation has been paused",
    });
  };

  const resetBlockchain = () => {
    setIsRunning(false);
    setBlockchain([blockchain[0]]); // Keep genesis block
    setPendingTransactions([]);
    setCurrentMiningBlock(null);
    setMiningProgress(0);
    setStats({
      totalBlocks: 1,
      totalTransactions: 0,
      validBlocks: 1,
      hashRate: 0,
      difficulty: 4,
    });
    toast({
      title: "Blockchain Reset",
      description: "Blockchain has been reset to genesis block",
    });
  };

  const getTransactionColor = (type: Transaction["type"]) => {
    const colors = {
      capsule_creation: "bg-blue-600",
      verification: "bg-green-600",
      gtt_reward: "bg-purple-600",
      transfer: "bg-yellow-600",
    };
    return colors[type];
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    const icons = {
      capsule_creation: <Database className="w-3 h-3" />,
      verification: <CheckCircle className="w-3 h-3" />,
      gtt_reward: <Zap className="w-3 h-3" />,
      transfer: <TrendingUp className="w-3 h-3" />,
    };
    return icons[type];
  };

  return (
    <div className="w-full space-y-8">
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-center">
            <Link className="w-8 h-8 mr-3 text-blue-400" />
            <div className="text-center">
              <div className="text-3xl font-bold">
                GUARDIANCHAIN Blockchain Visualization
              </div>
              <div className="text-lg text-blue-400">
                Interactive Mining & Truth Verification Simulation
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={startSimulation}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Mining
            </Button>

            <Button
              onClick={pauseSimulation}
              disabled={!isRunning}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>

            <Button
              onClick={resetBlockchain}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-900/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.totalBlocks}
              </div>
              <div className="text-sm text-slate-400">Total Blocks</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.totalTransactions}
              </div>
              <div className="text-sm text-slate-400">Transactions</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {stats.validBlocks}
              </div>
              <div className="text-sm text-slate-400">Valid Blocks</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {stats.hashRate}
              </div>
              <div className="text-sm text-slate-400">Hash Rate</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {stats.difficulty}
              </div>
              <div className="text-sm text-slate-400">Difficulty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mining Progress */}
      {currentMiningBlock && (
        <Card className="bg-orange-900/20 border-orange-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Cpu className="w-6 h-6 mr-2 text-orange-400 animate-spin" />
              Mining Block #{currentMiningBlock.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white">Mining Progress</span>
                  <span className="text-orange-400">
                    {miningProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={miningProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-slate-400 text-sm">Block ID</div>
                  <div className="text-white font-bold">
                    #{currentMiningBlock.id}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-slate-400 text-sm">Transactions</div>
                  <div className="text-white font-bold">
                    {currentMiningBlock.transactions.length}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-slate-400 text-sm">Difficulty</div>
                  <div className="text-white font-bold">
                    {currentMiningBlock.difficulty}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Transactions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-6 h-6 mr-2 text-yellow-400" />
              Transaction Pool ({pendingTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingTransactions.length === 0 ? (
                <div className="text-slate-400 text-center py-8">
                  No pending transactions
                </div>
              ) : (
                pendingTransactions.map((tx) => (
                  <div key={tx.id} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getTransactionColor(tx.type)}>
                        {getTransactionIcon(tx.type)}
                        <span className="ml-1">
                          {tx.type.replace("_", " ")}
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-yellow-500 text-yellow-400"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-300">
                      <div>
                        {tx.from} → {tx.to}
                      </div>
                      <div className="text-green-400 font-bold">
                        {tx.amount} GTT
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blockchain */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Link className="w-6 h-6 mr-2 text-blue-400" />
              Blockchain ({blockchain.length} blocks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {blockchain
                .slice()
                .reverse()
                .map((block, index) => (
                  <div key={block.id} className="relative">
                    {index < blockchain.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-blue-400"></div>
                    )}

                    <div
                      className={`rounded-lg p-4 ${
                        block.isMining
                          ? "bg-orange-900/20 border border-orange-700"
                          : block.isValid
                          ? "bg-green-900/20 border border-green-700"
                          : "bg-red-900/20 border border-red-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              block.isMining
                                ? "bg-orange-400 animate-pulse"
                                : block.isValid
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <div>
                            <div className="text-white font-bold">
                              Block #{block.id}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {new Date(block.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>

                        {block.isValid && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {block.isMining && (
                          <Cpu className="w-5 h-5 text-orange-400 animate-spin" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-slate-400">Hash: </span>
                          <span className="text-blue-400 font-mono text-xs">
                            {block.hash.slice(0, 20)}...
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="text-slate-400">Transactions: </span>
                          <span className="text-white">
                            {block.transactions.length}
                          </span>
                        </div>

                        {block.transactions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {block.transactions.map((tx) => (
                              <div key={tx.id} className="flex items-center">
                                <div
                                  className={`w-2 h-2 rounded-full mr-2 ${getTransactionColor(
                                    tx.type
                                  ).replace("bg-", "bg-")}`}
                                ></div>
                                <span className="text-xs text-slate-300">
                                  {tx.type.replace("_", " ")} - {tx.amount} GTT
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-6 h-6 mr-2 text-green-400" />
            How GUARDIANCHAIN Blockchain Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-900/20 rounded-lg p-4 mb-3">
                <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">Truth Capsules</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Users create truth capsules containing verified information that
                gets permanently stored on the blockchain
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-900/20 rounded-lg p-4 mb-3">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">Community Verification</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Community members verify capsules through consensus, earning GTT
                tokens for accurate verification
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-900/20 rounded-lg p-4 mb-3">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">GTT Rewards</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Automated reward distribution based on verification accuracy and
                contribution to truth discovery
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-900/20 rounded-lg p-4 mb-3">
                <Hash className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-white font-bold">Immutable Proof</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Once verified and mined into blocks, truth capsules become
                permanent, tamper-proof records
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainVisualization;
