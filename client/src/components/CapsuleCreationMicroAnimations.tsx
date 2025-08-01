import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Heart, 
  Shield, 
  Zap, 
  Eye, 
  Lock, 
  Clock,
  FileText,
  Camera,
  Mic,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';

interface CapsuleFormData {
  title: string;
  content: string;
  emotion: string;
  privacy: 'public' | 'private' | 'sealed';
  media?: File;
}

interface AnimationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  status: 'pending' | 'active' | 'complete' | 'error';
}

export default function CapsuleCreationMicroAnimations() {
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: '',
    content: '',
    emotion: '',
    privacy: 'public'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [griefScore, setGriefScore] = useState(0);
  const [emotionalResonance, setEmotionalResonance] = useState(0);

  const steps: AnimationStep[] = [
    {
      id: 'input',
      title: 'Truth Input',
      description: 'Capturing your memory',
      icon: FileText,
      progress: 0,
      status: 'active'
    },
    {
      id: 'analysis',
      title: 'Emotional Analysis',
      description: 'Analyzing emotional weight',
      icon: Heart,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'encryption',
      title: 'Cryptographic Sealing',
      description: 'Securing your truth',
      icon: Lock,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'verification',
      title: 'Truth Verification',
      description: 'Validating authenticity',
      icon: Shield,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'minting',
      title: 'Capsule Minting',
      description: 'Creating immutable record',
      icon: Sparkles,
      progress: 0,
      status: 'pending'
    }
  ];

  const [animationSteps, setAnimationSteps] = useState(steps);

  // Real-time grief score calculation
  useEffect(() => {
    const content = formData.content.toLowerCase();
    const griefKeywords = ['loss', 'death', 'goodbye', 'miss', 'remember', 'forever', 'gone', 'memory'];
    const joyKeywords = ['happy', 'joy', 'celebrate', 'love', 'wonderful', 'amazing'];
    
    let score = 0;
    griefKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 15;
    });
    joyKeywords.forEach(keyword => {
      if (content.includes(keyword)) score -= 5;
    });
    
    const finalScore = Math.min(Math.max(score, 0), 100);
    setGriefScore(finalScore);
    setEmotionalResonance(Math.min(formData.content.length / 10 + finalScore * 0.3, 100));
  }, [formData.content]);

  // Typing animation effect
  const [typingWords, setTypingWords] = useState('');
  const targetWords = 'Your truth matters...';
  
  useEffect(() => {
    if (formData.content.length === 0) {
      let index = 0;
      const interval = setInterval(() => {
        setTypingWords(targetWords.slice(0, index));
        index++;
        if (index > targetWords.length) {
          clearInterval(interval);
          setTimeout(() => setTypingWords(''), 2000);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setTypingWords('');
    }
  }, [formData.content]);

  const handleInputChange = (field: keyof CapsuleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update first step progress
    const titleProgress = Math.min(formData.title.length * 10, 40);
    const contentProgress = Math.min(formData.content.length / 5, 60);
    const totalProgress = titleProgress + contentProgress;
    
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 0 ? { ...step, progress: totalProgress } : step
    ));
  };

  const simulateCapsuleCreation = async () => {
    setIsCreating(true);
    
    // Step 1: Analysis
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 1 ? { ...step, status: 'active' } : step
    ));
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setAnimationSteps(prev => prev.map((step, index) => 
        index === 1 ? { ...step, progress: i } : step
      ));
    }
    
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 1 ? { ...step, status: 'complete' } : step
    ));

    // Step 2: Encryption
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 2 ? { ...step, status: 'active' } : step
    ));
    
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAnimationSteps(prev => prev.map((step, index) => 
        index === 2 ? { ...step, progress: i } : step
      ));
    }
    
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 2 ? { ...step, status: 'complete' } : step
    ));

    // Step 3: Verification
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 3 ? { ...step, status: 'active' } : step
    ));
    
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(resolve => setTimeout(resolve, 80));
      setAnimationSteps(prev => prev.map((step, index) => 
        index === 3 ? { ...step, progress: i } : step
      ));
    }
    
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 3 ? { ...step, status: 'complete' } : step
    ));

    // Step 4: Minting
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 4 ? { ...step, status: 'active' } : step
    ));
    
    for (let i = 0; i <= 100; i += 15) {
      await new Promise(resolve => setTimeout(resolve, 60));
      setAnimationSteps(prev => prev.map((step, index) => 
        index === 4 ? { ...step, progress: i } : step
      ));
    }
    
    setAnimationSteps(prev => prev.map((step, index) => 
      index === 4 ? { ...step, status: 'complete' } : step
    ));

    setIsCreating(false);
  };

  const getStepIcon = (step: AnimationStep) => {
    switch (step.status) {
      case 'complete':
        return Check;
      case 'error':
        return AlertCircle;
      default:
        return step.icon;
    }
  };

  const getStepColor = (step: AnimationStep) => {
    switch (step.status) {
      case 'complete':
        return 'text-green-400';
      case 'active':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Creation Form */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
            Create Truth Capsule
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Preserve your memory with emotional authenticity
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Title Input with Character Counter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Capsule Title</label>
            <div className="relative">
              <Input
                placeholder="What truth do you want to preserve?"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white pr-16"
                maxLength={100}
              />
              <motion.div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400"
                animate={{ 
                  color: formData.title.length > 80 ? '#ef4444' : '#64748b' 
                }}
              >
                {formData.title.length}/100
              </motion.div>
            </div>
          </div>

          {/* Content Input with Real-time Analysis */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Memory Content</label>
            <div className="relative">
              <Textarea
                placeholder={typingWords || "Share your truth, memory, or important moment..."}
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white min-h-32 resize-none"
                maxLength={5000}
              />
              
              {/* Floating emotion indicators */}
              <AnimatePresence>
                {formData.content.length > 20 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-2 right-2 flex space-x-2"
                  >
                    {griefScore > 30 && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-blue-500/20 px-2 py-1 rounded-full text-xs text-blue-300"
                      >
                        💙 Deep emotion detected
                      </motion.div>
                    )}
                    {emotionalResonance > 70 && (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="bg-purple-500/20 px-2 py-1 rounded-full text-xs text-purple-300"
                      >
                        ✨ High resonance
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Grief Score</span>
                <span className="text-blue-400">{griefScore.toFixed(1)}</span>
              </div>
              <div className="relative">
                <Progress value={griefScore} className="h-2" />
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${griefScore}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${griefScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Emotional Resonance</span>
                <span className="text-green-400">{emotionalResonance.toFixed(1)}%</span>
              </div>
              <div className="relative">
                <Progress value={emotionalResonance} className="h-2" />
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${emotionalResonance}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionalResonance}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Privacy Selection with Animation */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Privacy Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'public', label: 'Public', icon: Eye, desc: 'Visible to all' },
                { key: 'private', label: 'Private', icon: Lock, desc: 'Only you can see' },
                { key: 'sealed', label: 'Sealed', icon: Shield, desc: 'Time-locked release' }
              ].map((option) => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('privacy', option.key)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.privacy === option.key
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  <option.icon className={`w-5 h-5 mx-auto mb-2 ${
                    formData.privacy === option.key ? 'text-blue-400' : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-medium ${
                    formData.privacy === option.key ? 'text-blue-300' : 'text-slate-300'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {option.desc}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Creation Button */}
          <Button
            onClick={simulateCapsuleCreation}
            disabled={isCreating || !formData.title || !formData.content}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
          >
            {isCreating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {isCreating ? 'Creating Capsule...' : 'Create Truth Capsule'}
          </Button>
        </CardContent>
      </Card>

      {/* Animation Steps Progress */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Capsule Creation Progress
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {animationSteps.map((step, index) => {
                    const Icon = getStepIcon(step);
                    const isActive = step.status === 'active';
                    const isComplete = step.status === 'complete';
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0.5 }}
                        animate={{ 
                          opacity: step.status === 'pending' ? 0.5 : 1,
                          scale: isActive ? 1.02 : 1
                        }}
                        className={`flex items-center space-x-4 p-3 rounded-lg border ${
                          isActive ? 'border-blue-500 bg-blue-500/5' : 
                          isComplete ? 'border-green-500 bg-green-500/5' : 
                          'border-slate-700 bg-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isComplete ? 'bg-green-500/20' :
                          isActive ? 'bg-blue-500/20' : 
                          'bg-slate-700'
                        }`}>
                          <motion.div
                            animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Icon className={`w-5 h-5 ${getStepColor(step)}`} />
                          </motion.div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-white">{step.title}</h4>
                            <span className="text-sm text-slate-400">
                              {step.progress}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">
                            {step.description}
                          </p>
                          
                          {step.status !== 'pending' && (
                            <div className="w-full bg-slate-700 rounded-full h-1">
                              <motion.div
                                className={`h-1 rounded-full ${
                                  isComplete ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${step.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}