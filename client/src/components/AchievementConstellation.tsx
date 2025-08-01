import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stars, Zap, Shield, Crown, Heart, Target, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'creation' | 'validation' | 'community' | 'milestone' | 'rare';
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  x: number;
  y: number;
  connected: string[];
}

const achievements: Achievement[] = [
  {
    id: 'first-capsule',
    title: 'Memory Keeper',
    description: 'Created your first truth capsule',
    icon: Shield,
    category: 'creation',
    unlockedAt: new Date('2025-01-15'),
    progress: 1,
    maxProgress: 1,
    x: 200,
    y: 300,
    connected: ['capsule-curator']
  },
  {
    id: 'capsule-curator',
    title: 'Capsule Curator',
    description: 'Created 10 verified capsules',
    icon: Target,
    category: 'creation',
    unlockedAt: new Date('2025-01-20'),
    progress: 10,
    maxProgress: 10,
    x: 350,
    y: 200,
    connected: ['truth-architect', 'memory-keeper']
  },
  {
    id: 'truth-architect',
    title: 'Truth Architect',
    description: 'Created 50 capsules with 90+ resonance',
    icon: Crown,
    category: 'creation',
    progress: 47,
    maxProgress: 50,
    x: 500,
    y: 150,
    connected: ['capsule-curator', 'legend-builder']
  },
  {
    id: 'first-validation',
    title: 'Truth Seeker',
    description: 'Participated in capsule validation',
    icon: Zap,
    category: 'validation',
    unlockedAt: new Date('2025-01-18'),
    progress: 1,
    maxProgress: 1,
    x: 150,
    y: 450,
    connected: ['jury-member']
  },
  {
    id: 'jury-member',
    title: 'Jury Member',
    description: 'Validated 25 capsules',
    icon: Stars,
    category: 'validation',
    unlockedAt: new Date('2025-01-25'),
    progress: 25,
    maxProgress: 25,
    x: 300,
    y: 400,
    connected: ['first-validation', 'truth-guardian']
  },
  {
    id: 'truth-guardian',
    title: 'Truth Guardian',
    description: 'Achieved 95% validation accuracy',
    icon: Crown,
    category: 'validation',
    progress: 23,
    maxProgress: 25,
    x: 450,
    y: 350,
    connected: ['jury-member']
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Connected with 100 truth preservers',
    icon: Heart,
    category: 'community',
    progress: 87,
    maxProgress: 100,
    x: 250,
    y: 550,
    connected: ['first-validation']
  },
  {
    id: 'gtt-collector',
    title: 'GTT Collector',
    description: 'Earned 1000 GTT tokens',
    icon: Sparkles,
    category: 'milestone',
    unlockedAt: new Date('2025-01-30'),
    progress: 1247,
    maxProgress: 1000,
    x: 400,
    y: 500,
    connected: ['community-builder', 'truth-guardian']
  },
  {
    id: 'legend-builder',
    title: 'Legend Builder',
    description: 'Master of truth preservation',
    icon: Crown,
    category: 'rare',
    progress: 4,
    maxProgress: 5,
    x: 600,
    y: 250,
    connected: ['truth-architect', 'gtt-collector']
  }
];

