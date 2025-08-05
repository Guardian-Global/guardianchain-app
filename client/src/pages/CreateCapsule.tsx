import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedLayout from '@/components/layout/EnhancedLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import EnhancedCapsuleCreator from '@/components/capsule/EnhancedCapsuleCreator';
import CapsuleCreationWizard from '@/components/capsule/CapsuleCreationWizard';
import QuickCreateCapsule from '@/components/capsule/QuickCreateCapsule';
import CapsulePreviewModal from '@/components/capsule/CapsulePreviewModal';
import CapsuleAnalytics from '@/components/capsule/CapsuleAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Sparkles, 
  Users, 
  Wand2,
  Target,
  Settings,
  Zap,
  Brain,
  Clock,
  Star,
  Gift,
  Lightbulb,
  TrendingUp,
  Rocket,
  Heart,
  Award,
  Globe,
  Lock,
  Eye,
  Calendar,
  FileText,
  BarChart3,
  Coins,
  Flame,
  ChevronRight,
  Play,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface CreationMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
}

const creationModes: CreationMode[] = [
  {
    id: 'wizard',
    name: 'Guided Wizard',
    description: 'Step-by-step guided experience perfect for beginners',
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
    features: ['AI Assistance', 'Real-time Tips', 'Content Analysis', 'Template Selection'],
    difficulty: 'Beginner',
    timeEstimate: '5-10 min'
  },
  {
    id: 'advanced',
    name: 'Advanced Creator',
    description: 'Full-featured creator with all options and customizations',
    icon: Settings,
    color: 'from-cyan-500 to-blue-500',
    features: ['All Features', 'Voice Recording', 'File Attachments', 'Advanced Settings'],
    difficulty: 'Advanced',
    timeEstimate: '10-20 min'
  },
  {
    id: 'quick',
    name: 'Quick Create',
    description: 'Fast and simple capsule creation for experienced users',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    features: ['Streamlined Flow', 'Auto-Enhancement', 'Quick Templates', 'Fast Publishing'],
    difficulty: 'Intermediate',
    timeEstimate: '2-5 min'
  }
];

interface QuickStat {
  label: string;
  value: string;
  icon: any;
  color: string;
  trend?: string;
}

