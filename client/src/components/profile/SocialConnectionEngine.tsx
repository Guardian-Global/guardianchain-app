import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Share2, 
  Star,
  TrendingUp,
  Clock,
  Zap,
  Heart,
  Eye
} from 'lucide-react';

interface SuggestedConnection {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  mutualConnections: number;
  commonInterests: string[];
  activityScore: number;
  lastActive: string;
  isVerified: boolean;
  matchScore: number;
}

interface RecommendationReason {
  type: 'mutual_connections' | 'common_interests' | 'activity_pattern' | 'tier_match' | 'location';
  strength: number;
  description: string;
}

const mockConnections: SuggestedConnection[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    tier: 'CREATOR',
    mutualConnections: 12,
    commonInterests: ['Blockchain', 'AI', 'Web3'],
    activityScore: 87,
    lastActive: '2 hours ago',
    isVerified: true,
    matchScore: 94
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    tier: 'SOVEREIGN',
    mutualConnections: 8,
    commonInterests: ['Truth Verification', 'Community Building'],
    activityScore: 92,
    lastActive: '1 day ago',
    isVerified: true,
    matchScore: 89
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    tier: 'SEEKER',
    mutualConnections: 5,
    commonInterests: ['Technology', 'Innovation'],
    activityScore: 76,
    lastActive: '3 hours ago',
    isVerified: false,
    matchScore: 81
  }
];

export function SocialConnectionEngine() {
  const [connections, setConnections] = useState<SuggestedConnection[]>(mockConnections);
  const [selectedConnection, setSelectedConnection] = useState<SuggestedConnection | null>(null);
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());

  const getRecommendationReasons = (connection: SuggestedConnection): RecommendationReason[] => {
    const reasons: RecommendationReason[] = [];

    if (connection.mutualConnections > 5) {
      reasons.push({
        type: 'mutual_connections',
        strength: Math.min(100, connection.mutualConnections * 8),
        description: `${connection.mutualConnections} mutual connections`
      });
    }

    if (connection.commonInterests.length > 0) {
      reasons.push({
        type: 'common_interests',
        strength: connection.commonInterests.length * 25,
        description: `Shares ${connection.commonInterests.length} interests`
      });
    }

    if (connection.activityScore > 80) {
      reasons.push({
        type: 'activity_pattern',
        strength: connection.activityScore,
        description: 'High engagement activity'
      });
    }

    return reasons;
  };

  const handleConnect = async (connectionId: string) => {
    setConnectingIds(prev => new Set([...prev, connectionId]));
    
    // Simulate API call
    setTimeout(() => {
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      setConnectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
      setSelectedConnection(null);
    }, 1000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'SOVEREIGN': return 'text-[#ff00d4]';
      case 'CREATOR': return 'text-[#00ffe1]';
      case 'SEEKER': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#00ffe1]';
    if (score >= 80) return 'text-[#f59e0b]';
    if (score >= 70) return 'text-purple-400';
    return 'text-gray-400';
  };

  return (
    <Card className="bg-[#161b22] border-[#30363d]">
      <CardHeader>
        <CardTitle className="text-[#f0f6fc] flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-[#00ffe1]" />
            Social Connection Engine
          </div>
          <Badge variant="outline" className="border-[#00ffe1] text-[#00ffe1]">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-[#8b949e]" />
            <h3 className="text-[#f0f6fc] font-semibold mb-2">All caught up!</h3>
            <p className="text-[#8b949e] text-sm">Check back later for new connection suggestions.</p>
          </div>
        ) : (
          connections.map((connection) => (
            <div
              key={connection.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#00ffe1]/30 ${
                selectedConnection?.id === connection.id
                  ? 'border-[#00ffe1] bg-[#00ffe1]/5'
                  : 'border-[#30363d] hover:bg-[#21262d]'
              }`}
              onClick={() => setSelectedConnection(connection)}
              data-testid={`connection-${connection.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {connection.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00ffe1] rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[#f0f6fc] font-semibold">{connection.name}</h3>
                    <Badge variant="outline" className={`text-xs ${getTierColor(connection.tier)}`}>
                      {connection.tier}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getMatchScoreColor(connection.matchScore)}`}>
                    {connection.matchScore}%
                  </div>
                  <div className="text-xs text-[#8b949e]">Match</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <Users className="h-4 w-4" />
                  <span>{connection.mutualConnections} mutual</span>
                </div>
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <TrendingUp className="h-4 w-4" />
                  <span>{connection.activityScore}% active</span>
                </div>
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <Clock className="h-4 w-4" />
                  <span>{connection.lastActive}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <Heart className="h-4 w-4" />
                  <span>{connection.commonInterests.length} interests</span>
                </div>
              </div>

              {connection.commonInterests.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {connection.commonInterests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-[#30363d] text-[#8b949e]">
                        {interest}
                      </Badge>
                    ))}
                    {connection.commonInterests.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-[#30363d] text-[#8b949e]">
                        +{connection.commonInterests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {selectedConnection?.id === connection.id && (
                <div className="mt-4 pt-4 border-t border-[#30363d]">
                  <h4 className="text-[#f0f6fc] font-semibold mb-2">Why this connection?</h4>
                  <div className="space-y-2 mb-4">
                    {getRecommendationReasons(connection).map((reason, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-[#8b949e]">{reason.description}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#30363d] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00ffe1] transition-all duration-500"
                              style={{ width: `${reason.strength}%` }}
                            />
                          </div>
                          <span className="text-[#00ffe1] text-xs font-mono">
                            {reason.strength}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(connection.id);
                  }}
                  disabled={connectingIds.has(connection.id)}
                  className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90 flex-1"
                  data-testid={`connect-${connection.id}`}
                >
                  {connectingIds.has(connection.id) ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
                  data-testid={`message-${connection.id}`}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
                  data-testid={`view-${connection.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}