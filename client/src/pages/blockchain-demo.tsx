import React from 'react';
import BlockchainVisualization from '@/components/BlockchainVisualization';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Shield, Zap, TrendingUp, Crown } from "lucide-react";

const BlockchainDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Link className="w-16 h-16 text-blue-400 mr-4" />
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">
                  GUARDIANCHAIN
                </h1>
                <div className="text-xl text-blue-400">Blockchain Technology Demo</div>
              </div>
            </div>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Experience how blockchain technology powers truth verification, 
              community consensus, and decentralized governance in real-time
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">Immutable Truth</div>
                <div className="text-xs text-slate-400">Permanent verification records</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">Smart Rewards</div>
                <div className="text-xs text-slate-400">Automated GTT distribution</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">Consensus Mining</div>
                <div className="text-xs text-slate-400">Community-driven validation</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">Enterprise Grade</div>
                <div className="text-xs text-slate-400">Production-ready protocol</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlockchainVisualization />

        {/* Educational Sections */}
        <div className="mt-16 space-y-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">
                Understanding Blockchain in GUARDIANCHAIN
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white text-lg font-bold mb-3">What You're Seeing</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Transaction Pool:</strong> Pending truth capsule creations, verifications, and GTT rewards waiting to be processed</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Mining Process:</strong> Proof-of-work consensus finding valid hashes to secure blocks</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Blockchain:</strong> Immutable chain of blocks containing verified truth capsules and GTT transactions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Consensus:</strong> Community agreement on truth verification through decentralized voting</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-bold mb-3">Key Benefits</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start">
                        <Shield className="w-4 h-4 text-green-400 mt-1 mr-2 flex-shrink-0" />
                        <span><strong>Immutability:</strong> Truth capsules cannot be altered once verified and stored</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-4 h-4 text-blue-400 mt-1 mr-2 flex-shrink-0" />
                        <span><strong>Transparency:</strong> All verification processes are publicly auditable</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-4 h-4 text-purple-400 mt-1 mr-2 flex-shrink-0" />
                        <span><strong>Decentralization:</strong> No single point of failure or control</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-4 h-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                        <span><strong>Incentivization:</strong> GTT rewards encourage honest participation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-white text-lg font-bold mb-3">Real-World Applications</h3>
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-2">Legal Documentation</h4>
                        <p className="text-slate-300 text-sm">
                          Contracts, evidence, and legal proofs stored immutably with cryptographic verification
                        </p>
                      </div>
                      
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">Supply Chain Verification</h4>
                        <p className="text-slate-300 text-sm">
                          Product authenticity and origin tracking throughout entire supply chains
                        </p>
                      </div>
                      
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-purple-400 font-semibold mb-2">News & Media Verification</h4>
                        <p className="text-slate-300 text-sm">
                          Combating misinformation through community-verified truth capsules
                        </p>
                      </div>
                      
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-yellow-400 font-semibold mb-2">Academic Research</h4>
                        <p className="text-slate-300 text-sm">
                          Research data integrity and peer review processes with transparent validation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">
                Enterprise Value Proposition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-green-900/30 rounded-lg p-6 mb-4">
                    <div className="text-3xl font-bold text-green-400 mb-2">$10M+</div>
                    <div className="text-lg text-white font-semibold">Annual Savings</div>
                    <div className="text-sm text-slate-400">Through automation and verification</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Eliminate manual verification processes, reduce fraud, and automate compliance through blockchain technology
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-900/30 rounded-lg p-6 mb-4">
                    <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                    <div className="text-lg text-white font-semibold">Accuracy Rate</div>
                    <div className="text-sm text-slate-400">Community consensus verification</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Leverage collective intelligence and cryptographic proofs for unparalleled accuracy in truth verification
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-900/30 rounded-lg p-6 mb-4">
                    <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                    <div className="text-lg text-white font-semibold">Global Operations</div>
                    <div className="text-sm text-slate-400">Decentralized network uptime</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Operate continuously across global markets with no single point of failure or downtime
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDemo;