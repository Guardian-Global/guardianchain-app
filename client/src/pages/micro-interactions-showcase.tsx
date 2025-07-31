import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Trophy, 
  Zap, 
  Target,
  Gift,
  Crown,
  Award,
  Flame,
  Users,
  BookOpen
} from 'lucide-react';

// Import our interactive components
import {
  FloatingParticles,
  RippleButton,
  BouncyIcon,
  CelebrationProgress,
  FloatingTooltip,
  LikeAnimation,
  ShakeOnError,
  TypingAnimation,
  SuccessCheckmark
} from '@/components/interactions/MicroInteractions';

import {
  TiltCard,
  InteractiveCapsuleCard,
  ExpandableCard,
  FlipCard
} from '@/components/interactions/InteractiveCards';

import {
  AchievementUnlock,
  XPBar,
  StreakCounter,
  MiniLeaderboard,
  QuestCard,
  PowerUpAnimation
} from '@/components/interactions/GamificationElements';

export default function MicroInteractionsShowcase() {
  const [showParticles, setShowParticles] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [xp, setXp] = useState(850);
  const [questProgress, setQuestProgress] = useState(3);
  const [powerUpActive, setPowerUpActive] = useState(false);

  const sampleQuest = {
    id: '1',
    title: 'Truth Verifier',
    description: 'Verify 5 truth capsules today',
    progress: questProgress,
    maxProgress: 5,
    reward: 500,
    difficulty: 'medium' as const,
    timeLeft: '2h 30m'
  };

  const sampleAchievement = {
    title: 'Truth Pioneer',
    description: 'Created your first verified truth capsule!',
    icon: Trophy,
    rarity: 'epic' as const,
    points: 1000
  };

  const leaderboardUsers = [
    { id: '1', name: 'TruthSeeker42', points: 15420, rank: 1 },
    { id: '2', name: 'VerifyMaster', points: 12890, rank: 2 },
    { id: '3', name: 'CapsuleKing', points: 11250, rank: 3 },
    { id: 'current', name: 'You', points: 8750, rank: 4 },
    { id: '5', name: 'FactChecker', points: 7420, rank: 5 }
  ];

  const streakDays = [true, true, true, false, true, false, false];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 relative">
      {/* Floating Particles Background */}
      {showParticles && <FloatingParticles count={30} color="rgba(59, 130, 246, 0.2)" />}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BouncyIcon icon={Sparkles} className="inline h-8 w-8 text-purple-400 mr-3" />
            Playful Micro-Interactions
          </motion.h1>
          <TypingAnimation 
            text="Enhancing user engagement through delightful animations and feedback"
            className="text-xl text-slate-300"
            speed={50}
          />
        </div>

        {/* Controls */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Interactive Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <FloatingTooltip content="Toggle floating particles">
                <RippleButton
                  onClick={() => setShowParticles(!showParticles)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {showParticles ? 'Hide' : 'Show'} Particles
                </RippleButton>
              </FloatingTooltip>

              <FloatingTooltip content="Trigger achievement unlock">
                <RippleButton
                  onClick={() => setShowAchievement(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  <Trophy className="h-4 w-4 mr-2 inline" />
                  Show Achievement
                </RippleButton>
              </FloatingTooltip>

              <FloatingTooltip content="Add XP points">
                <RippleButton
                  onClick={() => setXp(prev => Math.min(prev + 150, 1000))}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <Zap className="h-4 w-4 mr-2 inline" />
                  +150 XP
                </RippleButton>
              </FloatingTooltip>

              <FloatingTooltip content="Progress quest">
                <RippleButton
                  onClick={() => setQuestProgress(prev => Math.min(prev + 1, 5))}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                >
                  <Target className="h-4 w-4 mr-2 inline" />
                  Quest +1
                </RippleButton>
              </FloatingTooltip>

              <FloatingTooltip content="Activate power-up">
                <RippleButton
                  onClick={() => {
                    setPowerUpActive(true);
                    setTimeout(() => setPowerUpActive(false), 5000);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  <Crown className="h-4 w-4 mr-2 inline" />
                  Power Up
                </RippleButton>
              </FloatingTooltip>

              <ShakeOnError trigger={showError}>
                <RippleButton
                  onClick={() => {
                    setShowError(true);
                    setTimeout(() => setShowError(false), 500);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Shake Error
                </RippleButton>
              </ShakeOnError>

              <RippleButton
                onClick={() => {
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Success Check
              </RippleButton>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <PowerUpAnimation type="strength" isActive={powerUpActive} duration={5} />
              <SuccessCheckmark isVisible={showSuccess} size={32} />
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Gamification Elements */}
          <div className="space-y-6">
            <XPBar currentXP={xp} maxXP={1000} level={12} />
            <StreakCounter currentStreak={4} maxStreak={15} daysCompleted={streakDays} />
            <QuestCard quest={sampleQuest} />
          </div>

          {/* Interactive Cards */}
          <div className="space-y-6">
            <InteractiveCapsuleCard
              title="Revolutionary Truth Discovery"
              content="This groundbreaking capsule contains verified evidence about climate data manipulation by major corporations, backed by leaked internal documents and expert testimony."
              status="verified"
              likes={847}
              author="Dr. Sarah Chen"
              category="Environmental"
              onLike={() => console.log('Liked!')}
              onShare={() => console.log('Shared!')}
              onView={() => console.log('Viewed!')}
            />

            <ExpandableCard
              title="Truth Verification Process"
              preview="Learn how our AI-powered system validates content"
              fullContent="Our revolutionary verification system uses advanced AI algorithms combined with crowd-sourced validation to ensure the authenticity of every truth capsule. The process involves multiple stages of verification, expert review, and community consensus to maintain the highest standards of truth and accuracy."
              icon={BookOpen}
            />
          </div>

          {/* More Interactive Elements */}
          <div className="space-y-6">
            <MiniLeaderboard users={leaderboardUsers} currentUserId="current" />
            
            <FlipCard
              frontContent={
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-white font-bold">Click to Reveal</h3>
                  <p className="text-slate-400">Hidden truth awaits</p>
                </div>
              }
              backContent={
                <div className="text-center">
                  <Gift className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold">Secret Reward!</h3>
                  <p className="text-slate-400 mb-2">You found a hidden capsule</p>
                  <Badge className="bg-purple-600 text-white">+1000 GTT</Badge>
                </div>
              }
            />

            <TiltCard>
              <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-white font-bold mb-2">Tilt Me!</h3>
                  <p className="text-slate-300 text-sm">
                    Hover and move your mouse to see the 3D tilt effect
                  </p>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </div>

        {/* Progress Demonstrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Celebration Progress Bars</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CelebrationProgress value={75} max={100} label="Truth Capsules Created" />
              <CelebrationProgress value={100} max={100} label="Weekly Goal Completed" />
              <CelebrationProgress value={45} max={50} label="Community Verifications" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Interactive Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Like this feature:</span>
                <LikeAnimation
                  isLiked={isLiked}
                  onToggle={() => setIsLiked(!isLiked)}
                  size={32}
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-slate-300">Bouncy Icons:</span>
                <BouncyIcon icon={Star} className="h-8 w-8 text-yellow-400" />
                <BouncyIcon icon={Heart} className="h-8 w-8 text-red-400" />
                <BouncyIcon icon={Trophy} className="h-8 w-8 text-purple-400" />
                <BouncyIcon icon={Zap} className="h-8 w-8 text-blue-400" />
              </div>

              <div className="space-y-2">
                <span className="text-slate-300 block">Tooltips with different positions:</span>
                <div className="flex space-x-4">
                  <FloatingTooltip content="I'm on top!" position="top">
                    <Button size="sm" variant="outline">Top</Button>
                  </FloatingTooltip>
                  <FloatingTooltip content="I'm on the bottom!" position="bottom">
                    <Button size="sm" variant="outline">Bottom</Button>
                  </FloatingTooltip>
                  <FloatingTooltip content="I'm on the left!" position="left">
                    <Button size="sm" variant="outline">Left</Button>
                  </FloatingTooltip>
                  <FloatingTooltip content="I'm on the right!" position="right">
                    <Button size="sm" variant="outline">Right</Button>
                  </FloatingTooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Unlock Overlay */}
        <AchievementUnlock
          achievement={sampleAchievement}
          isVisible={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      </div>
    </div>
  );
}