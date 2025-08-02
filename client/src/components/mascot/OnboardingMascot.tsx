import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Heart,
  Zap,
  Star,
  Shield,
  Coins,
  Users,
  Target,
  CheckCircle2,
  Play,
  Pause,
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MascotStep {
  id: string;
  title: string;
  description: string;
  route?: string;
  action?: string;
  icon: React.ReactNode;
  personality: "excited" | "curious" | "encouraging" | "proud" | "playful";
  tips?: string[];
}

const ONBOARDING_STEPS: MascotStep[] = [
  {
    id: "welcome",
    title: "Welcome to GUARDIANCHAIN! 🎉",
    description:
      "Hi there! I'm Guardian, your friendly guide! I'm here to show you around this amazing truth verification platform. Ready for an adventure?",
    personality: "excited",
    icon: <Sparkles className="h-6 w-6" />,
    tips: [
      "I'll be with you every step of the way!",
      "Feel free to ask questions anytime!",
      "Let's make verifying truth fun!",
    ],
  },
  {
    id: "profile",
    title: "Let's Set Up Your Profile! ✨",
    description:
      "First things first - let's create your digital identity! Your profile is how other truth seekers will recognize you.",
    route: "/profile",
    action: "Complete your profile setup",
    personality: "encouraging",
    icon: <Users className="h-6 w-6" />,
    tips: [
      "Add a profile picture if you like!",
      "Choose a tier that fits your needs",
      "Your reputation grows as you verify truth!",
    ],
  },
  {
    id: "capsules",
    title: "Create Your First Truth Capsule! 🚀",
    description:
      "This is where the magic happens! Truth capsules are how you submit content for verification. Think of them as digital truth containers!",
    route: "/create-capsule",
    action: "Create your first capsule",
    personality: "excited",
    icon: <Shield className="h-6 w-6" />,
    tips: [
      "Start with something simple",
      "Add evidence to strengthen your claim",
      "The community will help verify it!",
    ],
  },
  {
    id: "verify",
    title: "Help Verify Other Capsules! 🔍",
    description:
      "Now you get to be a truth detective! Review other people's submissions and help build our verified knowledge base.",
    route: "/verify",
    action: "Verify some capsules",
    personality: "curious",
    icon: <Target className="h-6 w-6" />,
    tips: [
      "Look for evidence carefully",
      "Ask questions if something's unclear",
      "Your opinion matters to the community!",
    ],
  },
  {
    id: "earn",
    title: "Earn GTT Tokens! 💰",
    description:
      "The best part? You earn GTT tokens for contributing! Create verified capsules, help verify others, and watch your tokens grow!",
    route: "/wallet",
    action: "Check your wallet",
    personality: "playful",
    icon: <Coins className="h-6 w-6" />,
    tips: [
      "Tokens reward good contributions",
      "Quality over quantity always wins",
      "Stake tokens to unlock premium features!",
    ],
  },
  {
    id: "explore",
    title: "Explore Advanced Features! ⚡",
    description:
      "Ready to level up? Discover AI assistance, analytics, viral tools, and so much more. The platform grows with you!",
    route: "/advanced-features",
    action: "Explore advanced tools",
    personality: "excited",
    icon: <Zap className="h-6 w-6" />,
    tips: [
      "AI can help optimize your content",
      "Analytics show your impact",
      "Viral tools protect your ideas!",
    ],
  },
  {
    id: "complete",
    title: "You're All Set! 🎊",
    description:
      "Congratulations! You're now ready to be a truth guardian. Remember, every verified fact makes the world a little more trustworthy!",
    personality: "proud",
    icon: <CheckCircle2 className="h-6 w-6" />,
    tips: [
      "You can always revisit this tour",
      "Help others get started too",
      "Welcome to the GUARDIANCHAIN family!",
    ],
  },
];

interface OnboardingMascotProps {
  isVisible?: boolean;
  onComplete?: () => void;
  onDismiss?: () => void;
  autoStart?: boolean;
}

export default function OnboardingMascot({
  isVisible = false,
  onComplete,
  onDismiss,
  autoStart = false,
}: OnboardingMascotProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);
  const [location, setLocation] = useLocation();
  const [mascotMood, setMascotMood] = useState<
    "happy" | "excited" | "thinking" | "celebrating"
  >("happy");

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  useEffect(() => {
    if (autoStart && !localStorage.getItem("onboarding_completed")) {
      setIsOpen(true);
    }
  }, [autoStart]);

  useEffect(() => {
    // Animate mascot based on current step personality
    const personality = currentStepData?.personality;
    switch (personality) {
      case "excited":
        setMascotMood("excited");
        break;
      case "proud":
        setMascotMood("celebrating");
        break;
      case "curious":
        setMascotMood("thinking");
        break;
      default:
        setMascotMood("happy");
    }
  }, [currentStep, currentStepData]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleAction = () => {
    if (currentStepData.route) {
      setLocation(currentStepData.route);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("onboarding_completed_date", new Date().toISOString());
    setIsOpen(false);
    onComplete?.();
  };

  const dismissMascot = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="bg-gradient-to-br from-purple-50 to-green-50 dark:from-purple-950/50 dark:to-green-950/50 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
        <CardContent className="p-6">
          {/* Mascot Avatar */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={cn(
                "relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-green-400 flex items-center justify-center shadow-lg transition-all duration-300",
                mascotMood === "excited" && "animate-bounce",
                mascotMood === "celebrating" && "animate-pulse",
                mascotMood === "thinking" && "animate-pulse",
                isAnimating && "scale-110",
              )}
            >
              <Shield className="h-8 w-8 text-white" />
              {mascotMood === "excited" && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-spin" />
                </div>
              )}
              {mascotMood === "celebrating" && (
                <div className="absolute -top-2 -right-2">
                  <Star className="h-5 w-5 text-yellow-400 animate-ping" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  Guardian Assistant
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissMascot}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </span>
                <Progress value={progress} className="flex-1 h-2" />
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div
            className={cn(
              "transition-all duration-200",
              isAnimating && "opacity-50 scale-95",
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              {currentStepData.icon}
              <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {currentStepData.description}
            </p>

            {currentStepData.tips && (
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 mb-4">
                <h4 className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  Guardian's Tips:
                </h4>
                <ul className="text-xs space-y-1">
                  {currentStepData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}

              {currentStepData.route && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAction}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {currentStepData.action}
                </Button>
              )}

              <Button
                onClick={handleNext}
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for triggering the mascot
export function MascotTrigger({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [showMascot, setShowMascot] = useState(false);

  const startTour = () => {
    localStorage.removeItem("onboarding_completed");
    setShowMascot(true);
  };

  return (
    <>
      <Button
        onClick={startTour}
        variant="outline"
        className={cn("flex items-center gap-2", className)}
      >
        <Sparkles className="h-4 w-4" />
        {children || "Start Tour"}
      </Button>
      <OnboardingMascot
        isVisible={showMascot}
        onComplete={() => setShowMascot(false)}
        onDismiss={() => setShowMascot(false)}
      />
    </>
  );
}
