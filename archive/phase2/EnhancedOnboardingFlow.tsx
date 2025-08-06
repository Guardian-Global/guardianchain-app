import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress"; // Component will be created if needed
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Camera,
  Globe,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Video,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Shield,
  Wallet,
  CreditCard,
  Bell,
  Lock,
  Settings,
  Eye,
  Globe2,
  Zap,
  Crown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Enhanced onboarding step schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  dateOfBirth: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

const contactInfoSchema = z.object({
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
});

const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]),
  language: z.string(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  profileVisible: z.boolean(),
  capsulesPublic: z.boolean(),
  allowAnalytics: z.boolean(),
});

const subscriptionSchema = z.object({
  tier: z.enum(["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"]),
  billingCycle: z.enum(["monthly", "yearly"]),
});

interface EnhancedOnboardingFlowProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to GuardianChain",
    description: "Let's get you set up with your truth vault",
    icon: Sparkles,
  },
  {
    id: "personal",
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: "contact",
    title: "Contact & Social",
    description: "Connect your professional and social profiles",
    icon: Globe,
  },
  {
    id: "preferences",
    title: "Preferences & Privacy",
    description: "Customize your experience",
    icon: Settings,
  },
  {
    id: "subscription",
    title: "Choose Your Plan",
    description: "Select the tier that fits your needs",
    icon: Crown,
  },
  {
    id: "security",
    title: "Security Setup",
    description: "Secure your account and verify your identity",
    icon: Shield,
  },
  {
    id: "wallet",
    title: "Web3 Integration",
    description: "Connect your wallet for blockchain features",
    icon: Wallet,
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Welcome to the GuardianChain community",
    icon: CheckCircle,
  },
];

export default function EnhancedOnboardingFlow({ onComplete }: EnhancedOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  // Personal info form
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      dateOfBirth: "",
      location: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bio: "",
    },
  });

  // Contact info form
  const contactForm = useForm({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phone: "",
      website: "",
      company: "",
      jobTitle: "",
      industry: "",
      linkedinUrl: "",
      twitterUrl: "",
      githubUrl: "",
    },
  });

  // Preferences form
  const preferencesForm = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: "dark" as const,
      language: "en",
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      profileVisible: true,
      capsulesPublic: false,
      allowAnalytics: true,
    },
  });

  // Subscription form
  const subscriptionForm = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      tier: "EXPLORER" as const,
      billingCycle: "monthly" as const,
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/auth/complete-onboarding", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to GuardianChain! 🎉",
        description: "Your account has been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to complete onboarding.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCompletedSteps((prev: number[]) => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepSubmit = (data: any) => {
    setOnboardingData(prev => ({ ...prev, [step.id]: data }));
    
    if (currentStep === ONBOARDING_STEPS.length - 2) {
      // Complete onboarding on the last step
      completeOnboardingMutation.mutate({
        ...onboardingData,
        [step.id]: data,
      });
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    switch (step.id) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to GuardianChain</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                The next generation platform for truth verification, content preservation, and community-driven governance. 
                Let's set up your sovereign digital identity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Secure & Private</h3>
                <p className="text-sm text-slate-400">Your data is encrypted and you control your privacy</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Web3 Native</h3>
                <p className="text-sm text-slate-400">Built on blockchain with ultra-low fees</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Globe2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Community Driven</h3>
                <p className="text-sm text-slate-400">Governed by the community, for the community</p>
              </div>
            </div>
            <Button 
              onClick={nextStep}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );

      case "personal":
        return (
          <Form {...personalForm}>
            <form onSubmit={personalForm.handleSubmit(handleStepSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={personalForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="bg-slate-800 border-slate-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="bg-slate-800 border-slate-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={personalForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe_guardian" {...field} className="bg-slate-800 border-slate-700 text-white" />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      This will be your unique identifier on GuardianChain
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself and your interest in truth preservation..."
                        {...field} 
                        className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={personalForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="New York, NY" {...field} className="bg-slate-800 border-slate-700 text-white" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Timezone</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-800 border-slate-700 text-white" readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={prevStep} variant="outline" className="border-slate-600 text-slate-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        );

      case "subscription":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Choose Your Guardian Tier</h3>
              <p className="text-slate-300">Select the plan that best fits your truth preservation needs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  tier: "EXPLORER",
                  name: "Explorer",
                  price: "Free",
                  description: "Perfect for getting started",
                  features: ["5 capsules/month", "Basic verification", "Community support"],
                  popular: false,
                },
                {
                  tier: "SEEKER",
                  name: "Seeker",
                  price: "$9/month",
                  description: "For active truth seekers",
                  features: ["25 capsules/month", "5% yield bonus", "Priority support"],
                  popular: true,
                },
                {
                  tier: "CREATOR",
                  name: "Creator",
                  price: "$29/month",
                  description: "For content creators",
                  features: ["100 capsules/month", "10% yield bonus", "Advanced analytics"],
                  popular: false,
                },
                {
                  tier: "SOVEREIGN",
                  name: "Sovereign",
                  price: "$99/month",
                  description: "Maximum power and features",
                  features: ["500 capsules/month", "25% yield bonus", "Full API access"],
                  popular: false,
                },
              ].map((plan) => (
                <div
                  key={plan.tier}
                  className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    subscriptionForm.watch("tier") === plan.tier
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }`}
                  onClick={() => subscriptionForm.setValue("tier", plan.tier as any)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                    <div className="text-2xl font-bold text-cyan-400 mb-2">{plan.price}</div>
                    <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" onClick={prevStep} variant="outline" className="border-slate-600 text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => handleStepSubmit(subscriptionForm.getValues())} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to GuardianChain! 🎉</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Your account has been successfully set up. You're now ready to start preserving truth,
                earning rewards, and participating in the future of decentralized verification.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Create Your First Capsule</h3>
                <p className="text-sm text-slate-400">Start preserving important truths</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Wallet className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Connect Your Wallet</h3>
                <p className="text-sm text-slate-400">Enable Web3 features and earn GTT</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Globe2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Explore the Community</h3>
                <p className="text-sm text-slate-400">Discover and verify content from others</p>
              </div>
            </div>

            <Button 
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
              disabled={completeOnboardingMutation.isPending}
            >
              {completeOnboardingMutation.isPending ? "Setting up..." : "Enter GuardianChain"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-slate-300">Step content coming soon...</p>
            <div className="flex justify-between mt-6">
              <Button type="button" onClick={prevStep} variant="outline" className="border-slate-600 text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={nextStep} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">GuardianChain Setup</h1>
          </div>
          <div className="max-w-md mx-auto bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-400 mt-2">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}: {step.title}
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {ONBOARDING_STEPS.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={stepItem.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                    isCurrent
                      ? "bg-cyan-500/20 border border-cyan-500/50"
                      : isCompleted
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-slate-800 border border-slate-700"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? "text-cyan-400"
                        : isCompleted
                        ? "text-green-400"
                        : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isCurrent
                        ? "text-cyan-300"
                        : isCompleted
                        ? "text-green-300"
                        : "text-slate-400"
                    }`}
                  >
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <step.icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white text-xl">{step.title}</CardTitle>
            <CardDescription className="text-slate-300">{step.description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}