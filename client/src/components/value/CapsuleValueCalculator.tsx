import React from 'react';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CapsuleStats {
  views: number;
  reactions: number;
  unlocks: number;
  verifications: number;
  timeLockedDays: number;
}

interface CapsuleValueCalculatorProps {
  capsuleStats: CapsuleStats;
  className?: string;
}

const calcCapsuleValue = ({
  views,
  reactions,
  unlocks,
  verifications,
  timeLockedDays,
}: CapsuleStats): number => {
  const baseValue = views * 0.01 + reactions * 0.05 + unlocks * 0.2 + verifications * 0.25;
  const multiplier = 1 + (timeLockedDays / 365); // bonus for long-term locking
  return parseFloat((baseValue * multiplier).toFixed(2));
};

const getValueTier = (value: number): { tier: string; color: string; icon: string } => {
  if (value >= 100) return { tier: 'Legendary', color: 'text-purple-400', icon: '💎' };
  if (value >= 50) return { tier: 'Epic', color: 'text-yellow-400', icon: '⭐' };
  if (value >= 20) return { tier: 'Rare', color: 'text-blue-400', icon: '🔵' };
  if (value >= 5) return { tier: 'Uncommon', color: 'text-green-400', icon: '🟢' };
  return { tier: 'Common', color: 'text-gray-400', icon: '⚪' };
};

export default function CapsuleValueCalculator({ capsuleStats, className }: CapsuleValueCalculatorProps) {
  const value = calcCapsuleValue(capsuleStats);
  const { tier, color, icon } = getValueTier(value);

  return (
    <Card className={`bg-gradient-to-br from-[#0d1117] to-[#1a1f36] border-[#30363d] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[#00ffe1] flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Capsule Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Value Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-[#f0f6fc] flex items-center justify-center gap-2">
              <DollarSign className="h-8 w-8 text-[#00ffe1]" />
              {value.toFixed(2)}
            </div>
            <div className={`text-sm font-medium ${color} flex items-center justify-center gap-1 mt-1`}>
              <span>{icon}</span>
              <span>{tier} Capsule</span>
            </div>
          </div>

          {/* Value Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#8b949e]">
              <span>Views ({capsuleStats.views} × $0.01)</span>
              <span className="text-[#f0f6fc]">${(capsuleStats.views * 0.01).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#8b949e]">
              <span>Reactions ({capsuleStats.reactions} × $0.05)</span>
              <span className="text-[#f0f6fc]">${(capsuleStats.reactions * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#8b949e]">
              <span>Unlocks ({capsuleStats.unlocks} × $0.20)</span>
              <span className="text-[#f0f6fc]">${(capsuleStats.unlocks * 0.2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#8b949e]">
              <span>Verifications ({capsuleStats.verifications} × $0.25)</span>
              <span className="text-[#f0f6fc]">${(capsuleStats.verifications * 0.25).toFixed(2)}</span>
            </div>
            
            {capsuleStats.timeLockedDays > 0 && (
              <>
                <div className="border-t border-[#30363d] pt-2 mt-2"></div>
                <div className="flex justify-between text-[#8b949e]">
                  <span>Time Lock Bonus ({capsuleStats.timeLockedDays} days)</span>
                  <span className="text-[#00ffe1] flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{(((capsuleStats.timeLockedDays / 365) * 100).toFixed(1))}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Growth Potential */}
          <div className="mt-4 p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
            <div className="text-xs text-[#8b949e] mb-2">Growth Potential</div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Next tier at:</span>
              <span className="text-[#00ffe1]">${getNextTierThreshold(value).toFixed(2)}</span>
            </div>
            <div className="mt-2 bg-[#21262d] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((value / getNextTierThreshold(value)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getNextTierThreshold(currentValue: number): number {
  if (currentValue >= 100) return 200; // Beyond legendary
  if (currentValue >= 50) return 100;  // To legendary
  if (currentValue >= 20) return 50;   // To epic
  if (currentValue >= 5) return 20;    // To rare
  return 5; // To uncommon
}