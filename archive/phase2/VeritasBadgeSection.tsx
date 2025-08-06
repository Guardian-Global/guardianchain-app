import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VeritasBadgeDownloader from "./VeritasBadgeDownloader";
import { Shield, Award, Star, Crown } from "lucide-react";

interface VeritasBadge {
  id: string;
  name: string;
  description: string;
  badgeUrl: string;
  earned: boolean;
  earnedDate?: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface VeritasBadgeSectionProps {
  userId?: string;
}

export default function VeritasBadgeSection({ userId = "dev-user-123" }: VeritasBadgeSectionProps) {
  // Mock badge data - in production this would come from API
  const badges: VeritasBadge[] = [
    {
      id: "veritas-gold",
      name: "Guardian Veritas - Gold",
      description: "Completed 100+ truth verifications with 95%+ accuracy",
      badgeUrl: "/assets/veritas-badge-gold.svg",
      earned: true,
      earnedDate: "2025-01-05",
      rarity: "gold"
    },
    {
      id: "veritas-silver", 
      name: "Guardian Veritas - Silver",
      description: "Completed 50+ truth verifications with 90%+ accuracy",
      badgeUrl: "/assets/veritas-badge-silver.svg",
      earned: true,
      earnedDate: "2024-12-15",
      rarity: "silver"
    },
    {
      id: "veritas-bronze",
      name: "Guardian Veritas - Bronze", 
      description: "Completed 10+ truth verifications with 85%+ accuracy",
      badgeUrl: "/assets/veritas-badge-bronze.svg",
      earned: true,
      earnedDate: "2024-11-20",
      rarity: "bronze"
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'gold': return 'text-yellow-500 border-yellow-500';
      case 'silver': return 'text-gray-400 border-gray-400';
      case 'bronze': return 'text-orange-600 border-orange-600';
      case 'platinum': return 'text-purple-500 border-purple-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'gold': return <Crown className="w-4 h-4" />;
      case 'silver': return <Star className="w-4 h-4" />;
      case 'bronze': return <Award className="w-4 h-4" />;
      case 'platinum': return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Shield className="w-6 h-6 text-cyan-400" />
          Veritas Badges
          <Badge variant="outline" className="ml-auto text-cyan-400 border-cyan-400">
            {earnedBadges.length}/{totalBadges} Earned
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {earnedBadges.length > 0 ? (
            <>
              <p className="text-slate-300 text-sm">
                Download your earned Veritas badges to showcase your verification achievements across platforms.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {earnedBadges.map((badge) => (
                  <Card key={badge.id} className="bg-slate-800/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        <Badge 
                          variant="outline" 
                          className={`${getRarityColor(badge.rarity)} mb-2`}
                        >
                          {getRarityIcon(badge.rarity)}
                          <span className="ml-1 capitalize">{badge.rarity}</span>
                        </Badge>
                        
                        <h3 className="font-semibold text-white text-sm">
                          {badge.name}
                        </h3>
                        
                        <p className="text-xs text-slate-400 mb-3">
                          {badge.description}
                        </p>
                        
                        {badge.earnedDate && (
                          <p className="text-xs text-slate-500">
                            Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                        
                        <VeritasBadgeDownloader badgeUrl={badge.badgeUrl} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                No Badges Earned Yet
              </h3>
              <p className="text-slate-400 text-sm">
                Complete truth verifications to earn your first Veritas badge!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}