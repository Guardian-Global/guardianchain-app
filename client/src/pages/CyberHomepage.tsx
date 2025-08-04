import React from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Play, TrendingUp, Users, CheckCircle, Coins, Globe, Award, Rocket, Star, Zap, Code, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <main className="min-h-screen bg-[#0d1117] text-[#f0f6fc] overflow-hidden">
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
              <h2 className="text-4xl font-bold text-[#00ffe1] font-[Orbitron] mb-4 drop-shadow-[0_0_10px_rgba(0,255,225,0.3)]">
                Core Features
              </h2>
              <p className="text-xl text-[#8b949e] max-w-3xl mx-auto">
                Revolutionary Web3 infrastructure for truth preservation and monetization
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capsule Creation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#00ffe1]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00ffe1]/20 transition-all">
                      <Database className="w-6 h-6 text-[#00ffe1]" />
                    </div>
                    <CardTitle className="text-[#f0f6fc] text-xl">Truth Capsules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#8b949e]">
                      Create immutable truth capsules with AI-powered verification and time-locked encryption.
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
                <Card className="bg-[#161b22] border-[#30363d] hover:border-[#ff00d4]/30 transition-all group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#ff00d4]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#ff00d4]/20 transition-all">
                      <Coins className="w-6 h-6 text-[#ff00d4]" />
                    </div>
                    <CardTitle className="text-[#f0f6fc] text-xl">GTT Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#8b949e]">
                      Earn Guardian Truth Tokens through grief scoring and community verification.
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
                <Card className="bg-[#161b22] border-[#30363d] hover:border-[#7c3aed]/30 transition-all group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#7c3aed]/20 transition-all">
                      <Shield className="w-6 h-6 text-[#7c3aed]" />
                    </div>
                    <CardTitle className="text-[#f0f6fc] text-xl">Blockchain Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#8b949e]">
                      Multi-chain infrastructure with quantum-resistant encryption and decentralized storage.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-16"
            >
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <Link href="/api/login">
                    <Button className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] px-8 py-3 text-lg shadow-[0_0_15px_rgba(0,255,225,0.3)] transition-all">
                      <Play className="w-5 h-5 mr-2" />
                      Launch App
                    </Button>
                  </Link>
                  <p className="text-[#8b949e]">
                    Join the sovereign truth revolution
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link href="/dashboard">
                    <Button className="bg-[#ff00d4] text-[#0d1117] hover:bg-[#e600c2] px-8 py-3 text-lg shadow-[0_0_15px_rgba(255,0,212,0.3)] transition-all">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Enter Dashboard
                    </Button>
                  </Link>
                  <p className="text-[#8b949e]">
                    Welcome back, Guardian
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative px-6 py-16 bg-[#0d1117] border-t border-[#30363d]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#00ffe1] font-[Orbitron]">12,547</div>
                <div className="text-[#8b949e] mt-1">Truth Capsules</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#ff00d4] font-[Orbitron]">2,847</div>
                <div className="text-[#8b949e] mt-1">Active Guardians</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#7c3aed] font-[Orbitron]">$89.3K</div>
                <div className="text-[#8b949e] mt-1">GTT Rewards Paid</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#10b981] font-[Orbitron]">99.8%</div>
                <div className="text-[#8b949e] mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}