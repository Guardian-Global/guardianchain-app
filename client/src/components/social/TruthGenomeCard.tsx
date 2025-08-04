import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, Star, Zap, Award, Trophy, Crown, Gem, 
  Heart, TrendingUp, Activity, Brain
} from "lucide-react";

interface TruthGenomeCardProps {
  userId: string;
  displayName: string;
  truthScore: number;
  verificationLevel: string;
  geneticTraits: string[];
  emotionalResonance: number;
  influenceScore: number;
  lineageDepth: number;
  capsuleCount: number;
  className?: string;
}

export function TruthGenomeCard({
  userId,
  displayName,
  truthScore,
  verificationLevel,
  geneticTraits,
  emotionalResonance,
  influenceScore,
  lineageDepth,
  capsuleCount,
  className = ""
}: TruthGenomeCardProps) {
  const getVerificationIcon = (level: string) => {
    switch (level) {
      case "Sovereign": return <Crown className="w-5 h-5 text-[#ff00d4]" />;
      case "Guardian": return <Shield className="w-5 h-5 text-[#00ffe1]" />;
      case "Verified": return <Award className="w-5 h-5 text-[#10b981]" />;
      default: return <Star className="w-5 h-5 text-[#8b949e]" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#00ffe1]";
    if (score >= 75) return "text-[#10b981]";
    if (score >= 60) return "text-[#f79009]";
    return "text-[#f85149]";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-[#00ffe1]";
    if (score >= 75) return "bg-[#10b981]";
    if (score >= 60) return "bg-[#f79009]";
    return "bg-[#f85149]";
  };

  return (
    <Card className={`bg-[#161b22] border-[#30363d] hover:border-[#00ffe1]/30 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#f0f6fc] flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#ff00d4]" />
            Truth Genome
          </CardTitle>
          <div className="flex items-center gap-2">
            {getVerificationIcon(verificationLevel)}
            <Badge variant="outline" className="border-[#00ffe1] text-[#00ffe1]">
              {verificationLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Core Truth Score */}
        <div className="text-center p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
          <div className="text-3xl font-bold text-gradient-neural mb-2">
            {truthScore}
          </div>
          <div className="text-sm text-[#8b949e] mb-3">Truth Score</div>
          <Progress 
            value={truthScore} 
            className="h-2 bg-[#30363d]"
          />
          <div className="flex justify-between text-xs text-[#8b949e] mt-2">
            <span>0</span>
            <span>100</span>
          </div>
        </div>

        {/* Genetic Traits */}
        <div>
          <h4 className="text-sm font-semibold text-[#f0f6fc] mb-3 flex items-center gap-2">
            <Gem className="w-4 h-4 text-[#7c3aed]" />
            Genetic Traits
          </h4>
          <div className="flex flex-wrap gap-2">
            {geneticTraits.map((trait) => (
              <Badge 
                key={trait} 
                variant="outline" 
                className="border-[#7c3aed] text-[#7c3aed] text-xs"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <Heart className="w-5 h-5 text-[#ff69b4] mx-auto mb-2" />
            <div className="text-lg font-bold text-[#f0f6fc]">{emotionalResonance}%</div>
            <div className="text-xs text-[#8b949e]">Emotional Resonance</div>
          </div>
          
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <TrendingUp className="w-5 h-5 text-[#00ffe1] mx-auto mb-2" />
            <div className="text-lg font-bold text-[#f0f6fc]">{influenceScore}</div>
            <div className="text-xs text-[#8b949e]">Influence Score</div>
          </div>
          
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <Activity className="w-5 h-5 text-[#10b981] mx-auto mb-2" />
            <div className="text-lg font-bold text-[#f0f6fc]">{lineageDepth}</div>
            <div className="text-xs text-[#8b949e]">Lineage Depth</div>
          </div>
          
          <div className="text-center p-3 bg-[#21262d] rounded-lg">
            <Trophy className="w-5 h-5 text-[#f79009] mx-auto mb-2" />
            <div className="text-lg font-bold text-[#f0f6fc]">{capsuleCount}</div>
            <div className="text-xs text-[#8b949e]">Capsules</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
          >
            <Zap className="w-4 h-4 mr-1" />
            Analyze Genome
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-[#30363d] text-[#8b949e] hover:border-[#ff00d4] hover:text-[#ff00d4]"
          >
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}