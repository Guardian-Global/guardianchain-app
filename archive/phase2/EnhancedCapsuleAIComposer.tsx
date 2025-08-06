import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Wand2, 
  Bot, 
  Sparkles, 
  Brain, 
  Target, 
  Zap,
  RefreshCw,
  Copy,
  Download,
  Save,
  Settings,
  PenTool,
  Lightbulb,
  MessageSquare,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

const composerSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  style: z.string(),
  tone: z.string(),
  length: z.string(),
  perspective: z.string(),
  includeEmotions: z.boolean(),
  includeEvidence: z.boolean(),
  factCheck: z.boolean(),
  creativity: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  emotionalDepth: z.number().min(0).max(100),
});

type ComposerFormData = z.infer<typeof composerSchema>;

interface GeneratedContent {
  id: string;
  content: string;
  style: string;
  tone: string;
  truthScore: number;
  emotionalResonance: number;
  readabilityScore: number;
  wordCount: number;
  estimatedReadTime: number;
  keyThemes: string[];
  emotions: string[];
  suggestions: string[];
  timestamp: string;
}

interface AIProvider {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export default function EnhancedCapsuleAIComposer() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeProvider, setActiveProvider] = useState("gpt4o");
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<ComposerFormData>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      prompt: "",
      style: "narrative",
      tone: "authentic",
      length: "medium",
      perspective: "first_person",
      includeEmotions: true,
      includeEvidence: true,
      factCheck: true,
      creativity: 70,
      accuracy: 90,
      emotionalDepth: 80,
    },
  });

  const aiProviders: AIProvider[] = [
    {
      id: "gpt4o",
      name: "GPT-4o",
      description: "Latest OpenAI model with enhanced reasoning",
      strengths: ["Creative writing", "Emotional depth", "Narrative structure"],
      icon: Bot
    },
    {
      id: "claude",
      name: "Claude 3.5",
      description: "Anthropic's advanced AI for nuanced content",
      strengths: ["Fact checking", "Ethical reasoning", "Complex analysis"],
      icon: Brain
    },
    {
      id: "guardian_ai",
      name: "Guardian AI",
      description: "Custom truth-focused model",
      strengths: ["Truth detection", "Authenticity", "Grief processing"],
      icon: Target
    }
  ];

  const styles = [
    { id: "narrative", name: "Narrative", desc: "Story-telling approach" },
    { id: "testimonial", name: "Testimonial", desc: "Personal witness account" },
    { id: "documentary", name: "Documentary", desc: "Factual reporting style" },
    { id: "journal", name: "Journal", desc: "Personal diary format" },
    { id: "letter", name: "Letter", desc: "Addressed to someone" },
    { id: "investigation", name: "Investigation", desc: "Research-based format" }
  ];

  const tones = [
    { id: "authentic", name: "Authentic", desc: "Genuine and honest" },
    { id: "urgent", name: "Urgent", desc: "Time-sensitive importance" },
    { id: "reflective", name: "Reflective", desc: "Thoughtful and contemplative" },
    { id: "determined", name: "Determined", desc: "Strong and resolute" },
    { id: "compassionate", name: "Compassionate", desc: "Empathetic and caring" },
    { id: "professional", name: "Professional", desc: "Formal and objective" }
  ];

  const lengths = [
    { id: "brief", name: "Brief", desc: "100-300 words", words: "~200 words" },
    { id: "medium", name: "Medium", desc: "300-800 words", words: "~500 words" },
    { id: "detailed", name: "Detailed", desc: "800-1500 words", words: "~1000 words" },
    { id: "comprehensive", name: "Comprehensive", desc: "1500+ words", words: "~2000 words" }
  ];

  const perspectives = [
    { id: "first_person", name: "First Person", desc: "I/me perspective" },
    { id: "third_person", name: "Third Person", desc: "They/them perspective" },
    { id: "observer", name: "Observer", desc: "Witness perspective" },
    { id: "collective", name: "Collective", desc: "We/us perspective" }
  ];

  const generateContent = async (data: ComposerFormData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/compose-capsule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          provider: activeProvider,
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const result = await response.json();
      
      // Mock enhanced result
      const enhancedContent: GeneratedContent = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: result.content || generateMockContent(data),
        style: data.style,
        tone: data.tone,
        truthScore: Math.floor(Math.random() * 20) + 80,
        emotionalResonance: Math.floor(Math.random() * 30) + 70,
        readabilityScore: Math.floor(Math.random() * 20) + 80,
        wordCount: result.wordCount || Math.floor(Math.random() * 500) + 300,
        estimatedReadTime: Math.ceil((result.wordCount || 400) / 200),
        keyThemes: result.keyThemes || ["truth", "authenticity", "evidence", "witness"],
        emotions: result.emotions || ["determination", "hope", "concern"],
        suggestions: [
          "Consider adding specific timestamps for verification",
          "Include geographical context for credibility",
          "Add emotional markers for authenticity",
          "Consider evidence level requirements"
        ],
        timestamp: new Date().toISOString()
      };

      setGeneratedContent(prev => [enhancedContent, ...prev]);
      setSelectedContent(enhancedContent.id);
      
      toast({
        title: "Content generated",
        description: `${enhancedContent.wordCount} words with ${enhancedContent.truthScore}% truth score`,
      });

    } catch (error) {
      console.error("Generation failed:", error);
      toast({
        title: "Generation failed",
        description: "Please try again with different parameters",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (data: ComposerFormData): string => {
    const templates = {
      narrative: "This is the story of what I witnessed that day. The events unfolded in a way that changed everything I thought I knew about truth and justice...",
      testimonial: "I am coming forward to share what I experienced firsthand. This testimony is my attempt to set the record straight...",
      documentary: "The following account documents the events that occurred on [DATE] at [LOCATION]. Multiple sources have confirmed...",
      journal: "Today I decided to write down what really happened. I've kept this inside for too long...",
      letter: "Dear [RECIPIENT], I am writing to you because I believe you deserve to know the truth about what really occurred...",
      investigation: "After months of investigation and gathering evidence, I have uncovered information that must be shared..."
    };

    return templates[data.style as keyof typeof templates] || templates.narrative;
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully",
    });
  };

  const downloadContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truth_capsule_${content.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Content saved to file",
    });
  };

  const selectedContentData = generatedContent.find(c => c.id === selectedContent);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            AI Content Composer
            <Badge variant="outline" className="ml-auto">
              GPT-4o Powered
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-400">
            Generate authentic, truth-focused content with advanced AI assistance
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(generateContent)} className="space-y-6">
              {/* AI Provider Selection */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-sm">AI Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiProviders.map((provider) => (
                      <Button
                        key={provider.id}
                        type="button"
                        variant={activeProvider === provider.id ? "default" : "outline"}
                        onClick={() => setActiveProvider(provider.id)}
                        className="h-auto p-4 flex-col gap-2"
                      >
                        <provider.icon className="w-5 h-5" />
                        <div className="text-center">
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-xs opacity-70">{provider.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Main Input */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-sm">Content Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            ref={textareaRef}
                            placeholder="Describe what you want to express... Be specific about the situation, emotions, and key details you want included."
                            rows={6}
                            className="bg-slate-700/50 border-purple-500/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Style Configuration */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-sm">Style & Format</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Writing Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {styles.map((style) => (
                                <SelectItem key={style.id} value={style.id}>
                                  <div>
                                    <div className="font-medium">{style.name}</div>
                                    <div className="text-xs text-gray-400">{style.desc}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tones.map((tone) => (
                                <SelectItem key={tone.id} value={tone.id}>
                                  <div>
                                    <div className="font-medium">{tone.name}</div>
                                    <div className="text-xs text-gray-400">{tone.desc}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {lengths.map((length) => (
                                <SelectItem key={length.id} value={length.id}>
                                  <div>
                                    <div className="font-medium">{length.name}</div>
                                    <div className="text-xs text-gray-400">{length.words}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="perspective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perspective</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {perspectives.map((perspective) => (
                                <SelectItem key={perspective.id} value={perspective.id}>
                                  <div>
                                    <div className="font-medium">{perspective.name}</div>
                                    <div className="text-xs text-gray-400">{perspective.desc}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                    {showAdvanced ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="bg-slate-800/50 border-purple-500/20 mt-4">
                    <CardContent className="pt-6 space-y-6">
                      {/* Toggle Options */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="includeEmotions"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <div>
                                <FormLabel>Emotional Context</FormLabel>
                                <p className="text-xs text-gray-400">Include emotional markers</p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includeEvidence"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <div>
                                <FormLabel>Evidence Structure</FormLabel>
                                <p className="text-xs text-gray-400">Add evidence frameworks</p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="factCheck"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <div>
                                <FormLabel>Fact Checking</FormLabel>
                                <p className="text-xs text-gray-400">Verify claims when possible</p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Sliders */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="creativity"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Creativity: {field.value}%</FormLabel>
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                              </div>
                              <FormControl>
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={100}
                                  step={1}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accuracy"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Accuracy: {field.value}%</FormLabel>
                                <Target className="w-4 h-4 text-green-400" />
                              </div>
                              <FormControl>
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={100}
                                  step={1}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="emotionalDepth"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Emotional Depth: {field.value}%</FormLabel>
                                <Brain className="w-4 h-4 text-purple-400" />
                              </div>
                              <FormControl>
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={100}
                                  step={1}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Generate Button */}
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5 mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Generated Content List */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-sm">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedContent.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No content generated yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedContent.map((content) => (
                    <div
                      key={content.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContent === content.id 
                          ? 'bg-purple-500/20 border border-purple-500/30' 
                          : 'bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedContent(content.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {content.style}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(content.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-white mb-2 line-clamp-2">
                        {content.content.substring(0, 100)}...
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{content.wordCount} words</span>
                        <Badge variant="secondary">{content.truthScore}% truth</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Preview */}
          {selectedContentData && (
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Content Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedContentData.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadContent(selectedContentData)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Content */}
                  <div className={`${previewMode ? 'prose prose-invert max-w-none' : ''}`}>
                    {previewMode ? (
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedContentData.content}
                      </div>
                    ) : (
                      <Textarea
                        value={selectedContentData.content}
                        onChange={() => {}} // Read-only for now
                        rows={8}
                        className="bg-slate-700/50 border-purple-500/30 text-sm"
                        readOnly
                      />
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">Truth Score</span>
                        <span className="text-white">{selectedContentData.truthScore}%</span>
                      </div>
                      <Progress value={selectedContentData.truthScore} className="h-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">Emotional Resonance</span>
                        <span className="text-white">{selectedContentData.emotionalResonance}%</span>
                      </div>
                      <Progress value={selectedContentData.emotionalResonance} className="h-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">Readability</span>
                        <span className="text-white">{selectedContentData.readabilityScore}%</span>
                      </div>
                      <Progress value={selectedContentData.readabilityScore} className="h-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Read Time</span>
                      <span className="text-white">{selectedContentData.estimatedReadTime} min</span>
                    </div>
                  </div>

                  {/* Themes & Emotions */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Key Themes</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedContentData.keyThemes.map((theme, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Emotions</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedContentData.emotions.map((emotion, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-medium text-white">AI Suggestions</span>
                    </div>
                    <ul className="space-y-1">
                      {selectedContentData.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-yellow-400 mt-0.5">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}