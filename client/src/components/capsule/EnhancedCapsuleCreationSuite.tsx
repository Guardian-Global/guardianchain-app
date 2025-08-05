import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import EnhancedCapsuleCreator from './EnhancedCapsuleCreator';
import CapsuleCreationWizard from './CapsuleCreationWizard';
import QuickCreateCapsule from './QuickCreateCapsule';
import CapsulePreviewModal from './CapsulePreviewModal';
import CapsuleAnalytics from './CapsuleAnalytics';
import VoiceCapsuleRecorder from './VoiceCapsuleRecorder';
import CapsuleTemplateSelector from './CapsuleTemplateSelector';
import CapsuleAIComposer from './CapsuleAIComposer';
import {
  Rocket,
  Zap,
  Wand2,
  Brain,
  BarChart3,
  Mic,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Star,
  Globe,
  Users,
  Clock,
  Heart,
  Eye,
  Settings,
  HelpCircle,
  ChevronRight,
  Play,
  CheckCircle,
  Award,
  Flame
} from 'lucide-react';

interface CreationMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  difficulty: string;
  estimatedTime: string;
  features: string[];
  pros: string[];
  bestFor: string[];
}

const creationModes: CreationMode[] = [
  {
    id: 'wizard',
    name: 'Guided Wizard',
    description: 'Step-by-step guidance perfect for beginners',
    icon: Wand2,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Beginner',
    estimatedTime: '5-10 min',
    features: ['Step-by-step guidance', 'Built-in templates', 'Auto-validation', 'Help tooltips'],
    pros: ['Easy to use', 'No experience needed', 'Structured approach', 'Error prevention'],
    bestFor: ['First-time users', 'Quick content creation', 'Guided experiences']
  },
  {
    id: 'advanced',
    name: 'Advanced Creator',
    description: 'Full-featured editor with all customization options',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Advanced',
    estimatedTime: '15-30 min',
    features: ['Full customization', 'Advanced settings', 'Multi-tab interface', 'AI assistance'],
    pros: ['Complete control', 'All features available', 'Professional results', 'Custom workflows'],
    bestFor: ['Experienced users', 'Complex capsules', 'Professional content']
  },
  {
    id: 'quick',
    name: 'Quick Create',
    description: 'Streamlined creation for instant results',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Beginner',
    estimatedTime: '2-5 min',
    features: ['Template-based', 'Auto-enhancement', 'Instant publishing', '3-step process'],
    pros: ['Lightning fast', 'AI-powered', 'No setup needed', 'Instant results'],
    bestFor: ['Quick thoughts', 'Social sharing', 'Rapid prototyping']
  }
];

interface EnhancedCapsuleCreationSuiteProps {
  initialMode?: string;
  onComplete?: (capsuleData: any) => void;
}

export default function EnhancedCapsuleCreationSuite({
  initialMode,
  onComplete
}: EnhancedCapsuleCreationSuiteProps) {
  const [selectedMode, setSelectedMode] = useState<string | null>(initialMode || null);
  const [showModeSelection, setShowModeSelection] = useState(!initialMode);
  const [activeTab, setActiveTab] = useState('create');
  const [completionProgress, setCompletionProgress] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    timeSpent: 0,
    wordsWritten: 0,
    templatesUsed: 0,
    aiAssistUsed: 0
  });

  const handleCreationComplete = (capsuleData: any) => {
    setCompletionProgress(100);
    if (onComplete) {
      onComplete(capsuleData);
    }
    // Reset after completion
    setTimeout(() => {
      setShowModeSelection(true);
      setSelectedMode(null);
      setCompletionProgress(0);
    }, 2000);
  };

  const handleCreationCancel = () => {
    setShowModeSelection(true);
    setSelectedMode(null);
    setCompletionProgress(0);
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setShowModeSelection(false);
    setActiveTab('create');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!showModeSelection && selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleCreationCancel}
                data-testid="back-to-modes"
              >
                ← Back to Modes
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {creationModes.find(m => m.id === selectedMode)?.name}
                  </h1>
                  <p className="text-sm text-gray-400">Create Truth Capsule</p>
                </div>
              </div>
            </div>
            
            {completionProgress > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Progress:</span>
                <Progress value={completionProgress} className="w-32" />
                <span className="text-sm text-cyan-300">{completionProgress}%</span>
              </div>
            )}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {selectedMode === 'wizard' && (
                <CapsuleCreationWizard
                  onComplete={handleCreationComplete}
                  onCancel={handleCreationCancel}
                />
              )}
              {selectedMode === 'advanced' && (
                <EnhancedCapsuleCreator />
              )}
              {selectedMode === 'quick' && (
                <QuickCreateCapsule
                  onComplete={handleCreationComplete}
                  onCancel={handleCreationCancel}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              Create Truth Capsule
            </h1>
            <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto">
              Choose your creation experience and seal your truth in an immutable capsule for eternity
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Enhanced</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Time-Locked</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>GTT Rewards</span>
              </div>
            </div>
          </motion.div>

          {/* Creation Modes */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creationModes.map((mode, index) => {
              const IconComponent = mode.icon;
              return (
                <motion.div
                  key={mode.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer"
                  onClick={() => handleModeSelect(mode.id)}
                  data-testid={`mode-${mode.id}`}
                >
                  <Card className="h-full bg-black/30 backdrop-blur-lg border-gray-600 hover:border-gray-400 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/10">
                    <CardContent className="p-8">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {mode.difficulty}
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{mode.name}</h3>
                      <p className="text-gray-400 mb-4">{mode.description}</p>
                      
                      <div className="space-y-4">
                        {/* Time Estimate */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{mode.estimatedTime}</span>
                        </div>
                        
                        {/* Features */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Features</h4>
                          <div className="space-y-1">
                            {mode.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Best For */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Best For</h4>
                          <div className="flex flex-wrap gap-1">
                            {mode.bestFor.slice(0, 2).map((use, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                          Start Creating
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Additional Features */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Assistance',
                description: 'Smart content generation and enhancement',
                color: 'text-purple-400'
              },
              {
                icon: Mic,
                title: 'Voice Recording',
                description: 'Add voice notes with transcription',
                color: 'text-green-400'
              },
              {
                icon: FileText,
                title: 'Templates',
                description: 'Pre-built templates for common use cases',
                color: 'text-blue-400'
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Track performance and engagement',
                color: 'text-orange-400'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-sm border-gray-700 hover:border-gray-500 transition-all">
                <CardContent className="p-6 text-center">
                  <feature.icon className={`w-8 h-8 mx-auto ${feature.color} mb-3`} />
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-500/30">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-cyan-300 mb-2">12,547</div>
                    <div className="text-sm text-gray-400">Capsules Created</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-300 mb-2">94.2%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-300 mb-2">2.4M</div>
                    <div className="text-sm text-gray-400">GTT Earned</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-300 mb-2">8.7/10</div>
                    <div className="text-sm text-gray-400">Avg. Truth Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}