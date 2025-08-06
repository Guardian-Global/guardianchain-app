// pages/OnboardingFlow.tsx
// User-specific onboarding with automatic profile setup

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { onboardUser, completeOnboarding, getOnboardingProgress } from '@/lib/onboarding';
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Vault, Users, Zap } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to GuardianChain',
    description: 'Secure your memories, unlock your truth',
    component: WelcomeStep
  },
  {
    id: 'profile',
    title: 'Create Your Profile',
    description: 'Tell us about yourself',
    component: ProfileStep
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Customize your experience',
    component: PreferencesStep
  },
  {
    id: 'security',
    title: 'Security Setup',
    description: 'Protect your capsules',
    component: SecurityStep
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Your Guardian journey begins',
    component: CompleteStep
  }
];

export default function OnboardingFlow() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    location: '',
    website: '',
    preferences: {
      theme: 'dark',
      notifications: true,
      privacy: 'private',
      backup_frequency: 'weekly',
      auto_seal: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user?.email) {
      setLocation('/auth');
      return;
    }

    // Check if user needs onboarding
    getOnboardingProgress(user.email).then(progressData => {
      if (progressData.isComplete) {
        setLocation('/dashboard');
        return;
      }
      setProgress(progressData.completionPercentage);
    });
  }, [user, setLocation]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      // Complete onboarding
      const success = await completeOnboarding(user.email, formData.preferences);
      
      if (success) {
        toast({
          title: "Welcome to GuardianChain!",
          description: "Your account has been set up successfully.",
        });
        setLocation('/dashboard');
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('❌ Onboarding completion error:', error);
      toast({
        title: "Setup Error",
        description: "There was an issue completing your setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (!user) {
    return null;
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{currentStep + 1}</span>
              </div>
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              user={user}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onComplete={handleComplete}
              isLoading={isLoading}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext }: any) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
        <Shield className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Welcome to GuardianChain</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          You're about to join a revolutionary platform where your memories are secured, 
          your truth is verified, and your legacy is preserved on the blockchain.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <Vault className="w-8 h-8 text-cyan-500 mb-2" />
          <h4 className="font-semibold mb-1">Secure Vault</h4>
          <p className="text-sm text-muted-foreground">
            Your private memories protected by blockchain technology
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <Zap className="w-8 h-8 text-purple-500 mb-2" />
          <h4 className="font-semibold mb-1">GTT Rewards</h4>
          <p className="text-sm text-muted-foreground">
            Earn Guardian Truth Tokens for verified content
          </p>
        </div>
      </div>

      <Button onClick={onNext} className="w-full" size="lg">
        Get Started <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

// Profile Step Component
function ProfileStep({ formData, updateFormData, onNext, onPrevious }: any) {
  const [localData, setLocalData] = useState({
    username: formData.username,
    display_name: formData.display_name,
    bio: formData.bio,
    location: formData.location,
    website: formData.website
  });

  const handleSubmit = () => {
    updateFormData(localData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="guardianuser123"
              value={localData.username}
              onChange={(e) => setLocalData(prev => ({ ...prev, username: e.target.value }))}
              data-testid="input-username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              placeholder="Guardian User"
              value={localData.display_name}
              onChange={(e) => setLocalData(prev => ({ ...prev, display_name: e.target.value }))}
              data-testid="input-display-name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            value={localData.bio}
            onChange={(e) => setLocalData(prev => ({ ...prev, bio: e.target.value }))}
            data-testid="textarea-bio"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              value={localData.location}
              onChange={(e) => setLocalData(prev => ({ ...prev, location: e.target.value }))}
              data-testid="input-location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://yoursite.com"
              value={localData.website}
              onChange={(e) => setLocalData(prev => ({ ...prev, website: e.target.value }))}
              data-testid="input-website"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleSubmit} className="flex-1" data-testid="button-next">
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Preferences Step Component
function PreferencesStep({ formData, updateFormData, onNext, onPrevious }: any) {
  const [preferences, setPreferences] = useState(formData.preferences);

  const handleSubmit = () => {
    updateFormData({ preferences });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Theme Preference</Label>
          <Select 
            value={preferences.theme} 
            onValueChange={(value) => setPreferences((prev: any) => ({ ...prev, theme: value }))}
          >
            <SelectTrigger data-testid="select-theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="light">Light Mode</SelectItem>
              <SelectItem value="auto">Auto (System)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Privacy Settings</Label>
          <Select 
            value={preferences.privacy} 
            onValueChange={(value) => setPreferences((prev: any) => ({ ...prev, privacy: value }))}
          >
            <SelectTrigger data-testid="select-privacy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private (Only me)</SelectItem>
              <SelectItem value="friends">Friends only</SelectItem>
              <SelectItem value="public">Public profile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Backup Frequency</Label>
          <Select 
            value={preferences.backup_frequency} 
            onValueChange={(value) => setPreferences((prev: any) => ({ ...prev, backup_frequency: value }))}
          >
            <SelectTrigger data-testid="select-backup">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="manual">Manual only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences((prev: any) => ({ ...prev, notifications: checked }))}
              data-testid="checkbox-notifications"
            />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto_seal"
              checked={preferences.auto_seal}
              onCheckedChange={(checked) => setPreferences((prev: any) => ({ ...prev, auto_seal: checked }))}
              data-testid="checkbox-auto-seal"
            />
            <Label htmlFor="auto_seal">Auto-seal capsules after 30 days</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleSubmit} className="flex-1" data-testid="button-next">
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Security Step Component
function SecurityStep({ onNext, onPrevious }: any) {
  const [securitySettings, setSecuritySettings] = useState({
    enable_2fa: false,
    require_confirmation: true,
    encryption_enabled: true
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-semibold">Security Configuration</h3>
        <p className="text-muted-foreground">Protect your capsules and data</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Extra security for your account</p>
            </div>
            <Checkbox
              checked={securitySettings.enable_2fa}
              onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enable_2fa: !!checked }))}
              data-testid="checkbox-2fa"
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require Confirmation</h4>
              <p className="text-sm text-muted-foreground">Confirm before sealing capsules</p>
            </div>
            <Checkbox
              checked={securitySettings.require_confirmation}
              onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, require_confirmation: !!checked }))}
              data-testid="checkbox-confirmation"
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-300">Encryption Enabled</h4>
              <p className="text-sm text-green-600 dark:text-green-400">Your data is automatically encrypted</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrevious} variant="outline" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={onNext} className="flex-1" data-testid="button-next">
          Complete Setup <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Complete Step Component
function CompleteStep({ onComplete, isLoading }: any) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Setup Complete!</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Welcome to GuardianChain! Your account is ready. You've received 100 GTT tokens 
          to get started, and your private vault has been initialized.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold text-green-500">100</div>
          <div className="text-sm text-muted-foreground">GTT Tokens</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold text-blue-500">1</div>
          <div className="text-sm text-muted-foreground">Vault Created</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold text-purple-500">1</div>
          <div className="text-sm text-muted-foreground">Playlist Ready</div>
        </div>
      </div>

      <Button 
        onClick={onComplete} 
        className="w-full" 
        size="lg" 
        disabled={isLoading}
        data-testid="button-complete"
      >
        {isLoading ? 'Setting up...' : 'Enter GuardianChain'} 
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
}