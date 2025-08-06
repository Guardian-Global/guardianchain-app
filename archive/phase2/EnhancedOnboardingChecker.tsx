import React, { useEffect, useState } from "react";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import EnhancedOnboardingFlow from "./EnhancedOnboardingFlow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight, User } from "lucide-react";

interface EnhancedOnboardingCheckerProps {
  children?: React.ReactNode;
}

export default function EnhancedOnboardingChecker({ children }: EnhancedOnboardingCheckerProps) {
  const { user, isAuthenticated, isLoading, needsOnboarding } = useEnhancedAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && needsOnboarding) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [isAuthenticated, needsOnboarding]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-300">Checking authentication status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show authentication required if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-300">
              Please sign in to access GuardianChain's enhanced features and complete your onboarding.
            </p>
            <Button 
              onClick={() => window.location.href = "/api/auth/login"}
              className="bg-cyan-500 hover:bg-cyan-600 text-white w-full"
            >
              Sign In to GuardianChain
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show onboarding complete if user doesn't need onboarding
  if (!needsOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Welcome Back, Guardian!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-slate-300 text-lg">
              Your onboarding is complete. You're ready to explore the full GuardianChain experience.
            </p>
            
            {/* User Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <User className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Profile</h3>
                <p className="text-sm text-slate-400">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Tier</h3>
                <p className="text-sm text-slate-400">{user?.tier || 'Explorer'}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Status</h3>
                <p className="text-sm text-slate-400">Fully Activated</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = "/dashboard"}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                onClick={() => window.location.href = "/profile"}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the enhanced onboarding flow if needed
  if (showOnboarding) {
    return <EnhancedOnboardingFlow />;
  }

  // Render children if onboarding is not needed or already shown
  return <>{children}</>;
}