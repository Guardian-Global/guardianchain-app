import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Sparkles,
  Brain,
  Wand2,
  Target,
  TrendingUp,
  Zap,
  RefreshCw,
  Copy,
  Download,
  Share2,
  Settings,
  Sliders,
  Palette,
  Volume2,
  Eye,
  Heart,
  Shield,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  Flame,
  BarChart3
} from 'lucide-react';

interface AIComposerSettings {
  creativity: number;
  emotionalDepth: number;
  truthScore: number;
  engagement: number;
  formality: number;
  length: 'short' | 'medium' | 'long';
  tone: 'neutral' | 'inspiring' | 'urgent' | 'personal' | 'professional';
  includeEmotions: boolean;
  addMetadata: boolean;
  optimizeForGTT: boolean;
}

interface GeneratedContent {
  content: string;
  title: string;
  tags: string[];
  emotions: string[];
  estimatedGTT: number;
  truthScore: number;
  impactScore: number;
  readingTime: number;
  sentiment: string;
  recommendations: string[];
}

interface CapsuleAIComposerProps {
  initialPrompt?: string;
  onContentGenerated: (content: GeneratedContent) => void;
}

const tonePresets = [
  { id: 'neutral', name: 'Neutral', color: 'bg-gray-500', description: 'Balanced and objective' },
  { id: 'inspiring', name: 'Inspiring', color: 'bg-blue-500', description: 'Uplifting and motivational' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-500', description: 'Critical and immediate' },
  { id: 'personal', name: 'Personal', color: 'bg-pink-500', description: 'Intimate and heartfelt' },
  { id: 'professional', name: 'Professional', color: 'bg-green-500', description: 'Formal and authoritative' }
];

const lengthPresets = [
  { id: 'short', name: 'Short', chars: '50-200', description: 'Quick impact' },
  { id: 'medium', name: 'Medium', chars: '200-500', description: 'Detailed story' },
  { id: 'long', name: 'Long', chars: '500+', description: 'Comprehensive narrative' }
];

export default function CapsuleAIComposer({ 
  initialPrompt = '', 
  onContentGenerated 
}: CapsuleAIComposerProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [settings, setSettings] = useState<AIComposerSettings>({
    creativity: 75,
    emotionalDepth: 80,
    truthScore: 90,
    engagement: 85,
    formality: 50,
    length: 'medium',
    tone: 'neutral',
    includeEmotions: true,
    addMetadata: true,
    optimizeForGTT: true
  });
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [iterations, setIterations] = useState(1);

  const { toast } = useToast();

  const generateContentMutation = useMutation({
    mutationFn: async (data: { prompt: string; settings: AIComposerSettings }) => {
      return apiRequest('POST', '/api/ai/compose-capsule', data);
    },
    onSuccess: (response) => {
      setGeneratedContent(response);
      onContentGenerated(response);
      toast({
        title: "Content Generated Successfully!",
        description: `Created ${response.content.length} character capsule with ${response.estimatedGTT} GTT potential.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again with different settings.",
        variant: "destructive",
      });
    },
  });

  const refineContentMutation = useMutation({
    mutationFn: async (data: { content: string; refinement: string }) => {
      return apiRequest('POST', '/api/ai/refine-capsule', data);
    },
    onSuccess: (response) => {
      setGeneratedContent(response);
      onContentGenerated(response);
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt or topic to generate content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    generateContentMutation.mutate({ prompt, settings });
    setIterations(prev => prev + 1);
  };

  const handleRefine = (refinement: string) => {
    if (generatedContent) {
      refineContentMutation.mutate({
        content: generatedContent.content,
        refinement
      });
    }
  };

  const updateSetting = (key: keyof AIComposerSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      toast({
        title: "Copied to Clipboard",
        description: "Content copied successfully.",
      });
    }
  };

  const exportContent = () => {
    if (generatedContent) {
      const blob = new Blob([JSON.stringify(generatedContent, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `capsule-content-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    setIsGenerating(generateContentMutation.isPending);
  }, [generateContentMutation.isPending]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            AI Capsule Composer
            <Badge className="ml-auto bg-purple-600">v2.0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-sm">
            Generate compelling capsule content with advanced AI assistance and customizable parameters.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-black/50 backdrop-blur-lg border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Content Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create... (e.g., 'A personal memory about overcoming challenges', 'Truth about climate change', 'Prediction about AI development')"
              className="min-h-[120px] resize-none"
              data-testid="ai-prompt-input"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{prompt.length} characters</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                data-testid="toggle-advanced"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </Button>
            </div>

            {/* Quick Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {tonePresets.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => updateSetting('tone', tone.id)}
                      className={`p-2 rounded border text-left transition-all ${
                        settings.tone === tone.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      data-testid={`tone-${tone.id}`}
                    >
                      <div className={`w-3 h-3 ${tone.color} rounded-full mb-1`}></div>
                      <div className="text-white text-xs font-medium">{tone.name}</div>
                      <div className="text-gray-400 text-xs">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {lengthPresets.map((length) => (
                    <button
                      key={length.id}
                      onClick={() => updateSetting('length', length.id)}
                      className={`p-2 rounded border text-center transition-all ${
                        settings.length === length.id
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      data-testid={`length-${length.id}`}
                    >
                      <div className="text-white text-xs font-medium">{length.name}</div>
                      <div className="text-gray-400 text-xs">{length.chars}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 border-t border-gray-600 pt-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Creativity: {settings.creativity}%
                    </label>
                    <Slider
                      value={[settings.creativity]}
                      onValueChange={(value) => updateSetting('creativity', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                      data-testid="creativity-slider"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Emotional Depth: {settings.emotionalDepth}%
                    </label>
                    <Slider
                      value={[settings.emotionalDepth]}
                      onValueChange={(value) => updateSetting('emotionalDepth', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                      data-testid="emotion-slider"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Truth Focus: {settings.truthScore}%
                    </label>
                    <Slider
                      value={[settings.truthScore]}
                      onValueChange={(value) => updateSetting('truthScore', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                      data-testid="truth-slider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">Include Emotions</span>
                    <Switch
                      checked={settings.includeEmotions}
                      onCheckedChange={(checked) => updateSetting('includeEmotions', checked)}
                      data-testid="emotions-toggle"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">Optimize for GTT</span>
                    <Switch
                      checked={settings.optimizeForGTT}
                      onCheckedChange={(checked) => updateSetting('optimizeForGTT', checked)}
                      data-testid="gtt-toggle"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              data-testid="generate-content"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-black/50 backdrop-blur-lg border-gray-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Wand2 className="w-5 h-5 mr-2" />
                Generated Content
              </CardTitle>
              {generatedContent && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    data-testid="copy-content"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportContent}
                    data-testid="export-content"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedContent ? (
              <>
                {/* Content Display */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {generatedContent.title}
                    </h3>
                    <div className="p-4 bg-gray-800/50 rounded border border-gray-600 max-h-64 overflow-y-auto">
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {generatedContent.content}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded">
                      <div className="text-lg font-bold text-yellow-300">
                        {generatedContent.estimatedGTT}
                      </div>
                      <div className="text-xs text-gray-400">Estimated GTT</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded">
                      <div className="text-lg font-bold text-cyan-300">
                        {generatedContent.truthScore}%
                      </div>
                      <div className="text-xs text-gray-400">Truth Score</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded">
                      <div className="text-lg font-bold text-purple-300">
                        {generatedContent.impactScore}%
                      </div>
                      <div className="text-xs text-gray-400">Impact Score</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded">
                      <div className="text-lg font-bold text-green-300">
                        {generatedContent.readingTime}min
                      </div>
                      <div className="text-xs text-gray-400">Read Time</div>
                    </div>
                  </div>

                  {/* Tags and Emotions */}
                  {generatedContent.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedContent.emotions.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Emotions</label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.emotions.map((emotion, index) => (
                          <Badge key={index} className="bg-pink-600">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {generatedContent.recommendations.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">AI Recommendations</label>
                      <div className="space-y-2">
                        {generatedContent.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Refinements */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Quick Refinements</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Make more emotional',
                        'Add more details',
                        'Increase urgency',
                        'Make more personal'
                      ].map((refinement, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefine(refinement)}
                          disabled={refineContentMutation.isPending}
                          data-testid={`refine-${index}`}
                        >
                          {refineContentMutation.isPending ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3 mr-1" />
                          )}
                          {refinement}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate</h3>
                <p className="text-gray-400">
                  Enter a prompt and click Generate to create AI-powered capsule content.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Iteration #{iterations}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}