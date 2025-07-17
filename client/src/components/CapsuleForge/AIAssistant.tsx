import { useState } from 'react';
import { Brain, Sparkles, MessageCircle, Lightbulb, Zap, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CapsuleData {
  title: string;
  blocks: Array<{ id: number; type: string; content: string }>;
  metadata: {
    category: string;
    tags: string[];
    griefScore: number;
    credibilityScore: number;
  };
}

interface AIAssistantProps {
  capsuleData: CapsuleData;
  setCapsuleData: (data: CapsuleData) => void;
}

export default function AIAssistant({ capsuleData, setCapsuleData }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const quickActions = [
    {
      label: 'Improve Title',
      icon: Lightbulb,
      action: () => handleQuickAction('title'),
      description: 'Generate a better title'
    },
    {
      label: 'Add Tags',
      icon: Sparkles,
      action: () => handleQuickAction('tags'),
      description: 'Suggest relevant tags'
    },
    {
      label: 'Enhance Content',
      icon: MessageCircle,
      action: () => handleQuickAction('content'),
      description: 'Improve readability'
    },
    {
      label: 'Fact Check',
      icon: Zap,
      action: () => handleQuickAction('factcheck'),
      description: 'Verify claims'
    }
  ];

  const handleQuickAction = async (type: string) => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let result = '';
    
    switch (type) {
      case 'title':
        result = `Suggested title improvement: "${capsuleData.title || 'Untitled'}" → "Verified Analysis: ${capsuleData.title || 'Truth Investigation'}"`;
        break;
      case 'tags':
        result = 'Suggested tags: #verified #analysis #truth #investigation #blockchain';
        setSuggestions(['verified', 'analysis', 'truth', 'investigation', 'blockchain']);
        break;
      case 'content':
        result = 'AI suggests: Add more specific details, include sources, and structure with bullet points for better readability.';
        break;
      case 'factcheck':
        result = 'Fact-check suggestions: Verify statistics, add source citations, and include publication dates for referenced materials.';
        break;
    }

    toast({
      title: "AI Analysis Complete",
      description: result,
    });
    
    setIsLoading(false);
  };

  const handleCustomQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "AI Response",
      description: "Based on your query, I recommend focusing on factual accuracy and adding more supporting evidence.",
    });
    
    setQuery('');
    setIsLoading(false);
  };

  const getContentAnalysis = () => {
    const totalContent = capsuleData.blocks.reduce((total, block) => total + block.content.length, 0);
    const hasTitle = capsuleData.title.length > 0;
    const blockCount = capsuleData.blocks.length;
    
    return {
      completeness: hasTitle && totalContent > 100 ? 'Good' : 'Needs Work',
      structure: blockCount > 1 ? 'Multi-block' : 'Single Block',
      length: totalContent > 500 ? 'Detailed' : totalContent > 100 ? 'Moderate' : 'Brief'
    };
  };

  const analysis = getContentAnalysis();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-white">AI Capsule Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </CardTitle>
        {!isExpanded && (
          <p className="text-slate-400 text-sm">
            AI-powered writing and optimization assistance
          </p>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Content Analysis */}
          <div className="bg-slate-700/20 rounded-lg p-4 space-y-3">
            <h4 className="text-white font-semibold">Content Analysis</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className={`text-sm font-bold ${analysis.completeness === 'Good' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {analysis.completeness}
                </div>
                <div className="text-xs text-slate-400">Completeness</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-blue-400">{analysis.structure}</div>
                <div className="text-xs text-slate-400">Structure</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-purple-400">{analysis.length}</div>
                <div className="text-xs text-slate-400">Length</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Quick Improvements</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    disabled={isLoading}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-auto p-3 flex flex-col items-start gap-1"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{action.description}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Custom Query */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Ask AI Assistant</h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about improving your capsule, fact-checking, or writing suggestions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-16 resize-none"
              />
              <Button
                onClick={handleCustomQuery}
                disabled={!query.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Suggested Tags</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600/20 cursor-pointer"
                    onClick={() => {
                      toast({
                        title: "Tag Added",
                        description: `Added "${tag}" to your capsule`,
                      });
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Features */}
          <div className="bg-slate-700/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">AI Capabilities</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-slate-300">Content enhancement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-slate-300">Fact verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-slate-300">Tag suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-slate-300">Style improvement</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}