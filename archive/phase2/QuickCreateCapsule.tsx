import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Zap,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  Wand2,
  Brain,
  Target,
  Rocket,
  Star,
  Coins,
  Globe,
  Lock,
  Users,
  Heart,
  Eye,
  Calendar,
  Loader2,
  ArrowRight,
  BarChart3
} from 'lucide-react';

interface QuickCreateData {
  title: string;
  content: string;
  type: string;
  priority: 'normal' | 'high' | 'urgent';
  autoEnhance: boolean;
  quickPublish: boolean;
}

interface QuickTemplate {
  id: string;
  name: string;
  icon: any;
  color: string;
  placeholder: string;
  estimatedGTT: number;
}

const quickTemplates: QuickTemplate[] = [
  {
    id: 'truth',
    name: 'Truth Revelation',
    icon: Shield,
    color: 'text-cyan-400',
    placeholder: 'Share an important truth that needs to be revealed...',
    estimatedGTT: 45
  },
  {
    id: 'memory',
    name: 'Precious Memory',
    icon: Heart,
    color: 'text-pink-400',
    placeholder: 'Describe a meaningful moment you want to preserve...',
    estimatedGTT: 32
  },
  {
    id: 'prediction',
    name: 'Future Insight',
    icon: Eye,
    color: 'text-purple-400',
    placeholder: 'Make a prediction about future events...',
    estimatedGTT: 38
  },
  {
    id: 'testimony',
    name: 'Witness Account',
    icon: Users,
    color: 'text-green-400',
    placeholder: 'Provide testimony about what you witnessed...',
    estimatedGTT: 42
  }
];

interface QuickCreateCapsuleProps {
  onComplete: (capsuleData: any) => void;
  onCancel: () => void;
}

export default function QuickCreateCapsule({ onComplete, onCancel }: QuickCreateCapsuleProps) {
  const [formData, setFormData] = useState<QuickCreateData>({
    title: '',
    content: '',
    type: '',
    priority: 'normal',
    autoEnhance: true,
    quickPublish: true
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const steps = ['Template', 'Content', 'Review'];

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: QuickCreateData) => {
      return apiRequest('POST', '/api/capsules/quick-create', data);
    },
    onSuccess: (response) => {
      toast({
        title: "Capsule Created Instantly!",
        description: "Your truth has been sealed with AI enhancement.",
      });
      onComplete(response);
    },
    onError: (error: any) => {
      toast({
        title: "Quick Creation Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const enhanceContentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/ai/quick-enhance', { content, type: formData.type });
    },
    onSuccess: (enhanced) => {
      setFormData(prev => ({ ...prev, content: enhanced.content }));
      setAnalysisResults(enhanced.analysis);
    },
  });

  useEffect(() => {
    const calculateCompletion = () => {
      let score = 0;
      if (formData.title) score += 30;
      if (formData.content && formData.content.length > 20) score += 40;
      if (formData.type) score += 20;
      if (formData.content.length > 100) score += 10;
      setCompletionScore(Math.min(100, score));
    };
    
    calculateCompletion();
    
    if (formData.content && formData.content.length > 50 && formData.autoEnhance) {
      setIsAnalyzing(true);
      const debounceTimer = setTimeout(() => {
        enhanceContentMutation.mutate(formData.content);
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(debounceTimer);
    }
  }, [formData]);

  const handleInputChange = (field: keyof QuickCreateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectTemplate = (templateId: string) => {
    const template = quickTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      handleInputChange('type', templateId);
      setCurrentStep(1);
    }
  };

  const autoGenerateTitle = () => {
    if (formData.content) {
      const words = formData.content.split(' ').slice(0, 6).join(' ');
      const title = words.length > 30 ? words.substring(0, 30) + '...' : words;
      handleInputChange('title', title);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedTemplate !== null;
      case 1: return formData.content.length >= 20;
      case 2: return completionScore >= 60;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuickCreate = () => {
    if (!formData.title && formData.content) {
      autoGenerateTitle();
    }
    createCapsuleMutation.mutate(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Quick Template</h2>
              <p className="text-gray-400">Choose a template to get started instantly</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        selectedTemplate === template.id 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => selectTemplate(template.id)}
                      data-testid={`quick-template-${template.id}`}
                    >
                      <CardContent className="p-6 text-center">
                        <IconComponent className={`w-8 h-8 mx-auto ${template.color} mb-3`} />
                        <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                        <Badge className="bg-yellow-600 text-xs">
                          ~{template.estimatedGTT} GTT
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 1:
        const selectedTemplateData = quickTemplates.find(t => t.id === selectedTemplate);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Quick Content</h2>
              <p className="text-gray-400">Write your content - AI will enhance it automatically</p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title (or leave blank for auto-generation)"
                  className="text-lg font-medium"
                  data-testid="quick-title-input"
                />
              </div>

              <div>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={selectedTemplateData?.placeholder || 'Write your content here...'}
                  className="min-h-[200px] resize-none"
                  data-testid="quick-content-textarea"
                />
                
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-400">{formData.content.length} characters</span>
                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-purple-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      AI enhancing...
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <span className="text-white text-sm">Auto-Enhance</span>
                  <input
                    type="checkbox"
                    checked={formData.autoEnhance}
                    onChange={(e) => handleInputChange('autoEnhance', e.target.checked)}
                    className="w-4 h-4 text-green-500"
                    data-testid="auto-enhance-checkbox"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <span className="text-white text-sm">Quick Publish</span>
                  <input
                    type="checkbox"
                    checked={formData.quickPublish}
                    onChange={(e) => handleInputChange('quickPublish', e.target.checked)}
                    className="w-4 h-4 text-green-500"
                    data-testid="quick-publish-checkbox"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Rocket className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch</h2>
              <p className="text-gray-400">Review and create your capsule instantly</p>
            </div>

            <Card className="bg-gray-800/50 border-gray-600">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Completion Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={completionScore} className="w-24" />
                    <span className="text-green-300 font-mono">{completionScore}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Preview:</div>
                  <div className="p-3 bg-gray-700 rounded">
                    <h3 className="text-white font-medium">
                      {formData.title || 'Auto-generated title'}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {formData.content.substring(0, 100)}
                      {formData.content.length > 100 && '...'}
                    </p>
                  </div>
                </div>

                {analysisResults && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-cyan-300">
                        {analysisResults.impactScore || 85}%
                      </div>
                      <div className="text-xs text-gray-400">Impact</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-300">
                        {analysisResults.truthScore || 92}%
                      </div>
                      <div className="text-xs text-gray-400">Truth</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-300">
                        {analysisResults.estimatedGTT || 35}
                      </div>
                      <div className="text-xs text-gray-400">Est. GTT</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={handleQuickCreate}
                disabled={createCapsuleMutation.isPending || completionScore < 60}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-lg"
                data-testid="quick-create-button"
              >
                {createCapsuleMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Create Instantly
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quick Create</h1>
        <p className="text-gray-400">Fast capsule creation with AI enhancement</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                index === currentStep
                  ? 'bg-green-500/20 text-green-300'
                  : index < currentStep
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
      </div>

      {/* Content */}
      <Card className="bg-black/50 backdrop-blur-lg border-gray-600">
        <CardContent className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
            data-testid="quick-previous-button"
          >
            Previous
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            data-testid="quick-cancel-button"
          >
            Cancel
          </Button>
        </div>

        {currentStep < steps.length - 1 && (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            data-testid="quick-next-button"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}