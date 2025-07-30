import React from "react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useLocation } from "wouter";
import EnterpriseOnboarding from "@/components/onboarding/EnterpriseOnboarding";

export default function OnboardingPage() {
  const { user } = useUnifiedAuth();
  const [, setLocation] = useLocation();

  // Redirect completed users to their appropriate dashboard
  const handleOnboardingComplete = () => {
    if (user?.role === "MASTER_ADMIN") {
      setLocation("/master-admin");
    } else if (user?.role === "ADMIN" || user?.role === "FOUNDER") {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
  };

  return <EnterpriseOnboarding />;
}