const CreateCapsule: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [activeTab, setActiveTab] = useState('create');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'week' | 'month' | 'year'>('week');
  
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!user
  });

  const { data: capsuleInsights } = useQuery({
    queryKey: ['/api/insights/creation'],
    enabled: !!user
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['/api/analytics/capsules', analyticsTimeframe],
    enabled: !!user && activeTab === 'analytics'
  });

  const quickStats: QuickStat[] = [
    {
      label: 'Capsules Created',
      value: userStats?.capsulesCreated?.toString() || '0',
      icon: FileText,
      color: 'text-cyan-400',
      trend: '+12%'
    },
    {
      label: 'GTT Earned',
      value: userStats?.gttEarned?.toString() || '0',
      icon: Coins,
      color: 'text-yellow-400',
      trend: '+8%'
    },
    {
      label: 'Truth Score',
      value: `${userStats?.truthScore || 0}%`,
      icon: Shield,
      color: 'text-green-400',
      trend: '+5%'
    },
    {
      label: 'Impact Level',
      value: userStats?.impactLevel || 'Rising',
      icon: TrendingUp,
      color: 'text-purple-400',
      trend: 'New'
    }
  ];

  const handleModeSelection = (modeId: string) => {
    setSelectedMode(modeId);
    setShowModeSelection(false);
  };

  const handleCreationComplete = (capsuleData: any) => {
    toast({
      title: "Capsule Created Successfully!",
      description: "Your truth has been sealed and added to the eternal record.",
    });
    setShowModeSelection(true);
    setSelectedMode(null);
  };

  const handleCreationCancel = () => {
    setShowModeSelection(true);
    setSelectedMode(null);
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
      <AuthGuard>
        <EnhancedLayout variant="dashboard" showNavigation={true}>
          <div className="lg:ml-72 min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
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
        </EnhancedLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <EnhancedLayout variant="dashboard" showNavigation={true}>
        <div className="lg:ml-72 min-h-screen p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Create Truth Capsule
              </h1>
              <p className="text-gray-400 text-lg mb-6">
                Seal your truth in an immutable capsule for eternity
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Blockchain Secured</span>
                <span>•</span>
                <Star className="w-4 h-4" />
                <span>AI Enhanced</span>
                <span>•</span>
                <Globe className="w-4 h-4" />
                <span>Globally Accessible</span>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="bg-black/30 backdrop-blur-lg border-gray-600">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <IconComponent className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                        {stat.trend && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {stat.trend}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                <TabsTrigger 
                  value="create" 
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                  data-testid="tab-create"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Create
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                  data-testid="tab-insights"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300"
                  data-testid="tab-analytics"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="help" 
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
                  data-testid="tab-help"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-8">
                {/* Mode Selection */}
                <motion.div variants={itemVariants}>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Choose Your Creation Mode</h2>
                    <p className="text-gray-400">Select the experience that best fits your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {creationModes.map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <motion.div
                          key={mode.id}
                          whileHover={{ scale: 1.02, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Card 
                            className="h-full cursor-pointer bg-black/30 backdrop-blur-lg border-gray-600 hover:border-gray-400 transition-all duration-300 group"
                            onClick={() => handleModeSelection(mode.id)}
                            data-testid={`mode-${mode.id}`}
                          >
                            <CardHeader className="text-center pb-4">
                              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <IconComponent className="w-8 h-8 text-white" />
                              </div>
                              <CardTitle className="text-white text-xl">{mode.name}</CardTitle>
                              <div className="flex items-center justify-center gap-4 text-sm">
                                <Badge variant="secondary" className="text-xs">
                                  {mode.difficulty}
                                </Badge>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {mode.timeEstimate}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-gray-400 text-center text-sm">
                                {mode.description}
                              </p>
                              
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-gray-300 text-center">Features:</div>
                                <div className="grid grid-cols-2 gap-1">
                                  {mode.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-1 text-xs text-gray-400">
                                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="pt-2">
                                <Button 
                                  className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 text-white`}
                                  data-testid={`select-${mode.id}`}
                                >
                                  Select Mode
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Recent Templates */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Quick Start Templates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { name: 'Personal Memory', icon: Heart, color: 'text-pink-400', desc: 'Preserve a cherished moment' },
                          { name: 'Truth Declaration', icon: Shield, color: 'text-cyan-400', desc: 'Reveal important facts' },
                          { name: 'Future Prediction', icon: Eye, color: 'text-purple-400', desc: 'Make a forecast' },
                          { name: 'Legal Testimony', icon: Users, color: 'text-green-400', desc: 'Provide witness account' },
                          { name: 'Creative Work', icon: Sparkles, color: 'text-yellow-400', desc: 'Share original content' },
                          { name: 'Legacy Message', icon: Star, color: 'text-orange-400', desc: 'Message for future' }
                        ].map((template, index) => {
                          const IconComponent = template.icon;
                          return (
                            <div
                              key={index}
                              className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-gray-400 cursor-pointer transition-all group"
                              onClick={() => handleModeSelection('wizard')}
                              data-testid={`template-${index}`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className={`w-6 h-6 ${template.color}`} />
                                <div>
                                  <div className="text-white font-medium text-sm">{template.name}</div>
                                  <div className="text-xs text-gray-400">{template.desc}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-purple-300 flex items-center">
                          <Brain className="w-5 h-5 mr-2" />
                          AI Creation Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          'Use specific details and emotions for higher impact scores',
                          'Include supporting evidence to boost truth verification',
                          'Write from personal experience for authenticity',
                          'Consider your audience when setting privacy levels',
                          'Add voice notes to increase engagement by 40%',
                          'Time-locked capsules generate 25% more GTT rewards'
                        ].map((tip, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300">{tip}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-cyan-300 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Performance Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Avg. GTT per Capsule</span>
                            <span className="text-cyan-300 font-medium">
                              {capsuleInsights?.avgGTT || '24.5'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Best Performing Type</span>
                            <span className="text-green-300 font-medium">
                              {capsuleInsights?.bestType || 'Truth'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Optimal Length</span>
                            <span className="text-purple-300 font-medium">
                              {capsuleInsights?.optimalLength || '200-500 chars'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Peak Activity</span>
                            <span className="text-yellow-300 font-medium">
                              {capsuleInsights?.peakTime || '6-9 PM'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Success Rate</span>
                            <span className="text-green-300 font-medium">
                              {capsuleInsights?.successRate || '94.2%'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Community Engagement</span>
                            <span className="text-pink-300 font-medium">
                              {capsuleInsights?.engagement || '87%'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trending Topics */}
                  <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-orange-300 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Trending Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { topic: 'AI Ethics', boost: '+45%', icon: Brain },
                          { topic: 'Climate Truth', boost: '+38%', icon: Globe },
                          { topic: 'Personal Stories', boost: '+52%', icon: Heart },
                          { topic: 'Future Tech', boost: '+41%', icon: Zap }
                        ].map((trend, index) => (
                          <div key={index} className="text-center p-3 bg-gray-800/50 rounded border border-gray-600">
                            <trend.icon className="w-6 h-6 mx-auto text-orange-400 mb-2" />
                            <div className="text-white font-medium text-sm">{trend.topic}</div>
                            <Badge className="bg-orange-600 text-xs mt-1">{trend.boost}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Success Stories */}
                  <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-green-300 flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        Recent Success Stories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          title: 'Climate Whistleblower Truth',
                          gtt: 156,
                          engagement: '2.4K',
                          type: 'Truth'
                        },
                        {
                          title: 'Childhood Memory Collection',
                          gtt: 89,
                          engagement: '1.8K',
                          type: 'Memory'
                        },
                        {
                          title: 'Tech Industry Prediction',
                          gtt: 134,
                          engagement: '3.1K',
                          type: 'Prediction'
                        }
                      ].map((story, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-600">
                          <div>
                            <div className="text-white font-medium text-sm">{story.title}</div>
                            <Badge variant="secondary" className="text-xs mt-1">{story.type}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-300 font-bold">{story.gtt} GTT</div>
                            <div className="text-xs text-gray-400">{story.engagement} views</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <motion.div variants={itemVariants}>
                  {analyticsData ? (
                    <CapsuleAnalytics
                      data={analyticsData}
                      timeframe={analyticsTimeframe}
                      onTimeframeChange={setAnalyticsTimeframe}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Analytics Loading</h3>
                      <p className="text-gray-400">Analyzing your capsule performance data...</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="help" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-green-300 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Getting Started
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {[
                            { step: '1', title: 'Choose Your Mode', desc: 'Select creation experience' },
                            { step: '2', title: 'Add Your Content', desc: 'Write your truth or memory' },
                            { step: '3', title: 'Configure Settings', desc: 'Set privacy and options' },
                            { step: '4', title: 'Review & Launch', desc: 'Seal your capsule forever' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {item.step}
                              </div>
                              <div>
                                <div className="text-white font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-gray-400">{item.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-yellow-300 flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Maximize Your GTT
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { tip: 'High emotional impact content earns more GTT', value: '+50%' },
                          { tip: 'Adding verification increases rewards', value: '+25%' },
                          { tip: 'Including media attachments boosts engagement', value: '+15%' },
                          { tip: 'Public capsules have higher earning potential', value: '+20%' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <p className="text-sm text-gray-300 flex-1">{item.tip}</p>
                            <Badge className="bg-yellow-600 text-white">{item.value}</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </EnhancedLayout>
    </AuthGuard>
  );
};

export default CreateCapsule;