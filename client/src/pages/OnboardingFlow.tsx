import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
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
  Calendar
} from 'lucide-react';

interface OnboardingData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Profile Setup
  displayName: string;
  bio: string;
  location: string;
  interests: string[];
  
  // Plan Selection
  selectedPlan: string;
  paymentMethod?: string;
  
  // Preferences
  notifications: boolean;
  newsletter: boolean;
  publicProfile: boolean;
}

const plans = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: 'Free',
    description: 'Perfect for getting started',
    features: ['5 capsules/month', 'Basic verification', 'Community access'],
    color: 'from-[#00ffe1] to-[#059669]',
    icon: Shield
  },
  {
    id: 'seeker', 
    name: 'Seeker',
    price: '$19/month',
    description: 'Advanced features',
    features: ['50 capsules/month', 'AI analysis', 'Priority verification'],
    color: 'from-[#ff00d4] to-[#c21cac]',
    icon: Zap,
    popular: true
  },
  {
    id: 'creator',
    name: 'Creator', 
    price: '$49/month',
    description: 'Full creation suite',
    features: ['Unlimited capsules', 'NFT minting', 'Revenue sharing'],
    color: 'from-[#7c3aed] to-[#5b21b6]',
    icon: Crown
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    price: '$99/month', 
    description: 'Enterprise-grade',
    features: ['Everything included', 'Custom deployment', 'Dedicated support'],
    color: 'from-[#f59e0b] to-[#d97706]',
    icon: Users
  }
];

const interestOptions = [
  'Corporate Transparency',
  'Government Accountability', 
  'Environmental Issues',
  'Digital Rights',
  'Healthcare',
  'Education',
  'Technology',
  'History & Archives',
  'Personal Stories',
  'Whistleblowing',
  'Scientific Research',
  'Legal Documents'
];

export default function OnboardingFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    bio: '',
    location: '',
    interests: [],
    selectedPlan: 'explorer',
    notifications: true,
    newsletter: false,
    publicProfile: true
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const createAccountMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      return apiRequest('POST', '/api/auth/register', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to GuardianChain. Setting up your profile...",
      });
      setLocation('/profile');
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    createAccountMutation.mutate(formData);
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests;
    if (currentInterests.includes(interest)) {
      updateFormData({
        interests: currentInterests.filter(i => i !== interest)
      });
    } else {
      updateFormData({
        interests: [...currentInterests, interest]
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ffe1]/20 to-[#7c3aed]/20 rounded-full border border-[#00ffe1]/30 mb-6">
            <Sparkles className="w-5 h-5 text-[#00ffe1]" />
            <span className="text-[#00ffe1] font-medium">Welcome to GuardianChain</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#00ffe1] via-[#ff00d4] to-[#7c3aed] bg-clip-text text-transparent">
            Create Your Account
          </h1>
          
          <p className="text-[#8b949e] mb-6">
            Step {currentStep} of {totalSteps}: Let's get you set up with a secure account
          </p>
          
          <Progress value={progress} className="mb-8" />
        </div>

        <Card className="bg-[#161b22] border-[#30363d]">
          <CardContent className="p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 mx-auto mb-4 text-[#00ffe1]" />
                  <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Personal Information</h2>
                  <p className="text-[#8b949e]">Tell us a bit about yourself</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                      First Name
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateFormData({ firstName: e.target.value })}
                      placeholder="Enter your first name"
                      className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      data-testid="input-firstName"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                      Last Name
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateFormData({ lastName: e.target.value })}
                      placeholder="Enter your last name"
                      className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                      data-testid="input-lastName"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="Enter your email address"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    data-testid="input-email"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-[#ff00d4]" />
                  <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Account Security</h2>
                  <p className="text-[#8b949e]">Create a secure password for your account</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                    placeholder="Enter a secure password"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    data-testid="input-password"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    data-testid="input-confirmPassword"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Crown className="w-12 h-12 mx-auto mb-4 text-[#7c3aed]" />
                  <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Choose Your Plan</h2>
                  <p className="text-[#8b949e]">Select the plan that works best for you</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map((plan) => {
                    const IconComponent = plan.icon;
                    const isSelected = formData.selectedPlan === plan.id;
                    
                    return (
                      <Card 
                        key={plan.id}
                        className={`
                          cursor-pointer transition-all relative overflow-hidden
                          ${isSelected 
                            ? 'bg-[#21262d] border-[#00ffe1] ring-2 ring-[#00ffe1]/50' 
                            : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'
                          }
                        `}
                        onClick={() => updateFormData({ selectedPlan: plan.id })}
                        data-testid={`plan-${plan.id}`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#ff00d4] to-[#c21cac] text-white text-center py-1 text-xs font-medium">
                            Most Popular
                          </div>
                        )}
                        
                        <CardHeader className={plan.popular ? 'pt-8' : 'pt-6'}>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-[#00ffe1]" />
                            )}
                          </div>
                          
                          <CardTitle className="text-xl text-[#f0f6fc]">
                            {plan.name}
                          </CardTitle>
                          
                          <div className="text-2xl font-bold text-[#f0f6fc]">
                            {plan.price}
                          </div>
                          
                          <p className="text-[#8b949e] text-sm">
                            {plan.description}
                          </p>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-[#00ffe1]" />
                                <span className="text-[#8b949e]">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 mx-auto mb-4 text-[#f59e0b]" />
                  <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Your Interests</h2>
                  <p className="text-[#8b949e]">Select topics that interest you most</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => {
                    const isSelected = formData.interests.includes(interest);
                    
                    return (
                      <Badge 
                        key={interest}
                        variant={isSelected ? "default" : "outline"}
                        className={`
                          cursor-pointer p-3 text-center justify-center transition-all
                          ${isSelected 
                            ? 'bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]'
                            : 'border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1]'
                          }
                        `}
                        onClick={() => toggleInterest(interest)}
                        data-testid={`interest-${interest.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {interest}
                      </Badge>
                    );
                  })}
                </div>
                
                <p className="text-sm text-[#8b949e] text-center">
                  Selected {formData.interests.length} interests. You can change these later.
                </p>
              </div>
            )}

            {/* Step 5: Profile Setup */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Globe className="w-12 h-12 mx-auto mb-4 text-[#10b981]" />
                  <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Profile Setup</h2>
                  <p className="text-[#8b949e]">Customize your profile and preferences</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                    Display Name (Optional)
                  </label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => updateFormData({ displayName: e.target.value })}
                    placeholder="How should others see your name?"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    data-testid="input-displayName"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                    Bio (Optional)
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => updateFormData({ bio: e.target.value })}
                    placeholder="Tell others about yourself..."
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    rows={3}
                    data-testid="input-bio"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#f0f6fc] mb-2 block">
                    Location (Optional)
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                    placeholder="Where are you based?"
                    className="bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                    data-testid="input-location"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#30363d]">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-[#30363d] text-[#8b949e] hover:text-[#f0f6fc]"
                data-testid="button-previous"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleComplete}
                  disabled={createAccountMutation.isPending}
                  className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                  data-testid="button-complete"
                >
                  {createAccountMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-[#0d1117] border-t-transparent rounded-full mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb]"
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}