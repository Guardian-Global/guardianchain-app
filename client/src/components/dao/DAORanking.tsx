import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Users } from "lucide-react";

interface RankingData {
  name: string;
  score: number;
  badges: number;
  followers: number;
  avatar: string;
}

export default function DAORanking() {
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo - replace with actual API call
    setTimeout(() => {
      setRankings([
        { name: "TruthSeeker", score: 9847, badges: 12, followers: 234, avatar: "🛡️" },
        { name: "VerityGuard", score: 8756, badges: 9, followers: 189, avatar: "⚔️" },
        { name: "ChainWarden", score: 7623, badges: 8, followers: 156, avatar: "🔮" },
        { name: "DataKeeper", score: 6891, badges: 7, followers: 134, avatar: "📊" },
        { name: "CryptoSage", score: 5947, badges: 6, followers: 98, avatar: "🧙" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <Card className="bg-brand-secondary border-brand-surface">
        <CardHeader>
          <CardTitle className="text-brand-light flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-warning" />
            DAO Reputation Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-brand-surface rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-warning" />
          DAO Reputation Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.map((member, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors hover:border-brand-primary/30 ${
                index === 0 
                  ? "bg-gradient-to-r from-yellow-500/10 to-brand-secondary border-yellow-500/30" 
                  : index === 1
                  ? "bg-gradient-to-r from-gray-400/10 to-brand-secondary border-gray-400/30"
                  : index === 2
                  ? "bg-gradient-to-r from-amber-600/10 to-brand-secondary border-amber-600/30"
                  : "bg-brand-surface border-brand-primary/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{member.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-light">
                          {member.name}
                        </span>
                        {index < 3 && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              index === 0 ? "border-yellow-500 text-yellow-400" :
                              index === 1 ? "border-gray-400 text-gray-300" :
                              "border-amber-600 text-amber-400"
                            }`}
                          >
                            #{index + 1}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-brand-light/60">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{member.badges} badges</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{member.followers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-accent">
                    {member.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-brand-light/60">
                    reputation
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}