import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Target, 
  Compass, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Brain,
  Heart,
  Shield,
  Zap,
  Crown,
  Globe,
  BookOpen,
  Camera,
  Mic,
  FileText,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean;
}

interface UserProfile {
  name: string;
  email: string;
  primaryGoal: string;
  interests: string[];
  experience: string;
  contentTypes: string[];
  privacyLevel: string;
  communicationStyle: string;
  motivation: string;
  background: string;
}

// Step Components
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 mx-auto bg-gradient-to-br from-[#00ffe1] to-[#7c3aed] rounded-full flex items-center justify-center"
      >
        <Sparkles className="w-12 h-12 text-white" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-[#f0f6fc]">
        Welcome to GuardianChain
      </h2>
      
      <p className="text-lg text-[#8b949e] max-w-2xl mx-auto">
        You're about to embark on a journey of truth preservation and verification. 
        Let's personalize your experience to match your unique needs and goals.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
          <Shield className="w-8 h-8 text-[#00ffe1] mb-2" />
          <h3 className="font-semibold text-[#f0f6fc] mb-1">Secure Truth Storage</h3>
          <p className="text-sm text-[#8b949e]">Immutable blockchain verification</p>
        </div>
        
        <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
          <Brain className="w-8 h-8 text-[#ff00d4] mb-2" />
          <h3 className="font-semibold text-[#f0f6fc] mb-1">AI-Powered Insights</h3>
          <p className="text-sm text-[#8b949e]">Intelligent content analysis</p>
        </div>
        
        <div className="p-4 bg-[#21262d] rounded-lg border border-[#30363d]">
          <Crown className="w-8 h-8 text-[#7c3aed] mb-2" />
          <h3 className="font-semibold text-[#f0f6fc] mb-1">Sovereign Identity</h3>
          <p className="text-sm text-[#8b949e]">Complete control over your data</p>
        </div>
      </div>
      
      <Button
        onClick={onNext}
        size="lg"
        className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] px-8"
      >
        Begin Your Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function PersonalInfoStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: { 
  data: UserProfile; 
  updateData: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-[#00ffe1] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Tell Us About Yourself</h2>
        <p className="text-[#8b949e]">Help us personalize your GuardianChain experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#f0f6fc]">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your full name"
            className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#f0f6fc]">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="Enter your email"
            className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-[#f0f6fc]">Tell us about your background</Label>
        <Textarea
          value={data.background}
          onChange={(e) => updateData({ background: e.target.value })}
          placeholder="What brings you to GuardianChain? What's your story?"
          rows={4}
          className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
        />
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="border-[#30363d] text-[#8b949e]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!data.name || !data.email}
          className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function GoalsStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: { 
  data: UserProfile; 
  updateData: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const goals = [
    { id: 'truth-seeker', title: 'Truth Seeker', description: 'Verify and discover authentic information', icon: <Target className="w-6 h-6" /> },
    { id: 'legacy-builder', title: 'Legacy Builder', description: 'Preserve important stories and memories', icon: <Heart className="w-6 h-6" /> },
    { id: 'whistleblower', title: 'Whistleblower', description: 'Expose corruption and share evidence safely', icon: <Shield className="w-6 h-6" /> },
    { id: 'researcher', title: 'Researcher', description: 'Collect and analyze verified data', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'creator', title: 'Content Creator', description: 'Share authentic stories and experiences', icon: <Camera className="w-6 h-6" /> },
    { id: 'validator', title: 'Truth Validator', description: 'Help verify and authenticate content', icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 text-[#ff00d4] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">What's Your Primary Goal?</h2>
        <p className="text-[#8b949e]">This helps us customize your dashboard and recommendations</p>
      </div>
      
      <RadioGroup 
        value={data.primaryGoal} 
        onValueChange={(value) => updateData({ primaryGoal: value })}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Label
              htmlFor={goal.id}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.primaryGoal === goal.id
                  ? 'border-[#00ffe1] bg-[#00ffe1]/10'
                  : 'border-[#30363d] bg-[#21262d] hover:border-[#8b949e]'
              }`}
            >
              <RadioGroupItem value={goal.id} id={goal.id} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${data.primaryGoal === goal.id ? 'text-[#00ffe1]' : 'text-[#8b949e]'}`}>
                    {goal.icon}
                  </div>
                  <h3 className={`font-semibold ${data.primaryGoal === goal.id ? 'text-[#00ffe1]' : 'text-[#f0f6fc]'}`}>
                    {goal.title}
                  </h3>
                </div>
                <p className="text-sm text-[#8b949e]">{goal.description}</p>
              </div>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="border-[#30363d] text-[#8b949e]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!data.primaryGoal}
          className="bg-[#ff00d4] text-white hover:bg-[#e619c3]"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function InterestsStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: { 
  data: UserProfile; 
  updateData: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const interests = [
    'Corporate Transparency', 'Government Accountability', 'Historical Documentation',
    'Personal Stories', 'Scientific Research', 'Journalism', 'Legal Evidence',
    'Environmental Issues', 'Social Justice', 'Technology Ethics', 'Healthcare',
    'Education', 'Finance', 'Art & Culture', 'Sports', 'Politics'
  ];

  const toggleInterest = (interest: string) => {
    const updated = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    updateData({ interests: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Compass className="w-12 h-12 text-[#7c3aed] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">What Interests You?</h2>
        <p className="text-[#8b949e]">Select topics you'd like to see and engage with (select at least 3)</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {interests.map((interest) => (
          <motion.div
            key={interest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Label
              htmlFor={interest}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                data.interests.includes(interest)
                  ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]'
                  : 'border-[#30363d] bg-[#21262d] text-[#8b949e] hover:border-[#8b949e]'
              }`}
            >
              <Checkbox
                id={interest}
                checked={data.interests.includes(interest)}
                onCheckedChange={() => toggleInterest(interest)}
              />
              {interest}
            </Label>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <Button onClick={onPrev} variant="outline" className="border-[#30363d] text-[#8b949e]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <div className="text-sm text-[#8b949e] mb-1">
            {data.interests.length} selected (minimum 3)
          </div>
          <Progress value={Math.min((data.interests.length / 3) * 100, 100)} className="w-32 h-2" />
        </div>
        <Button 
          onClick={onNext}
          disabled={data.interests.length < 3}
          className="bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ContentTypesStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: { 
  data: UserProfile; 
  updateData: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const contentTypes = [
    { id: 'text', title: 'Text Documents', description: 'Articles, reports, testimonies', icon: <FileText className="w-6 h-6" /> },
    { id: 'voice', title: 'Voice Recordings', description: 'Audio testimonies and interviews', icon: <Mic className="w-6 h-6" /> },
    { id: 'images', title: 'Images & Photos', description: 'Visual evidence and documentation', icon: <Camera className="w-6 h-6" /> },
    { id: 'videos', title: 'Video Content', description: 'Video testimonies and evidence', icon: <Video className="w-6 h-6" /> },
  ];

  const toggleContentType = (type: string) => {
    const updated = data.contentTypes.includes(type)
      ? data.contentTypes.filter(t => t !== type)
      : [...data.contentTypes, type];
    updateData({ contentTypes: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Zap className="w-12 h-12 text-[#f59e0b] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">What Content Will You Share?</h2>
        <p className="text-[#8b949e]">Select the types of content you plan to create or verify</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Label
              htmlFor={type.id}
              className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                data.contentTypes.includes(type.id)
                  ? 'border-[#f59e0b] bg-[#f59e0b]/10'
                  : 'border-[#30363d] bg-[#21262d] hover:border-[#8b949e]'
              }`}
            >
              <Checkbox
                id={type.id}
                checked={data.contentTypes.includes(type.id)}
                onCheckedChange={() => toggleContentType(type.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${data.contentTypes.includes(type.id) ? 'text-[#f59e0b]' : 'text-[#8b949e]'}`}>
                    {type.icon}
                  </div>
                  <h3 className={`font-semibold ${data.contentTypes.includes(type.id) ? 'text-[#f59e0b]' : 'text-[#f0f6fc]'}`}>
                    {type.title}
                  </h3>
                </div>
                <p className="text-sm text-[#8b949e]">{type.description}</p>
              </div>
            </Label>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="border-[#30363d] text-[#8b949e]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={data.contentTypes.length === 0}
          className="bg-[#f59e0b] text-[#0d1117] hover:bg-[#d97706]"
        >
          Complete Setup
          <CheckCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export function PersonalizedUserJourneyFlow({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    primaryGoal: '',
    interests: [],
    experience: '',
    contentTypes: [],
    privacyLevel: 'balanced',
    communicationStyle: 'friendly',
    motivation: '',
    background: ''
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      subtitle: 'Let\'s get started',
      icon: <Sparkles className="w-5 h-5" />,
      component: WelcomeStep
    },
    {
      id: 'personal',
      title: 'Personal Info',
      subtitle: 'Tell us about yourself',
      icon: <User className="w-5 h-5" />,
      component: PersonalInfoStep
    },
    {
      id: 'goals',
      title: 'Your Goals',
      subtitle: 'What brings you here?',
      icon: <Target className="w-5 h-5" />,
      component: GoalsStep
    },
    {
      id: 'interests',
      title: 'Interests',
      subtitle: 'What matters to you?',
      icon: <Compass className="w-5 h-5" />,
      component: InterestsStep
    },
    {
      id: 'content',
      title: 'Content Types',
      subtitle: 'What will you share?',
      icon: <Zap className="w-5 h-5" />,
      component: ContentTypesStep
    }
  ];

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userProfile);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Getting Started</h1>
            <Badge variant="outline" className="border-[#30363d] text-[#8b949e]">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  index <= currentStep 
                    ? 'border-[#00ffe1] bg-[#00ffe1] text-[#0d1117]' 
                    : 'border-[#30363d] text-[#8b949e]'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-[#00ffe1]' : 'bg-[#30363d]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-[#f0f6fc]">
              {steps[currentStep].title}
            </h2>
            <p className="text-[#8b949e]">{steps[currentStep].subtitle}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-[#161b22] border-[#30363d]">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentStepComponent
                  data={userProfile}
                  updateData={updateUserProfile}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}