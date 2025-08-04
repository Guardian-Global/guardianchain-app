import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  Network,
  Database,
  Link2,
  Eye,
  Lock,
  Unlock,
  Hash,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  timestamp?: string;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: number;
  details?: string;
}

interface BlockchainVerificationData {
  capsuleId: string;
  verificationSteps: VerificationStep[];
  overallStatus: 'pending' | 'processing' | 'verified' | 'failed';
  truthScore: number;
  consensusReached: boolean;
  validatorCount: number;
  networkFees: number;
  estimatedTime: string;
}

interface BlockchainVerificationVisualizerProps {
  capsuleId: string;
  autoStart?: boolean;
}

export function BlockchainVerificationVisualizer({ 
  capsuleId, 
  autoStart = false 
}: BlockchainVerificationVisualizerProps) {
  const [verificationData, setVerificationData] = useState<BlockchainVerificationData>({
    capsuleId,
    verificationSteps: [
      {
        id: 'content-hash',
        name: 'Content Hashing',
        status: 'pending',
        description: 'Creating immutable content hash using SHA-256',
      },
      {
        id: 'ipfs-store',
        name: 'IPFS Storage',
        status: 'pending',
        description: 'Storing content on distributed IPFS network',
      },
      {
        id: 'smart-contract',
        name: 'Smart Contract Execution',
        status: 'pending',
        description: 'Executing verification logic on blockchain',
      },
      {
        id: 'validator-consensus',
        name: 'Validator Consensus',
        status: 'pending',
        description: 'Collecting validator signatures and consensus',
      },
      {
        id: 'truth-scoring',
        name: 'Truth Score Calculation',
        status: 'pending',
        description: 'AI-powered truth score analysis and validation',
      },
      {
        id: 'nft-mint',
        name: 'NFT Minting',
        status: 'pending',
        description: 'Minting verification certificate as NFT',
      }
    ],
    overallStatus: 'pending',
    truthScore: 0,
    consensusReached: false,
    validatorCount: 0,
    networkFees: 0,
    estimatedTime: '2-3 minutes'
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (autoStart) {
      startVerification();
    }
  }, [autoStart]);

  const startVerification = () => {
    setIsRunning(true);
    setVerificationData(prev => ({ ...prev, overallStatus: 'processing' }));
    processNextStep(0);
  };

  const processNextStep = (stepIndex: number) => {
    if (stepIndex >= verificationData.verificationSteps.length) {
      completeVerification();
      return;
    }

    setCurrentStep(stepIndex);
    
    // Update step to processing
    setVerificationData(prev => ({
      ...prev,
      verificationSteps: prev.verificationSteps.map((step, index) => 
        index === stepIndex 
          ? { ...step, status: 'processing' }
          : step
      )
    }));

    // Simulate processing time
    const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    
    setTimeout(() => {
      // Complete current step
      setVerificationData(prev => ({
        ...prev,
        verificationSteps: prev.verificationSteps.map((step, index) => 
          index === stepIndex 
            ? { 
                ...step, 
                status: 'completed',
                timestamp: new Date().toISOString(),
                transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
                blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
                gasUsed: Math.floor(Math.random() * 50000) + 21000
              }
            : step
        ),
        validatorCount: prev.validatorCount + Math.floor(Math.random() * 3) + 1,
        networkFees: prev.networkFees + (Math.random() * 0.01),
        truthScore: Math.min(100, prev.truthScore + Math.floor(Math.random() * 20) + 10)
      }));

      // Process next step
      setTimeout(() => processNextStep(stepIndex + 1), 500);
    }, processingTime);
  };

  const completeVerification = () => {
    setVerificationData(prev => ({
      ...prev,
      overallStatus: 'verified',
      consensusReached: true,
      truthScore: Math.max(prev.truthScore, 75) // Ensure minimum score
    }));
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-[#10b981]" />;
      case 'processing': return <Clock className="w-5 h-5 text-[#f59e0b] animate-spin" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-[#ef4444]" />;
      default: return <Clock className="w-5 h-5 text-[#8b949e]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-[#10b981] bg-[#10b981]/10';
      case 'processing': return 'border-[#f59e0b] bg-[#f59e0b]/10';
      case 'failed': return 'border-[#ef4444] bg-[#ef4444]/10';
      default: return 'border-[#30363d] bg-[#21262d]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
            <Shield className="w-5 h-5 text-[#00ffe1]" />
            Blockchain Verification Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00ffe1] mb-1">
                {verificationData.truthScore}%
              </div>
              <div className="text-sm text-[#8b949e]">Truth Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ff00d4] mb-1">
                {verificationData.validatorCount}
              </div>
              <div className="text-sm text-[#8b949e]">Validators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#7c3aed] mb-1">
                {verificationData.networkFees.toFixed(4)} ETH
              </div>
              <div className="text-sm text-[#8b949e]">Network Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10b981] mb-1">
                {verificationData.estimatedTime}
              </div>
              <div className="text-sm text-[#8b949e]">Est. Time</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="outline" 
              className={`${
                verificationData.overallStatus === 'verified' 
                  ? 'border-[#10b981] text-[#10b981]'
                  : verificationData.overallStatus === 'processing'
                  ? 'border-[#f59e0b] text-[#f59e0b]'
                  : 'border-[#8b949e] text-[#8b949e]'
              }`}
            >
              {verificationData.overallStatus.toUpperCase()}
            </Badge>
            
            {!isRunning && verificationData.overallStatus === 'pending' && (
              <Button
                onClick={startVerification}
                className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Verification
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[#8b949e] mb-2">
              <span>Verification Progress</span>
              <span>
                {verificationData.verificationSteps.filter(s => s.status === 'completed').length}/
                {verificationData.verificationSteps.length}
              </span>
            </div>
            <Progress 
              value={(verificationData.verificationSteps.filter(s => s.status === 'completed').length / verificationData.verificationSteps.length) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
            <Network className="w-5 h-5 text-[#7c3aed]" />
            Verification Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationData.verificationSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(step.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(step.status)}
                    <div>
                      <h4 className="font-semibold text-[#f0f6fc]">{step.name}</h4>
                      <p className="text-sm text-[#8b949e]">{step.description}</p>
                    </div>
                  </div>
                  {step.status === 'processing' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5 text-[#f59e0b]" />
                    </motion.div>
                  )}
                </div>

                {step.status === 'completed' && step.transactionHash && (
                  <div className="mt-3 pt-3 border-t border-[#30363d]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3 text-[#8b949e]" />
                        <span className="text-[#8b949e]">Hash:</span>
                        <code className="text-[#00ffe1] font-mono">
                          {step.transactionHash.substring(0, 10)}...
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-[#8b949e]" />
                        <span className="text-[#8b949e]">Block:</span>
                        <span className="text-[#ff00d4]">{step.blockNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-3 h-3 text-[#8b949e]" />
                        <span className="text-[#8b949e]">Gas:</span>
                        <span className="text-[#7c3aed]">{step.gasUsed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Complete */}
      <AnimatePresence>
        {verificationData.overallStatus === 'verified' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="bg-gradient-to-r from-[#10b981]/20 to-[#00ffe1]/20 border-[#10b981]">
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#f0f6fc] mb-2">
                    Verification Complete!
                  </h3>
                  <p className="text-[#8b949e] mb-4">
                    Your capsule has been successfully verified and stored on the blockchain.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button className="bg-[#10b981] text-white hover:bg-[#059669]">
                      <Eye className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                    <Button variant="outline" className="border-[#30363d] text-[#8b949e]">
                      <Link2 className="w-4 h-4 mr-2" />
                      Share Verification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}