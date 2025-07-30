import React, { useEffect } from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useLocation } from "wouter";

interface OnboardingCheckerProps {
  children: React.ReactNode;
}

export default function OnboardingChecker({ children }: OnboardingCheckerProps) {
  const { user, isAuthenticated } = useUnifiedAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Skip onboarding for master admin and founder - they have full access
      if (user.role === "MASTER_ADMIN" || user.role === "FOUNDER") {
        return;
      }

      // Check if user needs onboarding
      const needsOnboarding = !user.emailVerified || 
        !user.firstName || 
        !user.lastName;

      // Redirect to onboarding if needed and not already on onboarding page
      if (needsOnboarding && !location.startsWith("/onboarding") && !location.startsWith("/login")) {
        setLocation("/onboarding");
      }
    }
  }, [isAuthenticated, user, location, setLocation]);

  return <>{children}</>;
}