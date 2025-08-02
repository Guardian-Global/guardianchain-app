import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Link2, 
  Trophy,
  MemoryStick,
  ArrowRight,
  Play,
  Pause,
  BookOpen
} from 'lucide-react';

// Import all memory components
import AnimatedMemoryCapsuleInteractionDeck from '@/components/memory/AnimatedMemoryCapsuleInteractionDeck';
import OneClickEmotionalResonanceMapper from '@/components/memory/OneClickEmotionalResonanceMapper';
import BlockchainStorytellingProgressVisualizer from '@/components/memory/BlockchainStorytellingProgressVisualizer';
import PersonalizedNarrativeDiscoveryEngine from '@/components/memory/PersonalizedNarrativeDiscoveryEngine';
import ImmersiveMemoryPreservationRewardSystem from '@/components/memory/ImmersiveMemoryPreservationRewardSystem';
import OptimizedAgentMemory from '@/components/memory/OptimizedAgentMemory';

const MEMORY_FEATURES = [
  {
    id: 'interaction-deck',
    title: 'Animated Memory Capsule Interaction Deck',
    description: 'Interactive, animated memory capsules with real-time engagement rewards',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    component: AnimatedMemoryCapsuleInteractionDeck,
    features: ['Animated interactions', 'Staking rewards', 'Emotional scoring', 'Community engagement']
  },
  {
    id: 'resonance-mapper',
    title: 'One-Click Emotional Resonance Mapper',
    description: 'AI-powered instant emotional analysis and sentiment visualization',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    component: OneClickEmotionalResonanceMapper,
    features: ['AI sentiment analysis', 'Emotional visualization', 'One-click processing', 'Actionable insights']
  },
  {
    id: 'story-visualizer',
    title: 'Blockchain Storytelling Progress Visualizer',
    description: 'Track your story journey through blockchain with immutable verification',
    icon: Link2,
    color: 'from-blue-500 to-cyan-500',
    component: BlockchainStorytellingProgressVisualizer,
    features: ['Blockchain verification', 'Story timeline', 'Progress tracking', 'Immutable records']
  },
  {
    id: 'narrative-engine',
    title: 'Personalized Narrative Discovery Engine',
    description: 'AI discovers unique story themes and narrative connections in your memories',
    icon: Brain,
    color: 'from-indigo-500 to-purple-500',
    component: PersonalizedNarrativeDiscoveryEngine,
    features: ['AI theme discovery', 'Narrative connections', 'Story arc potential', 'Personal insights']
  },
  {
    id: 'reward-system',
    title: 'Immersive Memory Preservation Reward System',
    description: 'Gamified achievement system with tiers, challenges, and GTT rewards',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    component: ImmersiveMemoryPreservationRewardSystem,
    features: ['Achievement system', 'Daily challenges', 'Tier progression', 'GTT rewards']
  },
  {
    id: 'agent-memory',
    title: 'Optimized Agent Memory',
    description: 'Advanced AI memory management with intelligent context preservation',
    icon: MemoryStick,
    color: 'from-green-500 to-teal-500',
    component: OptimizedAgentMemory,
    features: ['Memory optimization', 'Context preservation', 'Intelligent recall', 'System analytics']
  }
];

export default function MemoryFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFeatureSelect = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  const ActiveComponent = activeFeature ? 
    MEMORY_FEATURES.find(f => f.id === activeFeature)?.component : 
    null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!activeFeature ? (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
                <Brain className="text-purple-400" />
                Memory Features Suite
                <Sparkles className="text-yellow-400" />
              </h1>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                Experience the future of memory preservation with AI-powered features that transform how you store, 
                discover, and interact with your most precious memories
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg">
                  6 Advanced Features
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-lg">
                  AI-Powered
                </Badge>
                <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 text-lg">
                  Blockchain Verified
                </Badge>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {MEMORY_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -10 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => handleFeatureSelect(feature.id)}
                  >
                    <Card className="bg-slate-800/80 backdrop-blur-sm border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 overflow-hidden h-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color}`}>
                            <Icon className="text-white" size={24} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg leading-tight">
                              {feature.title}
                            </CardTitle>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {feature.features.map((feat, idx) => (
                              <Badge 
                                key={idx}
                                variant="outline" 
                                className="text-xs text-gray-300 border-gray-600 bg-slate-700/30"
                              >
                                {feat}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white font-medium`}
                          >
                            <Play size={16} className="mr-2" />
                            Experience Feature
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-slate-800/60 backdrop-blur-sm border-yellow-500/30 max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center justify-center gap-3">
                    <BookOpen className="text-yellow-400" />
                    Advanced Memory Technology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-400 mb-2">AI-Powered</div>
                      <div className="text-gray-300">Advanced machine learning algorithms analyze and enhance your memories</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-400 mb-2">Blockchain</div>
                      <div className="text-gray-300">Immutable verification and progress tracking on the blockchain</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400 mb-2">Rewards</div>
                      <div className="text-gray-300">Earn GTT tokens through engagement and quality contributions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Back Button */}
          <motion.div
            className="fixed top-6 left-6 z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={() => setActiveFeature(null)}
              className="bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 hover:bg-slate-700/80 text-white"
            >
              <ArrowRight size={16} className="mr-2 rotate-180" />
              Back to Features
            </Button>
          </motion.div>

          {/* Active Component */}
          {ActiveComponent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}