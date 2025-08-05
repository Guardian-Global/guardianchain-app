import React from "react";
import { useAuth } from "@/hooks/useAuth";
import CompleteAuthFlow from "@/components/auth/CompleteAuthFlow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, CheckCircle } from "lucide-react";

export default function CompleteAuthPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading authentication status...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated and fully onboarded, show success state
  if (isAuthenticated && user?.emailVerified && user?.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to GuardianChain!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              You are successfully authenticated and ready to explore the platform.
            </p>
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </div>
              <div className="text-sm">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="text-sm">
                <strong>Tier:</strong> {user.tier}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">GuardianChain</h1>
          <p className="text-muted-foreground mt-2">
            Secure your truth on the blockchain
          </p>
        </div>
        
        <CompleteAuthFlow 
          onAuthStateChange={(authenticated) => {
            if (authenticated) {
              // Redirect to dashboard or home page
              window.location.href = "/";
            }
          }}
        />
      </div>
    </div>
  );
}