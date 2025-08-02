import React from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Play, TrendingUp, Users, CheckCircle, Coins, Globe, Award } from "lucide-react";

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

      <main className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white via-yellow-50 to-yellow-200 text-gray-900">
        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-5xl mx-auto">
            <p className="uppercase text-sm tracking-widest font-semibold text-yellow-600 mb-4">
              🚀 Revolutionary Web3 Truth Platform
            </p>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-yellow-700 drop-shadow-sm mb-6">
              GuardianChain
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Sovereign infrastructure for time-locked proof, grief-score yield, and capsule monetization.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Enter Dashboard
                    </button>
                  </Link>
                  <Link href="/create">
                    <button className="border-2 border-yellow-500 text-yellow-700 px-8 py-4 rounded-lg hover:bg-yellow-100 transition-all flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Create Capsule
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Enter Dashboard
                    </button>
                  </Link>
                  <Link href="/explore">
                    <button className="border-2 border-yellow-500 text-yellow-700 px-8 py-4 rounded-lg hover:bg-yellow-100 transition-all flex items-center justify-center gap-2">
                      <Play className="w-5 h-5" />
                      Watch Demo
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-gray-800 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium">Blockchain Secured</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">10,000+ Guardians</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">45,231 Truth Capsules</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <Coins className="w-6 h-6 text-yellow-600 mb-2" />
                <span className="text-sm font-medium">$2.4M Locked</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <Globe className="w-6 h-6 text-cyan-600 mb-2" />
                <span className="text-sm font-medium">67 Countries</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/50 rounded-lg">
                <Award className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium">12.3% APY</span>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Section */}
        <section className="flex justify-center bg-gradient-to-t from-yellow-200 via-white to-transparent py-12">
          <div className="text-center">
            <img 
              src="/assets/GUARDIANCHAIN_logo.png" 
              alt="GuardianChain Logo" 
              className="h-32 sm:h-40 object-contain drop-shadow-lg mx-auto mb-4" 
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.currentTarget;
                target.style.display = 'none';
                const textLogo = document.createElement('div');
                textLogo.innerHTML = '<span class="text-4xl font-bold text-yellow-600">GuardianChain</span>';
                textLogo.className = 'h-32 flex items-center justify-center';
                target.parentNode?.appendChild(textLogo);
              }}
            />
            <p className="text-sm text-gray-600 font-medium">
              Powered by Polygon • Secured by Blockchain
            </p>
          </div>
        </section>
      </main>
    </>
  );
}