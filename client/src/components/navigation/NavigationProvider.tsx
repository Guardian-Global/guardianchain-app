import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import WalkthroughOverlay from "./WalkthroughOverlay";

interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  action?: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface NavigationContextType {
  startWalkthrough: (path: string) => void;
  isWalkthroughActive: boolean;
  currentWalkthroughPath: string | null;
  markStepComplete: (stepId: string) => void;
  completedSteps: string[];
  showTooltip: (target: string, content: string) => void;
  hideTooltip: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

const walkthroughData: Record<
  string,
  { title: string; description: string; steps: WalkthroughStep[] }
> = {
  "/create": {
    title: "Create Truth Capsule",
    description: "Learn how to preserve your truth and earn GTT rewards",
    steps: [
      {
        target: "capsule-type-selector",
        title: "Choose Your Capsule Type",
        description:
          "Select the type of truth you want to preserve. Each type has unique properties and yield potential.",
        action: "Select a capsule type to continue",
        position: "bottom",
      },
      {
        target: "content-editor",
        title: "Share Your Truth",
        description:
          "Write your story, testimony, or memory. Our AI will help optimize it for maximum impact.",
        action: "Add your content",
        position: "top",
      },
      {
        target: "ai-analysis-button",
        title: "AI Enhancement",
        description:
          "Let our AI analyze your content for emotional resonance and truth verification.",
        action: 'Click "Analyze with AI"',
        position: "left",
      },
      {
        target: "grief-tier-display",
        title: "Understand Grief Scoring",
        description:
          "Your content receives a grief tier that determines its yield potential. Higher tiers earn more GTT.",
        action: "Review your grief tier",
        position: "right",
      },
      {
        target: "mint-nft-button",
        title: "Mint Your NFT",
        description:
          "Transform your truth into a valuable NFT with yield-generating capabilities.",
        action: 'Click "Mint NFT Capsule"',
        position: "bottom",
      },
    ],
  },
  "/eternal-contracts": {
    title: "Eternal Contracts",
    description: "Create immutable declarations that last forever",
    steps: [
      {
        target: "contract-type-selector",
        title: "Choose Contract Type",
        description:
          "Select the type of eternal contract. Digital wills, testimonies, and declarations each serve different purposes.",
        action: "Select a contract type",
        position: "bottom",
      },
      {
        target: "contract-editor",
        title: "Write Your Declaration",
        description:
          "Craft your eternal message. This content will be permanently stored on the blockchain.",
        action: "Write your contract content",
        position: "top",
      },
      {
        target: "beneficiary-settings",
        title: "Set Beneficiaries",
        description:
          "Choose who can access your contract and when it should be unlocked.",
        action: "Configure access settings",
        position: "right",
      },
      {
        target: "verification-panel",
        title: "Verify & Seal",
        description:
          "Use our verification tools to ensure your contract meets eternal standards.",
        action: "Run verification check",
        position: "left",
      },
      {
        target: "seal-contract-button",
        title: "Seal Forever",
        description:
          "Once sealed, your contract becomes immutable and permanently stored on-chain.",
        action: 'Click "Seal Contract"',
        position: "bottom",
      },
    ],
  },
  "/dashboard/yield": {
    title: "Yield Dashboard",
    description: "Maximize your GTT earnings and track performance",
    steps: [
      {
        target: "yield-overview-cards",
        title: "Your Earning Overview",
        description:
          "Track your total GTT earnings, active yield, and performance metrics across all capsules.",
        action: "Review your earnings",
        position: "bottom",
      },
      {
        target: "performance-chart",
        title: "Performance Analytics",
        description:
          "Understand which capsules generate the most value and engagement over time.",
        action: "Analyze your performance",
        position: "top",
      },
      {
        target: "staking-panel",
        title: "Stake for Higher Yields",
        description:
          "Stake your GTT tokens for enhanced returns and voting power in DAO governance.",
        action: "Explore staking options",
        position: "right",
      },
      {
        target: "yield-calculator",
        title: "Estimate Future Earnings",
        description:
          "Use our calculator to project earnings based on different capsule types and staking strategies.",
        action: "Try the calculator",
        position: "left",
      },
    ],
  },
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export default function NavigationProvider({
  children,
}: NavigationProviderProps) {
  const [location] = useLocation();
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [currentWalkthroughPath, setCurrentWalkthroughPath] = useState<
    string | null
  >(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [tooltipState, setTooltipState] = useState<{
    target: string;
    content: string;
  } | null>(null);

  // Auto-start walkthrough for specific paths
  useEffect(() => {
    if (
      walkthroughData[location] &&
      !completedSteps.includes(`walkthrough-${location}`)
    ) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        startWalkthrough(location);
      }, 1000);
    }
  }, [location]);

  // Load completed steps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("guardianchain-completed-steps");
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, []);

  // Save completed steps to localStorage
  useEffect(() => {
    localStorage.setItem(
      "guardianchain-completed-steps",
      JSON.stringify(completedSteps),
    );
  }, [completedSteps]);

  const startWalkthrough = (path: string) => {
    if (walkthroughData[path]) {
      setCurrentWalkthroughPath(path);
      setCurrentStep(0);
      setIsWalkthroughActive(true);
    }
  };

  const nextStep = () => {
    const walkthrough = currentWalkthroughPath
      ? walkthroughData[currentWalkthroughPath]
      : null;
    if (walkthrough && currentStep < walkthrough.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeWalkthrough = () => {
    if (currentWalkthroughPath) {
      markStepComplete(`walkthrough-${currentWalkthroughPath}`);
    }
    setIsWalkthroughActive(false);
    setCurrentWalkthroughPath(null);
    setCurrentStep(0);
  };

  const skipWalkthrough = () => {
    if (currentWalkthroughPath) {
      markStepComplete(`walkthrough-${currentWalkthroughPath}`);
    }
    setIsWalkthroughActive(false);
    setCurrentWalkthroughPath(null);
    setCurrentStep(0);
  };

  const markStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  };

  const showTooltip = (target: string, content: string) => {
    setTooltipState({ target, content });
  };

  const hideTooltip = () => {
    setTooltipState(null);
  };

  const currentWalkthrough = currentWalkthroughPath
    ? walkthroughData[currentWalkthroughPath]
    : null;

  return (
    <NavigationContext.Provider
      value={{
        startWalkthrough,
        isWalkthroughActive,
        currentWalkthroughPath,
        markStepComplete,
        completedSteps,
        showTooltip,
        hideTooltip,
      }}
    >
      {children}

      {/* Walkthrough Overlay */}
      {isWalkthroughActive && currentWalkthrough && (
        <WalkthroughOverlay
          isActive={isWalkthroughActive}
          steps={currentWalkthrough.steps}
          currentStep={currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onComplete={completeWalkthrough}
          onSkip={skipWalkthrough}
          title={currentWalkthrough.title}
          description={currentWalkthrough.description}
        />
      )}
    </NavigationContext.Provider>
  );
}
