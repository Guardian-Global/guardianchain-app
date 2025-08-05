import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  User,
  Shield,
  Wallet,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import ProfileCompletion from "./steps/ProfileCompletion";
import IdentityVerification from "./steps/IdentityVerification";
import WalletConnection from "./steps/WalletConnection";
import GTTPurchase from "./steps/GTTPurchase";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<{
    onComplete: () => void;
    onSkip?: () => void;
  }>;
  required: boolean;
  completed: boolean;
}

interface EnterpriseOnboardingProps {
  onComplete?: () => void;
}

export default function EnterpriseOnboarding({ onComplete }: EnterpriseOnboardingProps) {
  const { toast } = useToast();
  const { user, needsOnboarding } = useEnhancedAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    profileCompleted: false,
    identityVerified: false,
    walletConnected: false,
    gttPurchased: false,
  });

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your personal information and verify your email",
      icon: <User className="h-5 w-5" />,
      component: ProfileCompletion,
      required: true,
      completed: onboardingData.profileCompleted,
    },
    {
      id: "identity",
      title: "Identity Verification",
      description: "Verify your identity to prevent bots and imposters",
      icon: <Shield className="h-5 w-5" />,
      component: IdentityVerification,
      required: true,
      completed: onboardingData.identityVerified,
    },
    {
      id: "wallet",
      title: "Connect Wallet",
      description: "Connect your Web3 wallet for blockchain features",
      icon: <Wallet className="h-5 w-5" />,
      component: WalletConnection,
      required: false,
      completed: onboardingData.walletConnected,
    },
    {
      id: "gtt",
      title: "Purchase GTT Tokens",
      description: "Get GTT tokens to unlock premium features",
      icon: <DollarSign className="h-5 w-5" />,
      component: GTTPurchase,
      required: false,
      completed: onboardingData.gttPurchased,
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepComplete = async (stepId: string) => {
    const newData = { ...onboardingData, [`${stepId}Completed`]: true };
    setOnboardingData(newData);

    // Mark step as completed
    console.log(`Completed onboarding step: ${stepId}`);

    toast({
      title: "Step Completed!",
      description: `${steps.find((s) => s.id === stepId)?.title} has been completed.`,
    });

    // Move to next step if not at the end
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepSkip = (stepId: string) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  // If user doesn't need onboarding, don't show the component
  if (!needsOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Onboarding Complete!
          </h1>
          <p className="text-slate-300 mb-6">
            Your account is fully set up and ready to use.
          </p>
          <Button
            onClick={handleOnboardingComplete}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="text-purple-400">GUARDIANCHAIN</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Complete your enterprise onboarding to unlock the full power of our
            truth verification platform
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Onboarding Progress
            </CardTitle>
            <CardDescription className="text-slate-400">
              Complete all steps to unlock full platform access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Overall Progress</span>
                <span className="text-purple-400 font-semibold">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />

              {/* Step indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      step.completed
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : index === currentStep
                          ? "bg-purple-500/20 border-purple-500 text-purple-400"
                          : "bg-slate-700/50 border-slate-600 text-slate-400"
                    }`}
                    onClick={() => goToStep(index)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {step.icon}
                      {step.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{step.title}</p>
                    {step.completed && (
                      <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  {currentStepData.icon}
                  {currentStepData.title}
                  {currentStepData.required && (
                    <Badge variant="destructive" className="ml-2">
                      Required
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  {currentStepData.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-slate-300">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {currentStepData.required && (
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <p className="text-yellow-200 text-sm">
                  This step is required to continue using the platform
                </p>
              </div>
            )}

            <CurrentStepComponent
              onComplete={() => handleStepComplete(currentStepData.id)}
              onSkip={
                !currentStepData.required
                  ? () => handleStepSkip(currentStepData.id)
                  : undefined
              }
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Previous Step
          </Button>

          <div className="space-x-3">
            {!currentStepData.required && (
              <Button
                variant="ghost"
                onClick={() => handleStepSkip(currentStepData.id)}
                className="text-slate-400 hover:text-white"
              >
                Skip for Now
              </Button>
            )}

            <Button
              onClick={() =>
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
              }
              disabled={currentStep === steps.length - 1}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
