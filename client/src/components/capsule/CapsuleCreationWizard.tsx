import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Sparkles,
  Shield,
  Users,
  Calendar,
  Lock,
  Eye,
  Brain,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Star,
  Flame,
  Heart,
  Globe,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Wand2,
  Settings,
  Play,
  Pause,
  ShieldCheck
} from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  isCompleted: boolean;
  isActive: boolean;
  validationRules: string[];
  helpText: string;
}

interface CapsuleInsight {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  action?: string;
  icon: any;
}

interface CreationMetrics {
  completionScore: number;
  estimatedImpact: number;
  viralPotential: number;
  truthScore: number;
  expectedGTT: number;
  processingTime: number;
}

interface CapsuleCreationWizardProps {
  onComplete: (capsuleData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function CapsuleCreationWizard({ 
  onComplete, 
  onCancel, 
  initialData = {} 
}: CapsuleCreationWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capsuleData, setCapsuleData] = useState(initialData);
  const [insights, setInsights] = useState<CapsuleInsight[]>([]);
  const [metrics, setMetrics] = useState<CreationMetrics>({
    completionScore: 0,
    estimatedImpact: 0,
    viralPotential: 0,
    truthScore: 0,
    expectedGTT: 0,
    processingTime: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const wizardSteps: WizardStep[] = [
    {
      id: 'intent',
      title: 'Define Intent',
      description: 'What is the purpose of your truth capsule?',
      icon: Target,
      isCompleted: Boolean(capsuleData.intent),
      isActive: currentStepIndex === 0,
      validationRules: ['Intent must be clearly defined', 'Purpose should be meaningful'],
      helpText: 'Your intent shapes everything about your capsule. Be specific about what you want to achieve.'
    },
    {
      id: 'content',
      title: 'Create Content',
      description: 'Craft your truth with powerful storytelling',
      icon: Brain,
      isCompleted: Boolean(capsuleData.content && capsuleData.content.length > 50),
      isActive: currentStepIndex === 1,
      validationRules: ['Content must be at least 50 characters', 'Should tell a compelling story'],
      helpText: 'Great capsules combine truth with emotional resonance. Write from your heart.'
    },
    {
      id: 'enhance',
      title: 'AI Enhancement',
      description: 'Optimize your message for maximum impact',
      icon: Wand2,
      isCompleted: Boolean(capsuleData.aiEnhanced),
      isActive: currentStepIndex === 2,
      validationRules: ['Consider AI suggestions', 'Review enhanced content'],
      helpText: 'AI can help amplify your voice while preserving your authentic message.'
    },
    {
      id: 'verify',
      title: 'Truth Verification',
      description: 'Add credibility and authenticity markers',
      icon: ShieldCheck,
      isCompleted: Boolean(capsuleData.verificationLevel),
      isActive: currentStepIndex === 3,
      validationRules: ['Choose appropriate verification level', 'Add supporting evidence if needed'],
      helpText: 'Higher verification increases trust and potential rewards.'
    },
    {
      id: 'settings',
      title: 'Configure Settings',
      description: 'Set privacy, timing, and blockchain options',
      icon: Settings,
      isCompleted: Boolean(capsuleData.configured),
      isActive: currentStepIndex === 4,
      validationRules: ['Set appropriate privacy level', 'Configure timing options'],
      helpText: 'These settings determine how and when your capsule will be revealed.'
    },
    {
      id: 'launch',
      title: 'Launch Capsule',
      description: 'Review and seal your truth forever',
      icon: Sparkles,
      isCompleted: false,
      isActive: currentStepIndex === 5,
      validationRules: ['All previous steps completed', 'Final review passed'],
      helpText: 'Once launched, your capsule becomes immutable. Make sure everything is perfect.'
    }
  ];

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/capsules/wizard', data);
    },
    onSuccess: (response) => {
      toast({
        title: "Capsule Created Successfully!",
        description: "Your truth has been sealed and is now part of the eternal record.",
      });
      onComplete(response);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeCapsuleMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/ai/analyze-capsule', { content, metadata: capsuleData });
    },
    onSuccess: (analysis) => {
      setMetrics({
        completionScore: analysis.completionScore || 0,
        estimatedImpact: analysis.estimatedImpact || 0,
        viralPotential: analysis.viralPotential || 0,
        truthScore: analysis.truthScore || 0,
        expectedGTT: analysis.expectedGTT || 0,
        processingTime: analysis.processingTime || 0
      });
      
      setInsights(analysis.insights || []);
    },
  });

  const updateCapsuleData = useCallback((field: string, value: any) => {
    setCapsuleData((prev: any) => ({ ...prev, [field]: value }));
    
    // Trigger analysis if content changes
    if (field === 'content' && value.length > 20) {
      setIsAnalyzing(true);
      setTimeout(() => {
        analyzeCapsuleMutation.mutate(value);
        setIsAnalyzing(false);
      }, 1000);
    }
  }, [analyzeCapsuleMutation]);