export default function AchievementConstellation() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'creation': return '#3b82f6'; // blue
      case 'validation': return '#10b981'; // green
      case 'community': return '#f59e0b'; // amber
      case 'milestone': return '#8b5cf6'; // purple
      case 'rare': return '#ef4444'; // red
      default: return '#64748b'; // slate
    }
  };

  const isUnlocked = (achievement: Achievement) => {
    return achievement.progress >= achievement.maxProgress || achievement.unlockedAt;
  };

  const getConnectionColor = (fromId: string, toId: string) => {
    const from = achievements.find(a => a.id === fromId);
    const to = achievements.find(a => a.id === toId);
    
    if (from && to && isUnlocked(from) && isUnlocked(to)) {
      return '#3b82f6';
    } else if (from && isUnlocked(from)) {
      return '#64748b';
    }
    return '#374151';
  };

  // Draw connections between achievements
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    achievements.forEach(achievement => {
      achievement.connected.forEach(connectedId => {
        const connected = achievements.find(a => a.id === connectedId);
        if (connected) {
          const isHighlighted = hoveredAchievement === achievement.id || hoveredAchievement === connectedId;
          
          connections.push(
            <motion.line
              key={`${achievement.id}-${connectedId}`}
              x1={achievement.x}
              y1={achievement.y}
              x2={connected.x}
              y2={connected.y}
              stroke={getConnectionColor(achievement.id, connectedId)}
              strokeWidth={isHighlighted ? 3 : 2}
              strokeOpacity={isHighlighted ? 0.8 : 0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          );
        }
      });
    });
    
    return connections;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-700 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Stars className="w-5 h-5 mr-2 text-yellow-400" />
            Achievement Constellation
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Your journey through the truth preservation universe
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 overflow-hidden">
            {/* Star field background */}
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* SVG for connections */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 700 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {renderConnections()}
            </svg>

            {/* Achievement nodes */}
            <div className="absolute inset-0">
              {achievements.map((achievement, index) => {
                const unlocked = isUnlocked(achievement);
                const Icon = achievement.icon;
                const categoryColor = getCategoryColor(achievement.category);
                
                return (
                  <motion.div
                    key={achievement.id}
                    className="absolute"
                    style={{
                      left: `${(achievement.x / 700) * 100}%`,
                      top: `${(achievement.y / 600) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                    onMouseEnter={() => setHoveredAchievement(achievement.id)}
                    onMouseLeave={() => setHoveredAchievement(null)}
                    onClick={() => setSelectedAchievement(achievement)}
                  >
                    <div
                      className={`relative w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                        unlocked
                          ? 'bg-opacity-90 border-opacity-90 shadow-lg'
                          : 'bg-opacity-30 border-opacity-50 grayscale'
                      }`}
                      style={{
                        backgroundColor: categoryColor,
                        borderColor: categoryColor,
                        boxShadow: unlocked && hoveredAchievement === achievement.id
                          ? `0 0 20px ${categoryColor}` : 'none'
                      }}
                    >
                      <Icon 
                        className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                          unlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      
                      {/* Progress ring */}
                      {!unlocked && (
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-slate-600"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke={categoryColor}
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - achievement.progress / achievement.maxProgress)}`}
                            className="transition-all duration-500"
                          />
                        </svg>
                      )}
                      
                      {/* Unlock animation */}
                      {unlocked && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: categoryColor }}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredAchievement === achievement.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10"
                        >
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl min-w-48">
                            <h4 className="text-white font-medium text-sm mb-1">
                              {achievement.title}
                            </h4>
                            <p className="text-slate-300 text-xs mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                                style={{ borderColor: categoryColor, color: categoryColor }}
                              >
                                {achievement.category}
                              </Badge>
                              {!unlocked && (
                                <span className="text-xs text-slate-400">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Details Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: getCategoryColor(selectedAchievement.category),
                    borderColor: getCategoryColor(selectedAchievement.category)
                  }}
                >
                  <selectedAchievement.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedAchievement.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="capitalize"
                    style={{ 
                      borderColor: getCategoryColor(selectedAchievement.category),
                      color: getCategoryColor(selectedAchievement.category)
                    }}
                  >
                    {selectedAchievement.category}
                  </Badge>
                </div>
              </div>
              
              <p className="text-slate-300 mb-4">
                {selectedAchievement.description}
              </p>
              
              {selectedAchievement.unlockedAt ? (
                <div className="text-green-400 text-sm">
                  ✓ Unlocked on {selectedAchievement.unlockedAt.toLocaleDateString()}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">
                      {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: getCategoryColor(selectedAchievement.category),
                        width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}