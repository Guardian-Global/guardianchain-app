import React, { useEffect, useState } from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import AIAssistedOnboarding from "./AIAssistedOnboarding";

interface OnboardingCheckerProps {
  children: React.ReactNode;
}

export const OnboardingChecker: React.FC<OnboardingCheckerProps> = ({ children }) => {
  const { user, isAuthenticated } = useUnifiedAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding after authentication
    if (isAuthenticated && user) {
      // Show onboarding if:
      // 1. User hasn't completed onboarding
      // 2. User is missing critical profile information
      const needsOnboarding = 
        !(user as any).onboardingCompleted || 
        !user.firstName || 
        !user.lastName ||
        (!user.username && !user.firstName);

      setShowOnboarding(needsOnboarding);
    }
  }, [isAuthenticated, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show onboarding overlay if needed
  if (showOnboarding) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto">
        <AIAssistedOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Show normal app content
  return <>{children}</>;
};

export default OnboardingChecker;