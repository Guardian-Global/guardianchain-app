import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dna, 
  Star, 
  Shield, 
  Eye,
  Brain,
  Heart,
  Compass,
  BookOpen,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Info
} from "lucide-react";

interface TruthGenomeProps {
  userId: string;
  traits?: GenomeTrait[];
  overallScore?: number;
  className?: string;
}

interface GenomeTrait {
  name: string;
  category: 'personality' | 'expertise' | 'behavior' | 'impact';
  strength: number; // 0-100
  description: string;
  icon: React.ReactNode;
  color: string;
  evidence: string[];
}

export default function TruthGenomeCard({
  userId,
  traits = [],
  overallScore = 87,
  className = ""
}: TruthGenomeProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Default genome traits if none provided
  const defaultTraits: GenomeTrait[] = [
    {
      name: "Seeker",
      category: 'personality',
      strength: 92,
      description: "Driven by curiosity and truth-seeking behavior",
      icon: <Compass className="w-4 h-4" />,
      color: "text-blue-600",
      evidence: ["High engagement with investigation content", "Frequently asks probing questions", "Cross-references sources"]
    },
    {
      name: "Whistleblower",
      category: 'behavior',
      strength: 78,
      description: "Tendency to expose hidden truths and injustices",
      icon: <Shield className="w-4 h-4" />,
      color: "text-green-600",
      evidence: ["Shares controversial but verified information", "Challenges authority narratives", "Protects source anonymity"]
    },
    {
      name: "Visionary",
      category: 'impact',
      strength: 85,
      description: "Sees patterns and future implications others miss",
      icon: <Eye className="w-4 h-4" />,
      color: "text-purple-600",
      evidence: ["Predicted trends before they manifested", "Connects seemingly unrelated events", "Long-term thinking patterns"]
    },
    {
      name: "Historian",
      category: 'expertise',
      strength: 89,
      description: "Deep knowledge of historical patterns and context",
      icon: <BookOpen className="w-4 h-4" />,
      color: "text-amber-600",
      evidence: ["References historical precedents", "Preserves family and cultural memories", "Contextualizes current events"]
    }
  ];

  const activeTraits = traits.length > 0 ? traits : defaultTraits;
  const dominantTrait = activeTraits.reduce((prev, current) => 
    prev.strength > current.strength ? prev : current
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personality': return <Heart className="w-3 h-3" />;
      case 'expertise': return <Brain className="w-3 h-3" />;
      case 'behavior': return <Zap className="w-3 h-3" />;
      case 'impact': return <TrendingUp className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  return (
    <Card className={`border-gradient-to-r from-purple-200 to-blue-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-purple-600" />
          Truth Genome
          <Badge variant="secondary" className={`ml-auto ${getScoreColor(overallScore)}`}>
            <Crown className="w-3 h-3 mr-1" />
            {overallScore}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dominant Trait Spotlight */}
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            {dominantTrait.icon}
            <span className="font-semibold text-sm">{dominantTrait.name}</span>
            <Badge variant="outline" className="text-xs">
              Dominant
            </Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {dominantTrait.description}
          </p>
          <Progress value={dominantTrait.strength} className="mt-2 h-2" />
        </div>

        {/* Trait Grid */}
        <div className="grid grid-cols-2 gap-2">
          {activeTraits.slice(0, 4).map((trait, index) => (
            <div
              key={index}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {trait.icon}
                <span className="text-xs font-medium">{trait.name}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                {getCategoryIcon(trait.category)}
                <span className={`text-xs font-bold ${trait.color}`}>
                  {trait.strength}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Genome Analysis */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            <Info className="w-3 h-3 mr-1" />
            {showDetails ? 'Hide' : 'Show'} Genome Analysis
          </Button>
        </div>

        {/* Detailed Analysis (Collapsible) */}
        {showDetails && (
          <div className="space-y-3 pt-2 border-t">
            {activeTraits.map((trait, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {trait.icon}
                    <span className="text-sm font-medium">{trait.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {trait.strength}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {trait.description}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Evidence:</p>
                  {trait.evidence.slice(0, 2).map((evidence, idx) => (
                    <p key={idx} className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      • {evidence}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Badge variant="secondary" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                Genome Updated: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}