import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Shield,
  Sparkles,
  Users,
  Lock,
  Calendar,
  Eye,
  Brain,
  Zap,
  FileText,
  Image,
  Video,
  Mic,
  Plus,
  X,
  Upload,
  Save,
  Wand2,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Heart,
  Star,
  Flame,
  Lightbulb,
  MessageSquare,
  Share2,
  Download,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Loader2,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Palette,
  Settings,
  Layers,
  Filter,
  BarChart3,
  Fingerprint,
  ShieldCheck,
  Coins,
  Timer,
  Infinity
} from 'lucide-react';

interface CapsuleFormData {
  title: string;
  content: string;
  type: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'private' | 'friends';
  allowComments: boolean;
  enableNFT: boolean;
  griefScore?: number;
  timeLock?: number;
  yieldEstimate?: number;
  priority: 'normal' | 'high' | 'urgent';
  attachments: File[];
  voiceNote?: Blob;
  aiEnhanced: boolean;
  blockchainSealed: boolean;
}

interface CapsuleTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  fields: string[];
  example: string;
}

const capsuleTemplates: CapsuleTemplate[] = [
  {
    id: 'memory',
    name: 'Personal Memory',
    description: 'Preserve a cherished memory for future generations',
    icon: Heart,
    color: 'text-pink-400',
    fields: ['title', 'content', 'date', 'location'],
    example: 'A meaningful moment with family, friends, or a life-changing experience'
  },
  {
    id: 'truth',
    name: 'Truth Disclosure',
    description: 'Reveal important truth that needs to be preserved',
    icon: Shield,
    color: 'text-cyan-400',
    fields: ['title', 'content', 'evidence', 'verification'],
    example: 'Whistleblowing, exposing corruption, or revealing hidden facts'
  },
  {
    id: 'legacy',
    name: 'Legacy Message',
    description: 'Leave a message for future generations',
    icon: Star,
    color: 'text-yellow-400',
    fields: ['title', 'content', 'recipients', 'timeline'],
    example: 'Wisdom, life lessons, or important family history'
  },
  {
    id: 'testimony',
    name: 'Legal Testimony',
    description: 'Provide sworn testimony with legal protection',
    icon: Users,
    color: 'text-green-400',
    fields: ['title', 'content', 'witnesses', 'evidence'],
    example: 'Legal statements, witness accounts, or sworn declarations'
  },
  {
    id: 'prophecy',
    name: 'Future Prediction',
    description: 'Make predictions about future events',
    icon: Eye,
    color: 'text-purple-400',
    fields: ['title', 'content', 'timeline', 'conditions'],
    example: 'Economic forecasts, social predictions, or technological advances'
  },
  {
    id: 'creative',
    name: 'Creative Work',
    description: 'Preserve original creative content',
    icon: Palette,
    color: 'text-orange-400',
    fields: ['title', 'content', 'medium', 'inspiration'],
    example: 'Poetry, stories, artwork descriptions, or creative ideas'
  }
];

const capsuleTypes = [
  { value: 'truth', label: 'Truth', icon: Shield, color: 'text-cyan-400' },
  { value: 'memory', label: 'Memory', icon: Sparkles, color: 'text-purple-400' },
  { value: 'testimony', label: 'Testimony', icon: Users, color: 'text-green-400' },
  { value: 'evidence', label: 'Evidence', icon: Lock, color: 'text-red-400' },
  { value: 'legacy', label: 'Legacy', icon: Calendar, color: 'text-yellow-400' },
  { value: 'witness', label: 'Witness', icon: Eye, color: 'text-orange-400' }
];

