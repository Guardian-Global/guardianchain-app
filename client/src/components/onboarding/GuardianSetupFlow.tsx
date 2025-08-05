import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Mail, 
  Lock, 
  Crown,
  Shield,
  Zap,
  Users,
  Sparkles,
  Target,
  Globe,
  Calendar,
  Wallet,
  Camera,
  Star,
  Award,
  Brain,
  Heart,
  Eye,
  Flame
} from 'lucide-react';

interface GuardianProfile {
  // Core Identity
  guardianName: string;
  realName: string;
  email: string;
  bio: string;
  
  // Guardian Specialization
  expertise: string[];
  truthFocus: string;
  verificationStyle: string;
  
  // Web3 Setup
  walletConnected: boolean;
  preferredChain: string;
  
  // Capsule Preferences
  defaultPrivacy: 'public' | 'private' | 'time-locked';
  notificationSettings: {
    newCapsules: boolean;
    verificationRequests: boolean;
    gttRewards: boolean;
    communityUpdates: boolean;
  };
  
  // Guardian Tier
  selectedTier: string;
  
  // Security
  twoFactorEnabled: boolean;
  backupEnabled: boolean;
}

const guardianExpertise = [
  { id: 'whistleblowing', name: 'Whistleblowing & Transparency', icon: Eye, color: 'text-cyan-400' },
  { id: 'journalism', name: 'Investigative Journalism', icon: Brain, color: 'text-purple-400' },
  { id: 'legal', name: 'Legal Documentation', icon: Shield, color: 'text-blue-400' },
  { id: 'corporate', name: 'Corporate Accountability', icon: Target, color: 'text-red-400' },
  { id: 'environmental', name: 'Environmental Evidence', icon: Globe, color: 'text-green-400' },
  { id: 'personal', name: 'Personal Truth & Memory', icon: Heart, color: 'text-pink-400' },
  { id: 'community', name: 'Community Verification', icon: Users, color: 'text-orange-400' },
  { id: 'technology', name: 'Tech Ethics & AI', icon: Zap, color: 'text-yellow-400' }
];

const verificationStyles = [
  { id: 'thorough', name: 'Thorough Investigator', desc: 'Deep, detailed verification process' },
  { id: 'rapid', name: 'Rapid Responder', desc: 'Quick verification for urgent matters' },
  { id: 'collaborative', name: 'Community Validator', desc: 'Work with others to verify truth' },
  { id: 'specialist', name: 'Domain Expert', desc: 'Focus on specific area expertise' }
];

const guardianTiers = [
  {
    id: 'explorer',
    name: 'Truth Explorer',
    price: 'Free',
    description: 'Start your Guardian journey',
    features: ['5 capsules/month', 'Basic verification', 'Community access', 'Standard support'],
    color: 'from-cyan-400 to-blue-500',
    icon: Shield,
    gttReward: '10 GTT/month'
  },
  {
    id: 'seeker',
    name: 'Truth Seeker',
    price: '$19/month',
    description: 'Enhanced Guardian capabilities',
    features: ['50 capsules/month', 'AI-powered analysis', 'Priority verification', 'Advanced encryption'],
    color: 'from-purple-400 to-pink-500',
    icon: Eye,
    popular: true,
    gttReward: '100 GTT/month'
  },
  {
    id: 'creator',
    name: 'Truth Creator',
    price: '$49/month',
    description: 'Professional Guardian tools',
    features: ['Unlimited capsules', 'Professional tools', 'API access', 'White-label options'],
    color: 'from-orange-400 to-red-500',
    icon: Flame,
    gttReward: '500 GTT/month'
  },
  {
    id: 'sovereign',
    name: 'Truth Sovereign',
    price: '$199/month',
    description: 'Ultimate Guardian authority',
    features: ['Enterprise features', 'Institutional tools', 'Custom integrations', 'Dedicated support'],
    color: 'from-yellow-400 to-orange-500',
    icon: Crown,
    gttReward: '2000 GTT/month'
  }
];

