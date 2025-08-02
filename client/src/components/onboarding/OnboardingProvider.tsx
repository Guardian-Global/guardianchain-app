import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTierContext } from "@/context/TierContext";
import InteractiveTooltip, { useTooltipTour } from "./InteractiveTooltip";
import OnboardingTrigger from "./OnboardingTrigger";
import { useToast } from "@/hooks/use-toast";

interface OnboardingContextType {
  showOnboarding: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  isOnboardingCompleted: boolean;
  startFeatureTour: (tourName: string) => void;
  onboardingProgress: number;
}

const OnboardingContext = createContext<OnboardingContextType>({
  showOnboarding: false,
  startOnboarding: () => {},
  completeOnboarding: () => {},
  skipOnboarding: () => {},
  isOnboardingCompleted: false,
  startFeatureTour: () => {},
  onboardingProgress: 0,
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export default function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { userRole } = useTierContext();
  const { toast } = useToast();
  const { isActive, currentTour, startTour, endTour } = useTooltipTour();
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Main onboarding tour steps
  const mainOnboardingSteps = [
    {
      id: "welcome",
      title: "Welcome to GUARDIANCHAIN! 🎉",
      content: "You're about to discover the future of truth verification. Let's start with a quick tour to get you oriented.",
      target: "nav",
      position: "bottom" as const,
      reward: 5,
    },
    {
      id: "navigation",
      title: "Navigate the Platform",
      content: "Use this navigation bar to access all platform features. The dropdown menus organize features by category.",
      target: "nav",
      position: "bottom" as const,
      reward: 5,
    },
    {
      id: "create-capsule",
      title: "Create Truth Capsules",
      content: "This is where you'll share your truth with the world. Click here to create your first verified content.",
      target: "a[href='/create-capsule']",
      position: "bottom" as const,
      action: {
        text: "Create Your First Capsule",
        onClick: () => window.location.href = "/create-capsule"
      },
      reward: 10,
    },
    {
      id: "profile",
      title: "Your Profile Dashboard",
      content: "Access your profile, earnings, and personal settings. Track your reputation and GTT token balance here.",
      target: "a[href='/profile']",
      position: "bottom" as const,
      reward: 5,
    },
    {
      id: "tier-display",
      title: "Your Current Tier",
      content: "This shows your current membership tier. Upgrade to Pro to unlock premium features and earn more GTT tokens.",
      target: "[data-testid='tier-badge']",
      position: "bottom" as const,
      reward: 5,
    },
    {
      id: "wallet-connect",
      title: "Connect Your Wallet",
      content: "Connect your crypto wallet to receive GTT token rewards and participate in governance decisions.",
      target: "[data-testid='wallet-connect']",
      position: "bottom" as const,
      action: {
        text: "Connect Wallet",
        onClick: () => {
          // Trigger wallet connection
          const walletButton = document.querySelector("[data-testid='wallet-connect']") as HTMLElement;
          walletButton?.click();
        }
      },
      reward: 15,
    },
  ];

  // Feature-specific tour steps
  const featureTours = {
    capsuleCreation: [
      {
        id: "capsule-title",
        title: "Truth Capsule Title",
        content: "Give your truth capsule a compelling title that accurately represents your content.",
        target: "input[placeholder*='title']",
        position: "top" as const,
      },
      {
        id: "capsule-content",
        title: "Share Your Truth",
        content: "This is where you'll add your verified content. Be detailed and provide evidence to support your claims.",
        target: "textarea",
        position: "top" as const,
      },
      {
        id: "privacy-settings",
        title: "Privacy Controls",
        content: "Choose who can see your content and set viewing costs if desired. Public content gets more visibility.",
        target: "[data-testid='privacy-controls']",
        position: "left" as const,
      },
    ],
    analytics: [
      {
        id: "analytics-overview",
        title: "Analytics Dashboard",
        content: "Track your truth capsules' performance, engagement metrics, and earnings from verification rewards.",
        target: "[data-testid='analytics-overview']",
        position: "center" as const,
      },
      {
        id: "performance-metrics",
        title: "Performance Metrics",
        content: "See how your content is performing with views, verifications, and truth scores.",
        target: "[data-testid='performance-metrics']",
        position: "top" as const,
      },
    ],
  };

  // Check if user should see onboarding
  useEffect(() => {
    if (!isAuthenticated) return;

    const hasSeenOnboarding = localStorage.getItem(`onboarding-completed-${user?.id || 'guest'}`);
    const shouldShowOnboarding = !hasSeenOnboarding && userRole === "guest";
    
    setIsOnboardingCompleted(!!hasSeenOnboarding);
    setShowOnboarding(shouldShowOnboarding);

    // Auto-start onboarding for new users
    if (shouldShowOnboarding) {
      setTimeout(() => {
        startOnboarding();
      }, 2000); // Delay to let the page load
    }
  }, [isAuthenticated, user, userRole]);

  const startOnboarding = () => {
    setShowOnboarding(true);
    startTour(mainOnboardingSteps);
    
    toast({
      title: "🚀 Welcome aboard!",
      description: "Let's take a quick tour to get you started.",
    });
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setIsOnboardingCompleted(true);
    setOnboardingProgress(100);
    
    localStorage.setItem(`onboarding-completed-${user?.id || 'guest'}`, "true");
    
    toast({
      title: "🎉 Onboarding Complete!",
      description: "You're ready to start verifying truth on GUARDIANCHAIN. Welcome to the community!",
    });
    
    endTour();
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(`onboarding-completed-${user?.id || 'guest'}`, "true");
    endTour();
    
    toast({
      title: "Onboarding Skipped",
      description: "You can restart the tour anytime from your profile settings.",
    });
  };

  const startFeatureTour = (tourName: string) => {
    const tour = featureTours[tourName as keyof typeof featureTours];
    if (tour) {
      startTour(tour);
    }
  };

  // Update progress based on completed steps
  useEffect(() => {
    const completedSteps = localStorage.getItem(`onboarding-progress-${user?.id || 'guest'}`);
    if (completedSteps) {
      const progress = JSON.parse(completedSteps);
      setOnboardingProgress((progress.length / mainOnboardingSteps.length) * 100);
    }
  }, [user, mainOnboardingSteps.length]);

  const contextValue: OnboardingContextType = {
    showOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    isOnboardingCompleted,
    startFeatureTour,
    onboardingProgress,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      
      {/* Interactive Tooltip Component */}
      <InteractiveTooltip
        steps={currentTour}
        isActive={isActive}
        onComplete={completeOnboarding}
        onClose={skipOnboarding}
      />
      
      {/* Onboarding Trigger for new users */}
      <OnboardingTrigger />
    </OnboardingContext.Provider>
  );
}