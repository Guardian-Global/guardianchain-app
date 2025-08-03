import React from 'react';
import { Link } from 'wouter';
import { Shield, Download, ExternalLink, Users, Coins, Globe } from 'lucide-react';

export default function GitHubPagesLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-16 text-gray-100">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              GuardianChain
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Sovereign Web3 Truth Platform - Blockchain-powered capsule preservation and verification
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Launch Platform
              </button>
            </Link>
            <a 
              href="/GuardianChain_Revenue_Explainer_Deck.pdf" 
              target="_blank"
              className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Revenue Deck
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex items-center mb-4">
              <Coins className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-purple-300">GTT Token</h3>
            </div>
            <p className="text-gray-300">
              Yield-generating token for capsule creation, verification, and DAO governance with transparent revenue distribution.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-cyan-400 mr-3" />
              <h3 className="text-xl font-semibold text-purple-300">Truth DAO</h3>
            </div>
            <p className="text-gray-300">
              Decentralized governance for platform development, grant distribution, and community-driven verification systems.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-purple-300">Global Network</h3>
            </div>
            <p className="text-gray-300">
              Worldwide validator network ensuring truth preservation with multi-chain support and institutional compliance.
            </p>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-white/5 p-8 rounded-xl border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">Revenue Model & Compliance</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Revenue Distribution</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Capsule Mint:</strong> 70% Creator / 20% DAO / 10% Platform</li>
                <li>• <strong>Capsule Unlock:</strong> 50% Creator / 25% Referrer / 25% DAO</li>
                <li>• <strong>Yield Distribution:</strong> 90% Creator / 10% DAO</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Compliance Framework</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• GTT requires active participation, not passive income</li>
                <li>• DAO-controlled treasury with public disclosures</li>
                <li>• Tiered KYC: view-only, light KYC, full KYC</li>
                <li>• Global compliance: US / EU / FATF ready</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Partner with GuardianChain</h2>
          <p className="text-gray-300 mb-4">
            For investors, grants, and partnership opportunities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:compliance@guardianchain.app" 
              className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              compliance@guardianchain.app
            </a>
            <span className="text-gray-500">|</span>
            <a 
              href="https://guardianchain.app" 
              className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              guardianchain.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}