  const canAdvanceToStep = (stepIndex: number) => {
    const step = wizardSteps[stepIndex];
    return step.isCompleted;
  };

  const nextStep = () => {
    if (currentStepIndex < wizardSteps.length - 1 && canAdvanceToStep(currentStepIndex)) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStepIndex(0);
    setCapsuleData({});
    setInsights([]);
    setMetrics({
      completionScore: 0,
      estimatedImpact: 0,
      viralPotential: 0,
      truthScore: 0,
      expectedGTT: 0,
      processingTime: 0
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'error': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
  };

  const renderStepContent = () => {
    const currentStep = wizardSteps[currentStepIndex];
    
    switch (currentStep.id) {
      case 'intent':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Define Your Intent</h2>
              <p className="text-gray-400">What truth do you want to preserve for eternity?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'expose', label: 'Expose Truth', icon: Shield, desc: 'Reveal hidden facts' },
                { id: 'preserve', label: 'Preserve Memory', icon: Heart, desc: 'Keep memories alive' },
                { id: 'testify', label: 'Legal Testimony', icon: Users, desc: 'Provide witness account' },
                { id: 'prophesy', label: 'Future Prediction', icon: Eye, desc: 'Make forecasts' },
                { id: 'create', label: 'Creative Work', icon: Sparkles, desc: 'Share original content' },
                { id: 'legacy', label: 'Leave Legacy', icon: Star, desc: 'Message for future' }
              ].map((intent) => {
                const IconComponent = intent.icon;
                return (
                  <motion.div
                    key={intent.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        capsuleData.intent === intent.id 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => updateCapsuleData('intent', intent.id)}
                      data-testid={`intent-${intent.id}`}
                    >
                      <CardContent className="p-6 text-center">
                        <IconComponent className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                        <h3 className="font-semibold text-white mb-1">{intent.label}</h3>
                        <p className="text-sm text-gray-400">{intent.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Craft Your Truth</h2>
              <p className="text-gray-400">Write with authenticity and emotional resonance</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={capsuleData.content || ''}
                onChange={(e) => updateCapsuleData('content', e.target.value)}
                placeholder="Share your truth here... What happened? When? Why does it matter? How did it impact you or others?"
                className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                data-testid="content-textarea"
              />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {capsuleData.content?.length || 0} characters
                </span>
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    Analyzing content...
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Wand2 className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">AI Enhancement</h2>
              <p className="text-gray-400">Optimize your message for maximum impact</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Content Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-700 rounded">
                      <div className="text-lg font-bold text-cyan-300">{metrics.truthScore}%</div>
                      <div className="text-xs text-gray-400">Truth Score</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded">
                      <div className="text-lg font-bold text-purple-300">{metrics.estimatedImpact}%</div>
                      <div className="text-xs text-gray-400">Impact Level</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded">
                      <div className="text-lg font-bold text-green-300">{metrics.viralPotential}%</div>
                      <div className="text-xs text-gray-400">Viral Potential</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded">
                      <div className="text-lg font-bold text-yellow-300">{metrics.expectedGTT}</div>
                      <div className="text-xs text-gray-400">Expected GTT</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Enhancement Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => updateCapsuleData('aiEnhanced', true)}
                    disabled={!capsuleData.content}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    data-testid="enhance-button"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Enhance with AI
                  </Button>
                  
                  <div className="text-sm text-gray-400">
                    AI will improve clarity, emotional impact, and engagement while preserving your authentic voice.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'verify':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Truth Verification</h2>
              <p className="text-gray-400">Add credibility to your capsule</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  id: 'basic', 
                  label: 'Basic Verification', 
                  desc: 'Standard blockchain seal',
                  gtt: '+10 GTT',
                  icon: CheckCircle 
                },
                { 
                  id: 'enhanced', 
                  label: 'Enhanced Verification', 
                  desc: 'AI fact-checking + blockchain',
                  gtt: '+25 GTT',
                  icon: Award 
                },
                { 
                  id: 'premium', 
                  label: 'Premium Verification', 
                  desc: 'Multi-source verification + legal seal',
                  gtt: '+50 GTT',
                  icon: Star 
                }
              ].map((level) => {
                const IconComponent = level.icon;
                return (
                  <Card 
                    key={level.id}
                    className={`cursor-pointer transition-all ${
                      capsuleData.verificationLevel === level.id 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => updateCapsuleData('verificationLevel', level.id)}
                    data-testid={`verification-${level.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <IconComponent className="w-8 h-8 mx-auto text-green-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">{level.label}</h3>
                      <p className="text-sm text-gray-400 mb-2">{level.desc}</p>
                      <Badge className="bg-green-600">{level.gtt}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Configure Settings</h2>
              <p className="text-gray-400">Set privacy, timing, and advanced options</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 'public', label: 'Public', desc: 'Visible to everyone', icon: Globe },
                    { id: 'friends', label: 'Friends Only', desc: 'Your network only', icon: Users },
                    { id: 'private', label: 'Private', desc: 'Only you', icon: Lock }
                  ].map((privacy) => {
                    const IconComponent = privacy.icon;
                    return (
                      <div
                        key={privacy.id}
                        className={`p-3 border rounded cursor-pointer transition-all ${
                          capsuleData.privacy === privacy.id 
                            ? 'border-cyan-500 bg-cyan-500/10' 
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        onClick={() => updateCapsuleData('privacy', privacy.id)}
                        data-testid={`privacy-${privacy.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-cyan-400" />
                          <div>
                            <div className="text-white font-medium">{privacy.label}</div>
                            <div className="text-sm text-gray-400">{privacy.desc}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Advanced Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={capsuleData.enableNFT || false}
                        onChange={(e) => updateCapsuleData('enableNFT', e.target.checked)}
                        className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
                        data-testid="checkbox-nft"
                      />
                      <div>
                        <div className="text-white">Enable NFT Minting</div>
                        <div className="text-sm text-gray-400">Create collectible NFT</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={capsuleData.timeLock || false}
                        onChange={(e) => updateCapsuleData('timeLock', e.target.checked)}
                        className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
                        data-testid="checkbox-timelock"
                      />
                      <div>
                        <div className="text-white">Time Lock</div>
                        <div className="text-sm text-gray-400">Delay revelation</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={capsuleData.allowComments || false}
                        onChange={(e) => updateCapsuleData('allowComments', e.target.checked)}
                        className="w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500"
                        data-testid="checkbox-comments"
                      />
                      <div>
                        <div className="text-white">Allow Comments</div>
                        <div className="text-sm text-gray-400">Enable community discussion</div>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => updateCapsuleData('configured', true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500"
              data-testid="configure-button"
            >
              <Settings className="w-4 h-4 mr-2" />
              Apply Configuration
            </Button>
          </div>
        );

      case 'launch':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch</h2>
              <p className="text-gray-400">Your truth capsule is ready for eternity</p>
            </div>

            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-300">{metrics.completionScore}%</div>
                    <div className="text-sm text-gray-400">Completion</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-300">{metrics.expectedGTT}</div>
                    <div className="text-sm text-gray-400">Expected GTT</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-300">{metrics.truthScore}%</div>
                    <div className="text-sm text-gray-400">Truth Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={() => createCapsuleMutation.mutate(capsuleData)}
                disabled={createCapsuleMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg"
                data-testid="launch-button"
              >
                {createCapsuleMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sealing Truth...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Launch Capsule
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Truth Capsule Creation Wizard</h1>
        <p className="text-gray-400">Guided experience for creating impactful truth capsules</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Step {currentStepIndex + 1} of {wizardSteps.length}</span>
          <span className="text-sm text-gray-400">{Math.round((currentStepIndex / (wizardSteps.length - 1)) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStepIndex / (wizardSteps.length - 1)) * 100} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        <div className="flex items-center gap-4 pb-2">
          {wizardSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                  index === currentStepIndex
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : step.isCompleted
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{step.title}</span>
                {step.isCompleted && <CheckCircle className="w-4 h-4" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-3">
          <Card className="bg-black/50 backdrop-blur-lg border-gray-600">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Insights */}
          {insights.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white text-sm">AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.slice(0, 3).map((insight, index) => {
                  const IconComponent = getInsightIcon(insight.type);
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded border ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        <IconComponent className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{insight.title}</div>
                          <div className="text-xs opacity-80">{insight.message}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Help */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Step Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">{wizardSteps[currentStepIndex].helpText}</p>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm">Live Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completion</span>
                <span className="text-cyan-300">{metrics.completionScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Truth Score</span>
                <span className="text-green-300">{metrics.truthScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Expected GTT</span>
                <span className="text-yellow-300">{metrics.expectedGTT}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            disabled={currentStepIndex === 0}
            data-testid="previous-button"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={resetWizard}
            data-testid="reset-button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          {currentStepIndex < wizardSteps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canAdvanceToStep(currentStepIndex)}
              data-testid="next-button"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => createCapsuleMutation.mutate(capsuleData)}
              disabled={createCapsuleMutation.isPending || !wizardSteps[currentStepIndex].isCompleted}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              data-testid="complete-button"
            >
              {createCapsuleMutation.isPending ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Complete Creation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}