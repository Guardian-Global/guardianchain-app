import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Brain,
  Zap,
  TrendingUp,
  Target,
  Eye,
  Heart,
  Shield,
  Star,
  Flame,
  BarChart3,
  Sparkles,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Gauge,
  Award,
  Clock,
  Users,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Copy,
  Share2,
  Loader2
} from 'lucide-react';

interface EnhancementSuggestion {
  id: string;
  type: 'content' | 'structure' | 'emotional' | 'technical' | 'seo';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  gttBoost: number;
  implementation: string;
  examples?: string[];
  beforeAfter?: {
    before: string;
    after: string;
  };
}

interface AnalysisResults {
  overallScore: number;
  gttPotential: number;
  truthScore: number;
  emotionalResonance: number;
  virality: number;
  readability: number;
  engagement: number;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    suggestions: number;
  }[];
  suggestions: EnhancementSuggestion[];
  strengths: string[];
  weaknesses: string[];
  competitorAnalysis?: {
    similarCapsules: number;
    averagePerformance: number;
    rankingPotential: number;
  };
  aiRecommendations: {
    quickWins: string[];
    longTermImprovements: string[];
    contentStrategy: string[];
  };
}

interface CapsuleEnhancementAnalyzerProps {
  content: string;
  onEnhancementApplied: (enhancedContent: string) => void;
  onAnalysisComplete?: (results: AnalysisResults) => void;
  autoAnalyze?: boolean;
}

