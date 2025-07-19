import React from 'react';
import BlockchainVisualization from '@/components/BlockchainVisualization';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Shield, Coins, Zap } from "lucide-react";

const BlockchainDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            GUARDIANCHAIN Blockchain Technology
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Interactive visualization of how GUARDIANCHAIN's blockchain secures truth capsules, 
            processes verifications, and distributes GTT token rewards through decentralized consensus.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Concept Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-400" />
                Truth Capsules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Each truth capsule is permanently recorded on the blockchain with cryptographic hashing, 
                ensuring immutable proof of authenticity and preventing tampering.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Link2 className="w-6 h-6 mr-2 text-blue-400" />
                Chain Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Blocks are cryptographically linked through hash pointers, creating an immutable chain 
                where any alteration would be immediately detected by the network.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Coins className="w-6 h-6 mr-2 text-green-400" />
                GTT Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Verified truth contributions earn GTT tokens through smart contracts, 
                incentivizing quality submissions and accurate community verification.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Visualization */}
        <BlockchainVisualization />

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Proof of Work Mining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-300">
                <p className="text-sm">
                  GUARDIANCHAIN uses a modified Proof of Work consensus mechanism optimized for truth verification:
                </p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Miners compete to solve cryptographic puzzles</li>
                  <li>Difficulty adjusts based on network participation</li>
                  <li>Block rewards include GTT tokens for successful mining</li>
                  <li>Priority given to truth verification transactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                  <div>
                    <div className="text-white font-medium">Capsule Creation</div>
                    <div className="text-slate-400 text-sm">New truth capsule submission</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                  <div>
                    <div className="text-white font-medium">Verification</div>
                    <div className="text-slate-400 text-sm">Community truth verification vote</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <div>
                    <div className="text-white font-medium">Reward</div>
                    <div className="text-slate-400 text-sm">GTT token distribution</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Use */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How to Use This Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
              <div>
                <h4 className="text-white font-medium mb-2">Controls</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li><strong>Start Mining:</strong> Begin automatic block generation</li>
                  <li><strong>Validate Chain:</strong> Check blockchain integrity</li>
                  <li><strong>Reset:</strong> Return to genesis block</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Watch For</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Mining progress and proof-of-work completion</li>
                  <li>Hash linking between consecutive blocks</li>
                  <li>Transaction pool updates and confirmations</li>
                  <li>Network statistics and blockchain growth</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlockchainDemo;