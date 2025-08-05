import React from "react";
import EnhancedOnboardingChecker from "@/components/onboarding/EnhancedOnboardingChecker";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle, User, Settings, Crown, Wallet } from "lucide-react";

export default function EnhancedOnboardingPage() {
  const { user, isAuthenticated, needsOnboarding } = useEnhancedAuth();

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
              Please log in to access the GuardianChain onboarding experience.
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

  if (!needsOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Onboarding Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-slate-300 text-lg">
              Welcome back, {user?.firstName || 'Guardian'}! Your account is fully set up and ready to use.
            </p>
            
            {/* User Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <User className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Profile</h3>
                <p className="text-sm text-slate-400">Complete and verified</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Tier</h3>
                <p className="text-sm text-slate-400">{user?.tier || 'Explorer'}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Settings className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Preferences</h3>
                <p className="text-sm text-slate-400">Configured</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Wallet className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Wallet</h3>
                <p className="text-sm text-slate-400">
                  {user?.isWalletVerified ? "Connected" : "Ready to connect"}
                </p>
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

  // Show the enhanced onboarding flow
  return (
    <EnhancedOnboardingChecker>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* This will be replaced by the onboarding flow if needed */}
      </div>
    </EnhancedOnboardingChecker>
  );
}