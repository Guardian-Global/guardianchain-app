import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Tags, Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CapsuleAutotaggerProps {
  file?: File;
  content?: string;
  title?: string;
  onTagsGenerated?: (tags: string[], emotion: string) => void;
  className?: string;
}

interface TagAnalysis {
  tags: string[];
  emotion: string;
  confidence: number;
  theme: string;
  truthScore?: number;
}

export default function EnhancedCapsuleAutotagger({ 
  file, 
  content, 
  title,
  onTagsGenerated,
  className = "" 
}: CapsuleAutotaggerProps) {
  const [analysis, setAnalysis] = useState<TagAnalysis | null>(null);

  const analysisMutation = useMutation({
    mutationFn: async () => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        return apiRequest("POST", "/api/ai/capsule-tags", formData);
      } else {
        return apiRequest("POST", "/api/ai/capsule-tags", { 
          content, 
          title,
          name: title || "Untitled Capsule"
        });
      }
    },
    onSuccess: (data: TagAnalysis) => {
      setAnalysis(data);
      onTagsGenerated?.(data.tags, data.emotion);
    },
  });

  useEffect(() => {
    if (file || content) {
      analysisMutation.mutate();
    }
  }, [file, content, title]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'joy': case 'happiness': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'sadness': case 'grief': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'anger': case 'frustration': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'fear': case 'anxiety': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'hope': case 'optimism': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-[#00ffe1] bg-[#00ffe1]/20 border-[#00ffe1]/30';
    }
  };

  if (analysisMutation.isPending) {
    return (
      <Card className={`bg-[#161b22] border-[#30363d] ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin text-[#00ffe1]" />
            <div>
              <h4 className="font-medium text-[#f0f6fc]">Analyzing Content</h4>
              <p className="text-sm text-[#8b949e]">
                AI is generating tags and emotional analysis...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className={`bg-[#161b22] border-[#30363d] ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Emotion Analysis */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-[#ff00d4]" />
            <span className="text-sm font-medium text-[#f0f6fc]">Emotional Tone</span>
          </div>
          <Badge className={`${getEmotionColor(analysis.emotion)} text-xs px-2 py-1`}>
            {analysis.emotion}
          </Badge>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-[#00ffe1]" />
            <span className="text-sm font-medium text-[#f0f6fc]">Theme</span>
          </div>
          <Badge className="bg-[#00ffe1]/20 text-[#00ffe1] border border-[#00ffe1]/30 text-xs">
            {analysis.theme}
          </Badge>
        </div>

        {/* Auto-generated Tags */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Tags className="h-4 w-4 text-[#8b949e]" />
            <span className="text-sm font-medium text-[#f0f6fc]">Auto-generated Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.tags.map((tag, index) => (
              <Badge 
                key={index}
                className="bg-[#21262d] text-[#8b949e] border border-[#30363d] text-xs hover:bg-[#30363d] transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Truth Score */}
        {analysis.truthScore && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#ff00d4]" />
              <span className="text-sm font-medium text-[#f0f6fc]">Truth Score</span>
            </div>
            <Badge className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] text-black font-medium text-xs">
              {Math.round(analysis.truthScore)}%
            </Badge>
          </div>
        )}

        {/* Confidence */}
        <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8b949e]">AI Confidence</span>
            <span className="text-[#f0f6fc] font-medium">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#21262d] rounded-full h-1.5 mt-2">
            <div 
              className="bg-gradient-to-r from-[#00ffe1] to-[#ff00d4] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${analysis.confidence * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Legacy compatibility export
export function CapsuleAutotagger({ file }: { file: File }) {
  return <EnhancedCapsuleAutotagger file={file} />;
}