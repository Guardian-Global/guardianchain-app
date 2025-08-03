import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dna, Brain, Heart, TrendingUp, Shield } from "lucide-react";
import DisclaimerBlock from "@/components/DisclaimerBlock";

interface TruthGenomeData {
  capsuleId: string;
  emotionalSignature: {
    primary: string;
    intensity: number;
    authenticity: number;
    resonance: number;
  };
  authorshipMarkers: {
    writingStyle: number;
    vocabulary: number;
    sentiment: number;
    uniqueness: number;
  };
  lineageConnection: {
    parentCapsules: string[];
    childCapsules: string[];
    influenceScore: number;
    truthChainLength: number;
  };
  verificationMetrics: {
    blockchainHash: string;
    timestamp: string;
    witnesses: number;
    consensusScore: number;
  };
}

const mockGenomeData: TruthGenomeData = {
  capsuleId: "cap_genome_001",
  emotionalSignature: {
    primary: "Grief & Healing",
    intensity: 0.87,
    authenticity: 0.94,
    resonance: 0.81
  },
  authorshipMarkers: {
    writingStyle: 0.92,
    vocabulary: 0.78,
    sentiment: 0.85,
    uniqueness: 0.89
  },
  lineageConnection: {
    parentCapsules: ["cap_001", "cap_045"],
    childCapsules: ["cap_123", "cap_156", "cap_201"],
    influenceScore: 0.76,
    truthChainLength: 7
  },
  verificationMetrics: {
    blockchainHash: "0xa1b2c3d4e5f6...",
    timestamp: "2025-08-03T01:08:00Z",
    witnesses: 12,
    consensusScore: 0.96
  }
};

export default function TruthGenome() {
  const [selectedCapsule, setSelectedCapsule] = useState("cap_genome_001");
  const [genomeView, setGenomeView] = useState<"emotion" | "authorship" | "lineage" | "verification">("emotion");

  const { data: genomeData, isLoading } = useQuery({
    queryKey: ["/api/truth-genome", selectedCapsule],
    enabled: !!selectedCapsule,
  });

  const genome: TruthGenomeData = genomeData || mockGenomeData;

  const renderEmotionalDNA = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{genome.emotionalSignature.primary}</h3>
        <p className="text-gray-400">Primary Emotional Signature</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Intensity</span>
            <span className="text-lg font-bold text-purple-400">{Math.round(genome.emotionalSignature.intensity * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${genome.emotionalSignature.intensity * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Authenticity</span>
            <span className="text-lg font-bold text-cyan-400">{Math.round(genome.emotionalSignature.authenticity * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${genome.emotionalSignature.authenticity * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Resonance</span>
            <span className="text-lg font-bold text-green-400">{Math.round(genome.emotionalSignature.resonance * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              style={{ width: `${genome.emotionalSignature.resonance * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuthorshipDNA = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Authorship Fingerprint</h3>
        <p className="text-gray-400">Unique writing and style markers</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(genome.authorshipMarkers).map(([key, value]) => (
          <div key={key} className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-lg font-bold text-cyan-400">{Math.round(value * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLineageDNA = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Truth Lineage</h3>
        <p className="text-gray-400">Connection and influence mapping</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-green-500/20">
          <h4 className="font-semibold text-white mb-4">Parent Capsules</h4>
          <div className="space-y-2">
            {genome.lineageConnection.parentCapsules.map((parentId) => (
              <div key={parentId} className="flex items-center space-x-3 p-2 bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm text-gray-300">{parentId}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-blue-500/20">
          <h4 className="font-semibold text-white mb-4">Child Capsules</h4>
          <div className="space-y-2">
            {genome.lineageConnection.childCapsules.map((childId) => (
              <div key={childId} className="flex items-center space-x-3 p-2 bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm text-gray-300">{childId}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-teal-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Influence Score</span>
            <span className="text-lg font-bold text-teal-400">{Math.round(genome.lineageConnection.influenceScore * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full"
              style={{ width: `${genome.lineageConnection.influenceScore * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Chain Length</span>
            <span className="text-lg font-bold text-orange-400">{genome.lineageConnection.truthChainLength}</span>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: genome.lineageConnection.truthChainLength }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-orange-400 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerificationDNA = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Blockchain Verification</h3>
        <p className="text-gray-400">Immutable proof and consensus</p>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-yellow-500/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Blockchain Record</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-400">Hash:</span>
                <p className="text-yellow-400 font-mono text-sm break-all">{genome.verificationMetrics.blockchainHash}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Timestamp:</span>
                <p className="text-white">{new Date(genome.verificationMetrics.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Consensus Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Witnesses:</span>
                <span className="text-white font-semibold">{genome.verificationMetrics.witnesses}</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Consensus Score:</span>
                  <span className="text-lg font-bold text-yellow-400">{Math.round(genome.verificationMetrics.consensusScore * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                    style={{ width: `${genome.verificationMetrics.consensusScore * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Analyzing Truth Genome...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Dna className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Truth Genome Analysis</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Deep analysis of capsule authenticity, emotional signature, and truth lineage using AI-powered forensics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: "emotion", label: "Emotional DNA", icon: Heart },
            { id: "authorship", label: "Authorship", icon: Brain },
            { id: "lineage", label: "Truth Lineage", icon: TrendingUp },
            { id: "verification", label: "Blockchain", icon: Shield },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setGenomeView(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                genomeView === id
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800/30 rounded-2xl p-8 border border-purple-500/20">
          {genomeView === "emotion" && renderEmotionalDNA()}
          {genomeView === "authorship" && renderAuthorshipDNA()}
          {genomeView === "lineage" && renderLineageDNA()}
          {genomeView === "verification" && renderVerificationDNA()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
            Download Report
          </button>
          <button className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all border border-purple-500/30">
            Share Analysis
          </button>
        </div>

        {/* Legal Disclaimer */}
        <DisclaimerBlock />
      </div>
    </div>
  );
}