import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import ComprehensiveOnboardingFlow from "@/components/onboarding/ComprehensiveOnboardingFlow";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    setLocation("/auth/login");
    return null;
  }

  // Redirect to dashboard if onboarding is already completed
  if ((user as any)?.onboardingCompleted) {
    setLocation("/dashboard");
    return null;
  }

  return <ComprehensiveOnboardingFlow />;
}