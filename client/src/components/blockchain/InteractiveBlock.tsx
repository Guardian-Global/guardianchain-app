import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, Clock, Database, Zap, CheckCircle } from 'lucide-react';

interface InteractiveBlockProps {
  blockId: number;
  previousHash: string;
  onBlockMined: (blockData: any) => void;
  isActive: boolean;
}

export default function InteractiveBlock({ blockId, previousHash, onBlockMined, isActive }: InteractiveBlockProps) {
  const [nonce, setNonce] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [hash, setHash] = useState('');
  const [difficulty, setDifficulty] = useState(4);
  const [attempts, setAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const transactions = [
    'Alice sends 50 GTT to Bob',
    'Capsule #247 verified as TRUE',
    'Guardian Pass #42 minted',
    'Vault auto-compound: +125 GTT'
  ];

  // Simulate hash calculation
  useEffect(() => {
    if (isMining && !isComplete) {
      const timer = setInterval(() => {
        const newNonce = nonce + 1;
        setNonce(newNonce);
        setAttempts(prev => prev + 1);
        setTimeElapsed(prev => prev + 0.1);

        // Simulate hash generation
        const mockHash = generateMockHash(blockId, previousHash, newNonce);
        setHash(mockHash);

        // Check if hash meets difficulty requirement
        if (mockHash.startsWith('0'.repeat(difficulty))) {
          setIsMining(false);
          setIsComplete(true);
          onBlockMined({
            id: blockId,
            hash: mockHash,
            previousHash,
            nonce: newNonce,
            timestamp: Date.now(),
            attempts,
            timeElapsed
          });
        }

        // Auto-complete after reasonable attempts for demo
        if (attempts > 100) {
          const validHash = '0'.repeat(difficulty) + mockHash.slice(difficulty);
          setHash(validHash);
          setIsMining(false);
          setIsComplete(true);
          onBlockMined({
            id: blockId,
            hash: validHash,
            previousHash,
            nonce: newNonce,
            timestamp: Date.now(),
            attempts,
            timeElapsed
          });
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isMining, nonce, blockId, previousHash, difficulty, attempts, timeElapsed, isComplete, onBlockMined]);

  const generateMockHash = (id: number, prevHash: string, nonceValue: number) => {
    // Simple hash simulation for demo purposes
    const data = `${id}${prevHash}${nonceValue}${Date.now()}`;
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += Math.floor(Math.random() * 16).toString(16);
    }
    return hash;
  };

  const startMining = () => {
    if (!isMining && !isComplete) {
      setIsMining(true);
      setAttempts(0);
      setTimeElapsed(0);
    }
  };

  const resetBlock = () => {
    setNonce(0);
    setIsMining(false);
    setHash('');
    setAttempts(0);
    setTimeElapsed(0);
    setIsComplete(false);
  };

  return (
    <Card className={`p-6 transition-all duration-300 ${
      !isActive ? 'opacity-50 scale-95' : 
      isComplete ? 'border-green-500 shadow-green-500/20 shadow-lg' :
      isMining ? 'border-yellow-500 shadow-yellow-500/20 shadow-lg animate-pulse' :
      'border-slate-600 hover:border-slate-500'
    }`}>
      <div className="space-y-4">
        {/* Block Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isComplete ? 'bg-green-600' : isMining ? 'bg-yellow-600' : 'bg-slate-600'
            }`}>
              {isComplete ? <CheckCircle className="w-4 h-4" /> : <Database className="w-4 h-4" />}
            </div>
            <h3 className="text-lg font-semibold text-white">Block #{blockId}</h3>
          </div>
          <Badge variant={isComplete ? 'default' : isMining ? 'secondary' : 'outline'}>
            {isComplete ? 'Mined' : isMining ? 'Mining...' : 'Pending'}
          </Badge>
        </div>

        {/* Block Data */}
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Hash className="w-3 h-3" />
              Previous Hash
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-800 p-2 rounded">
              {previousHash || '0000000000000000...'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Database className="w-3 h-3" />
              Transactions ({transactions.length})
            </div>
            <div className="space-y-1">
              {transactions.map((tx, i) => (
                <div key={i} className="text-xs text-slate-300 bg-slate-800/50 p-2 rounded">
                  {tx}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 mb-1">Nonce</div>
              <div className="font-mono text-white">{nonce.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Attempts</div>
              <div className="font-mono text-white">{attempts.toLocaleString()}</div>
            </div>
          </div>

          {(isMining || isComplete) && (
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Hash className="w-3 h-3" />
                Current Hash
              </div>
              <div className="font-mono text-xs text-slate-300 bg-slate-800 p-2 rounded break-all">
                {hash || 'Calculating...'}
              </div>
              {isComplete && (
                <div className="text-xs text-green-400 mt-1">
                  ✓ Hash starts with {difficulty} zeros - Block is valid!
                </div>
              )}
            </div>
          )}

          {(isMining || isComplete) && (
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeElapsed.toFixed(1)}s
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {(attempts / timeElapsed).toFixed(0)} H/s
              </div>
            </div>
          )}
        </div>

        {/* Mining Controls */}
        <div className="flex gap-2 pt-2">
          {!isComplete && (
            <Button
              onClick={startMining}
              disabled={isMining || !isActive}
              size="sm"
              className={isMining ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isMining ? 'Mining...' : 'Start Mining'}
            </Button>
          )}
          
          <Button
            onClick={resetBlock}
            disabled={isMining}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Reset
          </Button>

          {!isComplete && (
            <div className="flex items-center ml-auto">
              <label className="text-xs text-slate-400 mr-2">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                disabled={isMining}
                className="text-xs bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
              >
                <option value={2}>Easy (2)</option>
                <option value={3}>Medium (3)</option>
                <option value={4}>Hard (4)</option>
                <option value={5}>Very Hard (5)</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}