export default function CapsuleEnhancementAnalyzer({
  content,
  onEnhancementApplied,
  onAnalysisComplete,
  autoAnalyze = true
}: CapsuleEnhancementAnalyzerProps) {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [enhancedContent, setEnhancedContent] = useState('');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'preview'>('overview');

  const { toast } = useToast();

  useEffect(() => {
    if (autoAnalyze && content.trim().length > 50) {
      analyzeContent();
    }
  }, [content, autoAnalyze]);

  const analyzeMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/ai/analyze-capsule', { content });
    },
    onSuccess: async (response) => {
      const results = await response.json();
      setAnalysisResults(results);
      onAnalysisComplete?.(results);
      toast({
        title: "Analysis Complete",
        description: `Found ${results.suggestions.length} improvement opportunities`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const enhanceMutation = useMutation({
    mutationFn: async (data: { content: string; suggestionIds: string[] }) => {
      return apiRequest('POST', '/api/ai/enhance-capsule', data);
    },
    onSuccess: async (response) => {
      const { enhancedContent } = await response.json();
      setEnhancedContent(enhancedContent);
      onEnhancementApplied(enhancedContent);
      toast({
        title: "Enhancement Applied",
        description: "Your capsule has been improved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Enhancement Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const analyzeContent = () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please add content to analyze",
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzing(true);
    analyzeMutation.mutate(content);
  };

  const applyEnhancements = () => {
    if (selectedSuggestions.size === 0) {
      toast({
        title: "No Suggestions Selected",
        description: "Please select suggestions to apply",
        variant: "destructive",
      });
      return;
    }
    enhanceMutation.mutate({
      content,
      suggestionIds: Array.from(selectedSuggestions)
    });
  };

  const toggleSuggestion = (suggestionId: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  const selectAllSuggestions = () => {
    if (!analysisResults) return;
    setSelectedSuggestions(new Set(analysisResults.suggestions.map(s => s.id)));
  };

  const clearAllSuggestions = () => {
    setSelectedSuggestions(new Set());
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return Brain;
      case 'structure': return Target;
      case 'emotional': return Heart;
      case 'technical': return Zap;
      case 'seo': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const calculateTotalGTTBoost = () => {
    if (!analysisResults) return 0;
    return analysisResults.suggestions
      .filter(s => selectedSuggestions.has(s.id))
      .reduce((total, s) => total + s.gttBoost, 0);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Enhancement Analyzer
          </div>
          <div className="flex items-center gap-2">
            {analysisResults && (
              <Badge className="bg-purple-600">
                {analysisResults.suggestions.length} Suggestions
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeContent}
              disabled={analyzeMutation.isPending}
              data-testid="analyze-content"
            >
              {analyzeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {analyzeMutation.isPending && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
              <Brain className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analyzing Your Capsule</h3>
            <p className="text-gray-400">AI is evaluating content quality, engagement potential, and improvement opportunities...</p>
          </div>
        )}

        {analysisResults && (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-gray-700">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
                { id: 'preview', label: 'Preview', icon: Eye },
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id as any)}
                    className="border-b-2 border-transparent data-[state=active]:border-cyan-500"
                    data-testid={`tab-${tab.id}`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Overall Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Overall Score', value: analysisResults.overallScore, icon: Award },
                      { label: 'GTT Potential', value: analysisResults.gttPotential, icon: Star },
                      { label: 'Truth Score', value: analysisResults.truthScore, icon: Shield },
                      { label: 'Engagement', value: analysisResults.engagement, icon: Heart },
                    ].map((metric, index) => {
                      const IconComponent = metric.icon;
                      return (
                        <Card key={index} className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4 text-center">
                            <IconComponent className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(metric.value)}`} />
                            <div className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                              {metric.value}
                            </div>
                            <div className="text-xs text-gray-400">{metric.label}</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Category Analysis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Category Analysis</h3>
                    {analysisResults.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${getScoreColor((category.score / category.maxScore) * 100)}`}>
                              {category.score}/{category.maxScore}
                            </span>
                            {category.suggestions > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {category.suggestions} suggestions
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress
                          value={(category.score / category.maxScore) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                        Strengths
                      </h3>
                      <div className="space-y-2">
                        {analysisResults.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                        Areas for Improvement
                      </h3>
                      <div className="space-y-2">
                        {analysisResults.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-orange-300">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            {weakness}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'suggestions' && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Action Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllSuggestions}
                        data-testid="select-all"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllSuggestions}
                        data-testid="clear-all"
                      >
                        Clear All
                      </Button>
                      <span className="text-sm text-gray-400">
                        {selectedSuggestions.size} of {analysisResults.suggestions.length} selected
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedSuggestions.size > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">+{calculateTotalGTTBoost()} GTT</span>
                        </div>
                      )}
                      <Button
                        onClick={applyEnhancements}
                        disabled={selectedSuggestions.size === 0 || enhanceMutation.isPending}
                        data-testid="apply-enhancements"
                      >
                        {enhanceMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Apply Selected
                      </Button>
                    </div>
                  </div>

                  {/* Suggestions List */}
                  <div className="space-y-4">
                    {analysisResults.suggestions.map(suggestion => {
                      const TypeIcon = getTypeIcon(suggestion.type);
                      const isSelected = selectedSuggestions.has(suggestion.id);
                      
                      return (
                        <Card
                          key={suggestion.id}
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-cyan-500 bg-cyan-500/10' 
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                          onClick={() => toggleSuggestion(suggestion.id)}
                          data-testid={`suggestion-${suggestion.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-lg ${getSeverityColor(suggestion.severity)} flex items-center justify-center`}>
                                  <TypeIcon className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-white font-semibold">{suggestion.title}</h4>
                                    <p className="text-gray-400 text-sm">{suggestion.description}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-600 text-xs">
                                      +{suggestion.gttBoost} GTT
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {suggestion.severity}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-green-300">
                                  <strong>Impact:</strong> {suggestion.impact}
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDetails(showDetails === suggestion.id ? null : suggestion.id);
                                  }}
                                  data-testid={`details-${suggestion.id}`}
                                >
                                  {showDetails === suggestion.id ? 'Hide Details' : 'Show Details'}
                                </Button>
                                
                                <AnimatePresence>
                                  {showDetails === suggestion.id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="space-y-3 pt-3 border-t border-gray-600"
                                    >
                                      <div>
                                        <h5 className="text-sm font-medium text-white mb-1">Implementation:</h5>
                                        <p className="text-sm text-gray-300">{suggestion.implementation}</p>
                                      </div>
                                      
                                      {suggestion.examples && (
                                        <div>
                                          <h5 className="text-sm font-medium text-white mb-1">Examples:</h5>
                                          <div className="space-y-1">
                                            {suggestion.examples.map((example, idx) => (
                                              <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                                <Lightbulb className="w-3 h-3 text-yellow-400" />
                                                {example}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {suggestion.beforeAfter && (
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <h5 className="text-sm font-medium text-red-400 mb-1">Before:</h5>
                                            <div className="text-xs text-gray-400 bg-red-500/10 p-2 rounded">
                                              {suggestion.beforeAfter.before}
                                            </div>
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium text-green-400 mb-1">After:</h5>
                                            <div className="text-xs text-gray-400 bg-green-500/10 p-2 rounded">
                                              {suggestion.beforeAfter.after}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {enhancedContent ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Enhanced Content</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(enhancedContent)}
                            data-testid="copy-enhanced"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEnhancementApplied(enhancedContent)}
                            data-testid="use-enhanced"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Use This
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Original</h4>
                          <Textarea
                            value={content}
                            readOnly
                            className="h-64 bg-gray-700/30 border-gray-600"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Enhanced</h4>
                          <Textarea
                            value={enhancedContent}
                            readOnly
                            className="h-64 bg-green-500/10 border-green-500/30"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Preview Available</h3>
                      <p className="text-gray-400">Select suggestions and apply enhancements to see the preview</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!analysisResults && !analyzeMutation.isPending && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Analyze</h3>
            <p className="text-gray-400 mb-4">Click analyze to get AI-powered improvement suggestions</p>
            <Button onClick={analyzeContent} data-testid="start-analysis">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}