export default function GuardianSetupFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<GuardianProfile>({
    guardianName: '',
    realName: '',
    email: '',
    bio: '',
    expertise: [],
    truthFocus: '',
    verificationStyle: '',
    walletConnected: false,
    preferredChain: 'base',
    defaultPrivacy: 'private',
    notificationSettings: {
      newCapsules: true,
      verificationRequests: true,
      gttRewards: true,
      communityUpdates: false
    },
    selectedTier: 'seeker',
    twoFactorEnabled: false,
    backupEnabled: false
  });

  const completeOnboarding = useMutation({
    mutationFn: async (data: GuardianProfile) => {
      return apiRequest('/api/auth/complete-onboarding', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome, Guardian!",
        description: "Your Guardian profile has been successfully created.",
      });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: "Failed to complete Guardian setup. Please try again.",
        variant: "destructive",
      });
    }
  });

  const steps = [
    {
      id: 'identity',
      title: 'Guardian Identity',
      description: 'Establish your Guardian persona',
      component: IdentityStep
    },
    {
      id: 'expertise',
      title: 'Truth Specialization',
      description: 'Define your areas of expertise',
      component: ExpertiseStep
    },
    {
      id: 'verification',
      title: 'Verification Style',
      description: 'Choose your approach to truth validation',
      component: VerificationStep
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Secure your Guardian operations',
      component: SecurityStep
    },
    {
      id: 'tier',
      title: 'Guardian Tier',
      description: 'Select your Guardian level',
      component: TierStep
    },
    {
      id: 'preferences',
      title: 'Capsule Preferences',
      description: 'Configure your default settings',
      component: PreferencesStep
    },
    {
      id: 'complete',
      title: 'Guardian Activation',
      description: 'Activate your Guardian status',
      component: CompletionStep
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep]?.component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding.mutate(profile);
  };

  function IdentityStep() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Create Your Guardian Identity
          </h2>
          <p className="text-gray-400 mt-2">Your Guardian name will be how the community knows you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Guardian Name *</label>
            <Input
              placeholder="e.g., TruthSeeker2024"
              value={profile.guardianName}
              onChange={(e) => setProfile(prev => ({ ...prev, guardianName: e.target.value }))}
              className="bg-gray-800/50 border-gray-700 text-white"
              data-testid="input-guardian-name"
            />
            <p className="text-xs text-gray-500">This will be your public Guardian identity</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Real Name (Optional)</label>
            <Input
              placeholder="Your actual name"
              value={profile.realName}
              onChange={(e) => setProfile(prev => ({ ...prev, realName: e.target.value }))}
              className="bg-gray-800/50 border-gray-700 text-white"
              data-testid="input-real-name"
            />
            <p className="text-xs text-gray-500">Kept private unless you choose to share</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Guardian Bio</label>
          <Textarea
            placeholder="Tell the community about your mission as a Guardian..."
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            className="bg-gray-800/50 border-gray-700 text-white min-h-[100px]"
            data-testid="textarea-bio"
          />
          <p className="text-xs text-gray-500">Share your motivation for becoming a Guardian of Truth</p>
        </div>
      </div>
    );
  }

  function ExpertiseStep() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Truth Specialization
          </h2>
          <p className="text-gray-400 mt-2">Select your areas of expertise (choose up to 3)</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guardianExpertise.map((area) => {
            const Icon = area.icon;
            const isSelected = profile.expertise.includes(area.id);
            
            return (
              <Card
                key={area.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-400 shadow-lg shadow-cyan-400/20' 
                    : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => {
                  if (isSelected) {
                    setProfile(prev => ({
                      ...prev,
                      expertise: prev.expertise.filter(e => e !== area.id)
                    }));
                  } else if (profile.expertise.length < 3) {
                    setProfile(prev => ({
                      ...prev,
                      expertise: [...prev.expertise, area.id]
                    }));
                  }
                }}
                data-testid={`card-expertise-${area.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${area.color}`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{area.name}</h3>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400" />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Primary Truth Focus</label>
          <Textarea
            placeholder="What specific aspect of truth verification drives your mission?"
            value={profile.truthFocus}
            onChange={(e) => setProfile(prev => ({ ...prev, truthFocus: e.target.value }))}
            className="bg-gray-800/50 border-gray-700 text-white"
            data-testid="textarea-truth-focus"
          />
        </div>
      </div>
    );
  }

  function VerificationStep() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
            <Eye className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Verification Approach
          </h2>
          <p className="text-gray-400 mt-2">How do you prefer to validate truth?</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {verificationStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 ${
                profile.verificationStyle === style.id
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-400 shadow-lg shadow-cyan-400/20'
                  : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setProfile(prev => ({ ...prev, verificationStyle: style.id }))}
              data-testid={`card-verification-${style.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{style.name}</h3>
                    <p className="text-sm text-gray-400">{style.desc}</p>
                  </div>
                  {profile.verificationStyle === style.id && (
                    <Check className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function SecurityStep() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-400 to-orange-600 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            Guardian Security
          </h2>
          <p className="text-gray-400 mt-2">Protect your Guardian operations</p>
        </div>
        
        <div className="space-y-4">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="font-medium text-white">Web3 Wallet Connection</h3>
                    <p className="text-sm text-gray-400">Connect your wallet for blockchain features</p>
                  </div>
                </div>
                <Button
                  variant={profile.walletConnected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProfile(prev => ({ ...prev, walletConnected: !prev.walletConnected }))}
                  data-testid="button-wallet-connect"
                >
                  {profile.walletConnected ? "Connected" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Add extra security to your account</p>
                  </div>
                </div>
                <Button
                  variant={profile.twoFactorEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProfile(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                  data-testid="button-2fa-enable"
                >
                  {profile.twoFactorEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="font-medium text-white">Backup & Recovery</h3>
                    <p className="text-sm text-gray-400">Secure backup of your Guardian data</p>
                  </div>
                </div>
                <Button
                  variant={profile.backupEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProfile(prev => ({ ...prev, backupEnabled: !prev.backupEnabled }))}
                  data-testid="button-backup-enable"
                >
                  {profile.backupEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function TierStep() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            Choose Your Guardian Tier
          </h2>
          <p className="text-gray-400 mt-2">Select the level that matches your Guardian mission</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guardianTiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = profile.selectedTier === tier.id;
            
            return (
              <Card
                key={tier.id}
                className={`cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-400 shadow-lg shadow-cyan-400/20'
                    : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setProfile(prev => ({ ...prev, selectedTier: tier.id }))}
                data-testid={`card-tier-${tier.id}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-400 to-pink-600 text-white">
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <CardTitle className="text-white">{tier.name}</CardTitle>
                  <p className="text-2xl font-bold text-cyan-400">{tier.price}</p>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-sm">
                    <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-yellow-400 font-medium">{tier.gttReward}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  function PreferencesStep() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            Guardian Preferences
          </h2>
          <p className="text-gray-400 mt-2">Configure your default capsule and notification settings</p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Default Capsule Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'public', name: 'Public', desc: 'Visible to all Guardians' },
                  { id: 'private', name: 'Private', desc: 'Only visible to you' },
                  { id: 'time-locked', name: 'Time-Locked', desc: 'Revealed after set time' }
                ].map((privacy) => (
                  <Card
                    key={privacy.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      profile.defaultPrivacy === privacy.id
                        ? 'bg-gray-700 border-cyan-400'
                        : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setProfile(prev => ({ ...prev, defaultPrivacy: privacy.id as any }))}
                    data-testid={`card-privacy-${privacy.id}`}
                  >
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-white">{privacy.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{privacy.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'newCapsules', label: 'New Capsules from followed Guardians', icon: Eye },
                { key: 'verificationRequests', label: 'Verification requests for your expertise', icon: Shield },
                { key: 'gttRewards', label: 'GTT token rewards and updates', icon: Sparkles },
                { key: 'communityUpdates', label: 'Community announcements and updates', icon: Users }
              ].map((notification) => {
                const Icon = notification.icon;
                return (
                  <div key={notification.key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-cyan-400" />
                      <span className="text-white">{notification.label}</span>
                    </div>
                    <Button
                      variant={profile.notificationSettings[notification.key as keyof typeof profile.notificationSettings] ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        notificationSettings: {
                          ...prev.notificationSettings,
                          [notification.key]: !prev.notificationSettings[notification.key as keyof typeof prev.notificationSettings]
                        }
                      }))}
                      data-testid={`button-notification-${notification.key}`}
                    >
                      {profile.notificationSettings[notification.key as keyof typeof profile.notificationSettings] ? "On" : "Off"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function CompletionStep() {
    return (
      <div className="space-y-6 text-center">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
          <Award className="w-16 h-16 text-white" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
            Guardian Activation Ready
          </h2>
          <p className="text-xl text-gray-300">
            Welcome to the GuardianChain, <span className="text-cyan-400 font-semibold">{profile.guardianName}</span>
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            You're about to join an elite network of Truth Guardians dedicated to preserving and verifying authentic information. 
            Your journey as a {guardianTiers.find(t => t.id === profile.selectedTier)?.name} begins now.
          </p>
        </div>
        
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-cyan-400/30 max-w-md mx-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Guardian Profile</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Guardian Name:</span>
                <span className="text-cyan-400">{profile.guardianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tier:</span>
                <span className="text-purple-400">{guardianTiers.find(t => t.id === profile.selectedTier)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expertise:</span>
                <span className="text-yellow-400">{profile.expertise.length} areas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Security:</span>
                <span className="text-green-400">
                  {profile.twoFactorEnabled && profile.backupEnabled ? "Enhanced" : "Standard"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button
          onClick={handleComplete}
          disabled={completeOnboarding.isPending}
          className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
          data-testid="button-activate-guardian"
        >
          {completeOnboarding.isPending ? "Activating..." : "Activate Guardian Status"}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
            Guardian Setup
          </h1>
          <p className="text-gray-400">Transform into a Truth Guardian in {steps.length} steps</p>
        </div>
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-cyan-400 font-medium">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-white">
              {steps[currentStep]?.title}
            </span>
            <span className="text-sm text-gray-400">
              {steps[currentStep]?.description}
            </span>
          </div>
        </div>
        
        {/* Step Content */}
        <Card className="bg-gray-800/30 border-gray-700 mb-8">
          <CardContent className="p-8">
            {CurrentStepComponent && <CurrentStepComponent />}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            data-testid="button-previous"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white"
              data-testid="button-next"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}