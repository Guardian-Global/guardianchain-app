import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Coins, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function CenteredHomepage() {
  return (
    <>
      <Helmet>
        <title>Welcome to GuardianChain</title>
        <meta name="description" content="Secure Truth. Your Capsule Platform." />
      </Helmet>

      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">
        {/* Logo and Title Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* GuardianChain Logo */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-3">Welcome to GuardianChain</h1>
          <p className="text-xl text-gray-300">Secure Truth. Your Capsule Platform.</p>
        </motion.div>

        {/* Feature Cards Section */}
        <motion.div 
          className="max-w-6xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Secure Truth Capsules */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-xl font-semibold">Secure Truth Capsules</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Create and store capsules on blockchain with immutable verification and time-locked content.
              </p>
              <Link href="/create">
                <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                  Create Capsule
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>

            {/* GTT Token Rewards */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
              <div className="flex items-center mb-4">
                <Coins className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-xl font-semibold">GTT Token Rewards</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Earn tokens through engagement and secure Truth Guardian engagement scoring.
              </p>
              <Link href="/dashboard">
                <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>

            {/* Community Verification */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-400 transition-colors">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-xl font-semibold">Community Verification</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Get your capsules verified through our decentralized community verification system.
              </p>
              <Link href="/community">
                <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                  Join Community
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-12 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/create">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Create Capsule
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="border border-slate-600 hover:border-cyan-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              View Dashboard
            </button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}