import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  Crown,
  Flame,
  Gift,
  Coins,
  TrendingUp,
  Users,
  Heart,
} from "lucide-react";
import {
  CelebrationProgress,
  SuccessCheckmark,
  FloatingTooltip,
} from "./MicroInteractions";

// Achievement Unlock Animation
export const AchievementUnlock: React.FC<{
  achievement: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    rarity: "common" | "rare" | "epic" | "legendary";
    points: number;
  };
  isVisible: boolean;
  onClose: () => void;
}> = ({ achievement, isVisible, onClose }) => {
  const rarityColors = {
    common: "from-gray-600 to-gray-800 border-gray-500",
    rare: "from-blue-600 to-blue-800 border-blue-500",
    epic: "from-purple-600 to-purple-800 border-purple-500",
    legendary: "from-yellow-600 to-yellow-800 border-yellow-500",
  };

  const rarityText = {
    common: "text-gray-300",
    rare: "text-blue-300",
    epic: "text-purple-300",
    legendary: "text-yellow-300",
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, x: 300, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card
            className={`bg-gradient-to-br ${rarityColors[achievement.rarity]} border-2 max-w-sm`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`p-2 rounded-full bg-white/20`}
                >
                  <achievement.icon
                    className={`h-8 w-8 ${rarityText[achievement.rarity]}`}
                  />
                </motion.div>
                <div>
                  <CardTitle className="text-white text-lg">
                    Achievement Unlocked!
                  </CardTitle>
                  <Badge
                    className={`${rarityColors[achievement.rarity]} capitalize`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-white font-bold mb-2">{achievement.title}</h3>
              <p className="text-slate-200 text-sm mb-3">
                {achievement.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">
                    +{achievement.points} GTT
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// XP Bar with Level Up Animation
export const XPBar: React.FC<{
  currentXP: number;
  maxXP: number;
  level: number;
  onLevelUp?: () => void;
}> = ({ currentXP, maxXP, level, onLevelUp }) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const percentage = (currentXP / maxXP) * 100;

  useEffect(() => {
    if (percentage >= 100) {
      setShowLevelUp(true);
      onLevelUp?.();
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [percentage, onLevelUp]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold">Level {level}</span>
          <AnimatePresence>
            {showLevelUp && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  LEVEL UP!
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-slate-400 text-sm">
          {currentXP} / {maxXP} XP
        </span>
      </div>

      <div className="relative w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Sparkle Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {showLevelUp && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.5 }}
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
            🎉 Level {level + 1} Reached! 🎉
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Daily Streak Counter
export const StreakCounter: React.FC<{
  currentStreak: number;
  maxStreak: number;
  daysCompleted: boolean[];
}> = ({ currentStreak, maxStreak, daysCompleted }) => {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span>Daily Streak</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {currentStreak}
          </div>
          <div className="text-slate-400 text-sm">Current Streak</div>
          <div className="text-slate-500 text-xs">Best: {maxStreak} days</div>
        </div>

        <div className="flex justify-center space-x-2 mb-4">
          {days.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-slate-400 text-xs mb-1">{day}</div>
              <motion.div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  daysCompleted[index]
                    ? "bg-orange-500 border-orange-500"
                    : "border-slate-600"
                }`}
                whileHover={{ scale: 1.1 }}
                animate={
                  daysCompleted[index]
                    ? {
                        scale: [1, 1.2, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                {daysCompleted[index] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <span className="text-slate-400 text-sm">
            {currentStreak > 0
              ? `Keep it up! ${7 - currentStreak} days to weekly bonus`
              : "Start your streak today!"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Leaderboard Component
export const MiniLeaderboard: React.FC<{
  users: Array<{
    id: string;
    name: string;
    points: number;
    avatar?: string;
    rank: number;
  }>;
  currentUserId: string;
}> = ({ users, currentUserId }) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Top Contributors</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.slice(0, 5).map((user, index) => (
            <motion.div
              key={user.id}
              className={`flex items-center space-x-3 p-2 rounded-lg ${
                user.id === currentUserId
                  ? "bg-blue-500/20 border border-blue-500/30"
                  : ""
              }`}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(71, 85, 105, 0.3)",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700">
                {index < 3 ? (
                  <span className="text-lg">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm font-bold">
                    #{index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="text-white font-semibold text-sm">
                  {user.name}
                </div>
                <div className="text-slate-400 text-xs">
                  {user.points.toLocaleString()} GTT
                </div>
              </div>

              {user.id === currentUserId && (
                <Badge className="bg-blue-500/20 text-blue-400">You</Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Quest/Challenge Card
export const QuestCard: React.FC<{
  quest: {
    id: string;
    title: string;
    description: string;
    progress: number;
    maxProgress: number;
    reward: number;
    difficulty: "easy" | "medium" | "hard";
    timeLeft?: string;
  };
  onClaim?: () => void;
}> = ({ quest, onClaim }) => {
  const [isCompleted, setIsCompleted] = useState(
    quest.progress >= quest.maxProgress,
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const difficultyColors = {
    easy: "text-green-400 border-green-500",
    medium: "text-yellow-400 border-yellow-500",
    hard: "text-red-400 border-red-500",
  };

  const handleClaim = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    onClaim?.();
  };

  useEffect(() => {
    setIsCompleted(quest.progress >= quest.maxProgress);
  }, [quest.progress, quest.maxProgress]);

  return (
    <motion.div whileHover={{ y: -2, scale: 1.02 }} className="relative">
      <Card
        className={`bg-slate-800/50 border-slate-700 ${isCompleted ? "ring-2 ring-green-500/50" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-white text-lg flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-400" />
                <span>{quest.title}</span>
              </CardTitle>
              <p className="text-slate-400 text-sm mt-1">{quest.description}</p>
            </div>
            <Badge className={`${difficultyColors[quest.difficulty]} border`}>
              {quest.difficulty}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <CelebrationProgress
            value={quest.progress}
            max={quest.maxProgress}
            label="Progress"
            showCelebration={isCompleted}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                {quest.reward} GTT
              </span>
              {quest.timeLeft && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-sm">
                    {quest.timeLeft}
                  </span>
                </>
              )}
            </div>

            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button
                  size="sm"
                  onClick={handleClaim}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Gift className="h-4 w-4 mr-1" />
                  Claim
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>

        <SuccessCheckmark isVisible={showSuccess} size={40} />
      </Card>
    </motion.div>
  );
};

// Power-up Animation
export const PowerUpAnimation: React.FC<{
  type: "speed" | "strength" | "luck" | "wisdom";
  isActive: boolean;
  duration: number;
}> = ({ type, isActive, duration }) => {
  const powerUpConfig = {
    speed: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    strength: { icon: Crown, color: "text-red-400", bg: "bg-red-500/20" },
    luck: { icon: Star, color: "text-purple-400", bg: "bg-purple-500/20" },
    wisdom: { icon: Award, color: "text-blue-400", bg: "bg-blue-500/20" },
  };

  const config = powerUpConfig[type];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full ${config.bg} border border-current/30`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <config.icon className={`h-5 w-5 ${config.color}`} />
          </motion.div>
          <span className={`text-sm font-semibold capitalize ${config.color}`}>
            {type} Boost
          </span>
          <span className="text-xs text-slate-400">{duration}s</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Components exported individually above
