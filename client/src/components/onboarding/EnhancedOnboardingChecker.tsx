import React, { useEffect, useState } from "react";
import EnhancedOnboardingFlow from "./EnhancedOnboardingFlow";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";

interface EnhancedOnboardingCheckerProps {
  children: React.ReactNode;
}

export default function EnhancedOnboardingChecker({ children }: EnhancedOnboardingCheckerProps) {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    needsOnboarding,
    needsEmailVerification,
    isError 
  } = useEnhancedAuth();
  
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding after authentication
    if (isAuthenticated && user && needsOnboarding) {
      setShowOnboarding(true);
    } else if (isAuthenticated && user && !needsOnboarding) {
      setShowOnboarding(false);
    }
  }, [isAuthenticated, user, needsOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Refresh the page to load the full app with updated user data
    window.location.reload();
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white">GuardianChain</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
            <p className="text-slate-300">Initializing your truth vault...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if authentication failed
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-300">
              There was an issue verifying your identity. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show onboarding overlay if needed
  if (showOnboarding) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto">
        <EnhancedOnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // Show email verification prompt if needed
  if (needsEmailVerification) {
    return (
      <div className="fixed inset-0 bg-slate-900/95 z-40 flex items-center justify-center p-4">
        <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white">Email Verification Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-300">
              Please check your email and verify your account to continue using GuardianChain.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.href = "/verify-email"}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Verify Email
              </button>
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Skip for Now
              </button>
            </div>
          </CardContent>
        </Card>
        <div className="absolute inset-0 -z-10">
          {children}
        </div>
      </div>
    );
  }

  // Show normal app content
  return <>{children}</>;
}