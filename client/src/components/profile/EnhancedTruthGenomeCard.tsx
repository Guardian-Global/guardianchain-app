import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dna, 
  Brain, 
  Shield, 
  Star, 
  Heart,
  Eye,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";

interface TruthTraits {
  analytical?: number;
  empathetic?: number;
  vigilant?: number;
  creative?: number;
  collaborative?: number;
  resilient?: number;
}

interface EnhancedTruthGenomeCardProps {
  traits?: TruthTraits | string[];
  userId?: string;
  className?: string;
  variant?: 'detailed' | 'simple';
}

export default function EnhancedTruthGenomeCard({ 
  traits = {
    analytical: 0.89,
    empathetic: 0.76,
    vigilant: 0.92,
    creative: 0.68,
    collaborative: 0.84,
    resilient: 0.91
  },
  className = "",
  variant = 'detailed'
}: EnhancedTruthGenomeCardProps) {
  
  const getTraitIcon = (trait: string) => {
    switch (trait) {
      case 'analytical': return <Brain className="h-4 w-4" />;
      case 'empathetic': return <Heart className="h-4 w-4" />;
      case 'vigilant': return <Eye className="h-4 w-4" />;
      case 'creative': return <Lightbulb className="h-4 w-4" />;
      case 'collaborative': return <Target className="h-4 w-4" />;
      case 'resilient': return <Shield className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTraitColor = (value: number) => {
    if (value >= 0.9) return "text-green-400 bg-green-500/20 border-green-500/30";
    if (value >= 0.8) return "text-blue-400 bg-blue-500/20 border-blue-500/30";
    if (value >= 0.7) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };

  const getTraitLabel = (trait: string) => {
    return trait.charAt(0).toUpperCase() + trait.slice(1);
  };

  // Handle simple variant for compatibility with extracted component
  if (variant === 'simple' || Array.isArray(traits)) {
    const traitsList = Array.isArray(traits) ? traits : [
      "Analytical Truth Detection",
      "Empathetic Communication",
      "Vigilant Information Processing",
      "Creative Problem Solving"
    ];

    return (
      <div className={`rounded-xl border p-4 shadow bg-[#161b22] border-[#30363d] text-sm ${className}`}>
        <h3 className="font-semibold mb-2 text-[#f0f6fc] flex items-center">
          <Dna className="h-4 w-4 mr-2 text-[#00ffe1]" />
          🧬 Your Truth Genome
        </h3>
        <ul className="space-y-1">
          {traitsList.map((trait, index) => (
            <li key={index} className="flex items-center text-[#8b949e]">
              <Star className="h-3 w-3 mr-2 text-[#00ffe1]" />
              {trait}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Detailed variant
  return (
    <Card className={`bg-[#161b22] border-[#30363d] ${className}`}>
      <CardHeader>
        <CardTitle className="text-[#f0f6fc] flex items-center">
          <Dna className="h-5 w-5 mr-2 text-[#00ffe1]" />
          Truth Genome Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(traits).map(([trait, value]) => (
            <div key={trait} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTraitIcon(trait)}
                  <span className="text-sm font-medium text-[#f0f6fc]">
                    {getTraitLabel(trait)}
                  </span>
                </div>
                <Badge className={`${getTraitColor(value)} text-xs px-2 py-1`}>
                  {Math.round(value * 100)}%
                </Badge>
              </div>
              <div className="w-full bg-[#21262d] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#f0f6fc] flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-[#00ffe1]" />
              Truth Score
            </span>
            <Badge className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black font-bold">
              {Math.round(Object.values(traits).reduce((a, b) => a + b, 0) / Object.keys(traits).length * 100)}
            </Badge>
          </div>
          <p className="text-xs text-[#8b949e]">
            Your unique truth verification signature based on genetic trait analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Legacy compatibility exports
export { EnhancedTruthGenomeCard as TruthGenomeCard };

// Simple compatibility function for extracted component  
export function TruthGenomeCard({ traits }: { traits: string[] }) {
  return <EnhancedTruthGenomeCard traits={traits} variant="simple" />;
}