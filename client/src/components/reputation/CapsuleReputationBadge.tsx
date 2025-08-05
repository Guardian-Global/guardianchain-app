import React from 'react';
import { Award, Star } from 'lucide-react';

interface CapsuleReputationBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  score?: number;
}

const tierConfig = {
  bronze: {
    color: 'text-amber-600 border-amber-600 bg-amber-50',
    darkColor: 'dark:text-amber-400 dark:border-amber-500 dark:bg-amber-900/20',
    icon: '🥉',
  },
  silver: {
    color: 'text-slate-600 border-slate-600 bg-slate-50',
    darkColor: 'dark:text-slate-300 dark:border-slate-400 dark:bg-slate-800/20',
    icon: '🥈',
  },
  gold: {
    color: 'text-yellow-600 border-yellow-600 bg-yellow-50',
    darkColor: 'dark:text-yellow-400 dark:border-yellow-500 dark:bg-yellow-900/20',
    icon: '🥇',
  },
  platinum: {
    color: 'text-cyan-600 border-cyan-600 bg-cyan-50',
    darkColor: 'dark:text-cyan-300 dark:border-cyan-400 dark:bg-cyan-900/20',
    icon: '💎',
  },
};

export default function CapsuleReputationBadge({ tier, score }: CapsuleReputationBadgeProps) {
  const config = tierConfig[tier];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${config.color} ${config.darkColor}`}>
      <span className="text-sm">{config.icon}</span>
      <span className="uppercase">{tier}</span>
      {score && (
        <>
          <Star className="h-3 w-3" />
          <span>{score}</span>
        </>
      )}
    </div>
  );
}