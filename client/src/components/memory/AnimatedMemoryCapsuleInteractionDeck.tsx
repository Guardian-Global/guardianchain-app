import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Heart, 
  Clock, 
  Star, 
  Zap, 
  Globe,
  Users,
  Trophy,
  Eye,
  ArrowRight
} from 'lucide-react';

interface MemoryCapsule {
  id: string;
  title: string;
  content: string;
  emotionalScore: number;
  timeStamp: Date;
  category: 'family' | 'achievement' | 'milestone' | 'wisdom' | 'adventure';
  interactionCount: number;
  resonanceLevel: 'low' | 'medium' | 'high' | 'legendary';
  stakingReward: number;
}

const SAMPLE_CAPSULES: MemoryCapsule[] = [
  {
    id: '1',
    title: 'First Steps',
    content: 'The moment our daughter took her first steps, captured forever in time...',
    emotionalScore: 95,
    timeStamp: new Date('2023-06-15'),
    category: 'family',
    interactionCount: 1247,
    resonanceLevel: 'legendary',
    stakingReward: 15.7
  },
  {
    id: '2', 
    title: 'Mountain Summit',
    content: 'Reaching the peak after years of training, the view was breathtaking...',
    emotionalScore: 88,
    timeStamp: new Date('2023-08-22'),
    category: 'achievement',
    interactionCount: 892,
    resonanceLevel: 'high',
    stakingReward: 12.3
  },
  {
    id: '3',
    title: 'Grandmother\'s Recipe',
    content: 'The secret family recipe passed down through generations...',
    emotionalScore: 76,
    timeStamp: new Date('2023-11-03'),
    category: 'wisdom',
    interactionCount: 634,
    resonanceLevel: 'medium',
    stakingReward: 8.9
  }
];

const categoryIcons = {
  family: Heart,
  achievement: Trophy,
  milestone: Star,
  wisdom: Globe,
  adventure: Zap
};

const resonanceColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-purple-500',
  legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500'
};

export default function AnimatedMemoryCapsuleInteractionDeck() {
  const [selectedCapsule, setSelectedCapsule] = useState<MemoryCapsule | null>(null);
  const [hoveredCapsule, setHoveredCapsule] = useState<string | null>(null);
  const [capsules, setCapsules] = useState(SAMPLE_CAPSULES);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const handleCapsuleInteraction = (capsule: MemoryCapsule) => {
    setActiveAnimation(capsule.id);
    
    // Simulate interaction reward
    setCapsules(prev => prev.map(c => 
      c.id === capsule.id 
        ? { ...c, interactionCount: c.interactionCount + 1, stakingReward: c.stakingReward + 0.1 }
        : c
    ));

    setTimeout(() => setActiveAnimation(null), 1000);
    setSelectedCapsule(capsule);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="text-yellow-400" />
            Animated Memory Capsule Interaction Deck
            <Sparkles className="text-yellow-400" />
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Experience your memories through interactive, animated capsules that reward engagement
          </motion.p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {[
            { label: 'Total Capsules', value: capsules.length, icon: Eye },
            { label: 'Total Interactions', value: capsules.reduce((sum, c) => sum + c.interactionCount, 0), icon: Users },
            { label: 'Staking Rewards', value: `${capsules.reduce((sum, c) => sum + c.stakingReward, 0).toFixed(1)} GTT`, icon: Trophy },
            { label: 'Avg Resonance', value: `${Math.round(capsules.reduce((sum, c) => sum + c.emotionalScore, 0) / capsules.length)}%`, icon: Heart }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-3">
                <stat.icon className="text-purple-400" size={24} />
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Memory Capsules Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {capsules.map((capsule) => {
            const CategoryIcon = categoryIcons[capsule.category];
            
            return (
              <motion.div
                key={capsule.id}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredCapsule(capsule.id)}
                onHoverEnd={() => setHoveredCapsule(null)}
                className="relative cursor-pointer"
                onClick={() => handleCapsuleInteraction(capsule)}
              >
                <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
                  {/* Pulse Animation for Active Interaction */}
                  {activeAnimation === capsule.id && (
                    <motion.div
                      variants={pulseVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-purple-500/20 rounded-lg pointer-events-none"
                    />
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CategoryIcon className="text-purple-400" size={20} />
                      <Badge className={`${resonanceColors[capsule.resonanceLevel]} text-white`}>
                        {capsule.resonanceLevel}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{capsule.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {capsule.content}
                    </p>
                    
                    <div className="space-y-3">
                      {/* Emotional Score Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Emotional Resonance</span>
                          <span>{capsule.emotionalScore}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${capsule.emotionalScore}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users size={12} />
                          <span>{capsule.interactionCount} views</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock size={12} />
                          <span>{capsule.timeStamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Rewards */}
                      <motion.div
                        className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg"
                        animate={activeAnimation === capsule.id ? { scale: [1, 1.05, 1] } : {}}
                      >
                        <span className="text-yellow-400 text-sm font-medium">Staking Reward</span>
                        <span className="text-yellow-300 font-bold">{capsule.stakingReward.toFixed(1)} GTT</span>
                      </motion.div>
                    </div>
                  </CardContent>
                  
                  {/* Hover Effect */}
                  <AnimatePresence>
                    {hoveredCapsule === capsule.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end justify-center pb-4"
                      >
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          <ArrowRight size={16} className="mr-2" />
                          Interact
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Selected Capsule Detail Modal */}
        <AnimatePresence>
          {selectedCapsule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCapsule(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedCapsule.title}</h2>
                  <Button variant="ghost" onClick={() => setSelectedCapsule(null)}>
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">{selectedCapsule.content}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-purple-400 font-semibold mb-2">Memory Stats</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Emotional Score:</span>
                          <span className="text-white">{selectedCapsule.emotionalScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Interactions:</span>
                          <span className="text-white">{selectedCapsule.interactionCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resonance:</span>
                          <Badge className={`${resonanceColors[selectedCapsule.resonanceLevel]} text-white`}>
                            {selectedCapsule.resonanceLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
                      <h3 className="text-yellow-400 font-semibold mb-2">Rewards Earned</h3>
                      <div className="text-2xl font-bold text-yellow-300">
                        {selectedCapsule.stakingReward.toFixed(1)} GTT
                      </div>
                      <p className="text-yellow-200/70 text-sm">From community interactions</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}