const priorityLevels = [
  { value: 'normal', label: 'Normal', color: 'bg-gray-500' },
  { value: 'high', label: 'High', color: 'bg-yellow-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
];

export default function EnhancedCapsuleCreator() {
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: '',
    content: '',
    type: '',
    category: '',
    tags: [],
    visibility: 'public',
    allowComments: true,
    enableNFT: false,
    priority: 'normal',
    attachments: [],
    aiEnhanced: false,
    blockchainSealed: false
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [aiAssistance, setAiAssistance] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [estimatedRewards, setEstimatedRewards] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceRecorder, setVoiceRecorder] = useState<MediaRecorder | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number>();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CapsuleFormData) => {
      return apiRequest('POST', '/api/capsules/enhanced', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
      toast({
        title: "Capsule Created Successfully",
        description: "Your enhanced truth capsule has been sealed and stored securely.",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create capsule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeContentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/ai/analyze-content', { content });
    },
    onSuccess: (results) => {
      setAnalysisResults(results);
      setEstimatedRewards(results.estimatedGTT || 0);
    },
  });

  const enhanceContentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/ai/enhance-content', { content, type: formData.type });
    },
    onSuccess: (enhanced) => {
      setFormData(prev => ({ ...prev, content: enhanced.content }));
      toast({
        title: "Content Enhanced",
        description: "AI has improved your capsule content for better impact.",
      });
    },
  });

  const steps = [
    { id: 'template', title: 'Choose Template', icon: Layers },
    { id: 'basic', title: 'Basic Info', icon: FileText },
    { id: 'content', title: 'Content', icon: Brain },
    { id: 'media', title: 'Media & Voice', icon: Image },
    { id: 'settings', title: 'Advanced Settings', icon: Settings },
    { id: 'review', title: 'Review & Create', icon: CheckCircle }
  ];

  useEffect(() => {
    if (formData.content && formData.content.length > 100) {
      setIsAnalyzing(true);
      const debounceTimer = setTimeout(() => {
        analyzeContentMutation.mutate(formData.content);
        setIsAnalyzing(false);
      }, 1000);
      return () => clearTimeout(debounceTimer);
    }
  }, [formData.content]);

  useEffect(() => {
    if (isRecording && intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const handleInputChange = (field: keyof CapsuleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setFormData(prev => ({ ...prev, voiceNote: blob }));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setVoiceRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorder) {
      voiceRecorder.stop();
      setVoiceRecorder(null);
      setIsRecording(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      handleInputChange('attachments', [...formData.attachments, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    handleInputChange('attachments', newAttachments);
  };

  const applyTemplate = (templateId: string) => {
    const template = capsuleTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      handleInputChange('type', templateId);
      setCurrentStep(1);
    }
  };

  const enhanceWithAI = () => {
    if (formData.content) {
      enhanceContentMutation.mutate(formData.content);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: '',
      category: '',
      tags: [],
      visibility: 'public',
      allowComments: true,
      enableNFT: false,
      priority: 'normal',
      attachments: [],
      aiEnhanced: false,
      blockchainSealed: false
    });
    setCurrentStep(0);
    setSelectedTemplate(null);
    setAnalysisResults(null);
    setEstimatedRewards(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCompletionScore = () => {
    let score = 0;
    if (formData.title) score += 15;
    if (formData.content && formData.content.length > 50) score += 25;
    if (formData.type) score += 15;
    if (formData.tags.length > 0) score += 15;
    if (formData.attachments.length > 0) score += 10;
    if (formData.voiceNote) score += 10;
    if (formData.aiEnhanced) score += 10;
    return Math.min(100, score);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: return selectedTemplate !== null;
      case 1: return formData.title && formData.type;
      case 2: return formData.content && formData.content.length > 20;
      case 3: return true; // Media is optional
      case 4: return true; // Settings are optional
      case 5: return calculateCompletionScore() >= 70;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Capsule Template</h2>
              <p className="text-gray-400">Select a template that best fits your content type</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capsuleTemplates.map((template) => {
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
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => applyTemplate(template.id)}
                      data-testid={`template-${template.id}`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <IconComponent className={`w-12 h-12 mx-auto ${template.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{template.description}</p>
                        <div className="text-xs text-gray-500">{template.example}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Capsule Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter a compelling title..."
                    className="mt-2"
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-white">Capsule Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="mt-2" data-testid="select-type">
                      <SelectValue placeholder="Select capsule type" />
                    </SelectTrigger>
                    <SelectContent>
                      {capsuleTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className={`w-4 h-4 ${type.color}`} />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Personal, Legal, Business..."
                    className="mt-2"
                    data-testid="input-category"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tags..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      data-testid="input-tag"
                    />
                    <Button type="button" onClick={addTag} size="sm" data-testid="button-add-tag">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700">
                        {tag}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                          data-testid={`remove-tag-${index}`}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                    <SelectTrigger className="mt-2" data-testid="select-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-white text-lg">Capsule Content *</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAiAssistance(!aiAssistance)}
                  className={aiAssistance ? 'border-purple-500 text-purple-300' : ''}
                  data-testid="button-ai-assistance"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assist
                </Button>
                {formData.content && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={enhanceWithAI}
                    disabled={enhanceContentMutation.isPending}
                    data-testid="button-enhance-ai"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Enhance
                  </Button>
                )}
              </div>
            </div>

            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your truth, memory, or important message..."
              className="min-h-[300px] resize-none"
              data-testid="textarea-content"
            />

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{formData.content.length} characters</span>
              {isAnalyzing && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing content...
                </div>
              )}
            </div>

            {analysisResults && (
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-300">{analysisResults.emotionalImpact || 85}%</div>
                      <div className="text-xs text-gray-400">Emotional Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-300">{analysisResults.truthScore || 92}%</div>
                      <div className="text-xs text-gray-400">Truth Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-300">{analysisResults.uniqueness || 78}%</div>
                      <div className="text-xs text-gray-400">Uniqueness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-300">{estimatedRewards}</div>
                      <div className="text-xs text-gray-400">Est. GTT</div>
                    </div>
                  </div>
                  
                  {analysisResults.suggestions && (
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">AI Suggestions:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {analysisResults.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Attachments */}
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    File Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    data-testid="button-upload-files"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Files
                  </Button>

                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-white">Attached Files:</Label>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            data-testid={`remove-attachment-${index}`}
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Voice Recording */}
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mic className="w-5 h-5 mr-2" />
                    Voice Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    {!isRecording ? (
                      <Button
                        type="button"
                        onClick={startVoiceRecording}
                        className="bg-red-600 hover:bg-red-700"
                        data-testid="button-start-recording"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 font-mono">{formatDuration(recordingDuration)}</span>
                        </div>
                        <Button
                          type="button"
                          onClick={stopVoiceRecording}
                          variant="outline"
                          data-testid="button-stop-recording"
                        >
                          <PauseCircle className="w-4 h-4 mr-2" />
                          Stop Recording
                        </Button>
                      </div>
                    )}
                  </div>

                  {formData.voiceNote && (
                    <div className="p-3 bg-gray-700 rounded text-center">
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Voice note recorded
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Privacy & Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Visibility</Label>
                    <Select 
                      value={formData.visibility} 
                      onValueChange={(value: any) => handleInputChange('visibility', value)}
                    >
                      <SelectTrigger className="mt-2" data-testid="select-visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="friends">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Friends Only
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Allow Comments</Label>
                    <Switch
                      checked={formData.allowComments}
                      onCheckedChange={(checked) => handleInputChange('allowComments', checked)}
                      data-testid="switch-comments"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Blockchain Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Enable NFT Minting</Label>
                      <p className="text-xs text-gray-400">Create an NFT from this capsule</p>
                    </div>
                    <Switch
                      checked={formData.enableNFT}
                      onCheckedChange={(checked) => handleInputChange('enableNFT', checked)}
                      data-testid="switch-nft"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Blockchain Seal</Label>
                      <p className="text-xs text-gray-400">Immutable blockchain verification</p>
                    </div>
                    <Switch
                      checked={formData.blockchainSealed}
                      onCheckedChange={(checked) => handleInputChange('blockchainSealed', checked)}
                      data-testid="switch-blockchain"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">AI Enhancement</Label>
                      <p className="text-xs text-gray-400">AI-powered content optimization</p>
                    </div>
                    <Switch
                      checked={formData.aiEnhanced}
                      onCheckedChange={(checked) => handleInputChange('aiEnhanced', checked)}
                      data-testid="switch-ai"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Time Lock Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Time Lock Duration (days)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[formData.timeLock || 0]}
                      onValueChange={(value) => handleInputChange('timeLock', value[0])}
                      max={365}
                      step={1}
                      className="w-full"
                      data-testid="slider-timelock"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Immediate</span>
                      <span>{formData.timeLock || 0} days</span>
                      <span>1 Year</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Review Your Capsule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded">
                  <span className="text-white">Completion Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={calculateCompletionScore()} className="w-24" />
                    <span className="text-cyan-300 font-mono">{calculateCompletionScore()}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Title</Label>
                    <p className="text-white">{formData.title || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Type</Label>
                    <p className="text-white">{formData.type || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Category</Label>
                    <p className="text-white">{formData.category || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Priority</Label>
                    <p className="text-white capitalize">{formData.priority}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Content Preview</Label>
                  <div className="p-3 bg-gray-700 rounded text-white text-sm max-h-32 overflow-y-auto">
                    {formData.content.substring(0, 200)}
                    {formData.content.length > 200 && '...'}
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-400">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-300">{formData.attachments.length}</div>
                    <div className="text-xs text-gray-400">Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-300">{formData.voiceNote ? '1' : '0'}</div>
                    <div className="text-xs text-gray-400">Voice Notes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-300">{estimatedRewards}</div>
                    <div className="text-xs text-gray-400">Est. GTT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-300">{formData.timeLock || 0}d</div>
                    <div className="text-xs text-gray-400">Time Lock</div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    data-testid="button-preview"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>

                {showPreview && (
                  <Card className="bg-gray-900 border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-cyan-300">Capsule Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{formData.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-cyan-300 border-cyan-300">
                          {formData.type}
                        </Badge>
                        <Badge variant="secondary">{formData.visibility}</Badge>
                        {formData.priority !== 'normal' && (
                          <Badge className="bg-yellow-600">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{formData.content}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Enhanced Capsule Creator</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                  index === currentStep
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : index < currentStep
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{step.title}</span>
                {index < currentStep && <CheckCircle className="w-4 h-4" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-black/50 backdrop-blur-lg border-gray-600">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
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

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          data-testid="button-previous"
        >
          Previous
        </Button>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
            data-testid="button-reset"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNextStep()}
              data-testid="button-next"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => createCapsuleMutation.mutate(formData)}
              disabled={!canProceedToNextStep() || createCapsuleMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              data-testid="button-create"
            >
              {createCapsuleMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Create Capsule
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}