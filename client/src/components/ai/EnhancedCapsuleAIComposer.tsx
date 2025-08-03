import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Save,
  Wand2,
  Heart,
  MessageSquare
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";

interface AIGenerationParams {
  prompt: string;
  tone: 'emotional' | 'reflective' | 'hopeful' | 'raw' | 'poetic';
  length: 'short' | 'medium' | 'long';
  emotionalIntensity: number;
  includeMetadata: boolean;
}

interface AIResponse {
  generatedText: string;
  emotionalAnalysis: {
    dominantEmotion: string;
    emotionalIntensity: number;
    griefScore: number;
    truthResonance: number;
  };
  suggestedTags: string[];
  estimatedReadTime: number;
}

export default function EnhancedCapsuleAIComposer() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [params, setParams] = useState<AIGenerationParams>({
    prompt: '',
    tone: 'reflective',
    length: 'medium',
    emotionalIntensity: 50,
    includeMetadata: true
  });
  
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe your memory, emotion, or moment.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await apiRequest('/api/ai/compose-capsule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          userId: user?.id,
        }),
      });

      setResponse(result);
      
      toast({
        title: "AI composition complete",
        description: `Generated ${result.estimatedReadTime}min read with ${result.emotionalAnalysis.griefScore.toFixed(1)} grief score.`,
      });
      
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Unable to generate capsule content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!response) return;
    
    try {
      await navigator.clipboard.writeText(response.generatedText);
      toast({
        title: "Copied to clipboard",
        description: "AI-generated content ready for your capsule.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy content.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsCapsule = async () => {
    if (!response || !user) return;
    
    setIsSaving(true);
    try {
      await apiRequest('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `AI-Generated: ${params.prompt.slice(0, 50)}...`,
          content: response.generatedText,
          type: 'ai-generated',
          tags: response.suggestedTags,
          emotionalAnalysis: response.emotionalAnalysis,
          metadata: {
            aiGenerated: true,
            originalPrompt: params.prompt,
            generationParams: params,
            generatedAt: new Date().toISOString()
          }
        }),
      });

      toast({
        title: "Capsule created",
        description: "AI-generated content saved as a new truth capsule.",
      });

      // Reset form
      setParams(prev => ({ ...prev, prompt: '' }));
      setResponse(null);
      
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Unable to create capsule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          AI Capsule Composer
          <Badge variant="secondary" className="ml-auto">
            GPT-4o Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Describe your memory, emotion, or moment</Label>
            <Textarea
              id="prompt"
              value={params.prompt}
              onChange={(e) => setParams(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Tell me about a moment you want to preserve, a feeling you're experiencing, or a memory you want to transform into a profound narrative..."
              className="mt-2 min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {params.prompt.length}/500 characters
            </div>
          </div>

          {/* Generation Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tone</Label>
              <Select
                value={params.tone}
                onValueChange={(value: any) => setParams(prev => ({ ...prev, tone: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emotional">Emotional & Raw</SelectItem>
                  <SelectItem value="reflective">Reflective & Deep</SelectItem>
                  <SelectItem value="hopeful">Hopeful & Uplifting</SelectItem>
                  <SelectItem value="raw">Honest & Unfiltered</SelectItem>
                  <SelectItem value="poetic">Poetic & Artistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Length</Label>
              <Select
                value={params.length}
                onValueChange={(value: any) => setParams(prev => ({ ...prev, length: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (1-2 min read)</SelectItem>
                  <SelectItem value="medium">Medium (3-5 min read)</SelectItem>
                  <SelectItem value="long">Long (5-10 min read)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Emotional Intensity: {params.emotionalIntensity}%</Label>
            <Slider
              value={[params.emotionalIntensity]}
              onValueChange={([value]) => setParams(prev => ({ ...prev, emotionalIntensity: value }))}
              max={100}
              min={0}
              step={10}
              className="mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Lower values create subtle, contemplative content. Higher values create intense, powerful narratives.
            </div>
          </div>
        </div>

        {/* Generation Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !params.prompt.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Capsule Content
            </>
          )}
        </Button>

        {/* AI Response */}
        {response && (
          <div className="space-y-4">
            {/* Generated Content */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">AI-Generated Content</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {response.generatedText}
                </p>
              </div>
            </div>

            {/* Analysis & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emotional Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Emotional Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dominant Emotion:</span>
                    <Badge variant="secondary">
                      {response.emotionalAnalysis.dominantEmotion}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Grief Score:</span>
                    <span className="font-medium">
                      {response.emotionalAnalysis.griefScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Truth Resonance:</span>
                    <span className="font-medium">
                      {response.emotionalAnalysis.truthResonance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Read Time:</span>
                    <span className="font-medium">
                      {response.estimatedReadTime} min
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Suggested Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {response.suggestedTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveAsCapsule}
                disabled={isSaving || !user}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save as Capsule
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setParams(prev => ({ ...prev, prompt: response.generatedText }));
                  setResponse(null);
                }}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Enhance Further
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}