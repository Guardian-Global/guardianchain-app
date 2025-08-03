import React from "react";
import { Shield, Coins, Zap, Brain, Lock, Globe } from "lucide-react";
import DisclaimerBlock from "@/components/DisclaimerBlock";

export default function Start() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Start Here: What Is GuardianChain?
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            GuardianChain is your sovereign truth infrastructure — a permanent, AI-verified way to mint your memories, ideas, discoveries, and digital legacy into an indestructible, inheritable capsule.
          </p>
        </div>

        {/* What is a Capsule */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-semibold text-purple-300">What is a Capsule?</h2>
          </div>
          <p className="text-lg text-slate-400 leading-relaxed">
            A Capsule is your own NFT-powered vault for truth. It can hold videos, audio, documents, art, voice messages, research, photos, even entire books or projects.
            Once minted, it becomes forever yours — uncensorable, immutable, stored forever on-chain and IPFS.
          </p>
        </div>

        {/* Why Should You Mint */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-semibold text-cyan-300">Why Should You Mint?</h2>
          </div>
          <p className="text-lg text-slate-400 leading-relaxed">
            Today you pay to store data and give away your ownership rights. On GuardianChain, you mint truth, earn yield, and retain 100% digital sovereignty. No Big Tech. No expiration dates.
          </p>
        </div>

        {/* GTT Yield System */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Coins className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-semibold text-yellow-300">How Does GTT Yield Work?</h2>
          </div>
          <p className="text-lg text-slate-400 leading-relaxed">
            Every capsule earns you passive GTT yield. If it's shared publicly and others unlock it, you earn 50% of the token cost. If you stake it, you can earn up to 20% annual yield.
          </p>
        </div>

        {/* AI Features */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Brain className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-semibold text-green-300">What Does the AI Do?</h2>
          </div>
          <p className="text-lg text-slate-400 leading-relaxed">
            Our sovereign AI evaluates your capsule's authenticity, grief score, potential virality, and truth value. It gives a transparent estimate of yield — and helps you decide whether to share it, keep it sealed, or even time-release it to future heirs.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-yellow-900/40 via-purple-900/40 to-cyan-900/40 border border-yellow-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Globe className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-semibold text-yellow-300">The Vision</h2>
          </div>
          <p className="text-xl font-semibold text-yellow-200 mb-4">
            This is the Library of Alexandria — fireproof, tamper-proof, uncancellable.
          </p>
          <p className="text-lg text-yellow-300/80 leading-relaxed">
            GuardianChain is not a trend. It's a sovereign protocol. A public memory system. A final home for the most valuable truth a human can create.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <Zap className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Minting</h3>
            <p className="text-slate-400 text-sm">
              Transform any content into a permanent, blockchain-secured NFT capsule in seconds.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <Shield className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Sovereign Ownership</h3>
            <p className="text-slate-400 text-sm">
              You own your data completely. No platform can delete, censor, or modify your truth.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <Coins className="w-6 h-6 text-yellow-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Passive Income</h3>
            <p className="text-slate-400 text-sm">
              Earn GTT tokens automatically when others interact with your capsules.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <Brain className="w-6 h-6 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Verification</h3>
            <p className="text-slate-400 text-sm">
              Advanced AI analyzes truth value, authenticity, and potential impact.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6 pt-8">
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Truth Journey?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Join thousands of truth seekers who are building the future of sovereign digital memory. 
              Create your first capsule today and become part of the decentralized truth network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/create'}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Create Your First Capsule
              </button>
              <button 
                onClick={() => window.location.href = '/truth-net'}
                className="px-8 py-3 bg-slate-700/50 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-600/50 transition-all"
              >
                Explore Truth Net
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <DisclaimerBlock />
      </div>
    </div>
  );
}