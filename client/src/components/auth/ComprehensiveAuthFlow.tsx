import React, { useEffect, useState } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import GuardianSetupFlow from "../onboarding/GuardianSetupFlow";

export default function ComprehensiveAuthFlow() {
  const { 
    user, 
    isAuthenticated, 
    needsOnboarding
  } = useEnhancedAuth();
  
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    console.log("🔐 ComprehensiveAuthFlow: Effect triggered", {
      isAuthenticated,
      needsOnboarding,
      user: user?.id,
      onboardingCompleted: user?.onboardingCompleted
    });
    
    if (isAuthenticated && needsOnboarding) {
      console.log("✅ ComprehensiveAuthFlow: Showing onboarding flow");
      setShowFlow(true);
    } else {
      console.log("❌ ComprehensiveAuthFlow: Hiding onboarding flow");
      setShowFlow(false);
    }
  }, [isAuthenticated, needsOnboarding, user]);

  // Show Guardian Setup Flow for new users needing onboarding
  if (showFlow && user && needsOnboarding) {
    return <GuardianSetupFlow />;
  }

  return null;
}