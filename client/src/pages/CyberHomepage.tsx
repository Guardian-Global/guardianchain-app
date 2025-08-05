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
                <Card className="bg-[#161b22]/90 border-[#30363d] hover:border-[#00ffe1]/50 transition-all duration-300 group backdrop-blur-md shadow-[0_8px_32px_rgba(0,255,225,0.1)] overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="/public-objects/nft/cyberpunk-capsule-art.png" 
                      alt="Neural Capsule Technology"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23161b22'/%3E%3Cg transform='translate(200,100)'%3E%3Ccircle r='40' fill='none' stroke='%2300ffe1' stroke-width='2' opacity='0.8'/%3E%3Ccircle r='25' fill='none' stroke='%23ff00d4' stroke-width='1.5' opacity='0.6'/%3E%3Ccircle r='10' fill='%237c3aed' opacity='0.4'/%3E%3C/g%3E%3Ctext x='200' y='170' text-anchor='middle' fill='%2300ffe1' font-family='monospace' font-size='12'%3ENeural Capsule Matrix%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#00ffe1]/90 text-[#0d1117] backdrop-blur-sm font-bold">Neural Core</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00ffe1]/20 to-[#00ffe1]/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#00ffe1]/30 group-hover:to-[#00ffe1]/20 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,225,0.2)]">
                      <Database className="w-8 h-8 text-[#00ffe1]" />
                    </div>
                    <CardTitle className="text-[#fafbfc] text-2xl font-bold">Neural Truth Capsules</CardTitle>
                    <Badge className="bg-[#00ffe1]/10 text-[#00ffe1] border-[#00ffe1]/30 w-fit">Quantum Core</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#c9d1d9] text-lg leading-relaxed">
                      Revolutionary immutable memory containers powered by quantum-resistant encryption and AI consciousness verification.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00ffe1] rounded-full animate-pulse" />
                        <span className="text-[#c9d1d9]">Time-locked sealing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#ff00d4] rounded-full animate-pulse" />
                        <span className="text-[#c9d1d9]">Neural verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#7c3aed] rounded-full animate-pulse" />
                        <span className="text-[#c9d1d9]">Emotional scoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00ffe1] rounded-full animate-pulse" />
                        <span className="text-[#c9d1d9]">Legacy creation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* GTT Rewards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="bg-[#161b22]/90 border-[#30363d] hover:border-[#ff00d4]/50 transition-all duration-300 group backdrop-blur-md shadow-[0_8px_32px_rgba(255,0,212,0.1)] overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="/public-objects/nft/quantum-token-matrix.png" 
                      alt="GTT Quantum Token Matrix"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23161b22'/%3E%3Cdefs%3E%3ClinearGradient id='tokenGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ff00d4' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='%237c3aed' stop-opacity='0.6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform='translate(200,100)'%3E%3Cpolygon points='-30,-30 30,-30 40,0 30,30 -30,30 -40,0' fill='url(%23tokenGrad)' stroke='%23ff00d4' stroke-width='2'/%3E%3Ctext y='8' text-anchor='middle' fill='%23fafbfc' font-family='monospace' font-size='16' font-weight='bold'%3EGTT%3C/text%3E%3C/g%3E%3Ctext x='200' y='170' text-anchor='middle' fill='%23ff00d4' font-family='monospace' font-size='12'%3EQuantum Yield Matrix%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#ff00d4]/90 text-[#0d1117] backdrop-blur-sm font-bold">Yield Core</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ff00d4]/20 to-[#ff00d4]/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#ff00d4]/30 group-hover:to-[#ff00d4]/20 transition-all duration-300 shadow-[0_0_20px_rgba(255,0,212,0.2)]">
                      <Coins className="w-8 h-8 text-[#ff00d4]" />
                    </div>
                    <CardTitle className="text-[#fafbfc] text-2xl font-bold">Quantum GTT Rewards</CardTitle>
                    <Badge className="bg-[#ff00d4]/10 text-[#ff00d4] border-[#ff00d4]/30 w-fit">Neural Mining</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#c9d1d9] text-lg leading-relaxed">
                      Revolutionary blockchain yield farming through grief-score algorithms, neural verification, and quantum truth staking.
                    </p>
                    <div className="bg-[#0d1117]/60 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#c9d1d9] text-sm">Current APY</span>
                        <span className="text-[#ff00d4] font-bold text-lg">847.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#c9d1d9] text-sm">Truth Mining Rate</span>
                        <span className="text-[#00ffe1] font-bold">0.0375 GTT/hr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#c9d1d9] text-sm">Grief Multiplier</span>
                        <span className="text-[#7c3aed] font-bold">2.87x</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Blockchain Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card className="bg-[#161b22]/90 border-[#30363d] hover:border-[#7c3aed]/50 transition-all duration-300 group backdrop-blur-md shadow-[0_8px_32px_rgba(124,58,237,0.1)] overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="/public-objects/nft/multichain-fortress.png" 
                      alt="Quantum Security Matrix"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23161b22'/%3E%3Cdefs%3E%3ClinearGradient id='shieldGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%237c3aed' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='%2300ffe1' stop-opacity='0.6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform='translate(200,100)'%3E%3Cpath d='M0,-40 L-25,-10 L-25,20 L0,40 L25,20 L25,-10 Z' fill='url(%23shieldGrad)' stroke='%237c3aed' stroke-width='3'/%3E%3Ccircle r='15' fill='none' stroke='%2300ffe1' stroke-width='2' opacity='0.8'/%3E%3Cpath d='M-8,-5 L-3,5 L8,-10' stroke='%23fafbfc' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/g%3E%3Ctext x='200' y='170' text-anchor='middle' fill='%237c3aed' font-family='monospace' font-size='12'%3EQuantum Shield Network%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#7c3aed]/90 text-[#0d1117] backdrop-blur-sm font-bold">Fortress</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#7c3aed]/20 to-[#7c3aed]/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#7c3aed]/30 group-hover:to-[#7c3aed]/20 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                      <Shield className="w-8 h-8 text-[#7c3aed]" />
                    </div>
                    <CardTitle className="text-[#fafbfc] text-2xl font-bold">Quantum Fortress</CardTitle>
                    <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 w-fit">Neural Defense</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#c9d1d9] text-lg leading-relaxed">
                      Impenetrable multi-chain security matrix with quantum-resistant encryption and neural threat detection algorithms.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[#c9d1d9] text-sm">Security Rating</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-[#0d1117] rounded-full overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-r from-[#7c3aed] to-[#00ffe1] animate-pulse" />
                          </div>
                          <span className="text-[#00ffe1] font-bold text-sm">99.97%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="bg-[#0d1117]/60 rounded-md p-2">
                          <div className="text-[#00ffe1] font-bold">EVM</div>
                          <div className="text-[#c9d1d9]">Compatible</div>
                        </div>
                        <div className="bg-[#0d1117]/60 rounded-md p-2">
                          <div className="text-[#ff00d4] font-bold">L2</div>
                          <div className="text-[#c9d1d9]">Optimized</div>
                        </div>
                        <div className="bg-[#0d1117]/60 rounded-md p-2">
                          <div className="text-[#7c3aed] font-bold">ZK</div>
                          <div className="text-[#c9d1d9]">Proven</div>
                        </div>
                      </div>
                    </div>
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
                  src="/guardian-mascot.png" 
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