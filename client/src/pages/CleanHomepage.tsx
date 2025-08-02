import React from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Play, TrendingUp, Users, CheckCircle, Coins, Globe, Award, Rocket, Star, Zap } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { AdvancedCard, AdvancedCardContent, AdvancedCardHeader, AdvancedCardTitle } from "@/components/ui/advanced-card";
import OptimizedImage from "@/components/layout/OptimizedImage";
import InteractiveBackground from "@/components/ui/interactive-background";
import FloatingActionMenu from "@/components/layout/FloatingActionMenu";

export default function CleanHomepage() {
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

      <main className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-900 via-purple-900 to-black text-white overflow-hidden">
        {/* Hero Section with Advanced Animations */}
        <section className="relative px-6 py-20 text-center overflow-hidden">
          {/* Interactive Background */}
          <InteractiveBackground 
            variant="quantum" 
            particleCount={80}
            colors={["#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"]}
          />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-yellow-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent)] animate-pulse" />
          
          <div className="relative max-w-6xl mx-auto z-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="uppercase text-sm tracking-widest font-semibold text-cyan-400 mb-6 flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              Revolutionary Web3 Truth Platform
              <Star className="w-4 h-4" />
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-8 quantum-float"
            >
              🛡️ GuardianChain
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Immutable memory. Verifiable truth. Capsule-based sovereign storage and yield.
            </motion.p>

            {/* Enhanced Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
            >
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <EnhancedButton 
                      variant="quantum" 
                      size="xl"
                      className="px-10 py-4 text-lg font-bold"
                    >
                      <TrendingUp className="w-6 h-6 mr-2" />
                      Enter Dashboard
                    </EnhancedButton>
                  </Link>
                  <Link href="/create">
                    <EnhancedButton 
                      variant="glass" 
                      size="xl"
                      className="px-10 py-4 text-lg font-bold border-cyan-400 text-cyan-400 hover:text-white"
                    >
                      <Shield className="w-6 h-6 mr-2" />
                      Create Capsule
                    </EnhancedButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <EnhancedButton 
                      variant="quantum" 
                      size="xl"
                      className="px-10 py-4 text-lg font-bold"
                    >
                      <Shield className="w-6 h-6 mr-2" />
                      Enter Dashboard
                    </EnhancedButton>
                  </Link>
                  <Link href="/explore">
                    <EnhancedButton 
                      variant="glass" 
                      size="xl"
                      className="px-10 py-4 text-lg font-bold border-cyan-400 text-cyan-400 hover:text-white"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Watch Demo
                    </EnhancedButton>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Advanced Platform Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
            >
              <AdvancedCard 
                variant="glass" 
                className="flex flex-col items-center p-6 hover-lift"
              >
                <CheckCircle className="w-8 h-8 text-green-400 mb-3 glow-animation" />
                <span className="text-sm font-medium text-center text-white">Blockchain Secured</span>
              </AdvancedCard>
              <AdvancedCard 
                variant="glass" 
                className="flex flex-col items-center p-6 hover-lift"
              >
                <Users className="w-8 h-8 text-blue-400 mb-3 glow-animation" />
                <span className="text-sm font-medium text-center text-white">10,000+ Guardians</span>
              </AdvancedCard>
              <AdvancedCard 
                variant="glass" 
                className="flex flex-col items-center p-6 hover-lift"
              >
                <Shield className="w-8 h-8 text-purple-400 mb-3 glow-animation" />
                <span className="text-sm font-medium text-center text-white">45,231 Truth Capsules</span>
              </AdvancedCard>
              <AdvancedCard 
                variant="glass" 
                className="flex flex-col items-center p-6 hover-lift"
              >
                <Coins className="w-8 h-8 text-yellow-400 mb-3 glow-animation" />
                <span className="text-sm font-medium text-center text-white">$2.4M Locked</span>
              </AdvancedCard>
              <AdvancedCard 
                variant="glass" 
                className="flex flex-col items-center p-6 hover-lift"
              >
                <Globe className="w-8 h-8 text-cyan-400 mb-3 glow-animation" />
                <span className="text-sm font-medium text-center text-white">67 Countries</span>
              </AdvancedCard>
              <AdvancedCard 
                variant="glass" 
                className="flex flex-col items-center p-6 hover-lift"
              >
                <Award className="w-8 h-8 text-orange-400 mb-3 glow-animation" />
                <span className="text-sm font-medium text-center text-white">12.3% APY</span>
              </AdvancedCard>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Logo Section */}
        <section className="relative flex justify-center py-16">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-900/20 to-transparent" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative text-center z-10"
          >
            <OptimizedImage
              src="/assets/GUARDIANCHAIN_logo.png"
              alt="GuardianChain Logo"
              fallback="/assets/GTT_logo.png"
              className="h-40 sm:h-48 w-auto mx-auto mb-6 quantum-float"
              withBlur={true}
              priority={true}
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg font-medium text-gray-300 flex items-center justify-center gap-3"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Powered by Polygon
              </span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Secured by Blockchain
              </span>
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="text-sm text-gray-500 mt-2"
            >
              © 2025 GuardianChain • Truth Protocol
            </motion.p>
          </motion.div>
        </section>

        {/* Floating Action Menu */}
        <FloatingActionMenu />
      </main>
    </>
  );
}