import React from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Play, TrendingUp, Users, CheckCircle, Coins, Globe, Award, Rocket, Star, Zap, Code, Database, Lock, ArrowRight, Clock, Layers, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CyberHero from "@/components/CyberHero";

export default function CyberHomepage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>GuardianChain | Sovereign Truth Infrastructure</title>
        <meta name="description" content="Sovereign truth infrastructure for time-locked proof, grief-score yield, and capsule monetization." />
        <meta name="keywords" content="Web3, Blockchain, Truth, Verification, NFT, GTT Token, Capsules, Polygon, DeFi" />
        <meta property="og:title" content="GuardianChain | Sovereign Truth Infrastructure" />
        <meta property="og:description" content="The sovereign Web3 infrastructure for quantum-secured truth preservation, time-locked proof, and capsule monetization." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://guardianchain.app" />
      </Helmet>

      <main className="min-h-screen bg-[#0d1117] text-[#fafbfc] overflow-hidden">
        {/* Cyberpunk Hero Section */}
        <CyberHero />
        
        {/* Features Section */}
        <section className="relative px-6 py-20 bg-gradient-to-br from-[#161b22] to-[#0d1117]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-[#00ffe1] font-[Orbitron] mb-6 drop-shadow-[0_0_15px_rgba(0,255,225,0.5)]">
                Core Features
              </h2>
              <p className="text-2xl text-[#c9d1d9] max-w-4xl mx-auto leading-relaxed">
                Revolutionary Web3 infrastructure for quantum-secured truth preservation, time-locked proof, and capsule monetization
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <Badge className="bg-[#00ffe1]/10 text-[#00ffe1] border-[#00ffe1]/30 px-4 py-2 text-lg">Enterprise Ready</Badge>
                <Badge className="bg-[#ff00d4]/10 text-[#ff00d4] border-[#ff00d4]/30 px-4 py-2 text-lg">AI Powered</Badge>
                <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 px-4 py-2 text-lg">Multi-Chain</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capsule Creation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="bg-[#161b22]/90 border-[#30363d] hover:border-[#00ffe1]/50 transition-all duration-300 group backdrop-blur-md shadow-[0_8px_32px_rgba(0,255,225,0.1)]">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00ffe1]/20 to-[#00ffe1]/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#00ffe1]/30 group-hover:to-[#00ffe1]/20 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,225,0.2)]">
                      <Database className="w-8 h-8 text-[#00ffe1]" />
                    </div>
                    <CardTitle className="text-[#fafbfc] text-2xl font-bold">Truth Capsules</CardTitle>
                    <Badge className="bg-[#00ffe1]/10 text-[#00ffe1] border-[#00ffe1]/30 w-fit">Core Feature</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#c9d1d9] text-lg leading-relaxed">
                      Create immutable truth capsules with AI-powered verification, emotional analysis, and quantum-resistant time-locked encryption.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* GTT Rewards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="bg-[#161b22]/90 border-[#30363d] hover:border-[#ff00d4]/50 transition-all duration-300 group backdrop-blur-md shadow-[0_8px_32px_rgba(255,0,212,0.1)]">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ff00d4]/20 to-[#ff00d4]/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#ff00d4]/30 group-hover:to-[#ff00d4]/20 transition-all duration-300 shadow-[0_0_20px_rgba(255,0,212,0.2)]">
                      <Coins className="w-8 h-8 text-[#ff00d4]" />
                    </div>
                    <CardTitle className="text-[#fafbfc] text-2xl font-bold">GTT Rewards</CardTitle>
                    <Badge className="bg-[#ff00d4]/10 text-[#ff00d4] border-[#ff00d4]/30 w-fit">Yield System</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#c9d1d9] text-lg leading-relaxed">
                      Earn Guardian Truth Tokens through grief scoring, community verification, and sophisticated yield calculation algorithms.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Blockchain Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card className="bg-[#161b22]/90 border-[#30363d] hover:border-[#7c3aed]/50 transition-all duration-300 group backdrop-blur-md shadow-[0_8px_32px_rgba(124,58,237,0.1)]">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#7c3aed]/20 to-[#7c3aed]/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#7c3aed]/30 group-hover:to-[#7c3aed]/20 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                      <Shield className="w-8 h-8 text-[#7c3aed]" />
                    </div>
                    <CardTitle className="text-[#fafbfc] text-2xl font-bold">Blockchain Security</CardTitle>
                    <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 w-fit">Multi-Chain</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#c9d1d9] text-lg leading-relaxed">
                      Multi-chain infrastructure with quantum-resistant encryption, decentralized storage, and enterprise-grade validation.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Advanced Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-20"
            >
              <h3 className="text-3xl font-bold text-[#c9d1d9] text-center mb-12 font-[Orbitron]">
                Advanced Infrastructure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#00ffe1]/30 transition-all">
                  <Clock className="w-12 h-12 text-[#00ffe1] mx-auto mb-4" />
                  <h4 className="text-[#fafbfc] font-bold text-lg mb-2">Time-Locked Encryption</h4>
                  <p className="text-[#c9d1d9] text-sm">Quantum-resistant temporal capsules</p>
                </div>
                <div className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#ff00d4]/30 transition-all">
                  <Network className="w-12 h-12 text-[#ff00d4] mx-auto mb-4" />
                  <h4 className="text-[#fafbfc] font-bold text-lg mb-2">AI Verification</h4>
                  <p className="text-[#c9d1d9] text-sm">GPT-4o powered truth analysis</p>
                </div>
                <div className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#7c3aed]/30 transition-all">
                  <Layers className="w-12 h-12 text-[#7c3aed] mx-auto mb-4" />
                  <h4 className="text-[#fafbfc] font-bold text-lg mb-2">Multi-Chain</h4>
                  <p className="text-[#c9d1d9] text-sm">Ethereum, Polygon, Base, Arbitrum</p>
                </div>
                <div className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#10b981]/30 transition-all">
                  <Award className="w-12 h-12 text-[#10b981] mx-auto mb-4" />
                  <h4 className="text-[#fafbfc] font-bold text-lg mb-2">DAO Governance</h4>
                  <p className="text-[#c9d1d9] text-sm">Community-driven validation</p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-center mt-20"
            >
              {!isAuthenticated ? (
                <div className="space-y-6">
                  <div className="space-x-4">
                    <Link href="/api/login">
                      <Button className="bg-gradient-to-r from-[#00ffe1] to-[#00e5cb] text-[#0d1117] hover:from-[#00e5cb] hover:to-[#00ffe1] px-10 py-4 text-xl font-bold shadow-[0_0_25px_rgba(0,255,225,0.4)] transition-all transform hover:scale-105">
                        <Play className="w-6 h-6 mr-3" />
                        Launch GuardianChain
                      </Button>
                    </Link>
                    <Link href="/explorer">
                      <Button variant="outline" className="border-[#ff00d4] text-[#ff00d4] hover:bg-[#ff00d4]/10 px-8 py-4 text-lg">
                        <Globe className="w-5 h-5 mr-2" />
                        Explore
                      </Button>
                    </Link>
                  </div>
                  <p className="text-[#c9d1d9] text-lg">
                    Join the sovereign truth revolution • 2,847 active guardians
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-x-4">
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-[#ff00d4] to-[#e600c2] text-[#fafbfc] hover:from-[#e600c2] hover:to-[#ff00d4] px-10 py-4 text-xl font-bold shadow-[0_0_25px_rgba(255,0,212,0.4)] transition-all transform hover:scale-105">
                        <TrendingUp className="w-6 h-6 mr-3" />
                        Enter Dashboard
                      </Button>
                    </Link>
                    <Link href="/create">
                      <Button variant="outline" className="border-[#00ffe1] text-[#00ffe1] hover:bg-[#00ffe1]/10 px-8 py-4 text-lg">
                        <Database className="w-5 h-5 mr-2" />
                        Create Capsule
                      </Button>
                    </Link>
                  </div>
                  <p className="text-[#c9d1d9] text-lg">
                    Welcome back, Guardian • Truth Score: 87 • GTT Earned: 12,547
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="relative px-6 py-20 bg-gradient-to-br from-[#0d1117] to-[#161b22] border-t border-[#30363d]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-[#fafbfc] font-[Orbitron] mb-4">Platform Analytics</h2>
              <p className="text-xl text-[#c9d1d9]">Real-time sovereign truth network metrics</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#00ffe1]/30 transition-all"
              >
                <div className="text-4xl font-bold text-[#00ffe1] font-[Orbitron] drop-shadow-[0_0_10px_rgba(0,255,225,0.3)]">12,547</div>
                <div className="text-[#c9d1d9] mt-2 font-medium">Truth Capsules</div>
                <div className="text-[#8b949e] text-sm mt-1">+247 this week</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#ff00d4]/30 transition-all"
              >
                <div className="text-4xl font-bold text-[#ff00d4] font-[Orbitron] drop-shadow-[0_0_10px_rgba(255,0,212,0.3)]">2,847</div>
                <div className="text-[#c9d1d9] mt-2 font-medium">Active Guardians</div>
                <div className="text-[#8b949e] text-sm mt-1">+89 this week</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#7c3aed]/30 transition-all"
              >
                <div className="text-4xl font-bold text-[#7c3aed] font-[Orbitron] drop-shadow-[0_0_10px_rgba(124,58,237,0.3)]">$89.3K</div>
                <div className="text-[#c9d1d9] mt-2 font-medium">GTT Rewards Paid</div>
                <div className="text-[#8b949e] text-sm mt-1">+$12.4K this week</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-[#30363d] hover:border-[#10b981]/30 transition-all"
              >
                <div className="text-4xl font-bold text-[#10b981] font-[Orbitron] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">99.8%</div>
                <div className="text-[#c9d1d9] mt-2 font-medium">Network Uptime</div>
                <div className="text-[#8b949e] text-sm mt-1">Enterprise grade</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer with Guardian Mascot */}
        <footer className="bg-[#0d1117] border-t border-[#30363d] px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <img 
                  src="/assets/mascot/guardian_mascot.png" 
                  alt="Guardian Mascot" 
                  className="w-16 h-16 rounded-full border-2 border-[#00ffe1] shadow-[0_0_15px_rgba(0,255,225,0.3)]"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#fafbfc] font-[Orbitron]">GuardianChain</h3>
                  <p className="text-[#c9d1d9]">Sovereign Truth Infrastructure</p>
                </div>
              </div>
              <div className="flex space-x-6 text-[#c9d1d9]">
                <Link href="/terms" className="hover:text-[#00ffe1] transition-colors">Terms</Link>
                <Link href="/pricing" className="hover:text-[#00ffe1] transition-colors">Pricing</Link>
                <Link href="/explorer" className="hover:text-[#00ffe1] transition-colors">Explorer</Link>
                <Link href="/dao" className="hover:text-[#00ffe1] transition-colors">DAO</Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-[#30363d] text-center">
              <p className="text-[#8b949e]">
                © 2025 GuardianChain. Powered by quantum-resistant blockchain technology.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}