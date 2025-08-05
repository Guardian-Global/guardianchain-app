import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Trophy, Crown, Sparkles } from 'lucide-react';

interface RemixProfileBadgesProps {
  remixCount: number;
  remixAwards: number;
  className?: string;
}

export default function RemixProfileBadges({ 
  remixCount, 
  remixAwards, 
  className 
}: RemixProfileBadgesProps) {
  
  const getRemixTier = (count: number) => {
    if (count >= 100) return { tier: 'Master', color: 'from-purple-500 to-pink-500', icon: Crown };
    if (count >= 50) return { tier: 'Expert', color: 'from-blue-500 to-purple-500', icon: Sparkles };
    if (count >= 20) return { tier: 'Creator', color: 'from-green-500 to-blue-500', icon: Palette };
    if (count >= 5) return { tier: 'Artist', color: 'from-yellow-500 to-green-500', icon: Palette };
    return { tier: 'Beginner', color: 'from-gray-500 to-gray-600', icon: Palette };
  };

  const remixTier = getRemixTier(remixCount);
  const TierIcon = remixTier.icon;

  if (remixCount === 0 && remixAwards === 0) {
    return null;
  }

  return (
    <Card className={`bg-gradient-to-br from-[#0d1117] to-[#161b22] border-[#30363d] shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3">
          {/* Remix Count Badge */}
          {remixCount > 0 && (
            <Badge 
              className={`bg-gradient-to-r ${remixTier.color} text-white border-0 px-3 py-1`}
              data-testid="remix-count-badge"
            >
              <TierIcon className="h-3 w-3 mr-1" />
              <span className="font-medium">
                {remixCount} Remix{remixCount !== 1 ? 'es' : ''}
              </span>
              <span className="ml-1 text-xs opacity-80">
                • {remixTier.tier}
              </span>
            </Badge>
          )}

          {/* Awards Badge */}
          {remixAwards > 0 && (
            <Badge 
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0 px-3 py-1"
              data-testid="remix-awards-badge"
            >
              <Trophy className="h-3 w-3 mr-1" />
              <span className="font-medium">
                {remixAwards} Win{remixAwards !== 1 ? 's' : ''}
              </span>
            </Badge>
          )}

          {/* Special Achievement Badges */}
          {remixCount >= 100 && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 px-3 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Remix Legend
            </Badge>
          )}

          {remixAwards >= 10 && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 py-1">
              <Trophy className="h-3 w-3 mr-1" />
              Champion
            </Badge>
          )}

          {remixAwards >= 5 && remixAwards < 10 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1">
              <Trophy className="h-3 w-3 mr-1" />
              Veteran
            </Badge>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="text-center p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
            <div className="text-[#00ffe1] font-bold text-2xl">{remixCount}</div>
            <div className="text-[#8b949e] text-sm mt-1">Total Remixes</div>
          </div>
          <div className="text-center p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
            <div className="text-[#ff00d4] font-bold text-2xl">{remixAwards}</div>
            <div className="text-[#8b949e] text-sm mt-1">Contest Wins</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {remixCount < 100 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#8b949e] mb-1">
              <span>Next tier: {getRemixTier(remixCount + 1).tier}</span>
              <span>{getNextTierThreshold(remixCount) - remixCount} more needed</span>
            </div>
            <div className="bg-[#161b22] rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${remixTier.color} h-2 rounded-full transition-all duration-500`}
                style={{ 
                  width: `${Math.min((remixCount / getNextTierThreshold(remixCount)) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getNextTierThreshold(currentCount: number): number {
  if (currentCount >= 100) return 200; // Beyond master
  if (currentCount >= 50) return 100;  // To master
  if (currentCount >= 20) return 50;   // To expert
  if (currentCount >= 5) return 20;    // To creator
  return 5; // To artist
}