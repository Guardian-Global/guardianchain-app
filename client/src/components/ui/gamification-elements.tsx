import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Target, Award, Crown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  rarity?: "common" | "rare" | "epic" | "legendary";
  unlocked?: boolean;
  progress?: number;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  icon: Icon = Trophy,
  rarity = "common",
  unlocked = false,
  progress,
  className
}) => {
  const rarityStyles = {
    common: {
      border: "border-gray-500",
      bg: "from-gray-600/20 to-gray-700/20",
      glow: "shadow-gray-500/20"
    },
    rare: {
      border: "border-blue-500",
      bg: "from-blue-600/20 to-blue-700/20",
      glow: "shadow-blue-500/20"
    },
    epic: {
      border: "border-purple-500",
      bg: "from-purple-600/20 to-purple-700/20",
      glow: "shadow-purple-500/20"
    },
    legendary: {
      border: "border-yellow-500",
      bg: "from-yellow-600/20 to-yellow-700/20",
      glow: "shadow-yellow-500/20"
    }
  };

  const style = rarityStyles[rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative p-4 rounded-xl border-2 bg-gradient-to-br backdrop-blur-sm",
        "transition-all duration-300 cursor-pointer",
        style.border,
        style.bg,
        unlocked ? `shadow-lg ${style.glow}` : "opacity-60",
        className
      )}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        {[...Array(rarity === "legendary" ? 4 : rarity === "epic" ? 3 : rarity === "rare" ? 2 : 1)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={cn(
              "inline-block",
              unlocked ? "text-yellow-400 fill-current" : "text-gray-500"
            )}
          />
        ))}
      </div>

      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div className={cn(
          "p-3 rounded-full",
          unlocked ? style.bg : "bg-gray-700/50"
        )}>
          <Icon 
            size={24} 
            className={cn(
              unlocked ? "text-white" : "text-gray-500"
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className={cn(
          "font-semibold mb-1",
          unlocked ? "text-white" : "text-gray-400"
        )}>
          {title}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{description}</p>
        
        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={cn(
                "h-2 rounded-full",
                `bg-gradient-to-r ${style.border.replace('border-', 'from-')} to-white`
              )}
            />
          </div>
        )}
      </div>

      {/* Unlock animation */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-xl" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Zap className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  showPercent?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  color = "#06b6d4",
  showPercent = true,
  animated = true,
  className
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          {showPercent && (
            <span className="text-gray-400">
              {current}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={animated ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface TierDisplayProps {
  currentTier: {
    name: string;
    level: number;
    color: string;
    icon: React.ComponentType<any>;
  };
  nextTier?: {
    name: string;
    level: number;
    color: string;
    icon: React.ComponentType<any>;
  };
  progress: number;
  maxProgress: number;
  className?: string;
}

export const TierDisplay: React.FC<TierDisplayProps> = ({
  currentTier,
  nextTier,
  progress,
  maxProgress,
  className
}) => {
  const progressPercent = (progress / maxProgress) * 100;

  return (
    <div className={cn(
      "p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50",
      "border border-slate-700 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: `${currentTier.color}20` }}
          >
            <currentTier.icon 
              size={24} 
              style={{ color: currentTier.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">{currentTier.name}</h3>
            <p className="text-sm text-gray-400">Level {currentTier.level}</p>
          </div>
        </div>

        {nextTier && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Next: {nextTier.name}</p>
            <p className="text-xs text-gray-500">Level {nextTier.level}</p>
          </div>
        )}
      </div>

      {nextTier && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Progress to {nextTier.name}</span>
            <span className="text-gray-400">
              {progress}/{maxProgress}
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r"
                style={{
                  background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`
                }}
              />
            </div>
            
            {/* Milestone markers */}
            <div className="absolute top-0 w-full h-4 flex items-center">
              {[25, 50, 75].map(milestone => (
                <div
                  key={milestone}
                  className="absolute w-0.5 h-6 bg-white/30"
                  style={{ left: `${milestone}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  isCurrentUser?: boolean;
  tier?: {
    name: string;
    color: string;
    icon: React.ComponentType<any>;
  };
  className?: string;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  rank,
  name,
  score,
  avatar,
  isCurrentUser = false,
  tier,
  className
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300",
        isCurrentUser 
          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30" 
          : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50",
        className
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8">
        {getRankIcon(rank)}
      </div>

      {/* Avatar */}
      <div className="relative">
        {avatar ? (
          <img 
            src={avatar} 
            alt={name}
            className="w-10 h-10 rounded-full border-2 border-gray-600"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {tier && (
          <div 
            className="absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-gray-800"
            style={{ backgroundColor: tier.color }}
          >
            <tier.icon size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Name and Score */}
      <div className="flex-1">
        <h4 className={cn(
          "font-semibold",
          isCurrentUser ? "text-cyan-400" : "text-white"
        )}>
          {name}
        </h4>
        {tier && (
          <p className="text-xs text-gray-400">{tier.name}</p>
        )}
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="font-bold text-white">{score.toLocaleString()}</p>
        <p className="text-xs text-gray-400">points</p>
      </div>
    </motion.div>
  );
};