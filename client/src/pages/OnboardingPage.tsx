import React from "react";
import { useLocation } from "wouter";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import EnterpriseOnboarding from "@/components/onboarding/EnterpriseOnboarding";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { user } = useEnhancedAuth();

  // Redirect completed users to their appropriate dashboard
  const handleOnboardingComplete = () => {
    if ((user as any)?.role === "MASTER_ADMIN") {
      setLocation("/master-admin");
    } else if ((user as any)?.role === "ADMIN" || (user as any)?.role === "FOUNDER") {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
  };

  return <EnterpriseOnboarding onComplete={handleOnboardingComplete} />;
}
