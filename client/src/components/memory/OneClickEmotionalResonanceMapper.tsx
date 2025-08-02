import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Smile, 
  Zap, 
  Star, 
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  Palette,
  BarChart3,
  Eye,
  ArrowRight,
  Download
} from 'lucide-react';

interface EmotionalData {
  emotion: string;
  intensity: number;
  color: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface ResonanceMap {
  id: string;
  title: string;
  timestamp: Date;
  overallScore: number;
  emotions: EmotionalData[];
  insights: string[];
  suggestedActions: string[];
}

const EMOTION_TYPES: EmotionalData[] = [
  { emotion: 'Joy', intensity: 0, color: '#FFD700', icon: Smile, description: 'Happiness and contentment' },
  { emotion: 'Love', intensity: 0, color: '#FF69B4', icon: Heart, description: 'Affection and connection' },
  { emotion: 'Excitement', intensity: 0, color: '#FF4500', icon: Zap, description: 'Enthusiasm and energy' },
  { emotion: 'Pride', intensity: 0, color: '#9370DB', icon: Star, description: 'Achievement and satisfaction' },
  { emotion: 'Gratitude', intensity: 0, color: '#32CD32', icon: Sparkles, description: 'Appreciation and thankfulness' },
  { emotion: 'Wonder', intensity: 0, color: '#00CED1', icon: Eye, description: 'Curiosity and amazement' }
];

const SAMPLE_CONTENT = `
Today marked a significant milestone in my life. After months of preparation and countless hours of practice, I finally presented my research at the international conference. The moment I stepped onto that stage, my heart was racing with a mixture of nervousness and excitement.

As I began speaking, I could feel the audience's attention. Their engaged faces and thoughtful questions filled me with a sense of pride and accomplishment. The applause at the end was not just recognition of my work, but validation of all the late nights and challenges I had overcome.

Walking off that stage, I felt an overwhelming sense of gratitude - for my mentors who guided me, my family who supported me, and for the opportunity to share knowledge that might make a difference in the world.
`;

export default function OneClickEmotionalResonanceMapper() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentMap, setCurrentMap] = useState<ResonanceMap | null>(null);
  const [inputText, setInputText] = useState(SAMPLE_CONTENT);
  const [animationStep, setAnimationStep] = useState(0);

  const analyzeEmotionalResonance = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setAnimationStep(0);

    // Simulate AI analysis with realistic timing
    const analysisSteps = [
      { delay: 500, step: 1, message: 'Parsing emotional markers...' },
      { delay: 1000, step: 2, message: 'Analyzing sentiment patterns...' },
      { delay: 1500, step: 3, message: 'Mapping resonance frequencies...' },
      { delay: 2000, step: 4, message: 'Generating insights...' },
      { delay: 2500, step: 5, message: 'Complete!' }
    ];

    analysisSteps.forEach(({ delay, step, message }) => {
      setTimeout(() => {
        setAnimationStep(step);
        if (step === 5) {
          generateResonanceMap();
        }
      }, delay);
    });
  };

  const generateResonanceMap = () => {
    // Simulate AI-generated emotional analysis
    const emotions = EMOTION_TYPES.map(emotion => ({
      ...emotion,
      intensity: Math.floor(Math.random() * 40) + 60 // High emotional content
    }));

    const newMap: ResonanceMap = {
      id: Date.now().toString(),
      title: 'Conference Presentation Memory',
      timestamp: new Date(),
      overallScore: 87,
      emotions,
      insights: [
        'Strong achievement-oriented emotional signature detected',
        'High levels of social connection and validation present',
        'Professional growth milestone with lasting positive impact',
        'Balanced emotional complexity suggests authentic experience'
      ],
      suggestedActions: [
        'Create milestone celebration capsule',
        'Document lessons learned for mentoring others',
        'Archive supporting materials (photos, notes, feedback)',
        'Schedule follow-up reflection in 6 months'
      ]
    };

    setCurrentMap(newMap);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const EmotionalChart = ({ emotions }: { emotions: EmotionalData[] }) => (
    <div className="space-y-4">
      {emotions.map((emotion, index) => {
        const Icon = emotion.icon;
        return (
          <motion.div
            key={emotion.emotion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 w-24">
              <Icon size={16} style={{ color: emotion.color }} />
              <span className="text-sm text-white">{emotion.emotion}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Progress 
                  value={emotion.intensity} 
                  className="flex-1 h-3"
                  style={{
                    background: `linear-gradient(to right, ${emotion.color}22, ${emotion.color})`
                  }}
                />
                <span className="text-sm text-gray-300 w-12">{emotion.intensity}%</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="text-purple-400" />
            One-Click Emotional Resonance Mapper
            <Heart className="text-pink-400" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Instantly analyze and visualize the emotional depth of your memories with AI-powered sentiment mapping
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="text-purple-400" />
                  Memory Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-64 p-4 bg-slate-700/50 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Paste your memory content here for emotional analysis..."
                />
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {inputText.length} characters • {inputText.split(' ').length} words
                  </div>
                  
                  <Button
                    onClick={analyzeEmotionalResonance}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isAnalyzing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain size={16} className="mr-2" />
                        </motion.div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="mr-2" />
                        Map Emotions
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="bg-slate-800/80 backdrop-blur-sm border-blue-500/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Brain className="text-blue-400" size={24} />
                          </motion.div>
                          <div>
                            <h3 className="text-white font-semibold">AI Analysis in Progress</h3>
                            <p className="text-gray-400 text-sm">
                              {animationStep === 0 && 'Initializing emotional parser...'}
                              {animationStep === 1 && 'Parsing emotional markers...'}
                              {animationStep === 2 && 'Analyzing sentiment patterns...'}
                              {animationStep === 3 && 'Mapping resonance frequencies...'}
                              {animationStep === 4 && 'Generating insights...'}
                              {animationStep === 5 && 'Analysis complete!'}
                            </p>
                          </div>
                        </div>
                        
                        <Progress value={(animationStep / 5) * 100} className="h-2" />
                        
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <motion.div
                              key={step}
                              className={`h-2 rounded-full ${
                                animationStep >= step ? 'bg-blue-500' : 'bg-gray-600'
                              }`}
                              animate={animationStep >= step ? { opacity: [0.5, 1, 0.5] } : {}}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {currentMap ? (
              <>
                {/* Overall Score */}
                <Card className="bg-slate-800/80 backdrop-blur-sm border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="text-green-400" />
                      Emotional Resonance Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-6xl font-bold text-green-400 mb-2"
                      >
                        {currentMap.overallScore}
                      </motion.div>
                      <p className="text-gray-300">Out of 100</p>
                      <Badge className="mt-2 bg-green-500/20 text-green-300">
                        High Emotional Impact
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Emotional Breakdown */}
                <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="text-purple-400" />
                      Emotional Composition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmotionalChart emotions={currentMap.emotions} />
                  </CardContent>
                </Card>

                {/* Insights */}
                <Card className="bg-slate-800/80 backdrop-blur-sm border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="text-yellow-400" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentMap.insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg"
                        >
                          <Sparkles className="text-yellow-400 mt-0.5" size={16} />
                          <p className="text-gray-300 text-sm">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Actions */}
                <Card className="bg-slate-800/80 backdrop-blur-sm border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="text-blue-400" />
                      Suggested Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentMap.suggestedActions.map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-2 hover:bg-blue-500/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <ArrowRight className="text-blue-400" size={16} />
                          <p className="text-gray-300 text-sm">{action}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Download size={16} className="mr-2" />
                        Export Resonance Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800/80 backdrop-blur-sm border-gray-500/30">
                <CardContent className="pt-12 pb-12 text-center">
                  <Brain className="text-gray-400 mx-auto mb-4" size={48} />
                  <h3 className="text-white text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-gray-400">
                    Enter your memory content and click "Map Emotions" to generate an emotional resonance analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}